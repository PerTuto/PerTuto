
const admin = require('firebase-admin');

// No service account file needed if we use the environment
if (!admin.apps.length) {
    admin.initializeApp({
        projectId: 'studio-1290149231-fc928'
    });
}

const db = admin.firestore();

async function listCollections() {
    const collections = await db.listCollections();
    for (const col of collections) {
        console.log('Collection:', col.id);
        const snapshot = await col.limit(3).get();
        snapshot.forEach(doc => {
            console.log('  Doc:', doc.id, doc.data());
        });
    }
}

listCollections().catch(console.error);
