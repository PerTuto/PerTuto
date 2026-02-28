
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
import { Evaluation } from "@/lib/types";

const COLLECTION_NAME = "evaluations";

const mapDocToEvaluation = (id: string, data: any): Evaluation => ({
  id,
  ...data,
  evaluatedAt: (data.evaluatedAt as Timestamp)?.toDate(),
  createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
});

export async function createEvaluation(tenantId: string, evaluation: Omit<Evaluation, 'id'>) {
  const evalRef = collection(firestore, `tenants/${tenantId}/${COLLECTION_NAME}`);
  const docRef = await addDoc(evalRef, {
    ...evaluation,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getEvaluationsByTest(tenantId: string, testId: string): Promise<Evaluation[]> {
  const evalRef = collection(firestore, `tenants/${tenantId}/${COLLECTION_NAME}`);
  const q = query(evalRef, where("testId", "==", testId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => mapDocToEvaluation(doc.id, doc.data()));
}

export async function getEvaluation(tenantId: string, evalId: string): Promise<Evaluation | null> {
  const docRef = doc(firestore, `tenants/${tenantId}/${COLLECTION_NAME}`, evalId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return mapDocToEvaluation(docSnap.id, docSnap.data());
  }
  return null;
}

export async function updateEvaluation(tenantId: string, evalId: string, updates: Partial<Evaluation>) {
  const docRef = doc(firestore, `tenants/${tenantId}/${COLLECTION_NAME}`, evalId);
  const firestoreUpdates = { ...updates };
  if (updates.evaluatedAt) {
    firestoreUpdates.evaluatedAt = Timestamp.fromDate(updates.evaluatedAt) as any;
  }
  await updateDoc(docRef, firestoreUpdates);
}

export async function getReviewQueue(tenantId: string): Promise<Evaluation[]> {
  const evalRef = collection(firestore, `tenants/${tenantId}/${COLLECTION_NAME}`);
  const q = query(evalRef, where("requiresReview", "==", true), where("status", "==", "evaluated"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => mapDocToEvaluation(doc.id, doc.data()));
}
