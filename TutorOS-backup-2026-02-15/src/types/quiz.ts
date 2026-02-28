export enum QuizStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export interface QuizQuestionConfig {
  questionId: string;
  points: number;
  order: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  status: QuizStatus;

  // Configuration
  questions: QuizQuestionConfig[];
  totalPoints: number;
  timeLimitMinutes?: number; // Optional time limit

  // Public Sharing
  publicSlug?: string; // Unique slug for public URL (e.g., "sat-algebra-quiz-2026")
  isPublic?: boolean; // Whether quiz is publicly accessible
  accessPassword?: string; // Optional password protection

  // Metadata
  createdAt: number;
  updatedAt: number;
  createdBy: string; // UserId
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface QuizDraft extends Omit<
  Quiz,
  "id" | "createdAt" | "updatedAt" | "totalPoints"
> {
  // Drafts might not have all fields yet
}
