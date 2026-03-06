import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

export const onStudentDeleted = functions.firestore
  .document('tenants/{tenantId}/students/{studentId}')
  .onDelete(async (snap, context) => {
    const { tenantId, studentId } = context.params;
    
    // Ensure admin app is initialized (usually occurs in index.ts, but safe to check here if separated)
    if (!admin.apps.length) {
      admin.initializeApp();
    }
    
    const db = admin.firestore();
    let batch = db.batch();
    let operationCount = 0;

    const commitBatchIfNeeded = async () => {
        if (operationCount >= 400) { // Firestore batch limit is 500
            await batch.commit();
            batch = db.batch();
            operationCount = 0;
        }
    };

    // 1. Delete Gamification Profile (1:1 relation)
    const gamificationRef = db.doc(`tenants/${tenantId}/gamification/${studentId}`);
    batch.delete(gamificationRef);
    operationCount++;

    // 2. Collections to clean up (1:N relations)
    const collectionsToClean = [
        'attendance',
        'evaluations',
        'practiceSessions',
        'quizAttempts',
        'gradeChallenges'
    ];

    for (const coll of collectionsToClean) {
        const querySnap = await db.collection(`tenants/${tenantId}/${coll}`)
            .where('studentId', '==', studentId)
            .get();
        
        for (const doc of querySnap.docs) {
            batch.delete(doc.ref);
            operationCount++;
            await commitBatchIfNeeded();
        }
    }

    // Un-enroll student from courses? (Arrays in courses collection)
    // We would query courses where students array contains studentId, then remove it.
    const coursesSnap = await db.collection(`tenants/${tenantId}/courses`)
        .where('enrolledStudents', 'array-contains', studentId)
        .get();

    for (const doc of coursesSnap.docs) {
        batch.update(doc.ref, {
            enrolledStudents: admin.firestore.FieldValue.arrayRemove(studentId)
        });
        operationCount++;
        await commitBatchIfNeeded();
    }

    try {
        if (operationCount > 0) {
            await batch.commit();
        }
        console.log(`Successfully cascaded delete for student ${studentId} in tenant ${tenantId}`);
    } catch (err) {
        console.error(`Failed to cascade delete for student ${studentId}`, err);
    }
  });
