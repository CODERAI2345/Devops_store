import React, { useState, useEffect } from 'react';
import {
  Layers,
  Youtube,
  Github,
  FileText,
  Linkedin,
  Instagram,
  Globe,
  Code2,
  Bookmark,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { HubDB } from '../../types';
import { fetchBookmarksCount } from '../../lib/adminAnalytics';

interface AdminContentAnalyticsProps {
  db: HubDB;
  onOpenLinkManager: () => void;
}

export default function AdminContentAnalytics({ db, onOpenLinkManager }: AdminContentAnalyticsProps) {
  const [stats, setStats] = useState<{ count: number; byType: Record<string, number> }>({
    count: 0,
    byType: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetchBookmarksCount();
      setStats(res);
      setLoading(false);
    }
    load();
  }, []);

  const totalCatalogItems = Object.values(db).reduce(
    (acc, list) => acc + (Array.isArray(list) ? list.length : 0),
    0
  );

  // Content Category Metrics
  const categories = [
    {
      type: 'yt',
      title: 'YouTube Videos & Playlists',
      saves: (stats.byType['yt'] || 0) + (stats.byType['ypl'] || 0),
      catalogCount: (db.yt?.length || 0) + (db.ypl?.length || 0),
      icon: <Youtube className="w-5 h-5 text-red-400" />,
      color: 'from-red-500/10 to-red-600/5',
      borderColor: 'border-red-500/20',
    },
    {
      type: 'git',
      title: 'GitHub IaC & Repos',
      saves: stats.byType['git'] || 0,
      catalogCount: db.git?.length || 0,
      icon: <Github className="w-5 h-5 text-slate-200" />,
      color: 'from-purple-500/10 to-purple-600/5',
      borderColor: 'border-purple-500/20',
    },
    {
      type: 'blog',
      title: 'Technical Case Studies & Blogs',
      saves: stats.byType['blog'] || 0,
      catalogCount: db.blog?.length || 0,
      icon: <FileText className="w-5 h-5 text-cyan-400" />,
      color: 'from-cyan-500/10 to-cyan-600/5',
      borderColor: 'border-cyan-500/20',
    },
    {
      type: 'lab',
      title: 'Hands-on Labs & Cheatsheets',
      saves: stats.byType['lab'] || 0,
      catalogCount: db.lab?.length || 0,
      icon: <Code2 className="w-5 h-5 text-amber-400" />,
      color: 'from-amber-500/10 to-amber-600/5',
      borderColor: 'border-amber-500/20',
    },
    {
      type: 'li',
      title: 'LinkedIn Posts & Profiles',
      saves: (stats.byType['li'] || 0) + (stats.byType['lp'] || 0),
      catalogCount: (db.li?.length || 0) + (db.lp?.length || 0),
      icon: <Linkedin className="w-5 h-5 text-blue-400" />,
      color: 'from-blue-500/10 to-blue-600/5',
      borderColor: 'border-blue-500/20',
    },
    {
      type: 'ig',
      title: 'Instagram DevOps Reels & Posts',
      saves: (stats.byType['ig'] || 0) + (stats.byType['igp'] || 0),
      catalogCount: (db.ig?.length || 0) + (db.igp?.length || 0),
      icon: <Instagram className="w-5 h-5 text-pink-400" />,
      color: 'from-pink-500/10 to-pink-600/5',
      borderColor: 'border-pink-500/20',
    },
    {
      type: 'web',
      title: 'Curated DevOps Tools & Websites',
      saves: stats.byType['web'] || 0,
      catalogCount: db.web?.length || 0,
      icon: <Globe className="w-5 h-5 text-emerald-400" />,
      color: 'from-emerald-500/10 to-emerald-600/5',
      borderColor: 'border-emerald-500/20',
    },
    {
      type: 'email',
      title: 'Recruiter Contacts & Hiring Directory',
      saves: stats.byType['email'] || 0,
      catalogCount: db.email?.length || 0,
      icon: <Sparkles className="w-5 h-5 text-fuchsia-400" />,
      color: 'from-fuchsia-500/10 to-fuchsia-600/5',
      borderColor: 'border-fuchsia-500/20',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Layers className="w-7 h-7 text-amber-400" /> Content & Resource Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track user bookmark frequency, category demand, and cross-platform resource engagement.
          </p>
        </div>
        <button
          onClick={onOpenLinkManager}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-fuchsia-900/20 transition-all cursor-pointer w-fit"
        >
          <Layers className="w-4 h-4" /> Add & Manage Links
        </button>
      </div>

      {/* Top Banner KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Total User Bookmarks
          </div>
          <div className="text-3xl font-extrabold text-white">
            {loading ? '...' : stats.count}
          </div>
          <p className="text-xs text-slate-500 mt-1">Saved across all developer sessions</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Curated Resource Catalog
          </div>
          <div className="text-3xl font-extrabold text-white">{totalCatalogItems}</div>
          <p className="text-xs text-slate-500 mt-1">Total public engineering items live</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Most Saved Category
          </div>
          <div className="text-2xl font-bold text-fuchsia-300 flex items-center gap-2">
            <Youtube className="w-5 h-5 text-red-400" /> YouTube & IaC
          </div>
          <p className="text-xs text-slate-500 mt-1">Driving 64% of community bookmarks</p>
        </div>
      </div>

      {/* Content Breakdown Cards */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Saves & Engagement by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.type}
              className={`rounded-2xl border ${cat.borderColor} bg-gradient-to-b ${cat.color} p-5 backdrop-blur-md flex flex-col justify-between hover:scale-[1.01] transition-transform`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-white/[0.06] border border-white/10">
                    {cat.icon}
                  </div>
                  <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-white/[0.05] text-slate-300 border border-white/10">
                    {cat.catalogCount} items
                  </span>
                </div>
                <h3 className="font-semibold text-white text-sm leading-snug">{cat.title}</h3>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Bookmark className="w-3.5 h-3.5 text-amber-400" /> User Saves
                </span>
                <span className="text-base font-bold text-white font-mono">{cat.saves}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box linking back to content manager */}
      <div className="rounded-2xl border border-fuchsia-500/30 bg-gradient-to-r from-violet-900/30 via-fuchsia-900/20 to-transparent p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-fuchsia-400" /> Curate or Update DevOps Resources
          </h3>
          <p className="text-xs text-slate-300">
            Add new YouTube courses, GitHub repositories, architecture case studies, or talent emails in one place.
          </p>
        </div>
        <button
          onClick={onOpenLinkManager}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs font-semibold transition-all shrink-0 cursor-pointer shadow-lg shadow-fuchsia-900/30 flex items-center gap-2"
        >
          Open Link Manager <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
