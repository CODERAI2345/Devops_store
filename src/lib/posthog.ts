import posthog from 'posthog-js';

let isInitialized = false;
let isRealClientActive = false;

/**
 * Validates whether the given key is a real, well-formed PostHog Project API Key.
 * Prevents network 401/404 errors caused by default template placeholders.
 */
function isValidPostHogKey(key?: string | null): boolean {
  if (!key) return false;
  const trimmed = key.trim();
  if (
    !trimmed ||
    trimmed.length < 30 ||
    trimmed.includes('your_actual') ||
    trimmed.includes('placeholder') ||
    trimmed.includes('dummy') ||
    trimmed.includes('example') ||
    trimmed.includes('xxx') ||
    !trimmed.startsWith('phc_')
  ) {
    return false;
  }
  return true;
}

/**
 * Initializes PostHog client safely with runtime configuration or fallback gracefully.
 */
export function initPostHog(): void {
  if (isInitialized || typeof window === 'undefined') return;

  const rawKey = import.meta.env.VITE_POSTHOG_KEY || '';
  const apiHost = (import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com').trim();

  if (!isValidPostHogKey(rawKey)) {
    // Run in clean stub mode to prevent 401/404 errors when no production key is configured yet
    if (import.meta.env.DEV) {
      console.info('[PostHog] No valid production API key detected. Running in safe stub mode.');
    }
    isInitialized = true;
    isRealClientActive = false;
    return;
  }

  const apiKey = rawKey.trim();

  try {
    posthog.init(apiKey, {
      api_host: apiHost,
      autocapture: true,
      capture_pageview: false, // We explicitly handle page_view with custom metadata
      capture_pageleave: true,
      persistence: 'localStorage+cookie',
      on_xhr_error: (failedRequest) => {
        // Prevent uncaught errors if adblockers or network restrictions intercept requests
        if (import.meta.env.DEV) {
          console.warn('[PostHog] Request failed:', failedRequest?.status);
        }
      },
      loaded: (ph) => {
        if (import.meta.env.DEV) {
          ph.debug(false);
        }
      },
    });
    isRealClientActive = true;
    isInitialized = true;
  } catch (error) {
    console.warn('[PostHog] Failed to initialize PostHog client:', error);
    isRealClientActive = false;
    isInitialized = true;
  }
}

/**
 * Merges guest session tokens into authenticated user identity.
 */
export function identifyUser(userId: string, traits?: Record<string, any>): void {
  try {
    if (isRealClientActive) {
      posthog.identify(userId, traits);
    }
  } catch (e) {
    console.warn('[PostHog] identify error:', e);
  }
}

/**
 * Resets user identity on logout.
 */
export function resetUser(): void {
  try {
    if (isRealClientActive) {
      posthog.reset();
    }
  } catch (e) {
    console.warn('[PostHog] reset error:', e);
  }
}

/**
 * Unified PostHog event tracking function.
 */
export function trackPostHogEvent(eventName: string, properties?: Record<string, any>): void {
  try {
    if (isRealClientActive) {
      posthog.capture(eventName, {
        timestamp: new Date().toISOString(),
        ...properties,
      });
    }
    // Safe debug log in dev mode
    if (import.meta.env.DEV) {
      console.log(`[PostHog Track] ${eventName}:`, properties);
    }
  } catch (e) {
    console.warn(`[PostHog] track error on ${eventName}:`, e);
  }
}

// Explicit event helpers required by specification:
export const analyticsEvents = {
  pageView: (path: string, extra?: Record<string, any>) =>
    trackPostHogEvent('page_view', { path, ...extra }),

  signupCompleted: (userId: string, provider: string, extra?: Record<string, any>) => {
    identifyUser(userId, { provider, ...extra });
    trackPostHogEvent('signup_completed', { userId, provider, ...extra });
  },

  login: (userId: string, provider: string, extra?: Record<string, any>) => {
    identifyUser(userId, { provider, ...extra });
    trackPostHogEvent('login', { userId, provider, ...extra });
  },

  logout: (userId?: string) => {
    trackPostHogEvent('logout', { userId });
    resetUser();
  },

  topicCompleted: (itemId: string | number, itemTitle: string, category?: string) =>
    trackPostHogEvent('topic_completed', { itemId, itemTitle, category }),

  bookmarkAdded: (itemId: string | number, itemTitle: string, category?: string) =>
    trackPostHogEvent('bookmark_added', { itemId, itemTitle, category }),
};
