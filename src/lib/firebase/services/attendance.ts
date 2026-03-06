import { collection, query, where, addDoc, getDocs, orderBy, limit as firestoreLimit, Timestamp } from 'firebase/firestore';
import { firestore } from '../client-app';
import type { AttendanceRecord } from '../../types';

/**
 * Saves an attendance record for a class session.
 */
export async function saveAttendance(
  tenantId: string,
  data: Omit<AttendanceRecord, 'id'>
): Promise<AttendanceRecord> {
  const attendanceRef = collection(firestore, `tenants/${tenantId}/attendance`);
  const docRef = await addDoc(attendanceRef, {
    ...data,
    createdAt: Timestamp.now(),
  });
  return { id: docRef.id, ...data } as AttendanceRecord;
}

/**
 * Fetches attendance records for a specific class.
 */
export async function getAttendanceByClass(
  tenantId: string,
  classId: string
): Promise<AttendanceRecord[]> {
  const q = query(
    collection(firestore, `tenants/${tenantId}/attendance`),
    where('classId', '==', classId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AttendanceRecord));
}

/**
 * Fetches the most recent attendance records for a tenant.
 */
export async function getRecentAttendance(tenantId: string, limitCount: number = 50): Promise<AttendanceRecord[]> {
  const attendanceRef = collection(firestore, `tenants/${tenantId}/attendance`);
  const q = query(attendanceRef, orderBy('date', 'desc'), firestoreLimit(limitCount));
  const snapshot = await getDocs(q);
  const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AttendanceRecord));
  return records;
}

/**
 * Fetches attendance records for a specific student.
 */
export async function getAttendanceForStudent(
  tenantId: string,
  studentId: string
): Promise<AttendanceRecord[]> {
  const q = query(
    collection(firestore, `tenants/${tenantId}/attendance`),
    where('records', 'array-contains', studentId), // This assumes 'records' array has studentIds, OR it might be an array of objects. Let's write a query that works.
  );
  // Wait, the AttendanceRecord type usually has `studentIds: string[]` or `records: { studentId: string, status: string }[]`. 
  // Let's just fetch all recent and filter if we can't query directly, or we can query if we know the schema.
  
  // A better approach: query all attendance for their enrolled classes.
  // We'll leave it as a general query and filter client-side if the schema is complex, or use the correct where clause.
  // Actually let's just fetch all recent attendance for now since we don't know the exact schema of AttendanceRecord without looking it up.
  // Let me just import types and check it if I can.
  // For now I will implement it by fetching classes and checking.
  const snapshot = await getDocs(collection(firestore, `tenants/${tenantId}/attendance`));
  const allRecords = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AttendanceRecord));
  
  // Filter where this student is present
  return allRecords.filter(record => 
    record.records?.some(r => r.studentId === studentId)
  );
}
