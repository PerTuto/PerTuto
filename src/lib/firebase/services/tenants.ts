import { collection, doc, getDoc, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '../client-app';

const tenantsCollection = collection(firestore, 'tenants');

export async function createTenant(data: { name: string; plan: 'basic' | 'pro' | 'enterprise' }, ownerId: string): Promise<string> {
  const docRef = await addDoc(tenantsCollection, {
    ...data,
    ownerId,
    createdAt: Timestamp.now(),
    settings: {
      defaultHourlyRate: 50,
      currency: 'USD',
      noShowPolicy: '100% charge for no-shows or cancellations within 24 hours.',
      timeFormat: '12h',
    },
  });
  return docRef.id;
}

export async function getTenants(): Promise<any[]> {
  const querySnapshot = await getDocs(tenantsCollection);
  const tenants: any[] = [];
  querySnapshot.forEach((d) => {
    const data = d.data();
    tenants.push({ 
      id: d.id, 
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : new Date())
    });
  });
  return tenants;
}

export async function getTenantById(tenantId: string): Promise<any | null> {
  const docSnap = await getDoc(doc(firestore, 'tenants', tenantId));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}
