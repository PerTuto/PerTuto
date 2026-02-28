# PerTuto Ultimate — Execution Blueprint

> Every line is a concrete, no-thinking-required action. File paths are absolute. Type shapes are spelled out. Commands are copy-pasteable.

---

## 🚦 Pre-Sprint 0: Foundation Fixes

### PREREQ-1: Upgrade Cloud Functions Dependencies

- [ ] In `functions/package.json`, bump:
  - `"genkit"` → `"^1.28.0"`
  - `"@genkit-ai/google-genai"` → `"^1.28.0"`
  - `"firebase-functions"` → `"^7.0.0"`
- [ ] Run `cd functions && rm -rf node_modules && npm install`
- [ ] Verify build: `cd functions && npm run build`

### PREREQ-2: Refactor Existing Functions to v7 API

- [ ] **File:** `functions/src/index.ts`
  - Replace `import { onCall } from "firebase-functions/v2/https"` → `import { onCallGenkit } from "firebase-functions/https"`
  - Refactor `generateQuestions`, `generateNotes`, `generateQuestionsFromPdf` to use `onCallGenkit(ai, ...)` pattern
  - Keep `onLeadCreated` (v1 Firestore trigger) — verify it still compiles under v7
  - Keep `sendLeadEmail` (v1 https callable) — verify compatibility
- [ ] **File:** `functions/src/config/genkit.ts` — update `ai` init to match TutorOS pattern (see `TutorOS-backup-2026-02-15/functions/src/genkit.ts`)
- [ ] **Verify:** `cd functions && npm run build && npm run serve` — all 4 existing functions still callable

### PREREQ-3: Firebase Storage Rules

- [ ] **Create new file:** `storage.rules`
  ```
  rules_version = '2';
  service firebase.storage {
    match /b/{bucket}/o {
      match /tenants/{tenantId}/{allPaths=**} {
        allow read: if request.auth != null;
        allow write: if request.auth != null
          && request.resource.size < 25 * 1024 * 1024; // 25MB limit
      }
    }
  }
  ```
- [ ] Copy `uploadToStorage` utility from `TutorOS-backup-2026-02-15/functions/src/utils/image.ts` → `functions/src/utils/storage.ts`, add `tenantId` path prefix

### PREREQ-4: Add Storage to `firebase.json`

- [ ] **File:** `firebase.json` — add `"storage": { "rules": "storage.rules" }` at root level
- [ ] Deploy: `npx firebase deploy --only storage --project pertutoclasses`

### PREREQ-5: Split `services.ts` Monolith

- [ ] **Source:** `src/lib/firebase/services.ts` (923 lines)
- [ ] Create `src/lib/firebase/services/` directory
- [ ] Extract into domain files, re-export from `services.ts`:
  - `services/students.ts` — `getStudents`, `getStudentById`, `createStudent`, `updateStudent`, `deleteStudent`, `getStudentByUserId`, `getStudentsForParent`
  - `services/courses.ts` — `getCourses`, `getCourseById`, `createCourse`, `updateCourse`, `deleteCourse`, `getCoursesForTeacher`
  - `services/leads.ts` — `getLeads`, `createLead`, `updateLead`, `deleteLead`
  - `services/classes.ts` — `getClasses`, `createClass`, `updateClass`, `deleteClass`, `getClassesForStudent`, `getUpcomingClassesForTeacher`
  - `services/assignments.ts` — `getAssignments`, `createAssignment`, `updateAssignment`, `getAssignmentsForStudent`
  - `services/attendance.ts` — `getAttendanceRecords`, `saveAttendanceRecord`
  - `services/dashboard.ts` — `getDashboardStats`
- [ ] Update all imports across the codebase (grep for `from '@/lib/firebase/services'`)
- [ ] **Verify:** `npm run build` — zero errors

### PREREQ-6: Fix Firestore Security Rules

