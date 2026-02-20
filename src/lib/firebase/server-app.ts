import "server-only";

import { initializeApp, getApps, cert, getApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

/**
 * Firebase Admin SDK Initialization
 * 
 * Priority:
 * 1. Explicit Service Account Key (FIREBASE_SERVICE_ACCOUNT_KEY)
 * 2. Emulator (FIREBASE_AUTH_EMULATOR_HOST)
 * 3. Application Default Credentials (Production on GCP)
 */
function getFirebaseAdminApp() {
    if (getApps().length === 0) {
        // Option 1: Explicit service account provided
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
            console.log("[Firebase Admin] Initializing with explicit service account");
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
            return initializeApp({
                credential: cert(serviceAccount),
            });
        }

        // Option 2: Development/Emulator mode
        if (process.env.NODE_ENV === 'development' || process.env.FIREBASE_AUTH_EMULATOR_HOST) {
            console.log("[Firebase Admin] Initializing for emulator/dev");
            return initializeApp({
                projectId: "demo-project",
            });
        }

        // Option 3: Production (Cloud Run/Cloud Functions)
        // Use Application Default Credentials which are auto-provided in GCP
        console.log("[Firebase Admin] Initializing with Application Default Credentials");
        return initializeApp({
            credential: applicationDefault(),
            projectId: 'studio-1290149231-fc928',
        });
    }
    return getApp();
}

const app = getFirebaseAdminApp();

export const adminAuth = getAuth(app);
export const adminFirestore = getFirestore(app);

