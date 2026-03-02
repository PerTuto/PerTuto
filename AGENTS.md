# PerTuto — AI Agent Project Context

> **One-file reference for any AI agent working on this codebase.**
> Last updated: 2026-02-28 (Phase 21: Analytics & AI Insights)

---

## 1. What Is This?

PerTuto is a **tutoring business platform** for a Dubai-based company. It has two halves:

| Surface                | URL                                      | Purpose                                                                        |
| ---------------------- | ---------------------------------------- | ------------------------------------------------------------------------------ |
| **Public Website**     | `pertuto.com` (via Firebase App Hosting) | Marketing site — homepage, services, blog, pricing, contact, SEO               |
| **Internal Dashboard** | `/dashboard/*` (auth-gated)              | CRM + LMS — leads kanban, students, courses, schedule, assignments, attendance |

---

## 2. Tech Stack

| Layer             | Technology                                                                |
| ----------------- | ------------------------------------------------------------------------- |
| **Framework**     | Next.js 16 (App Router, Turbopack)                                        |
| **Language**      | TypeScript                                                                |
| **React**         | React 19                                                                  |
| **Styling**       | Tailwind CSS v3, shadcn/ui components                                     |
| **Database**      | Cloud Firestore (client SDK for reads, Admin SDK for server actions)      |
| **Auth**          | Firebase Auth (email/password)                                            |
| **Hosting**       | Firebase App Hosting (auto-deploys from `master` branch on GitHub)        |
| **Email**         | Resend API (lead notification emails)                                     |
| **Content**       | MDX for blog posts (`src/content/blog/`)                                  |
| **AI**            | Genkit with Google GenAI (used in schedule AI quick-add, voice assistant) |
| **Analytics**     | Google Analytics 4 (GA4)                                                  |
| **UI Components** | Radix UI primitives via shadcn/ui (`src/components/ui/`)                  |

---

## 3. Project Structure

