import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, LogOut, LayoutDashboard, Bookmark, CheckCircle2, ChevronDown, User as UserIcon } from 'lucide-react';

export const UserNav: React.FC = () => {
  const { user, profile, logout, openAuthModal, userProgress, userBookmarks } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

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
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-md shadow-fuchsia-900/20 transition-all cursor-pointer shrink-0"
      >
        <LogIn className="w-3.5 h-3.5" />
        <span>Log In</span>
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
        className="flex items-center gap-2.5 px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all cursor-pointer text-left"
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
        <span className="text-xs font-medium text-white max-w-[90px] sm:max-w-[120px] truncate">
          {displayName}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-[#0d1117] p-2 shadow-2xl backdrop-blur-xl z-50 animate-fade-in-up">
          {/* User Brief Info */}
          <div className="px-3 py-2 border-b border-white/10 mb-1">
            <div className="font-semibold text-xs text-white truncate">{displayName}</div>
            <div className="text-[11px] text-white/50 truncate">
              {profile?.mobile_number ? `📱 ${profile.mobile_number}` : user.email || 'DevOps Explorer'}
            </div>
            <div className="mt-2 flex items-center gap-2 text-[10px]">
              <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-medium">
                <CheckCircle2 className="w-3 h-3" /> {completedCount} Done
              </span>
              <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 font-medium">
                <Bookmark className="w-3 h-3" /> {bookmarksCount} Saved
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-0.5">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/dashboard');
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                location.pathname === '/dashboard'
                  ? 'bg-fuchsia-500/20 text-fuchsia-300'
                  : 'text-white/80 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-fuchsia-400" />
              <span>Personal Dashboard</span>
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-white/10 mt-1 pt-1">
            <button
              onClick={async () => {
                setIsOpen(false);
                await logout();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
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
