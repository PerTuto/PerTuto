const admin = require('firebase-admin');

admin.initializeApp({ projectId: 'pertutoclasses' });
const db = admin.firestore();
const auth = admin.auth();

async function check() {
  try {
    const user = await auth.getUserByEmail('admin@demoschool.com');
    console.log("Auth User built:", user.uid);
    const profile = await db.collection('users').doc(user.uid).get();
    if (profile.exists) {
      console.log("Profile exists:", profile.data());
    } else {
      console.log("PROFILE DOES NOT EXIST for UID:", user.uid);
    }
  } catch (e) {
    console.error(e);
  }
}
check();
