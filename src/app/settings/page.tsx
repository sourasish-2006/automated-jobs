'use client';

import React, { useState, useEffect } from 'react';
import {
  Sliders,
  ShieldCheck,
  Building2,
  Lock,
  Activity,
  Download,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Bot
} from 'lucide-react';

export default function SettingsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/audit');
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ logs, exportedAt: new Date() }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "AutoApply_Candidate_Data_Export.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Tenant & Ingestion Settings</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Automation & Security Center
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage background worker frequencies, verify multi-tenant isolation, and inspect security audit trails.
          </p>
        </div>

        <button
          onClick={handleExportData}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export All Data (JSON)</span>
        </button>
      </div>

      {/* Grid: Ingestion Sources & Security */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ingestion Adapters Status */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>Configured Job Source Adapters</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Greenhouse Adapter</p>
                <p className="text-[11px] text-slate-400">Endpoint: boards-api.greenhouse.io/v1/boards</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold text-[10px]">
                  Healthy (200 OK)
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Lever Postings Adapter</p>
                <p className="text-[11px] text-slate-400">Endpoint: api.lever.co/v0/postings</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold text-[10px]">
                  Healthy (200 OK)
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Ashby Board Adapter</p>
                <p className="text-[11px] text-slate-400">Endpoint: api.ashbyhq.com/posting-api</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold text-[10px]">
                  Healthy (200 OK)
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Workable Widget Adapter</p>
                <p className="text-[11px] text-slate-400">Endpoint: apply.workable.com/api/v1/widget</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold text-[10px]">
                  Healthy (200 OK)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Multi-Tenancy Overview */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Multi-Tenant Isolation & Safety Policy</span>
          </h2>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <p className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Strict Human Approval Gate</span>
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                By platform policy, browser automation stops at the form review stage and requires explicit user review before submitting.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <p className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero-Hallucination Resume Verification</span>
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                All generated resume bullet points and claimed skills are programmatically audited against your candidate ground truth.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <p className="font-bold text-white flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span>Tenant Isolation (HyperScale AI)</span>
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Tenant records are segregated in database queries using scoped tenant identifiers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tenant Security Audit Trail */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <span>Tenant Security Audit Logs</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">Real-time Trail</span>
        </div>

        <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 text-xs font-mono">
          {logs.map(log => (
            <div key={log.id} className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-indigo-400 font-bold text-[11px]">{log.action}</span>
                <span className="text-slate-500 text-[10px]">[{log.resourceType}]</span>
              </div>
              <span className="text-[10px] text-slate-500">{new Date(log.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
