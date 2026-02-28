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
            {/* ===== PRICING TIERS ===== */}
            <div className="w-full max-w-4xl mx-auto items-start animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                {billingCycle === 'monthly' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                        {/* Tier 1: Diagnostic Trial */}
                        <div className="relative group flex flex-col p-8 rounded-3xl border border-border bg-white hover:border-primary/20 transition-all duration-300 shadow-sm mt-0 lg:mt-8">
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
                                    <li className="flex items-start gap-3 text-sm text-foreground/80"><CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span>Complete academic & skills audit</span></li>
                                    <li className="flex items-start gap-3 text-sm text-foreground/80"><CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span>Initial 2-hour 1-on-1 session</span></li>
                                    <li className="flex items-start gap-3 text-sm text-foreground/80"><CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span>Custom 3-month roadmap creation</span></li>
                                    <li className="flex items-start gap-3 text-sm text-muted-foreground/50 line-through"><XCircle className="w-5 h-5 text-muted-foreground/30 shrink-0 mt-0.5" /><span>Ongoing chat support</span></li>
                                </ul>
                            </div>
                        </div>

                        {/* Tier 2: Monthly Retainer */}
                        <div className="relative z-20 flex flex-col p-8 sm:p-10 rounded-3xl border-2 border-primary bg-white shadow-xl shadow-primary/10 transform md:-translate-y-4 transition-transform duration-300">
                            <div className="absolute -top-4 start-1/2 -translate-x-1/2">
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
                                <span className="text-6xl font-headline font-bold text-foreground tracking-tight">AED 2,800</span>
                                <span className="text-muted-foreground font-medium text-sm">/month</span>
                            </div>
                            
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
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                        {/* Termly Tier 1: Standard Termly */}
                        <div className="relative group flex flex-col p-8 rounded-3xl border border-emerald-500/30 bg-white hover:border-emerald-500/50 transition-all duration-300 shadow-sm mt-0 lg:mt-8">
                            <div className="mb-8">
                                <h3 className="text-xl font-headline font-bold text-emerald-600 mb-2">Standard Termly</h3>
                                <p className="text-sm text-muted-foreground min-h-[40px] leading-relaxed">Commit for the entire 3-month term and save 15% immediately.</p>
                            </div>
                            
                            <div className="flex flex-col gap-1 mb-8">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-headline font-bold text-foreground tracking-tight">AED 7,140</span>
                                    <span className="text-muted-foreground font-medium text-sm">/term</span>
                                </div>
                                <span className="text-sm text-emerald-500 font-medium">AED 2,380 equivalent per month</span>
                            </div>
                            
                            <Link href="/contact?package=termly-standard" className="w-full mb-8">
                                <button className="w-full py-4 px-6 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-sm border border-emerald-200 transition-all">
                                    Secure Termly Pricing
                                </button>
                            </Link>
                            
                            <div className="space-y-6 flex-1">
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">What&apos;s Included</p>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 text-sm text-foreground/80"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /><span>24 hours of 1-on-1 sessions allocated flexibly</span></li>
                                    <li className="flex items-start gap-3 text-sm text-foreground/80"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /><span>Full WhatsApp priority chat access</span></li>
                                    <li className="flex items-start gap-3 text-sm text-foreground/80"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /><span>Mid-term director review meeting</span></li>
                                </ul>
                            </div>
                        </div>

                        {/* Termly Tier 2: Intensive Termly */}
                        <div className="relative z-20 flex flex-col p-8 sm:p-10 rounded-3xl border-2 border-emerald-500 bg-emerald-50/20 shadow-xl shadow-emerald-500/10 transform md:-translate-y-4 transition-transform duration-300">
                            <div className="absolute -top-4 start-1/2 -translate-x-1/2">
                                <div className="bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-emerald-500/30 tracking-widest uppercase flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                                    Maximum Results
                                </div>
                            </div>
                            
                            <div className="mb-6 mt-4">
                                <h3 className="text-2xl font-headline font-bold text-emerald-600 mb-2">Intensive Termly</h3>
                                <p className="text-sm text-muted-foreground min-h-[40px] leading-relaxed">Aggressive pacing for students undertaking double sciences or intense board prep.</p>
                            </div>
                            
                            <div className="flex flex-col gap-1 mb-8">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-6xl font-headline font-bold text-foreground tracking-tight">AED 11,400</span>
                                    <span className="text-muted-foreground font-medium text-sm">/term</span>
                                </div>
                                <span className="text-sm text-emerald-600 font-medium">AED 3,800 equivalent per month</span>
                            </div>
                            
                            <Link href="/contact?package=termly-intensive" className="w-full mb-10">
                                <button className="w-full py-4 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md transition-all">
                                    Start Intensive Track
                                </button>
                            </Link>
                            
                            <div className="space-y-6 flex-1">
                                <p className="text-xs font-bold uppercase tracking-widest text-emerald-600/80">Everything in Standard Termly, plus</p>
                                <ul className="space-y-4">
                                    {['48 hours of 1-on-1 live sessions', 'Weekly sync with parents', 'Exclusive mock exam marking', 'Personalized university counseling'].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-foreground font-medium">
                                            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
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
