import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  Bookmark,
  LogIn,
  LogOut,
  Search,
  Trash2,
  FolderPlus,
  ExternalLink,
  RefreshCw,
  Filter,
  Youtube,
  Github,
  FileText,
  Code2,
  Mail,
  Instagram,
  Globe,
} from 'lucide-react';
import { ActivityLog } from '../../types';
import { fetchActivityLogs } from '../../lib/adminAnalytics';

export default function AdminActivity() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [search, setSearch] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    const data = await fetchActivityLogs(100);
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const formatTimeAgo = (val: any): string => {
    if (!val) return 'Just now';
    try {
      const d = val.toDate ? val.toDate().getTime() : new Date(val).getTime();
      const diffMin = Math.floor((Date.now() - d) / 60000);
      if (diffMin < 1) return 'Just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return 'Recently';
    }
  };

  const getActionLabel = (eventType: ActivityLog['event_type']): string => {
    switch (eventType) {
      case 'content_saved':
        return 'Saved content';
      case 'content_deleted':
        return 'Deleted content';
      case 'content_opened':
        return 'Opened content';
      case 'login':
        return 'User logged in';
      case 'logout':
        return 'User logged out';
      case 'collection_created':
        return 'Created collection';
      case 'search':
        return 'Searched content';
      default:
        return 'Platform interaction';
    }
  };

  const getEventIcon = (eventType: ActivityLog['event_type']) => {
    switch (eventType) {
      case 'content_saved':
        return <Bookmark className="w-4 h-4 text-amber-400" />;
      case 'content_deleted':
        return <Trash2 className="w-4 h-4 text-red-400" />;
      case 'login':
        return <LogIn className="w-4 h-4 text-emerald-400" />;
      case 'logout':
        return <LogOut className="w-4 h-4 text-slate-400" />;
      case 'collection_created':
        return <FolderPlus className="w-4 h-4 text-fuchsia-400" />;
      case 'search':
        return <Search className="w-4 h-4 text-cyan-400" />;
      default:
        return <Activity className="w-4 h-4 text-violet-400" />;
    }
  };

  const getContentTypeDisplay = (type?: string) => {
    if (!type) return { label: 'Platform', icon: null };
    const t = type.toLowerCase();
    if (t === 'yt' || t.includes('youtube')) return { label: 'YouTube', icon: <Youtube className="w-3.5 h-3.5 text-red-400" /> };
    if (t === 'ypl' || t.includes('playlist')) return { label: 'Playlist', icon: <Youtube className="w-3.5 h-3.5 text-red-400" /> };
    if (t === 'git' || t.includes('github')) return { label: 'GitHub', icon: <Github className="w-3.5 h-3.5 text-slate-300" /> };
    if (t === 'blog') return { label: 'Blog', icon: <FileText className="w-3.5 h-3.5 text-cyan-400" /> };
    if (t === 'lab') return { label: 'Lab/Course', icon: <Code2 className="w-3.5 h-3.5 text-amber-400" /> };
    if (t === 'email') return { label: 'Recruiter Email', icon: <Mail className="w-3.5 h-3.5 text-fuchsia-400" /> };
    if (t === 'ig' || t.includes('instagram')) return { label: 'Instagram', icon: <Instagram className="w-3.5 h-3.5 text-pink-400" /> };
    return { label: type.toUpperCase(), icon: <Globe className="w-3.5 h-3.5 text-blue-400" /> };
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesFilter = filterType === 'all' ? true : log.event_type === filterType;
      const matchesSearch =
        (log.user_name || '').toLowerCase().includes(search.toLowerCase()) ||
        (log.resource_type || '').toLowerCase().includes(search.toLowerCase()) ||
        (log.metadata?.title || '').toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [logs, filterType, search]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Activity className="w-7 h-7 text-emerald-400" /> Platform Activity Stream
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time feed of authentication logins, resource saves, collection additions, and catalog interactions.
          </p>
        </div>
        <button
          onClick={loadLogs}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-300 transition-colors w-fit cursor-pointer border border-white/10"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Feed
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user or resource title..."
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Event Type Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {[
            { id: 'all', label: 'All Events' },
            { id: 'content_saved', label: 'Saved' },
            { id: 'login', label: 'Logins' },
            { id: 'content_deleted', label: 'Deleted' },
            { id: 'logout', label: 'Logouts' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-2 rounded-xl font-medium transition-colors whitespace-nowrap cursor-pointer ${
                filterType === tab.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Timeline Table */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03] text-slate-400 text-xs font-semibold">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Content Type</th>
                <th className="py-3.5 px-4">Details / Metadata</th>
                <th className="py-3.5 px-4 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    Loading activity stream...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No matching activity logs recorded yet.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const content = getContentTypeDisplay(log.resource_type);
                  return (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* User */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-violet-600/30 border border-violet-500/40 text-violet-300 flex items-center justify-center font-bold text-xs">
                            {(log.user_name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-white">
                            {log.user_name || 'Anonymous User'}
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/10 text-slate-200">
                          {getEventIcon(log.event_type)}
                          <span className="font-medium">{getActionLabel(log.event_type)}</span>
                        </div>
                      </td>

                      {/* Content Type */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/5 text-slate-300">
                          {content.icon}
                          <span className="font-medium">{content.label}</span>
                        </div>
                      </td>

                      {/* Details / Metadata */}
                      <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">
                        {log.metadata?.title ? (
                          <span className="text-slate-300 font-medium">
                            "{log.metadata.title}"
                          </span>
                        ) : log.resource_id ? (
                          <span className="font-mono text-[11px] text-slate-500">
                            ID: {log.resource_id}
                          </span>
                        ) : (
                          <span className="text-slate-600 italic">Standard session</span>
                        )}
                      </td>

                      {/* Time */}
                      <td className="py-3.5 px-4 text-right font-mono text-slate-400 text-xs">
                        {formatTimeAgo(log.created_at)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
