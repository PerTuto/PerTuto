import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log("Firebase Config Check:", {
  apiKey: firebaseConfig.apiKey ? "Set" : "Missing",
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain
});


// Initialize Firebase
let firebaseApp: FirebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

// Connect to emulators in development
// if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
//   // Only connect once
//   if (!(auth as any)._isEmulator) {
//     try {
//       connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
//       (auth as any)._isEmulator = true;
//       console.log('✅ Connected to Auth Emulator');
//     } catch (e) {
//       // Already connected
//     }
//   }
// 
//   if (!(firestore as any)._isEmulator) {
//     try {
//       connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
//       (firestore as any)._isEmulator = true;
//       console.log('✅ Connected to Firestore Emulator');
//     } catch (e) {
//       // Already connected
//     }
//   }
// }

export { firebaseApp, auth, firestore };
