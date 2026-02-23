import type { Metadata } from 'next';
import { SpotlightCard } from '@/components/public/spotlight-card';
import { LeadCaptureForm } from '@/components/public/lead-capture-form';
import { TestimonialGrid } from '@/components/public/testimonial-grid';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, GraduationCap, Briefcase, Users, Target, BookOpen, Clock, Activity, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { generateOrganizationSchema, generateFAQSchema } from '@/lib/schema';

export const metadata: Metadata = {
    title: 'PerTuto — Expert Tutoring for Students & Professionals in Dubai',
    description: 'Personalized tutoring for IB, IGCSE, CBSE, A-Level students and AI/Data Science upskilling for professionals. Book your free demo class today.',
    openGraph: {
        title: 'PerTuto — Expert Tutoring That Delivers Results',
        description: 'Personalized tutoring for students and professionals in Dubai.',
        type: 'website',
    },
};

const CURRICULA = ['IB', 'IGCSE', 'CBSE', 'A-Level', 'MYP', 'AP'];

const FAQ_ITEMS = [
    { q: "How does the free demo work?", a: "Book a 30-minute session with an expert tutor. No commitments — just see if we're the right fit for your learning goals." },
    { q: "What curricula do you cover?", a: "We specialize in IB (MYP & DP), IGCSE, A-Level, CBSE, and ICSE. We also offer professional courses in AI, Data Science, and Programming." },
    { q: "Are sessions online or in-person?", a: "All sessions are conducted online via Google Meet, giving you flexibility to learn from anywhere in Dubai or globally." },
    { q: "How are tutors selected?", a: "Every tutor is vetted for subject expertise, teaching ability, and communication skills. We match you with the best fit for your specific needs." },
    { q: "What subjects do you offer for professionals?", a: "We cover AI & Machine Learning, Data Science, Python/JavaScript programming, and professional degree assistance (MBA, certifications)." },
];

