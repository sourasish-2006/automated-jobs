import { NextResponse } from 'next/server';
import { ingestionService } from '@/services/ingestion/sync-runner';
import { JobPlatform } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const platforms = ingestionService.getSupportedPlatforms();
  return NextResponse.json({
    success: true,
    platforms
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const platform = (body.platform || 'ALL') as string;
    const companySlug = body.companySlug || 'tech';

    if (platform === 'ALL') {
      const result = await ingestionService.syncAllSources(companySlug);
      return NextResponse.json({
        success: true,
        message: `Global Sync Completed: Discovered & updated ${result.totalSynced} opportunities across 10 enabled connectors with cross-source deduplication.`,
        result
      });
    }

    const result = await ingestionService.syncCompanyJobs(platform as JobPlatform, companySlug);

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${result.totalFetched} jobs (${result.newJobsCount} new, ${result.updatedJobsCount} updated) from ${platform} for ${companySlug}.`,
      result
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Sync failed'
    }, { status: 500 });
  }
}
