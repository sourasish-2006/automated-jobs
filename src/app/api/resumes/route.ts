import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const userId = 'user_alex_chen';
  const resumes = db.resumes.filter(r => r.userId === userId);
  return NextResponse.json({
    success: true,
    resumes
  });
}
