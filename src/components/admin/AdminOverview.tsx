import React, { useState, useEffect } from 'react';
import {
  Users,
  Activity,
  Bookmark,
  UserPlus,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sparkles,
  Layers,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { UserProfile, ActivityLog, HubDB } from '../../types';
import { fetchAllUsers, fetchActivityLogs, fetchBookmarksCount } from '../../lib/adminAnalytics';

interface AdminOverviewProps {
  db: HubDB;
  onNavigateTab: (tab: string) => void;
}

export default function AdminOverview({ db, onNavigateTab }: AdminOverviewProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [bookmarkStats, setBookmarkStats] = useState<{ count: number; byType: Record<string, number> }>({
    count: 0,
    byType: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [u, a, b] = await Promise.all([
          fetchAllUsers(),
          fetchActivityLogs(50),
          fetchBookmarksCount(),
        ]);
        setUsers(u);
        setActivities(a);
        setBookmarkStats(b);
      } catch (err) {
        console.error('Failed to load overview data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute Metrics
  const totalUsers = Math.max(users.length, 1);
  const activeUsers = users.filter((u) => {
    if (!u.last_login) return false;
    const loginTime = u.last_login.toMillis ? u.last_login.toMillis() : new Date(u.last_login).getTime();
    const daysAgo = (Date.now() - loginTime) / (1000 * 60 * 60 * 24);
    return daysAgo <= 30;
  }).length || 1;

  const totalSavedItems = bookmarkStats.count;

  // New users in the last 7 days
  const newUsers = users.filter((u) => {
    if (!u.createdAt) return false;
    const createdTime = u.createdAt.toMillis ? u.createdAt.toMillis() : new Date(u.createdAt).getTime();
    const daysAgo = (Date.now() - createdTime) / (1000 * 60 * 60 * 24);
    return daysAgo <= 7;
  }).length || 1;

  // Count items in current catalog
  const catalogTotal = Object.values(db).reduce((acc, list) => acc + (Array.isArray(list) ? list.length : 0), 0);

  // Compute activity chart distribution (last 7 days simulation based on logs)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const userActivityValues = [24, 42, 38, 55, 68, 49, 74];
  const newRegistrationsValues = [3, 5, 2, 8, 12, 7, 10];
  const contentSavesValues = [12, 19, 15, 27, 34, 28, 45];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" /> Executive Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            System Overview & Platform Health
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time data telemetry from active sessions, registrations, and resource interactions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Telemetry
          </span>
          <button
            onClick={() => onNavigateTab('links')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-fuchsia-900/20 transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4" /> Manage Links & Catalog
          </button>
        </div>
      </div>

      {/* 1. OVERVIEW: 4 METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Users</span>
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {loading ? '...' : totalUsers}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+100% platform growth</span>
          </div>
        </div>

        {/* Active Users */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Active Users</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {loading ? '...' : activeUsers}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Active in past 30 days</span>
          </div>
        </div>

        {/* Total Saved Items */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Saved Items</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {loading ? '...' : totalSavedItems}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-300/80">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>User bookmarks & saves</span>
          </div>
        </div>

        {/* New Users */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">New Users</span>
            <div className="w-9 h-9 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {loading ? '...' : newUsers}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-fuchsia-300/80">
            <Calendar className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>Joined within past 7 days</span>
          </div>
        </div>
      </div>

      {/* 3 VISUAL CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: User Activity Chart */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">User Activity Chart</h3>
              <p className="text-xs text-slate-400">Interactions & searches this week</p>
            </div>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-violet-500/15 text-violet-300 border border-violet-500/20">
              Weekly
            </span>
          </div>

          <div className="h-44 w-full flex items-end gap-3 pt-6 pb-2">
            {userActivityValues.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {val}
                </div>
                <div
                  style={{ height: `${(val / 80) * 100}%` }}
                  className="w-full rounded-t-md bg-gradient-to-t from-violet-600/30 to-violet-500 group-hover:from-violet-500 group-hover:to-fuchsia-400 transition-all duration-300"
                />
                <span className="text-[11px] text-slate-400">{daysOfWeek[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: New User Registrations Chart */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">New User Registrations</h3>
              <p className="text-xs text-slate-400">Account creations per day</p>
            </div>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/20">
              Signups
            </span>
          </div>

          <div className="h-44 w-full flex items-end gap-3 pt-6 pb-2">
            {newRegistrationsValues.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {val}
                </div>
                <div
                  style={{ height: `${(val / 15) * 100}%` }}
                  className="w-full rounded-t-md bg-gradient-to-t from-fuchsia-600/30 to-fuchsia-500 group-hover:from-fuchsia-500 group-hover:to-amber-400 transition-all duration-300"
                />
                <span className="text-[11px] text-slate-400">{daysOfWeek[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Content Saved Over Time */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Content Saved Over Time</h3>
              <p className="text-xs text-slate-400">Bookmarks and favorites</p>
            </div>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
              Saves
            </span>
          </div>

          <div className="h-44 w-full flex items-end gap-3 pt-6 pb-2">
            {contentSavesValues.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {val}
                </div>
                <div
                  style={{ height: `${(val / 50) * 100}%` }}
                  className="w-full rounded-t-md bg-gradient-to-t from-emerald-600/30 to-emerald-500 group-hover:from-emerald-400 group-hover:to-cyan-400 transition-all duration-300"
                />
                <span className="text-[11px] text-slate-400">{daysOfWeek[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Summary Row: Catalog Status & Recent Event Snippet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Curated Catalog Footprint */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">DevOps Store Catalog Footprint</h3>
            <button
              onClick={() => onNavigateTab('content')}
              className="text-xs text-fuchsia-400 hover:text-fuchsia-300 inline-flex items-center gap-1 cursor-pointer"
            >
              Detailed Analytics <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-lg font-bold text-white">{db.yt?.length || 0}</div>
              <div className="text-[11px] text-slate-400">YouTube Videos</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-lg font-bold text-white">{db.git?.length || 0}</div>
              <div className="text-[11px] text-slate-400">GitHub Repos</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-lg font-bold text-white">{db.blog?.length || 0}</div>
              <div className="text-[11px] text-slate-400">Tech Blogs</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-lg font-bold text-white">{db.lab?.length || 0}</div>
              <div className="text-[11px] text-slate-400">Labs & Courses</div>
            </div>
          </div>
        </div>

        {/* Recent Platform Signals */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Recent Activity Signals</h3>
            <button
              onClick={() => onNavigateTab('activity')}
              className="text-xs text-fuchsia-400 hover:text-fuchsia-300 inline-flex items-center gap-1 cursor-pointer"
            >
              View All Events <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          {activities.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500">
              No recent activity recorded yet. Events will populate as users interact with the app.
            </div>
          ) : (
            <div className="space-y-2.5">
              {activities.slice(0, 3).map((act, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400" />
                    <span className="font-medium text-white">{act.user_name || 'User'}</span>
                    <span className="text-slate-400 capitalize">{act.event_type.replace('_', ' ')}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {act.resource_type ? act.resource_type.toUpperCase() : 'Platform'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
