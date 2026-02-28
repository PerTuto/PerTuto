# Sprint 5 — Analytics Engine

> **Duration:** Week 9–10 (~10 working days)
> **Goal:** Multi-level analytics with predictive AI — student, batch, center, and subject-level insights.
> **Depends on:** Sprint 1-3 (needs quiz attempts, test evaluations, attendance data)
> **This is what makes PerTuto a data-driven platform, not just a management tool.**

---

## 5.1 Analytics Architecture

### Data Sources

Analytics aggregate data from existing collections:

- `quizAttempts` → Student quiz performance
- `evaluations` → Test scores + per-question analysis
- `attendance` → Attendance rates
- `questions` → Question bank stats (by domain, difficulty)
- `students` → Enrollment, progress
- `batches` → Group comparisons

### Service Layer

- `src/lib/firebase/services/analytics.ts` — Aggregation queries (client-side, using `getCountFromServer` and batch reads)
- For expensive aggregations: Cloud Function with cached results in `tenants/{tenantId}/analyticsCache/{key}`

---

## 5.2 AI Predictive Performance

### New Cloud Function: `predictive-performance.ts`

```ts
// functions/src/flows/predictive-performance.ts
const predictivePerformanceFlow = ai.defineFlow({
  name: 'predictivePerformance',
  inputSchema: z.object({
    tenantId: z.string(),
    studentId: z.string(),
  }),
  outputSchema: z.object({
    predictedScoreRange: z.object({
      low: z.number(),
      mid: z.number(),
      high: z.number(),
    }),
    confidence: z.number(),
    factors: z.array(z.object({
      factor: z.string(),               // e.g., "Attendance rate"
      impact: z.enum(['positive', 'negative', 'neutral']),
      detail: z.string(),
    })),
    recommendations: z.string[],        // e.g., "Focus on Chapter 5 derivatives"
    weakTopics: z.array(z.object({
      topicId: z.string(),
      topicName: z.string(),
      avgScore: z.number(),
    })),
  }),
});

// Pipeline:
// 1. Fetch student's historical quiz attempts + test evaluations
// 2. Fetch attendance records
// 3. Feed to Gemini: "Given this student's performance history, predict..."
// 4. Return structured prediction with confidence + recommendations
```

---

## 5.3 Analytics Dashboard

### UI: `/dashboard/analytics`

Tabbed layout with 5 views:

### Tab 1: Overview

- Key metric cards (4 across):
  - Total Active Students
  - Average Test Score (%)
  - Test Participation Rate (%)
  - Average Attendance Rate (%)
- Trend sparklines per card (last 30 days)
- Quick links to other tabs

### Tab 2: Student Analytics

- Student picker (dropdown/search)
- **Test Scores Over Time:** Line chart (x: tests, y: score %)
- **Subject Radar Chart:** Radar/spider chart showing performance across subjects
- **Weak Topics Heatmap:** Table with red-yellow-green cells per topic
- **Predicted Exam Performance:** AI prediction card (score range + confidence + recommendations)
- **Attendance Trend:** Bar chart (monthly)

### Tab 3: Batch Analytics

- Batch picker
- **Batch Average vs Target:** Bar chart
- **Student Distribution:** Box plot or histogram of scores
- **Batch-vs-Batch Comparison:** Side-by-side bar chart (select 2-3 batches)
- **Retention Metrics:** Students remaining vs dropped
- **Participation Rate:** % of students who took each test

### Tab 4: Center Analytics (if multi-center)

- Center picker
- **Center Comparison:** avg scores, attendance, enrollment across centers
- **Top Performing Centers:** Ranked list
- **Center Growth:** New enrollments over time

### Tab 5: Subject/Topic Analytics

- Subject picker
- **Chapter-Level Mastery:** Horizontal bar chart (% mastery per chapter)
- **Question-Type Analysis:** Which question types students struggle with most
- **Difficulty Distribution:** How students perform at Easy/Medium/Hard/Olympiad
- **Topic-Specific Weakness Map:** Heatmap highlighting weak subtopics

### Charting Library

- Use `recharts` (already in dependencies)
- All chart components loaded via `next/dynamic` to minimize bundle impact

---

## 5.4 Firestore Indexes for Analytics

Add to `firestore.indexes.json`:

```json
{
  "collectionGroup": "quizAttempts",
  "fields": [
    { "fieldPath": "studentId", "order": "ASCENDING" },
    { "fieldPath": "completedAt", "order": "DESCENDING" }
  ]
},
{
  "collectionGroup": "evaluations",
  "fields": [
    { "fieldPath": "studentId", "order": "ASCENDING" },
    { "fieldPath": "testId", "order": "ASCENDING" }
  ]
}
```

---

## 5.5 Verification Checklist

- [ ] Overview tab shows correct aggregate numbers
- [ ] Student tab: select student → see test score trend, radar chart, weak topics
- [ ] Batch tab: compare 2 batches → side-by-side charts render correctly
- [ ] Subject tab: chapter mastery heatmap populated with real data
- [ ] AI prediction: call predictive performance → get score range + recommendations
- [ ] Charts load lazily (not in initial bundle)
- [ ] `npm run build` — verify bundle size < 500KB first-load JS for public pages
- [ ] Empty state: analytics tabs show helpful "No data yet" messages when no tests exist

### Estimated Effort: ~30–40 hours | Risk: 🟡 Medium (data aggregation performance)
