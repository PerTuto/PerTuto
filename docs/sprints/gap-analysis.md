# Implementation Plan — Gap Analysis & Risk Review

> **Purpose:** Flag every pitfall before we write a line of code.

---

## 🔴 Critical Risks (Must Resolve Before Sprint 1)

### 1. Genkit Version Collision

**PerTuto functions:** `genkit@1.20.0`, `firebase-functions@6.0.1`
**TutorOS backup:** `genkit@1.28.0`, `firebase-functions@7.0.0`

The TutorOS extractor uses `ai.defineFlow()` and `onCallGenkit()` from firebase-functions v7. PerTuto's current functions use the older `onCall()` from `firebase-functions/v2/https`. These are **incompatible patterns**.

> [!CAUTION]
> Blindly copying TutorOS flows will cause build failures. We must upgrade PerTuto's `functions/` to Genkit 1.28+ and firebase-functions v7 first, which may break the existing 4 Cloud Functions (`onLeadCreated`, `generateQuestions`, `generateNotes`, `generateQuestionsFromPdf`).

**Mitigation:** Upgrade `functions/package.json` to match TutorOS versions, then refactor existing flows to the new API pattern before porting.

---

### 2. Firebase Storage Not Configured

TutorOS extractor calls `uploadToStorage()` which requires:

- Firebase Storage bucket (exists: `pertutoclasses.firebasestorage.app`)
- Storage security rules (❌ **completely missing** — no `storage.rules` file)
- `firebase.json` Storage config (❌ **missing**)

This affects **everything that uploads files**: PDF worksheets, answer sheets, study materials, question paper PDFs.

> [!CAUTION]
> Without Storage rules, uploaded files are either publicly accessible or blocked entirely. Sprint 1 (extractor), Sprint 3 (answer sheet eval), and Sprint 4 (study materials) all depend on this.

**Mitigation:** Create `storage.rules` with auth-gated tenant-scoped paths. Add `"storage"` config to `firebase.json`.

---

### 3. PerTuto Already Has Overlapping AI Flows

Current `functions/src/index.ts` already exports:

- `generateQuestions` — from `content-factory.ts`
- `generateNotes` — from `content-factory.ts`
- `generateQuestionsFromPdf` — from `pdf-extraction.ts` (1GiB memory!)
- `syncDriveFolder` — from `drive-sync.ts`

The plan says "port TutorOS extractor" but **PerTuto already has a `pdf-extraction.ts` flow**. We need to decide: merge, replace, or keep both.

> [!IMPORTANT]
> The TutorOS extractor is more sophisticated (4D taxonomy tagging, figure extraction, multi-model pipeline). The existing PerTuto `pdf-extraction.ts` is likely simpler. Recommend **replacing** with TutorOS version, but must verify the existing flow isn't called from any UI first.

---

## 🟡 High Risks (Must Plan Carefully)

### 4. `services.ts` Monolith (923 Lines)

All Firestore CRUD lives in one **923-line file**. Adding Question Bank + Quiz + Test + Evaluation + Announcement + StudyMaterial + Batch + Center services will push it past **2000+ lines**.

**Mitigation:** Split into domain-specific service files BEFORE adding new code:

```
lib/firebase/
├── services.ts          → Keep as barrel export
├── services/
│   ├── students.ts
│   ├── courses.ts
│   ├── questions.ts     # NEW
│   ├── quizzes.ts       # NEW
│   └── ...
```

---

### 5. Missing LaTeX Rendering Library

TutorOS question types use LaTeX (`$x^2$`, `$$\int f(x) dx$$`). PerTuto's `package.json` has **zero LaTeX rendering dependencies** (no KaTeX, no MathJax).

Question bank UI, quiz player, and question paper preview will all render broken math without this.

**Mitigation:** Add `katex` + `react-katex` (or `rehype-katex` + `remark-math` for Markdown rendering).

---

### 6. Missing PDF Generation Library

Question paper export to PDF is a Sprint 2 deliverable. No PDF generation library exists in the codebase. Options:

- `@react-pdf/renderer` (React components → PDF, 800KB bundle)
- `jsPDF` (lighter, more manual)
- Server-side generation via Puppeteer (already in devDependencies!)

**Mitigation:** Recommend server-side PDF generation using the existing Puppeteer setup via a Cloud Function. Avoid adding heavy client-side PDF libs.

---

### 7. App Hosting Resource Limits

`apphosting.yaml`: `memoryMiB: 512`, `maxInstances: 2`, `cpu: 1`

AI answer sheet evaluation (Sprint 3) sends full PDF scans to Gemini Vision + processes rubric matching. This is I/O-bound, not memory-bound, so it should run as a **Cloud Function**, not in the App Hosting container.

> [!WARNING]
> Don't accidentally route AI-heavy workloads through the Next.js server actions (which run under these limits). All AI flows must remain as dedicated Cloud Functions with their own memory/timeout configs.

---

### 8. Firestore Security Rules — Catch-All Wildcard

Line 152-155 in `firestore.rules`:

```
match /{allSubcollections=**} {
  allow read: if userBelongsToTenant(tenantId);
  allow write: if userBelongsToTenant(tenantId) && (isAdmin() || isTeacher());
}
```

