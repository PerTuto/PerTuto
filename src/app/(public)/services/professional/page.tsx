import type { Metadata } from 'next';
import { LeadCaptureForm } from '@/components/public/lead-capture-form';
import { Brain, Code2, Database, TrendingUp, Cpu, ArrowRight, CheckCircle, Network, Server, Layers, Rocket } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Professional Upskilling — AI, Data Science, Programming | PerTuto Dubai',
    description: 'Level up your career with personalized tutoring in AI, Data Science, Python, and more. For working professionals in Dubai.',
};

export default function ProfessionalPage() {
    return (
        <main className="flex flex-col bg-background-dark">
            {/* ===== HERO ===== */}
            <section className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden border-b border-border-dark px-6 py-24 text-center mt-16">
                {/* Background Ambient Mesh */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/20 blur-[100px]"></div>
                    <div className="absolute bottom-0 right-0 h-[300px] w-[300px] translate-y-1/3 rounded-full bg-blue-600/10 blur-[80px]"></div>
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                </div>

                <div className="relative z-10 max-w-4xl space-y-6 animate-fade-in-up">
                    <div className="inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-violet-400 uppercase">
                        <span className="mr-2 flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400"></span>
                        </span>
                        For Working Professionals
                    </div>
                    <h1 className="font-headline text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
                        Learn the Critical <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-primary-glow">90%</span><br />
                        <span className="text-slate-300">in </span><span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-primary-glow">10%</span><span className="text-slate-300"> of the Time</span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-slate-400 font-light leading-relaxed">
                        Personalized 1-on-1 coaching in AI, Data Science, and modern Engineering. Designed for busy professionals who need tangible results fast.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                        <Link href="#book-demo" className="w-full sm:w-auto">
                            <button className="h-14 w-full sm:w-auto min-w-[200px] rounded-lg bg-violet-600 font-bold text-white hover:bg-violet-500 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)] hover:shadow-[0_0_25px_-5px_rgba(139,92,246,0.7)] group">
                                Book Career Strategy Session
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===== BENTO GRID: PROFESSIONAL TRACKS ===== */}
            <section className="relative z-10 mx-auto max-w-7xl px-6 py-32">
                <div className="mb-16">
                    <h2 className="font-headline text-3xl md:text-5xl font-bold text-white mb-4">Upskilling Tracks</h2>
                    <p className="text-lg text-slate-400 max-w-2xl">Intensive, project-based curriculums focused on immediate workplace application.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:grid-rows-2 h-auto md:h-[600px]">
                    {/* Large Card: AI & ML */}
                    <div className="glass-panel group relative col-span-1 md:col-span-2 md:row-span-2 flex flex-col overflow-hidden rounded-3xl p-8 md:p-10 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50">
                        <div className="absolute right-0 top-0 h-full w-full opacity-30 transition-opacity group-hover:opacity-60 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-500/30 via-transparent to-transparent pointer-events-none"></div>
                        
                        <div className="mb-auto">
                            <div className="mb-6 inline-flex size-14 items-center justify-center rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                                <Network className="w-7 h-7" />
                            </div>
                            <h3 className="font-headline text-3xl font-bold text-white mb-3">AI & Machine Learning</h3>
                            <p className="text-slate-400 leading-relaxed text-lg">From mathematical foundations to deploying production-ready LLMs. Real-world applications over theoretical trivia.</p>
                        </div>

                        {/* Faux Code Element for Visual Interest */}
                        <div className="mt-12 relative h-56 w-full overflow-hidden rounded-xl border border-white/5 bg-[#0d1117] flex flex-col">
                            <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
                                <span className="w-3 h-3 rounded-full bg-rose-500/50"></span>
                                <span className="w-3 h-3 rounded-full bg-amber-500/50"></span>
                                <span className="w-3 h-3 rounded-full bg-emerald-500/50"></span>
                                <span className="text-xs text-slate-500 font-mono ml-2">train_model.py</span>
                            </div>
                            <div className="p-4 overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] to-transparent z-10"></div>
                                <pre className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed opacity-70">
                                    <code className="block"><span className="text-pink-400">import</span> torch</code>
                                    <code className="block"><span className="text-pink-400">from</span> transformers <span className="text-pink-400">import</span> AutoModelForCausalLM</code>
                                    <code className="block mt-2"><span className="text-slate-500"># Load base model with 4-bit quantization</span></code>
                                    <code className="block">model = AutoModelForCausalLM.from_pretrained(</code>
                                    <code className="block">    <span className="text-emerald-300">"mistralai/Mistral-7B-v0.1"</span>,</code>
                                    <code className="block">    load_in_4bit=<span className="text-violet-400">True</span>,</code>
                                    <code className="block">    device_map=<span className="text-emerald-300">"auto"</span></code>
                                    <code className="block">)</code>
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* Medium Card: Data Science */}
                    <div className="glass-panel group relative col-span-1 md:col-span-2 md:row-span-1 flex flex-col justify-center overflow-hidden rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50">
                        <div className="flex items-start justify-between">
                            <div className="flex flex-col gap-3">
                                <div className="inline-flex size-12 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                                    <Database className="w-6 h-6" />
                                </div>
                                <h3 className="font-headline text-2xl font-bold text-white">Data Science & Analytics</h3>
                                <p className="text-slate-400">End-to-end data pipelines using Python, pandas, and SQL.</p>
                            </div>
                        </div>
                    </div>

                    {/* Small Card: Full Stack */}
                    <div className="glass-panel group relative col-span-1 md:col-span-1 md:row-span-1 flex flex-col overflow-hidden rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50">
                        <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <Code2 className="w-6 h-6" />
                        </div>
                        <h3 className="font-headline text-xl font-bold text-white mb-2">Modern Eng</h3>
                        <p className="text-sm text-slate-400">React, Next.js, Node infrastructure.</p>
                    </div>

                    {/* Small Card: Systems */}
                    <div className="glass-panel group relative col-span-1 md:col-span-1 md:row-span-1 flex flex-col overflow-hidden rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/50">
                        <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                            <Server className="w-6 h-6" />
                        </div>
                        <h3 className="font-headline text-xl font-bold text-white mb-2">Systems Arch</h3>
                        <p className="text-sm text-slate-400">Scalable cloud deployments & DevOps.</p>
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
                                    <div className="text-slate-500 font-mono text-sm opacity-50">[Project Portfolio Mockup]</div>
                                </div>
                                <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-violet-500/20 blur-[80px]"></div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 lg:pl-8">
                            <div className="mb-6 inline-flex items-center gap-3 text-sm font-bold text-violet-400 uppercase tracking-widest">
                                <span className="h-px w-12 bg-violet-400"></span>
                                Portfolio Driven
                            </div>
                            <h2 className="mb-8 font-headline text-3xl font-bold text-white md:text-5xl leading-tight">Stop collecting certificates. Start building proof.</h2>
                            <p className="mb-10 text-lg text-slate-400 leading-relaxed font-light">
                                Employers don&apos;t care about your coursera badges. We structure every engagement around building complex, production-ready projects that you can immediately showcase in interviews or use in your current role.
                            </p>
                            <ul className="space-y-6">
                                {[
                                    'Skip the hello-world tutorials; start with real architectures.',
                                    'Code reviews focused on industry best practices and clean code.',
                                    'Build a public GitHub portfolio of undeniable competence.'
                                ].map((bullet, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <div className="mt-1 rounded-full bg-violet-500/20 p-1 text-violet-400">
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
                            <div className="mb-6 inline-flex items-center gap-3 text-sm font-bold text-emerald-400 uppercase tracking-widest">
                                <span className="h-px w-12 bg-emerald-400"></span>
                                Unblocking
                            </div>
                            <h2 className="mb-8 font-headline text-3xl font-bold text-white md:text-5xl leading-tight">Never get stuck for days again.</h2>
                            <p className="mb-10 text-lg text-slate-400 leading-relaxed font-light">
                                Self-teaching often leads to days lost on obscure environment bugs or lacking the mental model for a new framework. Our 1-on-1 sessions unblock you instantly, debugging live and explaining the *why* behind the black box.
                            </p>
                            <ul className="space-y-6">
                                {[
                                    'Live pair programming and architecture whiteboarding.',
                                    'Instant clarification of complex academic papers or docs.',
                                    'Learn the tools professionals use (Docker, Git, CI/CD).'
                                ].map((bullet, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <div className="mt-1 rounded-full bg-emerald-500/20 p-1 text-emerald-400">
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
                                    <div className="text-slate-500 font-mono text-sm opacity-50">[Live Debugging/Architecture Mockup]</div>
                                </div>
                                <div className="absolute -top-10 -left-10 h-64 w-64 rounded-full bg-emerald-500/20 blur-[80px]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== CTA LAYER ===== */}
            <section id="book-demo" className="relative py-32 px-6">
                <div className="absolute inset-0 z-0 bg-background-dark">
                    <div className="h-full w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-500/10 via-background-dark to-background-dark"></div>
                </div>
                
                <div className="relative z-10 mx-auto max-w-4xl">
                    <div className="glass-panel overflow-hidden rounded-3xl p-8 sm:p-16 text-center shadow-2xl shadow-violet-500/5">
                        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-400 border border-violet-500/30">
                            <Rocket className="w-10 h-10" />
                        </div>
                        <h2 className="font-headline text-4xl font-bold text-white sm:text-5xl tracking-tight mb-6">Invest in Your Trajectory</h2>
                        <p className="text-slate-400 max-w-xl mx-auto mb-12 text-lg font-light">
                            Stop wasting hours on outdated tutorials. Tell us your exact career goal and we will architect the fastest path to achieve it.
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
