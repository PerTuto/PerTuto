# Sprint 4 — Communication + RTL + Data Export

> **Duration:** Week 7–8 (~10 working days)
> **Goal:** Announcements, study materials, notification system, RTL localization, and data portability.
> **Depends on:** Sprint 2 (batches, centers for targeted announcements)
> **Lighter sprint — mostly CRUD UI + localization audit.**

---

## 4.1 Data Model Extension

### New Types in `src/lib/types.ts`

```ts
// --- Announcements ---
interface Announcement {
  id: string;
  title: string;
  body: string; // Rich text / markdown
  targetType: "all" | "center" | "course" | "batch";
  targetIds: string[]; // IDs of target groups
  priority: "low" | "medium" | "high" | "urgent";
  attachments?: { name: string; url: string }[];
  createdBy: string;
  createdAt: Timestamp;
  expiresAt?: Timestamp;
}

// --- Study Materials ---
interface StudyMaterial {
  id: string;
  title: string;
  description?: string;
  subjectId: string;
  chapterId?: string;
  topicId?: string;
  fileUrl: string; // Firebase Storage URL
  fileType: "pdf" | "video" | "presentation" | "link" | "image";
  fileSize?: number; // Bytes
  courseIds: string[]; // Linked courses
  batchIds: string[]; // Linked batches
  uploadedBy: string;
  createdAt: Timestamp;
}

// --- Notifications ---
interface Notification {
  id: string;
  userId: string; // Recipient
  title: string;
  body: string;
  type: "announcement" | "test" | "grade" | "schedule" | "system";
  link?: string; // Dashboard route to navigate to
  read: boolean;
  createdAt: Timestamp;
}
```

### Firestore Collections

- `tenants/{tenantId}/announcements/{announcementId}`
- `tenants/{tenantId}/studyMaterials/{materialId}`
- `tenants/{tenantId}/notifications/{notifId}`

### New Service Files

- `src/lib/firebase/services/announcements.ts`
- `src/lib/firebase/services/study-materials.ts`
- `src/lib/firebase/services/notifications.ts`

---

## 4.2 Announcements / Notice Board

### UI Pages

| Route                      | Purpose                       | Access    |
| -------------------------- | ----------------------------- | --------- |
| `/dashboard/announcements` | Create + manage announcements | Admin     |
| Dashboard widget           | Announcement feed             | All roles |

### Create Announcement

- Title, body (rich text editor)
- Audience picker: All / specific center / course / batch (multi-select)
- Priority: Low / Medium / High / Urgent
- Optional: file attachments (upload to Storage)
- Optional: expiry date
- On create → automatically generates `Notification` docs for all targeted users

### Feed Widget

- Shows on student, parent, and teacher dashboards
- Sorted by priority (urgent first), then recency
- Mark as read
- Urgent: gold highlight with bell icon

---

## 4.3 Study Material Management

### UI Pages

| Route                        | Purpose           | Access         |
| ---------------------------- | ----------------- | -------------- |
| `/dashboard/study-materials` | Upload + organize | Admin, Teacher |
| Student view in dashboard    | Browse + download | Student        |

### Material Upload

- Drag-drop file upload to Firebase Storage
- Metadata form: title, subject, chapter, topic, linked courses/batches
- File types: PDF, video link, presentation, image

### Organization

- Tree view: Subject → Chapter → Topic
- Filter by course, batch, file type
- Search by title

### Student View

- Browse materials linked to enrolled courses
- Download button
- PWA: cached for offline access (Service Worker)

---

## 4.4 Notification System (Foundation)

### Notification Bell

- Bell icon in dashboard header
- Unread count badge (red circle with number)
- Click → dropdown/popover with recent notifications
- "Mark all as read" button
- Each notification: icon by type, title, body, time ago, click → navigate to `link`

### Auto-Generated Notifications

Notifications are created automatically by other features:

| Trigger                  | Notification                             | Recipient          |
| ------------------------ | ---------------------------------------- | ------------------ |
| New announcement         | "New: {title}"                           | All targeted users |
| Test scheduled           | "Test scheduled: {title}"                | Batch students     |
| Evaluation published     | "Your results for {test} are ready"      | Student            |
| Grade challenge resolved | "Your grade challenge has been resolved" | Student            |
| Assignment due soon      | "Assignment due tomorrow: {title}"       | Student            |

### Implementation

- Cloud Function trigger: `onAnnouncementCreate` → fan-out `Notification` docs to each targeted user
- Real-time listener on client: `onSnapshot` for `notifications` collection where `userId` = current user

---

## 4.5 RTL & Localization

### Audit Scope

- All Tailwind directional classes → logical properties:
  - `pl-*` → `ps-*`, `pr-*` → `pe-*`
  - `ml-*` → `ms-*`, `mr-*` → `me-*`
  - `left-*` → `start-*`, `right-*` → `end-*`
  - `text-left` → `text-start`, `text-right` → `text-end`
- Add `dir="auto"` support to root layout (`src/app/layout.tsx`)
- Test with `dir="rtl"` on entire dashboard

### Verification

```bash
# Find all directional Tailwind classes
grep -rn "pl-\|pr-\|ml-\|mr-\|left-\|right-\|text-left\|text-right" src/ --include="*.tsx" --include="*.ts"
```

---

## 4.6 Data Portability (1-Click Export)

### UI

- Button in `/dashboard/organization/settings`: "Export All Data"
- Shows dialog: "This will download all your organization's data as a ZIP file."
- Format selection: JSON (complete) or CSV (flat tables)

### Cloud Function: `tenantDataExporter`

```ts
// Input: { tenantId, format: 'json' | 'csv' }
// Process:
//   1. Query all collections under tenants/{tenantId}/
//   2. For JSON: one .json file per collection
//   3. For CSV: flatten students, invoices, payments into .csv
//   4. ZIP all files
//   5. Upload to Storage → return download URL
// Output: { downloadUrl, expiresAt }
```

Collections to export: students, courses, classes, assignments, attendance, invoices, ledger, leads, questions, quizzes, quizAttempts, evaluations, tests

---

## 4.7 Enhanced Lecture Scheduling

### Changes

- Add `batchId?` and `meetingLink?` fields to existing `Class` type
- When creating a class for a batch, auto-generate notification for all batch students
- Meeting link field (Google Meet / Zoom URL) shown in class detail

---

## 4.8 Verification Checklist

- [ ] Create announcement targeting a batch → all batch students see notification
- [ ] Notification bell shows unread count → click → mark read
- [ ] Upload study material → student downloads → works offline (PWA)
- [ ] Export tenant data as JSON → verify all collections present
- [ ] Export as CSV → open in Excel → data is correct
- [ ] Toggle `dir="rtl"` → no layout breaks in dashboard
- [ ] `npm run build` — zero errors

### Estimated Effort: ~30–40 hours | Risk: 🟢 Low-Medium
