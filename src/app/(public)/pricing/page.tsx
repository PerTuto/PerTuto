import type { Metadata } from 'next';
import { Aurora } from '@/components/public/aurora';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Pricing & Packages — PerTuto',
    description: 'Transparent, outcome-focused pricing for K-12 and Professional tutoring in Dubai.',
};

export default function PricingPage() {
    return (
        <>
            <Aurora colorStops={['#10B981', '#047857', '#6EE7B7']} speed={0.4} />

            {/* ===== HERO ===== */}
            <section className="relative pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary mb-2">
                        Transparent Pricing
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold tracking-tight">
                        Invest in <span className="text-primary">Outcomes</span>, Not Just Hours
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        We don't sell time. We sell structured progress. Choose the engagement model that best fits your accelerating timeline.
                    </p>
                </div>
            </section>

            {/* ===== PRICING TIERS ===== */}
            <section className="py-12 px-6">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 items-stretch">
                    
                    {/* Tier 1 */}
                    <div className="relative flex flex-col p-8 rounded-3xl border border-border/50 bg-card/40 backdrop-blur-sm transition-all hover:border-primary/50">
                        <div className="mb-8">
                            <h3 className="text-xl font-headline font-semibold mb-2">Diagnostic Trial</h3>
                            <p className="text-sm text-muted-foreground h-10">A low-risk entry to experience the PerTuto methodology firsthand.</p>
                        </div>
                        <div className="mb-8">
                            <span className="text-4xl font-headline font-bold">AED 350</span>
                            <span className="text-muted-foreground"> / one-time</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {['Initial skills assessment', '2-hour 1-on-1 session', 'Custom 3-month roadmap', 'Tutor fit guarantee'].map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <Link href="/contact?package=trial" className="w-full">
                            <Button variant="outline" className="w-full h-12">Book Trial Session</Button>
                        </Link>
                    </div>

                    {/* Tier 2 (Popular) */}
                    <div className="relative flex flex-col p-8 rounded-3xl border-2 border-primary bg-card/60 backdrop-blur-md shadow-2xl shadow-primary/10 overflow-hidden transform md:-translate-y-4">
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">
                            Most Popular
                        </div>
                        <div className="mb-8">
                            <h3 className="text-xl font-headline font-semibold mb-2">Monthly Retainer</h3>
                            <p className="text-sm text-muted-foreground h-10">Consistent, structured mentorship designed to guarantee grade improvements.</p>
                        </div>
                        <div className="mb-8">
                            <span className="text-4xl font-headline font-bold">AED 2,800</span>
                            <span className="text-muted-foreground"> / month</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {['8 hours of 1-on-1 live sessions', 'Unlimited WhatsApp chat support', 'Bi-weekly parental progress reports', 'Access to recorded session vault', 'Exam technique workshops'].map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm font-medium">
                                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <Link href="/contact?package=monthly" className="w-full">
                            <Button className="w-full h-12 bg-primary hover:bg-primary/90">Start Monthly Plan</Button>
                        </Link>
                    </div>

                    {/* Tier 3 */}
                    <div className="relative flex flex-col p-8 rounded-3xl border border-border/50 bg-card/40 backdrop-blur-sm transition-all hover:border-primary/50">
                        <div className="mb-8">
                            <h3 className="text-xl font-headline font-semibold mb-2">Intensive Bootcamp</h3>
                            <p className="text-sm text-muted-foreground h-10">Designed for final exam preparation and rapid syllabus coverage.</p>
                        </div>
                        <div className="mb-8">
                            <span className="text-4xl font-headline font-bold">AED 5,500</span>
                            <span className="text-muted-foreground"> / block</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {['20 hours of focused revision', 'Mock exams with examiner feedback', 'Targeted past-paper walkthroughs', 'Priority scheduling access'].map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <Link href="/contact?package=bootcamp" className="w-full">
                            <Button variant="outline" className="w-full h-12">Enroll in Bootcamp</Button>
                        </Link>
                    </div>

                </div>
            </section>

             {/* ===== FAQ DIRECTORY ===== */}
             <section className="py-20 px-6 max-w-3xl mx-auto text-center">
                <div className="p-8 rounded-3xl bg-muted/50 border border-border/50">
                    <h3 className="font-headline text-2xl font-bold mb-4">Have specific needs?</h3>
                    <p className="text-muted-foreground mb-6">If you need a custom corporate package or specialized multi-student pricing, talk to our directors.</p>
                    <Link href="/contact?request=custom">
                        <Button variant="secondary">Request Custom Quote</Button>
                    </Link>
                </div>
             </section>
        </>
    );
}
