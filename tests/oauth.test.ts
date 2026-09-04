import {
  buildOAuthUrl,
  getOAuthStatus,
  encodeDemoCode,
  decodeDemoCode,
  findOrCreateOAuthUser,
  createSession,
  sessionStore,
  getSessionCookieHeader,
  APP_DEV_URL,
  APP_SHARED_URL,
  SESSION_COOKIE_NAME
} from '../src/lib/auth';
import { db } from '../src/lib/db';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${message}`);
}

console.log('====================================================');
console.log('🚀 Running AutoApply AI OAuth Test Suite');
console.log('====================================================');

// 1. OAuth URL Generation
console.log('--- 1. OAuth URL Generation & Provider Config ---');
const googleOAuth = buildOAuthUrl('google', `${APP_DEV_URL}/api/auth/callback`, 'state_123');
assert(Boolean(googleOAuth.url), 'Google OAuth URL is generated');
assert(googleOAuth.url.includes('redirect_uri='), 'Google OAuth URL contains redirect_uri');

const githubOAuth = buildOAuthUrl('github', `${APP_DEV_URL}/api/auth/callback`, 'state_456');
assert(Boolean(githubOAuth.url), 'GitHub OAuth URL is generated');

const demoOAuth = buildOAuthUrl('demo', `${APP_DEV_URL}/api/auth/callback`, 'state_789');
assert(demoOAuth.url.includes('/api/auth/demo-authorize'), 'Demo OAuth URL points to demo-authorize handler');
assert(demoOAuth.isConfigured === true, 'Demo OAuth is marked as configured');

// 2. Demo Code Encoding & Decoding
console.log('--- 2. Demo Code Encoding & Decoding ---');
const payload = {
  email: 'samaddersourasish2006@gmail.com',
  name: 'Sourasish Samadder',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  provider: 'google'
};
const encoded = encodeDemoCode(payload);
const decoded = decodeDemoCode(encoded);
assert(decoded.email === payload.email, 'Decoded email matches original payload');
assert(decoded.name === payload.name, 'Decoded name matches original payload');

// 3. User Linking & Creation
console.log('--- 3. Multi-Tenant User Creation & Identity Linking ---');
const user = findOrCreateOAuthUser({
  email: 'samaddersourasish2006@gmail.com',
  name: 'Sourasish Samadder',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  provider: 'google',
  providerId: 'google_user_12345'
});
assert(user.email === 'samaddersourasish2006@gmail.com', 'User created with correct email');
assert(user.role === 'CANDIDATE', 'User assigned CANDIDATE role');
assert(Boolean(db.profiles.get(user.id)), 'CandidateProfile automatically initialized for OAuth user');

// 4. Session Token & Store
console.log('--- 4. Active Session Token & Store ---');
const token = createSession(user.id, 'google');
assert(token.startsWith('sess_google_'), 'Session token is prefixed with provider');
assert(sessionStore.sessions.has(token), 'Session store persists generated token');
assert(sessionStore.sessions.get(token)?.userId === user.id, 'Session references correct userId');

// 5. Iframe-Safe Cookie Header
console.log('--- 5. Iframe-Safe Cookie Header ---');
const cookieHeader = getSessionCookieHeader(token);
assert(cookieHeader.includes('SameSite=None'), 'Cookie specifies SameSite=None for iframe compatibility');
assert(cookieHeader.includes('Secure'), 'Cookie specifies Secure flag');
assert(cookieHeader.includes('HttpOnly'), 'Cookie specifies HttpOnly flag');
assert(cookieHeader.includes(SESSION_COOKIE_NAME), 'Cookie specifies correct session cookie name');

console.log('====================================================');
console.log('🎯 OAuth Test Run Finished: All Checks Passed!');
console.log('====================================================');
