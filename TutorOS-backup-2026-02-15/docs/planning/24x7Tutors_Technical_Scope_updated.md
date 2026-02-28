# Technical Scope Document
## TutorOS - AI-Powered Math Tutoring Platform

**Document Version**: 1.0  
**Date**: December 31, 2025  
**Client**: 24x7Tutors  
**Status**: For Review  

---

## 1. Technical Overview

### 1.1 Architecture Style
**Cloud-Native Architecture** with modern frontend framework and serverless backend.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Modern Web Application (React)              │    │
│  │  • Pages: Auth, Dashboard, Question Bank, Quiz, Student  │    │
│  │  • Components: RichTextEditor, Math Renderer, Wizard     │    │
│  │  • Responsive Design: Mobile + Desktop                   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CLOUD SERVICES                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ Auth         │  │ Database     │  │ Serverless           │   │
│  │ Service      │  │ (NoSQL)      │  │ Functions            │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ Web          │  │ File         │  │ Security             │   │
│  │ Hosting      │  │ Storage      │  │ Rules                │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │ AI Services  │  │ Payment      │                             │
│  │              │  │ Gateway      │                             │
│  └──────────────┘  └──────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React-based Framework | Server-side rendering, routing |
| **UI Library** | React | Component library |
| **Styling** | CSS | Fluid, modern design system |
| **Rich Text** | Modern Editor | Question content editing |
| **Math Rendering** | LaTeX Renderer | Mathematical notation |
| **Auth** | Cloud Authentication | Email/password auth |
| **Database** | NoSQL Document DB | Flexible data storage |
| **Storage** | Cloud Storage | PDF uploads |
| **Functions** | Serverless | AI processing, webhooks |
| **Hosting** | Cloud Hosting | Static + SSR hosting |
| **Payments** | Payment Gateway | Secure transactions |
| **AI** | AI Services | PDF extraction, NL processing |

---

## 2. Database Schema

### 2.1 Collection Overview

```
Database Structure:
├── users/                    # User profiles and auth data
├── questions/                # Question bank (main content)
├── taxonomy_domains/         # Top-level taxonomy (Math, English)
├── taxonomy_topics/          # Topic hierarchy nodes
├── taxonomy_concepts/        # Micro-skill knowledge graph
├── curricula/                # Exam definitions (SAT, AMC, IB)
├── quizzes/                  # Quiz containers
├── quiz_attempts/            # Student quiz submissions
├── payments/  ---               # Payment records
└── audit_logs/               # System audit trail
```

### 2.2 Core Data Models

#### Users
- User ID, Email, Display Name
- Role (Super User, Admin, Teacher, Student)
- Subscription status
- Preferences (theme, notifications)

#### Questions
- Question content with math notation support
- Question type (MCQ, Fill-blank, Free Response, Passage-based)
- 4D Taxonomy tags (Topic, Cognitive Level, Curriculum, Pedagogy)
- Difficulty level and scaffold level
- Multi-curriculum mapping
- Metadata (source, confidence, timestamps)

#### Quizzes
- Quiz configuration (time limits, shuffle, feedback)
- Question references (ordered list)
- Assignment targets (users, classes)
- Status tracking (draft, published, archived)

---

## 3. API Design

### 3.1 API Endpoints

#### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | User registration |
| POST | /api/auth/login | User login |
| POST | /api/auth/logout | User logout |
| POST | /api/auth/reset-password | Password reset |

#### Questions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/questions | List questions (paginated, filtered) |
| GET | /api/questions/:id | Get single question |
| POST | /api/questions | Create question |
| PUT | /api/questions/:id | Update question |
| DELETE | /api/questions/:id | Archive question |
| POST | /api/questions/bulk | Bulk create from AI extraction |

#### AI Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/ai/extract | Upload PDF for extraction |
| GET | /api/ai/extract/:jobId | Get extraction status/results |
| POST | /api/ai/tag-suggest | Get suggested taxonomy tags |

#### Quizzes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/quizzes/curate | NL input → question suggestions |
| POST | /api/quizzes | Create quiz |
| GET | /api/quizzes | List quizzes |
| PUT | /api/quizzes/:id | Update quiz |
| POST | /api/quizzes/:id/assign | Assign to users |

