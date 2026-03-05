'use client';

import React from 'react';
import { motion } from 'framer-motion';

/* ------------------------------------------------------------------ */
/*  Steps Data                                                         */
/* ------------------------------------------------------------------ */

const STEPS = [
    {
        number: '01',
        title: 'Tell Us Your Goals',
        description: 'Share your subjects, curriculum, and learning targets in a quick form.',
    },
    {
        number: '02',
        title: 'Get Matched',
        description: 'We pair you with a vetted subject specialist within 24 hours.',
    },
    {
        number: '03',
        title: 'Join Your First Session',
        description: 'Live 1-on-1 via Google Meet, tailored to your pace and style.',
    },
    {
        number: '04',
        title: 'Watch Grades Soar',
        description: '94% of students improve by at least one grade level within 3 months.',
    },
];

/* ------------------------------------------------------------------ */
/*  Editorial Step Row                                                  */
/* ------------------------------------------------------------------ */

function StepRow({ step, index }: { step: typeof STEPS[0]; index: number }) {
    return (
        <motion.div
            className="group relative grid grid-cols-[auto_1fr] md:grid-cols-[120px_1fr] gap-6 md:gap-10 items-start py-10 md:py-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
        >
            {/* Giant number */}
            <span
                className="font-headline font-black text-6xl md:text-8xl tracking-tighter text-primary/10 group-hover:text-primary/25 transition-colors duration-500 select-none leading-none"
            >
                {step.number}
            </span>

            {/* Text */}
            <div className="pt-1 md:pt-3">
                <h3 className="text-xl md:text-2xl font-headline font-black text-foreground tracking-tight mb-2">
                    {step.title}
                </h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-md">
                    {step.description}
                </p>
            </div>

            {/* Divider line between steps (except last) */}
            {index < STEPS.length - 1 && (
                <div className="absolute bottom-0 left-0 right-0 h-px bg-border/50" />
            )}
        </motion.div>
    );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function JourneyTimeline() {
    return (
        <section className="py-24 md:py-32 px-6 relative">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2
                        className="font-headline font-black uppercase mb-4 text-foreground tracking-[-0.03em]"
                        style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1 }}
                    >
                        How It<br /><span className="text-primary">Works</span>
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg font-medium max-w-lg">
                        From first contact to measurable results — four simple steps.
                    </p>
                </motion.div>

                {/* Steps */}
                <div>
                    {STEPS.map((step, i) => (
                        <StepRow key={step.number} step={step} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
