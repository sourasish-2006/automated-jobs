// Job Description (JD) Analyzer & Cheap Hard Filter Engine
import { CandidateProfileData, NormalizedJobPosting } from '@/types';

export interface HardFilterResult {
  passed: boolean;
  reason?: string;
}

export class JDAnalyzer {
  /**
   * Fast, low-cost hard filters before invoking expensive vector/LLM pipelines.
   * Checks location/remote preference, work authorization/visa, title relevance, salary.
   */
  public static evaluateHardFilters(
    candidate: CandidateProfileData,
    job: NormalizedJobPosting
  ): HardFilterResult {
    // 1. Remote / Location Constraints
    if (candidate.remotePreference === 'REMOTE' && !job.isRemote) {
      // Check if candidate is in the exact same city
      const jobLoc = job.location.toLowerCase();
      const candLoc = (candidate.location || '').toLowerCase();
      const inSameCity = candLoc && (jobLoc.includes(candLoc) || candLoc.includes(jobLoc));

      if (!inSameCity) {
        return {
          passed: false,
          reason: `Requires onsite presence in "${job.location}" but candidate preferred remote only.`
        };
      }
    }

    // 2. Visa Sponsorship Requirements
    if (candidate.requiresVisa && job.visaAllowed === false) {
      return {
        passed: false,
        reason: 'Job posting explicitly does not provide visa sponsorship.'
      };
    }

    // 3. Minimum Salary Filter
    if (candidate.minSalary && job.salaryMax && job.salaryMax < candidate.minSalary) {
      return {
        passed: false,
        reason: `Maximum salary ($${job.salaryMax.toLocaleString()}) is below candidate's minimum target ($${candidate.minSalary.toLocaleString()}).`
      };
    }

    // 4. Internship vs Full-Time
    const isInternJob = job.employmentType === 'INTERNSHIP';
    const isExperiencedCandidate = candidate.yearsOfExperience >= 3;
    if (isInternJob && isExperiencedCandidate && !candidate.desiredTitles.some(t => /intern/i.test(t))) {
      return {
        passed: false,
        reason: 'Internship role filtered for experienced candidate.'
      };
    }

    return { passed: true };
  }

  /**
   * Extracts tech stack, requirements, and keywords from JD text
   */
  public static extractRequirements(descriptionText: string): {
    requiredSkills: string[];
    yearsRequired: number;
    seniority: string;
  } {
    const textLower = descriptionText.toLowerCase();
    const skillsList = [
      'TypeScript', 'JavaScript', 'React', 'Next.js', 'Node.js', 'Go',
      'Python', 'Java', 'Rust', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis',
      'Kafka', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'GraphQL', 'REST',
      'Tailwind CSS', 'WebSockets', 'CI/CD', 'Microservices', 'Distributed Systems'
    ];

    const matchedSkills = skillsList.filter(s => {
      if (s === 'Go') {
        return /\bgo\b|\bgolang\b/i.test(textLower);
      }
      const escaped = s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      return regex.test(textLower);
    });

    let years = 2;
    const yearsMatch = descriptionText.match(/(\d+)\+?\s*(?:-\s*\d+)?\s*years?(?:\s+of)?\s+experience/i);
    if (yearsMatch) {
      years = parseInt(yearsMatch[1], 10);
    }

    let seniority = 'MID';
    if (/senior|staff|principal|lead/i.test(textLower)) seniority = 'SENIOR';
    if (/junior|entry|associate|graduate/i.test(textLower)) seniority = 'ENTRY';
    if (/intern|internship/i.test(textLower)) seniority = 'INTERN';

    return {
      requiredSkills: matchedSkills,
      yearsRequired: years,
      seniority
    };
  }
}