```
pertuto-tutoring/
├── src/
│   ├── app/
│   │   ├── (auth)/login/          # Login page
│   │   ├── (public)/              # Public website (marketing)
│   │   │   ├── page.tsx           # Homepage
│   │   │   ├── about/             # About page
│   │   │   ├── blog/              # Blog listing + [slug] posts
│   │   │   ├── contact/           # Contact form
│   │   │   ├── pricing/           # Pricing page
│   │   │   ├── privacy/           # Privacy policy
│   │   │   ├── services/k12/     # K-12 tutoring services
│   │   │   ├── services/professional/  # Professional training
│   │   │   ├── subjects/[slug]/   # Subject pillar pages (SSG)
│   │   │   └── terms/             # Terms of service
│   │   ├── dashboard/             # Auth-gated internal dashboard
│   │   │   ├── page.tsx           # Role-switch home (student/teacher/parent/admin)
│   │   │   ├── leads/             # CRM — Kanban board
│   │   │   ├── students/          # Student management table + [id] detail
│   │   │   ├── courses/           # Course cards with enrollment
│   │   │   ├── schedule/          # Weekly calendar + class dialog
│   │   │   ├── assignments/       # Assignment list
│   │   │   ├── attendance/        # Attendance tracking (stub)
│   │   │   ├── availability/      # Teacher availability grid
│   │   │   ├── family/            # Parent Family Portal (multi-child tabs)
│   │   │   ├── organization/users/# Team/org user management
│   │   │   ├── settings/          # Settings (availability, calendar, team)
│   │   │   └── welcome/           # Onboarding page (parent/student/teacher)
│   │   ├── actions/               # Server Actions
│   │   │   ├── leads.ts           # Public lead submission (Admin SDK)
│   │   │   ├── invite-actions.ts  # Team invite token CRUD (5 roles + executive)
│   │   │   └── admin-create-user-action.ts  # Admin SDK createUser (any email domain)
│   │   ├── api/auth/google/       # Google OAuth callback routes
│   │   ├── join/[token]/          # Team invite acceptance page
│   │   ├── sitemap.ts             # Dynamic sitemap generation
│   │   ├── robots.ts              # robots.txt generation
│   │   ├── layout.tsx             # Root layout
│   │   ├── error.tsx              # Error boundary
│   │   └── not-found.tsx          # 404 page
│   ├── components/
│   │   ├── ui/                    # shadcn/ui primitives (35 components)
│   │   ├── public/                # Public site components (hero, cards, etc.)
│   │   ├── leads/                 # Kanban board, add/edit lead dialogs
│   │   ├── schedule/              # Weekly calendar, class dialog, AI quick-add
│   │   ├── courses/               # Course dialog, enrollment management
│   │   ├── students/              # Student detail view
│   │   ├── assignments/           # Add assignment dialog
│   │   ├── attendance/            # Attendance tracker (stub)
│   │   ├── availability/          # Availability grid
│   │   ├── settings/              # Settings forms, calendar connect
│   │   ├── tenant/                # Invite dialog (5 roles + Direct Create mode)
│   │   ├── dashboard/             # Quick-add, stats, pending assignments
│   │   ├── dashboards/            # Role-specific portals
│   │   │   ├── student-home.tsx   # Student: courses, classes, assignments, stats
│   │   │   └── teacher-home.tsx   # Teacher: schedule, students, grading queue
│   │   ├── layout/                # Sidebar nav (role-gated), header
│   │   ├── brand/                 # Logo component
│   │   └── analytics/             # GA4 tracking component
│   ├── hooks/
│   │   ├── use-auth.tsx           # Auth context provider (login, signup, logout)
│   │   └── use-toast.ts           # Toast notification hook
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── client-app.ts      # Client Firebase SDK init
│   │   │   ├── admin-app.ts       # Admin SDK init (server-side only)
│   │   │   └── services.ts        # All Firestore CRUD functions
│   │   ├── types.ts               # TypeScript types (Lead, Student, Course, etc.)
│   │   ├── sanitize.ts            # Input sanitization utilities
│   │   ├── utils.ts               # cn() and other utilities
│   │   ├── google-calendar.ts     # Google Calendar integration
│   │   └── schema.ts              # JSON-LD schema generators
│   ├── content/blog/              # MDX blog posts
│   ├── data/subjects.ts           # Subject pillar page data
│   └── ai/                        # Genkit AI flows
├── firestore.rules                # Firestore security rules (auth-gated)
├── firestore.indexes.json         # Firestore index definitions
├── firebase.json                  # Firebase config (emulators, functions)
├── apphosting.yaml                # Firebase App Hosting config + env vars
├── .firebaserc                    # Firebase project: pertutoclasses
├── next.config.ts                 # Next.js config (MDX, images)
├── tailwind.config.ts             # Tailwind CSS config
└── package.json                   # Dependencies and scripts
```

---

## 4. Data Model (Firestore)

All tenant data lives under `tenants/{tenantId}/`. The default tenant is `pertuto-default`.

```
firestore/
├── users/{uid}                    # User profiles (linked to Firebase Auth)
│   ├── fullName, email, role, tenantId, avatar
│
├── tenants/{tenantId}/
│   ├── leads/{leadId}             # CRM leads
│   │   ├── name, email, phone, status, source, dateAdded, notes, timezone
│   │   └── status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost'
│   │
│   ├── students/{studentId}       # Enrolled students
│   │   ├── name, email, phone, avatar, enrolledDate, courses[], progress
│   │   ├── status: 'Active' | 'On-hold' | 'Graduated' | 'Dropped'
│   │   └── curriculum, grade, timezone, notes
│   │
│   ├── courses/{courseId}         # Courses/subjects offered
│   │   ├── title, description, instructor, duration, image, status
│   │   └── studentIds[], instructorId
│   │
│   ├── classes/{classId}          # Scheduled class sessions
│   │   ├── courseId, title, start (Date), end (Date), meetLink
│   │   ├── students[] (student IDs), ownerId
│   │   └── status: 'scheduled' | 'cancelled' | 'completed'
│   │
│   ├── assignments/{assignmentId} # Homework/assignments
│   │   ├── courseId, title, dueDate, status
│   │
│   ├── availability/{slotId}      # Teacher availability slots
│   │   ├── userId, dayOfWeek, startTime, endTime, status
│   │
│   └── users/{userId}             # Tenant-scoped user profiles (for org page)
│
└── invites/{tokenId}              # Team invite tokens
    ├── tenantId, tenantName, role, email, expiresAt, used
```

