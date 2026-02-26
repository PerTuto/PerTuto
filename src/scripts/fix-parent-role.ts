import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function fixParentRole() {
  const app = initializeApp({
    credential: applicationDefault(),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'pertutoclasses',
  });

  const auth = getAuth(app);
  const db = getFirestore(app);

  // 1. Find the parent user
  const parentUser = await auth.getUserByEmail('parent@pertuto.com');
  console.log(`Parent UID: ${parentUser.uid}`);

  // 2. Read current Firestore profile
  const userDoc = await db.collection('users').doc(parentUser.uid).get();
  const data = userDoc.data();
  console.log('Current Firestore profile:', JSON.stringify(data, null, 2));

  // 3. Fix the role if it's wrong
  if (data?.role !== 'parent') {
    console.log(`\n⚠️  Role is "${data?.role}" — fixing to "parent"...`);
    await db.collection('users').doc(parentUser.uid).update({ role: 'parent' });
    console.log('✅ Role updated to "parent"');
  } else {
    console.log('\n✅ Role is already "parent" — no fix needed');
    console.log('   The bug may be elsewhere (e.g., stale cache, or the role field type).');
  }
}

fixParentRole().catch(console.error);
