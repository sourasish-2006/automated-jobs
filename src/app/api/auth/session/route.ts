import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser, getOAuthStatus } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser(request);
    const config = getOAuthStatus();

    if (!user) {
      return NextResponse.json({
        authenticated: false,
        user: null,
        config
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
        tenantId: user.tenantId
      },
      config
    });
  } catch (error: any) {
    return NextResponse.json(
      { authenticated: false, user: null, error: error.message },
      { status: 500 }
    );
  }
}
