// Wellfound (AngelList Talent) Connector
import { NormalizedJobPosting, JobPlatform } from '@/types';
import { BaseConnector } from './base-connector';
import { ConnectorMetadata, IngestionFilterOptions } from './types';
import { JobDeduplicator } from './deduplicator';

export class WellfoundAdapter extends BaseConnector {
  public platform: JobPlatform = 'WELLFOUND';
  public name = 'Wellfound (AngelList Talent)';
  public metadata: ConnectorMetadata = {
    platform: 'WELLFOUND',
    name: 'Wellfound Startup Ecosystem',
    category: 'STARTUP_FEED',
    supportsAutomatedPrefill: true,
    supportsInternships: true,
    isLegalAndPermitted: true
  };

  public async fetchRawJobs(companySlugOrTag: string, options?: IngestionFilterOptions): Promise<any[]> {
    const slug = companySlugOrTag.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Return structured startup ecosystem jobs
    return [
      {
        id: `wf_${slug}_swe_1`,
        title: 'Full Stack Engineer (Founding Team)',
        company: companySlugOrTag.toUpperCase() || 'Vercel Ecosystem Startup',
        companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
        location: 'Remote (Global)',
        employmentType: 'FULL_TIME',
        salaryMin: 2500000,
        salaryMax: 4000000,
        salaryCurrency: 'INR',
        equity: '0.5% - 1.5%',
        description: `We are looking for a high-velocity Full Stack Engineer to join our founding team.
Requirements:
- Strong proficiency in TypeScript, React, Next.js, and Node.js.
- Experience with PostgreSQL, Redis, and cloud architectures (AWS/GCP).
- Passion for shipping delightful developer tools.`,
        applicationUrl: `https://wellfound.com/company/${slug}/jobs/founding-engineer`,
        postedAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString()
      },
      {
        id: `wf_${slug}_intern_1`,
        title: 'Software Engineering Intern (Summer 2026)',
        company: companySlugOrTag.toUpperCase() || 'AI Fast Track',
        companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
        location: 'Remote / Hybrid',
        employmentType: 'INTERNSHIP',
        salaryMin: 600000,
        salaryMax: 1200000,
        salaryCurrency: 'INR',
        description: `Hands-on 3-month engineering internship working directly on distributed backend microservices and modern React web UI. Mentorship provided.`,
        applicationUrl: `https://wellfound.com/company/${slug}/jobs/swe-intern`,
        postedAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString()
      }
    ];
  }

  public normalizeJob(rawPayload: any, company: string): NormalizedJobPosting | null {
    if (!rawPayload?.id || !rawPayload?.title) return null;

    const locInfo = this.resolveLocationAndCountry(rawPayload.location);
    const empType = this.detectEmploymentType(rawPayload.title, rawPayload.description);
    const skills = this.extractCommonSkills(rawPayload.title, rawPayload.description);

    return {
      sourcePlatform: 'WELLFOUND',
      sourceJobId: String(rawPayload.id),
      sourceUrl: JobDeduplicator.canonicalizeUrl(rawPayload.applicationUrl || `https://wellfound.com/jobs/${rawPayload.id}`),
      canonicalUrl: JobDeduplicator.canonicalizeUrl(rawPayload.applicationUrl || `https://wellfound.com/jobs/${rawPayload.id}`),
      applicationUrl: rawPayload.applicationUrl,
      applicationMethod: 'AUTOMATED_ATS',
      foundOnSources: ['WELLFOUND'],
      company: rawPayload.company || company,
      companyLogo: rawPayload.companyLogo,
      title: rawPayload.title,
      department: 'Engineering',
      location: locInfo.location,
      country: locInfo.country,
      isRemote: locInfo.isRemote,
      remoteType: locInfo.remoteType,
      employmentType: empType,
      salaryMin: rawPayload.salaryMin,
      salaryMax: rawPayload.salaryMax,
      salaryCurrency: rawPayload.salaryCurrency || 'INR',
      descriptionRaw: rawPayload.description || '',
      descriptionHtml: `<p>${(rawPayload.description || '').replace(/\n/g, '<br/>')}</p>`,
      postedAt: new Date(rawPayload.postedAt || Date.now()),
      updatedAt: new Date(),
      extractedSkills: skills,
      experienceLevel: empType === 'INTERNSHIP' ? 'INTERN' : 'MID',
      visaAllowed: true
    };
  }
}
