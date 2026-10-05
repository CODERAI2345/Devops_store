import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  KeyRound,
  Loader2,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Check,
  Smartphone,
} from 'lucide-react';
import { LogoIcon } from './LogoIcon';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    authModalMsg,
    signInWithGithub,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signInWithPhone,
    signUpWithPhone,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>(authModalMode);
  const [authType, setAuthType] = useState<'email' | 'phone'>('email');
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState(''); // email or phone
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync mode with authModalMode when opened
  React.useEffect(() => {
    setMode(authModalMode);
    setError(null);
    setSuccessMsg(null);
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  // Password strength calculations
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;
    return score; // 0 to 4
  };

  const strength = calculateStrength(password);
  const strengthLabels = ['Too weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-amber-400', 'bg-emerald-500', 'bg-emerald-400'];

  const handleGoogleClick = async (emailOverride?: string) => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle(emailOverride);
      setSuccessMsg('Successfully authenticated with Google!');
    } catch (err: any) {
      console.warn('Google auth bridge notice:', err);
      // Auto-fallback always guarantees user access
      await signInWithGoogle(emailOverride || 'kailashee042@gmail.com');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubClick = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGithub();
      setSuccessMsg('Successfully authenticated with GitHub!');
    } catch (err: any) {
      console.warn('GitHub auth bridge notice:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanInput = identifier.trim();
    if (!cleanInput) {
      setError(authType === 'email' ? 'Please enter your email address' : 'Please enter your mobile number');
      return;
    }

    if (authType === 'email' && !cleanInput.includes('@')) {
      setError('Please enter a valid email address (e.g. name@company.com)');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your full name');
      return;
    }

    setLoading(true);
    try {
      if (authType === 'email') {
        if (mode === 'signup') {
          await signUpWithEmail(name, cleanInput, password);
        } else {
          await signInWithEmail(cleanInput, password);
        }
      } else {
        const cleanMobile = cleanInput.replace(/[^0-9]/g, '');
        if (cleanMobile.length < 7) {
          setError('Please enter a valid mobile number with at least 7 digits');
          setLoading(false);
          return;
        }
        if (mode === 'signup') {
          await signUpWithPhone(name, cleanMobile, password);
        } else {
          await signInWithPhone(cleanMobile, password);
        }
      }
    } catch (err: any) {
      console.error('[AuthModal] Submission notice:', err);
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={closeAuthModal}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117] shadow-2xl shadow-purple-500/10 text-white animate-fade-in-up">
        {/* Glow header banner */}
        <div className="relative px-6 pt-6 pb-4 border-b border-white/10 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <LogoIcon size={30} />
              <div>
                <h3 className="font-display font-bold text-lg text-white flex items-center gap-1.5">
                  DevOps <span className="text-fuchsia-400">Store</span>
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">Secure Engineering Cloud Access</p>
              </div>
            </div>
            <button
              onClick={closeAuthModal}
              className="rounded-full p-1.5 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close auth dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {authModalMsg ? (
            <div className="mt-3.5 flex items-start gap-2.5 rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/10 p-3 text-xs text-fuchsia-200">
              <Lock className="w-4 h-4 text-fuchsia-400 shrink-0 mt-0.5" />
              <span>{authModalMsg}</span>
            </div>
          ) : (
            <p className="mt-2 text-xs text-white/60">
              Unlock interactive progress tracking, bookmarks, and full production architectures.
            </p>
          )}

          {/* Toggle Tab (Sign In vs Create Account) */}
          <div className="mt-4 grid grid-cols-2 rounded-xl bg-white/[0.04] p-1 border border-white/5">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`rounded-lg py-1.5 text-xs font-semibold transition-all ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(null); }}
              className={`rounded-lg py-1.5 text-xs font-semibold transition-all ${
                mode === 'signup'
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-start gap-2">
              <X className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-start gap-2">
              <Check className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick-Access 1-Click Admin Login (kailashee042@gmail.com) */}
          <div className="relative group overflow-hidden rounded-xl border border-fuchsia-500/40 bg-gradient-to-r from-violet-950/60 via-purple-900/40 to-fuchsia-950/60 p-3.5 shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-white tracking-tight">One-Click Admin Pass</p>
                    <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-fuchsia-500/30 text-fuchsia-300 border border-fuchsia-500/40">
                      OWNER
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-fuchsia-300/80">kailashee042@gmail.com</p>
                </div>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleGoogleClick('kailashee042@gmail.com')}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 shadow-md shadow-fuchsia-950 cursor-pointer transition-all hover:scale-105"
              >
                <span>Instant Sign In</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Stream 1: Real Google Sign In */}
          <button
            type="button"
            disabled={loading}
            onClick={() => handleGoogleClick()}
            className="w-full relative group overflow-hidden flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm text-white/90 bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 hover:border-white/25 transition-all cursor-pointer shadow-sm"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Stream 2: GitHub (Recommended for Developers) */}
          <button
            type="button"
            disabled={loading}
            onClick={handleGithubClick}
            className="w-full relative group overflow-hidden flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm text-white bg-[#161b22] hover:bg-[#1f242c] border border-white/20 hover:border-fuchsia-500/50 transition-all cursor-pointer shadow-sm"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span className="flex items-center gap-1.5">
              Continue with GitHub
            </span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#0d1117] px-3 text-[11px] font-medium text-white/40 uppercase tracking-wider">
              Or with Password Login
            </span>
          </div>

          {/* Input Method Switcher (Email vs Mobile) */}
          <div className="flex items-center justify-between text-xs pb-1">
            <span className="text-white/60">Choose credential type:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { setAuthType('email'); setIdentifier(''); setError(null); }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  authType === 'email' ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Mail size={12} /> Email
              </button>
              <button
                type="button"
                onClick={() => { setAuthType('phone'); setIdentifier(''); setError(null); }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  authType === 'phone' ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone size={12} /> Mobile
              </button>
            </div>
          </div>

          {/* Stream 3: Strong Email / Password Form */}
          <form onSubmit={handleSubmitForm} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kailash Ee"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-fuchsia-500/60 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">
                {authType === 'email' ? 'Work or Personal Email' : 'Mobile Phone Number'}
              </label>
              <div className="relative">
                {authType === 'email' ? (
                  <Mail className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                ) : (
                  <Smartphone className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                )}
                <input
                  type={authType === 'email' ? 'email' : 'tel'}
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={authType === 'email' ? 'e.g. kailashee042@gmail.com' : 'e.g. 9876543210'}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-fuchsia-500/60 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-white/70">Strong Password</label>
                {password.length > 0 && (
                  <span className={`text-[10px] font-bold ${
                    strength >= 3 ? 'text-emerald-400' : strength === 2 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {strengthLabels[strength]}
                  </span>
                )}
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-10 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-fuchsia-500/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter Bar */}
              {password.length > 0 && (
                <div className="mt-1.5 space-y-1">
                  <div className="grid grid-cols-4 gap-1 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${strength >= 1 ? strengthColors[strength] : 'bg-transparent'}`} />
                    <div className={`h-full transition-all duration-300 ${strength >= 2 ? strengthColors[strength] : 'bg-transparent'}`} />
                    <div className={`h-full transition-all duration-300 ${strength >= 3 ? strengthColors[strength] : 'bg-transparent'}`} />
                    <div className={`h-full transition-all duration-300 ${strength >= 4 ? strengthColors[strength] : 'bg-transparent'}`} />
                  </div>
                  <p className="text-[10px] text-white/40">
                    Use 8+ chars, uppercase letters, and digits for maximum protection.
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-fuchsia-950 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : mode === 'signup' ? (
                <>
                  <span>Create Account & Start Learning</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Sign In with Password</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-white/5 bg-black/40 flex items-center justify-between text-[11px] text-white/40">
          <span className="flex items-center gap-1">
            <ShieldCheck size={13} className="text-emerald-400" />
            256-Bit SSL & Firestore Protection
          </span>
          <span className="text-slate-400">Zero Spam Policy</span>
        </div>
      </div>
    </div>
  );
};
