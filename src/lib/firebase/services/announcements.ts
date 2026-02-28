
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
  addDoc
} from "firebase/firestore";
import { firestore } from "../client-app";
import { Announcement } from "../../types";

const sanitizeForFirestore = (data: any) => {
  const result = { ...data };
  Object.keys(result).forEach((key) => {
    if (result[key] === undefined) delete result[key];
  });
  return result;
};

export async function getAnnouncements(tenantId: string): Promise<Announcement[]> {
  const ref = collection(firestore, `tenants/${tenantId}/announcements`);
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp).toDate(),
    expiresAt: doc.data().expiresAt ? (doc.data().expiresAt as Timestamp).toDate() : undefined,
  })) as Announcement[];
}

export async function createAnnouncement(tenantId: string, announcement: Omit<Announcement, "id" | "createdAt">): Promise<string> {
  const ref = collection(firestore, `tenants/${tenantId}/announcements`);
  const docRef = await addDoc(ref, sanitizeForFirestore({
    ...announcement,
    createdAt: Timestamp.now(),
  }));
  return docRef.id;
}

export async function updateAnnouncement(tenantId: string, id: string, updates: Partial<Announcement>): Promise<void> {
  const ref = doc(firestore, `tenants/${tenantId}/announcements`, id);
  await updateDoc(ref, sanitizeForFirestore(updates));
}

export async function deleteAnnouncement(tenantId: string, id: string): Promise<void> {
  const ref = doc(firestore, `tenants/${tenantId}/announcements`, id);
  await deleteDoc(ref);
}
