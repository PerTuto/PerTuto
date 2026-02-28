# Sprint 1 — Question Bank + AI Flows + Quiz System + PWA

> **Duration:** Week 1–2 (~10 working days)
> **Goal:** Port TutorOS AI capabilities, build question bank, quiz system, and PWA foundation.
> **Depends on:** Pre-Sprint 0 (Genkit upgrade, services split, KaTeX, storage rules)
> **Critical path for:** Sprint 2 (question papers need question bank), Sprint 3 (evaluation needs quizzes)

---

## 1.1 Data Model Extension

### New Types in `src/lib/types.ts`

```ts
// --- Question Bank Types ---
type QuestionType =
  | "MCQ_SINGLE"
  | "MCQ_MULTI"
  | "TRUE_FALSE"
  | "FILL_IN_BLANK"
  | "FREE_RESPONSE"
  | "PASSAGE_BASED";
type QuestionDifficulty = "EASY" | "MEDIUM" | "HARD" | "OLYMPIAD";
type QuestionStatus = "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";
type CognitiveDepth = "FLUENCY" | "CONCEPTUAL" | "APPLICATION" | "SYNTHESIS";

interface Question {
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
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// --- Quiz Types ---
interface Quiz {
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
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface QuizQuestionConfig {
  questionId: string;
  points: number;
  order: number;
}

interface QuizAttempt {
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
  startedAt: Timestamp;
  completedAt?: Timestamp;
  synced: boolean; // IndexedDB → Firestore sync status
}

// --- Taxonomy Types ---
interface TaxonomyNode {
  id: string;
  parentId: string | null;
  name: string;
  type: "domain" | "topic" | "subtopic" | "microskill";
  order: number;
  description?: string;
}
```

### Firestore Collections

All under `tenants/{tenantId}/`:

- `questions/{questionId}` — Question bank
- `quizzes/{quizId}` — Quiz configurations
- `quizAttempts/{attemptId}` — Student submissions
- `taxonomy/{nodeId}` — Hierarchical taxonomy tree

### New Service Files

- `src/lib/firebase/services/questions.ts` — Port from TutorOS, adapt to `tenants/${tenantId}/questions`
- `src/lib/firebase/services/quizzes.ts` — Port from TutorOS, adapt paths
- `src/lib/firebase/services/taxonomy.ts` — Port from TutorOS, adapt paths

---

## 1.2 Port AI Flows (4 flows from TutorOS)

### Source → Target Mapping

| TutorOS Source                                    | PerTuto Target                              | Changes Needed                                                              |
| ------------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------- |
| `TutorOS-backup/functions/src/flows/extractor.ts` | `functions/src/flows/extractor.ts`          | Replace model to stable `gemini-2.0-flash`, add `tenantId` to storage paths |
| `TutorOS-backup/functions/src/flows/curator.ts`   | `functions/src/flows/curator.ts`            | Adapt query paths to `tenants/{tenantId}/questions`                         |
| `TutorOS-backup/functions/src/flows/validator.ts` | `functions/src/flows/validator.ts`          | Add `confidenceScore` output field                                          |
| `TutorOS-backup/functions/src/flows/enhancer.ts`  | `functions/src/flows/enhancer.ts`           | Minimal changes                                                             |
| `TutorOS-backup/functions/src/types.ts`           | `functions/src/schemas/question-schemas.ts` | Rename, keep Zod schemas                                                    |

### Register in `functions/src/index.ts`

```ts
import { worksheetExtractorFlow } from "./flows/extractor";
import { quizCuratorFlow } from "./flows/curator";
import { questionValidatorFlow } from "./flows/validator";
import { questionEnhancerFlow } from "./flows/enhancer";

export const worksheetExtractor = onCallGenkit(
  { secrets: [apiKey], invoker: "public", cors: true },
  worksheetExtractorFlow,
);
// ... same pattern for curator, validator, enhancer
```

### Verification

```bash
cd functions && npm run build  # All 8+ functions compile
```

---

## 1.3 Question Bank UI

### New Dashboard Pages

| Route                       | Purpose                             | Access         |
| --------------------------- | ----------------------------------- | -------------- |
| `/dashboard/questions`      | Question bank table with filters    | Admin, Teacher |
| `/dashboard/questions/[id]` | Question detail/edit form           | Admin, Teacher |
| `/dashboard/extractor`      | AI Worksheet Extractor (upload PDF) | Admin, Teacher |
| `/dashboard/review`         | Review queue (pending questions)    | Admin, Teacher |

