import type { Metadata } from 'next';
import { Aurora } from '@/components/public/aurora';
import { SpotlightCard } from '@/components/public/spotlight-card';
import { LeadCaptureForm } from '@/components/public/lead-capture-form';
import { PremiumButton } from '@/components/public/premium-button';
import { RevealText } from '@/components/public/reveal-text';
import { StackingSection } from '@/components/public/stacking-section';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, GraduationCap, Briefcase, Sparkles, Users, Target } from 'lucide-react';
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

            {/* ===== HERO ===== */}
            <StackingSection zIndex={10}>
                {/* Aurora is now confined to the Hero section so it doesn't leak identically across all stacks */}
                <Aurora />
                
                <section className="relative h-full flex items-center justify-center px-6">
                    <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10 w-full">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary">
                            <Sparkles className="w-4 h-4" />
                            Trusted by 200+ students across Dubai
                        </div>

                        <RevealText
                            text="Expert Tutoring That Delivers Results"
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-bold tracking-tight leading-[1.1] justify-center"
                        />

                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Personalized learning for <strong className="text-foreground">K-12 students</strong> and{' '}
                            <strong className="text-foreground">working professionals</strong> in Dubai.
                            IB, IGCSE, A-Level, CBSE + AI, Data Science & more.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Link href="#book-demo">
                                <PremiumButton>
                                    Book Free Demo <ArrowRight className="ml-2 w-4 h-4" />
                                </PremiumButton>
                            </Link>
                            <Link href="/services/k12">
                                <PremiumButton className="bg-transparent border-border hover:bg-transparent hover:border-primary/50 text-muted-foreground hover:text-foreground">
                                    Explore Services
                                </PremiumButton>
                            </Link>
                        </div>
                    </div>
                </section>
                
                {/* ===== SOCIAL PROOF MARQUEE ===== */}
                <div className="absolute bottom-0 w-full border-t border-border/20 bg-card/10 py-6 overflow-hidden backdrop-blur-sm z-20">
                    <div className="flex gap-16 animate-marquee">
                        {[...CURRICULA, ...CURRICULA].map((item, i) => (
                            <span key={i} className="font-headline font-bold text-2xl text-muted-foreground/30 whitespace-nowrap shrink-0">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </StackingSection>

            {/* ===== SOCIAL PROOF MARQUEE ===== */}
            <section className="border-y border-border/30 bg-card/30 py-8 overflow-hidden">
                <div className="flex gap-16 animate-marquee">
                    {[...CURRICULA, ...CURRICULA].map((item, i) => (
                        <span key={i} className="font-headline font-bold text-3xl text-muted-foreground/30 whitespace-nowrap shrink-0">
                            {item}
                        </span>
                    ))}
                </div>
            </section>

            {/* ===== SERVICES ===== */}
            <StackingSection zIndex={20}>
                <section className="h-full flex flex-col justify-center px-6 max-w-5xl mx-auto w-full">
                    <div className="text-center mb-16">
                        <RevealText 
                           text="What We Offer" 
                           as="h2" 
                           className="font-headline text-3xl md:text-4xl font-bold mb-4 justify-center" 
                        />
                        <p className="text-muted-foreground max-w-xl mx-auto">Two pathways to excellence — whether you&apos;re in school or leveling up your career.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Link href="/services/k12" className="block h-full">
                            <SpotlightCard className="h-full cursor-pointer border-border/20 bg-surface">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <GraduationCap className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-headline text-xl font-bold mb-2">K-12 Tutoring</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                            IB, IGCSE, A-Level, CBSE — Math, Science, English and more.
                                            From exam prep to IA rescue, we&apos;ve got your back.
                                        </p>
                                        <span className="text-primary text-sm font-semibold inline-flex items-center gap-1">
                                            Learn more <ArrowRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                </div>
                            </SpotlightCard>
                        </Link>

                        <Link href="/services/professional" className="block h-full">
                            <SpotlightCard className="h-full cursor-pointer border-border/20 bg-surface" spotlightColor="rgba(167, 139, 250, 0.15)">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                                        <Briefcase className="w-6 h-6 text-violet-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-headline text-xl font-bold mb-2">Professional Upskilling</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                            AI, Data Science, Programming, Professional Degrees.
                                            Learn the critical 90% in 10% of the time.
                                        </p>
                                        <span className="text-violet-400 text-sm font-semibold inline-flex items-center gap-1">
                                            Learn more <ArrowRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                </div>
                            </SpotlightCard>
                        </Link>
                    </div>
                </section>
            </StackingSection>

            {/* ===== HOW IT WORKS & LEAD CAPTURE ===== */}
            <StackingSection zIndex={30}>
                <section className="h-full flex flex-col justify-center px-6 max-w-5xl mx-auto w-full">
                    {/* Combine How It Works and Lead Capture into one unified interaction block */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-12">
                            <RevealText text="How It Works" as="h2" className="font-headline text-3xl md:text-4xl font-bold" />
                            <div className="space-y-8">
                                {[
                                    { icon: Target, step: "01", title: "Tell Us What You Need", desc: "Share your subject, curriculum, and goals. We'll find the perfect match." },
                                    { icon: Users, step: "02", title: "Meet Your Expert", desc: "Get matched with a vetted tutor who specializes in your exact needs." },
                                    { icon: Sparkles, step: "03", title: "Start Learning", desc: "Join your first session—online, flexible, and designed around you." },
                                ].map(({ icon: Icon, step, title, desc }) => (
                                    <div key={step} className="flex gap-6 items-start">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                                            <Icon className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-mono text-primary tracking-widest mb-1">{step}</div>
                                            <h3 className="font-headline text-lg font-bold mb-1">{title}</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ===== LEAD CAPTURE ===== */}
                        <div id="book-demo" className="rounded-2xl border border-border/20 bg-surface p-8 shadow-2xl">
                            <div className="mb-8">
                                <h3 className="font-headline text-2xl font-bold mb-2">Book Your Free Demo</h3>
                                <p className="text-sm text-muted-foreground">3 fields. 30 seconds. We'll call you immediately.</p>
                            </div>
                            <LeadCaptureForm variant="minimal" />
                        </div>
                    </div>
                </section>
            </StackingSection>

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
