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
