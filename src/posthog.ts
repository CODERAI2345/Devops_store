import posthog from "posthog-js";

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY || "";
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com";

let isPostHogInitialized = false;

export const initPostHog = () => {
  if (typeof window === "undefined" || isPostHogInitialized) return;

  if (POSTHOG_KEY) {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      autocapture: true,
      capture_pageview: false, // We manually capture page_view for precise SPA route tracking
      persistence: "localStorage",
    });
    isPostHogInitialized = true;
  } else {
    // Development or fallback mock logger to prevent crashes and aid testing
    console.info("PostHog initialized in development/fallback mode (no VITE_POSTHOG_KEY provided).");
  }
};

export const trackPostHogEvent = (
  eventName: "page_view" | "signup_completed" | "login" | "logout" | "topic_completed" | "bookmark_added" | string,
  properties?: Record<string, any>
) => {
  try {
    if (POSTHOG_KEY && isPostHogInitialized) {
      posthog.capture(eventName, properties);
    } else {
      // In dev or without key, log to console for visibility
      console.log(`[PostHog Track] ${eventName}:`, properties);
    }
  } catch (err) {
    console.warn("PostHog capture error:", err);
  }
};

export const identifyPostHogUser = (userId: string, traits?: Record<string, any>) => {
  try {
    if (POSTHOG_KEY && isPostHogInitialized) {
      posthog.identify(userId, traits);
    } else {
      console.log(`[PostHog Identify] ${userId}:`, traits);
    }
  } catch (err) {
    console.warn("PostHog identify error:", err);
  }
};

export const resetPostHogUser = () => {
  try {
    if (POSTHOG_KEY && isPostHogInitialized) {
      posthog.reset();
    } else {
      console.log("[PostHog Reset]");
    }
  } catch (err) {
    console.warn("PostHog reset error:", err);
  }
};

export default posthog;
