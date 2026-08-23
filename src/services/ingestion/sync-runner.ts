// Global Ingestion Registry & Multi-Source Sync Engine
import { JobSourceAdapter, IngestionResult, IngestionFilterOptions, ConnectorMetadata } from './types';
import { GreenhouseAdapter } from './greenhouse';
import { LeverAdapter } from './lever';
import { AshbyAdapter } from './ashby';
import { WorkableAdapter } from './workable';
import { WellfoundAdapter } from './wellfound';
import { InternshalaAdapter } from './internshala';
import { HandshakeAdapter } from './handshake';
import { IndeedAdapter } from './indeed';
import { LinkedInAdapter } from './linkedin';
import { CareerPagesAdapter } from './career-pages';
import { JobDeduplicator } from './deduplicator';
import { db, StoredJobPosting } from '@/lib/db';
import { JobPlatform, NormalizedJobPosting } from '@/types';

export class IngestionService {
  private adapters: Map<JobPlatform, JobSourceAdapter> = new Map();

  constructor() {
    this.registerAdapter(new GreenhouseAdapter());
    this.registerAdapter(new LeverAdapter());
    this.registerAdapter(new AshbyAdapter());
    this.registerAdapter(new WorkableAdapter());
    this.registerAdapter(new WellfoundAdapter());
    this.registerAdapter(new InternshalaAdapter());
    this.registerAdapter(new HandshakeAdapter());
    this.registerAdapter(new IndeedAdapter());
    this.registerAdapter(new LinkedInAdapter());
    this.registerAdapter(new CareerPagesAdapter());
  }

  public registerAdapter(adapter: JobSourceAdapter) {
    this.adapters.set(adapter.platform, adapter);
  }

  public getAdapter(platform: JobPlatform): JobSourceAdapter | undefined {
    return this.adapters.get(platform);
  }

  public getSupportedPlatforms(): { platform: JobPlatform; name: string; metadata?: ConnectorMetadata }[] {
    return Array.from(this.adapters.values()).map(a => ({
      platform: a.platform,
      name: a.name,
      metadata: (a as any).metadata
    }));
  }

  /**
   * Syncs jobs across ALL registered platforms simultaneously with error isolation and deduplication
   */
  public async syncAllSources(
    searchTarget: string = 'tech',
    tenantId: string = 'tenant_prod_enterprise_1',
    options?: IngestionFilterOptions
  ): Promise<{ totalSynced: number; platformResults: IngestionResult[] }> {
    const promises = Array.from(this.adapters.keys()).map(platform =>
      this.syncCompanyJobs(platform, searchTarget, tenantId, options).catch(err => ({
        sourcePlatform: platform,
        company: searchTarget,
        totalFetched: 0,
        newJobsCount: 0,
        updatedJobsCount: 0,
        skippedDuplicatesCount: 0,
        jobs: [],
        errors: [err.message],
        syncedAt: new Date()
      }))
    );

    const results = await Promise.all(promises);
    const totalSynced = results.reduce((sum, r) => sum + r.newJobsCount + r.updatedJobsCount, 0);

    return {
      totalSynced,
      platformResults: results
    };
  }

  /**
   * Runs sync for a specific target company / query and platform
   */
  public async syncCompanyJobs(
    platform: JobPlatform,
    companySlug: string,
    tenantId: string = 'tenant_prod_enterprise_1',
    options?: IngestionFilterOptions
  ): Promise<IngestionResult> {
    const adapter = this.getAdapter(platform);
    if (!adapter) {
      throw new Error(`Unsupported platform adapter: ${platform}`);
    }

    const startTime = new Date();
    let normalizedList: NormalizedJobPosting[] = [];
    
    try {
      normalizedList = await adapter.fetchJobs(companySlug, options);
    } catch (err: any) {
      console.warn(`[IngestionService] Connector error for ${platform}:`, err.message);
      return {
        sourcePlatform: platform,
        company: companySlug,
        totalFetched: 0,
        newJobsCount: 0,
        updatedJobsCount: 0,
        skippedDuplicatesCount: 0,
        jobs: [],
        errors: [err.message],
        syncedAt: startTime
      };
    }
    
    let newJobsCount = 0;
    let updatedJobsCount = 0;
    let skippedDuplicatesCount = 0;

    for (const job of normalizedList) {
      const fingerprint = JobDeduplicator.generateFingerprint(job);
      const crossSourceKey = JobDeduplicator.generateCrossSourceKey(job);

      // 1. Exact platform duplicate check
      const exactIdx = db.jobPostings.findIndex(
        p => p.fingerprint === fingerprint || (p.sourcePlatform === job.sourcePlatform && p.sourceJobId === job.sourceJobId)
      );

      // 2. Cross-platform semantic match check (e.g. same job on LinkedIn + Indeed + Greenhouse)
      const crossIdx = db.jobPostings.findIndex(
        p => JobDeduplicator.generateCrossSourceKey(p) === crossSourceKey && p.company.toLowerCase() === job.company.toLowerCase()
      );

      if (exactIdx >= 0) {
        const existing = db.jobPostings[exactIdx];
        if (new Date(job.updatedAt).getTime() > new Date(existing.updatedAt).getTime()) {
          const merged = JobDeduplicator.mergePostings(existing, job);
          db.jobPostings[exactIdx] = {
            ...merged,
            id: existing.id,
            tenantId,
            fingerprint,
            lastSyncedAt: new Date().toISOString()
          };
          updatedJobsCount++;
        } else {
          skippedDuplicatesCount++;
        }
      } else if (crossIdx >= 0) {
        // Cross-platform merge!
        const existing = db.jobPostings[crossIdx];
        const merged = JobDeduplicator.mergePostings(existing, job);
        db.jobPostings[crossIdx] = {
          ...merged,
          id: existing.id,
          tenantId,
          fingerprint: existing.fingerprint,
          lastSyncedAt: new Date().toISOString()
        };
        updatedJobsCount++;
      } else {
        // Insert new job posting
        const newPosting: StoredJobPosting = {
          ...job,
          id: `job_${platform.toLowerCase()}_${job.company.toLowerCase().replace(/[^a-z0-9]/g, '')}_${job.sourceJobId}`,
          tenantId,
          fingerprint,
          foundOnSources: job.foundOnSources || [job.sourcePlatform],
          lastSyncedAt: new Date().toISOString()
        };
        db.jobPostings.unshift(newPosting);
        newJobsCount++;
      }
    }

    // Record audit log
    db.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      tenantId,
      action: 'JOB_INGESTION_SYNC',
      resourceType: 'JobSource',
      details: {
        platform,
        companySlug,
        totalFetched: normalizedList.length,
        newJobsCount,
        updatedJobsCount,
        skippedDuplicatesCount
      },
      createdAt: new Date().toISOString()
    });

    return {
      sourcePlatform: platform,
      company: companySlug,
      totalFetched: normalizedList.length,
      newJobsCount,
      updatedJobsCount,
      skippedDuplicatesCount,
      jobs: normalizedList,
      syncedAt: startTime
    };
  }
}

export const ingestionService = new IngestionService();
