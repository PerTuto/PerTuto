# PerTuto — Sprint Tracker

> **Total Timeline:** 12 weeks (+ Pre-Sprint foundation)
> **Estimated Total Effort:** 230–315 hours
> **Last Updated:** 2026-02-28

---

## Overview

| Sprint                  | Focus                          | Est. Hours | Status         | Started    | Completed  |
| ----------------------- | ------------------------------ | ---------- | -------------- | ---------- | ---------- |
| **Pre-Sprint 0**        | Foundation Fixes               | 7–10       | 🟡 In Progress | 2026-02-28 | —          |
| **Sprint 1** (Wk 1-2)   | Question Bank + AI Flows + PWA | 40–60      | ✅ Complete    | 2026-02-28 | 2026-02-28 |
| **Sprint 2** (Wk 3-4)   | Institute Management + Papers  | 35–50      | ✅ Complete    | 2026-02-28 | 2026-02-28 |
| **Sprint 3** (Wk 5-6)   | AI Evaluation + HITL           | 50–70      | 🟡 In Progress | 2026-02-28 | —          |
| **Sprint 4** (Wk 7-8)   | Communication + RTL + Export   | 30–40      | ✅ Complete    | 2026-02-28 | 2026-02-28 |
| **Sprint 5** (Wk 9-10)  | Analytics Engine               | 30–40      | ✅ Complete    | 2026-02-28 | 2026-02-28 |
| **Sprint 6** (Wk 11-12) | Gamification + Practice        | 35–45      | 🟡 In Progress | 2026-02-28 | —          |

**Legend:** ⬜ Not Started · 🟡 In Progress · ✅ Complete · 🔴 Blocked

---

## Pre-Sprint 0: Foundation Fixes

| #   | Task                             | Status | Notes |
| --- | -------------------------------- | ------ | ----- |
| —   | Full build + deploy + smoke test | ⬜     |       |

---

### Sprint 1: Question Bank & AI Flows [🟡]

- Quiz + PWA

| #    | Task                                             | Status | Notes                         |
| ---- | ------------------------------------------------ | ------ | ----------------------------- |
| 1.1  | Add Question/Quiz/Taxonomy types to `types.ts`   | ⬜     | 6 question types, 4D taxonomy |
| 1.2a | Port `extractor.ts` (AI PDF → Questions)         | ⬜     | From TutorOS backup           |
| 1.2b | Port `curator.ts` (NL → Quiz Filters)            | ⬜     |                               |
| 1.2c | Port `validator.ts` (AI Quality Check)           | ⬜     | Add confidenceScore           |
| 1.2d | Port `enhancer.ts` (AI Improve/Rephrase)         | ⬜     |                               |
| 1.3a | Question bank page (`/dashboard/questions`)      | ⬜     |                               |
| 1.3b | Question edit page (`/dashboard/questions/[id]`) | ⬜     |                               |
| 1.3c | AI Extractor page (`/dashboard/extractor`)       | ⬜     |                               |
| 1.1  | Add Question/Quiz/Taxonomy types to `types.ts`   | ✅     | 6 question types, 4D taxonomy |
| 1.2a | Port `extractor.ts` (AI PDF → Questions)         | ✅     | From TutorOS backup           |
| 1.2b | Port `curator.ts` (NL → Quiz Filters)            | ✅     |                               |
| 1.2c | Port `validator.ts` (AI Quality Check)           | ✅     | Add confidenceScore           |
| 1.2d | Port `enhancer.ts` (AI Improve/Rephrase)         | ✅     |                               |
| 1.3a | Question bank page (`/dashboard/questions`)      | ✅     |                               |
| 1.3b | Question edit page (`/dashboard/questions/[id]`) | ✅     |                               |
| 1.3c | AI Extractor page (`/dashboard/extractor`)       | ✅     |                               |
| 1.3d | Review queue (`/dashboard/review`)               | ✅     |                               |
| 1.4a | Quiz list + builder (`/dashboard/quizzes`)       | ✅     |                               |
| 1.4b | AI Curator page (`/dashboard/curator`)           | ✅     |                               |
| 1.4c | Quiz player (`/dashboard/quiz-player/[id]`)      | ✅     | All 6 types + LaTeX           |
| 1.4d | IndexedDB offline sync for quiz player           | ✅     |                               |
| 1.5  | PWA setup (manifest, service worker)             | ✅     |                               |
| —    | Sprint 1 verification                            | ✅     |                               |

---

## Sprint 2: Institute Management + AI Papers

| #    | Task                                             | Status | Notes                                              |
| ---- | ------------------------------------------------ | ------ | -------------------------------------------------- |
| 2.1  | Add Center/Batch/QuestionPaper types             | ✅     |                                                    |
| 2.2  | Centers CRUD (`/dashboard/organization/centers`) | ✅     |                                                    |
| 2.3a | Batches CRUD (`/dashboard/batches`)              | ✅     |                                                    |
| 2.3b | Batch detail page                                | ✅     | Students, teachers, schedule                       |
| 2.4a | `paper-generator.ts` Cloud Function              | ✅     | Auto + AI-assisted modes                           |
| 2.4b | Paper list page (`/dashboard/question-papers`)   | ✅     |                                                    |
| 2.4c | Paper generation wizard                          | ✅     | Multi-step: course → weightage → config → generate |
| 2.4d | Paper editor + preview                           | ✅     | Drag-drop, replace questions                       |
| 2.4e | PDF export Cloud Function (Puppeteer)            | ✅     |                                                    |
| 2.5  | Syllabus weightage configuration                 | ✅     |                                                    |
| 2.6  | Firestore composite indexes                      | ✅     |                                                    |
| —    | Sprint 2 verification                            | ✅     |                                                    |

