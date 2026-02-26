import { initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const TENANT_ID = 'pertuto-default';
const PASSWORD = 'password';

const DEMO_ACCOUNTS = [
  { email: 'admin@pertuto.com', role: 'admin', fullName: 'Demo Admin' },
  { email: 'teacher@pertuto.com', role: 'teacher', fullName: 'Demo Teacher' },
  { email: 'student@pertuto.com', role: 'student', fullName: 'Demo Student' },
  { email: 'parent@pertuto.com', role: 'parent', fullName: 'Demo Parent' },
];

async function setup() {
  const app = initializeApp({
    credential: applicationDefault(),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'pertutoclasses',
  });

  const auth = getAuth(app);
  const db = getFirestore(app);

  console.log('--- Starting Demo Account Setup ---');

  // 1. Ensure Tenant exists
  const tenantRef = db.collection('tenants').doc(TENANT_ID);
  const tenantDoc = await tenantRef.get();
  if (!tenantDoc.exists) {
    console.log(`Creating tenant: ${TENANT_ID}`);
    await tenantRef.set({
      name: 'PerTuto Default',
      plan: 'pro',
      status: 'active',
      createdAt: new Date(),
    });
  }

  for (const account of DEMO_ACCOUNTS) {
    try {
      console.log(`Checking ${account.email}...`);
      let userRecord;
      try {
        userRecord = await auth.getUserByEmail(account.email);
        console.log(`  User already exists in Auth: ${userRecord.uid}`);
      } catch (e: any) {
        if (e.code === 'auth/user-not-found') {
          userRecord = await auth.createUser({
            email: account.email,
            password: PASSWORD,
            displayName: account.fullName,
          });
          console.log(`  Created Auth user: ${userRecord.uid}`);
        } else {
          throw e;
        }
      }

      const userDoc = db.collection('users').doc(userRecord.uid);
      await userDoc.set({
        fullName: account.fullName,
        email: account.email,
        role: account.role,
        tenantId: TENANT_ID,
        avatar: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(account.fullName)}`,
        createdAt: new Date(),
      }, { merge: true });
      console.log(`  Updated Firestore profile for ${account.role}`);

      // Linking logic for student/parent
      if (account.role === 'student') {
         const studentRef = db.collection('tenants').doc(TENANT_ID).collection('students').doc('demo-student-id');
         await studentRef.set({
           name: account.fullName,
           email: account.email,
           userId: userRecord.uid,
           status: 'Active',
           enrolledDate: new Date(),
           courses: ['demo-course-1'],
         }, { merge: true });
         console.log('  Linked student record');
      }

      if (account.role === 'parent') {
         const studentRef = db.collection('tenants').doc(TENANT_ID).collection('students').doc('demo-student-id');
         await studentRef.set({
           parentId: userRecord.uid,
         }, { merge: true });
         console.log('  Linked parent to student');
      }

    } catch (error) {
      console.error(`Error processing ${account.email}:`, error);
    }
  }

  // Seed demo course
  console.log('Seeding demo course...');
  await db.collection('tenants').doc(TENANT_ID).collection('courses').doc('demo-course-1').set({
    title: 'Demo Course: Math Foundations',
    description: 'A foundational course for testing purposes.',
    instructor: 'Demo Teacher',
    instructorId: '', // Will update if we find the teacher UID
    studentIds: ['demo-student-id'],
    status: 'Active',
    createdAt: new Date(),
  }, { merge: true });

  console.log('--- Setup Complete ---');
}

setup().catch(console.error);
