
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
} from "firebase/firestore";
import { firestore } from "../client-app";
import { Center } from "../../types";

const sanitizeForFirestore = (data: any) => {
  const result = { ...data };
  Object.keys(result).forEach((key) => {
    if (result[key] === undefined) delete result[key];
  });
  return result;
};

export async function getCenters(tenantId: string): Promise<Center[]> {
  const centersRef = collection(firestore, `tenants/${tenantId}/centers`);
  const q = query(centersRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp).toDate(),
  })) as Center[];
}

export async function getCenterById(tenantId: string, id: string): Promise<Center | null> {
  const docRef = doc(firestore, `tenants/${tenantId}/centers`, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: (docSnap.data().createdAt as Timestamp).toDate(),
    } as Center;
  }
  return null;
}

export async function createCenter(tenantId: string, center: Omit<Center, "id" | "createdAt">): Promise<string> {
  const centersRef = collection(firestore, `tenants/${tenantId}/centers`);
  const nodeRef = doc(centersRef);
  await setDoc(nodeRef, sanitizeForFirestore({
    ...center,
    createdAt: Timestamp.now(),
  }));
  return nodeRef.id;
}

export async function updateCenter(tenantId: string, id: string, updates: Partial<Center>): Promise<void> {
  const nodeRef = doc(firestore, `tenants/${tenantId}/centers`, id);
  await updateDoc(nodeRef, sanitizeForFirestore(updates));
}

export async function deleteCenter(tenantId: string, id: string): Promise<void> {
  const nodeRef = doc(firestore, `tenants/${tenantId}/centers`, id);
  await deleteDoc(nodeRef);
}
