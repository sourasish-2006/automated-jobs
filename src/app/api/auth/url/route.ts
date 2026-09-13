import { NextRequest, NextResponse } from 'next/server';
import { buildOAuthUrl, getRedirectUri, OAuthProvider } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const provider = (searchParams.get('provider') || 'google') as OAuthProvider;
    const state = searchParams.get('state') || `state_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Build redirect URI
    const redirectUri = getRedirectUri(request);
    const { url, isConfigured } = buildOAuthUrl(provider, redirectUri, state);

    return NextResponse.json({
      success: true,
      provider,
      url,
      isConfigured,
      redirectUri
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to construct OAuth authorization URL' },
      { status: 500 }
    );
  }
}
