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
    .where('subject', '==', 'English')
    .where('grade', '==', '2')
    .get();
    
  console.log(`Found ${snapshot.size} documents for English Grade 2:`);
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log(`- ID: ${doc.id}, Title: ${data.title}, Board: ${data.board}, Curriculum: ${data.curriculum}`);
  });
  process.exit(0);
}

check();