- [ ] **File:** `firestore.rules`
  - **Remove** the catch-all wildcard block (lines 152-155)
  - **Add explicit rules** for each new collection inside `match /tenants/{tenantId}`:
    ```
    match /questions/{questionId} {
      allow read: if userBelongsToTenant(tenantId);
      allow write: if userBelongsToTenant(tenantId) && (isAdmin() || isTeacher());
    }
    match /quizzes/{quizId} {
      allow read: if userBelongsToTenant(tenantId);
      allow write: if userBelongsToTenant(tenantId) && (isAdmin() || isTeacher());
    }
    match /quizAttempts/{attemptId} {
      allow read: if userBelongsToTenant(tenantId) && (isAdmin() || isTeacher() || resource.data.studentId == request.auth.uid);
      allow create: if userBelongsToTenant(tenantId) && isStudent();
      allow update: if userBelongsToTenant(tenantId) && resource.data.studentId == request.auth.uid;
    }
    match /taxonomy/{nodeId} {
      allow read: if userBelongsToTenant(tenantId);
      allow write: if userBelongsToTenant(tenantId) && isAdmin();
    }
    match /evaluations/{evalId} {
      allow read: if userBelongsToTenant(tenantId) && (isAdmin() || isTeacher() || resource.data.studentId == request.auth.uid);
      allow write: if userBelongsToTenant(tenantId) && isAdmin();
    }
    match /tests/{testId} {
      allow read: if userBelongsToTenant(tenantId);
      allow write: if userBelongsToTenant(tenantId) && (isAdmin() || isTeacher());
    }
    match /batches/{batchId} {
      allow read: if userBelongsToTenant(tenantId);
      allow write: if userBelongsToTenant(tenantId) && isAdmin();
    }
    match /centers/{centerId} {
      allow read: if userBelongsToTenant(tenantId);
      allow write: if userBelongsToTenant(tenantId) && isAdmin();
    }
    match /announcements/{announcementId} {
      allow read: if userBelongsToTenant(tenantId);
      allow write: if userBelongsToTenant(tenantId) && isAdmin();
    }
    match /studyMaterials/{materialId} {
      allow read: if userBelongsToTenant(tenantId);
      allow write: if userBelongsToTenant(tenantId) && (isAdmin() || isTeacher());
    }
    match /questionPapers/{paperId} {
      allow read: if userBelongsToTenant(tenantId);
      allow write: if userBelongsToTenant(tenantId) && (isAdmin() || isTeacher());
    }
    match /gradeChallenges/{challengeId} {
      allow read: if userBelongsToTenant(tenantId) && (isAdmin() || isTeacher() || resource.data.studentId == request.auth.uid);
      allow create: if userBelongsToTenant(tenantId) && isStudent();
      allow update: if userBelongsToTenant(tenantId) && (isAdmin() || isTeacher());
    }
    match /notifications/{notifId} {
      allow read: if userBelongsToTenant(tenantId) && resource.data.userId == request.auth.uid;
      allow write: if userBelongsToTenant(tenantId) && (isAdmin() || isTeacher());
    }
    ```
  - **Keep** existing explicit rules for `leads`, `students`, `courses`, `classes`, `assignments`, `availability`, `invoices`, `payments`, `ledger`, `attendance`, `testimonials`, `resources`
- [ ] Deploy: `npx firebase deploy --only firestore:rules --project pertutoclasses`

### PREREQ-7: Install LaTeX Rendering

- [ ] `npm install katex react-katex`
- [ ] `npm install -D @types/katex`
- [ ] Create shared component `src/components/ui/math-text.tsx` (port from `TutorOS-backup-2026-02-15/src/components/ui/MathText.tsx`)

### PREREQ-8: Reconcile Overlapping AI Flows

- [ ] Grep codebase for any UI calling `generateQuestionsFromPdf` (the existing PerTuto PDF flow)
- [ ] If called: rename existing function to `legacyPdfExtraction`, keep deployed, add deprecation notice
- [ ] If not called from any UI: remove `flows/pdf-extraction.ts` entirely
- [ ] Decision: TutorOS `extractor.ts` becomes the canonical PDF extraction flow

---

## 🏗️ Sprint 1: Question Bank, AI Flows & PWA (Week 1-2)

### 1.1 Data Model Extension

