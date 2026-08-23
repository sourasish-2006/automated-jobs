import { NextResponse } from 'next/server';
import { ATSPlaywrightWorker } from '@/services/automation/ats-playwright-worker';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = 'user_alex_chen';
    const appId = params.id;

    const result = await ATSPlaywrightWorker.submitApplication(appId, userId);

    return NextResponse.json({
      success: true,
      result
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
