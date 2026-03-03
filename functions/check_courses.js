const admin = require('firebase-admin');

// Ensure we are hitting the prod project
admin.initializeApp({
  projectId: 'pertutoclasses'
});

const db = admin.firestore();

async function check() {
  console.log("Checking courses in test-tenant-001...");
  const snap = await db.collection('courses').where('tenantId', '==', 'test-tenant-001').get();
  console.log(`Found ${snap.size} courses for test-tenant-001`);
  snap.forEach(d => console.log(' - ', d.id, d.data().title));
  
  console.log("\\nChecking courses in pertuto-default...");
  const defaultSnap = await db.collection('courses').where('tenantId', '==', 'pertuto-default').get();
  console.log(`Found ${defaultSnap.size} courses for pertuto-default`);
  defaultSnap.forEach(d => console.log(' - ', d.id, d.data().title));
  
  process.exit(0);
}

check().catch(console.error);
