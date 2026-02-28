# PerTuto Ultimate Platform — Implementation Plan

> **Goal:** Merge all existing PerTuto features + TutorOS AI features + every Acadine capability into one product that beats Acadine in every aspect.

---

## Current Inventory

### ✅ What PerTuto Already Has (Keep & Polish)

| Feature                                                            | Status | Source  |
| ------------------------------------------------------------------ | ------ | ------- |
| Public marketing site (SEO, blog, subjects)                        | Live   | PerTuto |
| Multi-tenant CRM (leads kanban, scoring)                           | Live   | PerTuto |
| Student management (profiles, enrollment)                          | Live   | PerTuto |
| Course management (CRUD, enrollment)                               | Live   | PerTuto |
| Schedule/Calendar (Apple-style, drag-drop, iCal import, recurring) | Live   | PerTuto |
| Assignments (create, submit, grade)                                | Live   | PerTuto |
| Attendance tracking (manual)                                       | Live   | PerTuto |
| Financials (invoices, payments, ledger)                            | Live   | PerTuto |
| 6-role RBAC (super, admin, executive, teacher, parent, student)    | Live   | PerTuto |
| Team invites (link + direct create)                                | Live   | PerTuto |
| Parent Family Portal (multi-child)                                 | Live   | PerTuto |
| Teacher/Student/Parent dashboards                                  | Live   | PerTuto |
| Availability grid                                                  | Live   | PerTuto |
| Organization/settings management                                   | Live   | PerTuto |
| AI schedule assistant + voice commands                             | Live   | PerTuto |
| AI lead scoring                                                    | Live   | PerTuto |
| Curriculum scaffolding (CBSE/ICSE)                                 | Live   | PerTuto |
| Testimonials management                                            | Live   | PerTuto |
| Resources (syllabus, past papers)                                  | Live   | PerTuto |
| Google Calendar integration                                        | Live   | PerTuto |

### 🔄 What TutorOS Has (Must Port)

| Feature                                                                                   | Status          | What Exists                    |
| ----------------------------------------------------------------------------------------- | --------------- | ------------------------------ |
| AI Worksheet Extractor (PDF → questions)                                                  | Built in backup | Genkit flow + UI page          |
| Quiz Curator (NL wizard)                                                                  | Built in backup | Genkit flow + UI page          |
| Question Validator (AI)                                                                   | Built in backup | Genkit flow                    |
| Question Enhancer (AI)                                                                    | Built in backup | Genkit flow                    |
| 4D Taxonomy System                                                                        | Built in backup | Types + tree component         |
| Question Bank (6 types, LaTeX, figures)                                                   | Built in backup | Full CRUD + review workflow    |
| Quiz management (CRUD, public sharing)                                                    | Built in backup | Full quiz builder              |
| Quiz Player (student-facing)                                                              | Built in backup | `/play` route                  |
| Question types: MCQ single/multi, fill-in-blank, free response, passage-based, true/false | Built in backup | Typed, normalized              |
| Multi-curriculum tagging                                                                  | Built in backup | Types + UI                     |
| Review/approval workflow                                                                  | Built in backup | Dashboard + status transitions |

### 🆕 What Acadine Has That We Don't (Must Build NEW)

| Feature                                                                                  | Acadine Status  | Our Priority                                                    |
| ---------------------------------------------------------------------------------------- | --------------- | --------------------------------------------------------------- |
| **Center/Branch Management** (multi-location institutes)                                 | Live            | HIGH — extends our multi-tenant model                           |
| **Batch System** (student groups per course + center)                                    | Live            | HIGH — groups > individual enrollment                           |
| **AI Question Paper Generation** (Auto Generate + Build with AI)                         | Live            | CRITICAL — our extractor extracts; we also need generation      |
| **Syllabus Weightage Configuration** (chapter/topic % control)                           | Live            | HIGH — pairs with question paper gen                            |
| **AI Answer Sheet Evaluation** (rubric-based, 24h)                                       | Coming Soon     | CRITICAL — biggest differentiator                               |
| **Grade Challenge System**                                                               | Coming Soon     | MEDIUM — student dispute flow                                   |
| **Notice Board** (targeted announcements)                                                | Coming Soon     | MEDIUM — we have nothing like this                              |
| **Study Material Management** (upload/delete/update, organized by subject→chapter→topic) | Coming Soon     | HIGH — structured content library                               |
| **Lecture Scheduling** (with auto-notifications + online links)                          | Partial overlap | MEDIUM — we have calendar but not batch-wide lecture scheduling |
| **Multi-Level Analytics** (student/batch/center/subject/topic drilldown)                 | Described       | HIGH — our analytics are basic                                  |
| **Mobile App Push Notifications**                                                        | Described       | MEDIUM — future phase                                           |
| **Predicted Exam Performance**                                                           | Described       | MEDIUM — AI model                                               |

