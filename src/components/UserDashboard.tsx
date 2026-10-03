import React, { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { HubDB, HubItem } from '../types';
import {
  ArrowLeft,
  CheckCircle2,
  Bookmark,
  Sparkles,
  LayoutGrid,
  ExternalLink,
  Flame,
  Award,
  BookOpen,
  Search,
  Trash2,
} from 'lucide-react';
import { LogoIcon } from './LogoIcon';

interface UserDashboardProps {
  db: HubDB;
  onSelectItem: (item: any) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ db, onSelectItem }) => {
  const { user, profile, userProgress, userBookmarks, toggleBookmark, toggleProgress, logout } = useAuth();
  const navigate = useNavigate();
  const [bookmarkFilter, setBookmarkFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Collect all items across all collections
  const allItems = useMemo(() => {
    const list: HubItem[] = [];
    Object.keys(db).forEach((key) => {
      const arr = (db as any)[key] || [];
      list.push(...arr);
    });
    return list;
  }, [db]);

  const totalStoreItems = allItems.length || 1;

  // Completed items count & progress percentage
  const completedIds = useMemo(() => {
    return Object.keys(userProgress).filter((k) => userProgress[k]);
  }, [userProgress]);

  const completedCount = completedIds.length;
  const progressPercent = Math.min(100, Math.round((completedCount / Math.max(totalStoreItems, 1)) * 100));

  // Bookmarked items
  const bookmarkedItems = useMemo(() => {
    const map = new Map<string, HubItem>();
    allItems.forEach((item) => {
      map.set(String(item.id), item);
    });

    const result: HubItem[] = [];
    userBookmarks.forEach((id) => {
      const item = map.get(id);
      if (item) {
        result.push(item);
      }
    });

    return result;
  }, [allItems, userBookmarks]);

  // Filter bookmarked items
  const filteredBookmarks = useMemo(() => {
    let list = bookmarkedItems;
    if (bookmarkFilter !== 'all') {
      list = list.filter((item) => item.type === bookmarkFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((item) =>
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.author && item.author.toLowerCase().includes(q))
      );
    }
    return list;
  }, [bookmarkedItems, bookmarkFilter, searchQuery]);

  const displayName = profile?.name || user?.displayName || 'DevOps Engineer';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0F19] to-[#050810] text-white font-sans relative z-0 flex flex-col">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-white/[0.03] border-b border-[#27272A] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/feed')}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors cursor-pointer text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="font-display font-bold text-lg flex items-center gap-2 hover:opacity-80 transition-opacity tracking-tight"
          >
            <LogoIcon size={24} />
            <span className="hidden sm:inline">DevOps <span className="text-fuchsia-400">Store</span></span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-10 space-y-8 relative z-10">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-violet-950/40 via-purple-900/20 to-black/40 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/15 border border-fuchsia-500/30 text-fuchsia-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
                <span>DevOps Learning Workspace</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
                Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-300">{displayName}</span>
              </h1>
              <p className="text-sm text-white/60 max-w-xl">
                Track your hands-on journey across DevOps architectures, GitHub projects, cloud labs, and real-world pipelines.
              </p>
            </div>

            {/* Quick Action Button */}
            <div className="shrink-0 flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/feed')}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-fuchsia-900/30 transition-all cursor-pointer flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Feed</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stat 1: Completed Topics */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/50">Completed Topics</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold text-white">{completedCount}</span>
              <span className="text-xs text-white/40">/ {totalStoreItems} total</span>
            </div>
            <div className="mt-3 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Stat 2: Progress Percentage */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/50">Curriculum Progress</span>
              <div className="w-8 h-8 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold text-white">{progressPercent}%</span>
              <span className="text-xs text-fuchsia-300 font-medium">
                {progressPercent >= 50 ? 'Mastery Path' : 'In Progress'}
              </span>
            </div>
            <div className="mt-3 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Stat 3: Bookmarked Items */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/50">Bookmarks</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Bookmark className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold text-white">{userBookmarks.size}</span>
              <span className="text-xs text-white/40">saved items</span>
            </div>
            <div className="mt-3 text-[11px] text-white/40">
              Personal shortcuts ready for quick recall
            </div>
          </div>

          {/* Stat 4: Account Tier */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/50">Membership</span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-xl font-display font-bold text-purple-200">DevOps Member</span>
            </div>
            <div className="mt-3 text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Free Tier Unlocked
            </div>
          </div>
        </div>

        {/* Bookmarked Shortcuts Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-400" />
                <span>Bookmarked Resources</span>
              </h2>
              <p className="text-xs text-white/50">
                Quick access shortcuts to all the articles, labs, videos, and repositories you saved.
              </p>
            </div>

            {/* Search inside bookmarks */}
            {bookmarkedItems.length > 0 && (
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter bookmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-full pl-9 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-fuchsia-500/50"
                />
              </div>
            )}
          </div>

          {/* Bookmarks List */}
          {bookmarkedItems.length === 0 ? (
            <div className="rounded-2xl border border-white/10 border-dashed bg-white/[0.01] p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-white">No bookmarks yet</h3>
              <p className="text-xs text-white/50 max-w-sm mx-auto">
                Click the bookmark star icon on any card in the feed to save helpful repositories, videos, and labs here.
              </p>
              <button
                onClick={() => navigate('/feed')}
                className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                Browse DevOps Collection
              </button>
            </div>
          ) : filteredBookmarks.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center text-white/50 text-xs">
              No bookmarked items match "{searchQuery}".
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBookmarks.map((item) => {
                const isItemCompleted = Boolean(userProgress[String(item.id)]);
                return (
                  <div
                    key={item.id}
                    className="group rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 p-4 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-white/60 border border-white/10">
                          {item.type}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => toggleProgress(item.id, item.title, item.type)}
                            title={isItemCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isItemCompleted
                                ? 'text-emerald-400 bg-emerald-500/10'
                                : 'text-white/30 hover:text-emerald-400'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleBookmark(item.id, item.title, item.type)}
                            title="Remove Bookmark"
                            className="p-1.5 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h4
                        onClick={() => onSelectItem(item)}
                        className="font-semibold text-sm text-white group-hover:text-fuchsia-300 transition-colors line-clamp-2 cursor-pointer"
                      >
                        {item.title}
                      </h4>

                      {item.description && (
                        <p className="text-xs text-white/50 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
                      <span>{item.date || 'Saved Resource'}</span>
                      <button
                        onClick={() => onSelectItem(item)}
                        className="flex items-center gap-1 text-fuchsia-400 hover:text-fuchsia-300 transition-colors cursor-pointer font-medium"
                      >
                        <span>Open Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
