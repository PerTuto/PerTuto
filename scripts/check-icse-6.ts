import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'pertutoclasses',
  });
}
const db = admin.firestore();

async function check() {
  const snapshot = await db.collection('tenants/pertuto-default/resources')
    .where('board', '==', 'icse')
    .where('grade', '==', '6')
    .get();
    
  console.log(`Found ${snapshot.size} documents for ICSE Grade 6:`);
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log(`- Subject: ${data.subject}, Curriculum: ${data.curriculum}`);
  });
  process.exit(0);
}

check();