---

## Proposed Sprint Plan

### 🏗️ Sprint 1: Foundation Merge & Offline Ready (Week 1-2)

**Goal:** Port TutorOS question bank + AI flows, and establish progressive Web App (PWA) architecture.

#### 1.1 Data Model Extension

- Add to types.ts:
  - `Question` type (from TutorOS `question.ts` — 6 question types, options, taxonomy, figures, LaTeX, source, review workflow)
  - `QuestionTaxonomy` type (domain → topic → subTopic → microSkill + cognitive depth)
  - `Quiz` type (question configs, points, time limits, public sharing)
  - `QuizAttempt` type (student responses, scores, timestamps)
  - `TaxonomyNode` type (for dynamic taxonomy tree)
- Add Firestore collections under `tenants/{tenantId}/`:
  - `questions/{questionId}`
  - `quizzes/{quizId}`
  - `quizAttempts/{attemptId}`
  - `taxonomy/{nodeId}`
- Update firestore.rules:
  - Questions: admin/teacher write, all tenant read
  - Quizzes: admin/teacher write, all tenant read
  - Quiz attempts: student create/read own, teacher/admin read all
  - Taxonomy: admin write, all read

#### 1.2 Port AI Flows from TutorOS Backup

- Copy and adapt from TutorOS flows:
  - `extractor.ts` → AI Worksheet Extractor (PDF upload → parsed questions with taxonomy)
  - `curator.ts` → Quiz Curator (natural language → smart question selection)
  - `validator.ts` → Question Validator (AI quality check, _outputs confidence score_)
  - `enhancer.ts` → Question Enhancer (AI improves question quality, adds hints/explanations)
- Register in PerTuto functions `index.ts`

#### 1.3 Port Question Bank UI

- New dashboard pages:
  - `/dashboard/questions` — Question bank table with taxonomy filters, search, bulk actions
  - `/dashboard/questions/[id]` — Question detail/edit with **Accessible MathML** preview
  - `/dashboard/extractor` — AI Worksheet Extractor
  - `/dashboard/review` — Review queue (pending questions for approval)

#### 1.4 Native Offline & PWA Setup

- Configure Next.js/Vite as a **Progressive Web App (PWA)** with a Service Worker.
- Enable offline caching for study materials and active quizzes.
- Add an `Offline Ready` UI badge.

---

### 🏗️ Sprint 2: Acadine Core — Batches, Centers & Question Paper Generation (Week 3-4)

**Goal:** Build the institute management layer + AI question paper generation.

#### 2.1 Center/Branch Management

- New types: `Center` (name, address, contactInfo, status)
- Firestore: `tenants/{tenantId}/centers/{centerId}`
- UI: `/dashboard/organization/centers` — Create/edit/delete centers
- Modify `Batch` and `Course` to link to centers

#### 2.2 Batch System

- New types: `Batch` (name, courseId, centerId, teacherIds[], studentIds[], status, schedule)
- Firestore: `tenants/{tenantId}/batches/{batchId}`
- UI: `/dashboard/batches` — Create batches, assign students/teachers, link to courses
- Batch-level operations

#### 2.3 AI Question Paper Generation

- New Genkit flow: `questionPaperGenerator`
  - **Input:** course/subject, syllabus selection with weightage %, question types, difficulty, duration
  - **Two modes:**
    - _Auto Generate:_ Complete balanced paper
    - _Build with AI:_ Step-by-step
  - **Output:** Ordered question paper with sections, marks, rubric
- New UI:
  - `/dashboard/question-papers` + `/dashboard/question-papers/generate`
  - Paper editor + Print-ready PDF view

#### 2.4 Syllabus Management

- Enhance existing CBSE/ICSE scaffolding to support granular weightage.

---

### 🏗️ Sprint 3: AI Evaluation, Results & Concurrency (Week 5-6)

**Goal:** Build AI answer sheet evaluation (with HITL) and scalable exam deployment.

#### 3.1 AI Answer Sheet Evaluation Engine & HITL

- New Genkit flow: `answerSheetEvaluator`
  - **Input:** scanned answer sheet images/PDF + question paper
  - **Process:**
    1. OCR/Vision AI to extract handwritten answers
    2. Match answers to questions
    3. Rubric-based evaluation
    4. Generate detailed per-question feedback
    5. **Compute AI Confidence Score.** Flag for review if < 85%.
  - **Output:** Evaluated sheet with marks, feedback, correct answers
- Firestore: `tenants/{tenantId}/evaluations/{evalId}`
- New types: `Evaluation` (..., `requiresReview: boolean`, `confidenceScore: number`)

#### 3.2 Test Lifecycle & "Exam Day" Scaling

- Extend scheduling to support formal "Tests":
  - `Test` type (questionPaperId, batchIds[], scheduledDate, duration, instructions, status)
  - `/dashboard/tests` — List + schedule tests
  - Student self-upload or admin bulk upload
