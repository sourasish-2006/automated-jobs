import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CandidateProfileData } from '@/types';
import { FormPrefillEngine } from '@/services/automation/form-prefill';
import { getCurrentUserId, getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const userId = await getCurrentUserId(request);
  let profile = db.profiles.get(userId);

  if (!profile) {
    // If authenticated user doesn't have a profile yet, initialize one
    const user = await getSessionUser(request);
    const baseProfile = db.profiles.get('user_alex_chen');

    if (baseProfile) {
      profile = {
        ...baseProfile,
        id: `prof_${userId}`,
        userId,
        fullName: user?.name || baseProfile.fullName,
        email: user?.email || baseProfile.email
      };
      db.profiles.set(userId, profile);
    } else {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }
  }

  return NextResponse.json({
    success: true,
    profile,
    userId
  });
}

export async function PUT(request: NextRequest) {
  const userId = await getCurrentUserId(request);
  try {
    const updatedProfile: CandidateProfileData = await request.json();
    updatedProfile.userId = userId;
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
      resourceId: `prof_${userId}`,
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
