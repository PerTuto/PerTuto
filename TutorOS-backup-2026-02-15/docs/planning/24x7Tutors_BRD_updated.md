f# Business Requirements Document

## TutorOS - AI-Powered Math Tutoring Platform

**Document Version**: 1.0  
**Date**: December 31, 2025  
**Client**: 24x7Tutors  
**Status**: For Review

---

## 1. Executive Summary

### 1.1 Purpose

This document defines the business requirements for **TutorOS**, an AI-powered math tutoring platform designed to help 24x7Tutors manage large question banks, create curriculum-aligned quizzes, and deliver personalized learning experiences to students.

### 1.2 Project Overview

TutorOS is a custom-built platform for 24x7Tutors. The MVP focuses on empowering Admins to build robust, multi-curriculum Question Banks with AI-assisted content ingestion and quiz curation.

### 1.3 Key Value Propositions

1. **Centralized Question Bank** - Single source of truth for questions across curricula
2. **AI Worksheet Extractor** - Automated parsing and tagging of PDF worksheets
3. **4D Taxonomy System** - Pedagogically-sound question classification
4. **Quiz Curation Wizard** - Natural language quiz assembly from existing databank
5. **Common Core Focus** - Specialized support for Algebra 1, 2 & Geometry

---

## 2. Stakeholders

| Role                            | Responsibilities                                                                                           |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **24x7Tutors (Platform Owner)** | Strategic direction, approvals                                                                             |
| **Admins**                      | Quiz creation, Content curation, question bank management                                                  |
| **Teachers**                    | quiz assignment to students, student progress monitoring, learning and practice modules assigned by admins |
| **Students**                    | Learning, practice, assessments                                                                            |
| **Parents**                     | Progress visibility (Phase 2)                                                                              |

---

## 3. Business Objectives

| #   | Objective                      | Success Metric                         |
| --- | ------------------------------ | -------------------------------------- |
| 1   | Centralize question management | 100% of questions in unified system    |
| 2   | Reduce quiz creation time      | 80% reduction in time-to-quiz          |
| 3   | Ensure pedagogical accuracy    | 100% questions tagged with 4D taxonomy |
| 4   | Enable rapid content ingestion | Import 100+ questions/hour via AI      |

---

## 4. Scope Definition

### 4.1 User Roles & Access

| Role                     | Capabilities                                                |
| ------------------------ | ----------------------------------------------------------- |
| **Super User**           | Platform owner, all permissions                             |
| **Admin**                | Content management, question bank curation, user management |
| **Teacher**              | Quiz creation, student assignment, progress viewing         |
| **Student (Assisted)**   | Tutor-guided learning, assigned quizzes                     |
| **Student (Self-Serve)** | Independent practice mode                                   |

### 4.2 Question Types

- Multiple Choice (Single Answer)
- Multiple Choice (Multiple Answers)
- Fill-in-the-Blank (Text/Numeric)
- Free Response (Text/Numeric)
- Passage-Based Questions

### 4.3 Supported Curricula

- Common Core Algebra 1 and 2
- Common Core Geometry

### 4.4 AI Features

| Feature                      | Description                                                  |
| ---------------------------- | ------------------------------------------------------------ |
| **Worksheet Extractor**      | Parse PDFs, extract questions, auto-tag with taxonomy        |
| **Quiz Curator (NL Wizard)** | Natural language input → wizard-style curation from databank |

### 4.5 Technical Features

- Cloud Hosting (web.app domain)
- Email/Password Authentication
- Secure Payment Integration
- LaTeX Math Rendering
- Rich Text Editor
- Staging + Production Environments
- Responsive Web Design

---

## 5. Functional Requirements

### 5.1 Authentication & Authorization

| ID      | Requirement                                 | Priority    |
| ------- | ------------------------------------------- | ----------- |
| AUTH-01 | Users can register with email/password      | Must Have   |
| AUTH-02 | Users can log in and receive session tokens | Must Have   |
| AUTH-03 | Role-based access control                   | Must Have   |
| AUTH-04 | Password reset via email                    | Must Have   |
| AUTH-05 | Session timeout and management              | Should Have |

### 5.2 Question Bank Management

| ID    | Requirement                                                | Priority  |
| ----- | ---------------------------------------------------------- | --------- |
| QB-01 | Admin can manually create questions with rich text/LaTeX   | Must Have |
| QB-02 | Admin can bulk import questions via AI Worksheet Extractor | Must Have |
| QB-03 | All questions tagged with 4D Taxonomy                      | Must Have |
| QB-04 | Admin can search/filter questions by taxonomy              | Must Have |
| QB-05 | Admin can edit/archive questions                           | Must Have |
| QB-06 | Questions can be mapped to multiple curricula              | Must Have |