- [ ] **File:** `src/lib/types.ts` — Add the following new types (source: TutorOS `src/types/`):
  - `QuestionType` enum: `MCQ_SINGLE | MCQ_MULTI | TRUE_FALSE | FILL_IN_BLANK | FREE_RESPONSE | PASSAGE_BASED`
  - `QuestionDifficulty` enum: `EASY | MEDIUM | HARD | OLYMPIAD`
  - `QuestionStatus` enum: `DRAFT | PENDING | APPROVED | REJECTED`
  - `CognitiveDepth` enum: `FLUENCY | CONCEPTUAL | APPLICATION | SYNTHESIS`
  - `Question` type: `{ id, stem, type, difficulty, status, options[], correctAnswer, explanation, figures[], taxonomy: { domainId, topicId, subTopicId, cognitiveDepth, scaffoldLevel, curriculum, standardMapping }, source: { origin, extractedFrom?, pageNumber? }, createdBy, createdAt, updatedAt, confidenceScore? }`
  - `Quiz` type: `{ id, title, description?, questions: QuizQuestionConfig[], totalPoints, status, settings: { timeLimit?, shuffleQuestions, showResults }, isPublic, publicSlug?, createdBy, createdAt, updatedAt }`
  - `QuizQuestionConfig`: `{ questionId, points, order }`
  - `QuizAttempt` type: `{ id, quizId, studentId, responses: { questionId, answer, isCorrect, pointsAwarded }[], totalScore, maxScore, startedAt, completedAt, synced }`
  - `TaxonomyNode` type: `{ id, parentId: null|string, name, type: 'domain'|'topic'|'subtopic'|'microskill', order, description? }`
- [ ] Firestore collections (all under `tenants/{tenantId}/`):
  - `questions/{questionId}`, `quizzes/{quizId}`, `quizAttempts/{attemptId}`, `taxonomy/{nodeId}`
- [ ] Create new service files:
  - `src/lib/firebase/services/questions.ts` — port from `TutorOS-backup-2026-02-15/src/lib/firebase/questions.ts`, adapt all paths to `tenants/${tenantId}/questions`
  - `src/lib/firebase/services/quizzes.ts` — port from `TutorOS-backup-2026-02-15/src/lib/firebase/quizzes.ts`, adapt paths
  - `src/lib/firebase/services/taxonomy.ts` — port from `TutorOS-backup-2026-02-15/src/lib/firebase/taxonomy.ts`, adapt paths

### 1.2 Port AI Flows (5 flows)

- [ ] Copy `TutorOS-backup-2026-02-15/functions/src/flows/extractor.ts` → `functions/src/flows/extractor.ts`
  - Replace `googleAI.model("gemini-3-flash-preview")` → configurable model env var or stable `"gemini-2.0-flash"`
  - Add `tenantId` parameter to storage upload paths
- [ ] Copy `TutorOS-backup-2026-02-15/functions/src/flows/curator.ts` → `functions/src/flows/curator.ts`
- [ ] Copy `TutorOS-backup-2026-02-15/functions/src/flows/validator.ts` → `functions/src/flows/validator.ts`
  - Add `confidenceScore` field to `ValidationResultSchema` output (derived from `complexityScore` + `isValid`)
- [ ] Copy `TutorOS-backup-2026-02-15/functions/src/flows/enhancer.ts` → `functions/src/flows/enhancer.ts`
- [ ] Copy `TutorOS-backup-2026-02-15/functions/src/types.ts` → `functions/src/schemas/question-schemas.ts`
- [ ] Register all new flows in `functions/src/index.ts`
- [ ] **Verify:** `cd functions && npm run build`

### 1.3 Question Bank UI

- [ ] Create `/dashboard/questions/page.tsx` — Question bank table with columns: Stem (truncated), Type, Difficulty, Status, Domain, Actions
  - Filters: domainId, topicId, difficulty, status
  - Bulk actions: Approve, Reject, Delete
- [ ] Create `/dashboard/questions/[id]/page.tsx` — Question detail/edit form
  - Port `QuestionForm` from `TutorOS-backup-2026-02-15/src/components/questions/QuestionForm.tsx`
  - Use `MathText` component for LaTeX preview (from PREREQ-7)
- [ ] Create `/dashboard/extractor/page.tsx` — AI Worksheet Extractor
  - PDF upload → call `worksheetExtractor` Cloud Function → show extracted questions for review → bulk-save to question bank
  - Port `FigureRenderer` from `TutorOS-backup-2026-02-15/src/components/questions/FigureRenderer.tsx`
- [ ] Create `/dashboard/review/page.tsx` — Review Queue (questions with `status: 'pending'`)
- [ ] Port `TaxonomyPicker` from `TutorOS-backup-2026-02-15/src/components/taxonomy/TaxonomyPicker.tsx` → `src/components/taxonomy/taxonomy-picker.tsx`
- [ ] Add sidebar nav items for Questions, Extractor, Review (teacher + admin roles)

### 1.4 Quiz System

