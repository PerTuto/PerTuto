import { collection, doc, getDocs, query, where, addDoc, setDoc, deleteDoc, orderBy, limit as firestoreLimit } from 'firebase/firestore';
import { firestore } from '../client-app';
import { type Lead } from '../../types';

/**
 * Fetches all leads for a tenant.
 */
export async function getLeads(tenantId: string): Promise<Lead[]> {
  const leadsRef = collection(firestore, `tenants/${tenantId}/leads`);
  const querySnapshot = await getDocs(leadsRef);
  const leads: Lead[] = [];
  querySnapshot.forEach((doc) => {
    leads.push({ id: doc.id, ...doc.data() } as Lead);
  });
  return leads;
}

/**
 * Fetches the most recent leads for a tenant (optimized for dashboard widgets).
 */
export async function getRecentLeads(tenantId: string, limitCount: number = 5): Promise<Lead[]> {
  const leadsRef = collection(firestore, `tenants/${tenantId}/leads`);
  const q = query(leadsRef, orderBy('dateAdded', 'desc'), firestoreLimit(limitCount));
  const querySnapshot = await getDocs(q);
  const leads: Lead[] = [];
  querySnapshot.forEach((doc) => {
    leads.push({ id: doc.id, ...doc.data() } as Lead);
  });
  return leads;
}

/**
 * Adds a new lead.
 */
export async function addLead(tenantId: string, leadData: Omit<Lead, 'id'>): Promise<Lead> {
  const leadsRef = collection(firestore, `tenants/${tenantId}/leads`);
  const docRef = await addDoc(leadsRef, leadData);
  return { id: docRef.id, ...leadData };
}

/**
 * Updates a lead.
 */
export async function updateLead(tenantId: string, leadId: string, leadData: Partial<Omit<Lead, 'id'>>): Promise<void> {
  const leadRef = doc(firestore, `tenants/${tenantId}/leads`, leadId);
  await setDoc(leadRef, leadData, { merge: true });
}

/**
 * Deletes a lead.
 */
export async function deleteLead(tenantId: string, leadId: string): Promise<void> {
  await deleteDoc(doc(firestore, `tenants/${tenantId}/leads`, leadId));
}
