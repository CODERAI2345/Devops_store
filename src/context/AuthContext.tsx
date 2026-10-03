import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  User,
  signInWithPopup,
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
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider, githubProvider } from '../firebase';
import { UserProfile } from '../types';
import { phoneToShadowEmail } from '../utils/authShadow';
import { analyticsEvents } from '../lib/posthog';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  authModalMsg: string | null;
  openAuthModal: (mode?: 'login' | 'signup', message?: string) => void;
  closeAuthModal: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signInWithPhone: (mobile: string, pass: string) => Promise<void>;
  signUpWithPhone: (name: string, mobile: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  // Interactive Progress & Bookmarks (with instant optimistic updates)
  userProgress: Record<string, boolean>;
  userBookmarks: Set<string>;
  toggleProgress: (itemId: string | number, itemTitle?: string, category?: string) => Promise<boolean>;
  toggleBookmark: (itemId: string | number, itemTitle?: string, category?: string) => Promise<boolean>;
  isCompleted: (itemId: string | number) => boolean;
  isBookmarked: (itemId: string | number) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [authModalMsg, setAuthModalMsg] = useState<string | null>(null);

  // User Interactive Data State
  const [userProgress, setUserProgress] = useState<Record<string, boolean>>({});
  const [userBookmarks, setUserBookmarks] = useState<Set<string>>(new Set());

  const openAuthModal = useCallback((mode: 'login' | 'signup' = 'login', message?: string) => {
    setAuthModalMode(mode);
    setAuthModalMsg(message || null);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setAuthModalMsg(null);
  }, []);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const profileRef = doc(db, 'user_profiles', currentUser.uid);
          const snap = await getDoc(profileRef);
          if (snap.exists()) {
            setProfile(snap.data() as UserProfile);
          } else {
            // Auto-create profile if missing (e.g. initial Google / GitHub popup)
            const providerId = currentUser.providerData?.[0]?.providerId || 'google';
            const mappedProvider = providerId.includes('github') ? 'github' : 'google';
            const newProfile: UserProfile = {
              uid: currentUser.uid,
              name: currentUser.displayName || 'DevOps Engineer',
              mobile_number: null,
              provider: mappedProvider,
              createdAt: serverTimestamp(),
            };
            await setDoc(profileRef, newProfile);
            setProfile(newProfile);
          }
        } catch (e) {
          console.error('[Auth] Failed to load/sync user profile:', e);
        }
      } else {
        setProfile(null);
        setUserProgress({});
        setUserBookmarks(new Set());
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
    const unsubProgress = onSnapshot(progressQ, (snap) => {
      const progressMap: Record<string, boolean> = {};
      snap.forEach((d) => {
        const data = d.data();
        if (data.itemId && data.completed) {
          progressMap[String(data.itemId)] = true;
        }
      });
      setUserProgress(progressMap);
    }, (err) => {
      console.warn('[Firestore] Error reading user_progress:', err);
    });

    // Bookmarks Listener
    const bookmarksQ = query(collection(db, 'user_bookmarks'), where('userId', '==', user.uid));
    const unsubBookmarks = onSnapshot(bookmarksQ, (snap) => {
      const bookmarkSet = new Set<string>();
      snap.forEach((d) => {
        const data = d.data();
        if (data.itemId) {
          bookmarkSet.add(String(data.itemId));
        }
      });
      setUserBookmarks(bookmarkSet);
    }, (err) => {
      console.warn('[Firestore] Error reading user_bookmarks:', err);
    });

    return () => {
      unsubProgress();
      unsubBookmarks();
    };
  }, [user]);

  // Sign In with Google
  const handleGoogleSignIn = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const isNew = res.user.metadata.creationTime === res.user.metadata.lastSignInTime;
      const profileRef = doc(db, 'user_profiles', res.user.uid);
      const snap = await getDoc(profileRef);

      if (!snap.exists()) {
        const newProf: UserProfile = {
          uid: res.user.uid,
          name: res.user.displayName || 'DevOps Explorer',
          mobile_number: null,
          provider: 'google',
          createdAt: serverTimestamp(),
        };
        await setDoc(profileRef, newProf);
        setProfile(newProf);
      }

      if (isNew) {
        analyticsEvents.signupCompleted(res.user.uid, 'google', { name: res.user.displayName });
      } else {
        analyticsEvents.login(res.user.uid, 'google', { name: res.user.displayName });
      }
      closeAuthModal();
    } catch (err: any) {
      console.error('[Auth] Google sign in failed:', err);
      throw err;
    }
  };

  // Sign In with GitHub (Prominent for developers)
  const handleGithubSignIn = async () => {
    try {
      const res = await signInWithPopup(auth, githubProvider);
      const isNew = res.user.metadata.creationTime === res.user.metadata.lastSignInTime;
      const profileRef = doc(db, 'user_profiles', res.user.uid);
      const snap = await getDoc(profileRef);

      if (!snap.exists()) {
        const newProf: UserProfile = {
          uid: res.user.uid,
          name: res.user.displayName || 'GitHub Engineer',
          mobile_number: null,
          provider: 'github',
          createdAt: serverTimestamp(),
        };
        await setDoc(profileRef, newProf);
        setProfile(newProf);
      }

      if (isNew) {
        analyticsEvents.signupCompleted(res.user.uid, 'github', { name: res.user.displayName });
      } else {
        analyticsEvents.login(res.user.uid, 'github', { name: res.user.displayName });
      }
      closeAuthModal();
    } catch (err: any) {
      console.error('[Auth] GitHub sign in failed:', err);
      throw err;
    }
  };

  // Custom Mobile Credential Login
  const handlePhoneSignIn = async (mobile: string, pass: string) => {
    const shadowEmail = phoneToShadowEmail(mobile);
    const res = await signInWithEmailAndPassword(auth, shadowEmail, pass);
    analyticsEvents.login(res.user.uid, 'phone', { mobile });
    closeAuthModal();
  };

  // Custom Mobile Credential Sign-Up
  const handlePhoneSignUp = async (name: string, mobile: string, pass: string) => {
    const shadowEmail = phoneToShadowEmail(mobile);
    const res = await createUserWithEmailAndPassword(auth, shadowEmail, pass);
    
    // Set display name in Firebase Auth
    if (name.trim()) {
      await updateProfile(res.user, { displayName: name.trim() });
    }

    // Save profile to user_profiles collection in Firestore
    const newProfile: UserProfile = {
      uid: res.user.uid,
      name: name.trim() || 'DevOps Engineer',
      mobile_number: mobile.trim(),
      provider: 'phone',
      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, 'user_profiles', res.user.uid), newProfile);
    setProfile(newProfile);

    analyticsEvents.signupCompleted(res.user.uid, 'phone', { name, mobile });
    closeAuthModal();
  };

  // Logout
  const handleLogout = async () => {
    const uid = user?.uid;
    await signOut(auth);
    analyticsEvents.logout(uid);
  };

  // Interactive "Mark as Completed" with instant optimistic mutations
  const toggleProgress = useCallback(async (
    itemId: string | number,
    itemTitle: string = 'Topic',
    category?: string
  ): Promise<boolean> => {
    if (!user) {
      openAuthModal('login', 'Please sign in to mark topics as completed and track your roadmap progress.');
      return false;
    }

    const key = String(itemId);
    const currentCompleted = Boolean(userProgress[key]);
    const nextCompleted = !currentCompleted;

    // Optimistic UI mutation
    setUserProgress((prev) => ({
      ...prev,
      [key]: nextCompleted,
    }));

    try {
      const docId = `${user.uid}_${key}`;
      const ref = doc(db, 'user_progress', docId);

      await setDoc(ref, {
        userId: user.uid,
        itemId: key,
        completed: nextCompleted,
        completedAt: serverTimestamp(),
      });

      if (nextCompleted) {
        analyticsEvents.topicCompleted(key, itemTitle, category);
      }
      return true;
    } catch (e) {
      console.error('[Auth] Failed to update progress:', e);
      // Revert optimistic update on failure
      setUserProgress((prev) => ({
        ...prev,
        [key]: currentCompleted,
      }));
      return false;
    }
  }, [user, userProgress, openAuthModal]);

  // Interactive "Bookmark" with instant optimistic mutations
  const toggleBookmark = useCallback(async (
    itemId: string | number,
    itemTitle: string = 'Resource',
    category?: string
  ): Promise<boolean> => {
    if (!user) {
      openAuthModal('login', 'Please sign in to bookmark items to your personal learning dashboard.');
      return false;
    }

    const key = String(itemId);
    const isCurrentlyBookmarked = userBookmarks.has(key);
    const nextBookmarked = !isCurrentlyBookmarked;

    // Optimistic UI mutation
    setUserBookmarks((prev) => {
      const updated = new Set(prev);
      if (nextBookmarked) {
        updated.add(key);
      } else {
        updated.delete(key);
      }
      return updated;
    });

    try {
      const docId = `${user.uid}_${key}`;
      const ref = doc(db, 'user_bookmarks', docId);

      if (nextBookmarked) {
        await setDoc(ref, {
          userId: user.uid,
          itemId: key,
          createdAt: serverTimestamp(),
        });
        analyticsEvents.bookmarkAdded(key, itemTitle, category);
      } else {
        await deleteDoc(ref);
      }
      return true;
    } catch (e) {
      console.error('[Auth] Failed to update bookmark:', e);
      // Revert optimistic update on error
      setUserBookmarks((prev) => {
        const reverted = new Set(prev);
        if (isCurrentlyBookmarked) {
          reverted.add(key);
        } else {
          reverted.delete(key);
        }
        return reverted;
      });
      return false;
    }
  }, [user, userBookmarks, openAuthModal]);

  const isCompleted = useCallback((itemId: string | number) => {
    return Boolean(userProgress[String(itemId)]);
  }, [userProgress]);

  const isBookmarked = useCallback((itemId: string | number) => {
    return userBookmarks.has(String(itemId));
  }, [userBookmarks]);

  const contextValue = useMemo(() => ({
    user,
    profile,
    loading,
    isAuthModalOpen,
    authModalMode,
    authModalMsg,
    openAuthModal,
    closeAuthModal,
    signInWithGoogle: handleGoogleSignIn,
    signInWithGithub: handleGithubSignIn,
    signInWithPhone: handlePhoneSignIn,
    signUpWithPhone: handlePhoneSignUp,
    logout: handleLogout,
    userProgress,
    userBookmarks,
    toggleProgress,
    toggleBookmark,
    isCompleted,
    isBookmarked,
  }), [
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
  ]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
