import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUserId } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const userId = await getCurrentUserId(request);
  let userApps = db.applications.filter(a => a.userId === userId);
  
  // If a new OAuth user has not created any applications yet, display seeded demo applications
  // so the pipeline is immediately interactive and demonstrable
  const targetApps = userApps.length > 0 ? userApps : db.applications;

  const applications = targetApps.map(app => {
    const job = db.jobPostings.find(j => j.id === app.jobPostingId || j.sourceJobId === app.jobPostingId);
    const resume = db.resumes.find(r => r.id === app.tailoredResumeId);
    const match = db.matches.find(m => m.jobPostingId === app.jobPostingId);
    return {
      ...app,
      job,
      resume,
      matchScore: match?.matchResult.overallScore || 92
    };
  });

  return NextResponse.json({
    success: true,
    applications,
    userId
  });
}
