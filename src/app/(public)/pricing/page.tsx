'use client';

import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// Note: Because we use useState, we removed the exported metadata.
// In a real Next.js app, you'd extract the toggle into a client component.
// For this rewrite, we'll keep it simple and make the whole page a client component.

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'termly'>('monthly');

    return (
        <main className="flex-1 flex flex-col items-center w-full max-w-7xl mx-auto px-6 py-24 mt-16">
            {/* Background Ambient Layers */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[100px]"></div>
            </div>

            {/* ===== HERO ===== */}
            <div className="text-center max-w-3xl mx-auto mb-16 relative z-10 animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight mb-6 bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
                    Predictable Pricing for Exceptional Results
                </h1>
                <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed">
                    Invest in your academic future with elite mentorship. No hidden fees, just pure intellectual growth.
                </p>
            </div>

            {/* ===== BILLING TOGGLE ===== */}
            <div className="flex justify-center mb-20 relative z-10 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <div className="relative flex p-1.5 rounded-full bg-surface-dark border border-white/10 glass-panel">
                    <div className="relative z-0 flex">
                        {/* Monthly */}
                        <label className="group relative flex cursor-pointer items-center justify-center px-8 py-2.5">
                            <input 
                                className="peer sr-only" 
                                name="billing" 
                                type="radio" 
                                value="monthly" 
                                checked={billingCycle === 'monthly'}
                                onChange={() => setBillingCycle('monthly')}
                            />
                            <span className="absolute inset-0 rounded-full bg-white/10 shadow-sm opacity-0 peer-checked:opacity-100 transition-all duration-300 ease-out"></span>
                            <span className={`relative z-10 text-sm font-bold transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>Monthly</span>
                        </label>

                        {/* Termly */}
                        <label className="group relative flex cursor-pointer items-center justify-center px-8 py-2.5">
                            <input 
                                className="peer sr-only" 
                                name="billing" 
                                type="radio" 
                                value="termly"
                                checked={billingCycle === 'termly'}
                                onChange={() => setBillingCycle('termly')}
                            />
                            <span className="absolute inset-0 rounded-full bg-white/10 shadow-sm opacity-0 peer-checked:opacity-100 transition-all duration-300 ease-out"></span>
                            <span className={`relative z-10 text-sm font-bold transition-colors flex items-center gap-2 ${billingCycle === 'termly' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                Termly 
                                <span className="text-[10px] uppercase tracking-wider bg-primary/20 text-primary-glow px-2 py-0.5 rounded-full border border-primary/30">Save 15%</span>
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            {/* ===== PRICING TIERS ===== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full items-start relative z-10 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                
                {/* Tier 1: Diagnostic Trial */}
                <div className="relative group flex flex-col p-8 rounded-3xl border border-white/10 bg-surface-dark/50 backdrop-blur-md hover:border-white/20 transition-all duration-300 mt-0 lg:mt-8">
                    <div className="mb-8">
                        <h3 className="text-xl font-headline font-bold text-white mb-2">Diagnostic Trial</h3>
                        <p className="text-sm text-slate-400 min-h-[40px] leading-relaxed">Perfect for understanding your current baseline and potential.</p>
                    </div>
                    
                    <div className="flex items-baseline gap-1 mb-8">
                        <span className="text-5xl font-headline font-bold text-white tracking-tight">AED 350</span>
                        <span className="text-slate-400 font-medium text-sm">/one-time</span>
                    </div>
                    
                    <Link href="/contact?package=trial" className="w-full mb-8">
                        <button className="w-full py-4 px-6 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-white/10 transition-all">
                            Book Assessment
                        </button>
                    </Link>
                    
                    <div className="space-y-6 flex-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">What's Included</p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-4 text-sm text-slate-300">
                                <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                                <span>Complete academic & skills audit</span>
                            </li>
                            <li className="flex items-start gap-4 text-sm text-slate-300">
                                <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                                <span>Initial 2-hour 1-on-1 session</span>
                            </li>
                            <li className="flex items-start gap-4 text-sm text-slate-300">
                                <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                                <span>Custom 3-month roadmap creation</span>
                            </li>
                            <li className="flex items-start gap-4 text-sm text-slate-600 line-through">
                                <XCircle className="w-5 h-5 text-slate-600 shrink-0" />
                                <span>Ongoing chat support</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Tier 2: Monthly Retainer (Most Popular) */}
                <div className="relative z-20 flex flex-col p-8 sm:p-10 rounded-3xl border border-primary/50 bg-[#0d0a15] backdrop-blur-xl shadow-2xl shadow-primary/20 transform md:-translate-y-4 transition-transform duration-300">
                    <div className="absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-primary-glow to-transparent opacity-50"></div>
                    
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <div className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-primary/40 tracking-widest uppercase flex items-center gap-1.5 border border-primary-glow/30">
                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                            Most Popular
                        </div>
                    </div>
                    
                    <div className="mb-6 mt-4">
                        <h3 className="text-2xl font-headline font-bold text-primary-glow mb-2">Retainer</h3>
                        <p className="text-sm text-slate-400 min-h-[40px] leading-relaxed">Comprehensive support for sustained academic or career growth.</p>
                    </div>
                    
                    <div className="flex items-baseline gap-1 mb-8">
                        <span className="text-6xl font-headline font-bold text-white tracking-tight">AED {billingCycle === 'monthly' ? '2,800' : '2,380'}</span>
                        <span className="text-slate-400 font-medium text-sm">/month</span>
                    </div>

                    {billingCycle === 'termly' && (
                        <div className="mb-6 -mt-4 text-sm text-emerald-400 font-medium">Billed termly as AED 7,140</div>
                    )}
                    
                    <Link href="/contact?package=retainer" className="w-full mb-10">
                        <button className="btn-glow w-full py-4 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm transition-all flex items-center justify-center gap-2">
                            Start Membership
                        </button>
                    </Link>
                    
                    <div className="space-y-6 flex-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-primary-glow/70">Everything in Trial, plus</p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-4 text-sm text-white font-medium">
                                <CheckCircle className="w-5 h-5 text-primary-glow shrink-0" />
                                <span>8 hours of 1-on-1 live sessions/mo</span>
                            </li>
                            <li className="flex items-start gap-4 text-sm text-white font-medium">
                                <CheckCircle className="w-5 h-5 text-primary-glow shrink-0" />
                                <span>Unlimited WhatsApp chat support</span>
                            </li>
                            <li className="flex items-start gap-4 text-sm text-white font-medium">
                                <CheckCircle className="w-5 h-5 text-primary-glow shrink-0" />
                                <span>Bi-weekly progress analytics</span>
                            </li>
                            <li className="flex items-start gap-4 text-sm text-white font-medium">
                                <CheckCircle className="w-5 h-5 text-primary-glow shrink-0" />
                                <span>Access to recorded session vault</span>
                            </li>
                            <li className="flex items-start gap-4 text-sm text-white font-medium">
                                <CheckCircle className="w-5 h-5 text-primary-glow shrink-0" />
                                <span>Exam technique workshops</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Tier 3: Intensive Bootcamp */}
                <div className="relative group flex flex-col p-8 rounded-3xl border border-white/5 bg-surface-dark/30 backdrop-blur-md hover:border-white/10 transition-all duration-300 mt-0 lg:mt-8">
                    <div className="mb-8">
                        <h3 className="text-xl font-headline font-bold text-white mb-2">Intensive Bootcamp</h3>
                        <p className="text-sm text-slate-400 min-h-[40px] leading-relaxed">High-impact, rapid preparation for critical examination periods.</p>
                    </div>
                    
                    <div className="flex items-baseline gap-1 mb-8">
                        <span className="text-5xl font-headline font-bold text-white tracking-tight">AED 5,500</span>
                        <span className="text-slate-400 font-medium text-sm">/block</span>
                    </div>
                    
                    <Link href="/contact?package=bootcamp" className="w-full mb-8">
                        <button className="w-full py-4 px-6 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-white/5 transition-colors">
                            Join Waitlist
                        </button>
                    </Link>
                    
                    <div className="space-y-6 flex-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Targeted Focus</p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-4 text-sm text-slate-300">
                                <CheckCircle className="w-5 h-5 text-slate-500 shrink-0" />
                                <span>20 hours of focused revision</span>
                            </li>
                            <li className="flex items-start gap-4 text-sm text-slate-300">
                                <CheckCircle className="w-5 h-5 text-slate-500 shrink-0" />
                                <span>Mock exams + examiner feedback</span>
                            </li>
                            <li className="flex items-start gap-4 text-sm text-slate-300">
                                <CheckCircle className="w-5 h-5 text-slate-500 shrink-0" />
                                <span>Targeted past-paper walkthroughs</span>
                            </li>
                            <li className="flex items-start gap-4 text-sm text-slate-300">
                                <CheckCircle className="w-5 h-5 text-slate-500 shrink-0" />
                                <span>Priority scheduling block</span>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>

             {/* ===== FAQ QUICK LINKS ===== */}
             <div className="mt-32 max-w-3xl mx-auto w-full text-center relative z-10 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <div className="glass-panel p-10 rounded-3xl border border-white/10">
                    <h3 className="font-headline text-2xl font-bold mb-4 text-white">Have specific needs?</h3>
                    <p className="text-slate-400 mb-8 max-w-lg mx-auto">If you need a custom corporate upskilling package, or specialized multi-student K-12 pricing, connect with our directors directly.</p>
                    <Link href="/contact?request=custom">
                        <button className="px-8 py-4 rounded-xl font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                            Request Custom Quote
                        </button>
                    </Link>
                </div>
             </div>

        </main>
    );
}
