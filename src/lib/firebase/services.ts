
import { firestore } from './client-app';
import { collection, doc, getDoc, setDoc, addDoc, deleteDoc, getDocs, query, where, Timestamp, writeBatch } from 'firebase/firestore';
import { type Student, type UserRole, type Lead, type Course, type Assignment, type Class, StudentStatus, LeadStatus } from '../types';

export type UserProfile = {
  fullName: string;
  email: string;
  role: UserRole | UserRole[];
  tenantId?: string; // null for Platform Super
  avatar?: string;
};

const usersCollection = collection(firestore, 'users');
const studentsCollection = collection(firestore, 'students');

/**
 * Creates a user profile document in Firestore.
 * @param uid The user's unique ID from Firebase Authentication.
 * @param data The user profile data.
 */
export async function createUserProfile(uid: string, data: UserProfile): Promise<void> {
  const userDocRef = doc(firestore, 'users', uid);
  await setDoc(userDocRef, data);
}

/**
 * Fetches a user profile document from Firestore.
 * @param uid The user's unique ID.
 * @returns The user profile data, or null if it doesn't exist.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userDocRef = doc(firestore, 'users', uid);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  } else {
    return null;
  }
}


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

// --- Classes Services ---

/**
 * Fetches all classes for a tenant.
 */
export async function getClasses(tenantId: string): Promise<any[]> {
  const classesRef = collection(firestore, `tenants/${tenantId}/classes`);
  const querySnapshot = await getDocs(classesRef);

  const classes: any[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const start = data.start instanceof Timestamp ? data.start.toDate() : new Date(data.start);
    let end = data.end instanceof Timestamp ? data.end.toDate() : (data.end ? new Date(data.end) : null);

    if (!end && data.duration) {
      end = new Date(start.getTime() + data.duration * 60000);
    } else if (!end) {
      end = new Date(start.getTime() + 60 * 60000);
    }

    classes.push({
      id: doc.id,
      ...data,
      start,
      end
    });
  });
  return classes;
}

export async function addClass(tenantId: string, classData: any): Promise<Class> {
  const classesRef = collection(firestore, `tenants/${tenantId}/classes`);
  const docRef = await addDoc(classesRef, classData);
  return { id: docRef.id, ...classData } as Class;
}


export async function deleteClass(tenantId: string, classId: string): Promise<void> {
  await deleteDoc(doc(firestore, `tenants/${tenantId}/classes`, classId));
}

export async function updateClass(tenantId: string, classId: string, classData: any): Promise<void> {
  const classRef = doc(firestore, `tenants/${tenantId}/classes`, classId);
  await setDoc(classRef, classData, { merge: true });
}


/**
 * Adds a series of recurring classes.
 */
export async function addRecurringClassSeries(
  tenantId: string,
  baseClassData: any,
  recurrence: { frequency: 'weekly'; endDate: Date }
): Promise<void> {
  const batch = writeBatch(firestore);
  const classesRef = collection(firestore, `tenants/${tenantId}/classes`);

  let currentDate = new Date(baseClassData.start);
  const endDate = recurrence.endDate;
  // Ensure we stop at end of day of end date
  const endThreshold = new Date(endDate);
  endThreshold.setHours(23, 59, 59, 999);

  while (currentDate <= endThreshold) {
    const docRef = doc(classesRef);
    const classData = {
      ...baseClassData,
      start: new Date(currentDate),
      end: new Date(currentDate.getTime() + (baseClassData.end.getTime() - baseClassData.start.getTime()))
    };
    batch.set(docRef, classData);

    // Increment by 7 days
    currentDate.setDate(currentDate.getDate() + 7);
  }

  await batch.commit();
}

// --- Tenant Services ---

const tenantsCollection = collection(firestore, 'tenants');