### 5.3 4D Taxonomy System

| ID     | Requirement                                                  | Priority  |
| ------ | ------------------------------------------------------------ | --------- |
| TAX-01 | Topic Hierarchy: Domain → Topic → Sub-Topic → Micro-Skill    | Must Have |
| TAX-02 | Cognitive Depth: Fluency, Conceptual, Application, Synthesis | Must Have |
| TAX-03 | Curriculum Mapping: SAT, AMC, IB categories                  | Must Have |
| TAX-04 | Pedagogical Flags: Misconception tags, Scaffold Levels       | Must Have |

### 5.4 AI Worksheet Extractor

| ID    | Requirement                                          | Priority  |
| ----- | ---------------------------------------------------- | --------- |
| AI-01 | Accept PDF uploads for extraction                    | Must Have |
| AI-02 | Parse text and identify question boundaries          | Must Have |
| AI-03 | Extract question content, options, and answers       | Must Have |
| AI-04 | Auto-suggest taxonomy tags                           | Must Have |
| AI-05 | Present extracted questions for review before saving | Must Have |

### 5.5 Quiz Curator

| ID    | Requirement                                                           | Priority  |
| ----- | --------------------------------------------------------------------- | --------- |
| QZ-01 | Accept natural language input (e.g., "20 hard SAT algebra questions") | Must Have |
| QZ-02 | Query databank based on interpretation                                | Must Have |
| QZ-03 | Present wizard-style selection for refinement                         | Must Have |
| QZ-04 | Allow manual addition/removal of questions                            | Must Have |
| QZ-05 | Assign quiz to students                                               | Must Have |

### 5.6 Student Experience

| ID     | Requirement                                        | Priority    |
| ------ | -------------------------------------------------- | ----------- |
| STU-01 | Students can view assigned quizzes                 | Must Have   |
| STU-02 | Students can take quizzes with timed/untimed modes | Must Have   |
| STU-03 | Questions render correctly with math notation      | Must Have   |
| STU-04 | Students receive feedback on answers               | Should Have |
| STU-05 | Students can view quiz history and scores          | Should Have |

### 5.7 Payments

| ID     | Requirement                               | Priority  |
| ------ | ----------------------------------------- | --------- |
| PAY-01 | Individual students can pay securely      | Must Have |
| PAY-02 | Secure payment processing (PCI compliant) | Must Have |
| PAY-03 | Payment confirmation and receipts         | Must Have |
| PAY-04 | Subscription management                   | Must Have |

---

## 6. Non-Functional Requirements

### 6.1 Performance

| Requirement         | Target                       |
| ------------------- | ---------------------------- |
| Page load time      | < 3 seconds                  |
| Question bank query | < 500ms for filtered results |
| PDF extraction      | < 60 seconds per document    |

### 6.2 Scalability

| Requirement            | Target                          |
| ---------------------- | ------------------------------- |
| Question bank capacity | Design for 1M+ questions        |
| Concurrent users       | Support 100+ simultaneous users |

### 6.3 Security

| Requirement      | Details                                     |
| ---------------- | ------------------------------------------- |
| Authentication   | Secure sessions with industry-standard auth |
| Authorization    | Role-based access control                   |
| Data encryption  | HTTPS (TLS), data at rest encryption        |
| Payment security | PCI DSS compliant                           |
| Data residency   | US-based servers                            |

### 6.4 Browser Support

| Browser          | Support |
| ---------------- | ------- |
| Chrome (latest)  | ✅      |
| Firefox (latest) | ✅      |
| Safari (latest)  | ✅      |
| Edge (latest)    | ✅      |

---

## 7. Integrations

| System               | Purpose                       |
| -------------------- | ----------------------------- |
| Cloud Authentication | User authentication           |
| Cloud Database       | Data storage                  |
| Cloud Hosting        | Web hosting                   |
| Payment Provider     | Payment processing            |
| AI Services          | PDF extraction, NL processing |

---

## 8. Acceptance Criteria

### MVP Definition of Done

1. ✅ Admin can log in with email/password
2. ✅ Admin can create 50+ questions with 4D taxonomy
3. ✅ Admin can import questions via AI Worksheet Extractor
4. ✅ Admin can curate quizzes using NL Wizard
5. ✅ Teacher can assign quizzes to students
6. ✅ Student can take assigned quizzes
7. ✅ Payment flow functional
8. ✅ All data persists securely
9. ✅ Deployed to staging and production

---

## 9. Approvals

| Role                      | Name | Signature | Date |
| ------------------------- | ---- | --------- | ---- |
| 24x7Tutors Representative |      |           |      |
| Project Lead              |      |           |      |
| Technical Lead            |      |           |      |

---

_Document ends_
