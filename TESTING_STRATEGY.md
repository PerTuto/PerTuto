# PerTuto Super-App: Comprehensive Testing Strategy

This document outlines the systematic testing protocol to verify all features, workflows, and AI pipelines integrated during the March 2026 Merge & Polish phases (specifically Sprints 1, 2, and 3 capabilities).

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

---

## 5. Deployment Validation

**Objective:** Ensure complete production readiness across all decoupled services.

- [ ] **Core App:** Run `npm run build` locally to confirm 0 build errors across the Next.js app (ensuring all strict TypeScript checks and Next.js static generation succeed).
- [ ] **Backend Cloud Functions:** Run `npm run build` inside `functions/` and deploy via `firebase deploy --only functions`. Ensure all Genkit endpoints (especially `paperGeneratorFlow` and `evaluatorFlow`) deploy successfully.
- [ ] **Frontend Hosting:** Run `firebase deploy --only hosting` and verify routing rules (especially the dynamic `[tenantId]` paths) function correctly on the live Firebase URL without throwing 404s on page refresh.
