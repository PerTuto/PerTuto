import { initializeApp, applicationDefault, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const PASSWORD = "QA_Super123!";
const TENANT = "pertuto-default";

const QA_ACCOUNTS = [
  { email: "qa_super@pertuto.com",   fullName: "QA Super Admin", role: "super"   },
  { email: "qa_admin@pertuto.com",   fullName: "QA Admin",       role: "admin"   },
  { email: "qa_teacher@pertuto.com", fullName: "QA Teacher",     role: "teacher" },
  { email: "qa_student@pertuto.com", fullName: "QA Student",     role: "student" },
  { email: "qa_parent@pertuto.com",  fullName: "QA Parent",      role: "parent"  },
];

async function main() {
  if (!getApps().length) {
    initializeApp({
      credential: applicationDefault(),
      projectId: "pertutoclasses",
    });
  }

  const auth = getAuth();
  const db = getFirestore();

  for (const acct of QA_ACCOUNTS) {
    let user;
    try {
      user = await auth.getUserByEmail(acct.email);
      console.log(`✅ ${acct.email} already exists (UID: ${user.uid}). Resetting password...`);
      await auth.updateUser(user.uid, { password: PASSWORD });
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        console.log(`➕ Creating ${acct.email}...`);
        user = await auth.createUser({
          email: acct.email,
          password: PASSWORD,
          displayName: acct.fullName,
          emailVerified: true,
        });
      } else {
        console.error(`❌ Error with ${acct.email}:`, error.message);
        continue;
      }
    }

    // Upsert Firestore profile
    await db.collection("users").doc(user.uid).set(
      {
        email: acct.email,
        fullName: acct.fullName,
        role: acct.role,
        tenantId: TENANT,
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );
    console.log(`   → Firestore profile written for ${acct.role} (${user.uid})`);
  }

  console.log("\n🎉 All QA role accounts provisioned.");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Setup failed:", err);
  process.exit(1);
});
