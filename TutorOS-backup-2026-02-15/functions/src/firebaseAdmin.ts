import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Idempotent Firebase Admin initialization.
// Safe to import from multiple modules — only initializes once.
const app = getApps().length === 0 ? initializeApp() : getApps()[0];
export const db = getFirestore(app);
export { app };
