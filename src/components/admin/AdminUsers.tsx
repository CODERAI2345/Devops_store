import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  ArrowUpDown,
  X,
  Shield,
  Calendar,
  Clock,
  Bookmark,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Mail,
  UserCheck,
  UserX,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { fetchAllUsers, updateUserStatus, updateUserRole } from '../../lib/adminAnalytics';

export default function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchAllUsers();
      setUsers(data);
      setLoading(false);
    }
    load();
  }, []);

  const formatDate = (val: any): string => {
    if (!val) return 'Recently';
    try {
      const d = val.toDate ? val.toDate() : new Date(val);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

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

  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => {
        const matchesSearch =
          (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
          (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
          (u.uid || '').toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
          statusFilter === 'all' ? true : (u.status || 'active') === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt || 0).getTime();
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt || 0).getTime();
        return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [users, search, statusFilter, sortOrder]);

  const handleToggleStatus = async (user: UserProfile) => {
    const nextStatus = user.status === 'suspended' ? 'active' : 'suspended';
    try {
      await updateUserStatus(user.uid, nextStatus);
      setUsers((prev) =>
        prev.map((u) => (u.uid === user.uid ? { ...u, status: nextStatus } : u))
      );
      if (selectedUser?.uid === user.uid) {
        setSelectedUser({ ...selectedUser, status: nextStatus });
      }
      setActionSuccess(`User status updated to ${nextStatus}`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to update user status:', err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Users className="w-7 h-7 text-fuchsia-400" /> User Directory & Accounts
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse registered developer profiles, track authentication methods, and inspect activity without exposing sensitive credentials.
          </p>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/10 w-fit">
          Showing {filteredUsers.length} of {users.length} registered users
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> {actionSuccess}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or user ID..."
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500/50"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-white/[0.04] p-1 border border-white/10 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === 'all' ? 'bg-fuchsia-500/20 text-fuchsia-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('suspended')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === 'suspended' ? 'bg-red-500/20 text-red-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              Suspended
            </button>
          </div>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="capitalize">{sortOrder}</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03] text-slate-400 text-xs font-semibold">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Account Created</th>
                <th className="py-3.5 px-4">Last Login</th>
                <th className="py-3.5 px-4">Login Method</th>
                <th className="py-3.5 px-4">Saved Items</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    Loading users directory...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.uid}
                    onClick={() => setSelectedUser(user)}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                  >
                    {/* User Name & Avatar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-white text-xs shadow-sm">
                          {(user.name || 'User').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-white group-hover:text-fuchsia-300 transition-colors flex items-center gap-1.5">
                            {user.name || 'User'}
                            {user.role === 'admin' && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                                ADMIN
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 truncate max-w-[120px]">
                            {user.uid.slice(0, 10)}...
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 text-slate-300">
                      {user.email || (
                        <span className="text-slate-500 italic">No email linked</span>
                      )}
                    </td>

                    {/* Account Created */}
                    <td className="py-3.5 px-4 text-slate-400">
                      {formatDate(user.createdAt)}
                    </td>

                    {/* Last Login */}
                    <td className="py-3.5 px-4 text-slate-300">
                      <span title={formatDate(user.last_login)}>
                        {formatTimeAgo(user.last_login)}
                      </span>
                    </td>

                    {/* Login Method */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize bg-white/[0.04] text-slate-300 border border-white/10">
                        {user.provider}
                      </span>
                    </td>

                    {/* Saved Items count */}
                    <td className="py-3.5 px-4 text-slate-300 font-mono">
                      <span className="inline-flex items-center gap-1">
                        <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                        <span>Active</span>
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          user.status === 'suspended'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            user.status === 'suspended' ? 'bg-red-400' : 'bg-emerald-400'
                          }`}
                        />
                        <span className="capitalize">{user.status || 'active'}</span>
                      </span>
                    </td>

                    {/* View Details */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(user);
                        }}
                        className="text-xs text-fuchsia-400 hover:text-fuchsia-300 font-medium inline-flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        Details <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* USER DETAILS SLIDE-OVER DRAWER */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#0f1422] p-6 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-lg font-bold text-white shadow-md">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {selectedUser.name}
                    {selectedUser.role === 'admin' && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                        ADMIN
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedUser.uid}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-slate-400 block">Email Address</span>
                <span className="text-white font-medium break-all">
                  {selectedUser.email || 'None'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-slate-400 block">Auth Provider</span>
                <span className="text-white font-medium capitalize flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-fuchsia-400" />
                  {selectedUser.provider}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-slate-400 block">Account Created</span>
                <span className="text-white font-medium flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {formatDate(selectedUser.createdAt)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-slate-400 block">Last Login</span>
                <span className="text-white font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  {formatTimeAgo(selectedUser.last_login)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-slate-400 block">Account Status</span>
                <span
                  className={`font-semibold capitalize flex items-center gap-1 ${
                    selectedUser.status === 'suspended' ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      selectedUser.status === 'suspended' ? 'bg-red-400' : 'bg-emerald-400'
                    }`}
                  />
                  {selectedUser.status || 'Active'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-slate-400 block">Role & Permissions</span>
                <span className="text-white font-medium capitalize">
                  {selectedUser.role || 'User'}
                </span>
              </div>
            </div>

            {/* Privacy Shield Notice */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-400 flex items-start gap-2">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Zero sensitive credentials exposed. Passwords, session tokens, and OAuth keys are never displayed or stored in analytics logs.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                onClick={() => handleToggleStatus(selectedUser)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  selectedUser.status === 'suspended'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30'
                }`}
              >
                {selectedUser.status === 'suspended' ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5" /> Reactivate Account
                  </>
                ) : (
                  <>
                    <UserX className="w-3.5 h-3.5" /> Suspend Account
                  </>
                )}
              </button>

              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-slate-300 transition-colors cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
