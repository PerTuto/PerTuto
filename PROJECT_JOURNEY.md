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

## Phase 1: Stabilization & Discovery

- [ ] Audit routing and minor issues introduced during the complex merge of multiple projects.
- [ ] Map out the exact boundaries between public pages, student dashboards, and admin/tutor workflows.
- [ ] Engage in Q&A with the Project Manager (USER) to clarify architecture edge cases.

## Phase 2: Feature Integration (The "Borrowing" Phase)

- [ ] Port ChronoClass LMS routing and state management patterns.
- [ ] Integrate TutorOS AI extractors into the overarching SaaS workflows.
- [ ] Port/Develop Acadine.ai parity features (AI test correction flow).

## Phase 3: "Immersive Web" & UI Overhaul

- [ ] Upgrade the UI/UX utilizing Framer Motion, GSAP, or native CSS animations for Brilliant.org/Duolingo level interactivity.
- [ ] Polish themes and component library (Tailwind + Radix/Custom hooks).

_This document serves as the permanent record of our high-level journey. It will be updated progressively._
