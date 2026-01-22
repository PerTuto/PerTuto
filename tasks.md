# Task List: PerTuto Website Power Plan

## ✅ Completed (Previous Session)
- [x] Migrate to React (Vite + TypeScript + Tailwind)
- [x] Port Angular components (ClayCard, ClayButton, ClayInput)
- [x] Implement Visual Enhancements (SpotlightCard, DecryptedText, Aurora, HeroVisual, Marquee)
- [x] Build production bundle

---

## 🚧 Phase 1: Foundation (Week 1)

### 1.1 Routing & SEO Infrastructure
- [ ] Install `react-router-dom`
- [ ] Install `react-helmet-async` for meta tags
- [ ] Install `vite-plugin-sitemap`
- [ ] Refactor `App.tsx` into modular structure:
    - [ ] Create `src/layouts/MainLayout.tsx` (Navbar, Footer, Aurora)
    - [ ] Create `src/pages/HomePage.tsx` (Current hero, features, etc.)
    - [ ] Set up React Router in `main.tsx`

### 1.2 Create Shell Pages (SEO Pillar Pages)
- [ ] `/curricula/british` - IGCSE & A-Level (Oxford Blue Theme)
- [ ] `/curricula/ib` - MYP & DP (Navy/Gold Theme)
- [ ] `/curricula/indian` - CBSE & ICSE (Forest Green Theme)
- [ ] `/executive` - Professional Academic Support (Executive Dark Theme)
- [ ] `/services/small-group` - Value Offering (Max 4 Students)

### 1.3 Subject Pages (Deep Content)
- [ ] `/subjects/math` - Including AA/AI for IB
- [ ] `/subjects/physics` - Including HL/SL specifics
- [ ] `/subjects/chemistry` - Including IA support
- [ ] `/subjects/biology`

---

## 🚧 Phase 2: Content & Trust (Week 2)

### 2.1 Content Injection (from Flyer Research)
- [ ] Implement **Fear/Urgency** vs **Aspiration** copy for each curator page
- [ ] Add **"Demo Class Package - AED 100"** CTA to all K-12 pages
- [ ] Implement **PAS (Problem-Agitate-Solution)** framework in subject descriptions

### 2.2 Trust Signals & Compliance
- [ ] Design "100% MoHRE/DED Compliant" badge
- [ ] Add badge to Footer & Booking flow
- [ ] Create `/about/verified-tutors` compliance page

### 2.2 Localization (Dubai Factor)
- [ ] Add Dubai imagery/visuals to hero and about section
- [ ] Ensure Parent Mode emphasizes "Safety, Results, Curriculum Alignment"

### 2.3 Contact/Lead Form
- [ ] Connect Lead Form to Firebase (Firestore) or Formspree
- [ ] Add form success tracking (consider Google Analytics events)

---

## 🚧 Phase 3: Lead Magnets & Analytics (Week 3)

### 3.1 Micro-Tools (High Shareability)
- [ ] `/resources/grade-calculators` - IB/IGCSE Grade Calculator
- [ ] `/resources/past-papers` - Past Paper Library (or links)
- [ ] `/resources/university-predictor` (Optional, Phase 2?)

### 3.2 Blog Structure
- [ ] Create `/blog` listing page
- [ ] Set up MDX or similar for content authoring

### 3.3 Analytics & Tracking
- [ ] Install Google Analytics 4
- [ ] Submit `sitemap.xml` to Google Search Console
- [ ] Implement JSON-LD Schema Markup (EducationalOrganization, Service)

---

## ✅ Phase 4: Deployment
- [x] Deploy to Firebase Hosting (`pertutoclasses` project)
- [x] Verify live site performance (LCP < 2.5s)
- [x] Configure custom domain (`pertuto.com`)

---

## 📝 Notes
- **Priority**: SEO-first architecture is critical. Routing and meta tags must be set up before adding more content pages.
- **"Vibe" vs "Trust"**: The Student/Parent toggle already handles this; ensure new pages respect this pattern.
- **SPA SEO**: We are patching Vite's SPA to be SEO-friendly rather than migrating to Next.js.
