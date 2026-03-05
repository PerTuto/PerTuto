"use client";

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { SpotlightCard } from './spotlight-card';
import { TypingTestimonial } from './typing-testimonial';
import { motion } from 'framer-motion';
import { getApprovedTestimonials } from '@/lib/firebase/services';

const FALLBACK_TESTIMONIALS = [
    {
        quote: "Ankur didn't just teach my son IB Math; he fundamentally changed how he approaches problem-solving. We saw a jump from a 4 to a 6 in just one term.",
        author: "Sarah M.",
        role: "Parent of IB Student, JESS Dubai",
        rating: 5,
    },
    {
        quote: "The intensive bootcamp for IGCSE Physics was exactly what we needed. The focus on exam technique and past-paper analysis was incredibly effective.",
        author: "Ahmed K.",
        role: "Parent of IGCSE Student, Dubai College",
        rating: 5,
    },
    {
        quote: "As a working professional trying to transition into Data Science, the curriculum was tailored perfectly to my existing knowledge level. Highly practical.",
        author: "David L.",
        role: "Senior Marketing Analyst, Noon.com",
        rating: 5,
    },
    {
        quote: "What stands out about PerTuto is the accountability. The bi-weekly progress reports gave us total transparency into our daughter's strengths and weaknesses.",
        author: "Priya S.",
        role: "Parent of A-Levels Student, Repton Dubai",
        rating: 5,
    },
    {
        quote: "Finding an experienced and permitted tutor in Dubai is tough. We immediately felt safe with PerTuto's thorough documentation and the quality of their educators.",
        author: "Omar F.",
        role: "Parent of CBSE Student, The Indian High School",
        rating: 5,
    },
    {
        quote: "I needed to fast-track my understanding of Python for a new role. The 1-on-1 pace was challenging but exactly what I asked for. Highly recommend.",
        author: "Jessica T.",
        role: "Product Manager, Tech Industry",
        rating: 4,
    }
];

// Default tenant ID for the public website
const DEFAULT_TENANT_ID = 'pertuto-default';

export function TestimonialGrid({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
    const [testimonials, setTestimonials] = useState(FALLBACK_TESTIMONIALS);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        async function fetchTestimonials() {
            try {
                const approved = await getApprovedTestimonials(DEFAULT_TENANT_ID);
                if (approved.length > 0) {
                    setTestimonials(approved.map((t: any) => ({
                        quote: t.quote,
                        author: t.name,
                        role: t.role,
                        rating: t.rating,
                    })));
                }
            } catch (e) {
                // Silently fall back to hardcoded testimonials
            } finally {
                setLoaded(true);
            }
        }
        fetchTestimonials();
    }, []);

    const containerVariants = {
        hidden: {},
        visible: {
            transition: { staggerChildren: 0.15 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 30 },
        visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: { type: "spring" as const, stiffness: 300, damping: 20 }
        }
    };

    const isDark = variant === 'dark';

    return (
        <section className={`py-24 px-6 relative overflow-hidden ${isDark ? 'bg-transparent' : 'bg-slate-50'}`}>
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold tracking-widest uppercase mb-4 shadow-sm ${isDark ? 'border-primary/30 bg-primary/10 text-primary' : 'border-primary/30 bg-primary/5 text-primary'}`}>
                        Proven Results
                    </div>
                    <h2 className={`text-4xl md:text-5xl lg:text-6xl font-headline font-black mb-4 tracking-tight ${isDark ? 'text-white' : 'text-foreground'}`}>
                        Don't Just Take Our Word For It
                    </h2>
                    <p className={`text-lg md:text-xl font-medium max-w-2xl mx-auto ${isDark ? 'text-white/60' : 'text-muted-foreground'}`}>
                        We measure our success entirely by the quantifiable improvements of our students.
                    </p>
                </div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {testimonials.map((testimonial, i) => (
                        <motion.div key={i} variants={cardVariants} className="h-full">
                            <SpotlightCard className={`p-8 h-full flex flex-col rounded-3xl transition-shadow duration-300 ${isDark ? 'bg-white/[0.04] backdrop-blur-xl border border-white/10 hover:bg-white/[0.07] hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)]' : 'bg-white border border-border shadow-sm hover:shadow-xl'}`}>
                                <div className="flex gap-1 mb-6">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <motion.div 
                                            key={i}
                                            initial={{ opacity: 0, rotate: -30 }}
                                            animate={{ opacity: 1, rotate: 0 }}
                                            transition={{ delay: 0.5 + (i * 0.1), type: "spring" }}
                                        >
                                            <Star className="w-5 h-5 fill-amber-400 text-amber-400 drop-shadow-sm" />
                                        </motion.div>
                                    ))}
                                </div>
                                <blockquote className={`text-lg font-medium leading-relaxed mb-8 flex-1 italic ${isDark ? 'text-white/70' : 'text-foreground/80'}`}>
                                    &ldquo;{testimonial.quote}&rdquo;
                                </blockquote>
                                <div className={`mt-auto pt-6 border-t flex items-center gap-4 ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                                    {(() => {
                                        const gradients = [
                                            'from-primary to-emerald-400',
                                            'from-blue-500 to-cyan-400',
                                            'from-violet-500 to-purple-400',
                                            'from-amber-500 to-orange-400',
                                            'from-rose-500 to-pink-400',
                                            'from-indigo-500 to-blue-400',
                                        ];
                                        const initials = testimonial.author.split(' ').map(n => n[0]).join('');
                                        return (
                                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center font-bold text-white font-headline text-sm shadow-md`}>
                                                {initials}
                                            </div>
                                        );
                                    })()}
                                    <div>
                                        <div className={`font-headline font-black tracking-tight ${isDark ? 'text-white' : 'text-foreground'}`}>
                                            {testimonial.author}
                                        </div>
                                        {(() => {
                                            const parts = testimonial.role.split(', ');
                                            if (parts.length > 1) {
                                                return (
                                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                                        <span className={`text-sm font-medium ${isDark ? 'text-white/60' : 'text-muted-foreground'}`}>
                                                            {parts[0]}
                                                        </span>
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${isDark ? 'bg-primary/15 text-primary border border-primary/20' : 'bg-primary/10 text-primary border border-primary/15'}`}>
                                                            {parts.slice(1).join(', ')}
                                                        </span>
                                                    </div>
                                                );
                                            }
                                            return (
                                                <div className={`text-sm font-medium ${isDark ? 'text-white/60' : 'text-muted-foreground'}`}>
                                                    {testimonial.role}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
