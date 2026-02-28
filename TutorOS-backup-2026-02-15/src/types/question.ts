// ─── Question Type Enums ────────────────────────────────────────

// Canonical enum — uses the richer backend values.
// Legacy "MULTIPLE_CHOICE" gets mapped to MCQ_SINGLE in the normalizer.
export enum QuestionType {
  MCQ_SINGLE = "MCQ_SINGLE",
  MCQ_MULTI = "MCQ_MULTI",
  FILL_IN_BLANK = "FILL_IN_BLANK",
  FREE_RESPONSE = "FREE_RESPONSE",
  PASSAGE_BASED = "PASSAGE_BASED",
  TRUE_FALSE = "TRUE_FALSE",
}

export enum QuestionDifficulty {
  BEGINNER = "Beginner", // Standard practice
  INTERMEDIATE = "Intermediate", // Application level
  ADVANCED = "Advanced", // Challenge problems
  COMPETITION = "Competition", // Hendrycks/Olympiad level
}

// AI cognitive depth — related to but distinct from QuestionDifficulty.
// The AI uses this for its taxonomy classification; QuestionDifficulty
// is the user-facing label.
export enum CognitiveDepth {
  FLUENCY = "Fluency",
  CONCEPTUAL = "Conceptual",
  APPLICATION = "Application",
  SYNTHESIS = "Synthesis",
}

// ─── Structured Option ──────────────────────────────────────────

export interface QuestionOption {
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

// ─── Source Attribution ─────────────────────────────────────────

export interface QuestionSource {
  dataset:
    | "OpenStax"
    | "NuminaMath"
    | "MathVista"
    | "Hendrycks"
    | "FineMath"
    | "Manual"
    | "AI Extracted"
    | "Seeded";
  originalId?: string; // ID in the source dataset
  license?: string; // e.g. "CC-BY-4.0"
  url?: string; // Link to original resource if applicable
}

// ─── AI Taxonomy ────────────────────────────────────────────────
// Rich taxonomy populated by the AI extraction pipeline.
// Manual questions may have this partially or fully empty.

export interface QuestionTaxonomy {
  domain: string;
  topic: string;
  subTopic?: string;
  microSkill?: string;
  cognitiveDepth?: CognitiveDepth;
  curriculum?: string;
  scaffoldLevel?: number; // 1-5
  commonMisconceptions?: string[];
}

// ─── The Canonical Question ─────────────────────────────────────

export interface Question {
  id: string;
  title?: string;

  // The main problem text. Supports LaTeX (e.g. $E=mc^2$).
  // For AI-extracted questions, this is the stemMarkdown output.
  // There is ONE content field — no duplication.
  content: string;

  type: QuestionType;

  // ── Options (MCQ types) ──
  // Structured objects with text, correctness, and explanation.
  // For MCQ types, the correct answer is derived from options[].isCorrect.
  options?: QuestionOption[];

  // For FREE_RESPONSE / FILL_IN_BLANK types where there are no
  // structured options. For MCQ types, this is NOT used — correctness
  // lives in options[].isCorrect.
  correctAnswer?: string;

  // ── Rich Media ──
  // Single images field — AI figureUrls get mapped here during save.
  images?: string[];
  chainOfThought?: string[]; // Step-by-step reasoning (from NuminaMath)
  explanation?: string; // General explanation/solution text
  hint?: string; // AI-generated hint

  // ── Client-Side Figures ──
  // Replaces 'images' (server-side crops) with metadata for client-side rendering.
  figures?: {
    page: number;
    box: number[]; // [ymin, xmin, ymax, xmax]
    label?: string;
  }[];

  // ── Difficulty & Taxonomy ──
  difficulty: QuestionDifficulty;

  // Rich taxonomy from AI extraction (optional — manual questions
  // may not have this).
  taxonomy?: QuestionTaxonomy;

  // Flat taxonomy IDs for Firestore querying.
  // For AI-extracted questions, these are derived from taxonomy.domain/topic.
  domainId: string;
  topicId: string;
  subTopicId?: string;
  tags?: string[]; // Granular learning objectives

