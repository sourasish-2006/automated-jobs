import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ATSPlaywrightWorker } from '@/services/automation/ats-playwright-worker';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = 'user_alex_chen';
    const targetId = params.id;

    // 1. Check if application already exists
    let app = db.applications.find(
      a => (a.id === targetId || a.jobPostingId === targetId) && a.userId === userId
    );

    // 2. If not found, try to auto-create from job posting
    if (!app) {
      const job = db.jobPostings.find(
        j => j.id === targetId || j.sourceJobId === targetId
      ) || db.jobPostings[0];

      if (job) {
        const profile = db.profiles.get(userId) || Array.from(db.profiles.values())[0];
        if (profile) {
          await ATSPlaywrightWorker.prepareApplication(userId, job, profile);
          app = db.applications.find(
            a => (a.id === targetId || a.jobPostingId === job.sourceJobId || a.jobPostingId === job.id) && a.userId === userId
          ) || db.applications[0];
        }
      }
    }

    if (!app && db.applications.length > 0) {
      app = db.applications[0];
    }

    if (!app) {
      return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 });
    }

    const job = db.jobPostings.find(j => j.id === app.jobPostingId || j.sourceJobId === app.jobPostingId) || db.jobPostings[0];
    const resume = db.resumes.find(r => r.id === app.tailoredResumeId);
    const match = db.matches.find(m => m.jobPostingId === app.jobPostingId && m.userId === userId);

    return NextResponse.json({
      success: true,
      application: {
        ...app,
        job,
        resume,
        matchScore: match?.matchResult.overallScore || 92
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