- [ ] Create `/dashboard/quizzes/page.tsx` — Quiz list (CRUD)
- [ ] Create `/dashboard/quizzes/[id]/page.tsx` — Quiz builder (add/remove/reorder questions, set points)
- [ ] Create `/dashboard/curator/page.tsx` — AI Quiz Curator (NL input → structured filters → auto-select questions)
- [ ] Create `/dashboard/quiz-player/[quizId]/page.tsx` — Student-facing quiz player
  - Timer, progress bar, all 6 question types with LaTeX
  - IndexedDB offline sync (save `QuizAttempt` locally, debounce to Firestore every 30s)
- [ ] Add sidebar nav items for Quizzes, Curator (teacher + admin), Quiz Player (student)

### 1.5 PWA Setup

- [ ] Install `next-pwa`: `npm install next-pwa`
- [ ] Create `public/manifest.json` with PerTuto branding
- [ ] Update `next.config.ts` with PWA plugin config
- [ ] Create `public/sw.js` custom service worker for offline quiz caching
- [ ] Add "Offline Ready" badge to dashboard header

### 1.6 Sprint 1 Verification

- [ ] `npm run build` — zero TypeScript errors
- [ ] `cd functions && npm run build` — all flows compile
- [ ] Manual test: Upload a math PDF → extractor parses questions → save to bank → create quiz → play quiz as student
- [ ] Manual test: Offline quiz taking (disconnect wifi mid-quiz, verify IndexedDB saves, reconnect, verify Firestore sync)

---

## 🏗️ Sprint 2: Institute Management & AI Question Papers (Week 3-4)

### 2.1 Center & Batch Types

- [ ] **File:** `src/lib/types.ts` — Add:
  - `Center`: `{ id, name, address, city, contactEmail?, contactPhone?, status: 'active'|'inactive', createdAt }`
  - `Batch`: `{ id, name, courseId, centerId?, teacherIds: string[], studentIds: string[], status: 'active'|'archived', schedule?, createdAt }`
  - `QuestionPaper`: `{ id, title, courseId, subjectId, sections: PaperSection[], totalMarks, duration, status: 'draft'|'approved'|'archived', generationMode: 'auto'|'manual'|'ai-assisted', createdBy, createdAt }`
  - `PaperSection`: `{ title, questions: { questionId, marks }[], totalMarks }`

### 2.2 Centers UI

- [ ] Create `src/lib/firebase/services/centers.ts` — CRUD for `tenants/{tenantId}/centers`
- [ ] Create `/dashboard/organization/centers/page.tsx` — Center list + add/edit dialog

### 2.3 Batches UI

- [ ] Create `src/lib/firebase/services/batches.ts` — CRUD for `tenants/{tenantId}/batches`
- [ ] Create `/dashboard/batches/page.tsx` — Batch list + create dialog (pick course, center, assign students/teachers)
- [ ] Update student enrollment logic to support batch-based grouping

### 2.4 AI Question Paper Generation

- [ ] Create `functions/src/flows/paper-generator.ts` — Genkit flow
  - Input: `{ courseId, subjectId, chapters: { id, weightage% }[], questionTypes: { type, count, marksEach }[], difficulty, duration }`
  - Output: `{ sections: PaperSection[], totalMarks, metadata }`
- [ ] Create `src/lib/firebase/services/question-papers.ts`
- [ ] Create `/dashboard/question-papers/page.tsx` — List of papers
- [ ] Create `/dashboard/question-papers/generate/page.tsx` — Multi-step wizard (Course → Syllabus Weightage → Question Config → Review → Generate)
- [ ] Create `/dashboard/question-papers/[id]/page.tsx` — Paper editor (edit, replace questions, reorder, preview)
- [ ] Create PDF export Cloud Function using Puppeteer (already in devDeps)

### 2.5 Syllabus Weightage

- [ ] Enhance existing curriculum scaffolding pages to support per-chapter weightage sliders
- [ ] Store weightage config in `tenants/{tenantId}/syllabusConfig/{configId}`

### 2.6 Firestore Indexes

- [ ] **File:** `firestore.indexes.json` — Add composite indexes:
  - `questions`: `domainId` ASC + `difficulty` ASC + `status` ASC
  - `quizAttempts`: `studentId` ASC + `quizId` ASC
  - `batches`: `courseId` ASC + `status` ASC
- [ ] Deploy: `npx firebase deploy --only firestore:indexes --project pertutoclasses`

### 2.7 Sprint 2 Verification

- [ ] Create center → create batch → assign students → generate question paper → preview PDF
- [ ] `npm run build` — zero errors

---

## 🏗️ Sprint 3: AI Evaluation & Scale (Week 5-6)

