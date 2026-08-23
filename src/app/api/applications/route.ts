import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const userId = 'user_alex_chen';
  const applications = db.applications
    .filter(a => a.userId === userId)
    .map(app => {
      const job = db.jobPostings.find(j => j.id === app.jobPostingId || j.sourceJobId === app.jobPostingId);
      const resume = db.resumes.find(r => r.id === app.tailoredResumeId);
      const match = db.matches.find(m => m.jobPostingId === app.jobPostingId && m.userId === userId);
      return {
        ...app,
        job,
        resume,
        matchScore: match?.matchResult.overallScore || 0
      };
    });

  return NextResponse.json({
    success: true,
    applications
  });
}
