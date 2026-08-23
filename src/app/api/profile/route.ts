import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CandidateProfileData } from '@/types';
import { FormPrefillEngine } from '@/services/automation/form-prefill';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const userId = 'user_alex_chen';
  const profile = db.profiles.get(userId);

  if (!profile) {
    return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    profile
  });
}

export async function PUT(request: Request) {
  const userId = 'user_alex_chen';
  try {
    const updatedProfile: CandidateProfileData = await request.json();
    db.profiles.set(userId, updatedProfile);

    // Keep application form fields in sync with updated profile
    for (const app of db.applications.filter(a => a.userId === userId)) {
      app.fields = FormPrefillEngine.mapProfileToFields(updatedProfile);
    }

    // Record audit log
    db.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      tenantId: 'tenant_prod_enterprise_1',
      userId,
      action: 'PROFILE_UPDATED',
      resourceType: 'CandidateProfile',
      resourceId: profileId(userId),
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      profile: updatedProfile
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

function profileId(userId: string) {
  return `prof_${userId}`;
}
