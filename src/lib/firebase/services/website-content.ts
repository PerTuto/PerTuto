import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '../client-app';

export async function getWebsiteContent(pageId: string): Promise<any | null> {
  const docRef = doc(firestore, 'website_content', pageId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
    };
  }
  return null;
}

export async function saveWebsiteContent(pageId: string, data: any): Promise<void> {
  const docRef = doc(firestore, 'website_content', pageId);
  await setDoc(docRef, { ...data, updatedAt: new Date() }, { merge: true });
}
