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
        role: "Parent of IB Student (JESS Dubai)",
        rating: 5,
    },
    {
        quote: "The intensive bootcamp for IGCSE Physics was exactly what we needed. The focus on exam technique and past-paper analysis was incredibly effective.",
        author: "Ahmed K.",
        role: "Parent of IGCSE Student (Dubai College)",
        rating: 5,
    },
    {
        quote: "As a working professional trying to transition into Data Science, the curriculum was tailored perfectly to my existing knowledge level. Highly practical.",
        author: "David L.",
        role: "Senior Marketing Analyst",
        rating: 5,
    },
    {
        quote: "What stands out about PerTuto is the accountability. The bi-weekly progress reports gave us total transparency into our daughter's strengths and weaknesses.",
        author: "Priya S.",
        role: "Parent of A-Levels Student",
        rating: 5,
    },
    {
        quote: "Finding an experienced and permitted tutor in Dubai is tough. We immediately felt safe with PerTuto's thorough documentation and the quality of their educators.",
        author: "Omar F.",
        role: "Parent of CBSE Student",
        rating: 5,
    },
    {
        quote: "I needed to fast-track my understanding of Python for a new role. The 1-on-1 pace was challenging but exactly what I asked for. Highly recommend.",
        author: "Jessica T.",
        role: "Product Manager",
        rating: 4,
    }
];

// Default tenant ID for the public website
const DEFAULT_TENANT_ID = 'pertuto-default';

export function TestimonialGrid() {
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

    return (
        <section className="py-24 px-6 relative overflow-hidden bg-slate-50">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-sm font-bold tracking-widest uppercase text-primary mb-4 shadow-sm">
                        Proven Results
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-headline font-black mb-4 tracking-tight text-foreground">
                        Don't Just Take Our Word For It
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
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
                            <SpotlightCard className="p-8 h-full flex flex-col bg-white border border-border shadow-sm hover:shadow-xl transition-shadow duration-300 rounded-3xl">
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
                                <blockquote className="text-lg text-foreground/80 font-medium leading-relaxed mb-8 flex-1 italic">
                                    &ldquo;{testimonial.quote}&rdquo;
                                </blockquote>
                                <div className="mt-auto pt-6 border-t border-slate-100 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary font-headline text-lg">
                                        {testimonial.author.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-headline font-black tracking-tight text-foreground">
                                            {testimonial.author}
                                        </div>
                                        <div className="text-sm font-medium text-muted-foreground">
                                            {testimonial.role}
                                        </div>
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
