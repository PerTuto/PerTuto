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
import { adminFirestore } from '@/lib/firebase/admin-app';
import type { WebsiteContent } from '@/lib/types';

export const revalidate = 3600; // Enable ISR (revalidate every hour)

async function getHomePageContent(): Promise<any> {
    // For the UI prototype, we bypass the CMS to prevent auth/credential errors and use the hardcoded fallback copy
    return null;
}

export async function generateMetadata(): Promise<Metadata> {
    const content = await getHomePageContent();
    return {
        title: content?.seoTitle || 'PerTuto — Expert Tutoring for Students & Professionals in Dubai',
        description: content?.seoDescription || 'Personalized tutoring for IB, IGCSE, CBSE, A-Level students and AI/Data Science upskilling for professionals. Book your free demo class today.',
        openGraph: {
            title: content?.seoTitle || 'PerTuto — Expert Tutoring That Delivers Results',
            description: content?.seoDescription || 'Personalized tutoring for students and professionals in Dubai.',
            type: 'website',
            images: [
                {
                    url: 'https://pertuto.com/og-image.png',
                    width: 1200,
                    height: 630,
                    alt: 'PerTuto — Personalized Expert Tutoring',
                },
            ],
        },
    };
}

const CURRICULA = ['IB', 'IGCSE', 'CBSE', 'A-Level', 'MYP', 'AP'];

const FAQ_ITEMS = [
    { q: "How does the free demo work?", a: "Book a 30-minute session with an expert tutor. No commitments — just see if we're the right fit for your learning goals." },
    { q: "What curricula do you cover?", a: "We specialize in IB (MYP & DP), IGCSE, A-Level, CBSE, and ICSE. We also offer professional courses in AI, Data Science, and Programming." },
    { q: "Are sessions online or in-person?", a: "All sessions are conducted online via Google Meet, giving you flexibility to learn from anywhere in Dubai or globally." },
    { q: "How are tutors selected?", a: "Every tutor is vetted for subject expertise, teaching ability, and communication skills. We match you with the best fit for your specific needs." },
    { q: "What subjects do you offer for professionals?", a: "We cover AI & Machine Learning, Data Science, Python/JavaScript programming, and professional degree assistance (MBA, certifications)." },
];

import { DecryptedText } from '@/components/public/decrypted-text';
import { AnimatedStatsBar } from '@/components/public/animated-stats-bar';
import { ConstellationBackground } from '@/components/public/constellation-background';
import { TiltCard } from '@/components/public/tilt-card';
import { NeuralPathway } from '@/components/public/neural-pathway';
import { BouncyText } from '@/components/public/bouncy-text';
import { OrbitalCurriculum } from '@/components/public/orbital-curriculum';
import { FloatingFormulas } from '@/components/public/floating-formulas';
import { LabExperience } from '@/components/public/lab-experience';
import { ColorBreathing } from '@/components/public/color-breathing';

