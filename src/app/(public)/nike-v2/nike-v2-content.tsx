'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/public/animated-section';
import { TestimonialGrid } from '@/components/public/testimonial-grid';
import { LeadCaptureForm } from '@/components/public/lead-capture-form';
import { FloatingFormulas } from '@/components/public/floating-formulas';
import { TiltCard } from '@/components/public/tilt-card';
import { ConstellationBackground } from '@/components/public/constellation-background';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, GraduationCap, Briefcase, BookOpen, MessageCircle, Star, Globe, TrendingUp, Target, BarChart3, Shield, MapPin, Users } from 'lucide-react';

// V2 Enrichments
import { DecryptedText } from '@/components/public/decrypted-text';
import { Aurora } from '@/components/public/aurora';

// V3 Prototypes
import { MiniLabWrapper } from '@/components/public/v3-prototypes/mini-lab-wrapper';
import { ScrollProgressBar } from '@/components/public/v3-prototypes/scroll-progress-bar';

/* ------------------------------------------------------------------ */
/*  Client-Only wrapper to avoid Radix hydration mismatches             */
/* ------------------------------------------------------------------ */
function ClientOnly({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return <>{fallback}</>;
    return <>{children}</>;
}

/* ------------------------------------------------------------------ */
/*  FAQ Data                                                            */
/* ------------------------------------------------------------------ */
const FAQ_ITEMS = [
    { q: "How does the free demo work?", a: "Book a 30-minute session with an expert tutor. No commitments — just see if we're the right fit for your learning goals." },
    { q: "What curricula do you cover?", a: "We specialize in IB (MYP & DP), IGCSE, A-Level, CBSE, and ICSE. We also offer professional courses in AI, Data Science, and Programming." },
    { q: "Are sessions online or in-person?", a: "All sessions are conducted online via Google Meet, giving you flexibility to learn from anywhere in Dubai or globally." },
    { q: "How are tutors selected?", a: "Every tutor is vetted for subject expertise, teaching ability, and communication skills. We match you with the best fit for your specific needs." },
    { q: "What subjects do you offer for professionals?", a: "We cover AI & Machine Learning, Data Science, Python/JavaScript programming, and professional degree assistance (MBA, certifications)." },
    { q: "What if I'm not satisfied after the first session?", a: "If you're not happy, we'll rematch you with another tutor at no charge. Your satisfaction is our top priority." },
    { q: "Do you offer package discounts?", a: "Yes — we offer 10-session and 20-session packages with savings of up to 20%. Contact us for custom plans." },
    { q: "Do you provide study materials?", a: "Absolutely. Each session comes with curated notes, practice worksheets, and past-paper compilations tailored to your curriculum." },
];

/* ------------------------------------------------------------------ */
/*  Stats Data                                                          */
/* ------------------------------------------------------------------ */
const STATS = [
    { value: '500+', numericEnd: 500, suffix: '+', label: 'Students Tutored', color: '#10b981', icon: GraduationCap },
    { value: '4.9★', numericEnd: 4.9, suffix: '★', label: 'Average Rating', color: '#f59e0b', icon: Star },
    { value: '12+', numericEnd: 12, suffix: '+', label: 'Countries', color: '#3b82f6', icon: Globe },
    { value: '95%', numericEnd: 95, suffix: '%', label: 'Score Boost', color: '#10b981', icon: TrendingUp },
];

/* ------------------------------------------------------------------ */
/*  Journey Steps                                                       */
/* ------------------------------------------------------------------ */
const STEPS = [
    { number: '01', title: 'Tell Us Your Goals', description: 'Share your subjects, curriculum, and learning targets in a quick form.' },
    { number: '02', title: 'Get Matched', description: 'We pair you with a vetted subject specialist within 24 hours.' },
    { number: '03', title: 'Join Your First Session', description: 'Live 1-on-1 via Google Meet, tailored to your pace and style.' },
    { number: '04', title: 'Watch Grades Soar', description: '94% of students improve by at least one grade level within 3 months.' },
];

/* ------------------------------------------------------------------ */
/*  Marquee Data                                                        */
/* ------------------------------------------------------------------ */
const ROW_1 = ['IB DP', 'IGCSE', 'A-Level', 'CBSE', 'ICSE', 'MYP', 'SAT', 'AP', 'IB DP', 'IGCSE', 'A-Level', 'CBSE', 'ICSE', 'MYP', 'SAT', 'AP'];
const ROW_2 = ['Python', 'Data Science', 'Machine Learning', 'ReactJS', 'Calculus', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Business Studies', 'Python', 'Data Science', 'Machine Learning', 'ReactJS', 'Calculus', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Business Studies'];

/* ------------------------------------------------------------------ */
/*  Floating Geometric Shards (Enhancement #6)                          */
/* ------------------------------------------------------------------ */
const SHARDS = [
    { size: 60, top: '15%', left: '8%', delay: '0s', animation: 'shard-drift', duration: '18s', shape: 'polygon(50% 0%, 0% 100%, 100% 100%)' },
    { size: 40, top: '40%', right: '12%', delay: '3s', animation: 'shard-drift-2', duration: '22s', shape: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)' },
    { size: 80, top: '65%', left: '75%', delay: '6s', animation: 'shard-drift', duration: '25s', shape: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' },
    { size: 35, top: '80%', left: '20%', delay: '9s', animation: 'shard-drift-2', duration: '20s', shape: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' },
    { size: 50, top: '25%', right: '30%', delay: '2s', animation: 'shard-drift', duration: '24s', shape: 'polygon(50% 0%, 0% 100%, 100% 100%)' },
    { size: 45, top: '55%', left: '45%', delay: '7s', animation: 'shard-drift-2', duration: '19s', shape: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)' },
];

function FloatingShards() {
    return (
        <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" aria-hidden>
            {SHARDS.map((shard, i) => (
                <div
                    key={i}
                    className="absolute"
                    style={{
                        width: shard.size,
                        height: shard.size,
                        top: shard.top,
                        left: shard.left,
                        right: shard.right,
                        clipPath: shard.shape,
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                        border: '1px solid rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(4px)',
                        animation: `${shard.animation} ${shard.duration} ease-in-out infinite`,
                        animationDelay: shard.delay,
                    }}
                />
            ))}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Mesh Gradient Blobs (Enhancement #5)                                */
/* ------------------------------------------------------------------ */
function MeshBlobs() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
            {/* Primary teal blob */}
            <div
                className="absolute w-[500px] h-[500px] opacity-[0.07]"
                style={{
                    top: '10%',
                    left: '5%',
                    background: 'linear-gradient(135deg, #10b981, #3b82f6)',
                    animation: 'mesh-morph 15s ease-in-out infinite',
                    borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                    filter: 'blur(80px)',
                }}
            />
            {/* Indigo blob */}
            <div
                className="absolute w-[400px] h-[400px] opacity-[0.06]"
                style={{
                    top: '45%',
                    right: '10%',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    animation: 'mesh-morph 20s ease-in-out infinite',
                    animationDelay: '5s',
                    borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                    filter: 'blur(80px)',
                }}
            />
            {/* Warm accent blob */}
            <div
                className="absolute w-[350px] h-[350px] opacity-[0.05]"
                style={{
                    bottom: '15%',
                    left: '30%',
                    background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                    animation: 'mesh-morph 18s ease-in-out infinite',
                    animationDelay: '10s',
                    borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                    filter: 'blur(80px)',
                }}
            />
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Prismatic Glass Card (Enhancement #1 + #2 + #3)                     */
/*  Combines: prismatic border glow + holographic sheen + glass         */
/* ------------------------------------------------------------------ */
function PrismaticCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`relative group overflow-hidden rounded-2xl ${className}`}>
            {/* Prismatic border glow — visible on hover */}
            <div
                className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[1px]"
                style={{
                    background: 'conic-gradient(from var(--prismatic-angle, 0deg), #10b981, #3b82f6, #8b5cf6, #f59e0b, #10b981)',
                    animation: 'prismatic-spin 4s linear infinite',
                }}
            />
            {/* Glass body + holographic sheen */}
            <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-white/[0.07] transition-all duration-500 glass-sheen overflow-hidden">
                {children}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Glass Stat Card (Enhancement #4)                                    */
/* ------------------------------------------------------------------ */
function AnimatedCounter({ end, suffix = '', decimals = 0 }: { end: number; suffix?: string; decimals?: number }) {
    const ref = React.useRef<HTMLSpanElement>(null);
    const [inView, setInView] = useState(false);
    const [displayValue, setDisplayValue] = useState('0');

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
            { threshold: 0.3 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!inView) return;
        const duration = 2000;
        const startTime = Date.now();
        const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            const current = eased * end;
            setDisplayValue(decimals > 0 ? current.toFixed(decimals) : Math.round(current).toString());
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [inView, end, decimals]);

    return <span ref={ref}>{displayValue}{suffix}</span>;
}

function GlassStatCard({ stat, index }: { stat: typeof STATS[0]; index: number }) {
    const IconComponent = stat.icon;
    return (
        <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
        >
            <PrismaticCard>
                <div className="relative p-6 md:p-8 text-center group/stat flex flex-col items-center justify-center min-h-[180px]">
                    {/* Radial glow behind number */}
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover/stat:opacity-40 transition-opacity duration-700"
                        style={{ backgroundColor: stat.color }}
                    />
                    {/* Icon */}
                    <div className="relative mb-3 flex justify-center">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10"
                            style={{ backgroundColor: `${stat.color}15` }}
                        >
                            <IconComponent className="w-5 h-5" style={{ color: stat.color }} />
                        </div>
                    </div>
                    <span className="relative block text-4xl md:text-5xl lg:text-6xl font-headline font-black text-white tracking-tight mb-2 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                        <AnimatedCounter end={stat.numericEnd} suffix={stat.suffix} decimals={stat.numericEnd % 1 !== 0 ? 1 : 0} />
                    </span>
                    <span className="relative text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                        {stat.label}
                    </span>
                </div>
            </PrismaticCard>
        </motion.div>
    );
}

/* ------------------------------------------------------------------ */
/*  Dark Marquee with Glass Pills                                       */
/* ------------------------------------------------------------------ */
function DarkMarquee() {
    return (
        <div className="w-full overflow-hidden py-8 space-y-4" style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}>
            <div className="flex gap-4 animate-marquee hover:[animation-play-state:paused]">
                {ROW_1.map((tag, i) => (
                    <span key={`r1-${i}`} className="flex-shrink-0 px-6 py-3 rounded-full border border-white/[0.08] text-sm font-semibold text-white/50 bg-white/[0.03] backdrop-blur-sm hover:bg-white/10 hover:text-primary hover:border-primary/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:scale-[1.05] transition-all duration-300 cursor-default select-none whitespace-nowrap">
                        {tag}
                    </span>
                ))}
            </div>
            <div className="flex gap-4 animate-marquee-reverse hover:[animation-play-state:paused]">
                {ROW_2.map((tag, i) => (
                    <span key={`r2-${i}`} className="flex-shrink-0 px-6 py-3 rounded-full border border-white/[0.08] text-sm font-semibold text-white/50 bg-white/[0.03] backdrop-blur-sm hover:bg-white/10 hover:text-primary hover:border-primary/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:scale-[1.05] transition-all duration-300 cursor-default select-none whitespace-nowrap">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Service Card (Prismatic Glass)                                      */
/* ------------------------------------------------------------------ */
function ServiceCard({ icon: Icon, title, titleAccent, description, price, href, accentColor, delay }: {
    icon: React.ElementType;
    title: string;
    titleAccent: string;
    description: string;
    price: string;
    href: string;
    accentColor: string;
    delay: number;
}) {
    return (
        <AnimatedSection delay={delay} className="h-full min-w-[85vw] md:min-w-0 snap-center">
            <TiltCard className="h-full">
                <PrismaticCard className="h-full">
                    <div className="relative p-8 flex flex-col group/service h-[50vh] min-h-[380px]">
                        {/* Ambient glow */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover/service:opacity-40 transition-opacity duration-700" style={{ backgroundColor: accentColor }} />

                        <div className="relative z-[2] flex items-center justify-between mb-auto">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10" style={{ backgroundColor: `${accentColor}15` }}>
                                <Icon className="w-6 h-6" style={{ color: accentColor }} />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">{price}</span>
                        </div>
                        <div className="relative z-[2] flex flex-col mt-auto">
                            <h3 className="text-3xl md:text-4xl font-headline font-black text-white uppercase tracking-tighter mb-2">
                                {title}<br /><span style={{ color: accentColor }}>{titleAccent}</span>
                            </h3>
                            <p className="text-white/60 font-medium mb-5 text-sm leading-relaxed">{description}</p>
                            <div className="h-0 opacity-0 group-hover/service:h-auto group-hover/service:opacity-100 transition-all duration-500 overflow-hidden translate-y-4 group-hover/service:translate-y-0">
                                <Link href={href}>
                                    <button className="border border-white/20 text-white/80 px-6 py-3 rounded-full font-bold uppercase tracking-wider text-xs flex items-center gap-2 hover:bg-white/5 hover:text-white transition-all">
                                        View Program <ArrowRight className="w-4 h-4" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </PrismaticCard>
            </TiltCard>
        </AnimatedSection>
    );
}

/* ------------------------------------------------------------------ */
/*  Prismatic Section Separator                                         */
/* ------------------------------------------------------------------ */
function PrismaticSeparator() {
    return (
        <div className="max-w-5xl mx-auto px-6">
            <div
                className="h-px w-full opacity-30"
                style={{
                    background: 'linear-gradient(90deg, transparent, #10b981, #3b82f6, #8b5cf6, #f59e0b, #10b981, transparent)',
                }}
            />
        </div>
    );
}

/* ================================================================== */
/*  MAIN COMPONENT                                                      */
/* ================================================================== */

export function NikeV2Content() {
    return (
        <main className="min-h-screen relative overflow-hidden bg-[#0c0f1a] film-grain">
            {/* Global background effects */}
            <MeshBlobs />
            <FloatingShards />
            <ScrollProgressBar />

            {/* ═══════════════════════════════════════════════════════════
                SECTION 1: HERO
            ═══════════════════════════════════════════════════════════ */}
            <section className="relative min-h-[100svh] flex items-end pb-24 md:pb-32 px-6 md:px-16 overflow-hidden">
                <ConstellationBackground variant="dark" />

                {/* Ambient Glows */}
                <div className="absolute top-1/3 right-1/4 w-[600px] h-[400px] bg-primary/15 rounded-full blur-[140px] pointer-events-none" />
                <div className="absolute bottom-1/4 left-1/6 w-[500px] h-[300px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="relative z-10 max-w-5xl">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-primary">Book Your Free Demo</span>
                    </div>

                    <h1
                        className="font-headline font-black uppercase tracking-[-0.03em] leading-[0.95] text-white mb-8"
                        style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}
                    >
                        Expert Tutoring<br />
                        That Delivers<br />
                        <span className="text-primary"><DecryptedText text="RESULTS" /></span>
                    </h1>

                    <p className="text-white/70 text-base md:text-lg lg:text-xl font-medium max-w-xl mb-6 leading-relaxed">
                        Personalized mentorship for K-12 students, university learners, and working professionals. IB, Cambridge, CBSE, AI &amp; Data Science — we cover it all.
                    </p>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-10 text-[11px] md:text-xs font-bold uppercase tracking-[0.15em] text-white/60">
                        <span>500+ Students</span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span>12+ Countries</span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span>4.9★ Rating</span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span>95% Score Boost</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <Link href="#book-demo">
                            <button className="group bg-primary text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-primary/90 active:scale-95 transition-all shadow-[0_4px_0_0_rgba(0,0,0,0.3)] hover:shadow-[0_2px_0_0_rgba(0,0,0,0.3)] hover:translate-y-[2px] flex items-center gap-2">
                                Book Free Demo
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                        <Link href="#services">
                            <button className="px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider border border-white/20 text-white/80 hover:bg-white/5 hover:border-white/40 active:scale-95 transition-all">
                                Explore Services
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 1.5: SCHOOL LOGO BAR — Social Proof Strip
            ═══════════════════════════════════════════════════════════ */}
            <section className="py-12 px-6 relative border-y border-white/[0.06]">
                <div className="max-w-5xl mx-auto">
                    <AnimatedSection className="text-center">
                        <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-white/40 mb-6">
                            Students &amp; alumni from leading institutions in Dubai &amp; worldwide
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
                            {['GEMS', 'Taaleem', 'JESS Dubai', 'Repton', 'Dubai College', 'Indian High School', 'Kings\' School', 'Raffles', 'UOWD', 'American University of Sharjah', 'Heriot-Watt Dubai', 'Middlesex University Dubai'].map((name) => (
                                <span key={name} className="px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs md:text-sm font-semibold text-white/50 hover:text-white/80 hover:border-white/20 transition-all duration-300 cursor-default">
                                    {name}
                                </span>
                            ))}
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 2: STATS — Glass Stat Cards
            ═══════════════════════════════════════════════════════════ */}
            <PrismaticSeparator />
            <section className="py-24 md:py-32 px-6 relative">
                <div className="max-w-5xl mx-auto relative z-10">
                    <AnimatedSection className="text-center mb-16">
                        <h2
                            className="font-headline font-black uppercase mb-4 text-white tracking-[-0.03em]"
                            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1 }}
                        >
                            The Results<br /><span className="text-primary">Speak</span>
                        </h2>
                    </AnimatedSection>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {STATS.map((stat, i) => (
                            <GlassStatCard key={stat.label} stat={stat} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 2.5: WHY PERTUTO — Differentiator Cards
            ═══════════════════════════════════════════════════════════ */}
            <section className="py-20 md:py-28 px-6 relative">
                <div className="max-w-6xl mx-auto">
                    <AnimatedSection className="text-center mb-14">
                        <h2
                            className="font-headline font-black uppercase mb-4 text-white tracking-[-0.03em]"
                            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1 }}
                        >
                            Why<br /><span className="text-primary">PerTuto</span>
                        </h2>
                        <p className="text-white/60 max-w-2xl mx-auto text-base md:text-lg font-medium">
                            We&apos;re not a marketplace. We&apos;re your child&apos;s academic partner.
                        </p>
                    </AnimatedSection>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[
                            { icon: Target, title: 'Expert Matching', desc: 'We don\'t list tutors — we match you with a vetted specialist for your exact curriculum and learning style.', color: '#10b981' },
                            { icon: BarChart3, title: 'Progress Tracking', desc: 'Bi-weekly reports with specific metrics, strengths, and action items. Total transparency.', color: '#3b82f6' },
                            { icon: Shield, title: 'Satisfaction Guarantee', desc: 'Not happy after your first session? We\'ll rematch you free. No questions, no hassle.', color: '#f59e0b' },
                            { icon: MapPin, title: 'Dubai Expertise', desc: 'We know GEMS, Taaleem, JESS syllabi inside-out. Local knowledge, global standards.', color: '#8b5cf6' },
                        ].map((card, i) => (
                            <AnimatedSection key={card.title} delay={i * 100}>
                                <PrismaticCard className="h-full">
                                    <div className="p-6 md:p-7 flex flex-col h-full">
                                        <div
                                            className="w-11 h-11 rounded-xl flex items-center justify-center border border-white/10 mb-5"
                                            style={{ backgroundColor: `${card.color}15` }}
                                        >
                                            <card.icon className="w-5 h-5" style={{ color: card.color }} />
                                        </div>
                                        <h3 className="text-lg font-headline font-black text-white mb-2 tracking-tight">{card.title}</h3>
                                        <p className="text-white/60 text-sm leading-relaxed flex-1">{card.desc}</p>
                                    </div>
                                </PrismaticCard>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 3: SERVICES — Prismatic Glass Cards
            ═══════════════════════════════════════════════════════════ */}
            <PrismaticSeparator />
            <section id="services" className="py-24 md:py-32 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <AnimatedSection className="mb-14 ps-6 md:ps-0 border-s-4 border-primary">
                        <h2
                            className="font-headline font-black uppercase mb-4 text-white tracking-[-0.03em] ps-6"
                            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1 }}
                        >
                            Pathways<br /><span className="text-primary">To Excellence</span>
                        </h2>
                        <p className="text-white/60 max-w-2xl text-base md:text-lg font-medium ps-6">
                            Whether you&apos;re aiming for perfect IB scores or looking to pivot into Data Science, we have a structured program for you.
                        </p>
                    </AnimatedSection>

                    <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 pb-4 snap-x snap-mandatory hide-scrollbar">
                        <ServiceCard
                            icon={GraduationCap}
                            title="K-12"
                            titleAccent="Tutoring"
                            description="Master the complexities of IB DP, Cambridge IGCSE, and A-Levels. Rigorous prep for high performers."
                            price="From AED 150/hr"
                            href="/services/k12"
                            accentColor="hsl(var(--primary))"
                            delay={100}
                        />
                        <ServiceCard
                            icon={Briefcase}
                            title="Professional"
                            titleAccent="Upskilling"
                            description="Future-proof your career with intensive, 1-on-1 coaching in AI, Data Science, and modern Software Engineering."
                            price="From AED 200/hr"
                            href="/services/professional"
                            accentColor="#f59e0b"
                            delay={200}
                        />
                        <ServiceCard
                            icon={BookOpen}
                            title="Higher"
                            titleAccent="Education"
                            description="Bridge the gap between academia and industry. Deep support for university students and online degrees."
                            price="From AED 175/hr"
                            href="/services/university"
                            accentColor="#6366f1"
                            delay={300}
                        />
                    </div>
                    {/* Mobile scroll indicator dots */}
                    <div className="flex md:hidden justify-center gap-2 mt-4">
                        {[0, 1, 2].map((dot) => (
                            <span key={dot} className={`w-2 h-2 rounded-full transition-colors ${dot === 0 ? 'bg-primary' : 'bg-white/20'}`} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 4: MINI-LAB — Aurora on Dark
            ═══════════════════════════════════════════════════════════ */}
            <PrismaticSeparator />
            <div id="mini-lab" className="relative overflow-hidden">
                <Aurora colorStops={["#10b981", "#8b5cf6", "#3b82f6"]} speed={0.6} />

                <div className="relative z-10 pt-20 md:pt-28 px-6">
                    <AnimatedSection className="max-w-7xl mx-auto mb-0 ps-6 md:ps-0 border-s-4 border-primary">
                        <h2
                            className="font-headline font-black uppercase mb-4 text-white tracking-[-0.03em] ps-6"
                            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1 }}
                        >
                            Experience<br /><span className="text-primary">Our Teaching</span>
                        </h2>
                        <p className="text-white/60 max-w-2xl text-base md:text-lg font-medium ps-6">
                            Try a sample lesson from our actual curriculum. Drag, solve, and see what a PerTuto session feels like.
                        </p>
                    </AnimatedSection>
                </div>
                <div className="relative">
                    <MiniLabWrapper dark />
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 5: SUBJECTS — Glowing Marquee
            ═══════════════════════════════════════════════════════════ */}
            <PrismaticSeparator />
            <section className="py-24 md:py-32 relative overflow-hidden">
                {/* Spotlight effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/[0.06] rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <AnimatedSection className="mb-8 text-center">
                        <h2
                            className="font-headline font-black uppercase mb-4 text-white tracking-[-0.03em]"
                            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1 }}
                        >
                            Subjects &amp; Curricula<br /><span className="text-primary">We Master</span>
                        </h2>
                        <p className="text-white/60 max-w-2xl mx-auto text-base md:text-lg font-medium">
                            IB, Cambridge, CBSE, A-Levels, and beyond — the full breadth of what our tutors cover.
                        </p>
                    </AnimatedSection>
                </div>
                <DarkMarquee />
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 6: JOURNEY — Editorial Steps on Dark
            ═══════════════════════════════════════════════════════════ */}
            <PrismaticSeparator />
            <section className="py-24 md:py-32 px-6 relative">
                {/* Vertical light beam */}
                <div className="absolute left-[calc(50%-340px)] md:left-[calc(50%-300px)] top-[20%] bottom-[10%] w-[2px] bg-gradient-to-b from-transparent via-primary/40 to-transparent pointer-events-none" />

                <div className="max-w-3xl mx-auto">
                    <motion.div
                        className="mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2
                            className="font-headline font-black uppercase mb-4 text-white tracking-[-0.03em]"
                            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1 }}
                        >
                            How It<br /><span className="text-primary">Works</span>
                        </h2>
                        <p className="text-white/60 text-base md:text-lg font-medium max-w-lg">
                            From first contact to measurable results — four simple steps.
                        </p>
                    </motion.div>

                    <div>
                        {STEPS.map((step, i) => (
                            <motion.div
                                key={step.number}
                                className="group relative grid grid-cols-[auto_1fr] md:grid-cols-[120px_1fr] gap-6 md:gap-10 items-start py-10 md:py-14"
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '0px' }}
                                transition={{ delay: i * 0.05, duration: 0.35 }}
                            >
                                <span className="font-headline font-black text-6xl md:text-8xl tracking-tighter text-white/[0.10] group-hover:text-primary/30 transition-colors duration-500 select-none leading-none">
                                    {step.number}
                                </span>
                                <div className="pt-1 md:pt-3">
                                    <h3 className="text-xl md:text-2xl font-headline font-black text-white tracking-tight mb-2">{step.title}</h3>
                                    <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-md">{step.description}</p>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div
                                        className="absolute bottom-0 left-0 right-0 h-px opacity-30"
                                        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }}
                                    />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 7: TESTIMONIALS — Glass on Dark
            ═══════════════════════════════════════════════════════════ */}
            <PrismaticSeparator />
            <section className="py-24 md:py-32 px-6 relative">
                <div className="absolute bottom-0 left-1/3 w-[500px] h-[400px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />
                <div className="relative z-10">
                    <TestimonialGrid variant="dark" />
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 8: LEAD CAPTURE
            ═══════════════════════════════════════════════════════════ */}
            <PrismaticSeparator />
            <section id="book-demo" className="py-28 md:py-36 px-6 relative overflow-hidden">
                <FloatingFormulas />

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute top-1/4 right-1/4 w-[400px] h-[300px] bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none" />

                <AnimatedSection>
                    <div className="max-w-xl mx-auto relative group">
                        {/* Prismatic outer glow */}
                        <div
                            className="absolute -inset-[2px] rounded-[2rem] blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-1000"
                            style={{
                                background: 'conic-gradient(from var(--prismatic-angle, 0deg), #10b981, #3b82f6, #8b5cf6, #f59e0b, #10b981)',
                                animation: 'prismatic-spin 4s linear infinite',
                            }}
                        />
                        <TiltCard className="relative">
                            <div className="relative rounded-[2rem] border border-white/20 bg-white/10 backdrop-blur-2xl p-8 md:p-12 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden glass-sheen">
                                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                                <div className="relative z-10 text-center mb-10">
                                    <h2 className="font-headline text-3xl md:text-4xl font-black mb-3 text-white tracking-tight drop-shadow-sm">
                                        Book Your Free Demo
                                    </h2>
                                    <p className="text-base text-white/70 font-medium tracking-wide mb-3">
                                        3 fields. 30 seconds. We&apos;ll call you within 2 hours.
                                    </p>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-400/80 flex items-center justify-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                        Only 4 demo slots left this week
                                    </p>
                                </div>
                                <div className="relative z-10">
                                    <ClientOnly fallback={<div className="h-32" />}>
                                        <LeadCaptureForm variant="minimal" dark />
                                    </ClientOnly>
                                </div>
                            </div>
                        </TiltCard>
                    </div>
                </AnimatedSection>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 9: FAQ — Glass Accordion on Dark
            ═══════════════════════════════════════════════════════════ */}
            <PrismaticSeparator />
            <section className="py-24 md:py-32 px-6">
                <div className="max-w-2xl mx-auto">
                    <AnimatedSection className="text-center mb-12">
                        <h2
                            className="font-headline font-black uppercase text-white tracking-[-0.03em] mb-2"
                            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1 }}
                        >
                            Got<br /><span className="text-primary">Questions?</span>
                        </h2>
                        <p className="text-white/60 text-base md:text-lg font-medium">Everything you need to know before getting started.</p>
                    </AnimatedSection>
                    <ClientOnly fallback={<div className="space-y-2">{FAQ_ITEMS.map((item, i) => (<div key={i} className="border border-white/[0.08] rounded-xl px-6 py-4 bg-white/[0.03]"><p className="text-white/80 text-sm font-semibold">{item.q}</p></div>))}</div>}>
                        <Accordion type="single" collapsible className="space-y-2">
                            {FAQ_ITEMS.map((item, i) => (
                                <AccordionItem key={i} value={`faq-${i}`} className="border border-white/[0.08] rounded-xl px-6 bg-white/[0.03] backdrop-blur-sm glass-sheen">
                                    <AccordionTrigger className="text-start font-semibold text-sm hover:no-underline text-white/80">
                                        {item.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-white/50 text-sm leading-relaxed">
                                        {item.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </ClientOnly>

                    <div className="mt-10 text-center">
                        <p className="text-white/60 text-sm mb-4">Can&apos;t find your answer?</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a
                                href="https://wa.me/971585801639?text=Hi%20PerTuto,%20I%20have%20a%20question"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Chat on WhatsApp
                            </a>
                            <Link
                                href="#book-demo"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white/80 font-bold text-sm uppercase tracking-wider hover:bg-white/5 hover:text-white transition-all"
                            >
                                Book a Free Demo
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
