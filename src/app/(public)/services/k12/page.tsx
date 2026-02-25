import type { Metadata } from 'next';
import { LeadCaptureForm } from '@/components/public/lead-capture-form';
import { AnimatedSection } from '@/components/public/animated-section';
import { FluidBlob } from '@/components/public/fluid-blob';
import { FunctionSquare, FlaskConical, Languages, Edit3, CheckCircle, TrendingUp, ArrowRight, Rocket } from 'lucide-react';
import Link from 'next/link';
import { DecryptedText } from '@/components/public/decrypted-text';

export const metadata: Metadata = {
    title: 'K-12 Tutoring — IB, IGCSE, A-Level, CBSE | PerTuto Dubai',
    description: 'Expert tutoring for IB MYP & DP, IGCSE, A-Level, and CBSE students. Math, Science, English and more. Book a free demo class today.',
};

export default function K12Page() {
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
                        K-12 Curricula
                    </div>
                    <h1 className="font-headline text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-foreground flex flex-col items-center justify-center">
                        <DecryptedText text="Master the complexities of" speed={30} />
                        <span className="text-primary mt-2"><DecryptedText text="IB & IGCSE" speed={50} /></span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground font-light leading-relaxed">
                        Elite tutoring infrastructure for high-performance students. We deconstruct complex curriculums into mastery-focused analytical frameworks to guarantee results.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link href="#book-demo" className="w-full sm:w-auto">
                            <button className="btn-primary h-14 w-full sm:w-auto min-w-[200px] rounded-xl font-bold flex items-center justify-center gap-2 px-8">
                                Book Free Demo
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===== BENTO GRID: CORE DISCIPLINES ===== */}
            <section className="mx-auto max-w-6xl px-6 py-24">
                <AnimatedSection className="mb-16">
                    <h2 className="font-headline text-3xl md:text-5xl font-bold text-foreground mb-4">Core Disciplines</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl">Precision-engineered curriculums tailored to exact board specifications (IB DP, Cambridge IGCSE, Edexcel A-Levels).</p>
                </AnimatedSection>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:grid-rows-2 h-auto md:h-[600px]">
                    {/* Large Card: Math & Sciences */}
                    <AnimatedSection delay={100} className="col-span-1 md:col-span-2 md:row-span-2">
                        <div className="glass-panel group relative h-full flex flex-col overflow-hidden rounded-3xl p-8 md:p-10">
                            <div className="mb-auto">
                                <div className="mb-6 inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <FunctionSquare className="w-7 h-7" />
                                </div>
                                <h3 className="font-headline text-3xl font-bold text-foreground mb-3">Math & Physics</h3>
                                <p className="text-muted-foreground leading-relaxed text-lg">IB AA/AI HL, Further Maths, and University-level Calculus mastered through first-principles thinking rather than memorization.</p>
                            </div>
                            <div className="mt-12 relative h-44 w-full overflow-hidden rounded-xl bg-secondary border border-border">
                                <div className="absolute bottom-0 left-0 right-0 h-full w-full bg-gradient-to-t from-primary/5 to-transparent"></div>
                                <div className="absolute top-6 right-6 flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-600 border border-emerald-500/20">
                                    <TrendingUp className="w-4 h-4" />
                                    +2 Grade Jump Avg
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* Chemistry & Bio */}
                    <AnimatedSection delay={200} className="col-span-1 md:col-span-2 md:row-span-1">
                        <div className="glass-panel group relative h-full flex flex-col justify-center overflow-hidden rounded-3xl p-8">
                            <div className="flex items-start justify-between">
                                <div className="flex flex-col gap-3">
                                    <div className="inline-flex size-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                                        <FlaskConical className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-headline text-2xl font-bold text-foreground">Chemistry & Biology</h3>
                                    <p className="text-muted-foreground">From stoichiometry to complex organic synthesis.</p>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* Humanities */}
                    <AnimatedSection delay={300} className="col-span-1 md:col-span-1 md:row-span-1">
                        <div className="glass-panel group relative h-full flex flex-col overflow-hidden rounded-3xl p-8">
                            <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                                <Languages className="w-6 h-6" />
                            </div>
                            <h3 className="font-headline text-xl font-bold text-foreground mb-2">Humanities</h3>
                            <p className="text-sm text-muted-foreground">English Lit, Econ, History.</p>
                        </div>
                    </AnimatedSection>

                    {/* IAs & EEs */}
                    <AnimatedSection delay={400} className="col-span-1 md:col-span-1 md:row-span-1">
                        <div className="glass-panel group relative h-full flex flex-col overflow-hidden rounded-3xl p-8">
                            <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600">
                                <Edit3 className="w-6 h-6" />
                            </div>
                            <h3 className="font-headline text-xl font-bold text-foreground mb-2">IAs & EEs</h3>
                            <p className="text-sm text-muted-foreground">IB Coursework rescue & structuring.</p>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ===== METHODOLOGY ===== */}
            <section className="py-24 border-t border-border bg-secondary/30 overflow-hidden">
                <div className="mx-auto max-w-6xl px-6">
                    {/* Row 1 */}
                    <div className="mb-24 flex flex-col items-center gap-16 lg:flex-row">
                        <div className="w-full lg:w-1/2">
                            <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-border p-2 bg-white">
                                <div className="h-full w-full rounded-2xl bg-secondary relative flex items-center justify-center">
                                    <div className="text-muted-foreground font-mono text-sm opacity-50">[Pareto Analysis Dashboard]</div>
                                </div>
                            </div>
                        </div>
                        <AnimatedSection animation="fade-right" className="w-full lg:w-1/2 lg:pl-8">
                            <div className="mb-6 inline-flex items-center gap-3 text-sm font-bold text-primary uppercase tracking-widest">
                                <span className="h-px w-12 bg-primary"></span>
                                The Pareto Principle
                            </div>
                            <h2 className="mb-8 font-headline text-3xl font-bold text-foreground md:text-4xl leading-tight">Focus on the vital few, ignore the trivial many.</h2>
                            <p className="mb-10 text-lg text-muted-foreground leading-relaxed font-light">
                                Traditional tutoring wastes time on rote memorization. Our methodology identifies the exact 20% of core concepts that drive 80% of your exam results.
                            </p>
                            <ul className="space-y-5">
                                {[
                                    'Identify high-leverage concepts via diagnostic testing.',
                                    'Eliminate redundant study hours on low-yield material.',
                                    'Structured spaced repetition for active recall.'
                                ].map((bullet, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 mt-0.5 text-primary shrink-0" />
                                        <span className="text-foreground/80">{bullet}</span>
                                    </li>
                                ))}
                            </ul>
                        </AnimatedSection>
                    </div>

                    {/* Row 2 */}
                    <div className="flex flex-col-reverse items-center gap-16 lg:flex-row">
                        <AnimatedSection animation="fade-left" className="w-full lg:w-1/2 lg:pr-8">
                            <div className="mb-6 inline-flex items-center gap-3 text-sm font-bold text-blue-600 uppercase tracking-widest">
                                <span className="h-px w-12 bg-blue-600"></span>
                                Exam Technique
                            </div>
                            <h2 className="mb-8 font-headline text-3xl font-bold text-foreground md:text-4xl leading-tight">Cracking the Mark Scheme.</h2>
                            <p className="mb-10 text-lg text-muted-foreground leading-relaxed font-light">
                                Knowing the content is only half the battle. We train you to write answers that map perfectly to grading rubrics.
                            </p>
                            <ul className="space-y-5">
                                {[
                                    'Intensive past-paper drilling under timed conditions.',
                                    'Line-by-line mark scheme analysis and decoding.',
                                    'Strategies to maximize partial credit.'
                                ].map((bullet, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 mt-0.5 text-blue-600 shrink-0" />
                                        <span className="text-foreground/80">{bullet}</span>
                                    </li>
                                ))}
                            </ul>
                        </AnimatedSection>
                        <div className="w-full lg:w-1/2">
                            <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-border p-2 bg-white">
                                <div className="h-full w-full rounded-2xl bg-secondary relative flex items-center justify-center">
                                    <div className="text-muted-foreground font-mono text-sm opacity-50">[Mark Scheme Analysis]</div>
                                </div>
                            </div>
                        </div>
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
                            <h2 className="font-headline text-3xl font-bold text-foreground sm:text-4xl tracking-tight mb-4">Secure Your Spot</h2>
                            <p className="text-muted-foreground max-w-md mx-auto mb-10">
                                Our tutors operate at near full capacity. Submit your request to speak with an academic director.
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
