// Handshake College & University Internships Connector
import { NormalizedJobPosting, JobPlatform } from '@/types';
import { BaseConnector } from './base-connector';
import { ConnectorMetadata, IngestionFilterOptions } from './types';
import { JobDeduplicator } from './deduplicator';

export class HandshakeAdapter extends BaseConnector {
  public platform: JobPlatform = 'HANDSHAKE';
  public name = 'Handshake';
  public metadata: ConnectorMetadata = {
    platform: 'HANDSHAKE',
    name: 'Handshake Early Talent Network',
    category: 'INTERNSHIP_PORTAL',
    supportsAutomatedPrefill: true,
    supportsInternships: true,
    isLegalAndPermitted: true
  };

  public async fetchRawJobs(universityOrCompany: string, options?: IngestionFilterOptions): Promise<any[]> {
    const slug = universityOrCompany.toLowerCase().replace(/[^a-z0-9]/g, '');

    return [
      {
        id: `handshake_${slug}_sde_intern`,
        title: 'Software Engineer Co-op / Intern (Fall 2026)',
        company: universityOrCompany.toUpperCase() || 'Datadog Early Careers',
        companyLogo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&auto=format&fit=crop&q=80',
        location: 'New York, NY / Remote',
        hourlyRateUSD: 52,
        employmentType: 'INTERNSHIP',
        description: `Join our core infrastructure team as an Engineering Intern.
What you'll do:
- Design and deploy distributed Go and TypeScript microservices.
- Optimize high-throughput event processing pipelines handling billions of metrics.
- Pair with senior staff engineers on architecture and code reviews.`,
        applicationUrl: `https://joinhandshake.com/employers/jobs/${slug}-coop`,
        postedAt: new Date(Date.now() - 3600 * 1000 * 40).toISOString()
      }
    ];
  }

  public normalizeJob(rawPayload: any, company: string): NormalizedJobPosting | null {
    if (!rawPayload?.id || !rawPayload?.title) return null;

    const locInfo = this.resolveLocationAndCountry(rawPayload.location);
    const skills = this.extractCommonSkills(rawPayload.title, rawPayload.description);
    const annualEstUSD = rawPayload.hourlyRateUSD ? rawPayload.hourlyRateUSD * 2000 : 75000;

    return {
      sourcePlatform: 'HANDSHAKE',
      sourceJobId: String(rawPayload.id),
      sourceUrl: JobDeduplicator.canonicalizeUrl(rawPayload.applicationUrl || `https://joinhandshake.com/jobs/${rawPayload.id}`),
      canonicalUrl: JobDeduplicator.canonicalizeUrl(rawPayload.applicationUrl || `https://joinhandshake.com/jobs/${rawPayload.id}`),
      applicationUrl: rawPayload.applicationUrl,
      applicationMethod: 'AUTOMATED_ATS',
      foundOnSources: ['HANDSHAKE'],
      company: rawPayload.company || company,
      companyLogo: rawPayload.companyLogo,
      title: rawPayload.title,
      department: 'Engineering',
      location: locInfo.location,
      country: locInfo.country,
      isRemote: locInfo.isRemote,
      remoteType: locInfo.remoteType,
      employmentType: 'INTERNSHIP',
      salaryMin: 1200000,
      salaryMax: 1800000,
      salaryCurrency: 'INR',
      descriptionRaw: rawPayload.description || '',
      descriptionHtml: `<p>${(rawPayload.description || '').replace(/\n/g, '<br/>')}</p>`,
      postedAt: new Date(rawPayload.postedAt || Date.now()),
      updatedAt: new Date(),
      extractedSkills: skills.length > 0 ? skills : ['Go', 'TypeScript', 'Docker', 'Kubernetes'],
      experienceLevel: 'INTERN',
      visaAllowed: true
    };
  }
}
