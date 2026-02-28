import type { Metadata } from 'next';
import { LeadCaptureForm } from '@/components/public/lead-capture-form';
import { AnimatedSection } from '@/components/public/animated-section';
import { FluidBlob } from '@/components/public/fluid-blob';
import { Network, Database, Code2, Server, ArrowRight, CheckCircle, Rocket } from 'lucide-react';
import Link from 'next/link';
import { DecryptedText } from '@/components/public/decrypted-text';

export const metadata: Metadata = {
    title: 'Professional Upskilling — AI, Data Science, Programming | PerTuto Dubai',
    description: 'Level up your career with personalized tutoring in AI, Data Science, Python, and more. For working professionals in Dubai.',
};

export default function ProfessionalPage() {
    return (
        <main className="flex flex-col">
            {/* ===== HERO ===== */}
            <section className="relative pt-16 pb-20 px-6 overflow-hidden">
                <FluidBlob />
                <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center rounded-full border border-foreground/10 bg-foreground/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-foreground/70 uppercase">
                        <span className="me-2 flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        For Working Professionals
                    </div>
                    <h1 className="font-headline text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-foreground">
                        <DecryptedText text="Learn the Critical" speed={30} /> <span className="text-primary">90%</span><br />
                        in <span className="text-primary">10%</span> <DecryptedText text="of the Time" speed={40} />
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground font-light leading-relaxed">
                        Personalized 1-on-1 coaching in AI, Data Science, and modern Engineering. Designed for busy professionals who need tangible results fast.
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
                    <h2 className="font-headline text-3xl md:text-5xl font-bold text-foreground mb-4">Upskilling Tracks</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl">Intensive, project-based curriculums focused on immediate workplace application.</p>
                </AnimatedSection>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:grid-rows-2 h-auto md:h-[600px]">
                    {/* Large Card: AI & ML */}
                    <AnimatedSection delay={100} className="col-span-1 md:col-span-2 md:row-span-2">
                        <div className="glass-panel group relative h-full flex flex-col overflow-hidden rounded-3xl p-8 md:p-10">
                            <div className="mb-auto">
                                <div className="mb-6 inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <Network className="w-7 h-7" />
                                </div>
                                <h3 className="font-headline text-3xl font-bold text-foreground mb-3">AI & Machine Learning</h3>
                                <p className="text-muted-foreground leading-relaxed text-lg">From mathematical foundations to deploying production-ready LLMs. Real-world applications over theoretical trivia.</p>
                            </div>
                            {/* Code snippet visual */}
                            <div className="mt-12 relative h-48 w-full overflow-hidden rounded-xl border border-border bg-[#1e293b]">
                                <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
                                    <span className="w-3 h-3 rounded-full bg-rose-500/50"></span>
                                    <span className="w-3 h-3 rounded-full bg-amber-500/50"></span>
                                    <span className="w-3 h-3 rounded-full bg-emerald-500/50"></span>
                                    <span className="text-xs text-slate-400 font-mono ms-2">train_model.py</span>
                                </div>
                                <div className="p-4 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] to-transparent z-10"></div>
                                    <pre className="text-xs text-slate-300 font-mono leading-relaxed opacity-70">
                                        <code className="block"><span className="text-pink-400">import</span> torch</code>
                                        <code className="block"><span className="text-pink-400">from</span> transformers <span className="text-pink-400">import</span> AutoModel</code>
                                        <code className="block mt-1"><span className="text-slate-500"># Fine-tune with LoRA</span></code>
                                        <code className="block">model = AutoModel.from_pretrained(</code>
                                        <code className="block">    <span className="text-emerald-300">&quot;mistralai/Mistral-7B&quot;</span></code>
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* Data Science */}
                    <AnimatedSection delay={200} className="col-span-1 md:col-span-2 md:row-span-1">
                        <div className="glass-panel group relative h-full flex flex-col justify-center overflow-hidden rounded-3xl p-8">
                            <div className="inline-flex size-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 mb-3">
                                <Database className="w-6 h-6" />
                            </div>
                            <h3 className="font-headline text-2xl font-bold text-foreground">Data Science & Analytics</h3>
                            <p className="text-muted-foreground">End-to-end data pipelines using Python, pandas, and SQL.</p>
                        </div>
                    </AnimatedSection>

                    {/* Full Stack */}
                    <AnimatedSection delay={300} className="col-span-1 md:col-span-1 md:row-span-1">
                        <div className="glass-panel group relative h-full flex flex-col overflow-hidden rounded-3xl p-8">
                            <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                                <Code2 className="w-6 h-6" />
                            </div>
                            <h3 className="font-headline text-xl font-bold text-foreground mb-2">Modern Eng</h3>
                            <p className="text-sm text-muted-foreground">React, Next.js, Node infrastructure.</p>
                        </div>
                    </AnimatedSection>

                    {/* Systems */}
                    <AnimatedSection delay={400} className="col-span-1 md:col-span-1 md:row-span-1">
                        <div className="glass-panel group relative h-full flex flex-col overflow-hidden rounded-3xl p-8">
                            <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                                <Server className="w-6 h-6" />
                            </div>
                            <h3 className="font-headline text-xl font-bold text-foreground mb-2">Systems Arch</h3>
                            <p className="text-sm text-muted-foreground">Scalable cloud deployments & DevOps.</p>
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
                                    <div className="text-muted-foreground font-mono text-sm opacity-50">[Project Portfolio]</div>
                                </div>
                            </div>
                        </div>
                        <AnimatedSection animation="fade-right" className="w-full lg:w-1/2 lg:ps-8">
                            <div className="mb-6 inline-flex items-center gap-3 text-sm font-bold text-primary uppercase tracking-widest">
                                <span className="h-px w-12 bg-primary"></span>
                                Portfolio Driven
                            </div>
                            <h2 className="mb-8 font-headline text-3xl font-bold text-foreground md:text-4xl leading-tight">Stop collecting certificates. Start building proof.</h2>
                            <p className="mb-10 text-lg text-muted-foreground leading-relaxed font-light">
                                We structure every engagement around building complex, production-ready projects that you can immediately showcase in interviews.
                            </p>
                            <ul className="space-y-5">
                                {[
                                    'Skip the hello-world tutorials; start with real architectures.',
                                    'Code reviews focused on industry best practices.',
                                    'Build a public GitHub portfolio of undeniable competence.'
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
                        <AnimatedSection animation="fade-left" className="w-full lg:w-1/2 lg:pe-8">
                            <div className="mb-6 inline-flex items-center gap-3 text-sm font-bold text-emerald-600 uppercase tracking-widest">
                                <span className="h-px w-12 bg-emerald-600"></span>
                                Unblocking
                            </div>
                            <h2 className="mb-8 font-headline text-3xl font-bold text-foreground md:text-4xl leading-tight">Never get stuck for days again.</h2>
                            <p className="mb-10 text-lg text-muted-foreground leading-relaxed font-light">
                                Our 1-on-1 sessions unblock you instantly, debugging live and explaining the <em>why</em> behind the black box.
                            </p>
                            <ul className="space-y-5">
                                {[
                                    'Live pair programming and architecture whiteboarding.',
                                    'Instant clarification of complex papers or docs.',
                                    'Learn tools professionals use (Docker, Git, CI/CD).'
                                ].map((bullet, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 mt-0.5 text-emerald-600 shrink-0" />
                                        <span className="text-foreground/80">{bullet}</span>
                                    </li>
                                ))}
                            </ul>
                        </AnimatedSection>
                        <div className="w-full lg:w-1/2">
                            <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-border p-2 bg-white">
                                <div className="h-full w-full rounded-2xl bg-secondary relative flex items-center justify-center">
                                    <div className="text-muted-foreground font-mono text-sm opacity-50">[Live Debugging Session]</div>
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
                                Stop wasting hours on outdated tutorials. Tell us your career goal and we&apos;ll architect the fastest path.
                            </p>
                            <div className="max-w-md mx-auto text-start">
                                <LeadCaptureForm variant="minimal" />
                            </div>
                        </div>
                    </div>
                </AnimatedSection>
            </section>
        </main>
    );
}
