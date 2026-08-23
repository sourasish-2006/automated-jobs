// Multi-tier AI Job Matching & Scoring Engine
import { CandidateProfileData, NormalizedJobPosting, MatchAnalysisResult } from '@/types';
import { JDAnalyzer } from './jd-analyzer';

export class JobMatcher {
  /**
   * Evaluates match between a candidate and a job posting
   */
  public static async analyzeMatch(
    candidate: CandidateProfileData,
    job: NormalizedJobPosting
  ): Promise<MatchAnalysisResult> {
    // 1. Cheap Hard Filter
    const filterResult = JDAnalyzer.evaluateHardFilters(candidate, job);
    if (!filterResult.passed) {
      return {
        overallScore: 25,
        hardFilterPassed: false,
        hardFilterReason: filterResult.reason,
        skillsScore: 30,
        experienceScore: 30,
        domainScore: 20,
        matchedSkills: [],
        missingSkills: [],
        whyMatchReason: `Filtered out by candidate constraints: ${filterResult.reason}`,
        potentialConcerns: filterResult.reason
      };
    }

    // 2. Requirements & Skills Overlap
    const { requiredSkills, yearsRequired } = JDAnalyzer.extractRequirements(
      `${job.title}\n${job.descriptionRaw}`
    );

    // Build comprehensive candidate skill and experience corpus
    const candidateSkillNames = candidate.skills.map(s => s.name.toLowerCase());
    const candidateFullCorpus = [
      ...candidate.skills.map(s => s.name),
      candidate.headline || '',
      candidate.summary || '',
      ...candidate.experiences.flatMap(e => [e.role, e.company, ...(e.bullets || []), ...(e.technologies || [])]),
      ...candidate.projects.flatMap(p => [p.title, ...(p.bullets || []), ...(p.technologies || [])])
    ].join(' ').toLowerCase();

    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    for (const req of requiredSkills) {
      const reqLower = req.toLowerCase();
      const hasSkill = candidateSkillNames.some(cs => {
        if (cs === reqLower || cs.includes(reqLower) || reqLower.includes(cs)) return true;
        if (reqLower === 'go' && (cs.includes('go') || cs.includes('golang'))) return true;
        return false;
      }) || candidateFullCorpus.includes(reqLower);

      if (hasSkill) {
        matchedSkills.push(req);
      } else {
        missingSkills.push(req);
      }
    }

    // Skills Score (0 - 100)
    const skillsScore = requiredSkills.length > 0
      ? Math.min(100, Math.round((matchedSkills.length / requiredSkills.length) * 100))
      : 85;

    // Experience Calibration Score
    const diff = candidate.yearsOfExperience - yearsRequired;
    let experienceScore = 90;
    if (diff < -1) experienceScore = Math.max(50, 90 + diff * 15);
    if (diff > 5) experienceScore = 85; // Slightly overqualified

    // Title / Domain Affinity
    const titleLower = job.title.toLowerCase();
    const titleTokens = titleLower.split(/\W+/).filter(t => t.length > 2);
    const desiredLower = candidate.desiredTitles.map(t => t.toLowerCase());
    const matchesDesiredTitle = desiredLower.some(desired => {
      if (titleLower.includes(desired) || desired.includes(titleLower)) return true;
      const desiredTokens = desired.split(/\W+/).filter(t => t.length > 2);
      const matchCount = desiredTokens.filter(t => titleTokens.includes(t)).length;
      return matchCount >= 2;
    });
    const domainScore = matchesDesiredTitle ? 95 : 80;

    // Weighted Overall Score
    const overallScore = Math.min(
      99,
      Math.max(40, Math.round(skillsScore * 0.5 + experienceScore * 0.25 + domainScore * 0.25))
    );

    // Deep Analysis Synthesizer
    const topMatched = matchedSkills.slice(0, 4).join(', ');
    const relevantProject = candidate.projects[0]?.title || 'prior projects';
    const whyMatchReason = `Strong technical alignment with ${job.company}'s requirements (${topMatched || 'core technologies'}). Candidate's background in ${candidate.headline || 'software engineering'} and work on ${relevantProject} provide high-affinity foundation for this role.`;

    const potentialConcerns = missingSkills.length > 0
      ? `May require quick ramping on ${missingSkills.slice(0, 3).join(', ')}.`
      : undefined;

    const suggestedAngle = `Highlight experience with ${topMatched || candidate.skills.slice(0, 3).map(s => s.name).join(', ')} in the tailored resume.`;

    return {
      overallScore,
      hardFilterPassed: true,
      skillsScore,
      experienceScore,
      domainScore,
      matchedSkills,
      missingSkills,
      whyMatchReason,
      potentialConcerns,
      suggestedAngle
    };
  }
}
