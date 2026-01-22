export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';
  source: string;
  dateAdded: string;
  notes?: string;
  timezone?: string;
};

export type Student = {
  id: string;
  ownerId?: string; // UID of the user who owns this student record (Legacy or specific owner)
  name: string;
  email: string;
  avatar: string;
  enrolledDate: string;
  courses: string[];
  progress: number; // Percentage
  status: 'Active' | 'On-hold' | 'Graduated' | 'Dropped';
  notes?: string;
  phone?: string;
  curriculum?: string;
  grade?: string;
  timezone?: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorId?: string; // Link to teacher user
  duration: string; // e.g., '8 Weeks'
  image: string;
  studentIds?: string[]; // Enrolled students
  status: 'active' | 'archived' | 'draft';
  createdAt?: Date;
};

export type Class = {
  id: string;
  courseId: string;
  title: string;
  start: Date;
  end: Date;
  meetLink?: string;
  students: string[]; // array of student ids
  ownerId?: string;
  status: 'scheduled' | 'cancelled' | 'completed';
  googleEventId?: string; // For Google Calendar Integration
}
  ;

export type Assignment = {
  id: string;
  courseId: string;
  title: string;
  dueDate: string;
  status: 'Pending' | 'Submitted' | 'Graded';
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

// --- Multi-Tenant Types ---

export type UserRole = 'super' | 'admin' | 'executive' | 'teacher' | 'parent' | 'student';

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

export type AvailabilitySlot = {
  id: string;
  tenantId: string;
  userId: string; // Teacher ID
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // Sunday = 0
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  status: 'available' | 'busy';
};
