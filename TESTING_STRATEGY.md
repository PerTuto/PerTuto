# Autonomous Agent QA Runbook: PerTuto Super-App

**TARGET AUDIENCE: AI QA Agent**
This document is specifically formatted for an autonomous AI agent to execute while unsupervised.

## 🤖 Directives for the Testing Agent

1. **OBSERVE AND REPORT ONLY:** You are strictly forbidden from altering application code, debugging deployment errors, or modifying security rules. Your sole purpose is to execute the steps below and record observations.
2. **EVIDENCE IS REQUIRED:** For every failure, you must capture a screenshot or DOM snippet to prove the failure state.
3. **SEQUENCE MATTERS:** Execute Test Suites in order. If Suite 1 (Auth) fails, Suite 2 is inherently blocked. Mark subsequent tests as `BLOCK`.
4. **FINAL OUTPUT:** Upon completion, generate a `QA_REPORT.md` file summarizing all `PASS`, `FAIL`, and `BLOCK` statuses exactly as formatted in Section 6.

---

## 0. Prerequisites (Execution Setup)

**Production URL:** `https://pertuto.com`

**Seed Credentials:**
| Role | Email | Password | Tenant ID |
| :------------------ | :----------------------- | :------------ | :---------------- |
| **Super Admin** | `super@pertuto.com` | `password` | N/A |
| **Tenant Admin** | `admin@demoschool.com` | `password123` | `test-tenant-001` |
| **Teacher** | `teacher@demoschool.com` | `password123` | `test-tenant-001` |
| **Student (Alice)** | `alice@demoschool.com` | `password123` | `test-tenant-001` |

_Note: Student Auth accounts may not be automatically seeded by the script and might require manual creation in Firebase Auth for end-to-end student testing. If student login fails, mark student-related tests as `BLOCK`._

---

## Test Suite 1: Production Load & Visuals

**Test 1.1: Load Homepage**

- **Action:** Navigate to `https://pertuto.com`.
- **Expected:** Page loads with HTTP 200.
- **Status:** [ ] PASS / [ ] FAIL / [ ] BLOCK

**Test 1.2: Visual Verification**

- **Action:** Wait for network idle. Look for the animated hero section or Neural Pathway background.
- **Expected:** Premium UI elements are visible.
- **Status:** [ ] PASS / [ ] FAIL / [ ] BLOCK

**Test 1.3: Console Hydration Check**

- **Action:** Open browser console.
- **Expected:** No Next.js React hydration mismatch errors.
- **Status:** [ ] PASS / [ ] FAIL / [ ] BLOCK

---

## Test Suite 2: Core Authentication & RBAC

**Test 2.1: Load Login Page**

- **Action:** Navigate to `https://pertuto.com/login`.
- **Expected:** Login form renders.
- **Status:** [ ] PASS / [ ] FAIL / [ ] BLOCK

**Test 2.2: Super Admin Login Execution**

- **Action:** Input `super@pertuto.com` and `password`. Submit.
- **Expected:** Form submits without network errors.
- **Status:** [ ] PASS / [ ] FAIL / [ ] BLOCK

**Test 2.3: Super Admin Dashboard Redirect**

- **Action:** Wait for redirect.
- **Expected:** URL changes to `/dashboard` (or global admin view) and UI renders.
- **Status:** [ ] PASS / [ ] FAIL / [ ] BLOCK

**Test 2.4: Log Out (Super Admin)**

- **Action:** Click Log Out.
- **Expected:** Redirected back to `/login` or `/`.
- **Status:** [ ] PASS / [ ] FAIL / [ ] BLOCK

**Test 2.5: Teacher Login Execution**

- **Action:** Log in with `teacher@demoschool.com` and `password123`.
- **Expected:** Redirected to Tenant dashboard.
- **Status:** [ ] PASS / [ ] FAIL / [ ] BLOCK

**Test 2.6: RBAC Isolation Check**

- **Action:** Attempt to manually navigate to `/dashboard/test-tenant-001/organization/centers`.
- **Expected:** Explicit "Unauthorized" boundary or redirect away from the Centers page. Data table must NOT load.
- **Status:** [ ] PASS / [ ] FAIL / [ ] BLOCK

---

## Test Suite 3: AI Feature Parity (Genkit)

**Test 3.1: Navigate to Question Paper Wizard**

- **Action:** (Logged in as Teacher) Navigate to `/dashboard/test-tenant-001/question-papers/generate`.
- **Expected:** Generation UI loads.
- **Status:** [ ] PASS / [ ] FAIL / [ ] BLOCK

**Test 3.2: Configure & Trigger Generation**

- **Action:** Fill constraints (e.g., 10 MCQs) and submit.
- **Expected:** UI enters a loading state. Backend is called.
- **Status:** [ ] PASS / [ ] FAIL / [ ] BLOCK

**Test 3.3: Verify Generation Result**

- **Action:** Wait for generation.
- **Expected:** Genkit `paperGeneratorFlow` succeeds (no 500 error) and transitions to Review step.
- **Status:** [ ] PASS / [ ] FAIL / [ ] BLOCK

**Test 3.4: Load HITL Evaluation Queue**

- **Action:** Navigate to `/dashboard/test-tenant-001/review-evaluations`.
- **Expected:** Queue loads successfully (zero-state or list). No crashes.
- **Status:** [ ] PASS / [ ] FAIL / [ ] BLOCK

---

## Test Suite 4: Domain Access Smoke Test

_Action:_ (Logged in as `admin@demoschool.com`). Click through these routes. _Expected:_ Pages load without `permission-denied` errors in console.

**Test 4.1: Admin Core (Centers)**

- **Status:** [ ] PASS / [ ] FAIL / [ ] BLOCK

**Test 4.2: Admin Core (Batches)**

- **Status:** [ ] PASS / [ ] FAIL / [ ] BLOCK

**Test 4.3: LMS Core (Students)**

- **Status:** [ ] PASS / [ ] FAIL / [ ] BLOCK

**Test 4.4: Assessment (Questions)**

- **Status:** [ ] PASS / [ ] FAIL / [ ] BLOCK

**Test 4.5: Operations (Attendance)**

- **Status:** [ ] PASS / [ ] FAIL / [ ] BLOCK

---

## Test Suite 5: Data Edge Cases

**Test 5.1: Verify Math Rendering**

- **Action:** Inspect a math question in the UI (e.g., `/dashboard/test-tenant-001/questions`).
- **Expected:** `react-katex` or similar renders formatted math, not raw `$` strings.
- **Status:** [ ] PASS / [ ] FAIL / [ ] BLOCK

---

## 6. Official Reporting Format

Agent, generate your final `QA_REPORT.md` utilizing the exact Markdown format below.

```markdown
# QA Execution Report

**Execution Time:** [Insert Timestamp]
**Browser Environment:** [Insert Details]

## Summary Snapshot

- **Total Tests:** 8
- **PASS:** X
- **FAIL:** Y
- **BLOCK:** Z

## Detailed Findings

### [Test Name, e.g., Test 1.3: Teacher RBAC Isolation]

- **Status:** FAIL
- **Observation:** The Agent was able to navigate to `/organization/centers` and view the data table.
- **Console Errors:** None
- **Evidence:** `![Screenshot](relative/path/to/screenshot.png)`
```
