'use client';

import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Bot, ShieldCheck, X, Sparkles, Copy, Check, ExternalLink, KeyRound, Info } from 'lucide-react';

export function AuthModal() {
  const { isLoginModalOpen, closeLoginModal, signInWithOAuth, oauthConfig } = useAuth();
  const [copiedDev, setCopiedDev] = useState(false);
  const [copiedShared, setCopiedShared] = useState(false);
  const [showConfigGuide, setShowConfigGuide] = useState(false);
  const [authenticatingProvider, setAuthenticatingProvider] = useState<string | null>(null);

  if (!isLoginModalOpen) return null;

  const devCallback = oauthConfig?.callbackUrls?.development || 'https://ais-dev-ss5pessumkhmwglkreltsp-49121961165.asia-east1.run.app/api/auth/callback';
  const sharedCallback = oauthConfig?.callbackUrls?.shared || 'https://ais-pre-ss5pessumkhmwglkreltsp-49121961165.asia-east1.run.app/api/auth/callback';

  const copyToClipboard = (text: string, isShared: boolean) => {
    navigator.clipboard.writeText(text);
    if (isShared) {
      setCopiedShared(true);
      setTimeout(() => setCopiedShared(false), 2000);
    } else {
      setCopiedDev(true);
      setTimeout(() => setCopiedDev(false), 2000);
    }
  };

  const handleSignIn = async (provider: 'google' | 'github' | 'demo') => {
    setAuthenticatingProvider(provider);
    try {
      await signInWithOAuth(provider);
    } finally {
      setTimeout(() => setAuthenticatingProvider(null), 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0f172a] border border-slate-800 shadow-2xl p-6 text-slate-100 overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        
        {/* Close button */}
        <button
          onClick={closeLoginModal}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Sign in with OAuth</h2>
            <p className="text-xs text-slate-400">Authenticate securely to access your isolated workspace</p>
          </div>
        </div>

        <div className="space-y-3 my-5">
          {/* Google OAuth Button */}
          <button
            onClick={() => handleSignIn('google')}
            disabled={authenticatingProvider !== null}
            className="w-full group p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-700/80 hover:border-indigo-500/60 transition-all flex items-center justify-between text-left disabled:opacity-60"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center p-1.5 shadow-sm">
                <svg className="w-full h-full" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-white">Continue with Google</p>
                <p className="text-[11px] text-slate-400">
                  {oauthConfig?.google?.isConfigured ? 'Production Google OAuth 2.0' : 'Google Identity (Demo / Prod)'}
                </p>
              </div>
            </div>
            <span className="text-xs text-indigo-400 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
          </button>

          {/* GitHub OAuth Button */}
          <button
            onClick={() => handleSignIn('github')}
            disabled={authenticatingProvider !== null}
            className="w-full group p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-700/80 hover:border-indigo-500/60 transition-all flex items-center justify-between text-left disabled:opacity-60"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center p-1.5 shadow-sm text-white">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-white">Continue with GitHub</p>
                <p className="text-[11px] text-slate-400">
                  {oauthConfig?.github?.isConfigured ? 'Production GitHub OAuth' : 'Developer Identity (Demo / Prod)'}
                </p>
              </div>
            </div>
            <span className="text-xs text-indigo-400 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
          </button>

          {/* 1-Click Fast Demo OAuth */}
          <button
            onClick={() => handleSignIn('demo')}
            disabled={authenticatingProvider !== null}
            className="w-full group p-3.5 rounded-xl bg-gradient-to-r from-indigo-950/60 to-slate-900 hover:from-indigo-900/60 hover:to-slate-800 border border-indigo-500/30 hover:border-indigo-400 transition-all flex items-center justify-between text-left disabled:opacity-60"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center p-1.5 shadow-sm text-indigo-300">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-indigo-200 flex items-center gap-1.5">
                  <span>Fast 1-Click Demo OAuth</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-300 uppercase font-mono">Instant</span>
                </p>
                <p className="text-[11px] text-slate-400">Authenticates as samaddersourasish2006@gmail.com</p>
              </div>
            </div>
            <span className="text-xs text-cyan-400 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
          </button>
        </div>

        {/* OAuth Configuration Instructions Toggle */}
        <div className="pt-3 border-t border-slate-800/80">
          <button
            onClick={() => setShowConfigGuide(!showConfigGuide)}
            className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition-colors py-1"
          >
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
              <span>OAuth Provider Setup &amp; Callback URIs</span>
            </span>
            <span className="text-[10px] font-mono text-indigo-400">{showConfigGuide ? 'Hide ▲' : 'Show ▼'}</span>
          </button>

          {showConfigGuide && (
            <div className="mt-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] space-y-3">
              <p className="text-slate-300 leading-relaxed">
                To connect your own Google Cloud or GitHub OAuth applications, add these exact callback URLs to your provider console:
              </p>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Development Callback URL:</label>
                <div className="flex items-center gap-1.5 bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono text-[10px] text-slate-300">
                  <span className="truncate flex-1">{devCallback}</span>
                  <button
                    onClick={() => copyToClipboard(devCallback, false)}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 shrink-0 flex items-center gap-1 transition-colors"
                  >
                    {copiedDev ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedDev ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Shared / Deployed Callback URL:</label>
                <div className="flex items-center gap-1.5 bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono text-[10px] text-slate-300">
                  <span className="truncate flex-1">{sharedCallback}</span>
                  <button
                    onClick={() => copyToClipboard(sharedCallback, true)}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 shrink-0 flex items-center gap-1 transition-colors"
                  >
                    {copiedShared ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedShared ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 space-y-1 pt-1">
                <p>Required Environment Variables in AI Studio Settings:</p>
                <p className="font-mono text-indigo-300">• GOOGLE_CLIENT_ID &amp; GOOGLE_CLIENT_SECRET</p>
                <p className="font-mono text-indigo-300">• GITHUB_CLIENT_ID &amp; GITHUB_CLIENT_SECRET</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Popup cross-origin communication</span>
          </span>
          <span className="font-mono text-[10px] text-emerald-400">SameSite=None</span>
        </div>
      </div>
    </div>
  );
}
