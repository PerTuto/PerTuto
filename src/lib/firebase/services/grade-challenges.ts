
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
  Timestamp
} from "firebase/firestore";
import { firestore } from "../client-app";
import { GradeChallenge } from "@/lib/types";

const COLLECTION_NAME = "gradeChallenges";

const mapDocToChallenge = (id: string, data: any): GradeChallenge => ({
  id,
  ...data,
  createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
  resolvedAt: (data.resolvedAt as Timestamp)?.toDate(),
});

export async function createGradeChallenge(tenantId: string, challenge: Omit<GradeChallenge, 'id'>) {
  const challengeRef = collection(firestore, `tenants/${tenantId}/${COLLECTION_NAME}`);
  const docRef = await addDoc(challengeRef, {
    ...challenge,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getGradeChallenges(tenantId: string): Promise<GradeChallenge[]> {
  const challengeRef = collection(firestore, `tenants/${tenantId}/${COLLECTION_NAME}`);
  const q = query(challengeRef, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => mapDocToChallenge(doc.id, doc.data()));
}

export async function updateGradeChallenge(tenantId: string, challengeId: string, updates: Partial<GradeChallenge>) {
  const docRef = doc(firestore, `tenants/${tenantId}/${COLLECTION_NAME}`, challengeId);
  const firestoreUpdates = { ...updates };
  if (updates.resolvedAt) {
    firestoreUpdates.resolvedAt = Timestamp.fromDate(updates.resolvedAt) as any;
  }
  await updateDoc(docRef, firestoreUpdates);
}
