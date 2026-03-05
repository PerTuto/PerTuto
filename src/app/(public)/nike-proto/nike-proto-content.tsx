'use client';

import React from 'react';
import Link from 'next/link';
import { AnimatedSection } from '@/components/public/animated-section';
import { TestimonialGrid } from '@/components/public/testimonial-grid';
import { LeadCaptureForm } from '@/components/public/lead-capture-form';
import { FloatingFormulas } from '@/components/public/floating-formulas';
import { TiltCard } from '@/components/public/tilt-card';
import { ConstellationBackground } from '@/components/public/constellation-background';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, GraduationCap, Briefcase, BookOpen, MessageCircle } from 'lucide-react';

// V2 Enrichments
import { DecryptedText } from '@/components/public/decrypted-text';
import { Aurora } from '@/components/public/aurora';
import { SubjectMarquee } from '@/components/public/subject-marquee';

// V3 Prototypes
import { WhiteboardNoticeboard } from '@/components/public/v3-prototypes/whiteboard-noticeboard';
import { JourneyTimeline } from '@/components/public/v3-prototypes/journey-timeline';
import { MiniLabWrapper } from '@/components/public/v3-prototypes/mini-lab-wrapper';
import { ScrollProgressBar } from '@/components/public/v3-prototypes/scroll-progress-bar';

const FAQ_ITEMS = [
    { q: "How does the free demo work?", a: "Book a 30-minute session with an expert tutor. No commitments — just see if we're the right fit for your learning goals." },
    { q: "What curricula do you cover?", a: "We specialize in IB (MYP & DP), IGCSE, A-Level, CBSE, and ICSE. We also offer professional courses in AI, Data Science, and Programming." },
    { q: "Are sessions online or in-person?", a: "All sessions are conducted online via Google Meet, giving you flexibility to learn from anywhere in Dubai or globally." },
    { q: "How are tutors selected?", a: "Every tutor is vetted for subject expertise, teaching ability, and communication skills. We match you with the best fit for your specific needs." },
    { q: "What subjects do you offer for professionals?", a: "We cover AI & Machine Learning, Data Science, Python/JavaScript programming, and professional degree assistance (MBA, certifications)." },
];

