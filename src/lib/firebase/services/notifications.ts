
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  addDoc,
  onSnapshot
} from "firebase/firestore";
import { firestore } from "../client-app";
import { Notification } from "../../types";

const sanitizeForFirestore = (data: any) => {
  const result = { ...data };
  Object.keys(result).forEach((key) => {
    if (result[key] === undefined) delete result[key];
  });
  return result;
};

export async function getNotifications(tenantId: string, userId: string): Promise<Notification[]> {
  const ref = collection(firestore, `tenants/${tenantId}/notifications`);
  const q = query(ref, where("userId", "==", userId), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp).toDate(),
  })) as Notification[];
}

export function subscribeToNotifications(tenantId: string, userId: string, callback: (notifications: Notification[]) => void) {
  const ref = collection(firestore, `tenants/${tenantId}/notifications`);
  const q = query(ref, where("userId", "==", userId), orderBy("createdAt", "desc"));
  
  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate(),
    })) as Notification[];
    callback(notifications);
  });
}

export async function createNotification(tenantId: string, notification: Omit<Notification, "id" | "createdAt" | "read">): Promise<string> {
  const ref = collection(firestore, `tenants/${tenantId}/notifications`);
  const docRef = await addDoc(ref, sanitizeForFirestore({
    ...notification,
    read: false,
    createdAt: Timestamp.now(),
  }));
  return docRef.id;
}

export async function markNotificationAsRead(tenantId: string, id: string): Promise<void> {
  const ref = doc(firestore, `tenants/${tenantId}/notifications`, id);
  await updateDoc(ref, { read: true });
}

export async function markAllNotificationsAsRead(tenantId: string, userId: string): Promise<void> {
  const ref = collection(firestore, `tenants/${tenantId}/notifications`);
  const q = query(ref, where("userId", "==", userId), where("read", "==", false));
  const snapshot = await getDocs(q);
  
  const promises = snapshot.docs.map(d => updateDoc(d.ref, { read: true }));
  await Promise.all(promises);
}
