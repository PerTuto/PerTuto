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
  // AI Lead Scoring
  aiScore?: number;
  aiCategory?: 'Hot' | 'Warm' | 'Cold';
  aiReasoning?: string;
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
  parentId?: string; // UID of the parent user linked to this student
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
  startTime?: Date; // Alias used in some components
  meetLink?: string;
  students?: string[]; // array of student ids
  studentIds?: string[]; // alias
  ownerId?: string;
  status: ClassStatus;
  googleEventId?: string; // For Google Calendar Integration
  // Smart Rescheduling fields
  rescheduleStatus?: 'requested' | 'approved' | 'rejected';
  requestedTime?: Date; // The new proposed start time
  requestedBy?: string; // UID of the user who requested
  rescheduleReason?: string;
  // Recurring series tracking
  recurrenceGroupId?: string; // Shared UUID linking all classes in a recurring series
  recurrencePattern?: 'weekly'; // Recurrence frequency
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
  submissionUrls?: string[]; // URLs of uploaded files
  submittedBy?: string; // Student UID
  submittedAt?: Date;
  grade?: string;
  feedback?: string;
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
  settings?: {
    defaultHourlyRate: number;
    currency: string;
    noShowPolicy: string;
    logoUrl?: string;
    timezone?: string;
    timeFormat?: '12h' | '24h';
  };
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

// --- Financial & Billing Types ---

export enum InvoiceStatus {
  Draft = 'Draft',
  Unpaid = 'Unpaid',
  Paid = 'Paid',
  Overdue = 'Overdue',
  Cancelled = 'Cancelled'
}

export type InvoiceLineItem = {
  id: string; // Unique for the item
  description: string; // e.g. "8 Sessions of SAT Math"
  quantity: number;
  unitPrice: number;
  total: number;
};

export type Invoice = {
  id: string;
  tenantId: string;
  studentId: string; // The primary student this invoice is for
  parentId?: string; // Optional: Link to the parent user who pays
  status: InvoiceStatus;
  issueDate: Date;
  dueDate: Date;
  items: InvoiceLineItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  notes?: string;
  createdAt: Date;
  createdBy: string; // Admin UID
};

export enum PaymentMethod {
  CreditCard = 'Credit Card',
  BankTransfer = 'Bank Transfer',
  Cash = 'Cash',
  Check = 'Check',
  Other = 'Other'
}

export type Payment = {
  id: string;
  tenantId: string;
  invoiceId?: string; // Optional: Some payments are direct ledger credits, not tied to a specific invoice yet
  studentId: string;
  parentId?: string;
  amount: number;
  method: PaymentMethod;
  date: Date;
  referenceId?: string; // e.g., Stripe Charge ID
  notes?: string;
  recordedBy: string; // Admin UID
};

export enum LedgerTransactionType {
  Charge = 'Charge', // An invoice was finalized
  Payment = 'Payment', // A parent paid money
  Credit = 'Credit', // An admin gave a manual credit (e.g. refund/discount)
  Adjustment = 'Adjustment' // Admin manual fix
}

export type LedgerTransaction = {
  id: string;
  tenantId: string;
  studentId: string;
  parentId?: string;
  type: LedgerTransactionType;
  amount: number; // Positive for payments/credits (adds to balance), Negative for charges (reduces balance)
  description: string;
  date: Date;
  relatedInvoiceId?: string;
  relatedPaymentId?: string;
  recordedBy: string;
};

// --- Testimonial Types ---

export enum TestimonialStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected'
}

export type Testimonial = {
  id: string;
  tenantId: string;
  name: string;
  role: string; // e.g. "Parent of IB Student"
  quote: string;
  rating: number; // 1-5
  status: TestimonialStatus;
  createdAt: Date;
};

// --- Resource Types ---

export enum ResourceType {
  Syllabus = 'syllabus',
  PastPaper = 'past-paper',
  StudyGuide = 'study-guide',
  FAQ = 'faq'
}

export type Resource = {
  id: string;
  tenantId: string;
  vertical: 'k12' | 'higher-ed' | 'professional';
  type: ResourceType;
  board: string;           // e.g. "IB", "CAIE", "CBSE", "Engineering", "AI-ML"
  curriculum: string;      // Legacy/display name
  subject: string;         // e.g. "Mathematics"
  grade: string;           // e.g. "10", "SL", "Beginner"
  title: string;           // e.g. "Ch 3: Pair of Linear Equations"
  content: string;         // Markdown body
  fileUrl?: string;        // Firebase Storage URL for PDFs
  fileName?: string;       // Original filename
  year?: string;           // For past papers
  session?: string;        // "March" | "Compartment"
  tags: string[];
  sortOrder: number;
  published: boolean;
  isFeatured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
  createdAt: Date;
  updatedAt: Date;
};

// --- Website Content Types ---

export type WebsiteContent = {
  id: string; // Document ID (e.g., 'home_page', 'services_k12')
  hero?: {
    title: string;
    subtitle: string;
    badgeText?: string;
    primaryCtaText?: string;
    primaryCtaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
  };
  features?: {
    id: string;
    title: string;
    description: string;
    iconName?: string;
  }[];
  seoTitle?: string;
  seoDescription?: string;
  updatedAt: Date;
  updatedBy: string; // UID of admin who last updated it
};