### Question Bank Table (`/dashboard/questions`)

- Columns: Stem (truncated), Type, Difficulty, Status, Domain, Actions
- Filters: domainId, topicId, difficulty, status, source.origin
- Bulk actions: Approve, Reject, Delete
- Search: Full-text search on stem

### Extractor Page (`/dashboard/extractor`)

1. PDF upload zone (drag-drop + file picker)
2. Upload → calls `worksheetExtractor` Cloud Function
3. Shows extracted questions in editable cards
4. Each card: stem, options, taxonomy, confidence score
5. Bulk "Save to Bank" → writes to Firestore
6. Port `FigureRenderer` component from TutorOS

### Components to Port from TutorOS

- `QuestionForm.tsx` → `src/components/questions/question-form.tsx`
- `FigureRenderer.tsx` → `src/components/questions/figure-renderer.tsx`
- `TaxonomyPicker.tsx` → `src/components/taxonomy/taxonomy-picker.tsx`
- `MathText.tsx` → `src/components/ui/math-text.tsx` (already in PREREQ-7)

### Sidebar Navigation Updates

Add under "Teaching" section:

- 📚 Questions (admin + teacher)
- 🔍 Extractor (admin + teacher)
- ✅ Review Queue (admin + teacher)

---

## 1.4 Quiz System

### New Dashboard Pages

| Route                             | Purpose                     | Access         |
| --------------------------------- | --------------------------- | -------------- |
| `/dashboard/quizzes`              | Quiz list (CRUD)            | Admin, Teacher |
| `/dashboard/quizzes/[id]`         | Quiz builder                | Admin, Teacher |
| `/dashboard/curator`              | AI Quiz Curator (NL wizard) | Admin, Teacher |
| `/dashboard/quiz-player/[quizId]` | Student quiz player         | Student        |

### Quiz Builder (`/dashboard/quizzes/[id]`)

- Add questions from bank (search + filter)
- Drag-and-drop reorder
- Set points per question
- Configure settings (timer, shuffle, show results)
- Preview mode

### Quiz Player (`/dashboard/quiz-player/[quizId]`)

- Timer display (if configured)
- Progress bar (question N of M)
- All 6 question types rendered with LaTeX (KaTeX)
- MCQ: radio/checkbox selection
- Fill-in-blank: text input
- Free response: textarea
- Navigation: prev/next + question grid
- **IndexedDB offline sync:** Save `QuizAttempt` locally, debounce writes to Firestore every 30s
- Auto-submit on timer expiry

### Curator Page (`/dashboard/curator`)

- Natural language input: "Create a quiz on IB Math derivatives, 10 questions, medium difficulty"
- Calls `quizCurator` Cloud Function
- Returns filtered question set → user reviews and adjusts → save as quiz

### Sidebar Navigation Updates

Add under "Assessment" section:

- 📝 Quizzes (admin + teacher)
- 🧠 AI Curator (admin + teacher)
- 🎮 My Quizzes (student view)

---

## 1.5 PWA Setup

### Install

```bash
npm install next-pwa
```

### Configuration

1. Create `public/manifest.json` with PerTuto branding (name, icons, theme color)
2. Update `next.config.ts` with PWA plugin
3. Create `public/sw.js` custom service worker for offline quiz caching
4. Add "Offline Ready" badge to dashboard header

### Offline Strategy

- Cache quiz payloads in IndexedDB on quiz start
- Student can complete quiz offline
- Responses sync to Firestore when connection restores
- Visual indicator: 🟢 Online / 🟡 Offline (syncing...)

---

## 1.6 Verification Checklist

- [ ] `npm run build` — zero TypeScript errors
- [ ] `cd functions && npm run build` — all flows compile
- [ ] Upload math PDF → extractor parses questions → review → save to bank
- [ ] Create quiz from question bank → share with student → student takes quiz
- [ ] AI Curator: NL input → filtered questions → save as quiz
- [ ] Offline quiz: disconnect wifi mid-quiz → verify IndexedDB saves → reconnect → verify sync
- [ ] LaTeX renders correctly in question forms, quiz player, and review queue
- [ ] Taxonomy picker works (domain → topic → subtopic → microskill)

### Estimated Effort: ~40–60 hours | Risk: 🟡 Medium