---

## Sprint 3: AI Evaluation + HITL

| #    | Task                                           | Status | Notes                         |
| ---- | ---------------------------------------------- | ------ | ----------------------------- |
| 3.1  | Add Test/Evaluation/GradeChallenge types       | ✅     |                               |
| 3.2  | `evaluator.ts` Cloud Function (Gemini Vision)  | ✅     | 1GiB, 540s timeout            |
| 3.3a | Test management (`/dashboard/tests`)           | ✅     | Create, schedule, manage      |
| 3.3b | Answer sheet upload (student + admin bulk)     | 🟡     | Needs matching logic (mocked) |
| 3.4a | Results page (`/dashboard/tests/[id]/results`) | ✅     |                               |
| 3.4b | HITL review queue                              | ✅     | Low-confidence evaluations    |
| 3.5a | Grade challenge (student "Report Error")       | ✅     |                               |
| 3.5b | Challenge resolution UI (teacher)              | ✅     |                               |
| 3.6  | Exam-day offline sync hardening                | ⬜     | IndexedDB + debounced writes  |
| —    | Sprint 3 verification                          | ⬜     |                               |

---

## Sprint 4: Communication + RTL + Export

| #   | Task                                            | Status | Notes |
| --- | ----------------------------------------------- | ------ | ----- |
| 4.7 | Enhanced lecture scheduling (batch + meet link) | ✅     |       |
| —   | Sprint 4 verification                           | ✅     |       |

---

## Sprint 5: Analytics Engine

| #    | Task                                                  | Status | Notes               |
| ---- | ----------------------------------------------------- | ------ | ------------------- |
| 5.1  | Analytics service layer (aggregation queries)         | ✅     |                     |
| 5.2  | `predictive-performance.ts` Cloud Function            | ✅     | AI score prediction |
| 5.3a | Overview tab (key metric cards)                       | ✅     |                     |
| 5.3b | Student tab (scores, radar, heatmap, prediction)      | ✅     |                     |
| 5.3c | Batch tab (comparisons, retention)                    | ✅     |                     |
| 5.3d | Center tab (multi-center comparison)                  | ✅     |                     |
| 5.3e | Subject tab (chapter mastery, question-type analysis) | ✅     |                     |
| 5.4  | Firestore indexes for analytics queries               | ✅     |                     |
| —    | Sprint 5 verification                                 | ✅     |                     |

---

## Sprint 6: Gamification + Practice

| #    | Task                                             | Status | Notes                      |
| ---- | ------------------------------------------------ | ------ | -------------------------- |
| 6.1  | Add Gamification/Badge/Leaderboard types         | ✅     |                            |
| 6.2a | XP system (award logic per action)               | ✅     |                            |
| 6.2b | Streak logic (daily activity tracking)           | ✅     |                            |
| 6.3  | Badge system (8 badges + trigger logic)          | ✅     |                            |
| 6.4a | XP/level bar in student dashboard                | ✅     |                            |
| 6.4b | Leaderboard page/widget                          | ✅     | Batch / tenant-wide toggle |
| 6.4c | Badge showcase                                   | ✅     |                            |
| 6.4d | Celebration animations (confetti, flames)        | ⬜     |                            |
| 6.5  | Self-serve practice mode (`/dashboard/practice`) | 🟡     | Needs final assembly       |
| 6.6  | `assignment-feedback.ts` Cloud Function          | ✅     | AI per-criterion feedback  |
| —    | Sprint 6 verification                            | ⬜     |                            |

---

## Post-Sprint Checklist

| #        | Task                                             | Status | Notes                  |
| -------- | ------------------------------------------------ | ------ | ---------------------- |
| PREREQ-1 | Upgrade Genkit → 1.28+ (functions + frontend)    | ✅     |                        |
| PREREQ-2 | Upgrade firebase-functions → v7                  | ✅     |                        |
| PREREQ-3 | Refactor existing functions to `onCallGenkit()`  | ✅     | 4 functions to migrate |
| PREREQ-4 | Create `storage.rules`                           | ✅     |                        |
| PREREQ-5 | Add Storage config to `firebase.json`            | ✅     |                        |
| PREREQ-6 | Split `services.ts` monolith                     | ✅     |                        |
| PREREQ-7 | Fix Firestore rules catch-all                    | ✅     |                        |
| PREREQ-8 | Install KaTeX                                    | ✅     |                        |
| POST-1   | Full regression test (all existing features)     | ⬜     |                        |
| POST-2   | Deploy all Cloud Functions                       | ⬜     |                        |
| POST-3   | Deploy Firestore rules + indexes + Storage rules | ⬜     |                        |
| POST-4   | Push to master (auto-deploy via App Hosting)     | ⬜     |                        |
| POST-5   | Update `AGENTS.md` with new phases               | ✅     |                        |
| POST-6   | Bundle size audit (< 500KB first-load JS)        | ⬜     |                        |
