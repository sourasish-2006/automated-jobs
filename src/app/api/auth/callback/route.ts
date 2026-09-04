import { NextRequest, NextResponse } from 'next/server';
import {
  exchangeOAuthCode,
  findOrCreateOAuthUser,
  createSession,
  getSessionCookieHeader,
  getRedirectUri,
  OAuthProvider
} from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      return renderErrorHtml(`OAuth Authorization Denied: ${errorDescription || error}`);
    }

    if (!code) {
      return renderErrorHtml('No authorization code returned from provider.');
    }

    // Determine provider from query or state
    let provider: OAuthProvider = 'demo';
    const queryProvider = searchParams.get('provider');
    if (queryProvider === 'google' || queryProvider === 'github' || queryProvider === 'demo') {
      provider = queryProvider;
    } else if (state && state.includes('github')) {
      provider = 'github';
    } else if (state && state.includes('google')) {
      provider = 'google';
    }

    const redirectUri = getRedirectUri(request);

    // 1. Exchange code for user identity
    const profile = await exchangeOAuthCode(provider, code, redirectUri);

    // 2. Link or create user in multi-tenant store
    const user = findOrCreateOAuthUser({
      email: profile.email,
      name: profile.name,
      avatarUrl: profile.avatarUrl,
      provider,
      providerId: profile.providerId
    });

    // 3. Create active session token
    const token = createSession(user.id, provider);

    // 4. Return postMessage HTML + Set-Cookie
    const cookieHeader = getSessionCookieHeader(token);

    const safeUser = JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
      provider
    });

    const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Authentication Successful</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background: #090d16;
        color: #f1f5f9;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        margin: 0;
        text-align: center;
      }
      .box {
        background: #0f172a;
        border: 1px solid #1e293b;
        border-radius: 16px;
        padding: 32px 40px;
        max-width: 380px;
      }
      .icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: rgba(16, 185, 129, 0.15);
        border: 1px solid rgba(16, 185, 129, 0.3);
        color: #34d399;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        margin: 0 auto 16px;
      }
      h2 { font-size: 18px; margin-bottom: 8px; color: #fff; }
      p { font-size: 13px; color: #94a3b8; line-height: 1.5; }
    </style>
  </head>
  <body>
    <div class="box">
      <div class="icon">✓</div>
      <h2>Authentication Successful</h2>
      <p>Signed in as <strong>${escapeHtml(user.name)}</strong> (${escapeHtml(user.email)}).</p>
      <p style="margin-top: 10px; font-size: 11px; color: #64748b;">Closing popup and connecting your session...</p>
    </div>
    <script>
      (function() {
        var userData = ${safeUser};
        if (window.opener) {
          window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', user: userData }, '*');
          setTimeout(function() {
            window.close();
          }, 350);
        } else {
          setTimeout(function() {
            window.location.href = '/';
          }, 600);
        }
      })();
    </script>
  </body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Set-Cookie': cookieHeader
      }
    });
  } catch (error: any) {
    return renderErrorHtml(error.message || 'Authentication failed');
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderErrorHtml(message: string) {
  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Authentication Error</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background: #090d16;
        color: #f1f5f9;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        margin: 0;
        text-align: center;
      }
      .box {
        background: #0f172a;
        border: 1px solid #dc2626;
        border-radius: 16px;
        padding: 32px 40px;
        max-width: 400px;
      }
      .icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: rgba(239, 68, 68, 0.15);
        color: #ef4444;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        margin: 0 auto 16px;
      }
      h2 { font-size: 18px; margin-bottom: 8px; color: #fff; }
      p { font-size: 13px; color: #f87171; line-height: 1.5; margin-bottom: 20px; }
      button {
        padding: 10px 20px;
        background: #334155;
        color: #fff;
        border: none;
        border-radius: 8px;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <div class="box">
      <div class="icon">✕</div>
      <h2>Authentication Error</h2>
      <p>${escapeHtml(message)}</p>
      <button onclick="window.close()">Close Window</button>
    </div>
  </body>
</html>`;

  return new NextResponse(html, {
    status: 400,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
