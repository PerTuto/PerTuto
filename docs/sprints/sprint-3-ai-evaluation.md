# Sprint 3 — AI Evaluation + HITL + Test Lifecycle

> **Duration:** Week 5–6 (~10 working days)
> **Goal:** Build AI answer sheet evaluation with human-in-the-loop review, test lifecycle, and grade challenges.
> **Depends on:** Sprint 1 (quizzes), Sprint 2 (question papers, batches)
> **This is the biggest competitive differentiator vs Acadine.**

---

## 3.1 Data Model Extension

### New Types in `src/lib/types.ts`

```ts
// --- Test ---
interface Test {
  id: string;
  title: string;
  questionPaperId: string;
  batchIds: string[];
  scheduledDate: Timestamp;
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
  createdAt: Timestamp;
}

// --- Evaluation ---
interface Evaluation {
  id: string;
  testId: string;
  studentId: string;
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
  evaluatedAt?: Timestamp;
  reviewedBy?: string;
  reviewNotes?: string;
  createdAt: Timestamp;
}

// --- Grade Challenge ---
interface GradeChallenge {
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
  createdAt: Timestamp;
  resolvedAt?: Timestamp;
}
```

### Firestore Collections

All under `tenants/{tenantId}/`:

- `tests/{testId}`
- `evaluations/{evalId}`
- `gradeChallenges/{challengeId}`

### New Service Files

- `src/lib/firebase/services/tests.ts`
- `src/lib/firebase/services/evaluations.ts`
- `src/lib/firebase/services/grade-challenges.ts`

---

## 3.2 AI Evaluation Engine

### New Cloud Function: `evaluator.ts`

```ts
// functions/src/flows/evaluator.ts
const answerSheetEvaluatorFlow = ai.defineFlow({
  name: "answerSheetEvaluator",
  inputSchema: z.object({
    tenantId: z.string(),
    testId: z.string(),
    studentId: z.string(),
    answerSheetUrl: z.string(), // Firebase Storage URL
    questionPaper: QuestionPaperSchema, // Full paper with rubric
  }),
  outputSchema: EvaluationOutputSchema,
});

// Pipeline:
// 1. Download scanned PDF from Storage
// 2. Gemini Vision: extract handwritten answers per question
// 3. Match extracted answers to question paper questions
// 4. Rubric-based evaluation (marks, partial credit logic)
// 5. Generate per-question feedback
// 6. Compute per-question and overall confidence score
// 7. Flag: requiresReview = (confidenceScore < 85)
// 8. Save Evaluation to Firestore
```

### Resources

- Memory: `1GiB` (Vision AI + PDF processing)
- Timeout: `540s` (9 minutes — large answer sheets take time)
- Model: `gemini-2.0-flash` (Vision capable)

### Confidence Scoring Logic

- Handwritten legibility score (how confident is OCR)
- Answer completeness score (did AI find an answer for each question)
- Rubric match score (how closely does the answer match expected rubric)
- **Overall = weighted average of the three**
- If overall < 85%: `requiresReview = true`

---

## 3.3 Test Lifecycle UI

### UI Pages

| Route                               | Purpose                            | Access         |
| ----------------------------------- | ---------------------------------- | -------------- |
| `/dashboard/tests`                  | Test list + schedule               | Admin, Teacher |
| `/dashboard/tests/[id]`             | Test detail + upload answer sheets | Admin, Teacher |
| `/dashboard/tests/[id]/results`     | Class-wide results                 | Admin, Teacher |
| Student: `/dashboard/my-tests/[id]` | Student's evaluated paper          | Student        |

### Test Management Flow

1. **Create Test:** Select question paper → assign batches → set date/time/duration → save as draft
2. **Schedule:** Move to `scheduled` status → auto-notification to batches
3. **During Test:** Status = `in-progress` (for online quizzes, uses quiz player from Sprint 1)
4. **After Test:**
   - **Student upload:** Students upload scanned answer sheets via Storage
   - **Admin bulk upload:** Admin uploads all answer sheets at once
   - Each upload triggers `answerSheetEvaluator` Cloud Function
5. **Results:** Review → publish → students see scores

### Answer Sheet Upload

- Drag-drop zone accepting PDF/images
- Upload to `tenants/{tenantId}/tests/{testId}/answers/{studentId}.pdf`
- Progress bar per upload
- Batch upload: admin uploads multiple files, system matches by filename → student

---

## 3.4 HITL Review Queue

### UI: `/dashboard/review-evaluations`

- Table of evaluations where `requiresReview === true`
- Columns: Student, Test, AI Score, Confidence, Status, Actions
- Sort by: lowest confidence first
- Quick-review UI:
  - Left panel: scanned answer sheet (PDF viewer)
  - Right panel: AI evaluation per question (marks, feedback)
  - For each question: Accept / Override (adjust marks + add note)
  - "Approve All" button for high-confidence evaluations
  - Status transitions: `evaluated` → `reviewed` → `published`

---

## 3.5 Grade Challenge System

### Student View

- On evaluated paper, each question has a "Report AI Error" button
- Opens modal: select reason (mark too low, wrong rubric, legibility issue, other) + free text
- Creates `GradeChallenge` doc with `status: 'open'`

### Teacher/Admin View: `/dashboard/grade-challenges`

- Table: Student, Test, Question, Reason, Status, Actions
- Resolution flow: Review → adjust marks (if warranted) → add resolution note → set `status: 'resolved'`
- Marks change automatically updates the `Evaluation` doc

---

## 3.6 Exam Day Scaling

### Problem

500 students in a batch open the quiz player at 9:00 AM → spike of concurrent Firestore writes.

### Solution

- **Client-side caching:** Quiz payload downloaded fully at start → no mid-quiz reads
- **IndexedDB first:** All responses saved to IndexedDB immediately
- **Debounced Firestore writes:** Sync every 30 seconds (not per-question)
- **Optimistic UI:** Student sees instant feedback, sync happens in background
- **Final submit:** One bulk write at end

### apphosting.yaml Consideration

AI evaluation runs as Cloud Functions (separate from App Hosting), so the `memoryMiB: 512` limit doesn't apply to evaluation workloads.

---

## 3.7 Verification Checklist

- [ ] Schedule test with question paper + assign batches
- [ ] Upload student answer sheet → AI evaluates → see per-question scores + feedback
- [ ] Low-confidence evaluation → appears in HITL review queue
- [ ] Teacher reviews → overrides marks → publishes
- [ ] Student sees evaluated paper → reports error → teacher resolves
- [ ] Online quiz: 10+ concurrent students (emulator load test)
- [ ] Offline: student completes quiz offline → reconnects → syncs correctly
- [ ] `npm run build` — zero errors

### Estimated Effort: ~50–70 hours | Risk: 🔴 High (Vision AI accuracy, concurrency)
