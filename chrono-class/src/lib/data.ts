import { type Lead, type Student, type Course, type Class, type Assignment, type User, LeadStatus, StudentStatus, CourseStatus, ClassStatus, AssignmentStatus } from '@/lib/types';

export const user: User = {
  id: 'user-1',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  avatar: '/avatars/01.png',
};

export const leads: Lead[] = [
  { id: 'lead-1', name: 'John Smith', email: 'john.smith@example.com', phone: '123-456-7890', status: LeadStatus.New, source: 'Website', dateAdded: '2024-05-01' },
  { id: 'lead-2', name: 'Emily Johnson', email: 'emily.j@example.com', phone: '234-567-8901', status: LeadStatus.Contacted, source: 'Referral', dateAdded: '2024-05-02' },
  { id: 'lead-3', name: 'Michael Brown', email: 'michael.b@example.com', phone: '345-678-9012', status: LeadStatus.Qualified, source: 'Social Media', dateAdded: '2024-05-03' },
  { id: 'lead-4', name: 'Jessica Davis', email: 'jessica.d@example.com', phone: '456-789-0123', status: LeadStatus.Converted, source: 'Website', dateAdded: '2024-04-28' },
  { id: 'lead-5', name: 'David Wilson', email: 'david.w@example.com', phone: '567-890-1234', status: LeadStatus.Lost, source: 'Referral', dateAdded: '2024-04-25' },
];

export const students: Student[] = [
  { id: 'student-1', name: 'Sophia Martinez', email: 'sophia.m@example.com', avatar: 'https://picsum.photos/seed/101/40/40', enrolledDate: '2023-09-01', courses: ['course-1', 'course-2'], progress: 75, status: StudentStatus.Active, notes: "Excels in creative assignments, but needs encouragement in group projects. Showing great potential in Python." },
  { id: 'student-2', name: 'Liam Garcia', email: 'liam.g@example.com', avatar: 'https://picsum.photos/seed/102/40/40', enrolledDate: '2023-09-01', courses: ['course-1'], progress: 90, status: StudentStatus.Active },
  { id: 'student-3', name: 'Olivia Rodriguez', email: 'olivia.r@example.com', avatar: 'https://picsum.photos/seed/103/40/40', enrolledDate: '2023-10-15', courses: ['course-3'], progress: 45, status: StudentStatus.OnHold, notes: "Took a temporary leave for a family matter. Expected to return next semester." },
  { id: 'student-4', name: 'Noah Hernandez', email: 'noah.h@example.com', avatar: 'https://picsum.photos/seed/104/40/40', enrolledDate: '2023-10-15', courses: ['course-2', 'course-3'], progress: 60, status: StudentStatus.Active },
  { id: 'student-5', name: 'Emma Lopez', email: 'emma.l@example.com', avatar: 'https://picsum.photos/seed/105/40/40', enrolledDate: '2024-01-20', courses: ['course-4'], progress: 20, status: StudentStatus.Active },
  { id: 'student-6', name: 'James Brown', email: 'james.b@example.com', avatar: 'https://picsum.photos/seed/106/40/40', enrolledDate: '2022-08-10', courses: ['course-1'], progress: 100, status: StudentStatus.Graduated },
];

export const courses: Course[] = [
  { id: 'course-1', title: 'Advanced Mathematics', description: 'Deep dive into calculus and linear algebra.', instructor: 'Dr. Evelyn Reed', duration: '12 Weeks', image: 'https://picsum.photos/seed/201/600/400', status: CourseStatus.Active },
  { id: 'course-2', title: 'Introduction to Python', description: 'Learn the fundamentals of Python programming.', instructor: 'Mr. David Chen', duration: '8 Weeks', image: 'https://picsum.photos/seed/202/600/400', status: CourseStatus.Active },
  { id: 'course-3', title: 'World History: Ancient Civilizations', description: 'Explore the history of early human societies.', instructor: 'Ms. Sarah Jones', duration: '10 Weeks', image: 'https://picsum.photos/seed/203/600/400', status: CourseStatus.Active },
  { id: 'course-4', title: 'Creative Writing Workshop', description: 'Hone your storytelling and writing skills.', instructor: 'Mr. Ben Carter', duration: '6 Weeks', image: 'https://picsum.photos/seed/204/600/400', status: CourseStatus.Active },
];

const today = new Date();
const getDay = (dayOfWeek: number, hour: number, minute: number) => {
    const date = new Date();
    date.setDate(today.getDate() + (dayOfWeek - today.getDay()));
    date.setHours(hour, minute, 0, 0);
    return date;
}

export const classes: Class[] = [
  { id: 'class-1', courseId: 'course-1', title: 'Advanced Mathematics', start: getDay(1, 14, 0), end: getDay(1, 15, 30), students: ['student-1', 'student-2'], meetLink: 'https://meet.google.com/abc-defg-hij', status: ClassStatus.Scheduled },
  { id: 'class-2', courseId: 'course-2', title: 'Introduction to Python', start: getDay(2, 10, 0), end: getDay(2, 11, 0), students: ['student-1', 'student-4'], meetLink: 'https://meet.google.com/klm-nopq-rst', status: ClassStatus.Scheduled },
  { id: 'class-3', courseId: 'course-3', title: 'World History', start: getDay(3, 11, 30), end: getDay(3, 13, 0), students: ['student-3', 'student-4'], meetLink: 'https://meet.google.com/uvw-xyza-bcd', status: ClassStatus.Scheduled },
  { id: 'class-4', courseId: 'course-1', title: 'Advanced Mathematics', start: getDay(4, 14, 0), end: getDay(4, 15, 30), students: ['student-1', 'student-2'], meetLink: 'https://meet.google.com/efg-hijk-lmn', status: ClassStatus.Scheduled },
  { id: 'class-5', courseId: 'course-4', title: 'Creative Writing', start: getDay(5, 9, 0), end: getDay(5, 10, 30), students: ['student-5'], meetLink: 'https://meet.google.com/opq-rstu-vwx', status: ClassStatus.Scheduled },
];

export const assignments: Assignment[] = [
  { id: 'assign-1', courseId: 'course-1', title: 'Problem Set 5', dueDate: new Date('2024-05-28'), status: AssignmentStatus.Graded },
  { id: 'assign-2', courseId: 'course-2', title: 'Final Project Proposal', dueDate: new Date('2024-06-05'), status: AssignmentStatus.Submitted },
  { id: 'assign-3', courseId: 'course-3', title: 'Essay on Roman Empire', dueDate: new Date('2024-06-10'), status: AssignmentStatus.Pending },
  { id: 'assign-4', courseId: 'course-1', title: 'Problem Set 6', dueDate: new Date('2024-06-12'), status: AssignmentStatus.Pending },
];
