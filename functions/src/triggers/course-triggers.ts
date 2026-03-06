import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

export const onCourseDeleted = functions.firestore
  .document('tenants/{tenantId}/courses/{courseId}')
  .onDelete(async (snap, context) => {
    const { tenantId, courseId } = context.params;
    
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

    // 1. Remove course ID from all enrolled students' courses arrays
    // We get the stored studentIds from the deleted document (snap.data())
    const courseData = snap.data();
    const studentIds: string[] = courseData.studentIds || [];
    
    for (const studentId of studentIds) {
      const studentRef = db.doc(`tenants/${tenantId}/students/${studentId}`);
      batch.update(studentRef, { courses: admin.firestore.FieldValue.arrayRemove(courseId) });
      operationCount++;
      await commitBatchIfNeeded();
    }

    // 2. Delete assignments linked to course
    const assignmentsSnap = await db.collection(`tenants/${tenantId}/assignments`)
        .where('courseId', '==', courseId)
        .get();
    
    for (const doc of assignmentsSnap.docs) {
        batch.delete(doc.ref);
        operationCount++;
        await commitBatchIfNeeded();
    }

    // 3. Delete classes linked to course
    const classesSnap = await db.collection(`tenants/${tenantId}/classes`)
        .where('courseId', '==', courseId)
        .get();
        
    for (const doc of classesSnap.docs) {
        batch.delete(doc.ref);
        operationCount++;
        await commitBatchIfNeeded();
    }

    try {
        if (operationCount > 0) {
            await batch.commit();
        }
        console.log(`Successfully cascaded delete for course ${courseId} in tenant ${tenantId}`);
    } catch (err) {
        console.error(`Failed to cascade delete for course ${courseId}`, err);
    }
  });
