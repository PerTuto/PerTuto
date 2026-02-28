
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  writeBatch,
} from "firebase/firestore";
import { firestore } from "../client-app";
import { TaxonomyNode, Subject } from "../../types";

// --- Taxonomy Node Operations ---

export async function getTaxonomyNodes(
  tenantId: string,
  parentId: string | null = null
): Promise<TaxonomyNode[]> {
  const nodesRef = collection(firestore, `tenants/${tenantId}/taxonomy`);
  const q = query(
    nodesRef,
    where("parentId", "==", parentId),
    orderBy("order")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as TaxonomyNode[];
}

export async function addTaxonomyNode(
  tenantId: string,
  node: Omit<TaxonomyNode, "id">
): Promise<string> {
  const nodesRef = collection(firestore, `tenants/${tenantId}/taxonomy`);
  const nodeRef = doc(nodesRef);
  await setDoc(nodeRef, node);
  return nodeRef.id;
}

export async function updateTaxonomyNode(
  tenantId: string,
  id: string,
  updates: Partial<TaxonomyNode>
): Promise<void> {
  const nodeRef = doc(firestore, `tenants/${tenantId}/taxonomy`, id);
  await setDoc(nodeRef, updates, { merge: true });
}

export async function deleteTaxonomyNode(
  tenantId: string,
  id: string
): Promise<void> {
  const nodeRef = doc(firestore, `tenants/${tenantId}/taxonomy`, id);
  await deleteDoc(nodeRef);
}

// --- Bulk Operations ---

export async function batchAddTaxonomyNodes(
  tenantId: string,
  nodes: Omit<TaxonomyNode, "id">[]
): Promise<void> {
  const batch = writeBatch(firestore);
  const nodesRef = collection(firestore, `tenants/${tenantId}/taxonomy`);

  nodes.forEach((node) => {
    const nodeRef = doc(nodesRef);
    batch.set(nodeRef, node);
  });

  await batch.commit();
}

/**
 * Fetches all subjects (top-level taxonomy domains).
 */
export async function getSubjects(tenantId: string): Promise<Subject[]> {
  const nodesRef = collection(firestore, `tenants/${tenantId}/taxonomy`);
  const q = query(nodesRef, where("type", "==", "domain"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Subject[];
}
