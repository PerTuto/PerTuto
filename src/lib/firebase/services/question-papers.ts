
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
import { QuestionPaper, SyllabusConfig } from "../../types";

const sanitizeForFirestore = (data: any) => {
  const result = { ...data };
  Object.keys(result).forEach((key) => {
    if (result[key] === undefined) delete result[key];
  });
  return result;
};

// --- Question Papers ---

export async function getQuestionPapers(tenantId: string): Promise<QuestionPaper[]> {
  const papersRef = collection(firestore, `tenants/${tenantId}/questionPapers`);
  const q = query(papersRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp).toDate(),
    updatedAt: (doc.data().updatedAt as Timestamp).toDate(),
  })) as QuestionPaper[];
}

export async function getQuestionPaper(tenantId: string, id: string): Promise<QuestionPaper | null> {
  const docRef = doc(firestore, `tenants/${tenantId}/questionPapers`, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: (docSnap.data().createdAt as Timestamp).toDate(),
      updatedAt: (docSnap.data().updatedAt as Timestamp).toDate(),
    } as QuestionPaper;
  }
  return null;
}

export async function createQuestionPaper(
  tenantId: string, 
  paper: Omit<QuestionPaper, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const papersRef = collection(firestore, `tenants/${tenantId}/questionPapers`);
  const nodeRef = doc(papersRef);
  await setDoc(nodeRef, sanitizeForFirestore({
    ...paper,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }));
  return nodeRef.id;
}

export async function updateQuestionPaper(
  tenantId: string, 
  id: string, 
  updates: Partial<QuestionPaper>
): Promise<void> {
  const nodeRef = doc(firestore, `tenants/${tenantId}/questionPapers`, id);
  await updateDoc(nodeRef, sanitizeForFirestore({
    ...updates,
    updatedAt: Timestamp.now(),
  }));
}

export async function deleteQuestionPaper(tenantId: string, id: string): Promise<void> {
  const nodeRef = doc(firestore, `tenants/${tenantId}/questionPapers`, id);
  await deleteDoc(nodeRef);
}

// --- Syllabus Config ---

export async function getSyllabusConfigs(tenantId: string): Promise<SyllabusConfig[]> {
  const configsRef = collection(firestore, `tenants/${tenantId}/syllabusConfig`);
  const snapshot = await getDocs(configsRef);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    updatedAt: (doc.data().updatedAt as Timestamp).toDate(),
  })) as SyllabusConfig[];
}

export async function saveSyllabusConfig(
  tenantId: string, 
  config: Omit<SyllabusConfig, "id" | "updatedAt">
): Promise<string> {
  const configsRef = collection(firestore, `tenants/${tenantId}/syllabusConfig`);
  const nodeRef = doc(configsRef);
  await setDoc(nodeRef, sanitizeForFirestore({
    ...config,
    updatedAt: Timestamp.now(),
  }));
  return nodeRef.id;
}

export async function getSyllabusConfigByCourse(tenantId: string, courseId: string): Promise<SyllabusConfig | null> {
  const configsRef = collection(firestore, `tenants/${tenantId}/syllabusConfig`);
  const q = query(configsRef, where("courseId", "==", courseId));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return {
    id: d.id,
    ...d.data(),
    updatedAt: (d.data().updatedAt as Timestamp).toDate(),
  } as SyllabusConfig;
}
