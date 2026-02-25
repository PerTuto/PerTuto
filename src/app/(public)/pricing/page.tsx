'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { DecryptedText } from '@/components/public/decrypted-text';

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'termly'>('monthly');

    return (
        <main className="flex-1 flex flex-col items-center w-full max-w-6xl mx-auto px-6 py-16">

            {/* ===== HERO ===== */}
            <div className="text-center max-w-3xl mx-auto mb-14 animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight mb-6 text-foreground flex flex-col items-center justify-center">
                    <DecryptedText text="Predictable Pricing for" speed={40} />
                    <span className="text-primary mt-2"><DecryptedText text="Exceptional Results" speed={40} /></span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
                    Invest in your academic future with elite mentorship. No hidden fees, just pure intellectual growth.
                </p>
            </div>

            {/* ===== BILLING TOGGLE ===== */}
            <div className="flex justify-center mb-16 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <div className="relative flex p-1.5 rounded-full bg-secondary border border-border">
                    <div className="relative z-0 flex">
                        <label className="group relative flex cursor-pointer items-center justify-center px-8 py-2.5">
                            <input 
                                className="peer sr-only" 
                                name="billing" 
                                type="radio" 
                                value="monthly" 
                                checked={billingCycle === 'monthly'}
                                onChange={() => setBillingCycle('monthly')}
                            />
                            <span className="absolute inset-0 rounded-full bg-white shadow-sm opacity-0 peer-checked:opacity-100 transition-all duration-300 ease-out"></span>
                            <span className={`relative z-10 text-sm font-bold transition-colors ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>Monthly</span>
                        </label>
                        <label className="group relative flex cursor-pointer items-center justify-center px-8 py-2.5">
                            <input 
                                className="peer sr-only" 
                                name="billing" 
                                type="radio" 
                                value="termly"
                                checked={billingCycle === 'termly'}
                                onChange={() => setBillingCycle('termly')}
                            />
                            <span className="absolute inset-0 rounded-full bg-white shadow-sm opacity-0 peer-checked:opacity-100 transition-all duration-300 ease-out"></span>
                            <span className={`relative z-10 text-sm font-bold transition-colors flex items-center gap-2 ${billingCycle === 'termly' ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                                Termly 
                                <span className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">Save 15%</span>
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            {/* ===== PRICING TIERS ===== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full items-start animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                
                {/* Tier 1: Diagnostic Trial */}
                <div className="relative group flex flex-col p-8 rounded-3xl border border-border bg-white hover:border-primary/20 transition-all duration-300 mt-0 lg:mt-8 shadow-sm">
                    <div className="mb-8">
                        <h3 className="text-xl font-headline font-bold text-foreground mb-2">Diagnostic Trial</h3>
                        <p className="text-sm text-muted-foreground min-h-[40px] leading-relaxed">Perfect for understanding your current baseline and potential.</p>
                    </div>
                    
                    <div className="flex items-baseline gap-1 mb-8">
                        <span className="text-5xl font-headline font-bold text-foreground tracking-tight">AED 350</span>
                        <span className="text-muted-foreground font-medium text-sm">/one-time</span>
                    </div>
                    
                    <Link href="/contact?package=trial" className="w-full mb-8">
                        <button className="w-full py-4 px-6 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-sm border border-border transition-all">
                            Book Assessment
                        </button>
                    </Link>
                    
                    <div className="space-y-6 flex-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">What&apos;s Included</p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm text-foreground/80">
                                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <span>Complete academic & skills audit</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-foreground/80">
                                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <span>Initial 2-hour 1-on-1 session</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-foreground/80">
                                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <span>Custom 3-month roadmap creation</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-muted-foreground/50 line-through">
                                <XCircle className="w-5 h-5 text-muted-foreground/30 shrink-0 mt-0.5" />
                                <span>Ongoing chat support</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Tier 2: Monthly Retainer (Most Popular) */}
                <div className="relative z-20 flex flex-col p-8 sm:p-10 rounded-3xl border-2 border-primary bg-white shadow-xl shadow-primary/10 transform md:-translate-y-4 transition-transform duration-300">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <div className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-primary/30 tracking-widest uppercase flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                            Most Popular
                        </div>
                    </div>
                    
                    <div className="mb-6 mt-4">
                        <h3 className="text-2xl font-headline font-bold text-primary mb-2">Retainer</h3>
                        <p className="text-sm text-muted-foreground min-h-[40px] leading-relaxed">Comprehensive support for sustained academic or career growth.</p>
                    </div>
                    
                    <div className="flex items-baseline gap-1 mb-8">
                        <span className="text-6xl font-headline font-bold text-foreground tracking-tight">AED {billingCycle === 'monthly' ? '2,800' : '2,380'}</span>
                        <span className="text-muted-foreground font-medium text-sm">/month</span>
                    </div>

                    {billingCycle === 'termly' && (
                        <div className="mb-6 -mt-4 text-sm text-emerald-600 font-medium">Billed termly as AED 7,140</div>
                    )}
                    
                    <Link href="/contact?package=retainer" className="w-full mb-10">
                        <button className="btn-primary w-full py-4 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                            Start Membership
                        </button>
                    </Link>
                    
                    <div className="space-y-6 flex-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-primary/70">Everything in Trial, plus</p>
                        <ul className="space-y-4">
                            {['8 hours of 1-on-1 live sessions/mo', 'Unlimited WhatsApp chat support', 'Bi-weekly progress analytics', 'Access to recorded session vault', 'Exam technique workshops'].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-foreground font-medium">
                                    <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Tier 3: Intensive Bootcamp */}
                <div className="relative group flex flex-col p-8 rounded-3xl border border-border bg-white hover:border-primary/20 transition-all duration-300 mt-0 lg:mt-8 shadow-sm">
                    <div className="mb-8">
                        <h3 className="text-xl font-headline font-bold text-foreground mb-2">Intensive Bootcamp</h3>
                        <p className="text-sm text-muted-foreground min-h-[40px] leading-relaxed">High-impact, rapid preparation for critical examination periods.</p>
                    </div>
                    
                    <div className="flex items-baseline gap-1 mb-8">
                        <span className="text-5xl font-headline font-bold text-foreground tracking-tight">AED 5,500</span>
                        <span className="text-muted-foreground font-medium text-sm">/block</span>
                    </div>
                    
                    <Link href="/contact?package=bootcamp" className="w-full mb-8">
                        <button className="w-full py-4 px-6 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-sm border border-border transition-colors">
                            Join Waitlist
                        </button>
                    </Link>
                    
                    <div className="space-y-6 flex-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Targeted Focus</p>
                        <ul className="space-y-4">
                            {['20 hours of focused revision', 'Mock exams + examiner feedback', 'Targeted past-paper walkthroughs', 'Priority scheduling block'].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                                    <CheckCircle className="w-5 h-5 text-muted-foreground/50 shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            </div>

            {/* ===== CUSTOM QUOTE ===== */}
            <div className="mt-24 max-w-3xl mx-auto w-full text-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <div className="glass-panel p-10 rounded-3xl">
                    <h3 className="font-headline text-2xl font-bold mb-4 text-foreground">Have specific needs?</h3>
                    <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Custom corporate upskilling packages or multi-student K-12 pricing available. Connect with our directors directly.</p>
                    <Link href="/contact?request=custom">
                        <button className="px-8 py-4 rounded-xl font-semibold text-foreground bg-secondary hover:bg-secondary/80 border border-border transition-colors">
                            Request Custom Quote
                        </button>
                    </Link>
                </div>
            </div>

        </main>
    );
}
