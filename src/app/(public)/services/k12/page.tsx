import type { Metadata } from 'next';
import { LeadCaptureForm } from '@/components/public/lead-capture-form';
import { GraduationCap, BookOpen, FlaskConical, Atom, Languages, BarChart3, ArrowRight, CheckCircle, TrendingUp, FunctionSquare, Terminal, Edit3, Rocket } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'K-12 Tutoring — IB, IGCSE, A-Level, CBSE | PerTuto Dubai',
    description: 'Expert tutoring for IB MYP & DP, IGCSE, A-Level, and CBSE students. Math, Science, English and more. Book a free demo class today.',
};

export default function K12Page() {
    return (
        <main className="flex flex-col bg-background-dark">
            {/* ===== HERO ===== */}
            <section className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden border-b border-border-dark px-6 py-24 text-center mt-16">
                {/* Background Ambient Mesh */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[100px]"></div>
                    <div className="absolute bottom-0 right-0 h-[300px] w-[300px] translate-y-1/3 rounded-full bg-blue-600/10 blur-[80px]"></div>
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                </div>

                <div className="relative z-10 max-w-4xl space-y-6 animate-fade-in-up">
                    <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary-glow uppercase">
                        <span className="mr-2 flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        K-12 Curricula
                    </div>
                    <h1 className="font-headline text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
                        Master the complexities of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-glow to-blue-400">IB & IGCSE</span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-slate-400 font-light leading-relaxed">
                        Elite tutoring infrastructure for high-performance students. We deconstruct complex curriculums into mastery-focused analytical frameworks to guarantee results.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                        <Link href="#book-demo" className="w-full sm:w-auto">
                            <button className="btn-glow h-14 w-full sm:w-auto min-w-[200px] rounded-lg bg-primary font-bold text-white hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                                Book Free Demo
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===== BENTO GRID: CORE DISCIPLINES ===== */}
            <section className="relative z-10 mx-auto max-w-7xl px-6 py-32">
                <div className="mb-16">
                    <h2 className="font-headline text-3xl md:text-5xl font-bold text-white mb-4">Core Disciplines</h2>
                    <p className="text-lg text-slate-400 max-w-2xl">Precision-engineered curriculums tailored to exact board specifications (IB DP, Cambridge IGCSE, Edexcel A-Levels).</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:grid-rows-2 h-auto md:h-[600px]">
                    {/* Large Card: Math & Sciences (Spans 2 cols, 2 rows) */}
                    <div className="glass-panel group relative col-span-1 md:col-span-2 md:row-span-2 flex flex-col overflow-hidden rounded-3xl p-8 md:p-10 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50">
                        <div className="absolute right-0 top-0 h-full w-full opacity-30 transition-opacity group-hover:opacity-60 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent pointer-events-none"></div>
                        
                        <div className="mb-auto">
                            <div className="mb-6 inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary-glow">
                                <FunctionSquare className="w-7 h-7" />
                            </div>
                            <h3 className="font-headline text-3xl font-bold text-white mb-3">Math & Physics</h3>
                            <p className="text-slate-400 leading-relaxed text-lg">IB AA/AI HL, Further Maths, and University-level Calculus mastered through first-principles thinking rather than memorization.</p>
                        </div>

                        {/* Faux Graph Element for Visual Interest */}
                        <div className="mt-12 relative h-56 w-full overflow-hidden rounded-xl bg-black/40 border border-white/5">
                            <div className="absolute bottom-0 left-0 right-0 h-full w-full bg-gradient-to-t from-primary/20 to-transparent"></div>
                            <div className="absolute top-6 right-6 flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400 border border-emerald-500/20 backdrop-blur-sm">
                                <TrendingUp className="w-4 h-4" />
                                +2 Grade Jump Avg
                            </div>
                        </div>
                    </div>

                    {/* Medium Card: Chemistry & Bio */}
                    <div className="glass-panel group relative col-span-1 md:col-span-2 md:row-span-1 flex flex-col justify-center overflow-hidden rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50">
                        <div className="flex items-start justify-between">
                            <div className="flex flex-col gap-3">
                                <div className="inline-flex size-12 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                                    <FlaskConical className="w-6 h-6" />
                                </div>
                                <h3 className="font-headline text-2xl font-bold text-white">Chemistry & Biology</h3>
                                <p className="text-slate-400">From stoichiometry to complex organic synthesis.</p>
                            </div>
                        </div>
                    </div>

                    {/* Small Card: English/Humanities */}
                    <div className="glass-panel group relative col-span-1 md:col-span-1 md:row-span-1 flex flex-col overflow-hidden rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/50">
                        <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                            <Languages className="w-6 h-6" />
                        </div>
                        <h3 className="font-headline text-xl font-bold text-white mb-2">Humanities</h3>
                        <p className="text-sm text-slate-400">English Lit, Econ, History.</p>
                    </div>

                    {/* Small Card: IAs & EEs */}
                    <div className="glass-panel group relative col-span-1 md:col-span-1 md:row-span-1 flex flex-col overflow-hidden rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-rose-500/50">
                        <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                            <Edit3 className="w-6 h-6" />
                        </div>
                        <h3 className="font-headline text-xl font-bold text-white mb-2">IAs & EEs</h3>
                        <p className="text-sm text-slate-400">IB Coursework rescue & structuring.</p>
                    </div>
                </div>
            </section>

            {/* ===== Z-PATTERN: METHODOLOGY ===== */}
            <section className="py-32 border-t border-white/5 bg-surface-dark overflow-hidden">
                <div className="mx-auto max-w-7xl px-6">
                    {/* Row 1 */}
                    <div className="mb-32 flex flex-col items-center gap-16 lg:flex-row">
                        <div className="w-full lg:w-1/2">
                            <div className="relative aspect-square md:aspect-video w-full overflow-hidden rounded-3xl border border-white/10 p-2 glass-panel">
                                <div className="h-full w-full rounded-2xl bg-background-dark/80 relative flex items-center justify-center">
                                    <div className="text-slate-500 font-mono text-sm opacity-50">[Pareto Analysis Dashboard Mockup]</div>
                                </div>
                                <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-primary/20 blur-[80px]"></div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 lg:pl-8">
                            <div className="mb-6 inline-flex items-center gap-3 text-sm font-bold text-primary-glow uppercase tracking-widest">
                                <span className="h-px w-12 bg-primary-glow"></span>
                                The Pareto Principle
                            </div>
                            <h2 className="mb-8 font-headline text-3xl font-bold text-white md:text-5xl leading-tight">Focus on the vital few, ignore the trivial many.</h2>
                            <p className="mb-10 text-lg text-slate-400 leading-relaxed font-light">
                                Traditional tutoring wastes time on rote memorization out of order. Our methodology identifies the exact 20% of core concepts that drive 80% of your exam results, allowing for rapid mastery.
                            </p>
                            <ul className="space-y-6">
                                {[
                                    'Identify high-leverage concepts via diagnostic testing.',
                                    'Eliminate redundant study hours spent on low-yield material.',
                                    'Structured spaced repetition for active recall and retention.'
                                ].map((bullet, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <div className="mt-1 rounded-full bg-primary/20 p-1 text-primary-glow">
                                            <CheckCircle className="w-5 h-5" />
                                        </div>
                                        <span className="text-slate-300 text-lg">{bullet}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="flex flex-col-reverse items-center gap-16 lg:flex-row">
                        <div className="w-full lg:w-1/2 lg:pr-8">
                            <div className="mb-6 inline-flex items-center gap-3 text-sm font-bold text-blue-400 uppercase tracking-widest">
                                <span className="h-px w-12 bg-blue-400"></span>
                                Exam Technique
                            </div>
                            <h2 className="mb-8 font-headline text-3xl font-bold text-white md:text-5xl leading-tight">Cracking the Mark Scheme.</h2>
                            <p className="mb-10 text-lg text-slate-400 leading-relaxed font-light">
                                Knowing the content is only half the battle. Cambridge and IB examiners look for very specific keywords and structures. We train you to write answers that map perfectly to the grading rubrics.
                            </p>
                            <ul className="space-y-6">
                                {[
                                    'Intensive past-paper drilling under timed conditions.',
                                    'Line-by-line mark scheme analysis and decoding.',
                                    'Strategies to maximize partial credit on impossible questions.'
                                ].map((bullet, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <div className="mt-1 rounded-full bg-blue-500/20 p-1 text-blue-400">
                                            <CheckCircle className="w-5 h-5" />
                                        </div>
                                        <span className="text-slate-300 text-lg">{bullet}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="relative aspect-square md:aspect-video w-full overflow-hidden rounded-3xl border border-white/10 p-2 glass-panel">
                                <div className="h-full w-full rounded-2xl bg-background-dark/80 relative flex items-center justify-center">
                                    <div className="text-slate-500 font-mono text-sm opacity-50">[Mark Scheme Analysis Mockup]</div>
                                </div>
                                <div className="absolute -top-10 -left-10 h-64 w-64 rounded-full bg-blue-500/20 blur-[80px]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== CTA LAYER ===== */}
            <section id="book-demo" className="relative py-32 px-6">
                <div className="absolute inset-0 z-0 bg-background-dark">
                    <div className="h-full w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background-dark to-background-dark"></div>
                </div>
                
                <div className="relative z-10 mx-auto max-w-4xl">
                    <div className="glass-panel overflow-hidden rounded-3xl p-8 sm:p-16 text-center shadow-2xl shadow-primary/5">
                        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/20 text-primary-glow border border-primary/30">
                            <Rocket className="w-10 h-10" />
                        </div>
                        <h2 className="font-headline text-4xl font-bold text-white sm:text-5xl tracking-tight mb-6">Secure Your Spot</h2>
                        <p className="text-slate-400 max-w-xl mx-auto mb-12 text-lg font-light">
                            Our tutors operate at near full capacity. Submit your request below to speak directly with an academic director and craft your roadmap.
                        </p>
                        
                        <div className="max-w-md mx-auto text-left">
                            <LeadCaptureForm variant="minimal" />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
