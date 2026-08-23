'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  FileCheck2,
  FileText,
  ShieldAlert,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  Clock,
  Building2,
  CheckCircle2,
  CheckCircle,
  ExternalLink,
  Bot
} from 'lucide-react';

export default function DashboardPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        fetch('/api/jobs'),
        fetch('/api/applications')
      ]);
      const jobsData = await jobsRes.json();
      const appsData = await appsRes.json();

      if (jobsData.success) setJobs(jobsData.jobs);
      if (appsData.success) setApplications(appsData.applications);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerLiveSync = async (platform: string, companySlug: string) => {
    setIsSyncing(true);
    setSyncStatusMsg(`Syncing latest jobs from ${platform} (${companySlug})...`);
    try {
      const res = await fetch('/api/jobs/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, companySlug })
      });
      const data = await res.json();
      if (data.success) {
        setSyncStatusMsg(data.message);
        await loadData();
      }
    } catch (e) {
      setSyncStatusMsg('Sync error occurred.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatusMsg(null), 4000);
    }
  };

  const pendingApprovals = applications.filter(a => a.status === 'WAITING_FOR_APPROVAL');
  const highMatchJobs = jobs.filter(j => j.matchScore >= 90);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome & Quick Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Autonomous Agent Dashboard</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Real-Time Ingestion Active</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, Alex
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Your career agent is continuously scanning Greenhouse, Lever, Ashby, and Workable feeds for relevant roles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => triggerLiveSync('GREENHOUSE', 'figma')}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-semibold transition-all hover:border-slate-600 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-indigo-400' : 'text-slate-400'}`} />
            <span>{isSyncing ? 'Ingesting Feeds...' : 'Sync ATS Boards'}</span>
          </button>

          <Link
            href="/jobs"
            className="glass-button-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore Discovered Jobs</span>
          </Link>
        </div>
      </div>

      {syncStatusMsg && (
        <div className="p-3.5 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-200 text-xs flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{syncStatusMsg}</span>
        </div>
      )}

      {/* Pending Human Approval Safety Alert Banner */}
      {pendingApprovals.length > 0 && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-slate-900 border border-amber-500/30 shadow-lg shadow-amber-950/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">Action Required: {pendingApprovals.length} Application(s) Awaiting Review</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold uppercase">Human Gate</span>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Browser automation has pre-filled the application form for <strong className="text-white">{pendingApprovals[0]?.job?.company || 'Figma'} ({pendingApprovals[0]?.job?.title})</strong>. Sensitive questions (work authorization and target salary) require your explicit review before submission.
                </p>
              </div>
            </div>

            <Link
              href={`/applications/${pendingApprovals[0].id}`}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 whitespace-nowrap self-start md:self-auto flex items-center gap-1.5"
            >
              <span>Review & Approve Form</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Discovered Jobs</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{jobs.length}</span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14 new
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across 4 major ATS platforms</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">High-Affinity Matches</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{highMatchJobs.length}</span>
            <span className="text-xs text-indigo-300 font-medium">≥ 90% match</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Passed hard filters & AI match</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Applications</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{applications.length}</span>
            <span className="text-xs text-slate-400">in pipeline</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">1 submitted, 1 awaiting review</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Tailored Resumes</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">100%</span>
            <span className="text-xs text-emerald-400 font-semibold">Verified</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Zero hallucinated claims</p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: High Match Discovered Roles */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Top Recommended Opportunities</span>
              </h2>
              <p className="text-xs text-slate-400">Analyzed against your 4.5 years full-stack distributed systems experience</p>
            </div>
            <Link href="/jobs" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
              <span>View all ({jobs.length})</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {jobs.slice(0, 4).map(job => (
              <div
                key={job.id}
                className="glass-panel-interactive p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center p-2 shrink-0">
                    {job.companyLogo ? (
                      <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain" />
                    ) : (
                      <Building2 className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-white hover:text-indigo-300 transition-colors">
                        {job.title}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {job.sourcePlatform}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                      <span className="font-semibold text-slate-300">{job.company}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      {job.salaryMin && job.salaryMax && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-400 font-medium font-mono">
                            ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k
                          </span>
                        </>
                      )}
                    </div>

                    {job.matchResult && (
                      <p className="text-[11px] text-slate-400 mt-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80 line-clamp-1">
                        <strong className="text-indigo-300">Why Match:</strong> {job.matchResult.whyMatchReason}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
                    <span className="text-xs font-bold text-indigo-300">{job.matchScore}%</span>
                    <span className="text-[10px] text-indigo-400 font-medium">Match</span>
                  </div>

                  <Link
                    href={`/jobs/${job.id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <span>Inspect & Apply</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Application Pipeline & Discovery Ingestion Status */}
        <div className="space-y-6">
          {/* Application Pipeline Card */}
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <span>Application Pipeline</span>
              </h2>
              <Link href="/applications" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {applications.map(app => (
                <div key={app.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{app.job?.company || 'Company'}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        app.status === 'WAITING_FOR_APPROVAL'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : app.status === 'TRACKING'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {app.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-1">{app.job?.title}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                    <span>Engine: {app.automationEngine}</span>
                    <Link href={`/applications/${app.id}`} className="text-indigo-400 hover:text-indigo-300 font-medium">
                      Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ingestion Adapters Health */}
          <div className="glass-panel p-5 rounded-2xl space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Job Discovery Workers</span>
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-white font-medium">Greenhouse Board API</span>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">Active (30m)</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-white font-medium">Lever Postings API</span>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">Active (30m)</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-white font-medium">Ashby Job Board API</span>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">Active (30m)</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-white font-medium">Workable API Widget</span>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">Active (30m)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
