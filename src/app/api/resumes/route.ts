import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserResumesFromFirestore, saveResumeToFirestore } from '@/lib/firebase/firestore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const headerUserId = request.headers.get('x-user-id');
  const paramUserId = searchParams.get('userId');
  const userId = paramUserId || headerUserId;

  if (!userId) {
    return NextResponse.json({ success: true, userId: null, resumes: [] });
  }

  // 1. Check user resumes in Firestore
  let resumes: any[] = await getUserResumesFromFirestore(userId).catch(() => []);

  // 2. Check memory store for this specific userId
  if (resumes.length === 0) {
    resumes = db.resumes.filter(r => r.userId === userId);
  }

  // 3. If no tailored resumes, synthesize master resume from profile
  if (resumes.length === 0) {
    const { getProfileFromFirestore } = await import('@/lib/firebase/firestore');
    let profile = db.profiles.get(userId);
    if (!profile) {
      profile = await getProfileFromFirestore(userId).catch(() => null) || undefined;
    }

    if (profile && profile.skills && profile.skills.length > 0) {
      resumes = [{
        id: `resume_master_${userId}`,
        userId,
        targetRole: profile.desiredTitles?.[0] || 'Software Engineer',
        company: 'Master Vault Resume',
        content: {
          candidateName: profile.fullName || 'Candidate',
          email: profile.email || '',
          phone: profile.phone || '',
          location: profile.location || '',
          summary: profile.summary || '',
          skills: (profile.skills || []).map((s: any) => typeof s === 'string' ? s : s.name),
          experiences: (profile.experiences || []).map((e: any) => ({
            role: e.role,
            company: e.company,
            duration: `${e.startDate || ''} - ${e.endDate || 'Present'}`,
            bullets: e.bullets || []
          })),
          educations: (profile.educations || []).map((ed: any) => ({
            institution: ed.institution,
            degree: ed.degree,
            year: `${ed.startYear || ''} - ${ed.endYear || ''}`,
            gpa: ed.gpa
          })),
          projects: (profile.projects || []).map((p: any) => ({
            name: p.title,
            technologies: p.technologies || [],
            bullets: p.bullets || []
          }))
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }];
    }
  }

  return NextResponse.json({
    success: true,
    userId,
    resumes
  });
}

export async function POST(request: Request) {
  const headerUserId = request.headers.get('x-user-id');
  const body = await request.json();
  const userId = body.userId || headerUserId;

  if (!userId) {
    return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
  }

  const newResume = {
    ...body,
    id: body.id || `resume_${Date.now()}_${userId}`,
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.resumes.push(newResume);
  await saveResumeToFirestore(userId, newResume).catch(e => console.warn('Firestore resume save error:', e));

  return NextResponse.json({
    success: true,
    userId,
    resume: newResume
  });
}
