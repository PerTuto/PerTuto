# Sprint 6 — Gamification + Self-Serve Practice

> **Duration:** Week 11–12 (~10 working days)
> **Goal:** Transform PerTuto from a utility into a habit. Streaks, XP, badges, leaderboards, practice mode, and AI assignment feedback.
> **Depends on:** Sprint 1 (quizzes), Sprint 3 (evaluations), Sprint 5 (analytics)
> **This is the Duolingo/Brilliant layer that no competitor has.**

---

## 6.1 Data Model Extension

### New Types in `src/lib/types.ts`

```ts
// --- Gamification ---
interface StudentGamification {
  id: string; // Same as studentId
  studentId: string;
  xp: number; // Total experience points
  level: number; // Derived from XP thresholds
  currentStreak: number; // Days in a row
  longestStreak: number;
  lastActiveDate: string; // ISO date "2026-03-15"
  badges: Badge[];
  weeklyXp: number; // Resets every Monday
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji or icon name
  earnedAt: Timestamp;
}

interface LeaderboardEntry {
  studentId: string;
  studentName: string;
  avatar?: string;
  xp: number;
  streak: number;
  rank: number;
  badges: number; // Total badge count
}
```

### Firestore Collections

- `tenants/{tenantId}/gamification/{studentId}` — One doc per student

### Service File

- `src/lib/firebase/services/gamification.ts`

---

## 6.2 XP System

### XP Awards

| Action                          | XP              | Condition            |
| ------------------------------- | --------------- | -------------------- |
| Complete a quiz                 | 50              | Base                 |
| Perfect score on quiz           | +100 bonus      | 100% correct         |
| Submit assignment on time       | 30              | Before deadline      |
| Daily login (streak)            | 10 × streak day | Capped at 70 (7-day) |
| First quiz of the week          | 25 bonus        | Weekly reset         |
| Practice quiz completion        | 20              | Self-serve practice  |
| Review a question (contributor) | 15              | Teacher approves     |

### Level Thresholds

| Level | XP Required | Title    |
| ----- | ----------- | -------- |
| 1     | 0           | Beginner |
| 2     | 100         | Learner  |
| 3     | 300         | Explorer |
| 4     | 600         | Scholar  |
| 5     | 1000        | Expert   |
| 6     | 1500        | Master   |
| 7     | 2500        | Legend   |

### Streak Logic

- Streak increments when student completes any activity (quiz, assignment, practice) on a new calendar day
- If a day is skipped: `currentStreak` resets to 0 (update `longestStreak` if applicable)
- Check on each activity completion: compare `lastActiveDate` vs today

---

## 6.3 Badge System

### Badge Definitions

| Badge                   | Trigger                       | Icon |
| ----------------------- | ----------------------------- | ---- |
| 🎯 First Quiz           | Complete first quiz ever      | 🎯   |
| 🔥 7-Day Streak         | currentStreak reaches 7       | 🔥   |
| 💎 Perfect Score        | Any quiz with 100%            | 💎   |
| 📚 Question Contributor | Submit 10+ approved questions | 📚   |
| 🏆 Top of Class         | #1 on batch leaderboard       | 🏆   |
| 🧠 Practice Pro         | Complete 20 practice quizzes  | 🧠   |
| ⭐ Consistent           | 30-day streak                 | ⭐   |
| 🎓 Level 5              | Reach Expert level            | 🎓   |

### Badge Award Logic

- After each XP-granting action, check badge conditions
- If earned: push to `badges[]` array, show celebration toast

---

## 6.4 Gamification UI

### Student Dashboard Enhancement

- **XP + Level bar** in dashboard header: `[🔥 12 day streak] [Level 4: Scholar] [1,247 XP]`
- Level progress bar (current XP / next level threshold)
- Streak flame icon (grows brighter with longer streaks)

### Leaderboard Component

- `/dashboard/leaderboard` or dashboard widget
- Table: Rank, Avatar, Name, XP, Streak, Badges
- Toggle: Batch / Course / Tenant-wide
- Current user highlighted
- Top 3 get gold/silver/bronze

### Badge Showcase

- Grid of all possible badges (earned = colored, unearned = grayed out)
- Hover: description + how to earn
- Click: detailed badge page (who else earned it, when)

### Celebration Animations

- On badge earned: confetti burst + toast notification
- On streak milestone (7, 30): flame animation
- On level up: level-up modal with new title

---

## 6.5 Self-Serve Practice Mode

### UI: `/dashboard/practice`

1. **Subject/Topic Picker:** Student selects subject → topic (optional: subtopic)
2. **AI-Generated Practice Quiz:**
   - Calls `quizCurator` flow with filters emphasizing weak topics (from Sprint 5 analytics)
   - Generates 5-10 question practice set
   - Student takes quiz in quiz player
3. **Results + Feedback:**
   - Immediate feedback per question (correct/incorrect + explanation)
   - XP awarded on completion
   - Practice results tracked separately for analytics
4. **"Practice Again" button:** new quiz on same topic, different questions
5. **Weak Topic Suggestions:** "Based on your performance, try practicing: [Derivatives] [Integration]"

### Practice vs Formal Quiz Distinction

- Practice quizzes have `isPractice: true` flag in `QuizAttempt`
- Not counted toward official grades
- Counted toward XP, streaks, and analytics insights

---

## 6.6 AI Assignment Feedback

### New Cloud Function: `assignment-feedback.ts`

```ts
// functions/src/flows/assignment-feedback.ts
const assignmentFeedbackFlow = ai.defineFlow({
  name: 'assignmentFeedback',
  inputSchema: z.object({
    tenantId: z.string(),
    assignmentId: z.string(),
    studentId: z.string(),
    submissionText: z.string(),          // Or Storage URL for file
    rubric: z.string(),                  // Assignment rubric/criteria
  }),
  outputSchema: z.object({
    overallGrade: z.string(),            // e.g., "B+"
    overallFeedback: z.string(),
    sections: z.array(z.object({
      criterion: z.string(),
      score: z.number(),
      maxScore: z.number(),
      feedback: z.string(),
      suggestions: z.string[],
    })),
    strengths: z.string[],
    improvements: z.string[],
  }),
});
```

### Integration

- Add "Get AI Feedback" button on assignment submission view
- Teacher can see AI feedback alongside their own grading
- Teacher can accept, modify, or override AI suggestions
- Student sees feedback after teacher publishes

---

## 6.7 Verification Checklist

- [ ] Complete quiz → earn XP → see XP bar update
- [ ] Login daily for 7 days → earn 🔥 7-Day Streak badge
- [ ] Perfect score → earn 💎 badge + confetti animation
- [ ] Leaderboard shows correct ranking across batch
- [ ] Practice mode: select topic → take quiz → get feedback → "Practice Again" works
- [ ] Weak topic suggestions based on analytics data
- [ ] AI assignment feedback: submit → get per-criterion scores + suggestions
- [ ] Badge showcase shows earned + unearned correctly
- [ ] `npm run build` — zero errors
- [ ] `cd functions && npm run build` — assignment feedback compiles

### Estimated Effort: ~35–45 hours | Risk: 🟢 Low-Medium

---

## Post-Sprint 6: Full Regression

After all sprints complete:

- [ ] Full regression test of all 19+ existing features
- [ ] Deploy all functions: `cd functions && npm run deploy`
- [ ] Deploy Firestore rules + indexes + Storage rules
- [ ] Push to `master` → Firebase App Hosting auto-deploys
- [ ] Update `AGENTS.md` with new phases 20-25
- [ ] Bundle size audit: < 500KB first-load JS for public pages