export function NikeProtoContent() {
    return (
        <main className="min-h-screen relative overflow-hidden">
            <ScrollProgressBar />

            {/* ═══════════════════════════════════════════════════════════
                SECTION 1: HERO — Nike Bold + Dark Constellation
            ═══════════════════════════════════════════════════════════ */}
            <section className="relative min-h-[100svh] flex items-end pb-24 md:pb-32 px-6 md:px-16 overflow-hidden bg-[#0c0f1a]">
                {/* Constellation Background — Dark Variant */}
                <ConstellationBackground variant="dark" />

                {/* Ambient Teal Glow */}
                <div className="absolute top-1/3 right-1/4 w-[600px] h-[400px] bg-primary/15 rounded-full blur-[140px] pointer-events-none" />
                <div className="absolute bottom-1/4 left-1/6 w-[500px] h-[300px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

                {/* Hero Content — Left Aligned */}
                <div className="relative z-10 max-w-5xl">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-primary">
                            Book Your Free Demo
                        </span>
                    </div>

                    {/* Massive Headline */}
                    <h1
                        className="font-headline font-black uppercase tracking-[-0.03em] leading-[0.95] text-white mb-8"
                        style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}
                    >
                        Expert Tutoring<br />
                        That Delivers<br />
                        <span className="text-primary"><DecryptedText text="RESULTS" /></span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-white/60 text-base md:text-lg lg:text-xl font-medium max-w-xl mb-6 leading-relaxed">
                        Personalized mentorship for K-12 students, university learners, and working professionals. IB, Cambridge, CBSE, AI &amp; Data Science — we cover it all.
                    </p>

                    {/* Social Proof Bar */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-10 text-[11px] md:text-xs font-bold uppercase tracking-[0.15em] text-white/40">
                        <span>500+ Students</span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span>12+ Countries</span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span>4.9★ Rating</span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span>95% Score Improvement</span>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-wrap items-center gap-4">
                        <Link href="#book-demo">
                            <button className="group bg-primary text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-primary/90 active:scale-95 transition-all shadow-[0_4px_0_0_rgba(0,0,0,0.3)] hover:shadow-[0_2px_0_0_rgba(0,0,0,0.3)] hover:translate-y-[2px] flex items-center gap-2">
                                Book Free Demo
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                        <Link href="#services">
                            <button className="px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider border border-white/20 text-white/80 hover:bg-white/5 hover:border-white/40 active:scale-95 transition-all">
                                Explore Services
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 2: WHITEBOARD NOTICEBOARD — Stats as Sticky Notes
            ═══════════════════════════════════════════════════════════ */}
            <WhiteboardNoticeboard />

            {/* ═══════════════════════════════════════════════════════════
                SECTION 3: SERVICES — Pathways to Excellence
            ═══════════════════════════════════════════════════════════ */}
            <section id="services" className="py-24 md:py-32 px-6 text-foreground bg-white">
                <div className="max-w-7xl mx-auto">
                    <AnimatedSection className="mb-14 ps-6 md:ps-0 border-s-4 border-primary">
                        <h2
                            className="font-headline font-black uppercase mb-4 text-black tracking-[-0.03em] ps-6"
                            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1 }}
                        >
                            Pathways<br /><span className="text-primary">To Excellence</span>
                        </h2>
                        <p className="text-muted-foreground max-w-2xl text-base md:text-lg font-medium ps-6">
                            Whether you&apos;re aiming for perfect IB scores or looking to pivot into Data Science, we have a structured program for you.
                        </p>
                    </AnimatedSection>

                    <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 pb-4 snap-x snap-mandatory hide-scrollbar">
                        {/* K-12 */}
                        <AnimatedSection delay={100} className="h-full min-w-[85vw] md:min-w-0 snap-center">
                            <TiltCard className="h-full">
                                <div className="relative p-8 flex flex-col group h-[50vh] min-h-[380px] overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-primary/[0.02] border border-border/50 shadow-[0_0_20px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_30px_rgba(0,0,0,0.08)] hover:border-primary/30 transition-all duration-500">
                                    <div className="flex items-center justify-between mb-auto">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <GraduationCap className="w-6 h-6 text-primary" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">From AED 150/hr</span>
                                    </div>
                                    <div className="flex flex-col mt-auto">
                                        <h3 className="text-3xl md:text-4xl font-headline font-black text-foreground uppercase tracking-tighter mb-2">K-12 <br /><span className="text-primary">Tutoring</span></h3>
                                        <p className="text-muted-foreground font-medium mb-5 text-sm leading-relaxed">
                                            Master the complexities of IB DP, Cambridge IGCSE, and A-Levels. Rigorous prep for high performers.
                                        </p>
                                        <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 overflow-hidden translate-y-4 group-hover:translate-y-0">
                                            <Link href="/services/k12">
                                                <button className="bg-foreground text-background px-6 py-3 rounded-full font-bold uppercase tracking-wider text-xs flex items-center gap-2 hover:bg-primary hover:text-white transition-colors">
                                                    View Program <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </TiltCard>
                        </AnimatedSection>

                        {/* Professional */}
                        <AnimatedSection delay={200} className="h-full min-w-[85vw] md:min-w-0 snap-center">
                            <TiltCard className="h-full">
                                <div className="relative p-8 flex flex-col group h-[50vh] min-h-[380px] overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/5 to-amber-500/[0.02] border border-border/50 shadow-[0_0_20px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_30px_rgba(0,0,0,0.08)] hover:border-amber-500/30 transition-all duration-500">
                                    <div className="flex items-center justify-between mb-auto">
                                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                            <Briefcase className="w-6 h-6 text-amber-600" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">From AED 200/hr</span>
                                    </div>
                                    <div className="flex flex-col mt-auto">
                                        <h3 className="text-3xl md:text-4xl font-headline font-black text-foreground uppercase tracking-tighter mb-2">Professional <br /><span className="text-amber-600">Upskilling</span></h3>
                                        <p className="text-muted-foreground font-medium mb-5 text-sm leading-relaxed">
                                            Future-proof your career with intensive, 1-on-1 coaching in AI, Data Science, and modern Software Engineering.
                                        </p>
                                        <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 overflow-hidden translate-y-4 group-hover:translate-y-0">
                                            <Link href="/services/professional">
                                                <button className="bg-foreground text-background px-6 py-3 rounded-full font-bold uppercase tracking-wider text-xs flex items-center gap-2 hover:bg-amber-600 hover:text-white transition-colors">
                                                    View Tracks <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </TiltCard>
                        </AnimatedSection>

                        {/* University */}
                        <AnimatedSection delay={300} className="h-full min-w-[85vw] md:min-w-0 snap-center">
                            <TiltCard className="h-full">
                                <div className="relative p-8 flex flex-col group h-[50vh] min-h-[380px] overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/5 to-indigo-500/[0.02] border border-border/50 shadow-[0_0_20px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_30px_rgba(0,0,0,0.08)] hover:border-indigo-500/30 lg:col-span-1 md:col-span-2 transition-all duration-500">
                                    <div className="flex items-center justify-between mb-auto">
                                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                            <BookOpen className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">From AED 175/hr</span>
                                    </div>
                                    <div className="flex flex-col mt-auto">
                                        <h3 className="text-3xl md:text-4xl font-headline font-black text-foreground uppercase tracking-tighter mb-2">Higher <br /><span className="text-indigo-600">Education</span></h3>
                                        <p className="text-muted-foreground font-medium mb-5 text-sm leading-relaxed">
                                            Bridge the gap between academia and industry. Deep support for university students and online degrees.
                                        </p>
                                        <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 overflow-hidden translate-y-4 group-hover:translate-y-0">
                                            <Link href="/services/university">
                                                <button className="bg-foreground text-background px-6 py-3 rounded-full font-bold uppercase tracking-wider text-xs flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-colors">
                                                    View Advisory <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </TiltCard>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 4: MINI-LAB — Try It Yourself + Aurora BG
            ═══════════════════════════════════════════════════════════ */}
            <div id="mini-lab" className="relative overflow-hidden bg-white">
                <Aurora colorStops={["#10b981", "#8b5cf6", "#3b82f6"]} speed={0.6} />
                {/* Mini-Lab Heading */}
                <div className="relative z-10 pt-20 md:pt-28 px-6">
                    <AnimatedSection className="max-w-7xl mx-auto mb-0 ps-6 md:ps-0 border-s-4 border-primary">
                        <h2
                            className="font-headline font-black uppercase mb-4 text-black tracking-[-0.03em] ps-6"
                            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1 }}
                        >
                            Experience<br /><span className="text-primary">Our Teaching</span>
                        </h2>
                        <p className="text-muted-foreground max-w-2xl text-base md:text-lg font-medium ps-6">
                            Try a sample lesson from our actual curriculum. Drag, solve, and see what a PerTuto session feels like.
                        </p>
                    </AnimatedSection>
                </div>
                <MiniLabWrapper />
            </div>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 4.5: SUBJECTS — Marquee
            ═══════════════════════════════════════════════════════════ */}
            <section className="relative py-24 md:py-32 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <AnimatedSection className="mb-8 text-center">
                        <h2
                            className="font-headline font-black uppercase mb-4 text-black tracking-[-0.03em]"
                            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1 }}
                        >
                            Everything You Need<br /><span className="text-primary">To Succeed</span>
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg font-medium">
                            From core school subjects to advanced university degrees and professional upskilling.
                        </p>
                    </AnimatedSection>
                </div>
                <SubjectMarquee />
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 5: HOW PERTUTO WORKS — 4-Step Journey
            ═══════════════════════════════════════════════════════════ */}
            <div className="relative bg-white">
                <JourneyTimeline />
            </div>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 6: TESTIMONIALS
            ═══════════════════════════════════════════════════════════ */}
            <div className="relative bg-white">
                <TestimonialGrid />
            </div>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 7: LEAD CAPTURE — Glassmorphic Dark Section
            ═══════════════════════════════════════════════════════════ */}
            <section id="book-demo" className="py-28 md:py-36 px-6 bg-[#0c0f1a] text-slate-50 relative overflow-hidden">
                <FloatingFormulas />

                {/* Ambient Glows */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute top-1/4 right-1/4 w-[400px] h-[300px] bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none" />

                <AnimatedSection>
                    <div className="max-w-xl mx-auto relative group">
                        {/* Glow Border */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-indigo-500 rounded-[2rem] blur-xl opacity-40 group-hover:opacity-60 transition duration-1000" />

                        <TiltCard className="relative">
                            <div className="relative rounded-[2rem] border border-white/20 bg-white/10 backdrop-blur-2xl p-8 md:p-12 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden">
                                {/* Glass Sheen */}
                                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                                <div className="relative z-10 text-center mb-10">
                                    <h2 className="font-headline text-3xl md:text-4xl font-black mb-3 text-white tracking-tight drop-shadow-sm">
                                        Book Your Free Demo
                                    </h2>
                                    <p className="text-base text-white/70 font-medium tracking-wide">
                                        3 fields. 30 seconds. We&apos;ll call you within 2 hours.
                                    </p>
                                </div>
                                <div className="relative z-10">
                                    <LeadCaptureForm variant="minimal" />
                                </div>
                            </div>
                        </TiltCard>
                    </div>
                </AnimatedSection>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 8: FAQ
            ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32 px-6 bg-white">
                <div className="max-w-2xl mx-auto">
                    <AnimatedSection className="text-center mb-12">
                        <h2 className="font-headline text-3xl font-black text-black tracking-[-0.03em]">
                            Frequently Asked Questions
                        </h2>
                    </AnimatedSection>
                    <Accordion type="single" collapsible className="space-y-2">
                        {FAQ_ITEMS.map((item, i) => (
                            <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-xl px-6 bg-white">
                                <AccordionTrigger className="text-start font-semibold text-sm hover:no-underline text-foreground">
                                    {item.q}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                                    {item.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    {/* FAQ Escape Hatch */}
                    <div className="mt-10 text-center">
                        <p className="text-muted-foreground text-sm mb-4">Can&apos;t find your answer?</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a
                                href="https://wa.me/971585801639?text=Hi%20PerTuto,%20I%20have%20a%20question"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Chat on WhatsApp
                            </a>
                            <Link
                                href="#book-demo"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-foreground text-sm font-semibold hover:bg-primary hover:text-white hover:border-primary transition-colors"
                            >
                                Book a Free Demo
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
