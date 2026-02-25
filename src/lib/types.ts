export enum LeadStatus {
  New = 'New',
  Contacted = 'Contacted',
  Qualified = 'Qualified',
  Converted = 'Converted',
  Lost = 'Lost',
  Waitlisted = 'Waitlisted'
}

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: string;
  dateAdded: string;
  notes?: string;
  timezone?: string;
};

export enum StudentStatus {
  Active = 'Active',
  OnHold = 'On-hold',
  Graduated = 'Graduated',
  Dropped = 'Dropped'
}

export type Student = {
  id: string;
  ownerId?: string; // UID of the user who owns this student record (Legacy or specific owner)
  name: string;
  email: string;
  avatar: string;
  enrolledDate: string;
  courses: string[];
  progress: number; // Percentage
  status: StudentStatus;
  notes?: string;
  phone?: string;
  curriculum?: string;
  grade?: string;
  timezone?: string;
};

export enum CourseStatus {
  Active = 'active',
  Archived = 'archived',
  Draft = 'draft'
}

export type Course = {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorId?: string; // Link to teacher user
  duration: string; // e.g., '8 Weeks'
  image: string;
  studentIds?: string[]; // Enrolled students
  status: CourseStatus;
  createdAt?: Date;
};

export enum ClassStatus {
  Scheduled = 'scheduled',
  Cancelled = 'cancelled',
  Completed = 'completed'
}

export type Class = {
  id: string;
  courseId: string;
  title: string;
  start: Date;
  end: Date;
  meetLink?: string;
  students: string[]; // array of student ids
  ownerId?: string;
  status: ClassStatus;
  googleEventId?: string; // For Google Calendar Integration
};

export enum AssignmentStatus {
  Pending = 'Pending',
  Submitted = 'Submitted',
  Graded = 'Graded'
}

export type Assignment = {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  dueDate: Date;
  status: AssignmentStatus;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

// --- Multi-Tenant Types ---

export enum UserRole {
  Super = 'super',
  Admin = 'admin',
  Executive = 'executive',
  Teacher = 'teacher',
  Parent = 'parent',
  Student = 'student'
}

export type Tenant = {
  id: string;
  name: string;
  plan: 'basic' | 'pro' | 'enterprise';
  createdAt: Date;
  ownerId: string; // Platform Super who created it
};

export type TenantUser = {
  id: string;
  tenantId: string;
  email: string;
  fullName: string;
  role: UserRole | UserRole[];
  avatar?: string;
  createdAt: Date;
  // Executive scoping
  scopedStudentIds?: string[];
  scopedTeacherIds?: string[];
};

export enum AvailabilityStatus {
  Available = 'available',
  Busy = 'busy'
}

export type AvailabilitySlot = {
  id: string;
  tenantId: string;
  userId: string; // Teacher ID
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // Sunday = 0
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  status: AvailabilityStatus;
};

export type AttendanceRecord = {
  id: string;
  classId: string;
  courseId: string;
  date: Date; // Standardize to Date
  records: { studentId: string; studentName: string; present: boolean }[];
  markedBy: string; // userId
  createdAt?: Date;
};
