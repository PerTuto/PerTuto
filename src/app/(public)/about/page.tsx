import type { Metadata } from 'next';
import { SpotlightCard } from '@/components/public/spotlight-card';
import { GraduationCap, Target, ShieldCheck, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'About PerTuto — Our Story & Philosophy',
    description: 'Learn about PerTuto\'s mission to provide elite, personalized tutoring for students and professionals in Dubai.',
};

export default function AboutPage() {
    return (
        <>

            {/* ===== HERO ===== */}
            <section className="relative pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold tracking-tight">
                        Elevating Education in <span className="text-primary">Dubai</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        We don&apos;t just teach subjects. We build systems of thought. PerTuto was founded to bridge the gap between rote memorization and true, intuitive understanding.
                    </p>
                </div>
            </section>

            {/* ===== OUR STORY ===== */}
            <section className="py-20 px-6 bg-secondary/30 border-y border-border">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary mb-4">
                            Our Story
                        </div>
                        <h2 className="text-3xl md:text-4xl font-headline font-bold">Built by Educators. Driven by Results.</h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                PerTuto began with a simple observation: standard classrooms in Dubai are overflowing, leaving highly capable students slipping through the cracks due to a lack of personalized attention.
                            </p>
                            <p>
                                We realized that the difference between an average grade and absolute excellence isn&apos;t intelligence—it&apos;s <strong>methodology</strong>. We built PerTuto to provide the 1-on-1 mentorship that unlocks a student&apos;s actual potential. 
                            </p>
                            <p>
                                Today, we serve K-12 students navigating rigorous curricula (IB, IGCSE) and ambitious professionals seeking to upskill in AI and Data Science.
                            </p>
                        </div>
                    </div>
                    {/* Placeholder for Founder Image or Abstract Graphic */}
                    <div className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border border-border flex items-center justify-center p-8">
                        <blockquote className="relative z-10 text-xl md:text-2xl font-headline font-medium leading-snug text-center">
                            "Education shouldn't be standardized. It should be as unique as the student."
                            <footer className="mt-4 text-sm font-body text-primary">— Ankur Kakkar, Founder</footer>
                        </blockquote>
                    </div>
                </div>
            </section>

            {/* ===== THE PERTUTO DIFFERENCE ===== */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">The PerTuto Difference</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">Why 200+ families and professionals in Dubai trust us with their educational journey.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            {
                                icon: ShieldCheck,
                                title: "Elite Vetted Tutors",
                                desc: "We accept less than 5% of applicants. Our tutors are subject matter experts with proven track records in the UAE curriculum landscape."
                            },
                            {
                                icon: Target,
                                title: "Bespoke Learning Plans",
                                desc: "No cookie-cutter syllabi. We assess your specific gaps, learning style, and goals to build a roadmap designed strictly for your success."
                            },
                            {
                                icon: GraduationCap,
                                title: "Outcome-Obsessed",
                                desc: "We track metrics, analyze performance trends, and adjust strategies dynamically. We hold ourselves accountable for your final grades."
                            },
                            {
                                icon: Users,
                                title: "Direct Mentorship",
                                desc: "Beyond academic tutoring, we provide mentorship. We teach study systems, time management, and exam psychology."
                            }
                        ].map((core, i) => (
                            <SpotlightCard key={i}>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <core.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-headline text-xl font-bold mb-2">{core.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{core.desc}</p>
                                    </div>
                                </div>
                            </SpotlightCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA ===== */}
            <section className="py-20 px-6 bg-primary/[0.03] border-t border-border text-center">
                <div className="max-w-2xl mx-auto space-y-8">
                     <h2 className="font-headline text-3xl font-bold">Ready to experience the difference?</h2>
                     <p className="text-muted-foreground">Stop settling for average results. Speak directly with our lead academic advisor today.</p>
                     <Link href="/contact">
                        <Button size="lg" className="h-12 px-8">Book Your Consultation</Button>
                     </Link>
                </div>
            </section>
        </>
    );
}
