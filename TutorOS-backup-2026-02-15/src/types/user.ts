export type UserRole = "admin" | "student" | "tutor";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: number;
}

export enum AssignmentStatus {
  ASSIGNED = "ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  score: number;
  totalPoints: number;
  answers: Record<string, string | number | boolean>; // questionId -> student response
  status: AssignmentStatus;
  startedAt: number;
  completedAt?: number;
}

export interface QuizAssignment {
  id: string;
  quizId: string;
  studentId: string;
  assignedBy: string;
  assignedAt: number;
  dueDate?: number;
  status: AssignmentStatus;
  attemptId?: string; // Link to the attempt once started
}