  // ── Multi-Curriculum Tagging ──
  // A question can belong to multiple curricula (e.g., Algebra 2 + IB Math SL).
  // The AI extraction sets taxonomy.curriculum as its best guess;
  // admins can tag additional curricula before publishing.
  curricula?: string[];

  // ── Attribution ──
  source: QuestionSource;

  createdAt: number;
  updatedAt: number;

  // ── Workflow ──
  status: "draft" | "pending" | "approved" | "rejected";
  verifiedBy?: string; // Admin user ID
  reviewNotes?: string;
}

// ─── Normalizer ─────────────────────────────────────────────────
// Handles backward-compatible reading of legacy Firestore documents
// that may have string[] options, old "MULTIPLE_CHOICE" type values,
// or other pre-unification shapes.

/** Map legacy type strings to canonical enum values */
const LEGACY_TYPE_MAP: Record<string, QuestionType> = {
  MULTIPLE_CHOICE: QuestionType.MCQ_SINGLE,
};

/**
 * Normalize a raw Firestore document into a well-typed Question.
 * Handles:
 * - string[] options → QuestionOption[] (using correctAnswer for inference)
 * - Legacy "MULTIPLE_CHOICE" → MCQ_SINGLE
 * - Missing fields → safe defaults
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeQuestion(data: Record<string, any>): Question {
  const rawType = data.type as string;
  const type = LEGACY_TYPE_MAP[rawType] || (rawType as QuestionType);

  // Normalize options
  let options: QuestionOption[] | undefined = undefined;
  let legacyNormalized = false;

  if (Array.isArray(data.options) && data.options.length > 0) {
    if (typeof data.options[0] === "string") {
      // Legacy string[] options — convert to QuestionOption[]
      legacyNormalized = true;
      const correctAnswer = data.correctAnswer as string | undefined;

      options = data.options.map((text: string) => ({
        text,
        // Infer correctness from the correctAnswer field if available.
        // Match by exact text or by option letter (A, B, C, D) / index.
        isCorrect: correctAnswer
          ? text === correctAnswer ||
            text.startsWith(`${correctAnswer}.`) ||
            text.startsWith(`${correctAnswer})`)
          : false,
      }));
    } else {
      // Already in QuestionOption format
      options = data.options;
    }
  }

  // If legacy normalized and we couldn't infer any correct option,
  // flag for review
  const needsReview =
    legacyNormalized &&
    options &&
    !options.some((o) => o.isCorrect) &&
    !data.correctAnswer;

  return {
    id: data.id || "",
    title: data.title,
    content: data.content || data.stemMarkdown || "",
    type,
    options,
    // Keep correctAnswer for free-response/fill-in types
    correctAnswer:
      type === QuestionType.FREE_RESPONSE || type === QuestionType.FILL_IN_BLANK
        ? data.correctAnswer
        : undefined,
    images: data.images || data.figureUrls || [],
    figures: data.figures,
    chainOfThought: data.chainOfThought,
    explanation: data.explanation,
    hint: data.hint,
    difficulty: data.difficulty || QuestionDifficulty.BEGINNER,
    taxonomy: data.taxonomy,
    domainId: data.domainId || data.taxonomy?.domain || "",
    topicId: data.topicId || data.taxonomy?.topic || "",
    subTopicId: data.subTopicId || data.taxonomy?.subTopic,
    tags: data.tags,
    // Multi-curriculum: migrate legacy single curriculum to array
    curricula: data.curricula
      ? data.curricula
      : data.taxonomy?.curriculum
        ? [data.taxonomy.curriculum]
        : [],
    source: data.source || { dataset: "Manual" },
    createdAt: data.createdAt || Date.now(),
    updatedAt: data.updatedAt || Date.now(),
    status: needsReview ? "pending" : data.status || "draft",
    verifiedBy: data.verifiedBy,
    reviewNotes: needsReview
      ? "Auto-flagged: legacy question normalized, correct answer unverified"
      : data.reviewNotes,
  };
}
