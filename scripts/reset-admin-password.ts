import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "{}";
const serviceAccount = JSON.parse(rawServiceAccount);

if (serviceAccount.private_key) {
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
}

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

async function resetPassword() {
  const auth = getAuth();
  try {
    const userinfo = await auth.getUserByEmail("admin@pertuto.com");
    await auth.updateUser(userinfo.uid, { password: "password123" });
    console.log("Successfully reset password for admin@pertuto.com to password123");
  } catch (error) {
    console.error("Error resetting password:", error);
  }
}

resetPassword();
