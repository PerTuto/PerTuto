# PerTuto Super-App: Comprehensive Testing Strategy

This document outlines the systematic testing protocol to verify all features, workflows, and AI pipelines integrated during the March 2026 Merge & Polish phases (specifically Sprints 1, 2, and 3 capabilities).

## 0. Test Credentials (Seed Data)

**Production URL:** `https://pertuto.com`

Use these credentials for testing on the staging/production environment if the database has been seeded.

| Role                | Email                    | Password      | Tenant ID         |
| :------------------ | :----------------------- | :------------ | :---------------- |
| **Super Admin**     | `super@pertuto.com`      | `password`    | N/A               |
| **Tenant Admin**    | `admin@demoschool.com`   | `password123` | `test-tenant-001` |
| **Teacher**         | `teacher@demoschool.com` | `password123` | `test-tenant-001` |
| **Student (Alice)** | `alice@demoschool.com`   | `password123` | `test-tenant-001` |

---

## 1. Multi-Tenant Role-Based Access Control (RBAC) Testing

**Objective:** Ensure complete data isolation and correct access privileges across roles within a specific tenant (governed by `firestore.rules`).

### Test Matrix

| Role                | Can Access Admin Dashboard? | Can Manage Centers/Batches? | Can View/Assign Tests? | Can Evaluate/Challenge Grades? |
| :------------------ | :-------------------------- | :-------------------------- | :--------------------- | :----------------------------- |
| **Super Admin**     | Yes (All Tenants)           | Yes                         | Yes                    | Yes                            |
| **Admin/Executive** | Yes (Own Tenant)            | Yes                         | Yes                    | Yes (View Only)                |
| **Teacher**         | Yes (Own Tenant)            | No (View Only)              | Yes                    | Yes (Full)                     |
| **Student/Parent**  | No                          | No                          | Yes (Take/View)        | Yes (Challenge)                |

### Key Scenarios Context

- [ ] Log in as a `teacher` and attempt to navigate directly to `/dashboard/[tenantId]/organization/centers`. It should redirect or show unauthorized based on the frontend `SidebarNav` logic.
- [ ] Attempt to read/write a `batch` document in Firestore using a `student` token via frontend client SDK. It should fail and return a `permission-denied` error from Firebase.
- [ ] Ensure a `teacher` in `tenantA` cannot query student records from `tenantB`.

---

## 2. Immersive Web & UI Overhaul Testing

**Objective:** Validate performance and visual stability of the premium SaaS aesthetic introduced in Phase 3.

### Key Scenarios Context

- [ ] **Lighthouse Performance:** Run Chrome Lighthouse on the homepage (`/` and `/nike-proto`). Verify the animation libraries (GSAP/Framer Motion or CSS transitions) do not cause layout shifts (CLS < 0.1) or tank mobile performance.
- [ ] **Hydration Stability:** Perform a hard refresh (Cmd+Shift+R) across various `(public)` and `dashboard/` routes to ensure there are no console warnings regarding Next.js HTML hydration mismatches.
- [ ] **Responsive Design:** Verify the dashboard sidebar collapses correctly on mobile viewports and that the "Neural Pathway" interactive SVGs scale gracefully without causing horizontal scroll bleed.

---

## 3. LMS & State Management (ChronoClass Port) Testing

**Objective:** Check the integrity of the core learning management system ported to the Next.js App Router (Phase 2).

### Key Scenarios Context

- [ ] **Data Model Persistence:** Log in as admin, navigate to `/dashboard/[tenantId]/batches`, assign a student and teacher to a newly created batch, and verify Firestore correctly writes the relations.
- [ ] **Real-time Sync:** Verify that the student's dashboard immediately reflects the new course/batch materials without requiring a hard reload.
- [ ] **Auth State Persistence:** Log in, close the browser tab, reopen the app, and verify the Firebase Auth state listener smoothly redirects bypassing the `/login` screen.

---

## 4. AI Parity Workflows (Acadine.ai & TutorOS Features)

**Objective:** End-to-end verification of the Genkit/Gemini AI pipelines deployed in Phase 5.

### 4.1 AI Question Paper Wizard (Sprint 2 Parity)

- [ ] Navigate to `/dashboard/[tenantId]/question-papers/generate`.
- [ ] Configure a paper targeting "Medium" difficulty for 60 minutes. Add constraints for 10 MCQs and 2 Subjective questions alongside specific chapter weightages.
- [ ] Trigger generation. **Verification:** Ensure the UI reflects a loading state and successfully resolves to Step 3 (Review & Finalize) within acceptable timeout limits.
- [ ] Verify the structure of the generated `QuestionPaper` document written to Firestore strictly matches the `QuestionPaper` schema defined in `src/lib/types.ts`.

