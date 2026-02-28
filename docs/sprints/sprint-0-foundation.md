# Pre-Sprint 0 — Foundation Fixes

> **Duration:** ~3–5 working days
> **Goal:** Upgrade dependencies, fix security gaps, and restructure code before any feature work.
> **Depends on:** Nothing (this is the starting point)
> **Blocks:** All subsequent sprints

---

## PREREQ-1: Upgrade Cloud Functions Dependencies

### What Changes

| Package                               | Current   | Target    |
| ------------------------------------- | --------- | --------- |
| `genkit` (functions)                  | `^1.20.0` | `^1.28.0` |
| `@genkit-ai/google-genai` (functions) | `^1.20.0` | `^1.28.0` |
| `@genkit-ai/firebase` (functions)     | `^1.20.0` | `^1.28.0` |
| `firebase-functions`                  | `^6.0.1`  | `^7.0.0`  |
| `genkit` (frontend)                   | `^1.20.0` | `^1.28.0` |
| `@genkit-ai/google-genai` (frontend)  | `^1.20.0` | `^1.28.0` |
| `@genkit-ai/next` (frontend)          | `^1.20.0` | `^1.28.0` |
| `genkit-cli` (frontend dev)           | `^1.20.0` | `^1.28.0` |

### Commands

```bash
# Functions
cd functions && npm install genkit@^1.28.0 @genkit-ai/google-genai@^1.28.0 @genkit-ai/firebase@^1.28.0 firebase-functions@^7.0.0
cd functions && npm run build  # Verify compilation

# Frontend
npm install genkit@^1.28.0 @genkit-ai/google-genai@^1.28.0 @genkit-ai/next@^1.28.0
npm install -D genkit-cli@^1.28.0
npm run build  # Verify compilation
```

### Risk: 🔴 HIGH

Genkit 1.28 may have breaking API changes. TutorOS uses `onCallGenkit()` from `firebase-functions/https` while PerTuto uses `onCall()` from `firebase-functions/v2/https`.

---

## PREREQ-2: Refactor Existing Functions to v7 API

### Current Pattern (PerTuto — `functions/src/index.ts`)

```ts
import { onCall } from "firebase-functions/v2/https";

export const generateQuestions = onCall(
  {
    region: "us-central1",
    memory: "512MiB",
    timeoutSeconds: 60,
  },
  async (request) => {
    return await generateQuestionsFlow(request.data);
  },
);
```

### Target Pattern (TutorOS — `functions/src/index.ts`)

```ts
import { onCallGenkit } from "firebase-functions/https";

export const worksheetExtractor = onCallGenkit(
  { secrets: [apiKey], invoker: "public", cors: true },
  worksheetExtractorFlow,
);
```

### Files to Modify