### 3.1 AI Evaluation Engine

- [ ] **File:** `src/lib/types.ts` — Add:
  - `Test`: `{ id, title, questionPaperId, batchIds: string[], scheduledDate, duration, instructions?, status: 'draft'|'scheduled'|'in-progress'|'completed'|'results-published', createdBy, createdAt }`
  - `Evaluation`: `{ id, testId, studentId, questionScores: { questionId, marksAwarded, maxMarks, feedback }[], totalScore, maxScore, status: 'pending'|'evaluated'|'reviewed'|'published', confidenceScore, requiresReview, evaluatedAt, reviewedBy? }`
  - `GradeChallenge`: `{ id, evaluationId, testId, studentId, questionId, reason, status: 'open'|'reviewing'|'resolved', resolution?, resolvedBy?, createdAt, resolvedAt? }`
- [ ] Create `functions/src/flows/evaluator.ts` — Genkit flow
  - Input: scanned PDF (via Storage URL) + question paper data
  - Process: Gemini Vision OCR → answer matching → rubric scoring → feedback → confidence score
  - Output: `Evaluation` object
  - Memory: `1GiB`, timeout: `540s`
- [ ] Create `src/lib/firebase/services/tests.ts`, `services/evaluations.ts`, `services/grade-challenges.ts`

### 3.2 Test Lifecycle UI

- [ ] Create `/dashboard/tests/page.tsx` — Test list + schedule dialog
- [ ] Create `/dashboard/tests/[id]/page.tsx` — Test detail (linked paper, batches, upload answer sheets)
- [ ] Implement bulk answer sheet upload (admin) and student self-upload via Storage

### 3.3 Results & Grade Challenge UI

- [ ] Create `/dashboard/tests/[id]/results/page.tsx` — Class-wide results table + charts
- [ ] Create student view: evaluated answer sheet with per-question feedback
- [ ] Build Teacher HITL Review Queue: list evaluations where `requiresReview === true`, quick approve/override UI
- [ ] Build "Report AI Error" button on student evaluation view → creates `GradeChallenge` doc
- [ ] Build admin/teacher grade challenge resolution UI

### 3.4 Exam Day Offline Sync

- [ ] Enhance quiz player IndexedDB logic: download full quiz payload at start, debounce writes every 30s
- [ ] Test: 50+ concurrent quiz attempts (use Firestore emulator load test)

### 3.5 Sprint 3 Verification

- [ ] End-to-end: Schedule test → upload answer sheets → AI evaluates → teacher reviews low-confidence → publish results → student challenges → teacher resolves
- [ ] `npm run build` — zero errors

---

## 🏗️ Sprint 4: Communication, RTL & Data Portability (Week 7-8)

### 4.1 RTL & Localization

- [ ] Audit all Tailwind classes: replace directional (`pl-*`, `pr-*`, `ml-*`, `mr-*`, `left-*`, `right-*`) with logical (`ps-*`, `pe-*`, `ms-*`, `me-*`, `start-*`, `end-*`)
- [ ] Add `dir="auto"` support to root layout
- [ ] Test with `dir="rtl"` on dashboard

### 4.2 Announcements

- [ ] **File:** `src/lib/types.ts` — Add:
  - `Announcement`: `{ id, title, body, targetType: 'all'|'center'|'course'|'batch', targetIds: string[], priority: 'low'|'medium'|'high'|'urgent', createdBy, createdAt, expiresAt? }`
- [ ] Create `src/lib/firebase/services/announcements.ts`
- [ ] Create `/dashboard/announcements/page.tsx` — CRUD with audience picker
- [ ] Add announcement feed widget to student/parent/teacher dashboards

### 4.3 Study Materials

- [ ] **File:** `src/lib/types.ts` — Add:
  - `StudyMaterial`: `{ id, title, description?, subjectId, chapterId?, topicId?, fileUrl, fileType: 'pdf'|'video'|'presentation'|'link', uploadedBy, courseIds: string[], batchIds: string[], createdAt }`
- [ ] Create `src/lib/firebase/services/study-materials.ts`
- [ ] Create `/dashboard/study-materials/page.tsx` — Upload, organize by subject/chapter/topic
- [ ] Student view: browse + download (with offline PWA caching)

### 4.4 Enhanced Lectures

- [ ] Extend existing `Class` type with `batchId?` and `meetingLink?` fields
- [ ] Update schedule calendar to show batch-wide lectures
- [ ] Add auto-notifications via in-app notification system (Firestore `notifications` collection)

