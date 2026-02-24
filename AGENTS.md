# PerTuto — AI Agent Project Context

> **One-file reference for any AI agent working on this codebase.**
> Last updated: 2026-02-25

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
│   │   │   ├── page.tsx           # Dashboard home (stats, upcoming classes)
│   │   │   ├── leads/             # CRM — Kanban board
│   │   │   ├── students/          # Student management table + [id] detail
│   │   │   ├── courses/           # Course cards with enrollment
│   │   │   ├── schedule/          # Weekly calendar + class dialog
│   │   │   ├── assignments/       # Assignment list
│   │   │   ├── attendance/        # Attendance tracking (stub)
│   │   │   ├── availability/      # Teacher availability grid
│   │   │   ├── organization/users/# Team/org user management
│   │   │   ├── settings/          # Settings (availability, calendar, team)
│   │   │   └── welcome/           # Onboarding page
│   │   ├── actions/               # Server Actions
│   │   │   ├── leads.ts           # Public lead submission (Admin SDK)
│   │   │   └── invite-actions.ts  # Team invite token CRUD
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
│   │   ├── tenant/                # Add user dialog, tenant components
│   │   ├── dashboard/             # Quick-add, stats, pending assignments
│   │   ├── layout/                # Sidebar nav, header
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
- **executive**: Sales/business development — access to leads and students
- **teacher**: Instructor — access to schedule, courses, students, assignments
- **parent/student**: Future roles (not yet implemented in UI)

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

1. Admin creates invite via `AddUserDialog` → writes to `invites/{token}` via `invite-actions.ts`
2. Invite link: `/join/{token}`
3. New user fills name/email/password → creates Firebase Auth account + user profile
4. Invite marked as used

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

- All `tenants/{tid}/*` collections require `request.auth != null`
- `users/{uid}` requires `request.auth.uid == uid`
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
- Dashboard: login, leads kanban (edit/delete/status), students table, courses CRUD, schedule calendar, assignments list, availability grid, settings, org users
- Team invite flow (`/join/[token]`)
- Input sanitization + rate limiting on public lead form
- Firestore security rules (auth-gated)

### Known Issues / TODOs 🟡

- **Attendance page**: Currently an AI facial recognition stub — needs rewrite to manual attendance
- **Sidebar nav**: `hasRole()` exists but only used for admin Users link — needs full role-based filtering
- **Sidebar org link bug**: Points to `/organization/users` instead of `/dashboard/organization/users`
- **Dashboard stats**: May not be wired to real Firestore data
- **Role-based access**: No page-level restrictions yet (any logged-in user sees everything)

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