1. **`functions/src/index.ts`** — Refactor all 4 Genkit exports to use `onCallGenkit()` pattern
2. **`functions/src/config/genkit.ts`** — Align with TutorOS pattern (import `defineSecret`, `enableFirebaseTelemetry`)
3. Keep `onLeadCreated` as-is (v1 Firestore trigger — compatible with v7)
4. Keep `sendLeadEmail` email logic as-is (it's inside `onLeadCreated`)

### Decision: Overlapping AI Flows

PerTuto already has `pdf-extraction.ts`. TutorOS has a superior `extractor.ts`. Plan:

- Grep for any UI calling `generateQuestionsFromPdf`
- If not called: delete `flows/pdf-extraction.ts`
- If called: rename to `legacyPdfExtraction`, deprecate, keep deployed
- TutorOS `extractor.ts` becomes the canonical flow

### Verification

```bash
cd functions && npm run build   # Must compile
firebase emulators:start --only functions  # All functions boot
```

---

## PREREQ-3: Firebase Storage Rules

### New File: `storage.rules`

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Tenant-scoped files (PDFs, answer sheets, study materials)
    match /tenants/{tenantId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
        && request.resource.size < 25 * 1024 * 1024; // 25MB limit
    }
  }
}
```

### Also: Copy `uploadToStorage` utility

- Source: `TutorOS-backup-2026-02-15/functions/src/utils/image.ts`
- Target: `functions/src/utils/storage.ts`
- Modification: Add `tenantId` path prefix to all upload paths

---

## PREREQ-4: Add Storage to `firebase.json`

Add at root level:

```json
"storage": { "rules": "storage.rules" }
```

Deploy: `firebase deploy --only storage --project pertutoclasses`

---

## PREREQ-5: Split `services.ts` (922 lines → domain modules)

### New Structure

```
src/lib/firebase/
├── services.ts              → Becomes re-export barrel (backward compatible)
├── services/
│   ├── index.ts             → Re-exports all domain modules
│   ├── users.ts             → createUserProfile, getUserProfile
│   ├── students.ts          → getStudents, addStudent, deleteStudent, etc.
│   ├── classes.ts           → getClasses, addClass, recurring series, etc.
│   ├── courses.ts           → getCourses, addCourse, updateCourseEnrollment, etc.
│   ├── leads.ts             → getLeads, addLead, convertLeadToStudent, etc.
│   ├── assignments.ts       → getAssignments, addAssignment, etc.
│   ├── attendance.ts        → saveAttendance, getAttendanceByClass, etc.
│   ├── tenants.ts           → createTenant, getTenants, getTenantById
│   ├── analytics.ts         → getDashboardStats
│   ├── testimonials.ts      → getTestimonials, updateTestimonialStatus, etc.
│   └── resources.ts         → addResource, updateResource, deleteResource
```

### Migration: Zero Breaking Changes

1. Create `services/` directory with domain files
2. Create `services/index.ts` re-exporting everything
3. Update `services.ts` to just `export * from './services'`
4. All existing imports continue to work — no codebase-wide changes needed

---

## PREREQ-6: Fix Firestore Catch-All Rule

### Remove (lines 151-155 of `firestore.rules`)

```diff
-    // Default catch-all for other subcollections
-    match /{allSubcollections=**} {
-      allow read: if userBelongsToTenant(tenantId);
-      allow write: if userBelongsToTenant(tenantId) && (isAdmin() || isTeacher());
-    }
```

### Add Explicit Rules for Sprint 1-6 Collections

See full rules in `execution-blueprint.md` PREREQ-6 (questions, quizzes, quizAttempts, taxonomy, evaluations, tests, batches, centers, announcements, studyMaterials, questionPapers, gradeChallenges, notifications).

Deploy: `firebase deploy --only firestore:rules --project pertutoclasses`

---

## PREREQ-7: Install KaTeX

```bash
npm install katex react-katex
npm install -D @types/katex
```

Then create `src/components/ui/math-text.tsx` (port from TutorOS `MathText.tsx`).

---

## PREREQ-8: Reconcile Overlapping AI Flows

- Grep: `grep -r "generateQuestionsFromPdf" src/` — check if any UI calls it
- Decision: TutorOS `extractor.ts` replaces PerTuto `pdf-extraction.ts`

---

## Execution Order

```
1. Git branch: pre-sprint-0
2. PREREQ-1: Upgrade dependencies (functions + frontend)
3. PREREQ-2: Refactor functions/src/index.ts to v7 pattern
4. Build + verify functions compile
5. PREREQ-3: Create storage.rules + copy uploadToStorage utility
6. PREREQ-4: Add storage config to firebase.json
7. PREREQ-6: Fix firestore.rules (remove catch-all, add explicit rules)
8. Deploy rules: firebase deploy --only storage,firestore:rules
9. PREREQ-5: Split services.ts
10. PREREQ-7: Install KaTeX + create MathText component
11. PREREQ-8: Reconcile overlapping flows
12. Full build + typecheck
13. npm run dev — verify all pages
14. Deploy functions to dev
15. Smoke test all features
16. Merge to main
```

### Estimated Effort: ~7–10 hours | Risk: 🟡 Medium-High

---

## Definition of Done

- [ ] Genkit `^1.28.0` everywhere
- [ ] `firebase-functions@^7.0.0`
- [ ] All existing functions use `onCallGenkit()` pattern
- [ ] `storage.rules` exists and deployed
- [ ] `firestore.rules` has explicit per-collection rules, no catch-all
- [ ] `services.ts` split into domain modules with barrel re-export
- [ ] `katex` + `react-katex` installed, `MathText` component created
- [ ] Overlapping flows reconciled
- [ ] `npm run build` and `npm run typecheck` pass
- [ ] All existing dashboard features work
- [ ] All existing Cloud Functions work
