// AI Provider Abstraction & Schemas
import { CandidateProfileData, NormalizedJobPosting, MatchAnalysisResult, TailoredResumeContent } from '@/types';

export interface AIProvider {
  name: string;
  generateText(prompt: string, systemInstruction?: string): Promise<string>;
  generateJSON<T>(prompt: string, schemaDescription: string, systemInstruction?: string): Promise<T>;
}

export interface ExtractionResult {
  profile: Partial<CandidateProfileData>;
  confidence: number;
  extractedSkillsCount: number;
  extractedRolesCount: number;
}

export interface TruthfulnessAuditReport {
  isVerifiedTruthful: boolean;
  score: number; // 0 - 100
  totalClaimsChecked: number;
  verifiedCount: number;
  flaggedCount: number;
  violations: {
    section: string;
    claim: string;
    reason: string;
  }[];
  auditItems: {
    claim: string;
    sourceNode: string;
    verified: boolean;
  }[];
}
