import { collection, addDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../client-app';

export async function getAvailability(tenantId: string, userId: string): Promise<any[]> {
  const availabilityRef = collection(firestore, `tenants/${tenantId}/availability`);
  const q = query(availabilityRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  const slots: any[] = [];
  querySnapshot.forEach((d) => {
    slots.push({ id: d.id, ...d.data() });
  });
  return slots;
}

export async function setAvailability(tenantId: string, userId: string, slots: any[]): Promise<void> {
  const availabilityRef = collection(firestore, `tenants/${tenantId}/availability`);

  // Delete old slots for this user
  const q = query(availabilityRef, where("userId", "==", userId));
  const existing = await getDocs(q);
  const deletePromises = existing.docs.map(d => deleteDoc(d.ref));
  await Promise.all(deletePromises);

  // Add new slots
  for (const slot of slots) {
    await addDoc(availabilityRef, { ...slot, userId, tenantId });
  }
}
