import { collection, doc, getDoc, getDocs, query, where, addDoc, writeBatch, arrayRemove, arrayUnion, Timestamp } from 'firebase/firestore';
import { firestore } from '../client-app';
import { type Course } from '../../types';

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
 * Fetches all courses assigned to a specific teacher.
 */
export async function getCoursesForTeacher(tenantId: string, instructorId: string): Promise<Course[]> {
  const coursesRef = collection(firestore, `tenants/${tenantId}/courses`);
  const q = query(coursesRef, where("instructorId", "==", instructorId));
  const querySnapshot = await getDocs(q);
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
 * Deletes a course and performs cascading deletes.
 */
export async function deleteCourse(tenantId: string, courseId: string): Promise<void> {
  const batch = writeBatch(firestore);
  const courseRef = doc(firestore, `tenants/${tenantId}/courses`, courseId);

  const courseSnap = await getDoc(courseRef);
  if (courseSnap.exists()) {
    const studentIds: string[] = courseSnap.data().studentIds || [];
    for (const studentId of studentIds) {
      const studentRef = doc(firestore, `tenants/${tenantId}/students`, studentId);
      batch.update(studentRef, { courses: arrayRemove(courseId) });
    }
  }

  const assignmentsRef = collection(firestore, `tenants/${tenantId}/assignments`);
  const assignmentsQuery = query(assignmentsRef, where('courseId', '==', courseId));
  const assignmentsSnap = await getDocs(assignmentsQuery);
  assignmentsSnap.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });

  const classesRef = collection(firestore, `tenants/${tenantId}/classes`);
  const classesQuery = query(classesRef, where('courseId', '==', courseId));
  const classesSnap = await getDocs(classesQuery);
  classesSnap.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });

  batch.delete(courseRef);
  await batch.commit();
}

/**
 * Updates the enrollment for a course, syncing both Course.studentIds and Student.courses.
 */
export async function updateCourseEnrollment(
  tenantId: string,
  courseId: string,
  newStudentIds: string[]
): Promise<void> {
  const courseRef = doc(firestore, `tenants/${tenantId}/courses`, courseId);
  const courseSnap = await getDoc(courseRef);

  if (!courseSnap.exists()) throw new Error("Course not found");

  const currentStudentIds: string[] = courseSnap.data().studentIds || [];
  const addedIds = newStudentIds.filter(id => !currentStudentIds.includes(id));
  const removedIds = currentStudentIds.filter(id => !newStudentIds.includes(id));

  if (addedIds.length === 0 && removedIds.length === 0) return;

  const batch = writeBatch(firestore);
  batch.update(courseRef, { studentIds: newStudentIds });

  addedIds.forEach(studentId => {
    const studentRef = doc(firestore, `tenants/${tenantId}/students`, studentId);
    batch.update(studentRef, { courses: arrayUnion(courseId) });
  });

  removedIds.forEach(studentId => {
    const studentRef = doc(firestore, `tenants/${tenantId}/students`, studentId);
    batch.update(studentRef, { courses: arrayRemove(courseId) });
  });

  await batch.commit();
}
// Import setDoc if used in updateCourse
import { setDoc } from 'firebase/firestore';
