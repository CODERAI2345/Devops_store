import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { LogoIcon } from './LogoIcon';

/**
 * Standard Firebase Error Mapping
 */
export function getReadableAuthErrorMessage(err: any): string {
  const code = err?.code || '';
  switch (code) {
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled.';
    case 'auth/popup-blocked':
      return 'Your browser blocked the Google sign-in popup. Please allow popups for LinkVault.';
    case 'auth/unauthorized-domain':
      return 'This website domain is not authorized for Google sign-in.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with another sign-in method. Please use your existing method to sign in.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please verify your credentials.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters with mixed letters and numbers.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    default:
      return err?.message || 'Authentication failed. Please try again.';
  }
}

export const AuthModal: React.FC = () => {
  const navigate = useNavigate();
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    authModalMsg,
    signInWithGoogle,
    signInWithGoogleRedirect,
    signInWithGithub,
    signInWithEmail,
    signUpWithEmail,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>(authModalMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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

  // Direct user-initiated Google Authentication Popup
  const handleGoogleClick = async () => {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      await signInWithGoogle();
      closeAuthModal();
      navigate('/feed');
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        // User closed or dismissed the popup window - normal user action, not a crash
        setError('Google sign-in was cancelled.');
      } else if (err?.code === 'auth/popup-blocked') {
        console.warn('[Google Sign-In] Popup was blocked by browser.');
        setError('Your browser blocked the Google sign-in popup. Please allow popups for LinkVault, or use full-page sign-in below.');
      } else {
        console.warn('[Google Sign-In]', err?.code, err?.message);
        setError(getReadableAuthErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  // Direct user-initiated GitHub Authentication Popup
  const handleGithubClick = async () => {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      await signInWithGithub();
      closeAuthModal();
      navigate('/feed');
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        setError('GitHub sign-in was cancelled.');
      } else {
        console.warn('[GitHub Sign-In]', err?.code, err?.message);
        setError(getReadableAuthErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
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
      if (mode === 'signup') {
        await signUpWithEmail(name.trim(), cleanEmail, password);
      } else {
        await signInWithEmail(cleanEmail, password);
      }
      closeAuthModal();
      navigate('/feed');
    } catch (err: any) {
      console.error('[Email Auth Error]', err);
      setError(getReadableAuthErrorMessage(err));
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
                <h3 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                  <span>DevOps Store</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                    Vault ID
                  </span>
                </h3>
                <p className="text-xs text-white/50">
                  {mode === 'login' ? 'Sign in to access interactive roadmaps & bookmarks' : 'Create your free account in seconds'}
                </p>
              </div>
            </div>

            <button
              onClick={closeAuthModal}
              className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {authModalMsg && (
            <div className="mt-3 p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>{authModalMsg}</span>
            </div>
          )}

          {/* Tab Switcher */}
          <div className="mt-4 grid grid-cols-2 p-1 rounded-xl bg-white/[0.04] border border-white/10 text-center">
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
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 space-y-2">
              <div className="flex items-start gap-2">
                <X className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
              {signInWithGoogleRedirect && (error.includes('cancelled') || error.includes('blocked') || error.includes('popup')) && (
                <div className="pl-6 pt-1 border-t border-red-500/20">
                  <button
                    type="button"
                    onClick={() => {
                      setLoading(true);
                      signInWithGoogleRedirect();
                    }}
                    className="text-[11px] text-fuchsia-300 hover:text-fuchsia-200 underline font-medium cursor-pointer flex items-center gap-1"
                  >
                    <span>Popup closed or blocked? Use full-page Google sign-in instead</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              )}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-start gap-2">
              <Check className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Standard Firebase Google Sign-In */}
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleClick}
            className="w-full relative group overflow-hidden flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm text-white/90 bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 hover:border-white/25 transition-all cursor-pointer shadow-sm active:scale-[0.99]"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Standard Firebase GitHub Sign-In */}
          <button
            type="button"
            disabled={loading}
            onClick={handleGithubClick}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm text-white bg-[#24292e] hover:bg-[#2f363d] border border-white/10 transition-all cursor-pointer shadow-sm active:scale-[0.99]"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>Continue with GitHub</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-3">
            <div className="w-full border-t border-white/10" />
            <span className="bg-[#0d1117] px-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">
              Or with email & password
            </span>
            <div className="w-full border-t border-white/10" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmitForm} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 focus:border-fuchsia-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 focus:border-fuchsia-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-white/70">Password</label>
                {mode === 'signup' && password.length > 0 && (
                  <span className="text-[10px] font-medium text-white/50">
                    Strength: <span className="font-semibold text-white">{strengthLabels[strength]}</span>
                  </span>
                )}
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter your password'}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] pl-9 pr-9 py-2 text-xs text-white placeholder-white/30 focus:border-fuchsia-500 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Password strength bar in signup mode */}
              {mode === 'signup' && password.length > 0 && (
                <div className="mt-1.5 flex gap-1">
                  {[0, 1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        strength > level ? strengthColors[strength] : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-900/30 hover:from-violet-500 hover:to-fuchsia-500 transition-all cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In with Email' : 'Create Free Account'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Footer privacy guarantee */}
          <div className="pt-2 text-center text-[10px] text-white/40 flex items-center justify-center gap-1.5 border-t border-white/5">
            <ShieldCheck size={13} className="text-emerald-400" />
            <span>Authenticated securely via Google Cloud Firebase & Firestore RLS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
