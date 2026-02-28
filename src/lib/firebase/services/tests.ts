
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  Timestamp,
  deleteDoc
} from "firebase/firestore";
import { firestore } from "../client-app";
import { Test } from "@/lib/types";

const COLLECTION_NAME = "tests";

const mapDocToTest = (id: string, data: any): Test => ({
  id,
  ...data,
  scheduledDate: (data.scheduledDate as Timestamp)?.toDate() || new Date(),
  createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
});

export async function createTest(tenantId: string, testData: Omit<Test, 'id'>) {
  const testsRef = collection(firestore, `tenants/${tenantId}/${COLLECTION_NAME}`);
  const docRef = await addDoc(testsRef, {
    ...testData,
    scheduledDate: Timestamp.fromDate(testData.scheduledDate),
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getTests(tenantId: string): Promise<Test[]> {
  const testsRef = collection(firestore, `tenants/${tenantId}/${COLLECTION_NAME}`);
  const q = query(testsRef, orderBy("scheduledDate", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => mapDocToTest(doc.id, doc.data()));
}

export async function getTest(tenantId: string, testId: string): Promise<Test | null> {
  const docRef = doc(firestore, `tenants/${tenantId}/${COLLECTION_NAME}`, testId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return mapDocToTest(docSnap.id, docSnap.data());
  }
  return null;
}

export async function updateTest(tenantId: string, testId: string, updates: Partial<Test>) {
  const docRef = doc(firestore, `tenants/${tenantId}/${COLLECTION_NAME}`, testId);
  const firestoreUpdates = { ...updates };
  if (updates.scheduledDate) {
    firestoreUpdates.scheduledDate = Timestamp.fromDate(updates.scheduledDate) as any;
  }
  await updateDoc(docRef, firestoreUpdates);
}

export async function deleteTest(tenantId: string, testId: string) {
  const docRef = doc(firestore, `tenants/${tenantId}/${COLLECTION_NAME}`, testId);
  await deleteDoc(docRef);
}
