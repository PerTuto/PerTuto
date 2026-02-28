import { collection, doc, getDocs, query, where, addDoc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { firestore } from '../client-app';
import { type Assignment, type Lead, type Student, StudentStatus, LeadStatus } from '../../types';

/**
 * Fetches all assignments for a tenant.
 */
export async function getAssignments(tenantId: string): Promise<Assignment[]> {
  const assignmentsRef = collection(firestore, `tenants/${tenantId}/assignments`);
  const querySnapshot = await getDocs(assignmentsRef);
  const assignments: Assignment[] = [];
  querySnapshot.forEach((doc) => {
    assignments.push({ id: doc.id, ...doc.data() } as Assignment);
  });
  return assignments;
}

/**
 * Fetches assignments scoped to a student's enrolled courses.
 */
export async function getAssignmentsForStudent(tenantId: string, courseIds: string[]): Promise<Assignment[]> {
  if (!courseIds || courseIds.length === 0) return [];
  
  const assignments: Assignment[] = [];
  const chunks = [];
  for (let i = 0; i < courseIds.length; i += 10) {
    chunks.push(courseIds.slice(i, i + 10));
  }

  const assignmentsRef = collection(firestore, `tenants/${tenantId}/assignments`);
  for (const chunk of chunks) {
    const q = query(assignmentsRef, where('courseId', 'in', chunk));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      assignments.push({ id: doc.id, ...doc.data() } as Assignment);
    });
  }
  
  return assignments;
}

/**
 * Adds a new assignment.
 */
export async function addAssignment(tenantId: string, assignmentData: Omit<Assignment, 'id'>): Promise<Assignment> {
  const assignmentsRef = collection(firestore, `tenants/${tenantId}/assignments`);
  const docRef = await addDoc(assignmentsRef, assignmentData);
  return { id: docRef.id, ...assignmentData };
}

/**
 * Updates an assignment.
 */
export async function updateAssignment(tenantId: string, assignmentId: string, assignmentData: Partial<Omit<Assignment, 'id'>>): Promise<void> {
  const assignmentRef = doc(firestore, `tenants/${tenantId}/assignments`, assignmentId);
  await setDoc(assignmentRef, assignmentData, { merge: true });
}

/**
 * Deletes an assignment.
 */
export async function deleteAssignment(tenantId: string, assignmentId: string): Promise<void> {
  await deleteDoc(doc(firestore, `tenants/${tenantId}/assignments`, assignmentId));
}

/**
 * Converts a lead to a student.
 */
export async function convertLeadToStudent(tenantId: string, lead: Lead): Promise<Student> {
  const batch = writeBatch(firestore);

  const studentRef = doc(collection(firestore, `tenants/${tenantId}/students`));
  const leadRef = doc(firestore, `tenants/${tenantId}/leads`, lead.id);

  const studentData: Omit<Student, 'id'> = {
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${lead.email}`,
    enrolledDate: new Date().toISOString().split('T')[0],
    courses: [],
    progress: 0,
    status: StudentStatus.Active,
    timezone: lead.timezone || '',
  };

  batch.set(studentRef, studentData);
  batch.update(leadRef, { status: LeadStatus.Converted });

  await batch.commit();

  return {
    id: studentRef.id,
    ...studentData
  } as Student;
}
