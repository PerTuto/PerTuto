/**
 * PerTuto Learning Hub - Firestore Data Models
 * Focus: IB MYP Math (MVP)
 */

// ============================
// TAXONOMY (Curriculum Structure)
// ============================

export interface Curriculum {
    id: string;           // "ib-myp"
    name: string;         // "IB Middle Years Programme"
    slug: string;         // "ib-myp"
    description?: string;
    createdAt: Date;
}

export interface Subject {
    id: string;           // "math"
    curriculumId: string; // "ib-myp"
    name: string;         // "Mathematics"
    slug: string;         // "math"
    description?: string;
    icon?: string;        // Lucide icon name
    createdAt: Date;
}

export interface Topic {
    id: string;           // "algebra-basics"
    subjectId: string;    // "math"
    curriculumId: string; // "ib-myp"
    parentTopicId?: string; // For nested topics (e.g., Algebra > Linear Equations)
    name: string;         // "Algebra Basics"
    slug: string;         // "algebra-basics"
    path: string;         // "ib-myp/math/algebra-basics" (full SEO path)
    order: number;        // For sorting
    year?: number;        // MYP Year (1-5)
    createdAt: Date;
    updatedAt: Date;
}

// ============================
// CONTENT (The Public Library)
// ============================

export type ResourceType = "note" | "formula_sheet" | "past_paper" | "textbook_solution";

export interface Resource {
    id: string;
    type: ResourceType;
    title: string;
    slug: string;         // "algebra-fundamentals-notes"

    // Taxonomy links
    curriculumId: string;
    subjectId: string;
    topicId?: string;     // Optional for formula sheets that span topics

    // SEO
    description?: string;
    tags: string[];       // ["algebra", "equations", "myp-year-3"]

    // Content
    markdownContent?: string;  // For notes (rendered as HTML)
    contentUrl?: string;       // For PDFs

    // Access control
    isPublished: boolean;
    isGated: boolean;     // true = requires login to view full content

    // Metadata
    author?: string;
    sourceFile?: string;  // Original filename if uploaded
    createdAt: Date;
    updatedAt: Date;
}

export interface Question {
    id: string;

    // Taxonomy
    curriculumId: string;
    subjectId: string;
    topicId: string;

    // Question content
    stem: string;         // The question text (supports LaTeX)
    type: "mcq" | "short_answer" | "long_answer";
    options?: string[];   // For MCQ
    answer: string;       // Correct answer
    explanation?: string; // Step-by-step solution

    // Difficulty & metadata
    difficulty: 1 | 2 | 3 | 4 | 5;  // 1=Easy, 5=Olympiad
    marks?: number;
    source?: string;      // "AI-Generated" | "Past Paper 2023" | "Haese Ch.5"

    // Status
    isPublished: boolean;
    isApproved: boolean;  // Admin has reviewed

    createdAt: Date;
    updatedAt: Date;
}

// ============================
// LMS (For Paid Students)
// ============================

export interface Quiz {
    id: string;
    title: string;
    description?: string;

    // Linked questions
    questionIds: string[];

    // Assignment
    assignedTo: string[]; // User IDs
    dueDate?: Date;

    // Settings
    timeLimitMinutes?: number;
    shuffleQuestions: boolean;
    showAnswersAfter: boolean;

    createdBy: string;    // Admin/Tutor ID
    createdAt: Date;
}

export interface QuizSubmission {
    id: string;
    quizId: string;
    studentId: string;

    // Answers
    answers: Record<string, string>; // questionId -> answer

    // Results
    score?: number;
    maxScore: number;
    percentage?: number;

    status: "in_progress" | "submitted" | "graded";

    startedAt: Date;
    submittedAt?: Date;
    gradedAt?: Date;
    gradedBy?: string;
}

// ============================
// CONTENT PIPELINE
// ============================

export interface ContentUpload {
    id: string;
    fileName: string;
    fileUrl: string;
    mimeType: string;

    // Processing status
    status: "pending" | "processing" | "completed" | "failed";

    // Extracted content
    extractedQuestions?: Question[];
    extractedText?: string;
    aiNotes?: string;

    // Metadata
    uploadedBy: string;
    uploadedAt: Date;
    processedAt?: Date;
    error?: string;
}