### User Roles

```typescript
type UserRole =
  | "super"
  | "admin"
  | "executive"
  | "teacher"
  | "parent"
  | "student";
```

- **super**: Platform owner (hardcoded: `super@pertuto.com` or env var `NEXT_PUBLIC_SUPER_USER_EMAIL`). Gets `tenantId: 'pertuto-default'` automatically.
- **admin**: Tenant admin — full access to tenant data
- **executive**: Sales/business development — read-only access to analytics/reports
- **teacher**: Instructor — schedule, courses, students, assignments, grading, attendance
- **student**: Learner — enrolled courses, upcoming classes, assignment submission
- **parent**: Guardian — Family Portal with per-child progress, assignments, invoices

---

## 5. Auth Flow

1. User visits `/login` → enters email + password
2. Firebase Auth `signInWithEmailAndPassword()`
3. `AuthProvider` in `use-auth.tsx` detects auth state change
4. If `user.email === SUPER_USER_EMAIL` → sets `tenantId: 'pertuto-default'`, `role: 'super'`
5. Otherwise → fetches user profile from `users/{uid}` Firestore doc
6. Redirects to `/dashboard/leads` (or `/welcome` if no profile)
7. `AuthenticatedLayout` wraps all `/dashboard/*` routes — redirects to `/login` if no user

### Team Invite Flow

1. Admin creates invite via `InviteUserDialog` (supports all 5 non-super roles)
2. **Invite Link mode**: generates `/join/{token}` URL → new user fills name/email/password → creates Firebase Auth account + user profile → invite marked as used
3. **Direct Create mode**: admin fills email/password/name/role → calls `adminCreateUser()` server action → Firebase Admin SDK `createUser()` + Firestore profile → supports any email domain (e.g., `student@myacademy.edu`)
4. Parent/student invites can link to existing student records

---

## 6. Key Patterns

### Server Actions vs Client SDK

| Operation                                 | SDK                           | Why                                       |
| ----------------------------------------- | ----------------------------- | ----------------------------------------- |
| Public lead form submission               | **Admin SDK** (server action) | Bypasses Firestore rules — no auth needed |
| Dashboard CRUD (leads, students, courses) | **Client SDK**                | Uses authenticated user's token           |
| Invite token management                   | **Admin SDK** (server action) | Server-side token generation              |

### Firestore Security Rules

Rules are auth-gated (deployed via `firebase deploy --only firestore:rules --project pertutoclasses`):

- Helper functions: `isSuper()`, `isAdmin()`, `isTeacher()`, `isStudent()`, `isParent()`, `hasRole()`, `userBelongsToTenant()`
- All `tenants/{tid}/*` collections require `userBelongsToTenant(tenantId)`
- `users/{uid}` read: own doc OR super/admin; write: own doc OR super
- Students can update their own profile (via `resource.data.userId == auth.uid`)
- Assignments: teachers/admins create, students can update (submit)
- Invoices/ledger: admin write, tenant read
- Leads: admin/super only
- Invites: public read (for link validation), admin/super write
- Default deny for unmatched paths

### Component Architecture

- **shadcn/ui**: All UI primitives in `src/components/ui/` — Button, Dialog, Card, etc.
- **Feature components**: Organized by domain (`leads/`, `schedule/`, `courses/`, etc.)
- **Data fetching**: Client-side in `useEffect` hooks using services from `services.ts`
- **Forms**: React Hook Form + Zod validation + shadcn Form components

---

## 7. Environment Variables

