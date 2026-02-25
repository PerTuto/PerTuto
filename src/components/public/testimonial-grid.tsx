"use client";

import { useState, useEffect } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { SpotlightCard } from './spotlight-card';
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

    return (
        <section className="py-24 px-6 relative overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary mb-4">
                        Proven Results
                    </div>
                    <h2 className="text-3xl md:text-5xl font-headline font-bold mb-4 tracking-tight">
                        Don't Just Take Our Word For It
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        We measure our success entirely by the quantifiable improvements of our students.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {testimonials.map((testimonial, i) => (
                        <SpotlightCard key={i} className="p-8 h-full flex flex-col">
                            <div className="flex gap-1 mb-6">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <blockquote className="text-lg text-foreground/90 leading-relaxed mb-8 flex-1">
                                "{testimonial.quote}"
                            </blockquote>
                            <div className="mt-auto pt-6 border-t border-border/50">
                                <div className="font-headline font-bold text-foreground">
                                    {testimonial.author}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {testimonial.role}
                                </div>
                            </div>
                        </SpotlightCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
