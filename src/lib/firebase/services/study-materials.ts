
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
import { StudyMaterial } from "../../types";

const sanitizeForFirestore = (data: any) => {
  const result = { ...data };
  Object.keys(result).forEach((key) => {
    if (result[key] === undefined) delete result[key];
  });
  return result;
};

export async function getStudyMaterials(tenantId: string): Promise<StudyMaterial[]> {
  const ref = collection(firestore, `tenants/${tenantId}/studyMaterials`);
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp).toDate(),
  })) as StudyMaterial[];
}

export async function createStudyMaterial(tenantId: string, material: Omit<StudyMaterial, "id" | "createdAt">): Promise<string> {
  const ref = collection(firestore, `tenants/${tenantId}/studyMaterials`);
  const docRef = await addDoc(ref, sanitizeForFirestore({
    ...material,
    createdAt: Timestamp.now(),
  }));
  return docRef.id;
}

export async function deleteStudyMaterial(tenantId: string, id: string): Promise<void> {
  const ref = doc(firestore, `tenants/${tenantId}/studyMaterials`, id);
  await deleteDoc(ref);
}

export async function getMaterialsByCourse(tenantId: string, courseId: string): Promise<StudyMaterial[]> {
  const ref = collection(firestore, `tenants/${tenantId}/studyMaterials`);
  const q = query(ref, where("courseIds", "array-contains", courseId), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp).toDate(),
  })) as StudyMaterial[];
}
