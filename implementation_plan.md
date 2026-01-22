# PerTuto Website Power Plan (Revised & Enhanced)
## Complete SEO, Tech & Business Strategy

---

## EXECUTIVE SUMMARY

This power plan provides a comprehensive blueprint for building pertuto.com with SEO-first architecture, optimized for the Dubai tutoring market. The strategy focuses on capturing high-intent search traffic while leveraging PerTuto's unique "UAE-managed" positioning to build trust in a newly regulated market.

**Launch Priority**: Go live within 2-3 weeks with MVP, iterate based on data.
**Primary Goal**: Dominate the "Online & Legal" niche by combining high-end "vibe" aesthetics with robust trust signals, outpacing legacy competitors.

---

## PART 1: KEYWORD STRATEGY (Refined)

### 1.1 PRIMARY KEYWORDS (High Intent, Moderate Competition)
These keywords are your revenue drivers.

| Keyword | Monthly Search Volume (Est.) | Intent | Target Page |
|---------|------------------------------|--------|-------------|
| `IGCSE tutor Dubai` | 500-800 | Transactional | /igcse-tutoring |
| `IB tutor Dubai` | 300-500 | Transactional | /ib-tutoring |
| `CBSE tutor Dubai` | 400-600 | Transactional | /cbse-tutoring |
| `A Level tutor Dubai` | 300-500 | Transactional | /a-level-tutoring |
| `online tutoring Dubai` | 600-900 | Transactional | /online-tutoring |
| `math tutor Dubai` | 800-1200 | Transactional | /subjects/math |
| `physics tutor Dubai` | 400-600 | Transactional | /subjects/physics |

### 1.2 "GOLD MINE" NICHE KEYWORDS (High Urgency)
These low-volume, high-value queries convert well because they solve specific crises.

| Keyword | Intent | Feature/Content |
|---------|--------|-----------------|
| `IB Math AA HL internal assessment tutor` | Crisis/Urgent | "IA Rescue" Section on IB Page |
| `IGCSE physics past paper practice` | Info -> Lead Gen | Free Past Papers Resource Bank |
| `KHDA approved private tutor Dubai` | Trust/Safety | "Legal & Verified" Footer Badge |
| `homeschooling support Dubai` | Recurring Rev | Dedicated "Homeschooling" Service Page |
| `MBA tutor Dubai assignments` | Efficiency | Executive Academic Support Landing Page |

---

## PART 2: WEBSITE ARCHITECTURE & TECH STACK

### 2.1 THE "HYBRID SEO-SPA" STRATEGY
**Current Status**: Vite + React 19 (SPA).
**Challenge**: SPAs (Single Page Apps) have historically struggled with SEO compared to SSR (Server-Side Rendering).
**Decision**: **Stick with Vite** for speed and animation capability, but "patch" SEO aggressively to avoid a costly rewrite to Next.js.

**Required Tech Upgrades**:
1.  **`react-helmet-async`**: Must be implemented on *every* route to inject dynamic `<title>` and `<meta>` tags.
2.  **`react-router-dom`**: Refactor from single `App.tsx` file to a proper Route structure (`<Route path="/igcse" ... />`).
3.  **`vite-plugin-sitemap`**: Auto-generate `sitemap.xml` at build time so Google can find deep links.
4.  **Prerender.io (Optional)**: If indexing lags, deploy a pre-rendering middleware later.

### 2.2 SITE MAP & STRUCTURE

```
pertuto.com/
│
├── / (Homepage) - The "Hook" (Student/Parent Toggle)
│
├── /curricula/ (Landing Pages)
│   ├── /british (IGCSE/A-Level - Oxford Blue Palette)
│   ├── /ib (MYP/DP - Navy/Gold Palette)
│   └── /indian (CBSE/ICSE - Forest Green/Gold Palette)
│
├── /services/
│   ├── /one-on-one (Premium focus)
│   └── /small-group (Value focus - "Max 4 Students")
│
├── /executive/ (Professional Academic Support)
│
├── /subjects/ (Subject Specific)
│   ├── /math
│   ├── /physics
│   └── /chemistry
│
├── /resources/ (Lead Magnets)
│   ├── /past-papers/ (SEO Traffic Magnet)
│   ├── /grade-calculators/ (Viral Student Tool)
│   └── /blog/
│
├── /about/ (Trust)
│   └── /verified-tutors (Compliance page)
│
└── /contact/ (Conversion - WhatsApp & BOTIM focus)
```

