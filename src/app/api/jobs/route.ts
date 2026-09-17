import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { JobMatcher } from '@/services/ai/matcher';
import { getUserMatchesFromFirestore, getProfileFromFirestore } from '@/lib/firebase/firestore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';
  const platform = searchParams.get('platform')?.toUpperCase() || '';
  const remoteOnly = searchParams.get('remote') === 'true';
  const minScore = parseInt(searchParams.get('minScore') || '0', 10);
  const employmentType = searchParams.get('type')?.toUpperCase() || '';
  const headerUserId = request.headers.get('x-user-id');
  const paramUserId = searchParams.get('userId');

  const userId = paramUserId || headerUserId || 'user_raihan_molla';

  // Retrieve user profile to ensure matches are tailored
  let userProfile = db.profiles.get(userId);
  if (!userProfile) {
    userProfile = await getProfileFromFirestore(userId).catch(() => null) || undefined;
    if (userProfile) {
      db.profiles.set(userId, userProfile);
    }
  }

  // Load any Firestore matches for this user
  const firestoreMatches = await getUserMatchesFromFirestore(userId).catch(() => ({}));

  let filtered = await Promise.all(db.jobPostings.map(async job => {
    let match = db.matches.find(m => m.jobPostingId === job.id && m.userId === userId);
    
    // Check Firestore if missing in memory
    if (!match && firestoreMatches[job.id]) {
      match = {
        id: `match_${job.id}_${userId}`,
        userId,
        jobPostingId: job.id,
        matchResult: firestoreMatches[job.id].matchResult,
        isStarred: Boolean(firestoreMatches[job.id].isStarred),
        isDismissed: false,
        createdAt: firestoreMatches[job.id].updatedAt
      };
      db.matches.push(match);
    }

    // If candidate profile exists but this job hasn't been scored for them yet, compute match
    if (!match && userProfile) {
      const computedResult = await JobMatcher.analyzeMatch(userProfile, job);
      match = {
        id: `match_${job.id}_${userId}`,
        userId,
        jobPostingId: job.id,
        matchResult: computedResult,
        isStarred: false,
        isDismissed: false,
        createdAt: new Date().toISOString()
      };
      db.matches.push(match);
    }

    return {
      ...job,
      matchScore: match?.matchResult?.overallScore || 75,
      matchResult: match?.matchResult,
      isStarred: match?.isStarred || false
    };
  }));

  if (query) {
    filtered = filtered.filter(j =>
      j.title.toLowerCase().includes(query) ||
      j.company.toLowerCase().includes(query) ||
      j.location.toLowerCase().includes(query) ||
      (j.country && j.country.toLowerCase().includes(query)) ||
      j.descriptionRaw.toLowerCase().includes(query) ||
      (j.extractedSkills && j.extractedSkills.some(s => s.toLowerCase().includes(query)))
    );
  }

  if (platform && platform !== 'ALL') {
    filtered = filtered.filter(j => 
      j.sourcePlatform === platform || (j.foundOnSources && j.foundOnSources.includes(platform as any))
    );
  }

  if (employmentType && employmentType !== 'ALL') {
    filtered = filtered.filter(j => j.employmentType === employmentType);
  }

  if (remoteOnly) {
    filtered = filtered.filter(j => j.isRemote);
  }

  if (minScore > 0) {
    filtered = filtered.filter(j => j.matchScore >= minScore);
  }

  // Sort by personalized match score descending
  filtered.sort((a, b) => b.matchScore - a.matchScore);

  return NextResponse.json({
    success: true,
    userId,
    hasCustomProfile: Boolean(userProfile && userProfile.skills && userProfile.skills.length > 0),
    candidateName: userProfile?.fullName || 'Candidate',
    count: filtered.length,
    jobs: filtered
  });
}
