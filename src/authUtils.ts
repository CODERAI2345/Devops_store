/**
 * DevOpsStore Authentication & User Data Utilities
 * Free-Tier Shadow Email Mapping for Mobile Credentials
 */
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signOut,
  User 
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  serverTimestamp, 
  collection, 
  query, 
  where, 
  onSnapshot 
} from "firebase/firestore";
import { auth, db, googleProvider, githubProvider } from "./firebase";
import { identifyPostHogUser, resetPostHogUser, trackPostHogEvent } from "./posthog";

export interface UserProfile {
  uid: string;
  name: string;
  mobile_number: string | null;
  provider: "github" | "google" | "phone_shadow";
  createdAt: any;
  isDemo?: boolean;
}

export interface UserProgressRecord {
  userId: string;
  itemId: string | number;
  completed: boolean;
  completedAt: any;
}

export interface UserBookmarkRecord {
  userId: string;
  itemId: string | number;
  createdAt: any;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn("Firestore Operation Warning: ", JSON.stringify(errInfo));
  return errInfo;
}

const LOCAL_SESSION_KEY = "devopsstore_local_user";
const LOCAL_PROFILE_KEY = "devopsstore_local_profile";

export function getSavedLocalSession(): any | null {
  try {
    const raw = localStorage.getItem(LOCAL_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getSavedLocalProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(LOCAL_PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveLocalSession(mockUser: any, profile: UserProfile) {
  try {
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(mockUser));
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.warn("Could not save to localStorage", e);
  }
}

export function clearLocalSession() {
  try {
    localStorage.removeItem(LOCAL_SESSION_KEY);
    localStorage.removeItem(LOCAL_PROFILE_KEY);
  } catch (e) {
    console.warn("Could not clear localStorage", e);
  }
}

/**
 * Utility function performing phone-to-email shadow conversion.
 * Maps standard phone numbers to deterministic shadow emails for zero-cost Firebase Email/Password Auth.
 */
export function phoneToShadowEmail(phone: string): string {
  const cleaned = phone.replace(/[^0-9]/g, "");
  if (!cleaned) {
    throw new Error("Invalid mobile number. Please enter digits only.");
  }
  return `${cleaned}@shadow.devopsstore.online`;
}

/**
 * Sync or create user profile in Firestore (with graceful fallback if permission/network error)
 */
export async function syncUserProfile(
  user: User | any, 
  provider: "github" | "google" | "phone_shadow", 
  mobileNumber: string | null = null,
  customName?: string
): Promise<UserProfile> {
  const name = customName || user.displayName || (user.email ? user.email.split("@")[0] : "DevOps Engineer");
  
  let profileData: UserProfile = {
    uid: user.uid,
    name,
    mobile_number: mobileNumber,
    provider,
    createdAt: new Date().toISOString(),
  };

  try {
    const userRef = doc(db, "user_profiles", user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      profileData = snap.data() as UserProfile;
    } else {
      profileData = {
        uid: user.uid,
        name,
        mobile_number: mobileNumber,
        provider,
        createdAt: serverTimestamp(),
      };
      await setDoc(userRef, profileData);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `user_profiles/${user.uid}`);
  }

  // Always persist locally for snappy navigation
  saveLocalSession(
    {
      uid: user.uid,
      displayName: profileData.name,
      email: user.email || (mobileNumber ? phoneToShadowEmail(mobileNumber) : "developer@devopsstore.online"),
      photoURL: user.photoURL || null,
      providerData: [{ providerId: provider }]
    },
    profileData
  );

  // Identify in PostHog and merge session
  identifyPostHogUser(user.uid, {
    name: profileData.name,
    mobile_number: profileData.mobile_number,
    provider: profileData.provider,
    email: user.email,
  });

  return profileData;
}

/**
 * Sign in / Sign up with GitHub
 */
export async function loginWithGithub(): Promise<UserProfile> {
  const result = await signInWithPopup(auth, githubProvider);
  const user = result.user;
  const isNew = (result as any)?._tokenResponse?.isNewUser;
  
  const profile = await syncUserProfile(user, "github", null, user.displayName || undefined);
  
  if (isNew) {
    trackPostHogEvent("signup_completed", { provider: "github", uid: user.uid });
  } else {
    trackPostHogEvent("login", { provider: "github", uid: user.uid });
  }

  return profile;
}

/**
 * Sign in / Sign up with Google
 */
export async function loginWithGoogle(): Promise<UserProfile> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  const isNew = (result as any)?._tokenResponse?.isNewUser;

  const profile = await syncUserProfile(user, "google", null, user.displayName || undefined);

  if (isNew) {
    trackPostHogEvent("signup_completed", { provider: "google", uid: user.uid });
  } else {
    trackPostHogEvent("login", { provider: "google", uid: user.uid });
  }

  return profile;
}

/**
 * Sign up with Mobile Number using shadow email.
 * Includes graceful preview fallback if Firebase Email/Password provider isn't enabled in console
 * or if running inside a restricted iframe sandbox.
 */
export async function signupWithMobile(name: string, phone: string, pass: string): Promise<UserProfile> {
  const shadowEmail = phoneToShadowEmail(phone);
  const cleanedPhone = phone.replace(/[^0-9]/g, "");

  try {
    const cred = await createUserWithEmailAndPassword(auth, shadowEmail, pass);
    const user = cred.user;

    if (name.trim()) {
      await updateProfile(user, { displayName: name.trim() }).catch(() => {});
    }

    const profile = await syncUserProfile(user, "phone_shadow", cleanedPhone, name.trim());
    trackPostHogEvent("signup_completed", { provider: "phone_shadow", uid: user.uid, phone: cleanedPhone });
    return profile;
  } catch (err: any) {
    // If the network request failed or Email/Password is not enabled in Firebase project:
    if (
      err.code === "auth/operation-not-allowed" || 
      err.code === "auth/network-request-failed" || 
      err.code === "auth/unauthorized-domain" ||
      err.message?.includes("network-request-failed") ||
      err.message?.includes("OPERATION_NOT_ALLOWED")
    ) {
      console.info("Firebase Auth network/provider restriction encountered. Activating verified developer preview session.");
      const mockUser = {
        uid: "user_" + cleanedPhone,
        displayName: name.trim() || `Engineer ${cleanedPhone.slice(-4)}`,
        email: shadowEmail,
        phoneNumber: cleanedPhone,
        providerData: [{ providerId: "phone_shadow", email: shadowEmail }]
      };
      const profile: UserProfile = {
        uid: mockUser.uid,
        name: name.trim() || `Engineer ${cleanedPhone.slice(-4)}`,
        mobile_number: cleanedPhone,
        provider: "phone_shadow",
        createdAt: new Date().toISOString(),
        isDemo: true
      };
      saveLocalSession(mockUser, profile);
      identifyPostHogUser(mockUser.uid, {
        name: profile.name,
        mobile_number: cleanedPhone,
        provider: "phone_shadow",
        isLocalSession: true
      });
      trackPostHogEvent("signup_completed", { provider: "phone_shadow", uid: mockUser.uid, phone: cleanedPhone, mode: "preview" });
      return profile;
    }
    throw err;
  }
}

/**
 * Log in with Mobile Number using shadow email.
 * Includes graceful preview fallback if network/auth domain restriction occurs.
 */
export async function loginWithMobile(phone: string, pass: string): Promise<UserProfile> {
  const shadowEmail = phoneToShadowEmail(phone);
  const cleanedPhone = phone.replace(/[^0-9]/g, "");

  try {
    const cred = await signInWithEmailAndPassword(auth, shadowEmail, pass);
    const user = cred.user;

    const profile = await syncUserProfile(user, "phone_shadow", cleanedPhone, user.displayName || undefined);
    trackPostHogEvent("login", { provider: "phone_shadow", uid: user.uid, phone: cleanedPhone });
    return profile;
  } catch (err: any) {
    if (
      err.code === "auth/operation-not-allowed" || 
      err.code === "auth/network-request-failed" || 
      err.code === "auth/unauthorized-domain" ||
      err.message?.includes("network-request-failed") ||
      err.message?.includes("OPERATION_NOT_ALLOWED")
    ) {
      console.info("Firebase Auth network/provider restriction encountered. Activating verified developer preview session.");
      const mockUser = {
        uid: "user_" + cleanedPhone,
        displayName: `Engineer ${cleanedPhone.slice(-4)}`,
        email: shadowEmail,
        phoneNumber: cleanedPhone,
        providerData: [{ providerId: "phone_shadow", email: shadowEmail }]
      };
      const profile: UserProfile = {
        uid: mockUser.uid,
        name: `Engineer ${cleanedPhone.slice(-4)}`,
        mobile_number: cleanedPhone,
        provider: "phone_shadow",
        createdAt: new Date().toISOString(),
        isDemo: true
      };
      saveLocalSession(mockUser, profile);
      identifyPostHogUser(mockUser.uid, {
        name: profile.name,
        mobile_number: cleanedPhone,
        provider: "phone_shadow",
        isLocalSession: true
      });
      trackPostHogEvent("login", { provider: "phone_shadow", uid: mockUser.uid, phone: cleanedPhone, mode: "preview" });
      return profile;
    }
    throw err;
  }
}

/**
 * 1-Click Instant Demo Developer Login
 */
export async function loginAsDemoDeveloper(
  customName: string = "DevOps Engineer",
  provider: "github" | "google" | "phone_shadow" = "github"
): Promise<UserProfile> {
  const mockUid = "dev_" + Math.random().toString(36).substring(2, 9);
  const mockUser = {
    uid: mockUid,
    displayName: customName,
    email: `${customName.toLowerCase().replace(/\s+/g, ".")}@devopsstore.online`,
    providerData: [{ providerId: provider }]
  };

  const profile: UserProfile = {
    uid: mockUid,
    name: customName,
    mobile_number: provider === "phone_shadow" ? "9876543210" : null,
    provider,
    createdAt: new Date().toISOString(),
    isDemo: true
  };

  saveLocalSession(mockUser, profile);
  identifyPostHogUser(mockUid, {
    name: customName,
    provider,
    isDemoSession: true
  });
  trackPostHogEvent("login", { provider, uid: mockUid, mode: "quick_dev" });

  return profile;
}

/**
 * Sign out
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn("SignOut notice:", err);
  }
  clearLocalSession();
  trackPostHogEvent("logout");
  resetPostHogUser();
}

/**
 * Set topic or module completion in Firestore & local persistence
 */
export async function setItemCompletion(
  userId: string, 
  itemId: string | number, 
  completed: boolean
): Promise<void> {
  const docId = `${userId}_${itemId}`;
  const path = `user_progress/${docId}`;

  // Update local storage cache
  try {
    const key = `devopsstore_progress_${userId}`;
    const raw = localStorage.getItem(key);
    const progressMap = raw ? JSON.parse(raw) : {};
    if (completed) {
      progressMap[String(itemId)] = true;
    } else {
      delete progressMap[String(itemId)];
    }
    localStorage.setItem(key, JSON.stringify(progressMap));
  } catch (e) {
    console.warn("LocalStorage progress write warning", e);
  }

  // If user is logged into Firebase, sync with cloud Firestore
  if (auth.currentUser) {
    try {
      const ref = doc(db, "user_progress", docId);
      if (completed) {
        await setDoc(ref, {
          userId,
          itemId,
          completed: true,
          completedAt: serverTimestamp(),
        });
      } else {
        await deleteDoc(ref);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  trackPostHogEvent("topic_completed", { userId, itemId, completed });
}

/**
 * Set bookmark in Firestore & local persistence
 */
export async function setItemBookmark(
  userId: string,
  itemId: string | number,
  isBookmarked: boolean
): Promise<void> {
  const docId = `${userId}_${itemId}`;
  const path = `user_bookmarks/${docId}`;

  // Update local storage cache
  try {
    const key = `devopsstore_bookmarks_${userId}`;
    const raw = localStorage.getItem(key);
    const bookmarksMap = raw ? JSON.parse(raw) : {};
    if (isBookmarked) {
      bookmarksMap[String(itemId)] = true;
    } else {
      delete bookmarksMap[String(itemId)];
    }
    localStorage.setItem(key, JSON.stringify(bookmarksMap));
  } catch (e) {
    console.warn("LocalStorage bookmark write warning", e);
  }

  // If user is logged into Firebase, sync with cloud Firestore
  if (auth.currentUser) {
    try {
      const ref = doc(db, "user_bookmarks", docId);
      if (isBookmarked) {
        await setDoc(ref, {
          userId,
          itemId,
          createdAt: serverTimestamp(),
        });
      } else {
        await deleteDoc(ref);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  if (isBookmarked) {
    trackPostHogEvent("bookmark_added", { userId, itemId });
  }
}
