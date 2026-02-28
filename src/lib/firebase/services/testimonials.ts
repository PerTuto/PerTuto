import { collection, doc, getDocs, query, where, setDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../client-app';

export async function getTestimonials(tenantId: string): Promise<any[]> {
  const ref = collection(firestore, `tenants/${tenantId}/testimonials`);
  const snapshot = await getDocs(ref);
  return snapshot.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
    };
  });
}

export async function getApprovedTestimonials(tenantId: string): Promise<any[]> {
  const ref = collection(firestore, `tenants/${tenantId}/testimonials`);
  const q = query(ref, where("status", "==", "approved"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
    };
  });
}

export async function updateTestimonialStatus(tenantId: string, testimonialId: string, status: string): Promise<void> {
  const ref = doc(firestore, `tenants/${tenantId}/testimonials`, testimonialId);
  await setDoc(ref, { status }, { merge: true });
}

export async function deleteTestimonial(tenantId: string, testimonialId: string): Promise<void> {
  await deleteDoc(doc(firestore, `tenants/${tenantId}/testimonials`, testimonialId));
}
