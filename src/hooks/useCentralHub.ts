import { useState, useEffect, useCallback } from "react";
import { HubDB, ItemType, HubItem } from "../types";
import { db, auth } from "../firebase";
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
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function useCentralHub() {
  const [hubDb, setHubDb] = useState<HubDB>({
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
  });
  const [currentTab, setCurrentTab] = useState<ItemType>("yt");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
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
        const newDb: HubDB = { yt: [], ys: [], ypl: [], li: [], lp: [], blog: [], email: [], tw: [], git: [], ig: [] };
        snap.docs.forEach((docSnap) => {
          const data = docSnap.data() as HubItem;
          if (data.type === "yt" && (data as any).pid) {
            (data as any).type = "ypl";
          }
          if (newDb[data.type]) {
            (newDb[data.type] as any[]).push(data);
          }
        });
        setHubDb(newDb);
        setIsInitialLoading(false);
      },
      (err) => {
        console.error("Firestore error:", err);
        showToast("Error loading data", true);
        setIsInitialLoading(false);
        handleFirestoreError(err, OperationType.GET, 'public_items');
      },
    );

    return unsub;
  }, [showToast]);

  const addItem = useCallback(
    async (type: ItemType, item: HubItem) => {
      try {
        const toSave = { ...item };
        if (toSave.type === "ypl") {
          toSave.type = "yt" as any;
        }
        await setDoc(doc(db, `public_items`, item.id.toString()), toSave);
      } catch (e) {
        console.error(e);
        showToast("Failed to add item", true);
        handleFirestoreError(e, OperationType.WRITE, `public_items/${item.id}`);
        throw e;
      }
    },
    [showToast],
  );

  const deleteItem = useCallback(
    async (type: ItemType, id: number | string) => {
      try {
        if (!id) {
          showToast("Invalid ID", true);
          return;
        }
        await deleteDoc(doc(db, `public_items`, String(id)));
        showToast("Removed");
      } catch (e) {
        console.error(e);
        showToast("Failed to delete item", true);
        handleFirestoreError(e, OperationType.DELETE, `public_items/${id}`);
      }
    },
    [showToast],
  );

  const toggleStar = useCallback(
    async (type: ItemType, id: number | string) => {
      const items = hubDb[type];
      const item = items.find((x) => String(x.id) === String(id));
      if (!item) return;

      try {
        await updateDoc(doc(db, `public_items`, String(id)), {
          starred: !item.starred,
        });
        showToast(!item.starred ? "Starred!" : "Unstarred");
      } catch (e) {
        console.error(e);
        showToast("Failed to update star", true);
        handleFirestoreError(e, OperationType.UPDATE, `public_items/${id}`);
      }
    },
    [hubDb, showToast],
  );

  const updateItem = useCallback(
    async (type: ItemType, id: number | string, updates: Partial<HubItem>) => {
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
