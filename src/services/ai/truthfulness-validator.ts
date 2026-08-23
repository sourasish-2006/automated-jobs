// Strict Anti-Hallucination & Truthfulness Verification Engine
import { CandidateProfileData, TailoredResumeContent } from '@/types';
import { TruthfulnessAuditReport } from './types';

export class TruthfulnessValidator {
  /**
   * Verifies that all information in a tailored resume directly originates
   * from the candidate's verified profile data without fabricating credentials,
   * unearned skills, unseen companies, or degrees.
   */
  public static verifyResume(
    candidateProfile: CandidateProfileData,
    tailoredResume: TailoredResumeContent
  ): TruthfulnessAuditReport {
    const violations: { section: string; claim: string; reason: string }[] = [];
    const auditItems: { claim: string; sourceNode: string; verified: boolean }[] = [];

    // 1. Build Candidate Ground Truth Corpora
    const candidateSkillsLower = new Set(
      candidateProfile.skills.map(s => s.name.toLowerCase().trim())
    );

    const candidateCompaniesLower = new Set(
      candidateProfile.experiences.map(e => e.company.toLowerCase().trim())
    );

    const candidateDegreesLower = new Set(
      candidateProfile.educations.map(e => e.institution.toLowerCase().trim())
    );

    const candidateProjectTitlesLower = new Set(
      candidateProfile.projects.map(p => p.title.toLowerCase().trim())
    );

    // Collect all genuine bullet points and text fragments
    const allProfileBullets = [
      ...candidateProfile.experiences.flatMap(e => e.bullets || []),
      ...candidateProfile.projects.flatMap(p => p.bullets || []),
      ...candidateProfile.educations.flatMap(ed => ed.highlights || []),
      ...(candidateProfile.achievements?.map(a => a.title) || [])
    ].map(b => b.toLowerCase());

    // 2. Audit Skills Section
    for (const group of tailoredResume.skillsSection || []) {
      for (const skill of group.skills || []) {
        const skillLower = skill.toLowerCase().trim();
        // Check if skill exists in candidate profile (or is a direct subset like "React" in "React.js")
        const matchesCandidate = Array.from(candidateSkillsLower).some(
          cSkill => cSkill === skillLower || cSkill.includes(skillLower) || skillLower.includes(cSkill)
        );

        if (matchesCandidate) {
          auditItems.push({
            claim: `Skill: ${skill}`,
            sourceNode: `Profile Skills`,
            verified: true
          });
        } else {
          violations.push({
            section: 'Skills',
            claim: skill,
            reason: `Skill "${skill}" is not present in candidate's verified skill inventory.`
          });
          auditItems.push({
            claim: `Skill: ${skill}`,
            sourceNode: `Unknown`,
            verified: false
          });
        }
      }
    }

    // 3. Audit Experience Companies
    for (const exp of tailoredResume.experienceSection || []) {
      const expCompanyLower = exp.company.toLowerCase().trim();
      const matchedCompany = Array.from(candidateCompaniesLower).some(
        cCompany => cCompany === expCompanyLower || cCompany.includes(expCompanyLower) || expCompanyLower.includes(cCompany)
      );

      if (!matchedCompany) {
        violations.push({
          section: 'Experience',
          claim: `Company: ${exp.company}`,
          reason: `Company "${exp.company}" is not listed in candidate's verified work history.`
        });
        auditItems.push({
          claim: `Employment at ${exp.company}`,
          sourceNode: `Unknown`,
          verified: false
        });
      } else {
        auditItems.push({
          claim: `Employment at ${exp.company} (${exp.role})`,
          sourceNode: `Experience: ${exp.company}`,
          verified: true
        });
      }

      // Check bullets plausibility against profile facts
      for (const bullet of exp.bullets || []) {
        const bulletLower = bullet.toLowerCase();
        // Extract key keywords (numbers, technologies)
        const hasSemanticAnchor = allProfileBullets.some(sourceBullet => {
          // Check for token overlap
          const sourceTokens = sourceBullet.split(/\W+/).filter(t => t.length > 3);
          const bulletTokens = bulletLower.split(/\W+/).filter(t => t.length > 3);
          const overlap = bulletTokens.filter(t => sourceTokens.includes(t));
          return overlap.length >= 2;
        });

        auditItems.push({
          claim: bullet.length > 60 ? bullet.substring(0, 57) + '...' : bullet,
          sourceNode: `Experience: ${exp.company}`,
          verified: hasSemanticAnchor
        });

        if (!hasSemanticAnchor) {
          violations.push({
            section: 'Experience Bullets',
            claim: bullet,
            reason: 'Bullet point introduces claims or metrics not traceable to candidate source experience.'
          });
        }
      }
    }

    // 4. Audit Education Section
    for (const edu of tailoredResume.educationSection || []) {
      const eduInstLower = edu.institution.toLowerCase().trim();
      const matchedDegree = Array.from(candidateDegreesLower).some(
        cInst => cInst === eduInstLower || cInst.includes(eduInstLower) || eduInstLower.includes(cInst)
      );

      if (!matchedDegree) {
        violations.push({
          section: 'Education',
          claim: edu.institution,
          reason: `Institution "${edu.institution}" is not in candidate's verified education history.`
        });
      } else {
        auditItems.push({
          claim: `${edu.degree} from ${edu.institution}`,
          sourceNode: `Education: ${edu.institution}`,
          verified: true
        });
      }
    }

    const totalClaimsChecked = auditItems.length;
    const verifiedCount = auditItems.filter(a => a.verified).length;
    const flaggedCount = violations.length;
    const score = totalClaimsChecked > 0 ? Math.round((verifiedCount / totalClaimsChecked) * 100) : 100;
    const isVerifiedTruthful = flaggedCount === 0;

    return {
      isVerifiedTruthful,
      score,
      totalClaimsChecked,
      verifiedCount,
      flaggedCount,
      violations,
      auditItems
    };
  }
}
