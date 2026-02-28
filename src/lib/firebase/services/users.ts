import { doc, getDoc, setDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { firestore } from '../client-app';
import { type UserRole } from '../../types';

export type UserProfile = {
  fullName: string;
  email: string;
  role: UserRole | UserRole[];
  tenantId?: string; // null for Platform Super
  avatar?: string;
};

/**
 * Creates a user profile document in Firestore.
 * @param uid The user's unique ID from Firebase Authentication.
 * @param data The user profile data.
 */
export async function createUserProfile(uid: string, data: UserProfile): Promise<void> {
  const userDocRef = doc(firestore, 'users', uid);
  await setDoc(userDocRef, data);
}

/**
 * Fetches a user profile document from Firestore.
 * @param uid The user's unique ID.
 * @returns The user profile data, or null if it doesn't exist.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userDocRef = doc(firestore, 'users', uid);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  } else {
    return null;
  }
}

/**
 * Fetches all users with the 'teacher' role for a specific tenant.
 */
export async function getTeachers(tenantId: string): Promise<any[]> {
  const usersRef = collection(firestore, 'users');
  const q = query(usersRef, where("tenantId", "==", tenantId), where("role", "==", "teacher"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date(),
  }));
}
