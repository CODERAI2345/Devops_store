import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, LogOut, Bookmark, CheckCircle2, ChevronDown, User as UserIcon } from 'lucide-react';

export const UserNav: React.FC<{ isLight?: boolean }> = ({ isLight = false }) => {
  const { user, profile, logout, openAuthModal, userProgress, userBookmarks } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  if (!user) {
    return (
      <button
        onClick={() => openAuthModal('login')}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
          isLight
            ? "text-violet-700 hover:text-violet-900 bg-violet-50 hover:bg-violet-100/80 border border-violet-200"
            : "text-slate-200 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10"
        }`}
      >
        <LogIn className={`w-3.5 h-3.5 ${isLight ? "text-violet-500" : "text-slate-400"}`} />
        <span>Sign In</span>
      </button>
    );
  }

  const displayName = profile?.name || user.displayName || (user.email?.startsWith('m_') ? 'Mobile User' : 'Developer');
  const avatarUrl = user.photoURL;
  const completedCount = Object.keys(userProgress).length;
  const bookmarksCount = userBookmarks.size;

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 px-2.5 py-1 rounded-full transition-all cursor-pointer text-left ${
          isLight
            ? "bg-violet-50/80 hover:bg-violet-100/80 border border-violet-200"
            : "bg-white/[0.04] hover:bg-white/[0.08] border border-white/10"
        }`}
        aria-expanded={isOpen}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-6 h-6 rounded-full object-cover border border-fuchsia-500/50"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-[11px] font-bold text-white uppercase shadow-sm">
            {displayName.charAt(0) || 'U'}
          </div>
        )}
        <span className={`text-xs font-medium max-w-[90px] sm:max-w-[120px] truncate ${isLight ? "text-slate-800" : "text-white"}`}>
          {displayName}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isLight ? "text-slate-500" : "text-white/40"} ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-56 rounded-2xl border p-2 shadow-2xl backdrop-blur-xl z-50 animate-fade-in-up ${
          isLight
            ? "border-violet-100 bg-white/95 text-slate-800 shadow-violet-500/10"
            : "border-white/10 bg-[#0d1117] text-white"
        }`}>
          {/* User Brief Info */}
          <div className={`px-3 py-2 border-b mb-1 ${isLight ? "border-slate-100" : "border-white/10"}`}>
            <div className={`font-semibold text-xs truncate ${isLight ? "text-slate-900" : "text-white"}`}>{displayName}</div>
            <div className={`text-[11px] truncate ${isLight ? "text-slate-500" : "text-white/50"}`}>
              {profile?.mobile_number ? `📱 ${profile.mobile_number}` : user.email || 'DevOps Explorer'}
            </div>
            <div className="mt-2 flex items-center gap-2 text-[10px]">
              <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-medium">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {completedCount} Done
              </span>
              <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-medium">
                <Bookmark className="w-3 h-3 text-amber-500" /> {bookmarksCount} Saved
              </span>
            </div>
          </div>

          {/* Logout */}
          <div className="pt-1">
            <button
              onClick={async () => {
                setIsOpen(false);
                await logout();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
