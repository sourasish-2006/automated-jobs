import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CandidateProfileData } from '@/types';
import { FormPrefillEngine } from '@/services/automation/form-prefill';
import { saveProfileToFirestore, getProfileFromFirestore } from '@/lib/firebase/firestore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const headerUserId = request.headers.get('x-user-id');
  const paramUserId = searchParams.get('userId');
  const userId = paramUserId || headerUserId || 'user_raihan_molla';

  let profile = db.profiles.get(userId);
  if (!profile) {
    profile = await getProfileFromFirestore(userId).catch(() => null) || undefined;
    if (profile) {
      db.profiles.set(userId, profile);
    }
  }

  // If user doesn't have an uploaded profile yet, return an empty template profile with their userId
  if (!profile) {
    profile = {
      id: `prof_${userId}`,
      userId,
      fullName: '',
      email: '',
      desiredTitles: [],
      preferredLocations: [],
      remotePreference: 'ANY',
      requiresVisa: false,
      yearsOfExperience: 0,
      skills: [],
      experiences: [],
      educations: [],
      projects: []
    };
    db.profiles.set(userId, profile);
  }

  return NextResponse.json({
    success: true,
    userId,
    hasUploadedResume: Boolean(profile.skills && profile.skills.length > 0),
    profile
  });
}

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const headerUserId = request.headers.get('x-user-id');
  const paramUserId = searchParams.get('userId');

  try {
    const updatedProfile: CandidateProfileData = await request.json();
    const userId = updatedProfile.userId || paramUserId || headerUserId || 'user_raihan_molla';
    updatedProfile.userId = userId;

    db.profiles.set(userId, updatedProfile);
    await saveProfileToFirestore(userId, updatedProfile).catch(err => console.warn('Firestore PUT err:', err));

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
      userId,
      profile: updatedProfile
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