This catch-all means new collections (`questions`, `evaluations`, `grade-challenges`) will automatically get admin+teacher write access. This is **incorrect** (teachers shouldn't overwrite evaluations, students should create grade challenges).

**Mitigation:** Add explicit rules for each new collection BEFORE Sprint 1. The catch-all is dangerous for data privacy.

---

### 9. Multi-Tenant Question Bank Scope

TutorOS questions live at the **root level** (no tenant scoping). PerTuto uses `tenants/{tenantId}/` for everything.

> [!IMPORTANT]
> Acadine's model is Option A (per-institute). TutorOS was built for a single client (Option B). For PerTuto multi-tenant, **Option A is correct** but requires rewriting all TutorOS query paths.

---

## 🟢 Medium Risks (Address During Sprint)

### 10. `types.ts` Naming Conflicts

PerTuto's `types.ts` already has `Assignment`, `Course`, `Student`. TutorOS has its own `Question`, `Quiz`, `TaxonomyNode`. When merging, field usages and enum definitions (`UserRole`, `QuestionType`) must be reconciled.

### 11. No Notification System

The plan mentions "auto-notifications to batch students." Currently, there is no FCM setup or in-app notification center, only basic Gmail SMTP.
**Mitigation:** Sprint 4 should include a basic in-app notification system (Firestore `notifications` collection) before building push notifications.

### 12. Firestore Index Requirements

New queries will need composite indexes (`tests` by batch + status, `evaluations` by student + test). These must be defined in `firestore.indexes.json` or they'll fail in production.

### 13. TutorOS Model Reference: `gemini-3-flash-preview`

TutorOS extractor hardcodes `googleAI.model("gemini-3-flash-preview")`. PerTuto's AI flows should use stable model names or make them configurable.

### 14. Build Time & Bundle Size

Adding LaTeX (KaTeX: ~250KB) and charting libs will increase bundle size. Optimize with `next/dynamic`.

### 15. Two Separate Firebase Projects?

If TutorOS data (existing questions, taxonomy trees) lives in a different project, we'll need a **data migration** strategy.

---

## 🟣 Outside Perspective: The "Leapfrog" Gaps

> _What does it take to not just beat Acadine, but be a world-class EdTech platform (like Brilliant or Duolingo)? Here are the strategic and architectural gaps we are currently missing in the plan:_

### 16. AI Hallucination & Trust Deficit (Human-in-the-Loop)

**The Problem:** Acadine pushes "AI Generation" and "24H Evaluation." If an AI evaluates a math step wrong, users lose trust.
**The Gap:** Our current plan has AI flows but lacks a systemic "Confidence Scoring" and explicit Human-in-the-Loop (HITL) audit trail.
**Mitigation (Sprint 3 & 6):**

- Every AI generation/evaluation must output a `confidenceScore` (0-100).
- Any score `< 85` automatically routes to a "Teacher Review Queue" for manual approval.
- Add a mandatory "Report AI Error" button on evaluated papers to crowdsource validation.

### 17. The "Exam Day" Concurrency Spike

**The Problem:** At 9:00 AM, 500 students in a batch open the player and start writing to Firestore.
**The Gap:** `apphosting.yaml` defines `concurrency: 80` and `maxInstances: 2`. Next.js APIs will choke under a synchronous request spike. Acadine handles this by using _offline, physical paper tests_.
**Mitigation (Sprint 3):**

- **Client-Side Quiz Caching:** Students download the entire quiz payload on start.
- **Optimistic Offline Writes:** The `QuizAttempt` state syncs locally to `IndexedDB` and debounces writes to Firestore.

### 18. Native Offline & PWA Support

**The Problem:** Student internet connections drop frequently during transit or at home.
**The Gap:** A standard React SPA breaks when the connection drops.
**Mitigation (Sprint 1/2):**

- Configure Next.js/Vite as a **Progressive Web App (PWA)** with a Service Worker.
- Cache study materials (PDFs) locally for offline access.

### 19. Middle East Localization (RTL & Compliance)

**The Problem:** Dubai / UAE target market.
**The Gap:** UI relies on `Tailwind` but doesn't explicitly implement `dir="rtl"` logical properties (`ps-4` instead of `pl-4`).
**Mitigation (Sprint 4):**

- Audit all Tailwind classes to use logical properties. Check if UAE MoHRE/DED data compliance requires region-specific Firebase clusters.

### 20. Advanced Engagement Engine (Gamification)

**The Problem:** Acadine is a utility. Duolingo/Brilliant are habits.
**The Gap:** The plan lacks the psychological loops required for self-directed study.
**Mitigation (Sprint 6):**

- Add a `Gamification` data model: `streaks`, `xp`, `badges`, and `leaderboard`.

### 21. Accessibility (a11y) & MathML

**The Problem:** Public schools require WCAG compliance.
**The Gap:** Visual KaTeX spans cannot be read by screen readers.
**Mitigation:** Configure KaTeX rendering to output accessible MathML, ensure high-contrast themes.

### 22. Institute Data Portability (Vendor Lock-in)

**The Problem:** Institutes hate committing because leaving is impossible.
**The Gap:** No bulk export capability.
**Mitigation (Sprint 4):**

- Add "1-Click Tenant Data Export" (JSON/CSV bundle of all records) to guarantee no vendor lock-in as a major sales hook.

---

## Pre-Sprint 1 Checklist

Before writing any feature code, resolve these foundational issues:

- [ ] Upgrade `functions/package.json` to Genkit 1.28+ and firebase-functions v7
- [ ] Refactor existing 4 Cloud Functions to new API pattern
- [ ] Create `storage.rules` with tenant-scoped paths
- [ ] Add `"storage"` config to `firebase.json`
- [ ] Split `services.ts` into domain-specific modules
- [ ] Add explicit Firestore rules for new collections (remove catch-all reliance)
- [ ] Install KaTeX for LaTeX rendering
- [ ] Decide Question Bank scope: per-tenant vs. shared
- [ ] Audit & reconcile existing `pdf-extraction.ts` vs TutorOS `extractor.ts`
- [ ] Add required Firestore composite indexes to `firestore.indexes.json`
