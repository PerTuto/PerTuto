import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

export const onClassDeleted = functions.firestore
  .document('tenants/{tenantId}/classes/{classId}')
  .onDelete(async (snap, context) => {
    const { tenantId, classId } = context.params;
    
    if (!admin.apps.length) {
      admin.initializeApp();
    }
    
    const db = admin.firestore();
    let batch = db.batch();
    let operationCount = 0;

    const commitBatchIfNeeded = async () => {
        if (operationCount >= 400) {
            await batch.commit();
            batch = db.batch();
            operationCount = 0;
        }
    };

    // 1. Delete Attendance Records linked to this class
    const attendanceSnap = await db.collection(`tenants/${tenantId}/attendance`)
        .where('classId', '==', classId)
        .get();
    
    for (const doc of attendanceSnap.docs) {
        batch.delete(doc.ref);
        operationCount++;
        await commitBatchIfNeeded();
    }

    try {
        if (operationCount > 0) {
            await batch.commit();
        }
        console.log(`Successfully cascaded delete for class ${classId} in tenant ${tenantId}`);
    } catch (err) {
        console.error(`Failed to cascade delete for class ${classId}`, err);
    }
  });