export async function createTenant(data: { name: string; plan: 'basic' | 'pro' | 'enterprise' }, ownerId: string): Promise<string> {
  const docRef = await addDoc(tenantsCollection, {
    ...data,
    ownerId,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getTenants(): Promise<any[]> {
  const querySnapshot = await getDocs(tenantsCollection);
  const tenants: any[] = [];
  querySnapshot.forEach((d) => {
    tenants.push({ id: d.id, ...d.data() });
  });
  return tenants;
}

export async function getTenantById(tenantId: string): Promise<any | null> {
  const docSnap = await getDoc(doc(firestore, 'tenants', tenantId));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

// --- Availability Services ---

export async function getAvailability(tenantId: string, userId: string): Promise<any[]> {
  const availabilityRef = collection(firestore, `tenants/${tenantId}/availability`);
  const q = query(availabilityRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  const slots: any[] = [];
  querySnapshot.forEach((d) => {
    slots.push({ id: d.id, ...d.data() });
  });
  return slots;
}

export async function setAvailability(tenantId: string, userId: string, slots: any[]): Promise<void> {
  const availabilityRef = collection(firestore, `tenants/${tenantId}/availability`);

  // Delete old slots for this user
  const q = query(availabilityRef, where("userId", "==", userId));
  const existing = await getDocs(q);
  const deletePromises = existing.docs.map(d => deleteDoc(d.ref));
  await Promise.all(deletePromises);

  // Add new slots
  for (const slot of slots) {
    await addDoc(availabilityRef, { ...slot, userId, tenantId });
  }
}

// --- Course Services ---

/**
 * Fetches all courses for a tenant.
 */
export async function getCourses(tenantId: string): Promise<Course[]> {
  const coursesRef = collection(firestore, `tenants/${tenantId}/courses`);
  const querySnapshot = await getDocs(coursesRef);
  const courses: Course[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    courses.push({
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(),
    } as Course);
  });
  return courses;
}

/**
 * Adds a new course to a tenant.
 */
export async function addCourse(
  tenantId: string,
  courseData: Omit<Course, 'id' | 'createdAt'>
): Promise<Course> {
  const coursesRef = collection(firestore, `tenants/${tenantId}/courses`);
  const newCourseData = {
    ...courseData,
    createdAt: Timestamp.now(),
    studentIds: courseData.studentIds || [],
  };
  const docRef = await addDoc(coursesRef, newCourseData);
  return {
    ...newCourseData,
    id: docRef.id,
    createdAt: new Date(),
  };
}

/**
 * Updates an existing course.
 */
export async function updateCourse(
  tenantId: string,
  courseId: string,
  courseData: Partial<Omit<Course, 'id' | 'createdAt'>>
): Promise<void> {
  const courseRef = doc(firestore, `tenants/${tenantId}/courses`, courseId);
  await setDoc(courseRef, courseData, { merge: true });
}


/**
 * Deletes a course and performs cascading deletes (removes from student enrollments, deletes associated assignments and classes).
 */
export async function deleteCourse(tenantId: string, courseId: string): Promise<void> {
  const batch = writeBatch(firestore);
  const courseRef = doc(firestore, `tenants/${tenantId}/courses`, courseId);

  // 1. Get the course to find enrolled students
  const courseSnap = await getDoc(courseRef);
  if (courseSnap.exists()) {
    const studentIds: string[] = courseSnap.data().studentIds || [];
    // Remove this course from all enrolled students' profiles
    for (const studentId of studentIds) {
      const studentRef = doc(firestore, `tenants/${tenantId}/students`, studentId);
      batch.update(studentRef, { courses: arrayRemove(courseId) });
    }
  }

  // 2. Delete associated assignments
  const assignmentsRef = collection(firestore, `tenants/${tenantId}/assignments`);
  const assignmentsQuery = query(assignmentsRef, where('courseId', '==', courseId));
  const assignmentsSnap = await getDocs(assignmentsQuery);
  assignmentsSnap.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });

  // 3. Delete associated classes
  const classesRef = collection(firestore, `tenants/${tenantId}/classes`);
  const classesQuery = query(classesRef, where('courseId', '==', courseId));
  const classesSnap = await getDocs(classesQuery);
  classesSnap.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });

  // 4. Finally delete the course itself
  batch.delete(courseRef);

  await batch.commit();
}

/**
 * Updates the enrollment for a course, syncing both Course.studentIds and Student.courses.
 * @param tenantId The tenant ID.
 * @param courseId The course ID.
 * @param newStudentIds The complete list of student IDs that should be enrolled in this course.
 */
