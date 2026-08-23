import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';
  const platform = searchParams.get('platform')?.toUpperCase() || '';
  const remoteOnly = searchParams.get('remote') === 'true';
  const minScore = parseInt(searchParams.get('minScore') || '0', 10);
  const employmentType = searchParams.get('type')?.toUpperCase() || '';

  const userId = 'user_alex_chen';

  let filtered = db.jobPostings.map(job => {
    const match = db.matches.find(m => m.jobPostingId === job.id && m.userId === userId);
    return {
      ...job,
      matchScore: match?.matchResult.overallScore || 0,
      matchResult: match?.matchResult,
      isStarred: match?.isStarred || false
    };
  });

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

  return NextResponse.json({
    success: true,
    count: filtered.length,
    jobs: filtered
  });
}
