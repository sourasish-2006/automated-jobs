'use client';

import React, { useState, useRef, useEffect } from 'react';
import { NotificationDropdown } from './NotificationDropdown';
import { Sparkles, LogIn, LogOut, User, Settings, ShieldCheck, ChevronDown, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthContext';

export function Navbar() {
  const { user, openLoginModal, signOut, loading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileName, setProfileName] = useState('Alex Chen');
  const [profileRole, setProfileRole] = useState('Senior Software Engineer');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetch('/api/profile')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.profile) {
            if (data.profile.fullName) setProfileName(data.profile.fullName);
            if (data.profile.headline) {
              const role = data.profile.headline.split('—')[0] || data.profile.headline.split('|')[0];
              setProfileRole(role.trim() || 'Software Engineer');
            }
          }
        })
        .catch(() => {});
    }
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = user?.name || profileName;
  const displayEmail = user?.email || 'samaddersourasish2006@gmail.com';

  return (
    <header className="h-16 glass-panel border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>4 ATS Feeds Ingesting</span>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
          <span className="text-slate-600">•</span>
          <span>Greenhouse</span>
          <span className="text-slate-600">•</span>
          <span>Lever</span>
          <span className="text-slate-600">•</span>
          <span>Ashby</span>
          <span className="text-slate-600">•</span>
          <span>Workable</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/upload"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Upload Resume</span>
        </Link>

        <NotificationDropdown />

        <div className="h-6 w-px bg-slate-800" />

        {/* OAuth Authentication State */}
        {loading ? (
          <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse" />
        ) : user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 p-1 pl-2 pr-2.5 rounded-full bg-slate-900/90 border border-slate-700/80 hover:border-indigo-500/60 transition-all text-left"
              id="userProfileDropdownBtn"
            >
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatarUrl} alt={displayName} className="w-7 h-7 rounded-full object-cover ring-1 ring-indigo-500/40" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center ring-1 ring-indigo-500/40">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-white leading-tight flex items-center gap-1">
                  <span>{displayName.split(' ')[0]}</span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                </p>
                <p className="text-[10px] text-slate-400 truncate max-w-[110px] font-mono">
                  {user.provider ? `${user.provider.toUpperCase()} OAuth` : 'Active'}
                </p>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-2xl p-2 text-slate-200 z-50 animate-in fade-in-50 zoom-in-95">
                <div className="p-3 border-b border-slate-800/80 mb-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-white truncate">{displayName}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-semibold">
                      AUTHENTICATED
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate font-mono">{displayEmail}</p>
                </div>

                <div className="space-y-0.5 text-xs">
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800/70 text-slate-300 hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4 text-indigo-400" />
                    <span>Candidate Profile</span>
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800/70 text-slate-300 hover:text-white transition-colors"
                  >
                    <Settings className="w-4 h-4 text-cyan-400" />
                    <span>OAuth &amp; App Settings</span>
                  </Link>
                </div>

                <div className="mt-1 pt-1 border-t border-slate-800/80">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors text-xs font-medium text-left"
                    id="signOutBtn"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={openLoginModal}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
            id="signInWithOAuthBtn"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-200" />
            <span>Sign In with OAuth</span>
          </button>
        )}
      </div>
    </header>
  );
}
