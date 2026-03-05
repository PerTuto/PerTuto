'use client';

import React from 'react';
import { motion } from 'framer-motion';

/* ------------------------------------------------------------------ */
/*  Scroll-Triggered "Did You Know?" Facts                             */
/* ------------------------------------------------------------------ */

interface DidYouKnowProps {
    icon: string;
    fact: string;
    /** Which side to slide in from */
    direction?: 'left' | 'right';
}

export function DidYouKnow({ icon, fact, direction = 'left' }: DidYouKnowProps) {
    return (
        <div className="py-8 md:py-12 px-6">
            <motion.div
                initial={{ opacity: 0, x: direction === 'left' ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                className="max-w-2xl mx-auto"
            >
                <div className="flex items-center gap-4 px-6 py-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-sm">
                    <span className="text-3xl flex-shrink-0">{icon}</span>
                    <p className="text-sm md:text-base font-semibold text-foreground/80 leading-relaxed">
                        {fact}
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
