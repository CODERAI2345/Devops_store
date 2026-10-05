import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { ActivityLog, AccessLog, UserProfile, HubDB } from '../types';

export const ADMIN_EMAILS = ['kailashee042@gmail.com'];

export function isUserAdmin(email?: string | null, role?: string): boolean {
  if (role === 'admin') return true;
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

export function getBrowserDevice(): string {
  if (typeof window === 'undefined') return 'Unknown Client';
  const ua = navigator.userAgent;
  let browser = 'Browser';
  let os = 'Device';

  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';

  if (ua.includes('Win')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  return `${browser} on ${os}`;
}

/**
 * Log an event to the `activity_logs` collection in Firestore.
 */
export async function logActivityEvent(event: {
  userId: string;
  userName?: string;
  userEmail?: string;
  eventType: ActivityLog['event_type'];
  resourceType?: string;
  resourceId?: string | number;
  metadata?: Record<string, any>;
}): Promise<void> {
  try {
    const logRef = doc(collection(db, 'activity_logs'));
    const logData: Record<string, any> = {
      id: logRef.id,
      user_id: event.userId,
      user_name: event.userName || 'DevOps User',
      user_email: event.userEmail || '',
      event_type: event.eventType,
      resource_type: event.resourceType || '',
      resource_id: event.resourceId ? String(event.resourceId) : '',
      metadata: event.metadata || {},
      created_at: serverTimestamp(),
    };
    await setDoc(logRef, logData);
  } catch (err) {
    console.warn('Failed to record activity log:', err);
  }
}

/**
 * Log an authentication access attempt to `access_logs`.
 */
export async function logAccessEvent(params: {
  userId?: string;
  userEmail?: string;
  userName?: string;
  authMethod: AccessLog['auth_method'];
  status: 'success' | 'failed';
}): Promise<void> {
  try {
    const accessRef = doc(collection(db, 'access_logs'));
    const accessData: Record<string, any> = {
      id: accessRef.id,
      user_id: params.userId || '',
      user_email: params.userEmail || '',
      user_name: params.userName || '',
      login_time: serverTimestamp(),
      auth_method: params.authMethod,
      device_browser: getBrowserDevice(),
      ip_address: 'Protected (Client-Side)',
      status: params.status,
    };
    await setDoc(accessRef, accessData);
  } catch (err) {
    console.warn('Failed to record access log:', err);
  }
}

/**
 * Fetch all users from `user_profiles`.
 */
export async function fetchAllUsers(): Promise<UserProfile[]> {
  try {
    const snap = await getDocs(collection(db, 'user_profiles'));
    const users: UserProfile[] = [];
    snap.forEach((d) => {
      const data = d.data();
      users.push({
        uid: d.id,
        email: data.email || null,
        name: data.name || 'Anonymous User',
        role: (data.role || (ADMIN_EMAILS.includes(data.email?.toLowerCase() || '') ? 'admin' : 'user')) as 'admin' | 'user',
        status: (data.status || 'active') as 'active' | 'suspended',
        mobile_number: data.mobile_number || null,
        provider: data.provider || 'google',
        createdAt: data.createdAt,
        last_login: data.last_login || data.createdAt,
      });
    });
    return users;
  } catch (err) {
    console.error('Error fetching users:', err);
    return [];
  }
}

/**
 * Fetch activity logs.
 */
export async function fetchActivityLogs(maxLimit = 100): Promise<ActivityLog[]> {
  try {
    const q = query(collection(db, 'activity_logs'), orderBy('created_at', 'desc'), limit(maxLimit));
    const snap = await getDocs(q);
    const logs: ActivityLog[] = [];
    snap.forEach((d) => {
      logs.push({ id: d.id, ...(d.data() as any) });
    });
    return logs;
  } catch (err) {
    console.warn('Falling back or error in activity logs:', err);
    return [];
  }
}

/**
 * Fetch access logs.
 */
export async function fetchAccessLogs(maxLimit = 100): Promise<AccessLog[]> {
  try {
    const q = query(collection(db, 'access_logs'), orderBy('login_time', 'desc'), limit(maxLimit));
    const snap = await getDocs(q);
    const logs: AccessLog[] = [];
    snap.forEach((d) => {
      logs.push({ id: d.id, ...(d.data() as any) });
    });
    return logs;
  } catch (err) {
    console.warn('Falling back or error in access logs:', err);
    return [];
  }
}

/**
 * Fetch total bookmarks from `user_bookmarks`.
 */
export async function fetchBookmarksCount(): Promise<{ count: number; byType: Record<string, number> }> {
  try {
    const snap = await getDocs(collection(db, 'user_bookmarks'));
    const byType: Record<string, number> = {
      yt: 0,
      ypl: 0,
      git: 0,
      blog: 0,
      lab: 0,
      email: 0,
      lp: 0,
      li: 0,
      ig: 0,
      web: 0,
    };
    snap.forEach((d) => {
      const data = d.data();
      const type = data.itemType || 'yt';
      byType[type] = (byType[type] || 0) + 1;
    });
    return { count: snap.size, byType };
  } catch (err) {
    console.warn('Failed to fetch bookmarks count:', err);
    return { count: 0, byType: {} };
  }
}

/**
 * Update user role or status.
 */
export async function updateUserRole(uid: string, role: 'admin' | 'user'): Promise<void> {
  const ref = doc(db, 'user_profiles', uid);
  await updateDoc(ref, { role });
}

export async function updateUserStatus(uid: string, status: 'active' | 'suspended'): Promise<void> {
  const ref = doc(db, 'user_profiles', uid);
  await updateDoc(ref, { status });
}
