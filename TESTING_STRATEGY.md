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

## Test Suite 1: Immersive Web & Core Authentication

**Test 1.1: Visual Verification**

- **Action:** Navigate to `https://pertuto.com`. Wait for network idle.
- **Expected:** The landing page renders without Next.js React hydration errors in the browser console. Visually identify the GSAP/Framer Motion animated hero section or Neural Pathway background.
- **Status:** [ ] PASS / [ ] FAIL

**Test 1.2: Super Admin Login & Routing**

- **Action:** Navigate to `https://pertuto.com/login`. Input `super@pertuto.com` and `password`. Submit.
- **Expected:** Successful redirect to `/dashboard`. The URL does not contain a specific `[tenantId]` parameter initially, or redirects to a global admin view.
- **Status:** [ ] PASS / [ ] FAIL

**Test 1.3: Teacher RBAC Isolation**

- **Action:** Log out. Log in as `teacher@demoschool.com` (`password123`). Attempt to manually navigate to `/dashboard/test-tenant-001/organization/centers`.
- **Expected:** The UI either redirects the teacher away or explicitly shows an "Unauthorized" boundary. The "Centers" and "Batches" options must NOT be visible in the sidebar nav.
- **Status:** [ ] PASS / [ ] FAIL

---

## Test Suite 2: AI Feature Parity (Genkit & Gemini Vision)

**Test 2.1: Question Paper Generation Wizard**

- **Action:** While logged in as Teacher, navigate to `/dashboard/test-tenant-001/question-papers/generate`. Fill out the form constraints (e.g., 10 MCQs, Medium difficulty). Submit.
- **Expected:** The UI enters a loading state, calls the Firebase backend, and transitions to the Review step. Genkit `paperGeneratorFlow` does not return a 500 or 404 error.
- **Status:** [ ] PASS / [ ] FAIL / [ ] BLOCK

**Test 2.2: AI Evaluator HITL (Human-In-The-Loop) Queue**

- **Action:** Navigate to `/dashboard/test-tenant-001/review-evaluations`.
- **Expected:** The page loads without crashing and successfully queries the `evaluations` Firestore collection. If empty, it displays a zero-state UI correctly.
- **Status:** [ ] PASS / [ ] FAIL / [ ] BLOCK

---

## Test Suite 3: Domain Services Resilience (27 Modules)

We must ensure that navigating through the Admin architecture does not result in broken links or Firebase Permission Denied errors.

**Action:** Logged in as Admin (`admin@demoschool.com`), sequentially click through the following sidebar routes. Wait 3 seconds per route. Capture console logs for Firebase SDK errors.

- **Expected:** All routes load their respective React tables/components without throwing Firestore `permission-denied` uncaught exceptions.

_Mark PASS or FAIL for each module group:_

- **Admin Core** (Centers, Batches): [ ] PASS / [ ] FAIL
- **LMS Core** (Students, Teachers, Courses, Classes): [ ] PASS / [ ] FAIL
- **Assessment** (Questions, Quizzes, Tests): [ ] PASS / [ ] FAIL
- **Operations** (Attendance, Assignments, Announcements): [ ] PASS / [ ] FAIL

---

## Test Suite 4: Data Edge Cases

**Test 4.1: LaTeX Math Rendering**

- **Action:** Inspect the DOM on any Mathematics Question page within the Question Bank (`/dashboard/test-tenant-001/questions`). Look for elements parsed by `react-katex` or verify raw `$` symbols are converted to formatted math nodes.
- **Expected:** Math equations are visually formatted, not raw text strings.
- **Status:** [ ] PASS / [ ] FAIL

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
