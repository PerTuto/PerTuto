import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ArrowRight, GraduationCap, Code2, FunctionSquare, FlaskConical, Atom, Calculator, Microscope, Rocket } from 'lucide-react';
import { AnimatedSection } from '@/components/public/animated-section';
import { FluidBlob } from '@/components/public/fluid-blob';
import { DecryptedText } from '@/components/public/decrypted-text';
import { LeadCaptureForm } from '@/components/public/lead-capture-form';

export const metadata: Metadata = {
    title: 'Free Study Resources — Syllabus, Past Papers, Study Guides | PerTuto',
    description: 'Access free syllabus outlines, past papers, study guides, and FAQs for CBSE, IB, IGCSE, A-Level, university, and professional courses.',
};

export default function ResourcesHubPage() {
    return (
        <main className="flex flex-col">
            {/* ===== HERO ===== */}
            <section className="relative pt-16 pb-20 px-6 overflow-hidden">
                <FluidBlob />
                <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary uppercase">
                        <span className="mr-2 flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Free Resources
                    </div>
                    <h1 className="font-headline text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-foreground flex flex-col items-center justify-center">
                        <DecryptedText text="Study Resources" speed={30} />
                        <span className="text-primary mt-2"><DecryptedText text="Hub" speed={50} /></span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground font-light leading-relaxed">
                        Syllabus outlines, past papers, study guides, and FAQs — covering K-12, university, and professional tracks. All free, forever.
                    </p>
                </div>
            </section>

            {/* ===== K-12 TUTORING ===== */}
            <section className="mx-auto max-w-6xl px-6 py-24">
                <AnimatedSection className="mb-16">
                    <div className="mb-6 inline-flex items-center gap-3 text-sm font-bold text-primary uppercase tracking-widest">
                        <span className="h-px w-12 bg-primary"></span>
                        K-12 Tutoring
                    </div>
                    <h2 className="font-headline text-3xl md:text-5xl font-bold text-foreground mb-4">School Curricula</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl">CBSE, IB, Cambridge IGCSE, and A-Level — chapter-wise syllabi and exam resources.</p>
                </AnimatedSection>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    {/* Large Card: CBSE Mathematics */}
                    <AnimatedSection delay={100} className="col-span-1 md:col-span-2 md:row-span-2">
                        <Link href="/resources/cbse" className="block h-full">
                            <div className="glass-panel group relative h-full flex flex-col overflow-hidden rounded-3xl p-8 md:p-10 hover:border-primary/40 transition-colors">
                                <div className="mb-auto">
                                    <div className="mb-6 inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <FunctionSquare className="w-7 h-7" />
                                    </div>
                                    <h3 className="font-headline text-3xl font-bold text-foreground mb-3">CBSE Board</h3>
                                    <p className="text-muted-foreground leading-relaxed text-lg">Complete chapter-wise syllabus for Classes 8–12. Board exam prep with detailed topic breakdowns.</p>
                                </div>
                                <div className="mt-8 flex flex-wrap gap-2">
                                    {['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((g) => (
                                        <span key={g} className="px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-medium border border-primary/10">{g}</span>
                                    ))}
                                </div>
                                <div className="mt-6 flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                                    Explore all grades <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </Link>
                    </AnimatedSection>

                    {/* IB Diploma */}
                    <AnimatedSection delay={200} className="col-span-1 md:col-span-2 md:row-span-1">
                        <div className="glass-panel group relative h-full flex flex-col justify-center overflow-hidden rounded-3xl p-8">
                            <div className="flex items-start justify-between">
                                <div className="flex flex-col gap-3">
                                    <div className="inline-flex size-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-headline text-2xl font-bold text-foreground">IB Diploma Programme</h3>
                                    <p className="text-muted-foreground">Math AA (SL & HL) and Chemistry (SL & HL) — the new Structure/Reactivity framework.</p>
                                </div>
                            </div>
                            <div className="mt-4 flex gap-3">
                                <Link href="/resources/ib/math-aa-(sl)" className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">Math AA <ArrowRight className="w-3.5 h-3.5" /></Link>
                                <Link href="/resources/ib/chemistry-(sl)" className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">Chemistry <ArrowRight className="w-3.5 h-3.5" /></Link>
                                <Link href="/resources/ib" className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all ml-auto">All IB <ArrowRight className="w-3.5 h-3.5" /></Link>
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* ICSE Board */}
                    <AnimatedSection delay={250} className="col-span-1 md:col-span-2">
                        <Link href="/resources/icse" className="block h-full">
                            <div className="glass-panel group relative h-full flex flex-col justify-center overflow-hidden rounded-3xl p-8 hover:border-emerald-500/40 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex flex-col gap-3">
                                        <div className="inline-flex size-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                                            <BookOpen className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-headline text-2xl font-bold text-foreground">ICSE / ISC Board</h3>
                                        <p className="text-muted-foreground">Rigorous K-12 resources, early science bifurcations, and comprehensive past papers.</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-3">
                                    <span className="text-sm text-emerald-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">Explore ICSE <ArrowRight className="w-3.5 h-3.5" /></span>
                                </div>
                            </div>
                        </Link>
                    </AnimatedSection>

                    {/* IGCSE */}
                    <AnimatedSection delay={300} className="col-span-1 md:col-span-2">
                        <div className="glass-panel group relative h-full flex flex-col overflow-hidden rounded-3xl p-8">
                            <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600">
                                <Calculator className="w-6 h-6" />
                            </div>
                            <h3 className="font-headline text-xl font-bold text-foreground mb-2">Cambridge IGCSE</h3>
                            <p className="text-sm text-muted-foreground mb-3">Physics & Mathematics</p>
                            <div className="mt-auto flex flex-col gap-1.5">
                                <Link href="/resources/caie/physics-(0625)-9-10" className="text-xs text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">Physics <ArrowRight className="w-3 h-3" /></Link>
                                <Link href="/resources/caie/mathematics-(0580)-9-10" className="text-xs text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">Mathematics <ArrowRight className="w-3 h-3" /></Link>
                                <Link href="/resources/caie" className="text-xs text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all mt-2 pt-2 border-t border-border">All CAIE <ArrowRight className="w-3 h-3" /></Link>
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* A-Level */}
                    <AnimatedSection delay={400} className="col-span-1 md:col-span-2">
                        <Link href="/resources/edexcel" className="block h-full">
                            <div className="glass-panel group relative h-full flex flex-col overflow-hidden rounded-3xl p-8 hover:border-primary/40 transition-colors">
                                <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
                                    <Microscope className="w-6 h-6" />
                                </div>
                                <h3 className="font-headline text-xl font-bold text-foreground mb-2">Edexcel</h3>
                                <p className="text-sm text-muted-foreground">International GCSE & A-Level</p>
                                <div className="mt-auto flex items-center gap-1 text-primary text-xs font-medium group-hover:gap-2 transition-all">
                                    Explore <ArrowRight className="w-3 h-3" />
                                </div>
                            </div>
                        </Link>
                    </AnimatedSection>
                </div>
            </section>

            {/* ===== BEYOND K-12 (University + Professional) ===== */}
            <section className="py-24 border-t border-border bg-secondary/30">
                <div className="mx-auto max-w-6xl px-6">
                    <AnimatedSection className="mb-12">
                        <div className="mb-6 inline-flex items-center gap-3 text-sm font-bold text-blue-600 uppercase tracking-widest">
                            <span className="h-px w-12 bg-blue-600"></span>
                            Beyond K-12
                        </div>
                        <h2 className="font-headline text-3xl md:text-5xl font-bold text-foreground mb-4">University &amp; Professional</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl">Higher-education study guides and professional upskilling paths — structured resources for every stage beyond school.</p>
                    </AnimatedSection>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* University Engineering */}
                        <AnimatedSection delay={100}>
                            <Link href="/resources/engineering" className="block h-full">
                                <div className="glass-panel group relative h-full flex flex-col overflow-hidden rounded-2xl p-6 hover:border-sky-500/40 transition-colors">
                                    <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600">
                                        <GraduationCap className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-headline text-xl font-bold text-foreground mb-2">University Engineering</h3>
                                    <p className="text-sm text-muted-foreground mb-4">Calculus, linear algebra, physics, and more for engineering undergrads.</p>
                                    <div className="mt-auto flex items-center gap-1 text-sky-600 text-sm font-medium group-hover:gap-2 transition-all">
                                        Explore <ArrowRight className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </Link>
                        </AnimatedSection>

                        {/* Computer Science */}
                        <AnimatedSection delay={200}>
                            <Link href="/resources/computer-science" className="block h-full">
                                <div className="glass-panel group relative h-full flex flex-col overflow-hidden rounded-2xl p-6 hover:border-cyan-500/40 transition-colors">
                                    <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600">
                                        <Atom className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-headline text-xl font-bold text-foreground mb-2">Computer Science</h3>
                                    <p className="text-sm text-muted-foreground mb-4">Algorithms, data structures, programming paradigms, and system design.</p>
                                    <div className="mt-auto flex items-center gap-1 text-cyan-600 text-sm font-medium group-hover:gap-2 transition-all">
                                        Explore <ArrowRight className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </Link>
                        </AnimatedSection>

                        {/* Business & Finance */}
                        <AnimatedSection delay={300}>
                            <Link href="/resources/business" className="block h-full">
                                <div className="glass-panel group relative h-full flex flex-col overflow-hidden rounded-2xl p-6 hover:border-teal-500/40 transition-colors">
                                    <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600">
                                        <GraduationCap className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-headline text-xl font-bold text-foreground mb-2">Business &amp; Finance</h3>
                                    <p className="text-sm text-muted-foreground mb-4">Accounting, microeconomics, and corporate finance study guides.</p>
                                    <div className="mt-auto flex items-center gap-1 text-teal-600 text-sm font-medium group-hover:gap-2 transition-all">
                                        Explore <ArrowRight className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </Link>
                        </AnimatedSection>

                        {/* Data Science & ML */}
                        <AnimatedSection delay={400}>
                            <Link href="/resources/data-science" className="block h-full">
                                <div className="glass-panel group relative h-full flex flex-col overflow-hidden rounded-2xl p-6 hover:border-emerald-500/40 transition-colors">
                                    <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                                        <Code2 className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-headline text-xl font-bold text-foreground mb-2">Data Science &amp; ML</h3>
                                    <p className="text-sm text-muted-foreground mb-4">From pandas and SQL to deep learning and MLOps.</p>
                                    <div className="mt-auto flex items-center gap-1 text-emerald-600 text-sm font-medium group-hover:gap-2 transition-all">
                                        Explore <ArrowRight className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </Link>
                        </AnimatedSection>

                        {/* Python Programming */}
                        <AnimatedSection delay={500}>
                            <Link href="/resources/ai-ml" className="block h-full">
                                <div className="glass-panel group relative h-full flex flex-col overflow-hidden rounded-2xl p-6 hover:border-yellow-500/40 transition-colors">
                                    <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-600">
                                        <Code2 className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-headline text-xl font-bold text-foreground mb-2">Python &amp; AI</h3>
                                    <p className="text-sm text-muted-foreground mb-4">Foundations → OOP → concurrency → production code.</p>
                                    <div className="mt-auto flex items-center gap-1 text-yellow-600 text-sm font-medium group-hover:gap-2 transition-all">
                                        Explore <ArrowRight className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </Link>
                        </AnimatedSection>

                        {/* Web Development */}
                        <AnimatedSection delay={600}>
                            <Link href="/resources/web-dev" className="block h-full">
                                <div className="glass-panel group relative h-full flex flex-col overflow-hidden rounded-2xl p-6 hover:border-rose-500/40 transition-colors">
                                    <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600">
                                        <Rocket className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-headline text-xl font-bold text-foreground mb-2">Web Development</h3>
                                    <p className="text-sm text-muted-foreground mb-4">React, Next.js, backend engineering, and cloud deployment.</p>
                                    <div className="mt-auto flex items-center gap-1 text-rose-600 text-sm font-medium group-hover:gap-2 transition-all">
                                        Explore <ArrowRight className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </Link>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* ===== CTA ===== */}
            <section id="book-demo" className="py-24 px-6 bg-primary/[0.03]">
                <AnimatedSection>
                    <div className="mx-auto max-w-xl">
                        <div className="glass-panel overflow-hidden rounded-3xl p-8 sm:p-12 text-center">
                            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <Rocket className="w-8 h-8" />
                            </div>
                            <h2 className="font-headline text-3xl font-bold text-foreground sm:text-4xl tracking-tight mb-4">Need Expert Guidance?</h2>
                            <p className="text-muted-foreground max-w-md mx-auto mb-10">
                                Book a free consultation. We&apos;ll match you with the right tutor and create a personalized study plan.
                            </p>
                            <div className="max-w-md mx-auto text-left">
                                <LeadCaptureForm variant="minimal" />
                            </div>
                        </div>
                    </div>
                </AnimatedSection>
            </section>
        </main>
    );
}
