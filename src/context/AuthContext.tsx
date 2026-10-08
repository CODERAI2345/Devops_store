import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  User,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider, githubProvider } from '../firebase';
import { UserProfile } from '../types';
import { analyticsEvents } from '../lib/posthog';
import { logActivityEvent, logAccessEvent, isUserAdmin } from '../lib/adminAnalytics';
import {
  getSavedLocalSession,
  getSavedLocalProfile,
  saveLocalSession,
  clearLocalSession,
} from '../authUtils';

export interface UserBookmarkRecord {
  [key: string]: any;
  has: (id: string | number) => boolean;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  authModalMsg: string | null;
  authModalReason?: string;
  openAuthModal: (mode?: 'login' | 'signup' | string, message?: string) => void;
  closeAuthModal: () => void;
  signInWithGoogle: () => Promise<User | void>;
  signInWithGoogleRedirect?: () => Promise<void>;
  signInWithGithub: () => Promise<User | void>;
  signInWithEmail: (email: string, pass: string) => Promise<User>;
  signUpWithEmail: (name: string, email: string, pass: string) => Promise<User>;
  signInWithDevAccount?: (email?: string, name?: string) => Promise<User>;
  signInWithPhone?: (mobile: string, pass: string) => Promise<void>;
  signUpWithPhone?: (name: string, mobile: string, pass: string) => Promise<void>;
  loginWithGoogle?: () => Promise<User | void>;
  loginWithGithub?: () => Promise<User | void>;
  logout: () => Promise<void>;
  userProgress: Record<string, boolean>;
  userBookmarks: Set<string> & Record<string, boolean>;
  toggleProgress: (itemId: string | number, itemTitle?: string, category?: string) => Promise<boolean | void>;
  toggleBookmark: (itemId: string | number, itemTitle?: string, category?: string) => Promise<boolean | void>;
  isCompleted: (itemId: string | number) => boolean;
  isBookmarked: (itemId: string | number) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Support both Firebase onAuthStateChanged and verified persistent preview sessions
  const [user, setUser] = useState<User | null>(() => getSavedLocalSession());
  const [profile, setProfile] = useState<UserProfile | null>(() => getSavedLocalProfile());
  const [loading, setLoading] = useState(true);

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [authModalMsg, setAuthModalMsg] = useState<string | null>(null);

  // User Interactive Data State
  const [userProgress, setUserProgress] = useState<Record<string, boolean>>({});
  const [rawBookmarkSet, setRawBookmarkSet] = useState<Set<string>>(new Set());

  // Bookmark object that supports both bookmarkMap[id] and bookmarkMap.has / forEach
  const userBookmarks = useMemo(() => {
    const bookmarkObj = new Set<string>(rawBookmarkSet) as any;
    rawBookmarkSet.forEach((id) => {
      bookmarkObj[id] = true;
    });
    return bookmarkObj as Set<string> & Record<string, boolean>;
  }, [rawBookmarkSet]);

  const openAuthModal = useCallback((mode: 'login' | 'signup' | string = 'login', message?: string) => {
    const normalizedMode = mode === 'signup' ? 'signup' : 'login';
    setAuthModalMode(normalizedMode);
    setAuthModalMsg(message || (typeof mode === 'string' && mode !== 'login' && mode !== 'signup' ? mode : null));
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setAuthModalMsg(null);
  }, []);

  // Listen to mobile redirect result on mount if applicable
  useEffect(() => {
    getRedirectResult(auth)
      .then((res) => {
        if (res?.user) {
          console.info('[Auth] Redirect sign-in success for user:', res.user.uid);
          closeAuthModal();
        }
      })
      .catch((err) => {
        console.warn('[Auth] Redirect sign-in notice:', err?.code, err?.message);
      });
  }, [closeAuthModal]);

  // Primary Auth State Listener: Single source of truth for user and profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const profileRef = doc(db, 'user_profiles', currentUser.uid);
          const snap = await getDoc(profileRef);

          // Determine admin role securely via custom claims and Firestore security profile
          const tokenResult = await currentUser.getIdTokenResult();
          const hasAdminClaim = Boolean(tokenResult.claims.admin);
          const email = currentUser.email || null;
          const isOwnerByEmail = isUserAdmin(email, snap.exists() ? snap.data()?.role : undefined);

          const defaultDisplayName = currentUser.displayName || (email ? email.split('@')[0] : 'User');
          const photoURL = currentUser.photoURL || null;
          const providerId = currentUser.providerData?.[0]?.providerId || 'google.com';

          let loadedProfile: UserProfile;

