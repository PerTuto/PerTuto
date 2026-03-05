'use client';

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * ScrollProgressBar — Thin horizontal progress indicator at top of page.
 * Fills from left to right as the user scrolls, with a gradient that
 * transitions from teal → emerald → blue.
 */
export function ScrollProgressBar() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-[3px] z-[100] origin-left"
            style={{
                scaleX,
                background: 'linear-gradient(90deg, #10b981 0%, #059669 40%, #3b82f6 100%)',
            }}
        />
    );
}
