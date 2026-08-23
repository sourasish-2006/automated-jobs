import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ATSPlaywrightWorker } from '@/services/automation/ats-playwright-worker';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = 'user_alex_chen';
    const targetId = params.id;

    // 1. Try finding existing application by appId or jobId
    let app = db.applications.find(a => (a.id === targetId || a.jobPostingId === targetId) && a.userId === userId);
    
    // 2. Find associated job posting
    const job = db.jobPostings.find(j => 
      j.id === (app?.jobPostingId || targetId) || 
      j.sourceJobId === (app?.jobPostingId || targetId)
    ) || db.jobPostings[0];

    if (!job) {
      return NextResponse.json({ success: false, error: 'Associated job posting not found' }, { status: 404 });
    }

    const profile = db.profiles.get(userId) || Array.from(db.profiles.values())[0];
    if (!profile) {
      return NextResponse.json({ success: false, error: 'Candidate profile not found' }, { status: 404 });
    }

    const resume = db.resumes.find(r => r.id === app?.tailoredResumeId);

    const result = await ATSPlaywrightWorker.prepareApplication(
      userId,
      job,
      profile,
      resume?.content
    );

    return NextResponse.json({
      success: true,
      message: 'Application form pre-filled and paused at Human-Approval checkpoint.',
      result: {
        ...result,
        id: result.id || app?.id || `app_${job.company.toLowerCase().replace(/[^a-z0-9]/g, '')}_1`
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
