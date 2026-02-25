import type { Metadata } from 'next';
import { LeadCaptureForm } from '@/components/public/lead-capture-form';
import { AnimatedSection } from '@/components/public/animated-section';
import { FluidBlob } from '@/components/public/fluid-blob';
import { GraduationCap, Briefcase, FileText, Target, ArrowRight, CheckCircle, Rocket } from 'lucide-react';
import Link from 'next/link';
import { DecryptedText } from '@/components/public/decrypted-text';

export const metadata: Metadata = {
    title: 'University & Adult Learners — Thesis, Assignments, Career | PerTuto Dubai',
    description: 'Expert mentorship for university students and working professionals. Thesis guidance, assignment help, and career trajectory planning.',
};

export default function UniversityPage() {
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
                        Higher Education & Adult Learners
                    </div>
                    <h1 className="font-headline text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-foreground flex flex-col items-center justify-center">
                        <DecryptedText text="Bridge the Gap Between" speed={30} />
                        <span className="text-primary mt-2"><DecryptedText text="Academia & Industry" speed={40} /></span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground font-light leading-relaxed">
                        Whether you&apos;re an undergraduate wrestling with assignments, a Masters student defining your thesis, or a full-time professional tackling an online degree.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link href="#book-demo" className="w-full sm:w-auto">
                            <button className="btn-primary h-14 w-full sm:w-auto min-w-[240px] rounded-xl font-bold flex items-center justify-center gap-2 px-8 group">
                                Book Career Strategy Session
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===== BENTO GRID ===== */}
            <section className="mx-auto max-w-6xl px-6 py-24">
                <AnimatedSection className="mb-16">
                    <h2 className="font-headline text-3xl md:text-5xl font-bold text-foreground mb-4">Targeted Support</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl">We don&apos;t just teach theory; we help you navigate the system, build your assignments, and plan your career trajectory.</p>
                </AnimatedSection>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:grid-rows-2 h-auto md:h-[600px]">
                    {/* Large Card: Thesis & Research */}
                    <AnimatedSection delay={100} className="col-span-1 md:col-span-2 md:row-span-2">
                        <div className="glass-panel group relative h-full flex flex-col overflow-hidden rounded-3xl p-8 md:p-10">
                            <div className="mb-auto">
                                <div className="mb-6 inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <Target className="w-7 h-7" />
                                </div>
                                <h3 className="font-headline text-3xl font-bold text-foreground mb-3">Thesis & Research Purpose</h3>
                                <p className="text-muted-foreground leading-relaxed text-lg">Stuck on your dissertation? We help you identify highly relevant research gaps, design robust methodologies, and structure your final thesis for maximum impact.</p>
                            </div>
                            <div className="mt-12 relative h-48 w-full overflow-hidden rounded-xl border border-border bg-[#1e293b]">
                                <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
                                    <span className="w-3 h-3 rounded-full bg-slate-500/50"></span>
                                    <span className="text-xs text-slate-400 font-mono ml-2">Research_Proposal_Final.pdf</span>
                                </div>
                                <div className="p-4 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] to-transparent z-10"></div>
                                    <div className="space-y-3 opacity-70">
                                        <div className="h-3 w-3/4 rounded-full bg-slate-600"></div>
                                        <div className="h-3 w-full rounded-full bg-slate-700"></div>
                                        <div className="h-3 w-5/6 rounded-full bg-slate-700"></div>
                                        <div className="h-3 w-2/3 rounded-full bg-slate-700"></div>
                                        <div className="h-3 w-4/5 rounded-full bg-emerald-600/50 mt-6"></div>
                                        <div className="h-3 w-1/2 rounded-full bg-emerald-600/50"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* Assignment Help */}
                    <AnimatedSection delay={200} className="col-span-1 md:col-span-2 md:row-span-1">
                        <div className="glass-panel group relative h-full flex flex-col justify-center overflow-hidden rounded-3xl p-8">
                            <div className="inline-flex size-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 mb-3">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="font-headline text-2xl font-bold text-foreground">Assignment Decoding</h3>
                            <p className="text-muted-foreground">Break down complex briefs, unblock coding projects, and refine academic narratives.</p>
                        </div>
                    </AnimatedSection>

                    {/* Career Planning */}
                    <AnimatedSection delay={300} className="col-span-1 md:col-span-1 md:row-span-1">
                        <div className="glass-panel group relative h-full flex flex-col overflow-hidden rounded-3xl p-8">
                            <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <h3 className="font-headline text-xl font-bold text-foreground mb-2">Career Trajectory</h3>
                            <p className="text-sm text-muted-foreground">Resume audits, portfolio reviews, and interview prep.</p>
                        </div>
                    </AnimatedSection>

                    {/* Online Degrees */}
                    <AnimatedSection delay={400} className="col-span-1 md:col-span-1 md:row-span-1">
                        <div className="glass-panel group relative h-full flex flex-col overflow-hidden rounded-3xl p-8">
                            <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <h3 className="font-headline text-xl font-bold text-foreground mb-2">Distance Learning</h3>
                            <p className="text-sm text-muted-foreground">Manage correspondence courses while working full-time.</p>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ===== METHODOLOGY ===== */}
            <section className="py-24 border-t border-border bg-secondary/30 overflow-hidden">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="flex flex-col-reverse items-center gap-16 lg:flex-row">
                        <AnimatedSection animation="fade-left" className="w-full lg:w-1/2 lg:pr-8">
                            <div className="mb-6 inline-flex items-center gap-3 text-sm font-bold text-emerald-600 uppercase tracking-widest">
                                <span className="h-px w-12 bg-emerald-600"></span>
                                ROI Focused
                            </div>
                            <h2 className="mb-8 font-headline text-3xl font-bold text-foreground md:text-4xl leading-tight">Your degree is an investment. Maximize the return.</h2>
                            <p className="mb-10 text-lg text-muted-foreground leading-relaxed font-light">
                                Universities teach theory. We teach you how to translate that theory into a high-paying career while surviving the immediate pressures of deadlines and exams.
                            </p>
                            <ul className="space-y-5">
                                {[
                                    '1-on-1 mentorship from industry practitioners.',
                                    'Actionable strategies for balancing work and study.',
                                    'Direct assistance with capstone deliverables and final projects.'
                                ].map((bullet, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 mt-0.5 text-emerald-600 shrink-0" />
                                        <span className="text-foreground/80">{bullet}</span>
                                    </li>
                                ))}
                            </ul>
                        </AnimatedSection>
                        <div className="w-full lg:w-1/2">
                            <div className="relative aspect-square md:aspect-video w-full overflow-hidden rounded-3xl border border-border p-2 bg-white">
                                <div className="h-full w-full rounded-2xl bg-secondary relative flex items-center justify-center">
                                    <div className="text-muted-foreground font-mono text-sm opacity-50">[Mentorship Session]</div>
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
                            <h2 className="font-headline text-3xl font-bold text-foreground sm:text-4xl tracking-tight mb-4">Invest in Your Trajectory</h2>
                            <p className="text-muted-foreground max-w-md mx-auto mb-10">
                                Stop struggling in isolation. Tell us where you are stuck and we&apos;ll architect the fastest path forward.
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
