import { collection, doc, getDocs, query, where, addDoc, deleteDoc, type Timestamp } from 'firebase/firestore';
import { firestore } from '../client-app';
import { type Student, StudentStatus } from '../../types';

/**
 * Fetches all students for a specific tenant.
 */
export async function getStudents(tenantId: string): Promise<Student[]> {
  const studentsRef = collection(firestore, `tenants/${tenantId}/students`);
  const querySnapshot = await getDocs(studentsRef);
  const students: Student[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    students.push({
      id: doc.id,
      ...data,
      enrolledDate: (data.enrolledDate as Timestamp).toDate().toISOString().split('T')[0],
    } as Student);
  });
  return students;
}

/**
 * Fetches all students linked to a specific parent user.
 */
export async function getChildrenForParent(tenantId: string, parentUserId: string): Promise<Student[]> {
  const studentsRef = collection(firestore, `tenants/${tenantId}/students`);
  const q = query(studentsRef, where("parentId", "==", parentUserId));
  const querySnapshot = await getDocs(q);
  const students: Student[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    students.push({
      id: doc.id,
      ...data,
      enrolledDate: data.enrolledDate?.toDate ? (data.enrolledDate as Timestamp).toDate().toISOString().split('T')[0] : data.enrolledDate,
    } as Student);
  });
  return students;
}

/**
 * Fetches a student document by their linked user ID.
 */
export async function getStudentByUserId(tenantId: string, userId: string): Promise<Student | null> {
  const studentsRef = collection(firestore, `tenants/${tenantId}/students`);
  const q = query(studentsRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) return null;
  
  const docSnap = querySnapshot.docs[0];
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    enrolledDate: data.enrolledDate?.toDate ? (data.enrolledDate as Timestamp).toDate().toISOString().split('T')[0] : data.enrolledDate,
  } as Student;
}

/**
 * Adds a new student to a tenant.
 */
export async function addStudent(tenantId: string, studentData: Omit<Student, 'id' | 'enrolledDate' | 'progress' | 'status' | 'ownerId'>): Promise<Student> {
  const studentsRef = collection(firestore, `tenants/${tenantId}/students`);

  const newStudentData = {
    ...studentData,
    status: StudentStatus.Active,
    progress: 0,
    enrolledDate: new Date(),
  };

  const docRef = await addDoc(studentsRef, newStudentData);

  return {
    ...newStudentData,
    id: docRef.id,
    enrolledDate: newStudentData.enrolledDate.toISOString().split('T')[0],
  };
}

/**
 * Deletes a student from a tenant.
 */
export async function deleteStudent(tenantId: string, studentId: string): Promise<void> {
  await deleteDoc(doc(firestore, `tenants/${tenantId}/students`, studentId));
}
/**
 * Fetches multiple students by their IDs.
 */
export async function getStudentsByIds(tenantId: string, studentIds: string[]): Promise<Student[]> {
  if (studentIds.length === 0) return [];
  const studentsRef = collection(firestore, `tenants/${tenantId}/students`);
  
  // Firestore 'in' queries are limited to 10-30 items depending on version. 
  // For safety and scalability, we do this in chunks if needed, but for now, 
  // a simple query or individual gets is fine for standard batches.
  if (studentIds.length <= 30) {
    const q = query(studentsRef, where("__name__", "in", studentIds));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      enrolledDate: doc.data().enrolledDate?.toDate ? (doc.data().enrolledDate as Timestamp).toDate().toISOString().split('T')[0] : doc.data().enrolledDate,
    } as Student));
  }
  
  // Fallback for larger sets (though batches are usually small)
  const all = await getStudents(tenantId);
  return all.filter(s => studentIds.includes(s.id));
}
