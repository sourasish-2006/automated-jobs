import { NextResponse } from 'next/server';
import { ProfileExtractor } from '@/services/ai/profile-extractor';
import { JobMatcher } from '@/services/ai/matcher';
import { FormPrefillEngine } from '@/services/automation/form-prefill';
import { ATSPlaywrightWorker } from '@/services/automation/ats-playwright-worker';
import { db } from '@/lib/db';
import { CandidateProfileData } from '@/types';
import mammoth from 'mammoth';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let rawText = '';
    let userId = 'user_alex_chen';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const explicitUserId = formData.get('userId') as string | null;
      if (explicitUserId) userId = explicitUserId;

      if (!file) {
        return NextResponse.json({ success: false, error: 'No resume file provided in form data.' }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (file.name.endsWith('.docx')) {
        // Parse .docx using mammoth
        const docxResult = await mammoth.extractRawText({ buffer });
        rawText = docxResult.value || '';
      } else if (file.name.endsWith('.pdf')) {
        // Parse .pdf using pdf-parse PDFParse
        const { PDFParse } = require('pdf-parse');
        const parser = new PDFParse({ data: buffer });
        const pdfResult = await parser.getText();
        rawText = pdfResult.text || (pdfResult.pages ? pdfResult.pages.map((p: any) => p.text).join('\n') : '');
        await parser.destroy();
      } else {
        // Plain text / Markdown / JSON fallback
        rawText = buffer.toString('utf-8');
      }
    } else {
      const body = await request.json();
      rawText = body.text || '';
      if (body.userId) userId = body.userId;
    }

    if (!rawText || rawText.trim().length < 15) {
      return NextResponse.json({
        success: false,
        error: 'Unable to read text from resume file. Please ensure the file is not empty or password-protected.'
      }, { status: 400 });
    }

    // 1. Extract structured profile from resume text
    const result = await ProfileExtractor.extractProfileFromText(rawText);
    const extractedProfile = result.profile as CandidateProfileData;

    // 2. Save directly to Candidate Profile store
    db.profiles.set(userId, extractedProfile);

    // 3. Immediately re-calculate Match Affinities for all active job postings
    const updatedRecommendations = [];
    for (const job of db.jobPostings) {
      const matchResult = await JobMatcher.analyzeMatch(extractedProfile, job);
      
      const matchIdx = db.matches.findIndex(m => m.jobPostingId === job.id && m.userId === userId);
      const matchRecord = {
        id: `match_${job.id}_${userId}`,
        userId,
        jobPostingId: job.id,
        matchResult,
        isStarred: matchIdx >= 0 ? db.matches[matchIdx].isStarred : false,
        isDismissed: false,
        createdAt: new Date().toISOString()
      };

      if (matchIdx >= 0) {
        db.matches[matchIdx] = matchRecord;
      } else {
        db.matches.push(matchRecord);
      }

      updatedRecommendations.push({
        ...job,
        matchScore: matchResult.overallScore,
        matchResult
      });
    }

    // Sort by match score descending
    updatedRecommendations.sort((a, b) => b.matchScore - a.matchScore);

    // 4. Automatically update all existing application form fields with extracted profile data
    for (const app of db.applications.filter(a => a.userId === userId)) {
      app.fields = FormPrefillEngine.mapProfileToFields(extractedProfile);
    }

    // 5. Pre-fill application for top matching job
    let topAppId = db.applications[0]?.id || 'app_figma_1';
    if (updatedRecommendations.length > 0) {
      const topJob = updatedRecommendations[0];
      const prepResult = await ATSPlaywrightWorker.prepareApplication(
        userId,
        topJob,
        extractedProfile
      );
      if (prepResult.id) {
        topAppId = prepResult.id;
      }
    }

    // 6. Record Audit Log
    db.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      tenantId: 'tenant_prod_enterprise_1',
      userId,
      action: 'RESUME_PARSED_AND_PROFILE_UPDATED',
      resourceType: 'CandidateProfile',
      resourceId: `prof_${userId}`,
      details: {
        extractedSkillsCount: result.extractedSkillsCount,
        extractedRolesCount: result.extractedRolesCount,
        isLowConfidence: result.isLowConfidence,
        missingItems: result.missingItems,
        topMatchCompany: updatedRecommendations[0]?.company,
        topMatchScore: updatedRecommendations[0]?.matchScore,
        topAppId
      },
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      data: {
        profile: extractedProfile,
        recommendations: updatedRecommendations,
        topAppId,
        confidence: result.confidence,
        extractedSkillsCount: result.extractedSkillsCount,
        extractedRolesCount: result.extractedRolesCount,
        isLowConfidence: result.isLowConfidence,
        missingItems: result.missingItems,
        rawTextLength: rawText.length
      }
    });
  } catch (error: any) {
    console.error('Extraction error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to extract profile from resume'
    }, { status: 500 });
  }
}
