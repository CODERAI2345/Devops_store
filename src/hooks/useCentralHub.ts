import { useState, useEffect, useCallback } from "react";
import { HubDB, ItemType, HubItem } from "../types";
import { db, auth } from "../firebase";
import { SEED_THREADS_ITEMS } from "../data/seedThreads";
import { isThreadsUrl, isInstagramReelUrl } from "../utils";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
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
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
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
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

const CACHE_KEY = "centralhub_cached_db_v2";

function getInitialDb(): { db: HubDB; hasCache: boolean } {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as HubDB;
      if (parsed && typeof parsed === "object" && Array.isArray(parsed.yt)) {
        return { db: parsed, hasCache: true };
      }
    }
  } catch (e) {
    console.warn("Could not read cached hubDb", e);
  }

  return {
    db: {
      yt: [],
      ys: [],
      ypl: [],
      li: [],
      lp: [],
      blog: [],
      email: [],
      tw: [],
      git: [],
      ig: [],
      igp: [],
      th: [...SEED_THREADS_ITEMS],
      web: [],
      lab: [],
    },
    hasCache: false,
  };
}

export function useCentralHub() {
  const initialData = getInitialDb();
  const [hubDb, setHubDb] = useState<HubDB>(initialData.db);
  const [currentTab, setCurrentTab] = useState<ItemType>("yt");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(!initialData.hasCache);
  const [toastMsg, setToastMsg] = useState<{
    msg: string;
    err?: boolean;
  } | null>(null);

  const showToast = useCallback((msg: string, err = false) => {
    setToastMsg({ msg, err });
    setTimeout(() => setToastMsg(null), 2500);
  }, []);

  useEffect(() => {
    const q = query(collection(db, `public_items`), orderBy("ts", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const newDb: HubDB = { yt: [], ys: [], ypl: [], li: [], lp: [], blog: [], email: [], tw: [], git: [], ig: [], igp: [], th: [], web: [], lab: [] };
        
        snap.docs.forEach((docSnap) => {
          const data = docSnap.data() as HubItem;
          // In-memory normalization - zero network writes during snapshot reads
          if (data.type === "yt" && (data as any).pid) {
            (data as any).type = "ypl";
          } else if (
            (data.type === "igp" || data.type === "web" || !data.type) &&
            data.url &&
            isInstagramReelUrl(data.url)
          ) {
            // Re-route actual reels that were mistakenly stored as igp/web back to 'ig'
            (data as any).type = "ig";
          } else if ((data.type === "web" || !data.type) && data.url && isThreadsUrl(data.url)) {
            (data as any).type = "th";
          }

          if (newDb[data.type]) {
            (newDb[data.type] as any[]).push(data);
          }
        });

        if (newDb.th.length === 0) {
          newDb.th = [...SEED_THREADS_ITEMS];
        }

        setHubDb(newDb);
        setIsInitialLoading(false);

        // Asynchronously persist to local cache for instant zero-latency future visits
        try {
          requestIdleCallback
            ? requestIdleCallback(() => localStorage.setItem(CACHE_KEY, JSON.stringify(newDb)))
            : setTimeout(() => localStorage.setItem(CACHE_KEY, JSON.stringify(newDb)), 50);
        } catch (err) {
          // Ignore quota errors
        }
      },
      (err) => {
        console.error("Firestore error:", err);
        showToast("Error syncing with cloud, using local cache", true);
        setIsInitialLoading(false);
        handleFirestoreError(err, OperationType.GET, 'public_items');
      },
    );

    return unsub;
  }, [showToast]);

  const addItem = useCallback(
    async (type: ItemType, item: HubItem) => {
      // Optimistic addition for instantaneous UI response
      setHubDb((prev) => {
        const targetType = item.type || type;
        const currentList = prev[targetType] || [];
        return {
          ...prev,
          [targetType]: [item, ...currentList.filter((x) => x.id !== item.id)],
        };
      });

      try {
        const toSave = { ...item };
        if (toSave.type === "ypl") {
          toSave.type = "yt" as any;
        }
        await setDoc(doc(db, `public_items`, item.id.toString()), toSave);
      } catch (e) {
        console.error(e);
        // Rollback optimistic addition on error
        setHubDb((prev) => {
          const targetType = item.type || type;
          return {
            ...prev,
            [targetType]: (prev[targetType] || []).filter((x) => x.id !== item.id),
          };
        });
        showToast("Failed to add item", true);
        handleFirestoreError(e, OperationType.WRITE, `public_items/${item.id}`);
        throw e;
      }
    },
    [showToast],
  );

  const deleteItem = useCallback(
    async (type: ItemType, id: number | string) => {
      if (!id) {
        showToast("Invalid ID", true);
        return;
      }

      // Find item for rollback
      let previousItem: HubItem | undefined;
      setHubDb((prev) => {
        previousItem = (prev[type] || []).find((x) => String(x.id) === String(id));
        return {
          ...prev,
          [type]: (prev[type] || []).filter((x) => String(x.id) !== String(id)),
        };
      });

      try {
        await deleteDoc(doc(db, `public_items`, String(id)));
        showToast("Removed");
      } catch (e) {
        console.error(e);
        // Rollback optimistic deletion on error
        if (previousItem) {
          setHubDb((prev) => ({
            ...prev,
            [type]: [previousItem!, ...(prev[type] || [])],
          }));
        }
        showToast("Failed to delete item", true);
        handleFirestoreError(e, OperationType.DELETE, `public_items/${id}`);
      }
    },
    [showToast],
  );

  const toggleStar = useCallback(
    async (type: ItemType, id: number | string) => {
      // Optimistic star toggle for zero perceived latency
      setHubDb((prev) => {
        const list = prev[type] || [];
        return {
          ...prev,
          [type]: list.map((x) =>
            String(x.id) === String(id) ? { ...x, starred: !x.starred } : x
          ),
        };
      });

      const items = hubDb[type] || [];
      const item = items.find((x) => String(x.id) === String(id));
      const willBeStarred = item ? !item.starred : true;
      showToast(willBeStarred ? "Starred!" : "Unstarred");

      try {
        await updateDoc(doc(db, `public_items`, String(id)), {
          starred: willBeStarred,
        });
      } catch (e) {
        console.error(e);
        // Rollback optimistic star
        setHubDb((prev) => {
          const list = prev[type] || [];
          return {
            ...prev,
            [type]: list.map((x) =>
              String(x.id) === String(id) ? { ...x, starred: !willBeStarred } : x
            ),
          };
        });
        showToast("Failed to update star", true);
        handleFirestoreError(e, OperationType.UPDATE, `public_items/${id}`);
      }
    },
    [hubDb, showToast],
  );

  const updateItem = useCallback(
    async (type: ItemType, id: number | string, updates: Partial<HubItem>) => {
      // Optimistic update
      setHubDb((prev) => {
        if (updates.type && updates.type !== type) {
          const oldList = prev[type] || [];
          const itemToMove = oldList.find((x) => String(x.id) === String(id));
          if (itemToMove) {
            const updatedItem = { ...itemToMove, ...updates };
            const targetType = updates.type as ItemType;
            const targetList = prev[targetType] || [];
            return {
              ...prev,
              [type]: oldList.filter((x) => String(x.id) !== String(id)),
              [targetType]: [updatedItem, ...targetList],
            };
          }
        }
        const list = prev[type] || [];
        return {
          ...prev,
          [type]: list.map((x) =>
            String(x.id) === String(id) ? { ...x, ...updates } : x
          ),
        };
      });

      try {
        const toSave = { ...updates };
        if (toSave.type === "ypl") {
          toSave.type = "yt" as any;
        }
        await updateDoc(doc(db, `public_items`, String(id)), toSave);
      } catch (e) {
        console.error(e);
        showToast("Failed to update item", true);
        handleFirestoreError(e, OperationType.UPDATE, `public_items/${id}`);
      }
    },
    [showToast],
  );

  return {
    db: hubDb,
    currentTab,
    setCurrentTab,
    searchQuery,
    setSearchQuery,
    searchDate,
    setSearchDate,
    showStarredOnly,
    setShowStarredOnly,
    isInitialLoading,
    addItem,
    deleteItem,
    toggleStar,
    updateItem,
    toastMsg,
    showToast,
  };
}
