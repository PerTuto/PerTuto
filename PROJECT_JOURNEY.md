# Project Journey & Master Blueprint

## Vision

The goal is to evolve PerTuto from a public landing page into a fully-fledged, multi-tenant SaaS that outpaces competitors like Acadine.ai. It will feature:

1. **Interactive & Immersive Website**: Brilliant.org & Duolingo style aesthetics and high interactivity.
2. **Best-in-Class Multi-Tenant SaaS**: AI-powered workflows including worksheet extraction, quiz curation, databank management, and AI test corrections.
3. **Bulletproof All-In-One LMS**: Robust learning management system ported and enhanced from ChronoClass.

## Strategy & Approach

We are amalgamating four distinct projects into a single, cohesive Next.js codebase:

1. **PerTuto**: Original public website (React/Vite).
2. **ChronoClass**: Dashboard & LMS suite.
3. **TutorOS**: AI-driven content extraction and quiz management.
4. **Acadine.ai inspiration**: Advanced AI test corrections and competitive feature sets.

**Core Principle**: _Do not rewrite if we can borrow and integrate._ We will strictly audit existing code in legacy directories and backups before writing new major functionalities.

## Phase 1: Stabilization & Discovery ✅

- [x] Audit routing and minor issues introduced during the complex merge of multiple projects.
- [x] Map out the exact boundaries between public pages, student dashboards, and admin/tutor workflows.
- [x] Engage in Q&A with the Project Manager (USER) to clarify architecture edge cases.

## Phase 2: Feature Integration (The "Borrowing" Phase) ✅

- [x] Port ChronoClass LMS routing and state management patterns.
- [x] Integrate TutorOS AI extractors into the overarching SaaS workflows.
- [x] Port/Develop Acadine.ai parity features (AI test correction flow).

## Phase 3: "Immersive Web" & UI Overhaul ✅

- [x] Upgrade the UI/UX utilizing Framer Motion, GSAP, or native CSS animations for Brilliant.org/Duolingo level interactivity.
- [x] Polish themes and component library (Tailwind + Radix/Custom hooks).

## Phase 4: Backend Security & Infrastructure ✅

- [x] Comprehensive Firestore Rules RBAC refactoring with tenant isolation.
- [x] CORS origin injection into Cloud Functions for production AI flows.
- [x] Live deployment of patched rules and functions to `pertutoclasses` project.

## Phase 5: Acadine.ai Parity ✅

- [x] AI Question Paper Generation (Genkit).
- [x] Gemini Vision Answer Sheet Evaluator with confidence scoring.
- [x] Human-In-The-Loop (HITL) Review Queue for teachers.

## Phase 6–7: Testing, Documentation & QA ✅

- [x] Autonomous QA runbook execution.
- [x] Testing strategy documentation with real credentials.
- [x] Production deployment verification.

## Phase 8: Immersive V2 Homepage Overhaul ✅

- [x] Enlarged Constellation Background with curriculum-relevant keywords.
- [x] Spring-physics "How It Works" cards with staggered reveals.
- [x] Premium glassmorphism Lead Capture form.
- [x] Interactive Lab Experience quiz section.

## Phase 9: Immersive V3 Gamification Prototype (`/nike-proto`) ✅

- [x] **Sprint 1 — DOM Interactions**: Infinite Canvas Hero (draggable/flippable sticky notes), Auto-Drawing SVGs, Mini-Lab drag-and-drop equation solver, ComboMeterHUD with golden state, Zustand gamification store.
- [x] **Sprint 2 — WebGL**: Magnetized Focus Modes (R3F 3D keyword constellation with category toggles), 3D Journey Map (scroll-bound camera path with checkpoint unlocking), `<Suspense>` fallback wrappers.
- [x] **Polish**: Web Audio API sound effects, Golden State shimmer CTA.

## Phase 10: Production Readiness (Upcoming)

- [ ] Lighthouse performance audit and bundle optimization for V3 WebGL components.
- [ ] Mobile viewport testing and touch-gesture refinements.
- [ ] Decide: merge V3 prototype into main homepage or keep as `/nike-proto` showcase.
- [ ] Firebase App Hosting deployment with production build verification.

_This document serves as the permanent record of our high-level journey. It will be updated progressively._
