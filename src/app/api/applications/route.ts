import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUserId } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const userId = await getCurrentUserId(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  let userApps = db.applications.filter(a => a.userId === userId);
  
  const applications = userApps.map(app => {
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
