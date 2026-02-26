import { initializeApp, applicationDefault, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

try {
  // Initialize with Application Default Credentials which should pick up
  // the authenticated gcloud session on the developer machine
  if (!getApps().length) {
    initializeApp({
      credential: applicationDefault(),
      projectId: "pertutoclasses",
    });
  }

  const email = "qa_super@pertuto.com";
  const password = "password123";

  async function createQaSuperUser() {
    const auth = getAuth();
    const db = getFirestore();

    let user;
    try {
      user = await auth.getUserByEmail(email);
      console.log(`User ${email} already exists. Updating password...`);
      await auth.updateUser(user.uid, { password: password });
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        console.log(`Creating new user: ${email}...`);
        user = await auth.createUser({
          email: email,
          password: password,
          displayName: "QA Super Admin",
          emailVerified: true,
        });
      } else {
        throw error;
      }
    }

    console.log(`Writing profile to Firestore for UID: ${user.uid}...`);
    await db.collection("users").doc(user.uid).set(
      {
        email: email,
        fullName: "QA Super Admin",
        role: "super",
        tenantId: "pertuto-default",
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );

    console.log("✅ Successfully created QA Super Admin account.");
    process.exit(0);
  }

  createQaSuperUser();
} catch (error) {
  console.error("❌ Setup failed:", error);
  process.exit(1);
}