export default function HomePage() {
    return (
        <>
            {/* JSON-LD Structured Data */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateOrganizationSchema()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(FAQ_ITEMS)) }} />

            {/* Ambient Background Layer */}
            <div className="fixed inset-0 z-0 bg-aurora pointer-events-none"></div>

            {/* ===== HERO (Stitch Premium Layout) ===== */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
                <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary-glow mb-8 animate-fade-in-up">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Accepting New Students for Fall 2024
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline font-bold tracking-tighter leading-[1.1] mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 text-glow">
                        Expert Tutoring That<br />Delivers Results
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                        Elite mentorship for IB, Cambridge, and Edexcel curriculums. We combine data-driven strategies with personalized coaching to unlock potential.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto z-10">
                        <Link href="#book-demo" className="w-full sm:w-auto">
                            <button className="btn-glow bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-semibold text-lg w-full flex items-center justify-center gap-2 font-headline">
                                Book Free Demo
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>
                        <Link href="/services/k12" className="w-full sm:w-auto">
                            <button className="px-8 py-4 rounded-lg font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors w-full flex items-center justify-center gap-2 group border border-transparent hover:border-white/10 font-headline">
                                Explore Services
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===== SOCIAL PROOF MARQUEE (Stitch Version) ===== */}
            <div className="w-full border-y border-white/5 bg-black/20 overflow-hidden py-10 relative">
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background-dark to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background-dark to-transparent z-10 pointer-events-none"></div>
                
                <div className="flex whitespace-nowrap animate-marquee">
                    {/* Create 3 duplicate sets for a seamless infinite loop */}
                    {[1, 2, 3].map((setIndex) => (
                        <div key={`set-${setIndex}`} className="flex items-center gap-16 mx-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                            {CURRICULA.map((curriculum) => (
                                <span key={`${setIndex}-${curriculum}`} className="text-2xl font-headline font-bold tracking-widest text-slate-300">
                                    {curriculum}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* ===== SERVICES (Stitch Premium Layout) ===== */}
            <section className="py-32 px-6 relative">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-20 animate-fade-in-up">
                        <h2 className="text-3xl md:text-5xl font-headline font-bold mb-6 text-white">Pathways to <span className="text-primary-glow">Excellence</span></h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">Whether you are aiming for perfect IB scores or looking to pivot into Data Science, we have a structured program for you.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* K-12 Card */}
                        <div className="glass-panel p-8 md:p-10 flex flex-col group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-500 -translate-y-1/2 translate-x-1/2"></div>
                            
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 relative z-10">
                                <GraduationCap className="w-7 h-7 text-primary-glow" />
                            </div>
                            
                            <h3 className="text-3xl font-headline font-bold text-white mb-4 relative z-10">K-12 Tutoring</h3>
                            <p className="text-slate-400 leading-relaxed mb-8 relative z-10">
                                Master the complexities of IB DP, Cambridge IGCSE, and A-Levels. From IA reviews to rigorous final exam prep.
                            </p>
                            
                            <ul className="mb-10 space-y-4 relative z-10">
                                {['IB MYP & DP', 'IGCSE & A-Level', 'Math, Physics, Chem'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary-glow"></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            
                            <Link href="/services/k12" className="mt-auto relative z-10">
                                <button className="w-full py-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 font-semibold text-white transition-all flex items-center justify-center gap-2 group-hover:border-primary/50">
                                    View Program Details
                                    <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </button>
                            </Link>
                        </div>

                        {/* Professional Card */}
                        <div className="glass-panel p-8 md:p-10 flex flex-col group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl group-hover:bg-violet-500/20 transition-colors duration-500 -translate-y-1/2 -translate-x-1/2"></div>
                            
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 relative z-10">
                                <Briefcase className="w-7 h-7 text-violet-400" />
                            </div>
                            
                            <h3 className="text-3xl font-headline font-bold text-white mb-4 relative z-10">Professional <span className="text-violet-400">Upskilling</span></h3>
                            <p className="text-slate-400 leading-relaxed mb-8 relative z-10">
                                Future-proof your career with intensive, 1-on-1 coaching in AI, Data Science, and modern Software Engineering.
                            </p>
                            
                            <ul className="mb-10 space-y-4 relative z-10">
                                {['AI & Machine Learning', 'Data Science & Analytics', 'Executive Tech Literacy'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-violet-400"></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            
                            <Link href="/services/professional" className="mt-auto relative z-10">
                                <button className="w-full py-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 font-semibold text-white transition-all flex items-center justify-center gap-2 group-hover:border-violet-500/50">
                                    View Career Tracks
                                    <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section className="py-24 px-6 bg-card/20 border-y border-border/20">
                <div className="max-w-4xl mx-auto">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-16">How It Works</h2>

                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            { icon: Target, step: "01", title: "Tell Us What You Need", desc: "Share your subject, curriculum, and goals. We'll find the perfect match." },
                            { icon: Users, step: "02", title: "Meet Your Expert", desc: "Get matched with a vetted tutor who specializes in your exact needs." },
                            { icon: Sparkles, step: "03", title: "Start Learning", desc: "Join your first session—online, flexible, and designed around you." },
                        ].map(({ icon: Icon, step, title, desc }) => (
                            <div key={step} className="text-center space-y-4">
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                                    <Icon className="w-7 h-7 text-primary" />
                                </div>
                                <div className="text-xs font-mono text-primary tracking-widest">{step}</div>
                                <h3 className="font-headline text-lg font-bold">{title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIALS ===== */}
            <TestimonialGrid />

            {/* ===== LEAD CAPTURE ===== */}
            <section id="book-demo" className="py-24 px-6">
                <div className="max-w-lg mx-auto">
                    <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 md:p-10">
                        <div className="text-center mb-8">
                            <h2 className="font-headline text-2xl md:text-3xl font-bold mb-2">Book Your Free Demo</h2>
                            <p className="text-sm text-muted-foreground">3 fields. 30 seconds. We&apos;ll call you within 2 hours.</p>
                        </div>
                        <LeadCaptureForm variant="minimal" />
                    </div>
                </div>
            </section>

            {/* ===== FAQ ===== */}
            <section className="py-24 px-6 bg-card/20 border-t border-border/20">
                <div className="max-w-2xl mx-auto">
                    <h2 className="font-headline text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible className="space-y-2">
                        {FAQ_ITEMS.map((item, i) => (
                            <AccordionItem key={i} value={`faq-${i}`} className="border border-border/30 rounded-xl px-6 bg-card/30">
                                <AccordionTrigger className="text-left font-semibold text-sm hover:no-underline">
                                    {item.q}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                                    {item.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>
        </>
    );
}