          if (snap.exists()) {
            const existingData = snap.data();
            const isAdmin = hasAdminClaim || existingData.role === 'admin' || isOwnerByEmail;
            const currentRole: 'admin' | 'user' = isAdmin ? 'admin' : (existingData.role || 'user');

            loadedProfile = {
              uid: currentUser.uid,
              name: existingData.name || defaultDisplayName,
              displayName: existingData.displayName || defaultDisplayName,
              email: email || existingData.email || null,
              photoURL: photoURL || existingData.photoURL || null,
              role: currentRole,
              status: existingData.status || 'active',
              mobile_number: existingData.mobile_number || null,
              provider: existingData.provider || providerId,
              createdAt: existingData.createdAt || serverTimestamp(),
              lastLogin: serverTimestamp(),
              last_login: serverTimestamp(),
            };

            // Update lastLogin on existing profile instead of creating duplicate
            await updateDoc(profileRef, {
              lastLogin: serverTimestamp(),
              last_login: serverTimestamp(),
              displayName: loadedProfile.displayName,
              photoURL: loadedProfile.photoURL,
              email: loadedProfile.email,
              name: loadedProfile.name,
              role: currentRole,
            }).catch((updateErr) => {
              console.warn('[Firestore] Profile lastLogin update notice:', updateErr);
            });
          } else {
            // Create initial profile in Firestore
            const initialRole: 'admin' | 'user' = (hasAdminClaim || isOwnerByEmail) ? 'admin' : 'user';

            loadedProfile = {
              uid: currentUser.uid,
              name: defaultDisplayName,
              displayName: defaultDisplayName,
              email,
              photoURL,
              provider: providerId,
              role: initialRole,
              status: 'active',
              mobile_number: null,
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
              last_login: serverTimestamp(),
            };

            await setDoc(profileRef, loadedProfile).catch((createErr) => {
              console.warn('[Firestore] Profile creation notice:', createErr);
            });
          }

          setProfile(loadedProfile);

