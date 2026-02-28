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
  batchIds?: string[]; // IDs of batches this student belongs to
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

// --- Question Bank Types ---
export type QuestionType =
  | "MCQ_SINGLE"
  | "MCQ_MULTI"
  | "TRUE_FALSE"
  | "FILL_IN_BLANK"
  | "FREE_RESPONSE"
  | "PASSAGE_BASED";

export type QuestionDifficulty = "EASY" | "MEDIUM" | "HARD" | "OLYMPIAD";
export type QuestionStatus = "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";
export type CognitiveDepth = "FLUENCY" | "CONCEPTUAL" | "APPLICATION" | "SYNTHESIS";

export interface Question {
  id: string;
  stem: string; // The question text (may contain LaTeX)
  type: QuestionType;
  difficulty: QuestionDifficulty;
  status: QuestionStatus;
  options: { id: string; text: string; isCorrect: boolean }[]; // For MCQ types
  correctAnswer: string; // For non-MCQ types
  explanation: string; // Solution explanation
  figures: { url: string; caption?: string; base64?: string }[];
  taxonomy: {
    domainId: string; // e.g., "Mathematics"
    topicId: string; // e.g., "Calculus"
    subTopicId: string; // e.g., "Derivatives"
    cognitiveDepth: CognitiveDepth;
    scaffoldLevel: number; // 1-5
    curriculum: string; // e.g., "IB", "CBSE"
    standardMapping?: string; // e.g., "IB.Math.HL.5.1"
  };
  source: {
    origin: "AI_EXTRACTED" | "AI_GENERATED" | "MANUAL";
    extractedFrom?: string; // PDF filename
    pageNumber?: number;
  };
  confidenceScore?: number; // AI confidence 0-100
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// --- Quiz Types ---
export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestionConfig[];
  totalPoints: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  settings: {
    timeLimit?: number; // Minutes
    shuffleQuestions: boolean;
    showResults: boolean;
    allowRetake: boolean;
  };
  isPublic: boolean;
  publicSlug?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizQuestionConfig {
  questionId: string;
  points: number;
  order: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  responses: {
    questionId: string;
    answer: string;
    isCorrect: boolean;
    pointsAwarded: number;
    timeTaken?: number; // Seconds per question
  }[];
  totalScore: number;
  maxScore: number;
  startedAt: Date;
  completedAt?: Date;
  synced: boolean; // IndexedDB → Firestore sync status
}

// --- Taxonomy Types ---
export interface TaxonomyNode {
  id: string;
  parentId: string | null;
  name: string;
  type: "domain" | "topic" | "subtopic" | "microskill";
  order: number;
  description?: string;
}

export interface Subject extends TaxonomyNode {}

// --- Institute Management Types ---

export interface Center {
  id: string;
  name: string;
  address: string;
  city: string;
  contactEmail?: string;
  contactPhone?: string;
  status: "active" | "inactive";
  createdAt: Date;
}

export interface Batch {
  id: string;
  name: string; // e.g., "IB Math HL — Batch A"
  courseId: string;
  centerId?: string; // Optional if no physical center
  teacherIds: string[];
  studentIds: string[];
  status: "active" | "archived";
  schedule?: {
    dayOfWeek: number; // 0-6
    startTime: string; // "14:00"
    durationMins: number;
  }[];
  createdAt: Date;
}

export interface QuestionPaper {
  id: string;
  title: string;
  courseId: string;
  subjectId: string;
  sections: PaperSection[];
  totalMarks: number;
  duration: number; // Minutes
  instructions?: string;
  status: "draft" | "approved" | "archived";
  generationMode: "auto" | "manual" | "ai-assisted";
  syllabus: {
    chapters: { id: string; name: string; weightage: number }[];
  };
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaperSection {
  title: string; // e.g., "Section A — MCQ"
  instructions?: string;
  questions: { questionId: string; marks: number; order: number }[];
  totalMarks: number;
}

export interface SyllabusConfig {
  id: string;
  courseId: string;
  curriculum: string; // "IB", "CBSE", etc.
  chapters: {
    id: string;
    name: string;
    weightage: number; // Percentage
    topics: { id: string; name: string; weightage: number }[];
  }[];
  createdBy: string;
  updatedAt: Date;
}

// --- Test Lifecycle & Evaluation Types ---

export interface Test {
  id: string;
  title: string;
  questionPaperId: string;
  batchIds: string[];
  scheduledDate: Date;
  duration: number; // Minutes
  instructions?: string;
  status:
    | "draft"
    | "scheduled"
    | "in-progress"
    | "completed"
    | "results-published";
  uploadMode: "student-upload" | "admin-bulk" | "online-only";
  createdBy: string;
  createdAt: Date;
}

export interface Evaluation {
  id: string;
  testId: string;
  studentId: string;
  subject: string; // Denormalized for analytics
  answerSheetUrl?: string; // Storage URL (scanned PDF/image)
  questionScores: {
    questionId: string;
    marksAwarded: number;
    maxMarks: number;
    feedback: string; // Per-question AI feedback
    confidence: number; // Per-question confidence 0-100
  }[];
  totalScore: number;
  maxScore: number;
  status: "pending" | "evaluating" | "evaluated" | "reviewed" | "published";
  confidenceScore: number; // Overall AI confidence 0-100
  requiresReview: boolean; // True if confidenceScore < 85
  evaluatedAt?: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
  createdAt: Date;
}

export interface GradeChallenge {
  id: string;
  evaluationId: string;
  testId: string;
  studentId: string;
  questionId: string; // Which question is being challenged
  reason: string; // Student's explanation
  status: "open" | "reviewing" | "resolved";
  resolution?: string; // Teacher's resolution note
  marksChange?: number; // +/- marks adjustment
  resolvedBy?: string;
  createdAt: Date;
  resolvedAt?: Date;
}

// --- Sprint 4: Communication Types ---

export interface Announcement {
  id: string;
  title: string;
  body: string; // Markdown/Rich text
  targetType: "all" | "center" | "course" | "batch";
  targetIds: string[]; // IDs of the selected targets
  priority: "low" | "medium" | "high" | "urgent";
  attachments?: { name: string; url: string }[];
  createdBy: string;
  createdAt: Date;
  expiresAt?: Date;
}

export interface StudyMaterial {
  id: string;
  title: string;
  description?: string;
  subjectId: string;
  chapterId?: string;
  topicId?: string;
  fileUrl: string; // Storage URL
  fileType: "pdf" | "video" | "presentation" | "link" | "image";
  fileSize?: number; // Bytes
  courseIds: string[];
  batchIds: string[];
  uploadedBy: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string; // Recipient
  title: string;
  body: string;
  type: "announcement" | "test" | "grade" | "schedule" | "system";
  link?: string; // Dashboard route to navigate to
  read: boolean;
  createdAt: Date;
}

// --- Sprint 5: Analytics & Predictive AI ---

export interface PerformanceTrend {
  date: string;
  score: number;
  average?: number;
}

export interface SubjectStrength {
  subject: string;
  score: number;
  fullMark: number;
  grade: string;
}

export interface TenantKpis {
  totalStudents: number;
  activeBatches: number;
  attendanceRate: number;
  revenue?: number;
  growthPercentage?: number;
}

// --- Sprint 6: Gamification & Engagement ---

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name or emoji
  unlockedAt: Date;
}

export interface GamificationProfile {
  studentId: string;
  xp: number;
  level: number;
  streakCount: number;
  lastActivityDate: Date;
  badges: Badge[];
  totalQuizzesCompleted: number;
  totalClassesAttended: number;
}

export interface LeaderboardEntry {
  studentId: string;
  name: string;
  avatar?: string;
  xp: number;
  level: number;
  rank?: number;
}
