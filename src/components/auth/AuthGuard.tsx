'use client';

import React from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { Lock, Sparkles, ArrowRight, ShieldCheck, Users } from 'lucide-react';

export function AuthGuard({
  children,
  title = 'Sign In to Access this Workspace',
  subtitle = 'Please sign in or create an account to view your tailored jobs, upload resumes, and manage applications.'
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const { user, loading, openAuthModal } = useAuth();

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-400 space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-xs font-medium">Verifying Firebase Session...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 rounded-3xl glass-panel border border-slate-700/80 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 bg-slate-900/90">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-8 h-8 text-cyan-400" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Authentication Required</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">{subtitle}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => openAuthModal('SIGNIN')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            <span>Sign In to Your Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => openAuthModal('SIGNUP')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            Create New Account
          </button>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cloud Firestore Vault</span>
          </div>
          <button
            onClick={() => openAuthModal('DEMO')}
            className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
          >
            <Users className="w-3 h-3" />
            <span>Try Demo Account</span>
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
