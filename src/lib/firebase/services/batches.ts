
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
import { Batch } from "../../types";

const sanitizeForFirestore = (data: any) => {
  const result = { ...data };
  Object.keys(result).forEach((key) => {
    if (result[key] === undefined) delete result[key];
  });
  return result;
};

export async function getBatches(tenantId: string): Promise<Batch[]> {
  const batchesRef = collection(firestore, `tenants/${tenantId}/batches`);
  const q = query(batchesRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp).toDate(),
  })) as Batch[];
}

export async function getBatchById(tenantId: string, id: string): Promise<Batch | null> {
  const docRef = doc(firestore, `tenants/${tenantId}/batches`, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: (docSnap.data().createdAt as Timestamp).toDate(),
    } as Batch;
  }
  return null;
}

export async function createBatch(tenantId: string, batch: Omit<Batch, "id" | "createdAt">): Promise<string> {
  const batchesRef = collection(firestore, `tenants/${tenantId}/batches`);
  const nodeRef = doc(batchesRef);
  await setDoc(nodeRef, sanitizeForFirestore({
    ...batch,
    createdAt: Timestamp.now(),
  }));
  return nodeRef.id;
}

export async function updateBatch(tenantId: string, id: string, updates: Partial<Batch>): Promise<void> {
  const nodeRef = doc(firestore, `tenants/${tenantId}/batches`, id);
  await updateDoc(nodeRef, sanitizeForFirestore(updates));
}

export async function deleteBatch(tenantId: string, id: string): Promise<void> {
  const nodeRef = doc(firestore, `tenants/${tenantId}/batches`, id);
  await deleteDoc(nodeRef);
}

export async function getBatchesByCenter(tenantId: string, centerId: string): Promise<Batch[]> {
  const batchesRef = collection(firestore, `tenants/${tenantId}/batches`);
  const q = query(batchesRef, where("centerId", "==", centerId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp).toDate(),
  })) as Batch[];
}
