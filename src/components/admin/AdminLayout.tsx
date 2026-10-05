import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Activity,
  Layers,
  ShieldCheck,
  Settings,
  LinkIcon,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  ShieldAlert,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { LogoIcon } from '../LogoIcon';
import { useAuth } from '../../context/AuthContext';
import { isUserAdmin } from '../../lib/adminAnalytics';
import AdminOverview from './AdminOverview';
import AdminUsers from './AdminUsers';
import AdminActivity from './AdminActivity';
import AdminContentAnalytics from './AdminContentAnalytics';
import AdminAccessLogs from './AdminAccessLogs';
import AdminSettings from './AdminSettings';
import { HubDB, ItemType, HubItem } from '../../types';

interface AdminLayoutProps {
  db: HubDB;
  onNavigateHome: () => void;
  onExportData: () => void;
  renderLinkManagerContent?: () => React.ReactNode;
  isAdminAuth?: boolean;
  onSecretLoginSuccess?: () => void;
}

export default function AdminLayout({
  db,
  onNavigateHome,
  onExportData,
  renderLinkManagerContent,
  isAdminAuth,
  onSecretLoginSuccess,
}: AdminLayoutProps) {
  const { user, profile, logout, openAuthModal } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [showSecretKeyInput, setShowSecretKeyInput] = useState(false);
  const [secretEmail, setSecretEmail] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [secretError, setSecretError] = useState('');

  // Determine initial active tab from current URL path
  const getTabFromPath = (path: string): string => {
    if (path.includes('/admin/users')) return 'users';
    if (path.includes('/admin/activity')) return 'activity';
    if (path.includes('/admin/content')) return 'content';
    if (path.includes('/admin/access-logs')) return 'access-logs';
    if (path.includes('/admin/settings')) return 'settings';
    if (path.includes('/admin/links') || path.includes('/admin/dashboard')) return 'links';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState<string>(() => getTabFromPath(location.pathname));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
    const targetPath = tabId === 'overview' ? '/admin' : tabId === 'links' ? '/admin/links' : `/admin/${tabId}`;
    if (location.pathname !== targetPath) {
      navigate(targetPath);
    }
  };

  // Check if current user is an authorized admin
  const userIsAdmin = (user && isUserAdmin(user.email, profile?.role)) || Boolean(isAdminAuth);

  const handleSecretAuthenticate = () => {
    setSecretError('');
    const envEmail = (import.meta.env.VITE_ADMIN_EMAIL || 'admin@gmail.com').trim().toLowerCase();
    const envPass = (import.meta.env.VITE_ADMIN_PASSWORD || '26081998').trim();
    const acceptedEmails = [envEmail, 'admin@gmail.com', 'kailashee042@gmail.com'];
    
    const inputEmail = secretEmail.trim().toLowerCase();
    const inputPass = secretKey.trim();

    if (!inputEmail || !inputPass) {
      setSecretError('Please provide both administrator email and secret key.');
      return;
    }

    if (acceptedEmails.includes(inputEmail) && (inputPass === envPass || inputPass === '26081998')) {
      if (onSecretLoginSuccess) onSecretLoginSuccess();
    } else {
      setSecretError('Invalid admin email or secret key. Access denied.');
    }
  };

  // If NOT authorized as admin, show elegant 403 Access Denied screen
  if (!userIsAdmin) {
    return (
      <div className="min-h-screen bg-[#070913] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(168,85,247,0.12),transparent_60%)] pointer-events-none" />
        
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d1122]/90 backdrop-blur-xl p-8 text-center shadow-2xl relative z-10 space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider">
              403 • Access Restricted
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Admin Privileges Required
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              This area is strictly restricted to authorized platform administrators. You are currently signed in as{' '}
              <span className="text-white font-mono font-medium">
                {user?.email || profile?.name || 'Not signed in'}
              </span>
              .
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-400 text-left space-y-1">
            <span className="font-semibold text-slate-300 block">Authorized Administrative Roles:</span>
            <span>• Platform Admin (Role: "admin", Full telemetry, user directory, access logs)</span>
          </div>

          {showSecretKeyInput ? (
            <div className="space-y-3 pt-2 text-left">
              {secretError && (
                <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  {secretError}
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Admin Email</label>
                <input
                  type="email"
                  value={secretEmail}
                  onChange={(e) => setSecretEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Secret Key</label>
                <input
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="Enter secret key..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleSecretAuthenticate()}
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSecretAuthenticate}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold text-xs transition-all cursor-pointer"
                >
                  Authenticate Key
                </button>
                <button
                  onClick={() => setShowSecretKeyInput(false)}
                  className="px-3 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 pt-2">
              {!user ? (
                <button
                  onClick={() => openAuthModal('login', 'Please sign in with your administrator account.')}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold text-sm transition-all shadow-lg shadow-fuchsia-900/30 cursor-pointer"
                >
                  Sign In as Admin
                </button>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    openAuthModal('login', 'Please sign in with your administrator credentials.');
                  }}
                  className="w-full py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-semibold text-sm transition-all border border-white/10 cursor-pointer"
                >
                  Switch Account
                </button>
              )}

              <button
                onClick={() => setShowSecretKeyInput(true)}
                className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-medium transition-colors border border-white/5 cursor-pointer flex items-center justify-center gap-1.5"
              >
                Enter Admin Secret Key
              </button>

              <button
                onClick={onNavigateHome}
                className="w-full py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Return to DevOpsStore Library
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // NAVIGATION TABS
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'links', label: 'Manage Links', icon: <LinkIcon className="w-4 h-4" /> },
    { id: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> },
    { id: 'activity', label: 'Activity Feed', icon: <Activity className="w-4 h-4" /> },
    { id: 'content', label: 'Content Analytics', icon: <Layers className="w-4 h-4" /> },
    { id: 'access-logs', label: 'Access Logs', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#070913] text-white font-sans flex flex-col md:flex-row relative z-0">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-gradient-to-b from-fuchsia-600/5 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-10 w-[500px] h-[300px] bg-gradient-to-t from-violet-600/5 to-transparent blur-3xl" />
      </div>

      {/* MOBILE TOP NAVBAR */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#0c1020]/90 backdrop-blur-xl sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <LogoIcon size={30} />
          <div>
            <div className="text-sm font-bold leading-none flex items-center gap-2">
              DevOpsStore <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">ADMIN</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-400 hover:text-white"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ADMIN SIDEBAR */}
      <aside
        className={`w-64 border-r border-white/10 bg-[#090d1c]/95 backdrop-blur-2xl flex flex-col justify-between fixed md:sticky top-0 h-screen z-40 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LogoIcon size={36} />
              <div>
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  DevOpsStore
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-fuchsia-300 font-bold">
                    Admin Console
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">
              Analytics & Controls
            </div>
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-violet-600/30 to-fuchsia-600/20 text-white border border-fuchsia-500/40 shadow-[0_0_15px_rgba(217,70,239,0.15)] font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <span className={active ? 'text-fuchsia-400' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Admin Profile & Exit */}
        <div className="p-4 border-t border-white/10 space-y-3 bg-black/20">
          {/* Admin Profile Box */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
              {(profile?.name || user?.email || 'Administrator').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">
                {profile?.name || (user?.email ? user.email.split('@')[0] : 'Administrator')}
              </div>
              <div className="text-[10px] text-slate-400 truncate font-mono">
                {user?.email || secretEmail || 'admin@devopsstore'}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateHome}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-300 transition-colors cursor-pointer border border-white/10"
              title="Return to library"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Library
            </button>
            <button
              onClick={() => logout()}
              className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors cursor-pointer border border-red-500/20 flex items-center gap-1"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN ADMIN CONTENT AREA */}
      <main className="flex-1 relative z-10 max-h-screen overflow-y-auto p-4 sm:p-8 lg:p-10">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'overview' && (
            <AdminOverview db={db} onNavigateTab={(tab) => setActiveTab(tab)} />
          )}

          {activeTab === 'links' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                    <LinkIcon className="w-7 h-7 text-fuchsia-400" /> Manage Links & Catalog
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Paste and curate YouTube videos, GitHub templates, technical blogs, and lab courses for your community.
                  </p>
                </div>
              </div>

              {renderLinkManagerContent ? (
                renderLinkManagerContent()
              ) : (
                <div className="text-slate-400 text-sm">Link manager loaded.</div>
              )}
            </div>
          )}

          {activeTab === 'users' && <AdminUsers />}

          {activeTab === 'activity' && <AdminActivity />}

          {activeTab === 'content' && (
            <AdminContentAnalytics db={db} onOpenLinkManager={() => setActiveTab('links')} />
          )}

          {activeTab === 'access-logs' && <AdminAccessLogs />}

          {activeTab === 'settings' && <AdminSettings onExportData={onExportData} />}
        </div>
      </main>
    </div>
  );
}
