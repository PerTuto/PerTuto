# Sprint 2 — Institute Management + AI Question Papers

> **Duration:** Week 3–4 (~10 working days)
> **Goal:** Build center/branch management, batch system, and AI question paper generation.
> **Depends on:** Sprint 1 (question bank must exist for paper generation)
> **Blocks:** Sprint 3 (tests use question papers + batches)

---

## 2.1 Data Model Extension

### New Types in `src/lib/types.ts`

```ts
// --- Center/Branch ---
interface Center {
  id: string;
  name: string;
  address: string;
  city: string;
  contactEmail?: string;
  contactPhone?: string;
  status: "active" | "inactive";
  createdAt: Timestamp;
}

// --- Batch (Student Group) ---
interface Batch {
  id: string;
  name: string; // e.g., "IB Math HL — Batch A"
  courseId: string;
  centerId?: string; // Optional if no physical center
  teacherIds: string[];
  studentIds: string[];
  status: "active" | "archived";
  schedule?: {
    dayOfWeek: number; // 0-6
    startTime: string; // "14:00"
    durationMins: number;
  }[];
  createdAt: Timestamp;
}

// --- Question Paper ---
interface QuestionPaper {
  id: string;
  title: string;
  courseId: string;
  subjectId: string;
  sections: PaperSection[];
  totalMarks: number;
  duration: number; // Minutes
  instructions?: string;
  status: "draft" | "approved" | "archived";
  generationMode: "auto" | "manual" | "ai-assisted";
  syllabus: {
    chapters: { id: string; name: string; weightage: number }[];
  };
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface PaperSection {
  title: string; // e.g., "Section A — MCQ"
  instructions?: string;
  questions: { questionId: string; marks: number; order: number }[];
  totalMarks: number;
}

// --- Syllabus Config ---
interface SyllabusConfig {
  id: string;
  courseId: string;
  curriculum: string; // "IB", "CBSE", etc.
  chapters: {
    id: string;
    name: string;
    weightage: number; // Percentage
    topics: { id: string; name: string; weightage: number }[];
  }[];
  createdBy: string;
  updatedAt: Timestamp;
}
```

### Firestore Collections

All under `tenants/{tenantId}/`:

- `centers/{centerId}`
- `batches/{batchId}`
- `questionPapers/{paperId}`
- `syllabusConfig/{configId}`

### New Service Files

- `src/lib/firebase/services/centers.ts`
- `src/lib/firebase/services/batches.ts`
- `src/lib/firebase/services/question-papers.ts`
- `src/lib/firebase/services/syllabus.ts`

---

## 2.2 Center/Branch Management

### UI Pages

| Route                             | Purpose            | Access |
| --------------------------------- | ------------------ | ------ |
| `/dashboard/organization/centers` | Center list + CRUD | Admin  |

### Center List Page

- Table: Name, City, Contact, Status, # Batches, Actions
- Add/Edit dialog: Name, Address, City, Contact Email, Phone
- Delete with confirmation (warn if batches attached)
- Filter by status (active/inactive)

---

## 2.3 Batch System

### UI Pages

| Route                     | Purpose                           | Access         |
| ------------------------- | --------------------------------- | -------------- |
| `/dashboard/batches`      | Batch list + CRUD                 | Admin          |
| `/dashboard/batches/[id]` | Batch detail (students, schedule) | Admin, Teacher |

### Batch List Page

- Table: Name, Course, Center, Teacher(s), # Students, Status, Actions
- Create dialog: pick course → pick center (optional) → assign teachers → assign students
- Batch-level operations: Send announcement, Assign quiz, Schedule test

### Batch Detail

- Student list with add/remove
- Teacher list with add/remove
- Schedule grid
- Link to associated course

### Integration Points

- Update student enrollment to support batch-based grouping
- Classes can optionally link to a batch
- Quizzes can be assigned to batches (not just individual students)

---

## 2.4 AI Question Paper Generation

### New Cloud Function: `paper-generator.ts`

```ts
// functions/src/flows/paper-generator.ts
const paperGeneratorFlow = ai.defineFlow({
  name: "questionPaperGenerator",
  inputSchema: z.object({
    tenantId: z.string(),
    courseId: z.string(),
    subjectId: z.string(),
    chapters: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        weightage: z.number(), // Percentage
      }),
    ),
    questionTypes: z.array(
      z.object({
        type: z.enum([
          "MCQ_SINGLE",
          "MCQ_MULTI",
          "TRUE_FALSE",
          "FILL_IN_BLANK",
          "FREE_RESPONSE",
        ]),
        count: z.number(),
        marksEach: z.number(),
      }),
    ),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD", "MIXED"]),
    totalDuration: z.number(), // Minutes
    mode: z.enum(["auto", "ai-assisted"]),
  }),
  outputSchema: z.object({
    paper: PaperSchema,
    metadata: z.object({
      totalQuestions: z.number(),
      totalMarks: z.number(),
      chapterCoverage: z.record(z.number()),
      difficultyDistribution: z.record(z.number()),
    }),
  }),
});
```

### Two Generation Modes

1. **Auto Generate:** Complete balanced paper in one step
   - Queries question bank with filters (tenant, subject, chapter weightage, difficulty)
   - AI selects optimal question set respecting constraints
   - Returns complete paper

2. **Build with AI (Step-by-Step):**
   - Step 1: Select course + subject
   - Step 2: Configure syllabus weightage (slider per chapter)
   - Step 3: Configure question types + marks
   - Step 4: AI generates → user reviews → swap/replace questions
   - Step 5: Finalize + save

### UI Pages

| Route                                 | Purpose                      | Access         |
| ------------------------------------- | ---------------------------- | -------------- |
| `/dashboard/question-papers`          | Paper list                   | Admin, Teacher |
| `/dashboard/question-papers/generate` | Multi-step generation wizard | Admin, Teacher |
| `/dashboard/question-papers/[id]`     | Paper editor + preview       | Admin, Teacher |

### Paper Editor

- Drag-drop reorder questions within sections
- Replace individual questions (search from bank)
- Add/remove sections
- Print-ready preview (clean layout, question numbers, marks)
- PDF export via Cloud Function (Puppeteer)

### PDF Export Cloud Function

```ts
// functions/src/flows/paper-pdf-export.ts
// Takes paperId → renders HTML template with KaTeX → Puppeteer generates PDF → uploads to Storage → returns URL
```

---

## 2.5 Syllabus Weightage Management

### Enhancement to Existing Curriculum Pages

- Add per-chapter weightage sliders (percentage, must sum to 100%)
- Save as `syllabusConfig` document
- Used by question paper generator as input

---

## 2.6 Firestore Indexes

Add to `firestore.indexes.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "questions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "taxonomy.domainId", "order": "ASCENDING" },
        { "fieldPath": "difficulty", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "batches",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "courseId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" }
      ]
    }
  ]
}
```

Deploy: `firebase deploy --only firestore:indexes --project pertutoclasses`

---

## 2.7 Verification Checklist

- [ ] Create center → verify appears in list
- [ ] Create batch → assign students + teacher → verify linkage
- [ ] Configure syllabus weightage for a course
- [ ] Auto-generate question paper → verify chapter distribution matches weightage
- [ ] Build with AI → swap questions → save → preview
- [ ] Export paper as PDF → verify LaTeX renders, marks are correct
- [ ] `npm run build` — zero errors
- [ ] `cd functions && npm run build` — paper generator compiles

### Estimated Effort: ~35–50 hours | Risk: 🟡 Medium