```bash
# Firebase (required)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pertutoclasses
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Email notifications (optional — lead emails won't send without this)
RESEND_API_KEY=
ADMIN_EMAIL=

# Auth (optional — defaults to super@pertuto.com)
NEXT_PUBLIC_SUPER_USER_EMAIL=

# Google Analytics (same as FIREBASE_MEASUREMENT_ID)
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

Production env vars are set in `apphosting.yaml`. Secrets (like `RESEND_API_KEY`) use Firebase App Hosting's secret manager.

---

## 8. Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run typecheck    # TypeScript check (tsc --noEmit)

# Firebase
npx firebase deploy --only firestore:rules --project pertutoclasses
npx firebase deploy --only firestore:indexes --project pertutoclasses

# Git (auto-deploys via Firebase App Hosting on push to master)
git push origin master
```

---

## 9. Deployment

- **Platform**: Firebase App Hosting (not Firebase Hosting — they're different)
- **Auto-deploy**: Push to `master` branch on GitHub → Firebase builds and deploys
- **Project ID**: `pertutoclasses`
- **Production URL**: `pertuto-web--pertutoclasses.us-central1.hosted.app`
- **Custom domain**: `pertuto.com` (DNS configured, may still be propagating)
- **Config**: `apphosting.yaml` controls instances, memory, env vars

---

## 10. Current State & Known Issues

### What Works ✅

- Full public marketing site (homepage, services, blog, pricing, contact, privacy, terms, about)
- SEO: sitemap.xml, robots.txt, OG tags, JSON-LD schemas, GA4
- Lead capture form → Firestore + email notification
- **NEW Phase 9**: Dynamic subject landing pages (IB Chemistry, IGCSE Math, A-Level Biology) with `Course` JSON-LD schema
- **NEW Phase 9**: High-end `DecryptedText` UI polish integrated across all major entry points
- **NEW Phase 9**: GA4 `generate_lead` conversion tracking tied to the lead capture form
- **NEW Phase 12**: Parent financials (Pay Now button, dynamic invoice status updates)
- **NEW Phase 12**: Assignment management (dialogs, student uploads, teacher grading, auto-status transitions)
- **NEW Phase 12**: Reschedule requests with visual indicators (amber/green borders, ⏳ icons) for pending/approved
- **Apple Calendar Redesign V2**: Fixed timezone positioning bugs, implemented collision detection for overlapping events, corrected DST drift in recurring series updates, and integrated `RecurringEditPrompt` into the `ClassDialog`.
- **iCal Import**: Added bulk-import capability for `.ics` files using `ical.js` with event preview and selection logic.
- **Multi-tenancy & ID Safety**: Added runtime assertions for `tenantId` in Firestore services and fixed polymorphic `isEditing` logic to prevent ID-less operations.
- **NEW Phase 17**: Scalable curriculum scaffolding for CBSE and ICSE boards, complete with subject bifurcation logic and dynamic sorting by grade.
- **NEW Phase 17**: Robust resource retrieval bypassing implicit Firestore batch limits, coupled with a deterministic Next.js client-server rendering tree to eliminate hydration mismatches.
- **NEW Phase 20 (Sprint 4)**: Targeted Announcements system, Study Materials Library (Chapter/Topic scoped), and Real-time Notification bell.
- **NEW Phase 20 (Sprint 4)**: Full RTL support across the dashboard using logical properties and dynamic `dir="auto"` injection.
- **NEW Phase 20 (Sprint 4)**: 1-click Tenant Data Portability (JSON/CSV export Cloud Function).
- **NEW Phase 21 (Sprint 5)**: Analytics Service Layer for real-time institutional KPIs and performance metrics.
- **NEW Phase 21 (Sprint 5)**: Interactive Student Analytics (Line/Radar charts) and high-level Admin Insights dashboard.
- **NEW Phase 21 (Sprint 5)**: AI-driven Gap Analysis and Score Prediction flows using Genkit.
- Dashboard: login, leads kanban (edit/delete/status), students table, courses CRUD, schedule calendar, assignments list, availability grid, settings, org users
- Team invite flow (`/join/[token]`)
- Input sanitization + rate limiting on public lead form
- Firestore security rules (auth-gated)

### Known Issues / TODOs 🟡

- **Assignments page role-scoping**: Students/teachers currently see all assignments — needs filtering by enrolled courses
- **Family Portal attendance chart**: `getAttendanceForStudent()` not yet implemented
- **Family Portal attendance chart**: `getAttendanceForStudent()` not yet implemented

### Recently Resolved 🟢

- ~~Sidebar nav role-based filtering~~ → Fully implemented with per-role menu items
- ~~Role-based access~~ → Dashboard page now role-switches (student/teacher/parent/admin)
- ~~Parent/student roles not in UI~~ → Both roles now have dedicated portals
- ~~Attendance page~~ → Replaced AI stub with fully functional manual attendance table
- ~~Service function efficiency~~ → Implemented `getStudentByUserId`, `getCoursesForTeacher`, and `getAssignmentsForStudent` native queries
- ~~Firestore granular helpers~~ → Enforced document-level security with `isStudentOwner()` and `isParentOfStudent()`
- ~~Communication Features~~ → Announcements, Library, and Notifications fully implemented (Sprint 4).
- ~~Analytics Layer~~ → Real-time KPI aggregation and AI performance insights live (Sprint 5).
- ~~RTL Support~~ → Global dashboard audit and logical property conversion complete.
- ~~Data Portability~~ → Tenant data export (JSON/CSV) triggerable from settings.

---

## 11. Conventions

1. **File naming**: kebab-case for files (`add-lead-form.tsx`), PascalCase for components (`AddLeadForm`)
2. **Imports**: Use `@/` path alias (maps to `src/`)
3. **Services**: All Firestore CRUD goes through `src/lib/firebase/services.ts`
4. **Types**: All shared types in `src/lib/types.ts`
5. **Server actions**: Use `'use server'` directive, place in `src/app/actions/`
6. **Client components**: Use `"use client"` directive at top of file
7. **Toasts**: Use `useToast()` from `@/hooks/use-toast` for user feedback
8. **Auth**: Use `useAuth()` from `@/hooks/use-auth` for user/profile/tenantId
9. **TenantId**: Always pass `userProfile.tenantId` to service functions — never hardcode
10. **Styling**: Use Tailwind classes + `cn()` utility for conditional classes
11. **Fonts**: `font-headline` for headings (DM Sans), default sans for body
12. **Colors**: Primary = teal (`#0D9488`), Sidebar = dark navy (`#0f172a`)

---

## 12. Implementation History (Phases)

| Phase  | Focus                      | Key Deliverables                                                                                                                                                                                |
| :----- | :------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **0**  | **Foundation**             | Next.js 16 + React 19 setup, Tailwind/shadcn init, Firebase Auth/Firestore config.                                                                                                              |
| **1**  | **Marketing**              | Public homepage, services, about, pricing, contact, and global meta/SEO tags.                                                                                                                   |
| **2**  | **CRM (Leads)**            | Kanban board for lead management, source tracking, and status transitions.                                                                                                                      |
| **3**  | **LMS (Students)**         | Student database, enrollment management, course progress, and search.                                                                                                                           |
| **4**  | **LMS (Courses)**          | Course CRUD, instructor assignments, and enrollment-to-course mapping.                                                                                                                          |
| **5**  | **Scheduling V1**          | First iteration of the calendar with list/grid views and basic class creation.                                                                                                                  |
| **6**  | **Content**                | MDX blog engine, dynamic sitemap, and robots.txt generation.                                                                                                                                    |
| **7**  | **Dashboard**              | Home dashboard with stats, upcoming classes widget, and recent activity feed.                                                                                                                   |
| **8**  | **Audit**                  | Comprehensive security and architectural audit (Phase 8 Audit doc).                                                                                                                             |
| **9**  | **Growth/Polish**          | Dynamic subject pillar pages, `DecryptedText` animations, GA4 lead tracking.                                                                                                                    |
| **10** | **Team Ops**               | Onboarding (`/welcome`), Team user management, and tokenized invite flows.                                                                                                                      |
| **11** | **Hardening**              | Firestore security rules (tenant isolation) and server-side validation.                                                                                                                         |
| **12** | **Full LMS**               | Parent financials (Pay Now), assignment hand-ins, and reschedule flows.                                                                                                                         |
| **13** | **Calendar V2**            | **Apple Calendar redesign**: weekly time-grid, drag-and-drop, timezone support.                                                                                                                 |
| **14** | **Safety**                 | Runtime `tenantId` assertions and ID-creation logic fixes (Audit Resolution).                                                                                                                   |
| **15** | **iCal Import**            | Bulk `.ics` file import using `ical.js`, with event preview and UX refinements.                                                                                                                 |
| **16** | **User Portals**           | Multi-tenant role dashboards: Student/Teacher/Parent portals, admin `createUser()` with custom domain emails, Direct Create invite mode, enhanced Firestore rules with role helpers.            |
| **17** | **Curriculum Scaffolding** | Dynamic K-12 board pages (CBSE/ICSE), sorting bug fixes, Firestore 1000-limit resolution, React hydration error fixes, and robust UI rendering for syllabuses & past papers.                    |
| **18** | **Audit Resolution**       | Addressed architectural gaps: created native optimized queries (`getCoursesForTeacher`, etc.), enforced strict `isStudentOwner`/`isParentOfStudent` document rules, built manual attendance UI. |
| **19** | **UI/UX Polish**           | Refined the `/nike-proto` experimental homepage with Brilliant.org-inspired pastel rhythm, 3D button pops, Vanta constellation background, and fixed neural pathway micro-animations.           |
| **20** | **Communication**          | **Sprint 4**: Announcements, targeted notifications, study material library, RTL localization audit, and JSON/CSV data export for tenants.                                                      |
| **21** | **Analytics & AI**         | **Sprint 5**: Real-time KPI analytics service, Student/Admin dashboards with Recharts, AI Learning Gap Analysis (`gapAnalyzerFlow`), and Predictive Score Modeling (`scorePredictorFlow`).      |

### 12.1 Foundational Tech Debt Resolved (Pre-Sprint 0 & Phase 1)

To prevent future agents from repeating discovery work, here are the core architectural fixes applied to stabilize the app before Sprint 1:

- **Genkit Framework Upgrade**: Upgraded Google's Genkit from v1.20 to **v1.29+** to support modern async Node handlers before porting TutorOS AI workflows.
- **Firebase Functions Modernization**: Bumped to `firebase-functions v7`.
- **Storage Security**: Added explicit `storage.rules` to enforce tenant-isolated, auth-gated file uploads (preventing anonymous upload exploits).
- **Firestore Hardening**: Removed a dangerous catch-all wildcard rule in `firestore.rules` and replaced it with strict role-based helpers (e.g., `isSuper()`, `isTeacher()`).
- **De-monolithing Services**: Split the monolithic `services.ts` (which grew to 923 lines) into precise domain-specific modules to prevent merge conflicts.
- **Next.js Hydration Errors (Phase 1)**: The App Router strictly forbids `<a>` inside `<a>`. Legacy card components (especially in `/resources`) had nested `<Link>` tags causing severe client crashes. **Future Agents: Do NOT nest `<Link>` elements.**
- **KaTeX Initialization**: Added the KaTeX math typesetting library to support WCAG-compliant MathML rendering for upcoming Question Banks.

### 12.2 Feature Verification & Multi-Tenancy Security (Phase 2 & Phase 3)

During the stabilization and initial merge sequence, significant progress was made to ensure feature parity without regressions:

- **ChronoClass LMS Verification (Phase 2)**: All critical routing for the LMS dashboard was successfully ported to the new Next.js 16 App Router. Crucially, **Calendar V2** (featuring drag-and-drop, collision detection, and timezone persistence) is fully intact under `src/app/dashboard/schedule`. The legacy AI Attendance camera stub was intentionally removed and replaced with a stable, manual attendance table to meet MVP requirements.
- **TutorOS AI Integration (Phase 3)**: The native Genkit AI extractors (`extractor.ts`, `validator.ts`, `enhancer.ts`, etc.) were successfully placed into `functions/src/flows` and the dashboard routing successfully resides inside `src/app/dashboard/[tenantId]`.
- **Missing Firestore Security Rules Fixed**: While the AI UI existed, the underlying `firestore.rules` for the new TutorOS collections were completely missing. We authored deep, tenant-isolated rule blocks for `questions`, `quizzes`, `quizAttempts`, `taxonomy`, `questionPapers`, `tests`, and `practiceSessions` to ensure airtight Role-Based Access Control (RBAC).
- **Genkit Dev Server Crash Fix**: A missing `server-only` npm dependency in `src/lib/firebase/server-app.ts` caused the local Genkit Developer UI to fatally crash. Installing this permanently resolved the error (`npm run genkit:dev` now boots flawlessly).

---

## 13. Testing Progress

> We are currently executing exhaustive production tests out of `test_strategy.md`.

- **Pass 0 (Smoke):** Completed (Public site ping, Auth, CRUD, Auth Guards).
- **Suite 1 & 2 (Public Site & Auth):** Completed (All 11 public pages, navigation, onboarding redirects).
- **Suite 3 (CRM/Leads):** Completed (Kanban columns, DND, CRUD flow verified).
- **Suite 4 (Students & Courses):** Completed (Listings, Add/Edit/Delete, and Enrollments verified. Two minor UI bugs noted).
- **Phase 1 (Suites 5-7):** Completed (Scheduling, Assignments, Financials. Major bugs found in Scheduling edit flow and Assignment dates).
- **Phase 2 (Suite 8):** Completed (All 5 roles verified — Super/Admin/Teacher/Student/Parent dashboards and RBAC sidebar. 14/14 pass).
- **Phase 3 (Suites 9-10):** Completed (Security access control 3/3, SEO 6/7 — only og:image missing).
- **🎯 All test suites complete!** Final score: **123 tests, 111 passed, 11 issues.**

---

---

## 14. Upcoming Roadmap (6-Sprint Plan)

> **Goal:** Merge PerTuto + TutorOS AI features + Acadine capabilities into one product that beats all competitors.
> **Reference Artifacts:** `implementation_plan.md`, `gap_analysis.md`, `task.md` (in Antigravity brain)

| Sprint                  | Focus                          | Key Deliverables                                                                                                                                                |
| ----------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Pre-Sprint 0**        | Foundation Fixes               | ✅ **Complete**: Upgraded Genkit to 1.29+, firebase-functions v7, created `storage.rules`, split `services.ts`, fixed catch-all Firestore rule, installed KaTeX |
| **Sprint 1** (Wk 1-2)   | Question Bank + AI Flows + PWA | Port TutorOS AI flows (extractor, curator, validator, enhancer), question bank CRUD, quiz system, quiz player with offline sync, PWA setup                      |
| **Sprint 2** (Wk 3-4)   | Institute Management + Papers  | Centers, Batches, AI Question Paper Generation (Acadine-style), syllabus weightage, PDF export                                                                  |
| **Sprint 3** (Wk 5-6)   | AI Evaluation + HITL           | AI Answer Sheet Evaluator (Gemini Vision), test lifecycle, grade challenges, HITL teacher review queue, exam-day concurrency handling                           |
| **Sprint 4** (Wk 7-8)   | Communication + RTL + Export   | ✅ **Complete**: Announcements, library, RTL audit, JSON/CSV export, notification center.                                                                       |
| **Sprint 5** (Wk 9-10)  | Analytics Engine               | ✅ **Complete**: Aggregation service, Recharts interaction, AI Gap Analysis, Predictive scores.                                                                 |
| **Sprint 6** (Wk 11-12) | Gamification + Practice        | 🟡 **In Progress**: Streaks, XP, badges, leaderboards, self-serve practice mode.                                                                                |

### New Firestore Collections (Planned)

All under `tenants/{tenantId}/`:

```
questions/{questionId}        # Question bank (6 types, LaTeX, figures, 4D taxonomy)
quizzes/{quizId}              # Quiz configurations
quizAttempts/{attemptId}      # Student quiz submissions
taxonomy/{nodeId}             # Hierarchical taxonomy tree
centers/{centerId}            # Branch/location management
batches/{batchId}             # Student groups per course
questionPapers/{paperId}      # Generated question papers
tests/{testId}                # Scheduled test lifecycle
evaluations/{evalId}          # AI-evaluated answer sheets
gradeChallenges/{challengeId} # Student grade disputes
announcements/{announcementId}# Targeted notice board
studyMaterials/{materialId}   # Organized content library
notifications/{notifId}       # In-app notification center
gamification/{studentId}      # Streaks, XP, badges
```

### New Cloud Functions (Planned)

```
functions/src/flows/
├── extractor.ts              # AI PDF → Questions (ported from TutorOS)
├── curator.ts                # NL → Quiz Filters (ported from TutorOS)
├── validator.ts              # AI Quality Check + Confidence Score
├── enhancer.ts               # Rephrase, Adjust Difficulty, Explain, Similar
├── paper-generator.ts        # AI Question Paper Generation (Acadine-style)
├── evaluator.ts              # AI Answer Sheet Evaluation (Vision AI)
├── predictive-performance.ts # Predict exam scores from historical data
└── assignment-feedback.ts    # AI per-line assignment feedback
```

### Key Architecture Decisions

- **Question Bank Scope:** Per-tenant (not shared, unlike TutorOS)
- **AI Trust:** All AI outputs include `confidenceScore`; scores < 85% routed to Teacher Review Queue (HITL)
- **Offline Strategy:** PWA with Service Worker + IndexedDB for quiz offline sync
- **PDF Generation:** Server-side Puppeteer (Cloud Function), not client-side
- **LaTeX:** KaTeX with accessible MathML output for WCAG compliance
- **Bundle Optimization:** All heavy components (quiz player, charts, paper editor) loaded via `next/dynamic`

### Known Risks & Mitigations

| Risk                                              | Mitigation                                            |
| ------------------------------------------------- | ----------------------------------------------------- |
| Genkit 1.20→1.28 upgrade may break existing flows | Refactor before porting (PREREQ-2)                    |
| No Firebase Storage rules                         | Create `storage.rules` (PREREQ-3)                     |
| Firestore catch-all wildcard too permissive       | Replace with explicit per-collection rules (PREREQ-6) |
| `services.ts` monolith (923 lines)                | Split into domain modules (PREREQ-5)                  |
| Exam-day concurrency spike                        | IndexedDB offline sync + debounced writes             |
| AI hallucination in evaluation                    | Confidence scoring + HITL review queue                |

## Implementation History: March 2026 Merge & Polish

- **Phase 1 (Discovery & Stabilization)**: Fixed 11 structural layout and next/link hydration errors across the new App Router structure to establish a stable deployment baseline.
- **Phase 2 (Missing ChronoClass Features)**: Validated the App Router porting of multi-tenant workflows (Admin/Teacher/Student). Successfully mapped TutorOS Databank management and AI extraction workflows to the new structure.
- **Phase 3 (Immersive Web Overhaul)**: Implemented premium SaaS UI with functional interactive elements (Framer Motion/Native CSS) on public landing pages and the LMS dashboard, establishing a "Brilliant.org/Duolingo" aesthetic.
- **Phase 5 (Acadine Parity - Sprints 2 & 3)**: Secured tenant-isolated data models (`centers`, `batches`) via complete `firestore.rules` RBAC refactoring. Confirmed full merge of UI for Centers/Batches, AI Question Paper Wizard, and Gemini Vision Answer Sheet Evaluator (HITL and Grade Challenge queues).

---

> _This file is the source of truth for all AI agents. Keep it updated with every major architectural change._
