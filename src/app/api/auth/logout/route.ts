import { NextRequest, NextResponse } from 'next/server';
import { extractSessionToken, sessionStore, getClearSessionCookieHeader } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const token = extractSessionToken(request);
    if (token) {
      sessionStore.sessions.delete(token);
    }

    const res = NextResponse.json({
      success: true,
      message: 'Signed out successfully'
    });

    res.headers.set('Set-Cookie', getClearSessionCookieHeader());
    return res;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
