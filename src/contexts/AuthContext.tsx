import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";
import { 
  UserProfile, 
  syncUserProfile, 
  loginWithGithub as authLoginWithGithub,
  loginWithGoogle as authLoginWithGoogle,
  loginWithMobile as authLoginWithMobile,
  signupWithMobile as authSignupWithMobile,
  loginAsDemoDeveloper,
  logoutUser,
  setItemCompletion,
  setItemBookmark,
  getSavedLocalSession,
  getSavedLocalProfile
} from "../authUtils";

interface AuthContextType {
  user: User | any | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalReason: string;
  openAuthModal: (reason?: string) => void;
  closeAuthModal: () => void;
  loginWithGithub: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithMobile: (phone: string, pass: string) => Promise<void>;
  signupWithMobile: (name: string, phone: string, pass: string) => Promise<void>;
  loginAsDemo: (name?: string, provider?: "github" | "google" | "phone_shadow") => Promise<void>;
  logout: () => Promise<void>;
  userProgress: Record<string, boolean>;
  userBookmarks: Record<string, boolean>;
  toggleProgress: (itemId: string | number) => Promise<void>;
  toggleBookmark: (itemId: string | number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(() => getSavedLocalSession());
  const [profile, setProfile] = useState<UserProfile | null>(() => getSavedLocalProfile());
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState("");
  const [userProgress, setUserProgress] = useState<Record<string, boolean>>({});
  const [userBookmarks, setUserBookmarks] = useState<Record<string, boolean>>({});

  const openAuthModal = useCallback((reason: string = "") => {
    setAuthModalReason(reason);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setAuthModalReason("");
  }, []);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const provider = currentUser.providerData[0]?.providerId === "github.com" 
            ? "github" 
            : currentUser.providerData[0]?.providerId === "google.com" 
            ? "google" 
            : "phone_shadow";

          const p = await syncUserProfile(
            currentUser, 
            provider,
            null,
            currentUser.displayName || undefined
          );
          setProfile(p);
        } catch (err) {
          console.warn("Failed to sync user profile from cloud:", err);
        }
      } else {
        // If not logged in via Firebase, check if user has an active local preview session
        const localUser = getSavedLocalSession();
        const localProf = getSavedLocalProfile();
        if (localUser && localProf) {
          setUser(localUser);
          setProfile(localProf);
        } else {
          setUser(null);
          setProfile(null);
          setUserProgress({});
          setUserBookmarks({});
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync user_progress and user_bookmarks
  useEffect(() => {
    if (!user) {
      setUserProgress({});
      setUserBookmarks({});
      return;
    }

    const uid = user.uid;

    // First load from localStorage for instant 0ms latency
    try {
      const pRaw = localStorage.getItem(`devopsstore_progress_${uid}`);
      if (pRaw) setUserProgress(JSON.parse(pRaw));
      const bRaw = localStorage.getItem(`devopsstore_bookmarks_${uid}`);
      if (bRaw) setUserBookmarks(JSON.parse(bRaw));
    } catch (e) {
      console.warn("Error reading local progress/bookmarks", e);
    }

    // If active Firebase user with network, attach real-time Firestore listeners
    if (auth.currentUser) {
      const qProgress = query(
        collection(db, "user_progress"),
        where("userId", "==", uid)
      );

      const unsubProgress = onSnapshot(
        qProgress,
        (snapshot) => {
          const progressMap: Record<string, boolean> = {};
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            if (data && data.completed) {
              progressMap[String(data.itemId)] = true;
            }
          });
          setUserProgress((prev) => ({ ...prev, ...progressMap }));
          try {
            localStorage.setItem(`devopsstore_progress_${uid}`, JSON.stringify(progressMap));
          } catch {}
        },
        (error) => {
          console.info("Firestore progress listener info:", error.message);
        }
      );

      const qBookmarks = query(
        collection(db, "user_bookmarks"),
        where("userId", "==", uid)
      );

      const unsubBookmarks = onSnapshot(
        qBookmarks,
        (snapshot) => {
          const bookmarksMap: Record<string, boolean> = {};
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            if (data && data.itemId) {
              bookmarksMap[String(data.itemId)] = true;
            }
          });
          setUserBookmarks((prev) => ({ ...prev, ...bookmarksMap }));
          try {
            localStorage.setItem(`devopsstore_bookmarks_${uid}`, JSON.stringify(bookmarksMap));
          } catch {}
        },
        (error) => {
          console.info("Firestore bookmarks listener info:", error.message);
        }
      );

      return () => {
        unsubProgress();
        unsubBookmarks();
      };
    }
  }, [user]);

  const loginWithGithubHandler = async () => {
    const prof = await authLoginWithGithub();
    setProfile(prof);
    setUser(auth.currentUser || getSavedLocalSession());
    closeAuthModal();
  };

  const loginWithGoogleHandler = async () => {
    const prof = await authLoginWithGoogle();
    setProfile(prof);
    setUser(auth.currentUser || getSavedLocalSession());
    closeAuthModal();
  };

  const loginWithMobileHandler = async (phone: string, pass: string) => {
    const prof = await authLoginWithMobile(phone, pass);
    setProfile(prof);
    setUser(auth.currentUser || getSavedLocalSession());
    closeAuthModal();
  };

  const signupWithMobileHandler = async (name: string, phone: string, pass: string) => {
    const prof = await authSignupWithMobile(name, phone, pass);
    setProfile(prof);
    setUser(auth.currentUser || getSavedLocalSession());
    closeAuthModal();
  };

  const loginAsDemoHandler = async (name: string = "DevOps Engineer", provider: "github" | "google" | "phone_shadow" = "github") => {
    const prof = await loginAsDemoDeveloper(name, provider);
    setProfile(prof);
    setUser(getSavedLocalSession());
    closeAuthModal();
  };

  const logoutHandler = async () => {
    await logoutUser();
    setUser(null);
    setProfile(null);
    setUserProgress({});
    setUserBookmarks({});
  };

  // Optimistic Toggle for Progress
  const toggleProgress = async (itemId: string | number) => {
    if (!user) {
      openAuthModal("Log in to track your progress and mark topics as completed.");
      return;
    }

    const key = String(itemId);
    const nextState = !userProgress[key];

    // Optimistic state mutation
    setUserProgress((prev) => {
      const next = { ...prev };
      if (nextState) {
        next[key] = true;
      } else {
        delete next[key];
      }
      return next;
    });

    try {
      await setItemCompletion(user.uid, itemId, nextState);
    } catch (err) {
      console.warn("Progress sync warning:", err);
    }
  };

  // Optimistic Toggle for Bookmarks
  const toggleBookmark = async (itemId: string | number) => {
    if (!user) {
      openAuthModal("Log in to save bookmarks to your personal dashboard.");
      return;
    }

    const key = String(itemId);
    const nextState = !userBookmarks[key];

    // Optimistic state mutation
    setUserBookmarks((prev) => {
      const next = { ...prev };
      if (nextState) {
        next[key] = true;
      } else {
        delete next[key];
      }
      return next;
    });

    try {
      await setItemBookmark(user.uid, itemId, nextState);
    } catch (err) {
      console.warn("Bookmark sync warning:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthModalOpen,
        authModalReason,
        openAuthModal,
        closeAuthModal,
        loginWithGithub: loginWithGithubHandler,
        loginWithGoogle: loginWithGoogleHandler,
        loginWithMobile: loginWithMobileHandler,
        signupWithMobile: signupWithMobileHandler,
        loginAsDemo: loginAsDemoHandler,
        logout: logoutHandler,
        userProgress,
        userBookmarks,
        toggleProgress,
        toggleBookmark,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