#### Student
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/student/quizzes | Get assigned quizzes |
| POST | /api/student/attempts | Start quiz attempt |
| PUT | /api/student/attempts/:id | Submit answers |
| GET | /api/student/results | Get quiz results |

#### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/payments/create-checkout | Create checkout session |
| POST | /api/webhooks/payment | Payment webhook handler |
| GET | /api/payments/status | Get subscription status |

---

## 4. AI Integration Architecture

### 4.1 Worksheet Extractor Flow

```
Admin Upload → Cloud Storage → AI Processing → Parsed Questions → Review UI → Approved Questions
```

**Process:**
1. Admin uploads PDF worksheet
2. File stored in cloud storage
3. AI service extracts text and identifies questions
4. Questions parsed with auto-suggested taxonomy
5. Admin reviews and approves/edits before saving

### 4.2 Quiz Curator Flow

```
NL Input → AI Interpretation → Database Query → Candidate Questions → Wizard Refinement → Final Quiz
```

**Process:**
1. User enters natural language request (e.g., "20 hard algebra 1 questions")
2. AI interprets intent(ask for clarification if confused) and converts to query parameters
3. System queries question bank with interpreted filters
4. Wizard presents candidates for refinement
5. User finalizes and saves quiz

### 4.3 AI Model Selection

| Use Case | Model Type | Rationale |
|----------|------------|-----------|
| PDF Extraction | Advanced Vision Model | Best accuracy for complex documents |
| Text Processing | Fast Language Model | Quick, cost-effective processing |
| Taxonomy Suggestion | Fast Language Model | Quick inference for suggestions |
| NL Quiz Query | Fast Language Model | Low-latency for interactive use |

---

## 5. Security Architecture

### 5.1 Authentication Flow
```
User → Authentication Service → Secure Token → Application Access
                                     │
                                     ▼
                              Database Security Rules
                              (Role-based access)
```

### 5.2 Access Control
- **Super User**: Full system access
- **Admin**: Content management, user management
- **Teacher**: Quiz creation, student management
- **Student**: Own quizzes and results only

### 5.3 Security Measures
- All API routes require valid authentication token
- Rate limiting on all endpoints
- Input validation on all requests
- XSS protection via framework defaults
- HTTPS encryption for all traffic
- Data at rest encryption

---

## 6. Frontend Architecture

### 6.1 Page Structure
```
Application/
├── Authentication/
│   ├── Login
│   └── Register
├── Dashboard/
│   ├── Overview
│   ├── Questions/
│   │   ├── List & Search
│   │   ├── Create/Edit
│   │   └── Import (AI)
│   ├── Quizzes/
│   │   ├── List
│   │   ├── Builder
│   │   └── Curator (NL Wizard)
│   ├── Students/
│   └── Settings/
└── Student Portal/
    ├── Dashboard
    ├── Take Quiz
    └── Results
```

### 6.2 Design System

| Aspect | Specification |
|--------|--------------|
| **Theme** | Fluid, modern aesthetic (Dark + Light modes) |
| **Typography** | Clean, readable fonts with fluid scaling |
| **Layout** | Responsive grid, mobile-first |
| **Colors** | Curated palette (to be finalized with client) |
| **Effects** | Subtle micro-animations, smooth transitions |
| **Responsiveness** | Optimized for mobile, tablet, and desktop |

---

## 7. Deployment & DevOps

### 7.1 Environments
| Environment | Purpose |
|-------------|---------|
| Development | Local development |
| Staging | Pre-production testing |
| Production | Live system |

### 7.2 CI/CD Pipeline
```
Code Push → Automated Tests → Build → Deploy to Staging → Deploy to Production
```

---

## 8. Monitoring & Observability

| Aspect | Approach |
|--------|----------|
| Performance | Real-time metrics dashboard |
| Errors | Automated error tracking and alerts |
| Usage | User session analytics |
| Payments | Transaction monitoring |

---

## 9. Technical Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| AI service changes | High | Abstracted AI layer, vendor flexibility |
| Database scaling | Medium | Optimized queries, caching strategy |
| PDF extraction accuracy | High | Human review step, confidence scoring |
| Payment integration | High | Thorough testing, sandbox-first approach |

---

*Document ends*
