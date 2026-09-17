'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Compass,
  FileCheck2,
  FileText,
  ShieldAlert,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  Building2,
  Bot
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { AnimatedCard } from '@/components/ui/AnimatedCard';

export default function DashboardPage() {
  const { user, openLoginModal } = useAuth();
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
    if (user) {
      loadData();
    } else {
      setLoading(false);
      setJobs([]);
      setApplications([]);
    }
  }, [user]);

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
  const firstName = (user?.name || 'Alex').trim().split(/\s+/)[0] || 'Alex';

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Hero Header */}
      <AnimatedCard className="p-0 border-0 bg-gradient-to-br from-indigo-900/40 via-[#090d16] to-cyan-900/20 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-400/20 via-transparent to-transparent opacity-60" />
        <div className="relative p-6 md:p-8 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="flex-1 space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                Autonomous Agent Dashboard
              </span>
              {user ? (
                <span className="text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Verified ({user.provider ? user.provider.toUpperCase() : 'Active'})
                </span>
              ) : (
                <button
                  onClick={openLoginModal}
                  className="text-[10px] px-3 py-1 rounded-full bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-200 border border-indigo-500/40 font-bold uppercase tracking-wider transition-all"
                >
                  Sign In with OAuth &rarr;
                </button>
              )}
            </div>

            <div className="flex items-center gap-5">
              {user?.avatarUrl ? (
                <motion.img
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  src={user.avatarUrl}
                  alt={user.name || 'User avatar'}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-400/50 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                />
              ) : (
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-sky-400 flex items-center justify-center text-2xl font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                >
                  {firstName.charAt(0).toUpperCase()}
                </motion.div>
              )}
              <div>
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 tracking-tight leading-tight"
                >
                  Welcome, {firstName}
                </motion.h1>
                <p className="text-sm md:text-base text-indigo-200/70 mt-1 max-w-xl leading-relaxed font-medium">
                  Your AI career agent is scanning global ATS platforms to find and secure your next role.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row xl:flex-col gap-3 w-full xl:max-w-[320px]">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => triggerLiveSync('GREENHOUSE', 'figma')}
              disabled={isSyncing}
              className="group relative overflow-hidden flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold transition-all disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <RefreshCw className={`w-4 h-4 relative z-10 ${isSyncing ? 'animate-spin text-cyan-400' : 'text-slate-300'}`} />
              <span className="relative z-10">{isSyncing ? 'Ingesting Feeds...' : 'Sync ATS Boards'}</span>
            </motion.button>

            <Link href="/jobs" className="w-full">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Discovered Jobs</span>
              </motion.div>
            </Link>
          </div>
        </div>
      </AnimatedCard>

      {syncStatusMsg && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 rounded-xl bg-indigo-900/30 border border-indigo-500/40 text-indigo-100 text-sm flex items-center gap-3 shadow-lg"
        >
          <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
          <span className="font-medium">{syncStatusMsg}</span>
        </motion.div>
      )}

      {/* Safety Alert */}
      {pendingApprovals.length > 0 && (
        <AnimatedCard delay={0.1} className="bg-amber-950/20 border-amber-500/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-white">Action Required</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase tracking-wider">Human Gate</span>
                </div>
                <p className="text-sm text-amber-100/70 max-w-2xl leading-relaxed">
                  {pendingApprovals.length} application(s) awaiting your review. We paused submission for <strong className="text-white">{pendingApprovals[0]?.job?.company || 'a company'}</strong> due to sensitive questions.
                </p>
              </div>
            </div>
            <Link href={`/applications/${pendingApprovals[0].id}`}>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 text-sm font-black shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all whitespace-nowrap flex items-center gap-2"
              >
                <span>Review Now</span>
                <ArrowUpRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </AnimatedCard>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Discovered', value: jobs.length, icon: Compass, color: 'text-cyan-400', bg: 'bg-cyan-400/10', trend: '+14 new', delay: 0.2 },
          { label: 'High-Affinity', value: highMatchJobs.length, icon: Sparkles, color: 'text-indigo-400', bg: 'bg-indigo-400/10', trend: '≥ 90% match', delay: 0.3 },
          { label: 'Active Applications', value: applications.length, icon: FileCheck2, color: 'text-emerald-400', bg: 'bg-emerald-400/10', trend: 'in pipeline', delay: 0.4 },
          { label: 'Tailored Resumes', value: '100%', icon: FileText, color: 'text-purple-400', bg: 'bg-purple-400/10', trend: 'Verified', delay: 0.5 }
        ].map((kpi, i) => (
          <AnimatedCard key={i} delay={kpi.delay} interactive>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{kpi.label}</span>
              <div className={`p-2.5 rounded-xl ${kpi.bg} ${kpi.color}`}>
                <kpi.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-white">{kpi.value}</span>
              <span className={`text-xs font-bold ${kpi.color} flex items-center`}>
                {kpi.trend.includes('+') && <TrendingUp className="w-3 h-3 mr-1" />}
                {kpi.trend}
              </span>
            </div>
          </AnimatedCard>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Jobs List */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span>Top Recommended Opportunities</span>
              </h2>
            </div>
            <Link href="/jobs" className="text-sm text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 group">
              <span>View all</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          <motion.div variants={containerVariants} className="space-y-4">
            {jobs.slice(0, 4).map((job, idx) => (
              <motion.div key={job.id} variants={itemVariants}>
                <AnimatedCard interactive className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-2 shrink-0 shadow-inner">
                        {job.companyLogo ? (
                          <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain" />
                        ) : (
                          <Building2 className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-base font-bold text-white hover:text-indigo-300 transition-colors cursor-pointer">
                            {job.title}
                          </h3>
                          <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 uppercase tracking-widest">
                            {job.sourcePlatform}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                          <span className="text-slate-300">{job.company}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-600" />
                          <span>{job.location}</span>
                          {job.salaryMin && job.salaryMax && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-slate-600" />
                              <span className="text-emerald-400 font-mono">
                                ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0 mt-4 sm:mt-0">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                        <span className="text-sm font-black text-indigo-300">{job.matchScore}%</span>
                        <span className="text-[10px] text-indigo-400/80 font-bold uppercase tracking-wider">Match</span>
                      </div>
                      <Link href={`/jobs/${job.id}`}>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-1.5 border border-white/5"
                        >
                          <span>Apply</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </AnimatedCard>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <AnimatedCard delay={0.4} className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <span>Pipeline</span>
              </h2>
              <Link href="/applications" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {applications.slice(0, 4).map((app, i) => (
                <motion.div 
                  key={app.id} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className="p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors space-y-2 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{app.job?.company || 'Company'}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      app.status === 'WAITING_FOR_APPROVAL' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                      app.status === 'TRACKING' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                      'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}>
                      {app.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{app.job?.title}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.5} className="space-y-4">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Agents Status</span>
            </h2>
            <div className="space-y-2.5">
              {['Greenhouse', 'Lever', 'Ashby', 'Workable'].map((board, i) => (
                <motion.div 
                  key={board}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + (i * 0.1) }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </div>
                    <span className="text-sm text-slate-200 font-bold">{board}</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">Active</span>
                </motion.div>
              ))}
            </div>
          </AnimatedCard>
        </div>
      </div>
    </motion.div>
  );
}
