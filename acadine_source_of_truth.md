# Acadine Platform — Master Source of Truth

> **Compiled on:** 2026-02-28
> **Source:** [docs.acadine.ai](https://docs.acadine.ai)
> **Purpose:** Absolute reference for PerTuto integration planning. No assumptions should be made outside of this documentation.

---

## Table of Contents

1. [Platform Overview](#1-platform-overview)
2. [Key Concepts](#2-key-concepts)
3. [User Roles & Permissions](#3-user-roles--permissions)
4. [Assessment & Evaluation](#4-assessment--evaluation)
5. [Content & Communication](#5-content--communication)
6. [Institute Management](#6-institute-management)
7. [User Management](#7-user-management)
8. [Analytics & Performance Tracking](#8-analytics--performance-tracking)
9. [Complete Sitemap & Documentation Status](#9-complete-sitemap--documentation-status)

---

## 1. Platform Overview

**Source:** https://docs.acadine.ai/getting-started/overview

### What is Acadine?

Acadine is an **AI-powered platform** that helps educational institutes run smarter. It automates and streamlines institute operations, from assessment creation to performance tracking.

**Tagline:** _"AI-powered platform that helps you run your institute smarter, not harder"_

### Platform Capabilities

The platform is organized into four major capability areas:

| Capability Area             | Description                                         |
| --------------------------- | --------------------------------------------------- |
| **Institute Management**    | Set up batches, courses, and centers                |
| **User Management**         | Onboard students, teachers, and admins              |
| **Assessment & Evaluation** | Generate question papers and evaluate answer sheets |
| **Content & Communication** | Share study materials and make announcements        |

### How It Works (Core Workflow)

1. **Setup Your Institute** — Create centers, courses, batches
2. **Manage Users** — Onboard students, teachers, admins
3. **Create & Schedule Assessments** — AI-powered question paper generation, schedule tests
4. **Evaluate & Share Results** — AI evaluates answer sheets within 24 hours, share results
5. **Analyze & Improve** — Multi-level analytics (student, batch, center, subject/topic)

### Value Proposition

- Reclaim **100+ hours every month** through automation
- Scale effortlessly by managing **multiple centers from one dashboard**
- Deliver faster results that turn parents into your marketing team
- Grow while others drown in operational chaos

---

## 2. Key Concepts

**Source:** https://docs.acadine.ai/getting-started/key-concepts

### Institute Structure

#### Center / Branch

A **Center** (also called **Branch**) is a physical location of your institute. Both terms are used interchangeably.

**Examples:**

- Delhi Center
- Mumbai Branch
- Bangalore HSR Layout Center

Multiple centers can be managed from a single Acadine dashboard.

#### Course / Target

A **Course** (also called **Target**) is an academic program offered by the institute.

**Examples:**

- JEE 2025
- NEET 2024
- Class 11 Commerce CBSE
- Class 10 ICSE
- CA Foundation
- UPSC Prelims 2025

Each course is aligned to specific exam boards and contains subjects, syllabus, and target examinations.

#### Batch

A **Batch** is a group of students enrolled in a specific course at a specific center. Think of it as a classroom or section.

**Examples:**

- JEE 2025 Morning Batch (Delhi Center)
- NEET 2024 Weekend Batch (Mumbai Branch)
- Class 11 Commerce Section A (Bangalore Center)

Batches help organize students, assign teachers, schedule lectures, and track performance.

### Curriculum & Content

#### Syllabus

The syllabus structure is hierarchical:

- **Subjects** → **Chapters** → **Topics** → **Subtopics**

Used to:

- Generate relevant question papers
- Ensure coverage of all topics
- Track performance at chapter/topic/subtopic levels

#### Exam Boards Supported

- CBSE (Central Board of Secondary Education)
- ICSE (Indian Certificate of Secondary Education)
- State Boards (Maharashtra, Karnataka, etc.)
- UPSC (Union Public Service Commission)
- Competitive exams (JEE, NEET)

#### Study Materials

Organized by:

- Subject
- Chapter
- Topic

### Users & Roles

| Role        | Key Capabilities                                                                                                                                                                 |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Admin**   | Manage all centers, courses, and batches; Onboard all user types; Access institute-wide analytics; Make announcements                                                            |
| **Teacher** | Generate question papers using AI; Schedule tests and lectures; Upload study materials; View student performance in assigned batches; Make announcements                         |
| **Student** | View lecture and test schedules; Access study materials; Submit assignments; View detailed evaluation feedback; Track personal performance over time; Challenge grades if needed |

### Assessment & Evaluation Concepts

#### Question Paper

- Created in **10 minutes** based on syllabus weightage
- Control question types, difficulty, and marks
- **Auto-aligned to exam board patterns**

#### Test vs Assignment

| Attribute               | Test                                                                 | Assignment                                              |
| ----------------------- | -------------------------------------------------------------------- | ------------------------------------------------------- |
| **Purpose**             | Formal assessment                                                    | Practice/homework                                       |
| **Answer Sheet Upload** | Admin uploads after test                                             | Students upload on their own                            |
| **Evaluation**          | **Auto-evaluated by AI within 24 hours**                             | NOT auto-evaluated by default (optional manual grading) |
| **Notifications**       | Scheduled with automatic student notifications                       | —                                                       |
| **Results**             | Detailed feedback provided; Results shared with students and parents | —                                                       |

#### Answer Sheet

- Teachers/admins scan and upload answer sheets
- AI evaluates within 24 hours
- Students receive detailed feedback
- Students can also upload on their own (for assignments)
- Optional manual grading by teachers

#### Rubric-based Evaluation

- Consistent grading across all students
- Step-wise marking for partial credit
- Detailed feedback for every question
- Aligned to official exam patterns

#### Grade Challenge

- Student submits challenge with reason
- System automatically reviews the evaluation
- Teachers can manually review if needed
- Updated grade is communicated to student

### Communication & Scheduling

#### Notice Board

Announcements can be targeted to:

- All students
- Specific centers
- Specific courses
- Specific batches

#### Lectures

- Schedule with date, time, and location/link
- Automatic notifications sent to students
- Students can view schedule on calendar
- Add meeting links for online lectures

#### Notifications

- **Primary:** Mobile app push notifications
- **Fallback:** Email (if mobile app not installed)
- Triggered by: Test schedules, lecture schedules, result announcements, new study material uploads, notice board announcements

---

## 3. User Roles & Permissions

### Admin Role

**Source:** https://docs.acadine.ai/getting-started/for-admin

#### Admin Dashboard Features

- Institute-wide analytics — Performance across all students, batches, and centers
- Quick actions — Create batches, onboard users, schedule lectures, make announcements
- Recent activity — Latest tests, uploads, and notifications
- User management — Access to all students, teachers, and admins

#### Initial Setup Workflow (Admin)

1. **Set Up Centers/Branches** → Onboard physical locations
2. **Create Courses/Targets** → Define academic programs with exam board alignment
3. **Onboard Teachers** → Add teachers and assign to batches/subjects
4. **Create Batches** → Group students by course and center, assign teachers
5. **Onboard Students** (3 methods):
   - Invite Link (students self-register)
   - Excel Bulk Upload
   - Single Student manual entry
6. **Add More Admins** (optional)

#### Admin Quick Reference

| Action                   | Description                         |
| ------------------------ | ----------------------------------- |
| Onboard Students         | Add individually or in bulk         |
| Onboard Teachers         | Add teachers to institute           |
| Create Batches           | Group students by center and course |
| Manage Centers & Courses | Add new centers as you expand       |
| Schedule Lectures        | Set up institute's timetable        |
| Upload Answer Sheets     | Scan and upload after tests         |
| Share Test Results       | Publish results to students         |
| View Analytics           | Track performance insights          |
| Make Announcements       | Communicate with students and staff |
| Manage Users             | Onboard or manage all accounts      |
| Manage Batches           | Add or remove students from batches |
| Onboard Admins           | Add additional admins               |

---

### Teacher Role

**Source:** https://docs.acadine.ai/getting-started/for-teacher

#### Teacher Dashboard Features

- Assigned batches — Quick access to students they teach
- Upcoming tests — Tests they've scheduled
- Recent activity — Latest uploads, test results, and student performance
- Quick actions — Create question papers, upload materials, view analytics
- Performance insights — Student and batch-level analytics

#### Core Teacher Workflows

##### A. Content Delivery

**Upload Study Materials:**

- Organized by Subject → Chapter → Topic

**Create Assignments:**

- Assignments are for practice/homework (not formal tests)
- Students upload answer sheets on their own
- NOT auto-evaluated by default (can manually grade)

##### B. Assessment Cycle

**Step 1: Generate Question Paper with AI**

- Configure syllabus weightage (chapters to cover)
- Question types (MCQ, short answer, long answer, numerical)
- Marks distribution
- Difficulty levels

**Step 2: Refine & Customize**

- Edit any question manually
- Replace questions from the question bank
- Add new questions
- Reorder questions
- Add new sections
- Adjust marks

**Step 3: Review & Approve**

- Preview the PDF format
- Check all questions, marks, and instructions
- Ensure syllabus coverage is correct

**Step 4: Schedule Test**

- Test date and time
- Duration
- Batches to include
- Instructions for students

##### C. Results & Analytics

(See Analytics section below)

---

### Student Role

**Source:** https://docs.acadine.ai/getting-started/for-student

#### Getting Access to Acadine (2 methods)

1. **Onboarded by Admin** — Confirmation email with login credentials, immediate access
2. **Sign Up via Invite Link** — Admin reviews and approves request, confirmation email once approved

#### Student Dashboard Features

**Active & Recent:**

- Assignments to complete
- Upcoming tests
- Recently taken tests
- Submitted assignments

**Upcoming Events:**

- Scheduled classes with date, time, location/link
- Push notifications before each lecture
- Test schedules with automatic reminders (mobile app + email)

**Performance Summary:**

- Total tests taken so far
- Current rank in batch
- Average score per test

#### What Students Can Do

| Feature               | Details                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Study Materials**   | Browse by Subject → Chapter → Topic; access via dashboard or mobile app                                            |
| **Calendar & Events** | Calendar view of all events; lecture details; test schedules; push + email notifications                           |
| **Assignments**       | View active assignments; complete offline; upload handwritten answer sheets; teacher may manually grade            |
| **Tests**             | Receive notifications; complete test on paper; admin uploads answer sheets; AI evaluates in 24h; detailed feedback |
| **View Results**      | Overall score/percentage; question-wise marks; detailed feedback per answer; correct answers + marking scheme      |
| **Challenge Grades**  | Submit challenge with reason; system auto-reviews; teacher manual review if needed; updated grade communicated     |
| **Notice Board**      | Institute-wide, batch-specific, course/center-specific announcements                                               |

---

## 4. Assessment & Evaluation

### Question Paper Generation

**Source:** https://docs.acadine.ai/question-papers/generate-question-paper

#### Two Generation Modes

1. **Auto Generate** — AI creates a complete, balanced question paper automatically based on configuration. Perfect for quick test creation.
2. **Build with AI** — Create paper step-by-step with full control while AI provides intelligent suggestions. Ideal for handpicking each question.

#### Generation Workflow (7 Steps)

1. Go to Question Papers Screen
2. Click Generate Question Paper Button
3. Choose Generation Mode (Auto Generate or Build with AI)
4. Configure Syllabus & Weightage
5. Configure Question Types & Marks
6. Configure Difficulty Level and Duration
7. Review Configuration & Generate

**After generation:**

- **Auto Generate Mode:** Real-time updates as AI creates the complete paper
- **Build with AI Mode:** Clean editor to build from scratch with AI suggestions

#### Post-Generation Actions

- Edit Question — Modify text, options, or answers
- Replace Question — Swap from question bank
- Add New Question — Insert custom questions
- Add New Section — Organize with new sections
- Reorder Questions — Change question sequence
- View PDF — Preview the question paper
- Download Question Paper — Download for printing
- Add Comments — Collaborate with notes
- Approve — Lock and approve for scheduling

### Configure Syllabus and Weightage

**Source:** https://docs.acadine.ai/question-papers/configure-syllabus-weightage

#### Two Configuration Methods

**Method 1: Manual Configuration**

1. Choose Course and Subject
2. Select Chapters, Topics, and Subtopics
   - Click checkboxes to select
   - Expand for hierarchy view
   - "Select All", "Expand All", "Clear All" shortcuts
3. Configure Weightage (Optional)
   - Configure for all chapters/topics
   - Configure partially (some chapters only)
   - Skip and let AI decide optimal distribution
   - Progress bar shows total weightage allocation

**Method 2: Import from Previous Question Paper**

1. Click Import Button
2. Select Question Paper
3. Edit if Needed (add/remove chapters, adjust percentages)

### Configure Question Types and Marks

**Source:** https://docs.acadine.ai/question-papers/configure-question-types-marks

#### Supported Question Types & Subtypes

| Question Type        | Subtypes                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------- |
| **Multiple Choice**  | Direct Conceptual, Statement Analysis/Assertion Reason, Scenario Based, Matching/Sequencing |
| **Short Answer**     | Direct Conceptual, Compare/Differentiate, Scenario Based, Numerical                         |
| **Long Answer**      | Direct Conceptual, Compare/Differentiate, Scenario Based, Numerical                         |
| **Very Long Answer** | Direct Conceptual, Compare/Differentiate, Scenario Based, Numerical                         |

#### Configuration

- **Question Count:** Total number of questions per subtype
- **Marks/Question:** Marks allocated per question
- Can import from previous question paper and edit

---

## 5. Content & Communication

### Study Materials

**Status: Coming Soon** (detailed how-to docs not yet available)

Available operations (from sidebar):

- Upload Study Material
- Delete Study Material
- Update Study Material

Materials organized by: Subject → Chapter → Topic
Formats supported: Videos, PDFs, presentations, and other learning resources

### Lectures

**Status: Coming Soon** (detailed how-to docs not yet available)

Available operations:

- Schedule Lecture
- Reschedule Lecture

Features: Date, time, location/link; automatic student notifications; calendar view; meeting links for online lectures

### Notice Board

**Status: Coming Soon** (detailed how-to docs not yet available)

Available operations:

- Make Announcement
- Edit Announcement
- Remove Announcement

Targeting: All students, specific centers, specific courses, specific batches

---

## 6. Institute Management

### Batches

**Status: Coming Soon** (detailed how-to docs not yet available)

Available operations:

- Create Batch
- Add Students to Batch
- Edit Batch Details
- Inactivate Batch
- Delete Batch

### Courses/Targets

**Status: Coming Soon** (detailed how-to docs not yet available)

Available operations:

- Create Course
- Add Subjects
- Remove Subjects
- Edit Syllabus
- Onboard Own Syllabus

### Centres/Branches

**Status: Coming Soon** (detailed how-to docs not yet available)

Available operations:

- Onboard Centre
- Edit Centre Details
- Delete Centre

---

## 7. User Management

### Students

**Status: Coming Soon** (detailed how-to docs not yet available)

Available operations:

- Onboard Single Student
- Onboard Students via Invite Link
- Onboard Students via Excel (bulk import)
- Move Student to Batch
- Inactivate Student Account
- Delete Student Account

### Teachers

**Status: Coming Soon** (detailed how-to docs not yet available)

Available operations:

- Onboard Teachers
- Inactivate Teacher Account
- Delete Teacher Account

### Admins

**Status: Coming Soon** (detailed how-to docs not yet available)

Available operations:

- Onboard Admins
- Inactivate Admin Account
- Delete Admin Account

---

## 8. Analytics & Performance Tracking

### Student-Level Analytics

- Test scores over time
- Subject-wise performance
- Weak topics and chapters
- Predicted exam performance
- Detailed answer-level feedback

### Batch-Level Analytics

- Average batch performance
- Batch-wise test results
- Comparison across multiple batches
- Attendance and engagement trends

### Center-Level Analytics

- Center-wise performance comparison
- Student enrollment and retention
- Test participation rates
- Resource utilization

### Subject/Topic-Level Analytics

- Subject-wise performance trends
- Chapter-level mastery
- Topic-specific weaknesses
- Question-type analysis (MCQ vs descriptive, etc.)

### Test Results Dashboard

- Question-wise performance
- Average scores per question
- Most commonly missed questions
- Time-based performance trends

### Student Performance View

- **Tests Over Time:** Number of tests, score trends (improving/declining/stable), performance patterns
- **Average Score Trends:** Overall average, subject-wise averages, comparison with previous periods
- **Subject-Wise Performance:** Drill-down hierarchy: Subject → Chapter → Topic → Subtopic
- **Summary Statistics:** Total tests taken, current rank in batch, average score per test

---

## 9. Complete Sitemap & Documentation Status

### ✅ Pages with Full Content

| Page                             | URL                                                                    |
| -------------------------------- | ---------------------------------------------------------------------- |
| Welcome to Acadine               | https://docs.acadine.ai/getting-started/overview                       |
| Key Concepts                     | https://docs.acadine.ai/getting-started/key-concepts                   |
| Getting Started for Admins       | https://docs.acadine.ai/getting-started/for-admin                      |
| Getting Started for Teachers     | https://docs.acadine.ai/getting-started/for-teacher                    |
| Getting Started for Students     | https://docs.acadine.ai/getting-started/for-student                    |
| Generate Question Paper          | https://docs.acadine.ai/question-papers/generate-question-paper        |
| Configure Syllabus & Weightage   | https://docs.acadine.ai/question-papers/configure-syllabus-weightage   |
| Configure Question Types & Marks | https://docs.acadine.ai/question-papers/configure-question-types-marks |

### 🔜 Pages Marked "Coming Soon"

#### Assessment & Evaluation

| Page                          | URL                                                             |
| ----------------------------- | --------------------------------------------------------------- |
| Edit Question                 | https://docs.acadine.ai/question-papers/edit-question           |
| Replace Question              | https://docs.acadine.ai/question-papers/replace-question        |
| Add New Question              | https://docs.acadine.ai/question-papers/add-new-question        |
| Add New Section               | https://docs.acadine.ai/question-papers/add-new-section         |
| Reorder Questions             | https://docs.acadine.ai/question-papers/reorder-questions       |
| View PDF                      | https://docs.acadine.ai/question-papers/view-pdf                |
| Download Question Paper       | https://docs.acadine.ai/question-papers/download-question-paper |
| Add Comments                  | https://docs.acadine.ai/question-papers/add-comments            |
| Approve                       | https://docs.acadine.ai/question-papers/approve                 |
| Schedule Test                 | https://docs.acadine.ai/tests-evaluation/schedule-test          |
| Upload Answer Sheets          | https://docs.acadine.ai/tests-evaluation/upload-answer-sheets   |
| Share Test Results            | https://docs.acadine.ai/tests-evaluation/share-test-results     |
| Challenge Grade               | https://docs.acadine.ai/tests-evaluation/challenge-grade        |
| Create/Upload Assignment      | https://docs.acadine.ai/assignments/create-upload-assignment    |
| Upload Answer Sheet (Student) | https://docs.acadine.ai/assignments/upload-answer-sheet         |

#### Content & Communication

| Page                  | URL                                                           |
| --------------------- | ------------------------------------------------------------- |
| Upload Study Material | https://docs.acadine.ai/study-materials/upload-study-material |
| Delete Study Material | https://docs.acadine.ai/study-materials/delete-study-material |
| Update Study Material | https://docs.acadine.ai/study-materials/update-study-material |
| Schedule Lecture      | https://docs.acadine.ai/lectures/schedule-lecture             |
| Reschedule Lecture    | https://docs.acadine.ai/lectures/reschedule-lecture           |
| Make Announcement     | https://docs.acadine.ai/notice-board/make-announcement        |
| Edit Announcement     | https://docs.acadine.ai/notice-board/edit-announcement        |
| Remove Announcement   | https://docs.acadine.ai/notice-board/remove-announcement      |

#### User Management

| Page                    | URL                                                           |
| ----------------------- | ------------------------------------------------------------- |
| Onboard Single Student  | https://docs.acadine.ai/students/onboard-single-student       |
| Onboard via Invite Link | https://docs.acadine.ai/students/onboard-students-invite-link |
| Onboard via Excel       | https://docs.acadine.ai/students/onboard-students-excel       |
| Move Student to Batch   | https://docs.acadine.ai/students/move-student-to-batch        |
| Inactivate Student      | https://docs.acadine.ai/students/inactivate-student-account   |
| Delete Student          | https://docs.acadine.ai/students/delete-student-account       |
| Onboard Teachers        | https://docs.acadine.ai/teachers/onboard-teachers             |
| Inactivate Teacher      | https://docs.acadine.ai/teachers/inactivate-teacher-account   |
| Delete Teacher          | https://docs.acadine.ai/teachers/delete-teacher-account       |
| Onboard Admins          | https://docs.acadine.ai/admins/onboard-admins                 |
| Inactivate Admin        | https://docs.acadine.ai/admins/inactivate-admin-account       |
| Delete Admin            | https://docs.acadine.ai/admins/delete-admin-account           |

#### Institute Management

| Page                  | URL                                                          |
| --------------------- | ------------------------------------------------------------ |
| Create Batch          | https://docs.acadine.ai/batches/create-batch                 |
| Add Students to Batch | https://docs.acadine.ai/batches/add-students-to-batch        |
| Edit Batch Details    | https://docs.acadine.ai/batches/edit-batch-details           |
| Inactivate Batch      | https://docs.acadine.ai/batches/inactivate-batch             |
| Delete Batch          | https://docs.acadine.ai/batches/delete-batch                 |
| Create Course         | https://docs.acadine.ai/courses-targets/create-course        |
| Add Subjects          | https://docs.acadine.ai/courses-targets/add-subjects         |
| Remove Subjects       | https://docs.acadine.ai/courses-targets/remove-subjects      |
| Edit Syllabus         | https://docs.acadine.ai/courses-targets/edit-syllabus        |
| Onboard Own Syllabus  | https://docs.acadine.ai/courses-targets/onboard-own-syllabus |
| Onboard Centre        | https://docs.acadine.ai/centres-branches/onboard-center      |
| Edit Centre Details   | https://docs.acadine.ai/centres-branches/edit-center-details |
| Delete Centre         | https://docs.acadine.ai/centres-branches/delete-center       |

#### Other

| Page                            | URL                                                                 |
| ------------------------------- | ------------------------------------------------------------------- |
| How-To Guide: Onboard Institute | https://docs.acadine.ai/how-to-guide/onboard-institute              |
| Quick Links: Question Papers    | https://docs.acadine.ai/getting-started/quick-links/question-papers |

---

## Key Architectural Observations

1. **Multi-tenant Architecture:** Single dashboard manages multiple centers/branches, courses, and batches — designed for institute chains and multi-location coaching centers.

2. **AI-First Assessment Engine:** The core differentiator is AI-powered question paper generation and answer sheet evaluation. The AI:
   - Generates question papers aligned to exam board patterns
   - Auto-evaluates answer sheets within 24 hours
   - Provides rubric-based, step-wise evaluation with detailed feedback
   - Handles grade challenges via automated review

3. **Hierarchical Data Model:**

   ```
   Institute
   ├── Centers/Branches (physical locations)
   │   └── Batches (student groups)
   ├── Courses/Targets (academic programs)
   │   ├── Subjects
   │   │   ├── Chapters
   │   │   │   ├── Topics
   │   │   │   │   └── Subtopics
   │   ├── Syllabus
   │   └── Exam Board alignment
   └── Users
       ├── Admins (institute-level access)
       ├── Teachers (batch-level access)
       └── Students (personal access)
   ```

4. **Indian Education Market Focus:** Supports CBSE, ICSE, State Boards, JEE, NEET, CA Foundation, UPSC — primarily targeting Indian coaching institutes and schools.

5. **Mobile-First Notifications:** Push notifications via mobile app (primary), email as fallback.

6. **Offline Assessment Model:** Tests are taken on paper (offline), then answer sheets are scanned/uploaded for AI evaluation — NOT online/digital test-taking.

7. **Documentation Maturity:** Only ~8 out of 50+ pages have full content. Most feature-specific how-to guides are marked "Coming Soon", indicating the platform documentation is still being built out.

---

_End of Source of Truth Document_
