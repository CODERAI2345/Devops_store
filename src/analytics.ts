import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

const getSessionId = () => {
  let sessionId = sessionStorage.getItem("analytics_session_id");
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem("analytics_session_id", sessionId);
  }
  return sessionId;
};

export const logAnalyticsEvent = async (
  eventType: 'view' | 'like' | 'tab_click' | 'copy',
  data: {
    itemId?: string;
    itemTitle?: string;
    category?: string;
  } = {}
) => {
  try {
    if (!db) return;
    await addDoc(collection(db, "analytics"), {
      eventType,
      sessionId: getSessionId(),
      timestamp: serverTimestamp(),
      ...data
    });
  } catch (error) {
    console.error("Failed to log analytics event", error);
  }
};
