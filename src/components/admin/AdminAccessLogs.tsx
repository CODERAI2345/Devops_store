import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  RefreshCw,
  Lock,
  Globe,
  Smartphone,
  Laptop,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { AccessLog } from '../../types';
import { fetchAccessLogs } from '../../lib/adminAnalytics';

export default function AdminAccessLogs() {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failed'>('all');

  const loadLogs = async () => {
    setLoading(true);
    const data = await fetchAccessLogs(100);
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const formatDate = (val: any): string => {
    if (!val) return 'Just now';
    try {
      const d = val.toDate ? val.toDate() : new Date(val);
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return 'Recently';
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      (log.user_email || '').toLowerCase().includes(search.toLowerCase()) ||
      (log.user_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (log.device_browser || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Lock className="w-7 h-7 text-violet-400" /> Security & Access Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Audit trail of authentication attempts, active device signatures, login providers, and security status.
          </p>
        </div>
        <button
          onClick={loadLogs}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-300 transition-colors w-fit cursor-pointer border border-white/10"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Logs
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email, name, or device..."
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
          />
        </div>

        <div className="flex rounded-xl bg-white/[0.04] p-1 border border-white/10 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              statusFilter === 'all' ? 'bg-violet-500/20 text-violet-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('success')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              statusFilter === 'success' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            Success
          </button>
          <button
            onClick={() => setStatusFilter('failed')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              statusFilter === 'failed' ? 'bg-red-500/20 text-red-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            Failed
          </button>
        </div>
      </div>

      {/* Access Logs Table */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03] text-slate-400 text-xs font-semibold">
                <th className="py-3.5 px-4">User / Email</th>
                <th className="py-3.5 px-4">Login Time</th>
                <th className="py-3.5 px-4">Authentication Method</th>
                <th className="py-3.5 px-4">Device & Browser</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    Loading access logs...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No access events found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* User */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">
                          {log.user_name || 'Authenticated User'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {log.user_email || 'No email provided'}
                        </span>
                      </div>
                    </td>

                    {/* Login Time */}
                    <td className="py-3.5 px-4 text-slate-300 font-mono text-xs">
                      {formatDate(log.login_time)}
                    </td>

                    {/* Method */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize bg-white/[0.04] text-slate-200 border border-white/10">
                        {log.auth_method}
                      </span>
                    </td>

                    {/* Device & Browser */}
                    <td className="py-3.5 px-4 text-slate-300 flex items-center gap-2">
                      <Laptop className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{log.device_browser || 'Web Browser'}</span>
                    </td>

                    {/* IP */}
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-xs">
                      {log.ip_address || 'Encrypted Client'}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-right">
                      {log.status === 'success' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                          <XCircle className="w-3 h-3" /> Failed
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
