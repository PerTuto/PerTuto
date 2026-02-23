import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let adminApp: App;

if (!getApps().length) {
    // On Firebase App Hosting / Cloud Run, Application Default Credentials are used automatically.
    // Locally, set GOOGLE_APPLICATION_CREDENTIALS or use `gcloud auth application-default login`.
    adminApp = initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'pertutoclasses',
    });
} else {
    adminApp = getApps()[0];
}

export const adminFirestore = getFirestore(adminApp);