### 4.2 Gemini Vision Evaluation & HITL Queue (Sprint 3 Parity)

- [ ] Submit a dummy PDF "Answer Sheet" to a test via the student portal.
- [ ] Trigger the `evaluator.ts` Cloud Function flow (handling Gemini 3.1-pro Vision).
- [ ] **Verification:** Wait for the evaluation result and ensure a `confidenceScore` is returned for each subjective answer.
- [ ] If `confidenceScore < 85%`, log in as a Teacher and navigate to `/dashboard/[tenantId]/review-evaluations`. Ensure the attempt is listed here for Human-In-The-Loop review.
- [ ] Complete the HITL review (override an AI grade). Ensure the final score reflects the teacher's override, not the AI's.

### 4.3 TutorOS Databank & Extraction

- [ ] Use the extraction tool to upload a dummy syllabus PDF or test paper.
- [ ] Trigger the `extractor.ts` flow.
- [ ] **Verification:** Check the `/questions` Firestore collection to ensure questions were successfully parsed, tagged with correct 4D taxonomy metadata, and saved as individual documents.

### 4.4 Data Integrity & Edge Cases

- [ ] **LaTeX Rendering:** Add a question with complex math (e.g., `$\frac{-b \pm \sqrt{b^2-4ac}}{2a}$`) to the bank. Verify it renders correctly in both the Question Paper editor and the Quiz Player.
- [ ] **Question Normalization:** Import a legacy `MULTIPLE_CHOICE` question. Verify it is correctly mapped to `MCQ_SINGLE` and that `correctAnswer` is removed (moved to `options`).
- [ ] **4D Taxonomy:** Assign a question to a multi-level topic (e.g., Math -> Algebra -> Linear Equations). Verify the filters correctly surface it.

---

## 5. Domain Services & Deployment Validation

**Objective:** Ensure complete production readiness across all 27 decoupled domain services.

### Service Modules Checklist

- [ ] **Admin Core:** `tenants.ts`, `users.ts`, `centers.ts`, `batches.ts`
- [ ] **LMS Core:** `students.ts`, `teachers.ts`, `courses.ts`, `classes.ts`
- [ ] **Assessment:** `questions.ts`, `quizzes.ts`, `tests.ts`, `question-papers.ts`
- [ ] **AI Flows:** `evaluations.ts`, `grade-challenges.ts`, `taxonomy.ts`
- [ ] **Operations:** `attendance.ts`, `assignments.ts`, `announcements.ts`, `notifications.ts`
- [ ] **Infrastructure:** `storage-services.ts`, `financial-services.ts`, `analytics.ts`, `gamification.ts`

### Deployment Deployment

- [ ] **Core App:** Run `npm run build` locally to confirm 0 build errors across the Next.js app (ensuring all strict TypeScript checks and Next.js static generation succeed).
- [ ] **Backend Cloud Functions:** Run `npm run build` inside `functions/` and deploy via `firebase deploy --only functions`. Ensure all Genkit endpoints (especially `paperGeneratorFlow` and `evaluatorFlow`) deploy successfully.
- [ ] **Frontend Hosting:** Run `firebase deploy --only hosting` and verify routing rules (especially the dynamic `[tenantId]` paths) function correctly on the live Firebase URL without throwing 404s on page refresh.

---

## 6. Technical Gaps & Risks (Flagged for Review)

During the final documentation audit, the following items were identified as potential blockers for a "bulletproof" test:

1. **Student Auth Accounts:** The `seed.ts` script creates student documents in Firestore but **does not** create their Firebase Auth credentials. Testing Student-specific workflows (Alice/Bob) will require manually creating these accounts in the Firebase Console or updating the seed script.
2. **Genkit Function Deployment:** Verify that the `paperGenerator` and `evaluator` flows are actually deployed and accessible via the `httpsCallable` interface. If they throw "Not Found", verify the `index.ts` export names.
3. **Immersive Web CLS:** Initial scan suggests heavy GSAP animations on the landing page. Perform a Core Web Vitals audit to ensure Cumulative Layout Shift (CLS) stays within the "Good" range (< 0.1).
4. **Security Rule Coverage:** Verified that `evaluations` and `gradeChallenges` rules were missing and have now been manually added to `firestore.rules`. Baseline testing should confirm these are now properly isolated.
