import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUserId } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const userId = await getCurrentUserId(request);
  const userResumes = db.resumes.filter(r => r.userId === userId);
  const resumes = userResumes.length > 0 ? userResumes : db.resumes;

  return NextResponse.json({
    success: true,
    resumes,
    userId
  });
}