export default async function HomePage() {
    const content = await getHomePageContent();
    
    // Fallbacks to default marketing copy if the CMS is empty
    const hero = content?.hero?.title ? content.hero : {
        badgeText: "Book Your Free Demo",
        title: "Learning as unique as you",
        subtitle: "Personalized mentorship for K-12 students, university learners, and working professionals. IB, Cambridge, CBSE, AI & Data Science — we cover it all.",
        primaryCtaText: "Book Free Demo",
        primaryCtaLink: "#book-demo",
        secondaryCtaText: "Explore Services",
        secondaryCtaLink: "/services/k12"
    };

    return (
        <>
            {/* JSON-LD Structured Data */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateOrganizationSchema()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(FAQ_ITEMS)) }} />

            {/* ===== HERO (NIKE STYLE EXPERIMENT) ===== */}
            <section className="relative min-h-[100svh] flex items-center justify-start px-6 md:px-16 overflow-visible text-foreground" style={{ backgroundColor: '#f4f3f8' }}>
                {/* Interactive constellation background */}
                <ConstellationBackground />
                <ColorBreathing />

                <div className="max-w-7xl mx-auto w-full flex flex-col items-start relative z-10 pt-20">
                    {/* Badge */}
                    {hero.badgeText && (
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary/10 border border-primary/20 rounded-full backdrop-blur-md text-xs font-bold uppercase tracking-widest text-primary mb-8 animate-fade-in-up">
                            {hero.badgeText}
                        </div>
                    )}

                    <h1 className="mb-6" style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)" }}>
                        <BouncyText
                            text={hero.title}
                            highlightWord="unique"
                            highlightClass="text-primary"
                            className="font-headline font-black tracking-tighter uppercase leading-[1.0] text-foreground"
                            staggerMs={120}
                            as="span"
                        />
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg md:text-2xl text-foreground/70 max-w-3xl mb-10 font-medium leading-relaxed">
                        {hero.subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                        <Link href={hero.primaryCtaLink || "#book-demo"} className="w-full sm:w-auto">
                            <button className="bg-primary text-white px-8 py-4 rounded-full font-bold text-base md:text-lg uppercase tracking-wider w-full flex items-center justify-center gap-3 shadow-[0_4px_0_0_hsl(var(--primary)/0.6)] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_hsl(var(--primary)/0.6)] active:translate-y-[4px] active:shadow-none transition-all duration-100 group">
                                {hero.primaryCtaText || "Book Free Demo"}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                            </button>
                        </Link>
                        <Link href={hero.secondaryCtaLink || "/services/k12"} className="w-full sm:w-auto">
                            <button className="bg-transparent text-foreground px-8 py-4 rounded-full font-bold text-base md:text-lg uppercase tracking-wider w-full flex items-center justify-center gap-3 border-2 border-foreground/30 hover:border-foreground hover:bg-foreground hover:text-background hover:scale-[1.03] transition-all duration-300 group">
                                {hero.secondaryCtaText || "Explore Services"}
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===== CURRICULUM ORBITAL GLOBE ===== */}
            <div className="w-full border-y border-border/40 overflow-hidden relative" style={{ backgroundColor: '#eef5f3' }}>
                <div className="max-w-4xl mx-auto py-6" style={{ height: '360px' }}>
                    <OrbitalCurriculum />
                </div>
            </div>

            {/* ===== ANIMATED PROOF BAR ===== */}
            <AnimatedStatsBar />

            {/* ===== SERVICES ===== */}
            <section className="py-24 md:py-32 px-6 text-foreground" style={{ backgroundColor: '#faf9f7' }}>
                <div className="max-w-7xl mx-auto">
                    <AnimatedSection className="mb-14 ps-6 md:ps-0 border-s-4 border-primary">
                        <h2 
                            className="font-headline font-black uppercase mb-4 text-black tracking-[-0.03em] ps-6"
                            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1 }}
                        >
                            Pathways<br/><span className="text-primary">To Excellence</span>
                        </h2>
                        <p className="text-muted-foreground max-w-2xl text-base md:text-lg font-medium ps-6">Whether you&apos;re aiming for perfect IB scores or looking to pivot into Data Science, we have a structured program for you.</p>
                    </AnimatedSection>

                    <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 pb-4 snap-x snap-mandatory hide-scrollbar">
                        {/* K-12 */}
                        <AnimatedSection delay={100} className="h-full min-w-[85vw] md:min-w-0 snap-center">
                          <TiltCard className="h-full">
                            <div className="relative p-8 flex flex-col group h-[50vh] min-h-[380px] overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-primary/[0.02] border border-border/50 shadow-[0_0_20px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_30px_rgba(0,0,0,0.08)] hover:border-primary/30 transition-all duration-500">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-auto">
                                    <GraduationCap className="w-6 h-6 text-primary animate-float" />
                                </div>
                                
                                <div className="flex flex-col mt-auto">
                                    <h3 className="text-3xl md:text-4xl font-headline font-black text-foreground uppercase tracking-tighter mb-3 transition-transform duration-500 group-hover:-translate-y-3">K-12 <br/><span className="text-primary">Tutoring</span></h3>
                                    
                                    <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 overflow-hidden translate-y-4 group-hover:translate-y-0">
                                        <p className="text-muted-foreground font-medium mb-5 text-sm md:text-base leading-relaxed">
                                            Master the complexities of IB DP, Cambridge IGCSE, and A-Levels. Rigorous prep for high performers.
                                        </p>
                                        <Link href="/services/k12">
                                            <button className="bg-foreground text-background px-6 py-3 rounded-full font-bold uppercase tracking-wider text-xs flex items-center gap-2 hover:bg-primary hover:text-white transition-colors">
                                                View Program
                                                <ArrowRight className="w-4 h-4" />
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
                                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-auto">
                                    <Briefcase className="w-6 h-6 text-amber-600 animate-float" style={{ animationDelay: '1s' }} />
                                </div>
                                
                                <div className="flex flex-col mt-auto">
                                    <h3 className="text-3xl md:text-4xl font-headline font-black text-foreground uppercase tracking-tighter mb-3 transition-transform duration-500 group-hover:-translate-y-3">Professional <br/><span className="text-amber-600">Upskilling</span></h3>
                                    
                                    <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 overflow-hidden translate-y-4 group-hover:translate-y-0">
                                        <p className="text-muted-foreground font-medium mb-5 text-sm md:text-base leading-relaxed">
                                            Future-proof your career with intensive, 1-on-1 coaching in AI, Data Science, and modern Software Engineering.
                                        </p>
                                        <Link href="/services/professional">
                                            <button className="bg-foreground text-background px-6 py-3 rounded-full font-bold uppercase tracking-wider text-xs flex items-center gap-2 hover:bg-amber-600 hover:text-white transition-colors">
                                                View Tracks
                                                <ArrowRight className="w-4 h-4" />
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
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-auto">
                                    <BookOpen className="w-6 h-6 text-indigo-600 animate-float" style={{ animationDelay: '2s' }} />
                                </div>
                                
                                <div className="flex flex-col mt-auto">
                                    <h3 className="text-3xl md:text-4xl font-headline font-black text-foreground uppercase tracking-tighter mb-3 transition-transform duration-500 group-hover:-translate-y-3">Higher <br/><span className="text-indigo-600">Education</span></h3>
                                    
                                    <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 overflow-hidden translate-y-4 group-hover:translate-y-0">
                                        <p className="text-muted-foreground font-medium mb-5 text-sm md:text-base leading-relaxed">
                                            Bridge the gap between academia and industry. Deep support for university students and online degrees.
                                        </p>
                                        <Link href="/services/university">
                                            <button className="bg-foreground text-background px-6 py-3 rounded-full font-bold uppercase tracking-wider text-xs flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-colors">
                                                View Advisory
                                                <ArrowRight className="w-4 h-4" />
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

            {/* ===== HOW IT WORKS ===== */}
            <section className="py-24 md:py-32 px-6 text-foreground" style={{ backgroundColor: '#f0f2f5' }}>
                <div className="max-w-4xl mx-auto">
                    <AnimatedSection className="text-center mb-16">
                        <h2 className="font-headline text-4xl md:text-6xl font-black mb-4 uppercase tracking-[-0.03em] text-black">How It Works</h2>
                        <p className="text-muted-foreground font-semibold text-lg">Three simple steps to get started</p>
                    </AnimatedSection>

                    <div className="relative">
                        {/* Neural Pathway SVG connector */}
                        <NeuralPathway />

                        <div className="grid md:grid-cols-3 gap-10 relative z-10">
                            {[
                                { icon: Target, step: "01", title: "Tell Us What You Need", desc: "Share your subject, curriculum, and goals. We'll find the perfect match." },
                                { icon: Users, step: "02", title: "Meet Your Expert", desc: "Get matched with a vetted tutor who specializes in your exact needs." },
                                { icon: Sparkles, step: "03", title: "Start Learning", desc: "Join your first session—online, flexible, and designed around you." },
                            ].map(({ icon: Icon, step, title, desc }, index) => (
                                <AnimatedSection key={step} delay={index * 150}>
                                    <div className="text-center space-y-6">
                                        <div className="w-20 h-20 rounded-full border-2 border-emerald-500 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(52,211,153,0.2)] bg-background">
                                            <Icon className="w-8 h-8 text-emerald-500" />
                                        </div>
                                        <div className="text-sm font-mono text-emerald-500 tracking-widest font-black uppercase">{step}</div>
                                        <h3 className="font-headline text-2xl font-black text-foreground">{title}</h3>
                                        <p className="text-base text-muted-foreground leading-relaxed font-medium">{desc}</p>
                                    </div>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIALS ===== */}
            <TestimonialGrid />

            {/* ===== LAB EXPERIENCE ===== */}
            <div className="border-y border-border/40" style={{ backgroundColor: '#faf6ef' }}>
              <LabExperience />
            </div>

            {/* ===== LEAD CAPTURE ===== */}
            <section id="book-demo" className="py-28 md:py-36 px-6 bg-foreground text-background relative overflow-hidden">
                <FloatingFormulas />
                <AnimatedSection>
                    <div className="max-w-lg mx-auto">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.07] backdrop-blur-sm p-8 md:p-10 shadow-[0_0_40px_rgba(0,0,0,0.15)]">
                            <div className="text-center mb-8">
                                <h2 className="font-headline text-2xl md:text-3xl font-black mb-2 text-white">Book Your Free Demo</h2>
                                <p className="text-sm text-white/60">3 fields. 30 seconds. We&apos;ll call you within 2 hours.</p>
                            </div>
                            <LeadCaptureForm variant="minimal" />
                        </div>
                    </div>
                </AnimatedSection>
            </section>

            {/* ===== FAQ ===== */}
            <section className="py-24 md:py-32 px-6 border-t border-border/40" style={{ backgroundColor: '#f7f7f9' }}>
                <div className="max-w-2xl mx-auto">
                    <AnimatedSection className="text-center mb-12">
                        <h2 className="font-headline text-3xl font-black text-black tracking-[-0.03em]">Frequently Asked Questions</h2>
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
                </div>
            </section>
        </>
    );
}
