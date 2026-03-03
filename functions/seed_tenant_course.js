const admin = require('firebase-admin');

admin.initializeApp({
  projectId: 'pertutoclasses'
});

const db = admin.firestore();

async function checkAndSeed() {
  const tenantId = 'test-tenant-001';
  const coursesRef = db.collection(`tenants/${tenantId}/courses`);
  const snap = await coursesRef.get();
  
  console.log(`Found ${snap.size} courses in ${tenantId}`);
  if (snap.size === 0) {
      console.log("Seeding a test course...");
      await coursesRef.add({
          title: "Mathematics (Grade 10)",
          description: "Core mathematics for Grade 10 students.",
          subject: "Mathematics",
          grade: "10",
          createdAt: admin.firestore.Timestamp.now(),
          updatedAt: admin.firestore.Timestamp.now(),
          status: "published",
          tenantId: tenantId
      });
      console.log("Course seeded successfully!");
  } else {
      snap.forEach(d => console.log(d.id, d.data().title));
  }
}

checkAndSeed().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
});