### 4.5 Notifications System (Foundation)

- [ ] **File:** `src/lib/types.ts` — Add:
  - `Notification`: `{ id, userId, title, body, type: 'announcement'|'test'|'grade'|'schedule', link?, read: boolean, createdAt }`
- [ ] Create `src/lib/firebase/services/notifications.ts`
- [ ] Build notification bell icon in dashboard header with unread count badge
- [ ] Build notification dropdown/popover

### 4.6 Data Portability

- [ ] Create "Export All Data" button in `/dashboard/organization/settings`
- [ ] Cloud Function: `tenantDataExporter` — streams all tenant Firestore data into a ZIP (JSON files per collection)
- [ ] Provide CSV option for `students`, `invoices`, `payments`

### 4.7 Sprint 4 Verification

- [ ] Create announcement targeting a batch → verify student sees it
- [ ] Upload study material → student downloads → verify offline access
- [ ] Export tenant data → verify completeness
- [ ] Toggle RTL → verify no layout breaking

---

## 🏗️ Sprint 5: Analytics Engine (Week 9-10)

### 5.1 Analytics Services

- [ ] Create `src/lib/firebase/services/analytics.ts` — aggregation queries
- [ ] Create `functions/src/flows/predictive-performance.ts` — AI flow: given student's historical test scores, attendance, and quiz performance → predict next exam score range

### 5.2 Analytics Dashboard

- [ ] Create `/dashboard/analytics/page.tsx` — Tabbed hub:
  - **Overview tab**: key metric cards (total students, avg score, test participation rate)
  - **Student tab**: select student → test scores over time (line chart), subject radar chart, weak topics heatmap, predicted exam performance
  - **Batch tab**: batch-vs-batch avg score bar charts, retention metrics
  - **Center tab**: center comparison (if multi-center)
  - **Subject tab**: chapter-level mastery tracking, question-type analysis
- [ ] Use `recharts` (already in dependencies) for all visualizations
- [ ] Dynamic imports for chart components (`next/dynamic`) to minimize bundle

### 5.3 Sprint 5 Verification

- [ ] Verify analytics populate correctly with test data
- [ ] `npm run build` — verify bundle size stays reasonable (< 500KB first-load JS for public pages)

---

## 🏗️ Sprint 6: Gamification & Engagement (Week 11-12)

### 6.1 Gamification Data Model

- [ ] **File:** `src/lib/types.ts` — Add:
  - `StudentGamification`: `{ id, studentId, xp, currentStreak, longestStreak, lastActiveDate, badges: Badge[], level }`
  - `Badge`: `{ id, name, description, icon, earnedAt }`
  - `LeaderboardEntry`: `{ studentId, studentName, xp, streak, rank }`
- [ ] Create `src/lib/firebase/services/gamification.ts`
- [ ] Firestore: `tenants/{tenantId}/gamification/{studentId}`

### 6.2 Gamification UI

- [ ] Add XP/streak display to student dashboard header
- [ ] Build leaderboard component (configurable per-batch or tenant-wide)
- [ ] Award XP on: quiz completion, assignment submission, login streak, perfect scores
- [ ] Badge triggers: "First Quiz", "7-Day Streak", "Question Bank Contributor", "100% Score"

### 6.3 Self-Serve Practice

- [ ] Create `/dashboard/practice/page.tsx` — Student picks subject/topic → AI generates practice quiz from question bank emphasizing weak topics
- [ ] Track practice quiz results separately for analytics

### 6.4 AI Assignment Feedback

- [ ] Create `functions/src/flows/assignment-feedback.ts` — Genkit flow
  - Input: student submission text/file + assignment rubric
  - Output: per-section feedback, overall grade suggestion, improvement tips
- [ ] Integrate into existing assignment grading UI

### 6.5 Sprint 6 Verification

- [ ] Complete student journey: practice quiz → earn XP → check leaderboard → view streak → earn badge
- [ ] AI assignment feedback: submit → get constructive feedback → teacher reviews
- [ ] Final full build: `npm run build` + `cd functions && npm run build`

---

## 🏁 Post-Sprint Checklist

- [ ] Full regression test of all 19 existing phases
- [ ] Deploy all functions: `cd functions && npm run deploy`
- [ ] Deploy Firestore rules + indexes
- [ ] Deploy Storage rules
- [ ] Push to `master` → Firebase App Hosting auto-deploys
- [ ] Update `AGENTS.md` with new phases 20-25