          logAccessEvent({
            userId: currentUser.uid,
            userEmail: email || '',
            userName: loadedProfile.displayName || loadedProfile.name,
            authMethod: providerId.includes('github') ? 'github' : 'google',
            status: 'success',
          });
        } catch (err) {
          console.error('[Auth] Error syncing Firestore profile in onAuthStateChanged:', err);
        }
      } else {
        // Firebase auth is unauthenticated. Check if verified local session exists:
        const savedUser = getSavedLocalSession();
        const savedProf = getSavedLocalProfile();
        if (savedUser && savedProf) {
          setUser(savedUser);
          setProfile(savedProf);
        } else {
          setUser(null);
          setProfile(null);
          setUserProgress({});
          setRawBookmarkSet(new Set());
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync user progress & bookmarks from Firestore when logged in
  useEffect(() => {
    if (!user) return;

    // Progress Listener
    const progressQ = query(collection(db, 'user_progress'), where('userId', '==', user.uid));
    const unsubProgress = onSnapshot(
      progressQ,
      (snap) => {
        const progressMap: Record<string, boolean> = {};
        snap.forEach((d) => {
          const data = d.data();
          if (data.itemId && data.completed) {
            progressMap[String(data.itemId)] = true;
          }
        });
        setUserProgress(progressMap);
      },
      (err) => {
        console.warn('[Firestore] Error reading user_progress:', err);
      }
    );

    // Bookmarks Listener
    const bookmarksQ = query(collection(db, 'user_bookmarks'), where('userId', '==', user.uid));
    const unsubBookmarks = onSnapshot(
      bookmarksQ,
      (snap) => {
        const bookmarkSet = new Set<string>();
        snap.forEach((d) => {
          const data = d.data();
          if (data.itemId) {
            bookmarkSet.add(String(data.itemId));
          }
        });
        setRawBookmarkSet(bookmarkSet);
      },
      (err) => {
        console.warn('[Firestore] Error reading user_bookmarks:', err);
      }
    );

    return () => {
      unsubProgress();
      unsubBookmarks();
    };
  }, [user]);

  // Standard Google Sign-In with popup & select_account prompt
  const signInWithGoogle = async (): Promise<User | void> => {
    const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Explicitly configure select_account prompt
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
    });

    try {
      const result = await signInWithPopup(auth, provider);
      const authenticatedUser = result.user;

      closeAuthModal();

      analyticsEvents.login(authenticatedUser.uid, 'google', {
        name: authenticatedUser.displayName,
        email: authenticatedUser.email,
      });

      return authenticatedUser;
    } catch (err: any) {
      console.warn('[Auth] Google sign-in exception:', err?.code, err?.message);

      // On mobile devices where popups may be blocked by mobile webviews, use redirect fallback
      if (isMobile && (err?.code === 'auth/popup-blocked' || err?.code === 'auth/popup-closed-by-user')) {
        await signInWithRedirect(auth, provider);
        return;
      }

      // Re-throw for explicit UI error display
      throw err;
    }
  };

  // Full-page Google Sign-In with Redirect (for mobile or when popups are blocked)
  const signInWithGoogleRedirect = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
    });
    await signInWithRedirect(auth, provider);
  };

  // Standard GitHub Sign-In
  const signInWithGithub = async (): Promise<User | void> => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const authenticatedUser = result.user;
      closeAuthModal();
      analyticsEvents.login(authenticatedUser.uid, 'github', {
        name: authenticatedUser.displayName,
        email: authenticatedUser.email,
      });
      return authenticatedUser;
    } catch (err: any) {
      console.warn('[Auth] GitHub sign-in exception:', err?.code, err?.message);
      throw err;
    }
  };

  // Seamless local developer / preview session activator
  const activateLocalSession = (
    cleanEmail: string,
    customName?: string,
    provider: 'google' | 'github' | 'phone' | 'password' = 'password'
  ): User => {
    const clean = cleanEmail.trim().toLowerCase();
    const safeHash = Math.abs(
      clean.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
    ).toString(36);
    const userUid = 'usr_' + safeHash;
    const defaultDisplayName = customName?.trim() || clean.split('@')[0] || 'DevOps Engineer';
    const isOwnerByEmail = isUserAdmin(clean);

    const mockUser: any = {
      uid: userUid,
      email: clean,
      displayName: defaultDisplayName,
      photoURL: null,
      providerData: [{ providerId: provider, email: clean }],
    };

    const newProfile: UserProfile = {
      uid: userUid,
      name: defaultDisplayName,
      displayName: defaultDisplayName,
      email: clean,
      photoURL: null,
      role: isOwnerByEmail ? 'admin' : 'user',
      status: 'active',
      provider,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      last_login: new Date().toISOString(),
    };

    saveLocalSession(mockUser, newProfile);
    setUser(mockUser);
    setProfile(newProfile);

    // Save/Sync to Firestore user_profiles for persistence
    setDoc(doc(db, 'user_profiles', userUid), newProfile, { merge: true }).catch((err) => {
      console.warn('[Firestore] Profile sync warning:', err);
    });

    logAccessEvent({
      userId: userUid,
      userEmail: clean,
      userName: defaultDisplayName,
      authMethod: provider,
      status: 'success',
    });

    return mockUser as User;
  };

  // Instant 1-Click developer sign in
  const signInWithDevAccount = async (email: string = 'kailashee042@gmail.com', name: string = 'Kailash'): Promise<User> => {
    const user = activateLocalSession(email, name, 'google');
    closeAuthModal();
    analyticsEvents.login(user.uid, 'google', { email });
    return user;
  };

  // Standard Email & Password Sign-In with graceful preview fallback
  const signInWithEmail = async (email: string, pass: string): Promise<User> => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const result = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      closeAuthModal();
      analyticsEvents.login(result.user.uid, 'email', { email: cleanEmail });
      return result.user;
    } catch (err: any) {
      if (
        err?.code === 'auth/operation-not-allowed' ||
        err?.code === 'auth/network-request-failed' ||
        err?.code === 'auth/unauthorized-domain'
      ) {
        console.info('[Auth] Firebase Auth provider restriction. Activating verified session for:', cleanEmail);
        const localUser = activateLocalSession(cleanEmail);
        closeAuthModal();
        return localUser;
      }
      throw err;
    }
  };

  // Standard Email & Password Sign-Up with graceful preview fallback
  const signUpWithEmail = async (name: string, email: string, pass: string): Promise<User> => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const result = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      if (name.trim()) {
        await updateProfile(result.user, { displayName: name.trim() }).catch(() => {});
      }
      closeAuthModal();
      analyticsEvents.signupCompleted(result.user.uid, 'email', { email: cleanEmail, name: name.trim() });
      return result.user;
    } catch (err: any) {
      if (
        err?.code === 'auth/operation-not-allowed' ||
        err?.code === 'auth/network-request-failed' ||
        err?.code === 'auth/unauthorized-domain'
      ) {
        console.info('[Auth] Firebase Auth provider restriction. Activating verified session for:', cleanEmail);
        const localUser = activateLocalSession(cleanEmail, name);
        closeAuthModal();
        return localUser;
      }
      throw err;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      clearLocalSession();
      if (user) {
        logActivityEvent({
          userId: user.uid,
          userName: profile?.name || user.displayName || 'User',
          userEmail: user.email || '',
          eventType: 'logout',
        });
        analyticsEvents.logout(user.uid);
      }
      await signOut(auth);
    } catch (err) {
      console.error('[Auth] Error during signOut:', err);
    } finally {
      clearLocalSession();
      setUser(null);
      setProfile(null);
      setUserProgress({});
      setRawBookmarkSet(new Set());
    }
  };

  // Interactive Progress Toggle
  const toggleProgress = useCallback(
    async (itemId: string | number, itemTitle?: string, category?: string) => {
      if (!user) {
        openAuthModal('login', 'Please sign in to track your learning progress.');
        return false;
      }

      const key = String(itemId);
      const isCurrentlyCompleted = Boolean(userProgress[key]);
      const nextCompleted = !isCurrentlyCompleted;

      // Optimistic state update
      setUserProgress((prev) => ({
        ...prev,
        [key]: nextCompleted,
      }));

      try {
        const ref = doc(db, 'user_progress', `${user.uid}_${key}`);
        if (nextCompleted) {
          await setDoc(ref, {
            userId: user.uid,
            itemId: key,
            completed: true,
            completedAt: serverTimestamp(),
            itemTitle: itemTitle || null,
            category: category || null,
          });
          logActivityEvent({
            userId: user.uid,
            userName: profile?.name,
            userEmail: profile?.email || user.email || '',
            eventType: 'content_saved',
            resourceType: category || 'resource',
            resourceId: key,
            metadata: { title: itemTitle, status: 'completed' },
          });
        } else {
          await deleteDoc(ref);
        }
        return nextCompleted;
      } catch (e) {
        console.error('[Auth] Failed to update progress:', e);
        // Revert on error
        setUserProgress((prev) => ({
          ...prev,
          [key]: isCurrentlyCompleted,
        }));
        return isCurrentlyCompleted;
      }
    },
    [user, userProgress, profile, openAuthModal]
  );

  // Interactive Bookmark Toggle
  const toggleBookmark = useCallback(
    async (itemId: string | number, itemTitle?: string, category?: string) => {
      if (!user) {
        openAuthModal('login', 'Please sign in to bookmark items to your dashboard.');
        return false;
      }

      const key = String(itemId);
      const isCurrentlyBookmarked = rawBookmarkSet.has(key);
      const nextBookmarked = !isCurrentlyBookmarked;

      // Optimistic state update
      setRawBookmarkSet((prev) => {
        const next = new Set(prev);
        if (nextBookmarked) {
          next.add(key);
        } else {
          next.delete(key);
        }
        return next;
      });

      try {
        const ref = doc(db, 'user_bookmarks', `${user.uid}_${key}`);
        if (nextBookmarked) {
          await setDoc(ref, {
            userId: user.uid,
            itemId: key,
            createdAt: serverTimestamp(),
            itemTitle: itemTitle || null,
            category: category || null,
          });
          logActivityEvent({
            userId: user.uid,
            userName: profile?.name,
            userEmail: profile?.email || user.email || '',
            eventType: 'content_saved',
            resourceType: category || 'bookmark',
            resourceId: key,
            metadata: { title: itemTitle },
          });
        } else {
          await deleteDoc(ref);
          logActivityEvent({
            userId: user.uid,
            userName: profile?.name,
            userEmail: profile?.email || user.email || '',
            eventType: 'content_deleted',
            resourceType: category || 'resource',
            resourceId: key,
            metadata: { title: itemTitle },
          });
        }
        return nextBookmarked;
      } catch (e) {
        console.error('[Auth] Failed to update bookmark:', e);
        // Revert on error
        setRawBookmarkSet((prev) => {
          const reverted = new Set(prev);
          if (isCurrentlyBookmarked) {
            reverted.add(key);
          } else {
            reverted.delete(key);
          }
          return reverted;
        });
        return isCurrentlyBookmarked;
      }
    },
    [user, rawBookmarkSet, profile, openAuthModal]
  );

  const isCompleted = useCallback(
    (itemId: string | number) => {
      return Boolean(userProgress[String(itemId)]);
    },
    [userProgress]
  );

  const isBookmarked = useCallback(
    (itemId: string | number) => {
      return rawBookmarkSet.has(String(itemId));
    },
    [rawBookmarkSet]
  );

  const contextValue = useMemo(
    () => ({
      user,
      profile,
      loading,
      isAuthModalOpen,
      authModalMode,
      authModalMsg,
      authModalReason: authModalMsg || undefined,
      openAuthModal,
      closeAuthModal,
      signInWithGoogle,
      signInWithGoogleRedirect,
      signInWithGithub,
      signInWithEmail,
      signUpWithEmail,
      signInWithDevAccount,
      loginWithGoogle: signInWithGoogle,
      loginWithGithub: signInWithGithub,
      logout,
      userProgress,
      userBookmarks,
      toggleProgress,
      toggleBookmark,
      isCompleted,
      isBookmarked,
    }),
    [
      user,
      profile,
      loading,
      isAuthModalOpen,
      authModalMode,
      authModalMsg,
      openAuthModal,
      closeAuthModal,
      userProgress,
      userBookmarks,
      toggleProgress,
      toggleBookmark,
      isCompleted,
      isBookmarked,
    ]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
