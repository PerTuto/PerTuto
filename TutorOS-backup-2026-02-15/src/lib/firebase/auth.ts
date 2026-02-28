import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  User,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  FieldValue,
} from "firebase/firestore";
import { auth, db } from "./config";

// Types
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: "admin" | "teacher" | "student";
  createdAt: FieldValue | string;
  lastLogin: FieldValue | string;
}

export const signUpWithEmail = async (
  email: string,
  password: string,
  name: string,
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // Update Auth Profile
    await updateProfile(user, { displayName: name });

    // Create User Document in Firestore
    await createUserDocument(user, { displayName: name, role: "admin" }); // Defaulting to admin for MVP foundation

    return user;
  } catch (error) {
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    // Update last login
    const userRef = doc(db, "users", userCredential.user.uid);
    await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw error;
  }
};

export const createUserDocument = async (
  user: User,
  additionalData?: Record<string, unknown>,
) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const { email, displayName } = user;
    const createdAt = serverTimestamp();
    const lastLogin = serverTimestamp();

    try {
      await setDoc(userRef, {
        uid: user.uid,
        email,
        displayName,
        createdAt,
        lastLogin,
        ...additionalData,
      });
    } catch (error) {
      console.error("Error creating user", error);
    }
  }
};
