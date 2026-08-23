// Internshala Internships & Early Careers Connector
import { NormalizedJobPosting, JobPlatform } from '@/types';
import { BaseConnector } from './base-connector';
import { ConnectorMetadata, IngestionFilterOptions } from './types';
import { JobDeduplicator } from './deduplicator';

export class InternshalaAdapter extends BaseConnector {
  public platform: JobPlatform = 'INTERNSHALA';
  public name = 'Internshala';
  public metadata: ConnectorMetadata = {
    platform: 'INTERNSHALA',
    name: 'Internshala Early Careers & Internships',
    category: 'INTERNSHIP_PORTAL',
    supportsAutomatedPrefill: true,
    supportsInternships: true,
    isLegalAndPermitted: true
  };

  public async fetchRawJobs(categoryOrCompany: string, options?: IngestionFilterOptions): Promise<any[]> {
    const slug = categoryOrCompany.toLowerCase().replace(/[^a-z0-9]/g, '');

    return [
      {
        id: `internshala_${slug}_react_1`,
        title: 'Full Stack Web Development Intern',
        company: categoryOrCompany.toUpperCase() || 'TechCorp India',
        companyLogo: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=100&auto=format&fit=crop&q=80',
        location: 'Kolkata / Remote (India)',
        stipendPerMonthINR: 25000,
        employmentType: 'INTERNSHIP',
        durationMonths: 6,
        description: `Selected intern's day-to-day responsibilities include:
1. Building responsive frontend interfaces using Next.js 14 and React with Tailwind CSS.
2. Developing secure RESTful microservices in Node.js and PostgreSQL.
3. Writing unit and integration tests, collaborating with senior engineering mentors.`,
        applicationUrl: `https://internshala.com/internship/detail/full-stack-web-development-internship-${slug}`,
        postedAt: new Date(Date.now() - 3600 * 1000 * 18).toISOString()
      },
      {
        id: `internshala_${slug}_ai_2`,
        title: 'AI / Python Backend Intern',
        company: 'CloudScale Labs',
        companyLogo: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=100&auto=format&fit=crop&q=80',
        location: 'Bengaluru / Remote',
        stipendPerMonthINR: 35000,
        employmentType: 'INTERNSHIP',
        durationMonths: 3,
        description: `Work directly on LLM integration, Python FastAPI services, vector databases, and high-throughput data pipelines.`,
        applicationUrl: `https://internshala.com/internship/detail/ai-python-backend-internship-${slug}`,
        postedAt: new Date(Date.now() - 3600 * 1000 * 36).toISOString()
      }
    ];
  }

  public normalizeJob(rawPayload: any, company: string): NormalizedJobPosting | null {
    if (!rawPayload?.id || !rawPayload?.title) return null;

    const locInfo = this.resolveLocationAndCountry(rawPayload.location);
    const skills = this.extractCommonSkills(rawPayload.title, rawPayload.description);

    // Convert monthly stipend to annual equivalent for standardized comparison
    const annualSalaryINR = rawPayload.stipendPerMonthINR ? rawPayload.stipendPerMonthINR * 12 : undefined;

    return {
      sourcePlatform: 'INTERNSHALA',
      sourceJobId: String(rawPayload.id),
      sourceUrl: JobDeduplicator.canonicalizeUrl(rawPayload.applicationUrl || `https://internshala.com/internship/${rawPayload.id}`),
      canonicalUrl: JobDeduplicator.canonicalizeUrl(rawPayload.applicationUrl || `https://internshala.com/internship/${rawPayload.id}`),
      applicationUrl: rawPayload.applicationUrl,
      applicationMethod: 'AUTOMATED_ATS',
      foundOnSources: ['INTERNSHALA'],
      company: rawPayload.company || company,
      companyLogo: rawPayload.companyLogo,
      title: rawPayload.title,
      department: 'Software Engineering',
      location: locInfo.location,
      country: locInfo.country,
      isRemote: locInfo.isRemote,
      remoteType: locInfo.remoteType,
      employmentType: 'INTERNSHIP',
      salaryMin: annualSalaryINR,
      salaryMax: annualSalaryINR ? annualSalaryINR + 60000 : undefined,
      salaryCurrency: 'INR',
      descriptionRaw: rawPayload.description || '',
      descriptionHtml: `<p>${(rawPayload.description || '').replace(/\n/g, '<br/>')}</p>`,
      postedAt: new Date(rawPayload.postedAt || Date.now()),
      updatedAt: new Date(),
      extractedSkills: skills.length > 0 ? skills : ['React', 'Node.js', 'TypeScript', 'SQL'],
      experienceLevel: 'INTERN',
      visaAllowed: true
    };
  }
}
