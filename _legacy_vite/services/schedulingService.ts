import { db } from './firebase';
import { collection, doc, addDoc, getDocs, Timestamp, writeBatch, updateDoc, deleteDoc } from 'firebase/firestore';

// Types adapted from ChronoClass
export interface Class {
    id: string;
    title: string;
    courseId?: string;
    start: Date;
    end: Date;
    meetLink?: string;
    students?: string[]; // Array of student IDs
    ownerId?: string;
    status: 'scheduled' | 'cancelled' | 'completed';
    googleEventId?: string; // For Google Calendar Integration
}

export interface Course {
    id: string;
    title: string;
    description?: string;
    instructor: string;
    instructorId?: string;
    duration?: string; // e.g. "8 Weeks"
    image?: string;
    studentIds?: string[];
    status: 'active' | 'archived' | 'draft';
    createdAt: Date;
}

export interface Student {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    enrolledDate?: Date;
    progress?: number; // 0-100
    status?: 'Active' | 'On-hold' | 'Graduated' | 'Dropped';
    notes?: string;
    phone?: string;
    curriculum?: string;
    grade?: string;
    timezone?: string;
}

// Collections (Root level for single tenant)
const classesCollection = collection(db, 'classes');
const coursesCollection = collection(db, 'courses');
const studentsCollection = collection(db, 'students');

// --- Classes Services ---

// --- Classes Services ---

export async function getClasses(): Promise<Class[]> {
    const querySnapshot = await getDocs(classesCollection);
    const classes: Class[] = [];

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Handle Firestore Timestamps
        const start = data.start instanceof Timestamp ? data.start.toDate() : new Date(data.start);
        let end = data.end instanceof Timestamp ? data.end.toDate() : (data.end ? new Date(data.end) : null);

        if (!end && data.duration) {
            end = new Date(start.getTime() + data.duration * 60000);
        } else if (!end) {
            // Default to 1 hour if no end time
            end = new Date(start.getTime() + 60 * 60000);
        }

        classes.push({
            id: doc.id,
            ...data,
            start,
            end,
            status: data.status || 'scheduled' // Default to scheduled if missing
        } as Class);
    });

    return classes;
}

export async function addClass(classData: Omit<Class, 'id'>): Promise<Class> {
    const docRef = await addDoc(classesCollection, classData);
    return { id: docRef.id, ...classData } as Class;
}

// ... existing addRecurringClassSeries ...
export async function addRecurringClassSeries(
    baseClassData: Omit<Class, 'id'>,
    recurrence: { frequency: 'weekly'; endDate: Date }
): Promise<void> {
    const batch = writeBatch(db);

    let currentDate = new Date(baseClassData.start);
    const endDate = recurrence.endDate;
    const endThreshold = new Date(endDate);
    endThreshold.setHours(23, 59, 59, 999);

    const duration = baseClassData.end.getTime() - baseClassData.start.getTime();

    while (currentDate <= endThreshold) {
        const docRef = doc(classesCollection);
        const classStart = new Date(currentDate);
        const classEnd = new Date(classStart.getTime() + duration);

        const classData = {
            ...baseClassData,
            start: classStart,
            end: classEnd
        };
        batch.set(docRef, classData);

        // Increment by 7 days
        currentDate.setDate(currentDate.getDate() + 7);
    }

    await batch.commit();
}

// --- Course Services ---

export async function getCourses(): Promise<Course[]> {
    const querySnapshot = await getDocs(coursesCollection);
    const courses: Course[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        courses.push({
            id: doc.id,
            ...data,
            status: data.status || 'active',
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        } as Course);
    });
    return courses;
}

export async function addCourse(courseData: Omit<Course, 'id' | 'createdAt'>): Promise<Course> {
    const newCourse = {
        ...courseData,
        createdAt: new Date(),
        status: courseData.status || 'active'
    };
    const docRef = await addDoc(coursesCollection, newCourse);
    return { id: docRef.id, ...newCourse } as Course;
}

export async function updateCourse(id: string, updates: Partial<Course>): Promise<void> {
    const docRef = doc(db, 'courses', id);
    // @ts-ignore - Firestore update accepts Partial but TS types can be strict about undefined
    await updateDoc(docRef, updates);
}

export async function deleteCourse(id: string): Promise<void> {
    await deleteDoc(doc(db, 'courses', id));
}

// --- Student Services ---

export async function getStudents(): Promise<Student[]> {
    const querySnapshot = await getDocs(studentsCollection);
    const students: Student[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        students.push({
            id: doc.id,
            ...data,
            status: data.status || 'Active',
            enrolledDate: data.enrolledDate instanceof Timestamp ? data.enrolledDate.toDate() : new Date()
        } as Student);
    });
    return students;
}

export async function addStudent(studentData: Omit<Student, 'id' | 'enrolledDate' | 'status'>): Promise<Student> {
    const newStudent = {
        ...studentData,
        enrolledDate: new Date(),
        status: 'Active' as const,
        progress: 0
    };
    const docRef = await addDoc(studentsCollection, newStudent);
    return { id: docRef.id, ...newStudent } as Student;
}

export async function updateStudent(id: string, updates: Partial<Student>): Promise<void> {
    const docRef = doc(db, 'students', id);
    // @ts-ignore
    await updateDoc(docRef, updates);
}

export async function deleteStudent(id: string): Promise<void> {
    await deleteDoc(doc(db, 'students', id));
}