- **Exam Day Concurrency Mitigation:**
  - Client-Side Quiz Caching: Download entire payload on start.
  - Optimistic Offline Writes: `QuizAttempt` state syncs to IndexedDB, debounced writes to Firestore to prevent crashes.

#### 3.3 Results, HITL Review Queue & Grade Challenge

- `/dashboard/tests/[id]/results`
- **Teacher Review Queue:** Dedicated UI to rapidly approve or correct low-confidence AI evaluations.
- **Grade Challenge / Report Error Flow:**
  - Student clicks "Report AI Error" → status = `challenged`
  - Teacher/admin manually overrides → `resolved`

---

### 🏗️ Sprint 4: Localization, Communication & Data Portability (Week 7-8)

**Goal:** Notice board, study materials, RTL compliance, and preventing vendor lock-in.

#### 4.1 Middle East Localization (RTL & Compliance)

- Audit all Tailwind classes for logical properties (`start-*`, `end-*`, `ps-*`, `pe-*`).
- Ensure Firebase Firestore region accepts UAE data residency requirements.

#### 4.2 Institute Data Portability

- Add a **"1-Click Tenant Data Export"** in the Super Admin panel (JSON/CSV bundle of all students, financials, and question banks) to guarantee no vendor lock-in.

#### 4.3 Notice Board / Announcements

- New type: `Announcement` (targetType: 'all'|'center'|'course'|'batch')
- UI: `/dashboard/announcements`

#### 4.4 Study Material Management

- Document upload/management organized by subject → chapter → topic.

#### 4.5 Enhanced Lecture Scheduling

- Batch-wide lectures with Meet/Zoom links and auto-notifications.

---

### 🏗️ Sprint 5: Analytics Engine (Week 9-10)

**Goal:** Multi-level analytics that go deeper than Acadine.

- **Student-Level:** Test scores over time, Subject radar charts, Predicted exam performance.
- **Batch & Center:** Average comparisons, retention metrics, test participation.
- **Subject/Topic:** Mastery tracking, Topic-specific weakness mapping.
- **Dashboard UI:** Tabbed navigation at `/dashboard/analytics`.

---

### 🏗️ Sprint 6: Leapfrog Engagement (Gamification) (Week 11-12)

**Goal:** Transform the platform from a utility into a habit.

#### 6.1 Advanced Engagement Engine

- Add a **Gamification** data model: `streaks`, `xp(experience points)`, `badges`.
- Tenant-configurable `leaderboard` for batches.

#### 6.2 Student Self-Serve Practice Mode

- Students generate practice quizzes on demand styled around weak topics.

#### 6.3 Features We Already Have Over Acadine

- ✅ **CRM / Lead Management** + ✅ **Financials (Invoicing/Ledgers)**
- ✅ **Parent Portal** + ✅ **Public Marketing SEO Site**
- ✅ **AI Voice Assistant** for scheduling

---

## What Makes Us Beat Acadine + The Broader Market

| Dimension              | Acadine / Traditional LMS       | PerTuto Ultimate (After Plan)                                                  |
| ---------------------- | ------------------------------- | ------------------------------------------------------------------------------ |
| **Assessment**         | AI question paper gen + AI eval | Same + **online quizzes** + **offline PWA sync** + **concurrency-safe**        |
| **AI Trust**           | "Black box" AI evaluation       | **Confidence scoring + Teacher Review Queue (HITL)** + Student Error Reporting |
| **CRM & Sales**        | ❌ None                         | ✅ Full leads kanban + AI scoring                                              |
| **Financials**         | ❌ None                         | ✅ Invoicing + payments + ledger                                               |
| **Parent Portal**      | ❌ Basic                        | ✅ Multi-child dashboard + financials                                          |
| **Marketing Site**     | ❌ None (SaaS only)             | ✅ Full SEO website with blog                                                  |
| **Voice/AI Assistant** | ❌ None                         | ✅ Voice commands + NL scheduling                                              |
| **Gamification**       | ❌ None (Utility only)          | ✅ **Streaks, XP, Leaderboards** (Habit-forming like Duolingo)                 |
| **Data Portability**   | ❌ Vendor Lock-in               | ✅ 1-Click Tenant Data Export                                                  |
| **Accessibility**      | ❌ Physical paper reliance      | ✅ **WCAG MathML** + RTL Ready Architecture                                    |
| **Taxonomy**           | Simple syllabus hierarchy       | **4D Taxonomy** (domain→topic→skill + cognitive depth + misconceptions)        |
| **Content Ingestion**  | Manual only                     | **AI PDF Extractor** + bulk import                                             |
| **Curriculum Support** | Indian boards only              | Indian + IB + IGCSE + A-Level + CBSE + ICSE + SAT + Common Core                |
