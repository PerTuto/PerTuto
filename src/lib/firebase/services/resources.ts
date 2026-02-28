import { collection, doc, getDocs, query, where, addDoc, setDoc, deleteDoc, limit as firestoreLimit } from 'firebase/firestore';
import { firestore } from '../client-app';

export async function addResource(tenantId: string, data: any): Promise<string> {
  const ref = collection(firestore, `tenants/${tenantId}/resources`);
  const now = new Date();
  const docRef = await addDoc(ref, { ...data, tenantId, createdAt: now, updatedAt: now });
  return docRef.id;
}

export async function updateResource(tenantId: string, resourceId: string, data: any): Promise<void> {
  const ref = doc(firestore, `tenants/${tenantId}/resources`, resourceId);
  await setDoc(ref, { ...data, updatedAt: new Date() }, { merge: true });
}

export async function deleteResource(tenantId: string, resourceId: string): Promise<void> {
  await deleteDoc(doc(firestore, `tenants/${tenantId}/resources`, resourceId));
}

export async function getResources(tenantId: string, filters?: {
  type?: string;
  grade?: string;
  curriculum?: string;
}): Promise<any[]> {
  const ref = collection(firestore, `tenants/${tenantId}/resources`);
  const constraints: any[] = [];
  if (filters?.type) constraints.push(where("type", "==", filters.type));
  if (filters?.grade) constraints.push(where("grade", "==", filters.grade));
  if (filters?.curriculum) constraints.push(where("curriculum", "==", filters.curriculum));

  const q = constraints.length > 0 ? query(ref, ...constraints) : ref;
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => {
    const data = d.data() as Record<string, any>;
    return {
      id: d.id,
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt),
    };
  });
}

export async function getPublishedResources(tenantId: string, filters?: {
  type?: string;
  grade?: string;
  curriculum?: string;
}): Promise<any[]> {
  const ref = collection(firestore, `tenants/${tenantId}/resources`);
  const constraints: any[] = [where("published", "==", true)];
  if (filters?.type) constraints.push(where("type", "==", filters.type));
  if (filters?.grade) constraints.push(where("grade", "==", filters.grade));
  if (filters?.curriculum) constraints.push(where("curriculum", "==", filters.curriculum));

  const q = query(ref, ...constraints, firestoreLimit(1000));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => {
    const data = d.data() as Record<string, any>;
    return {
      id: d.id,
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt),
    };
  });
}
