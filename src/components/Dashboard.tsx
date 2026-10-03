import React, { useMemo } from "react";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Bookmark, 
  ExternalLink, 
  Sparkles, 
  Terminal, 
  Layers, 
  Clock, 
  Trophy,
  Star,
  ChevronRight,
  LogOut,
  Maximize2
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { HubDB, HubItem, ItemType } from "../types";
import { LogoIcon } from "./LogoIcon";

interface DashboardProps {
  db: HubDB;
  onBack: () => void;
  onSelectItem: (item: HubItem) => void;
}

export function Dashboard({ db, onBack, onSelectItem }: DashboardProps) {
  const { user, profile, userProgress, userBookmarks, toggleProgress, toggleBookmark, logout } = useAuth();

  const userName = profile?.name || user?.displayName || (user?.email ? user.email.split("@")[0] : "DevOps Engineer");

  // Flatten all items across categories to index bookmarked items and track completion
  const allItems = useMemo(() => {
    const list: HubItem[] = [];
    Object.keys(db).forEach((key) => {
      const arr = db[key as ItemType] || [];
      list.push(...arr);
    });
    return list;
  }, [db]);

  // Bookmarked items list
  const bookmarkedItems = useMemo(() => {
    return allItems.filter((item) => userBookmarks[String(item.id)]);
  }, [allItems, userBookmarks]);

  // Completed items count & list
  const completedCount = useMemo(() => {
    return Object.keys(userProgress).filter((k) => userProgress[k]).length;
  }, [userProgress]);

  // Trackable topics / labs count (prioritizing labs and hands-on modules)
  const totalTrackable = useMemo(() => {
    const labsCount = db.lab?.length || 0;
    const gitCount = db.git?.length || 0;
    const ytCount = db.yt?.length || 0;
    const baseTotal = labsCount + gitCount + ytCount;
    return Math.max(baseTotal, 30); // reasonable baseline benchmark for curriculum
  }, [db]);

  const progressPercentage = useMemo(() => {
    if (totalTrackable === 0) return 0;
    return Math.min(100, Math.round((completedCount / totalTrackable) * 100));
  }, [completedCount, totalTrackable]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0F19] to-[#050810] text-white font-sans relative">
      {/* Background Grid & Ambient Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(139,92,246,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-10 sticky top-0 border-b border-white/10 bg-[#0B0F19]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Library</span>
          </button>
          <div className="hidden sm:flex items-center gap-2 font-display font-bold text-lg">
            <LogoIcon size={26} />
            <span>DevOps <span className="text-fuchsia-400">Store</span></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Logged in as <strong className="text-white">{userName}</strong>
          </span>
          <button
            onClick={() => logout()}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Dashboard Body */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Welcome Banner */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-violet-950/40 via-[#11162b] to-fuchsia-950/30 p-8 sm:p-10 backdrop-blur-xl relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 text-xs font-semibold text-fuchsia-300 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
              DevOps Career Track & Learning Portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Welcome back, <span className="bg-gradient-to-r from-fuchsia-400 to-violet-300 bg-clip-text text-transparent">{userName}</span>
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
              Track your hands-on cloud labs, architectures mastered, and quickly revisit your saved bookmarks.
            </p>
          </div>
        </div>

        {/* Metrics Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1: Completed Topics */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Topics</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold text-white">{completedCount}</div>
              <p className="text-xs text-slate-400 mt-1">Modules marked as mastered</p>
            </div>
          </div>

          {/* Card 2: Overall Progress Percentage */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Progress Percentage</span>
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <Trophy className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">{progressPercentage}%</span>
                <span className="text-xs text-slate-400">({completedCount} / {totalTrackable} benchmarks)</span>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-white/10 h-2 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 3: Saved Bookmarks */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Saved Bookmarks</span>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Bookmark className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold text-white">{bookmarkedItems.length}</div>
              <p className="text-xs text-slate-400 mt-1">Direct shortcut references</p>
            </div>
          </div>
        </div>

        {/* Bookmarked Items Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-400" />
                <span>Your Bookmarked Shortcuts</span>
              </h2>
              <p className="text-xs text-slate-400">Quickly jump back into architectures, repos, and lab guides you've saved.</p>
            </div>
          </div>

          {bookmarkedItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.01] p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center mx-auto mb-3 text-slate-400">
                <Bookmark className="w-6 h-6 text-amber-400/60" />
              </div>
              <h3 className="text-sm font-semibold text-white">No bookmarks yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                Star or bookmark any lab, AWS architecture, or GitHub template while browsing to access it here.
              </p>
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-xs font-semibold text-white shadow-lg hover:brightness-110 transition-all"
              >
                Browse DevOps Library <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookmarkedItems.map((item) => {
                const isCompleted = Boolean(userProgress[String(item.id)]);

                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className="group rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/25 p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20">
                            {item.type.toUpperCase()}
                          </span>
                          {isCompleted && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                              <CheckCircle2 className="w-3 h-3" /> Completed
                            </span>
                          )}
                        </div>

                        {/* Un-bookmark button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(item.id);
                          }}
                          className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-400/10 transition-colors"
                          title="Remove from bookmarks"
                        >
                          <Star className="w-4 h-4 fill-amber-400" />
                        </button>
                      </div>

                      <h3 className="font-bold text-sm text-white group-hover:text-fuchsia-300 transition-colors line-clamp-2">
                        {item.title || "DevOps Resource"}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between text-xs">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleProgress(item.id);
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                          isCompleted
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-white/[0.05] text-slate-300 hover:text-white hover:bg-white/[0.1] border border-white/10"
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isCompleted ? "Completed" : "Mark as Completed"}
                      </button>

                      <div className="flex items-center gap-1 text-slate-400 group-hover:text-white transition-colors text-[11px] font-medium">
                        <span>Open details</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
