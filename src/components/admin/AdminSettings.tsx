import React from 'react';
import {
  Shield,
  Download,
  Key,
  Users,
  CheckCircle,
  Database,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { ADMIN_EMAILS } from '../../lib/adminAnalytics';

interface AdminSettingsProps {
  onExportData: () => void;
}

export default function AdminSettings({ onExportData }: AdminSettingsProps) {
  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-4 border-b border-white/10">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <Shield className="w-7 h-7 text-fuchsia-400" /> Platform Security & Access Governance
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Role-based access controls, security policies, and administrative telemetry exports.
        </p>
      </div>

      {/* Role-Based Access Control Card */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Administrator Access Allowlist</h3>
            <p className="text-xs text-slate-400">
              Users with privileged access to the /admin control center and platform metrics.
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          {ADMIN_EMAILS.map((email) => (
            <div
              key={email}
              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-mono text-white font-medium">{email}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                  SUPER ADMIN
                </span>
              </div>
              <span className="text-slate-400">Primary Administrator</span>
            </div>
          ))}
        </div>
      </div>

      {/* Security Policies */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Security & Privacy Guardrails</h3>
            <p className="text-xs text-slate-400">Zero-Trust rules enforced across client and database layers.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle className="w-3.5 h-3.5" /> Row-Level Security (RLS)
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Non-admin users are strictly restricted to their own private bookmarks, profile records, and progress documents.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle className="w-3.5 h-3.5" /> No Credential Exposure
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Passwords, session hashes, and sensitive authentication secrets are blocked from the analytics dashboard.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle className="w-3.5 h-3.5" /> Route Gateways
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Direct access attempts to /admin by normal users trigger 403 authorization lockouts.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle className="w-3.5 h-3.5" /> Audit Logging
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              All sign-ins and content modifications generate tamper-resistant activity streams.
            </p>
          </div>
        </div>
      </div>

      {/* Data Export Card */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-violet-400" /> Export Database & Analytics
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Download JSON backups of the entire resource catalog and platform metadata.
          </p>
        </div>
        <button
          onClick={onExportData}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white text-xs font-semibold transition-all shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4" /> Download Backup JSON
        </button>
      </div>
    </div>
  );
}
