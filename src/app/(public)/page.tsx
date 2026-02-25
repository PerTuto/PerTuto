import type { Metadata } from 'next';
import { SpotlightCard } from '@/components/public/spotlight-card';
import { LeadCaptureForm } from '@/components/public/lead-capture-form';
import { TestimonialGrid } from '@/components/public/testimonial-grid';
import { AnimatedSection } from '@/components/public/animated-section';
import { FluidBlob } from '@/components/public/fluid-blob';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, GraduationCap, Briefcase, Target, Users, Sparkles, BookOpen } from 'lucide-react';
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

import { DecryptedText } from '@/components/public/decrypted-text';

// ... (existing code and imports)

export default function HomePage() {
    return (
        <>
            {/* JSON-LD Structured Data */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateOrganizationSchema()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(FAQ_ITEMS)) }} />

            {/* ===== HERO ===== */}
            <section className="relative pt-24 pb-20 md:pt-36 md:pb-28 px-6 overflow-hidden">
                <FluidBlob />
                <div className="max-w-5xl mx-auto text-center flex flex-col items-center relative z-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-xs font-medium text-primary mb-8 animate-fade-in-up">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Book Your Free Demo
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline font-bold tracking-tighter leading-[1.05] mb-6 text-foreground">
                        <DecryptedText text="Expert Tutoring That" speed={50} /><br />
                        <DecryptedText text="Delivers Results" speed={40} />
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                        Personalized mentorship for K-12 students, university learners, and working professionals. IB, Cambridge, CBSE, AI & Data Science — we cover it all.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                        <Link href="#book-demo" className="w-full sm:w-auto">
                            <button className="btn-primary px-8 py-4 rounded-xl font-semibold text-lg w-full flex items-center justify-center gap-2 font-headline">
                                Book Free Demo
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>
                        <Link href="/services/k12" className="w-full sm:w-auto">
                            <button className="px-8 py-4 rounded-xl font-semibold text-foreground/70 hover:text-foreground hover:bg-secondary transition-colors w-full flex items-center justify-center gap-2 group border border-border hover:border-primary/20 font-headline">
                                Explore Services
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===== CURRICULUM MARQUEE ===== */}
            <div className="w-full border-y border-border overflow-hidden py-10 relative bg-secondary/50">
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

                <div className="flex whitespace-nowrap animate-marquee">
                    {[1, 2, 3].map((setIndex) => (
                        <div key={`set-${setIndex}`} className="flex items-center gap-16 mx-8 opacity-30 hover:opacity-70 transition-all duration-500">
                            {CURRICULA.map((curriculum) => (
                                <span key={`${setIndex}-${curriculum}`} className="text-2xl font-headline font-bold tracking-widest text-foreground">
                                    {curriculum}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* ===== SERVICES ===== */}
            <section className="py-24 md:py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <AnimatedSection className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-headline font-bold mb-6 text-foreground">Pathways to <span className="text-primary">Excellence</span></h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Whether you&apos;re aiming for perfect IB scores or looking to pivot into Data Science, we have a structured program for you.</p>
                    </AnimatedSection>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* K-12 Card */}
                        <AnimatedSection delay={100}>
                            <div className="glass-panel p-8 md:p-10 flex flex-col group h-full">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8">
                                    <GraduationCap className="w-7 h-7 text-primary" />
                                </div>

                                <h3 className="text-3xl font-headline font-bold text-foreground mb-4">K-12 Tutoring</h3>
                                <p className="text-muted-foreground leading-relaxed mb-8">
                                    Master the complexities of IB DP, Cambridge IGCSE, and A-Levels. From IA reviews to rigorous final exam prep.
                                </p>

                                <ul className="mb-10 space-y-4">
                                    {['IB MYP & DP', 'IGCSE & A-Level', 'Math, Physics, Chemistry'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-foreground/80">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <Link href="/services/k12" className="mt-auto">
                                    <button className="w-full py-4 rounded-xl bg-secondary hover:bg-primary/10 border border-border font-semibold text-foreground transition-all flex items-center justify-center gap-2 group-hover:border-primary/30">
                                        View Program Details
                                        <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </button>
                                </Link>
                            </div>
                        </AnimatedSection>

                        {/* Professional Card */}
                        <AnimatedSection delay={200}>
                            <div className="glass-panel p-8 md:p-10 flex flex-col group h-full">
                                <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center mb-8">
                                    <Briefcase className="w-7 h-7 text-foreground/70" />
                                </div>

                                <h3 className="text-3xl font-headline font-bold text-foreground mb-4">Professional <span className="text-primary">Upskilling</span></h3>
                                <p className="text-muted-foreground leading-relaxed mb-8">
                                    Future-proof your career with intensive, 1-on-1 coaching in AI, Data Science, and modern Software Engineering.
                                </p>

                                <ul className="mb-10 space-y-4">
                                    {['AI & Machine Learning', 'Data Science & Analytics', 'Executive Tech Literacy'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-foreground/80">
                                            <div className="w-1.5 h-1.5 rounded-full bg-foreground/40"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <Link href="/services/professional" className="mt-auto">
                                    <button className="w-full py-4 rounded-xl bg-secondary hover:bg-foreground/5 border border-border font-semibold text-foreground transition-all flex items-center justify-center gap-2 group-hover:border-foreground/20">
                                        View Career Tracks
                                        <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </button>
                                </Link>
                            </div>
                        </AnimatedSection>

                        {/* University & Adult Learners Card */}
                        <AnimatedSection delay={300}>
                            <div className="glass-panel p-8 md:p-10 flex flex-col group h-full">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8">
                                    <BookOpen className="w-7 h-7 text-emerald-600" />
                                </div>

                                <h3 className="text-3xl font-headline font-bold text-foreground mb-4">Higher <span className="text-emerald-600">Education</span></h3>
                                <p className="text-muted-foreground leading-relaxed mb-8">
                                    Bridge the gap between academia and industry. Deep support for university students and professionals in online degrees.
                                </p>

                                <ul className="mb-10 space-y-4">
                                    {['Thesis & Research Help', 'Assignment Decoding', 'Career Trajectory'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-foreground/80">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <Link href="/services/university" className="mt-auto">
                                    <button className="w-full py-4 rounded-xl bg-secondary hover:bg-emerald-500/5 border border-border font-semibold text-foreground transition-all flex items-center justify-center gap-2 group-hover:border-emerald-500/20">
                                        View Advisory Tracks
                                        <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </button>
                                </Link>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section className="py-24 px-6 bg-secondary/30 border-y border-border">
                <div className="max-w-4xl mx-auto">
                    <AnimatedSection className="text-center mb-16">
                        <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4 text-foreground">How It Works</h2>
                        <p className="text-muted-foreground">Three simple steps to get started</p>
                    </AnimatedSection>

                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            { icon: Target, step: "01", title: "Tell Us What You Need", desc: "Share your subject, curriculum, and goals. We'll find the perfect match." },
                            { icon: Users, step: "02", title: "Meet Your Expert", desc: "Get matched with a vetted tutor who specializes in your exact needs." },
                            { icon: Sparkles, step: "03", title: "Start Learning", desc: "Join your first session—online, flexible, and designed around you." },
                        ].map(({ icon: Icon, step, title, desc }, index) => (
                            <AnimatedSection key={step} delay={index * 150}>
                                <div className="text-center space-y-4">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                                        <Icon className="w-7 h-7 text-primary" />
                                    </div>
                                    <div className="text-xs font-mono text-primary tracking-widest font-bold">{step}</div>
                                    <h3 className="font-headline text-lg font-bold text-foreground">{title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIALS ===== */}
            <TestimonialGrid />

            {/* ===== LEAD CAPTURE ===== */}
            <section id="book-demo" className="py-24 px-6 bg-primary/[0.03]">
                <AnimatedSection>
                    <div className="max-w-lg mx-auto">
                        <div className="rounded-2xl border border-border bg-white p-8 md:p-10 shadow-sm">
                            <div className="text-center mb-8">
                                <h2 className="font-headline text-2xl md:text-3xl font-bold mb-2 text-foreground">Book Your Free Demo</h2>
                                <p className="text-sm text-muted-foreground">3 fields. 30 seconds. We&apos;ll call you within 2 hours.</p>
                            </div>
                            <LeadCaptureForm variant="minimal" />
                        </div>
                    </div>
                </AnimatedSection>
            </section>

            {/* ===== FAQ ===== */}
            <section className="py-24 px-6 border-t border-border">
                <div className="max-w-2xl mx-auto">
                    <AnimatedSection className="text-center mb-12">
                        <h2 className="font-headline text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
                    </AnimatedSection>
                    <Accordion type="single" collapsible className="space-y-2">
                        {FAQ_ITEMS.map((item, i) => (
                            <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-xl px-6 bg-white">
                                <AccordionTrigger className="text-left font-semibold text-sm hover:no-underline text-foreground">
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
