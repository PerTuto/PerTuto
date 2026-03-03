const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pertutoclasses' });
const db = admin.firestore();
async function check() {
  const snap = await db.collection('courses').where('tenantId', '==', 'test-tenant-001').get();
  console.log('Courses for test-tenant-001:', snap.size);
  snap.forEach(d => console.log(d.id, d.data().title));
  
  const defaultSnap = await db.collection('courses').where('tenantId', '==', 'pertuto-default').get();
  console.log('Courses for pertuto-default:', defaultSnap.size);
}
check().catch(console.error);