import { arrayUnion, arrayRemove } from 'firebase/firestore';

export async function updateCourseEnrollment(
  tenantId: string,
  courseId: string,
  newStudentIds: string[]
): Promise<void> {
  const courseRef = doc(firestore, `tenants/${tenantId}/courses`, courseId);
  const courseSnap = await getDoc(courseRef);

  if (!courseSnap.exists()) throw new Error("Course not found");

  const currentStudentIds: string[] = courseSnap.data().studentIds || [];

  // Calculate changes
  const addedIds = newStudentIds.filter(id => !currentStudentIds.includes(id));
  const removedIds = currentStudentIds.filter(id => !newStudentIds.includes(id));

  if (addedIds.length === 0 && removedIds.length === 0) return; // No changes

  const batch = writeBatch(firestore);

  // 1. Update Course
  batch.update(courseRef, { studentIds: newStudentIds });

  // 2. Update Added Students
  addedIds.forEach(studentId => {
    const studentRef = doc(firestore, `tenants/${tenantId}/students`, studentId);
    batch.update(studentRef, { courses: arrayUnion(courseId) });
  });

  // 3. Update Removed Students
  removedIds.forEach(studentId => {
    const studentRef = doc(firestore, `tenants/${tenantId}/students`, studentId);
    batch.update(studentRef, { courses: arrayRemove(courseId) });
  });

  await batch.commit();
}

// --- Lead Services ---

/**
 * Fetches all leads for a tenant.
 */
export async function getLeads(tenantId: string): Promise<Lead[]> {
  const leadsRef = collection(firestore, `tenants/${tenantId}/leads`);
  const querySnapshot = await getDocs(leadsRef);
  const leads: Lead[] = [];
  querySnapshot.forEach((doc) => {
    leads.push({ id: doc.id, ...doc.data() } as Lead);
  });
  return leads;
}

import { orderBy, limit as firestoreLimit } from 'firebase/firestore';

/**
 * Fetches the most recent leads for a tenant (optimized for dashboard widgets).
 */
export async function getRecentLeads(tenantId: string, limitCount: number = 5): Promise<Lead[]> {
  const leadsRef = collection(firestore, `tenants/${tenantId}/leads`);
  const q = query(leadsRef, orderBy('dateAdded', 'desc'), firestoreLimit(limitCount));
  const querySnapshot = await getDocs(q);
  const leads: Lead[] = [];
  querySnapshot.forEach((doc) => {
    leads.push({ id: doc.id, ...doc.data() } as Lead);
  });
  return leads;
}

/**
 * Adds a new lead.
 */
export async function addLead(tenantId: string, leadData: Omit<Lead, 'id'>): Promise<Lead> {
  const leadsRef = collection(firestore, `tenants/${tenantId}/leads`);
  const docRef = await addDoc(leadsRef, leadData);
  return { id: docRef.id, ...leadData };
}

/**
 * Updates a lead.
 */
export async function updateLead(tenantId: string, leadId: string, leadData: Partial<Omit<Lead, 'id'>>): Promise<void> {
  const leadRef = doc(firestore, `tenants/${tenantId}/leads`, leadId);
  await setDoc(leadRef, leadData, { merge: true });
}

/**
 * Deletes a lead.
 */
export async function deleteLead(tenantId: string, leadId: string): Promise<void> {
  await deleteDoc(doc(firestore, `tenants/${tenantId}/leads`, leadId));
}

// --- Assignment Services ---

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

// --- Attendance Services ---

import type { AttendanceRecord } from '../types';

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
 * Operates natively via Firestore to avoid downloading the entire collection.
 */
export async function getRecentAttendance(tenantId: string, limitCount: number = 50): Promise<AttendanceRecord[]> {
  const attendanceRef = collection(firestore, `tenants/${tenantId}/attendance`);
  const q = query(attendanceRef, orderBy('date', 'desc'), firestoreLimit(limitCount));
  const snapshot = await getDocs(q);
  const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AttendanceRecord));
  return records;
}