---

## PART 3: CONTENT & DESIGN SYSTEM (By Segment)

**Insight**: Each curriculum segment responds to different visual and psychological cues.

| Segment | Visual Palette | Primary Hook | Key "Agitate" Message |
|---------|----------------|--------------|-----------------------|
| **British** | Oxford Blue (#002147) | "Examiner's Mindset" | "School doesn't teach exam technique." |
| **IB** | Navy/Gold (#003057 / #C9B074) | "Level 7 Mastery" | "Internal Assessments are closer than you think." |
| **Indian** | Forest Green (#014421) | "Nurturing Discipline" | "Board exams in 6 weeks - Prep or Panic?" |
| **Executive**| Dark Mode / Gold | "Efficiency & ROI" | "Learn the critical 90% in 10% of the time." |

---

## PART 3: TRUST & LOCALIZATION (The "Dubai Factor")

**Insight**: With the 2023 legalization of private tutoring, "Compliance" is a major USP against black-market tutors.

### 3.1 "Permitted & Verified" Strategy
- **Badge**: "100% MoHRE/DED Compliant Freelancers" visible in footer and booking flow.
- **Copy**: "No random students. Only verified, legal expert tutors."
- **Visuals**: Use imagery of Dubai (JLT, Marina, recognizable landmarks) to signal "We are local," even if online.

### 3.2 "Vibe" vs. "Trust" Balance
- **Student View**: Keep the "Academic Weapon," "Dark Mode," "Gamified" aesthetic.
- **Parent View**: Ensure clear "Safety," "Results," and "Curriculum Alignment" messaging is just one click away (Toggle Mode).

---

## PART 4: CONTENT STRATEGY & LEAD MAGNETS

### 4.1 Functional Content (Tools > Blogs)
Instead of generic blogs, build **micro-tools** that students share:
1.  **IB/IGCSE Grade Calculator**: "What do I need in my final executable to get an A*?"
2.  **University Predictor**: "Enter your grades -> See eligible Dubai/UK Unis."

### 4.2 The "Topic Diagnostic" & "Demo Package" Hook
Refine the CTA from a generic "Book Demo" to a specific **"Solve One Problem"** offer:
*   **Topic Rescue**: "Stuck on Calculus? Book a 15-min 'Calculus Rescue' session for free."
*   **Low Barrier Entry**: "🎯 Try Our Demo Class Package – Just AED 100" (Prominent on all K-12 curriculum pages).

---

## PART 5: TECHNICAL SEO CHECKLIST (Vite Specific)

**Pre-Launch Requirements**:
- [ ] **Meta Tags**: `react-helmet-async` configured for Title, Description, and OG Images (Social Cards).
- [ ] **Canonical URLs**: Ensure `pertuto.com/igcse` doesn't conflict with `pertuto.com/igcse/`.
- [ ] **Sitemap**: `sitemap.xml` auto-generated and submitted to Google Search Console.
- [ ] **Performance**: LCP < 2.5s. Optimize the 3D `HeroVisual` to lazy-load or pause when off-screen.
- [ ] **Schema Markup**: Inject JSON-LD for `EducationalOrganization` and `Service` on relevant pages.

---

## PART 6: IMPLEMENTATION TIMELINE

### PHASE 1: FOUNDATION (Week 1)
- Refactor `App.tsx` into `Layout`, `Home`, and `Router`.
- Install SEO libraries (`helmet`, `sitemap`).
- Build "Shell" pages for IGCSE, IB, CBSE.

### PHASE 2: CONTENT & TRUST (Week 2)
- Write & Implement Copy for Pillar Pages.
- Add "Verified Badge" and Localized Footer.
- Launch "Waitlist/Contact" form with Formspree or Firebase.

### PHASE 3: LEAD MAGNETS (Week 3)
- Deploy "Past Paper" library or "Grade Calculator".
- Set up Google Analytics & Search Console.

---

## NEXT STEPS
1.  **Developer Action**: Execute the "SPA SEO Patch" (install libs, refactor Router).
2.  **Content Action**: Draft the distinct value props for IGCSE vs IB pages.
3.  **Design Action**: Create the "Verified / Legal" trust badge asset.
