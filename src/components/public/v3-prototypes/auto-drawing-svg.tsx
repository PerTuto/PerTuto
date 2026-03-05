'use client';

import { motion } from 'framer-motion';

/**
 * AutoDrawingSVG — Hand-drawn-style SVG arrows and doodles that animate
 * into view on page load. Designed to sit in the hero section behind
 * the sticky notes, drawing bold dashed arrows from each note's edge
 * toward the center text area — just like the whiteboard mockup.
 *
 * Coordinate system: viewBox 0 0 1000 600, centered on the hero.
 */

const ARROWS = [
    // Arrow from top-left (IB Math note area) curving toward center
    {
        d: 'M 140 120 C 200 100, 280 130, 350 200 L 340 190 M 350 200 L 345 188',
        delay: 0.6,
    },
    // Arrow from top-right (Chemistry note) curving toward center
    {
        d: 'M 830 100 C 770 90, 700 120, 650 190 L 660 180 M 650 190 L 656 178',
        delay: 0.9,
    },
    // Arrow from mid-left (1-on-1 note) pointing right toward center
    {
        d: 'M 120 310 C 170 300, 240 280, 320 280 L 310 274 M 320 280 L 310 286',
        delay: 1.2,
    },
    // Arrow from mid-right (Global note) pointing left toward center
    {
        d: 'M 880 290 C 830 280, 760 270, 680 270 L 690 264 M 680 270 L 690 276',
        delay: 1.5,
    },
    // Arrow from bottom-left (AI & ML note) curving up toward center
    {
        d: 'M 150 470 C 200 460, 280 430, 350 380 L 342 385 M 350 380 L 345 392',
        delay: 1.8,
    },
    // Arrow from bottom-right (Testimonial note) curving up toward center
    {
        d: 'M 850 460 C 800 450, 720 420, 650 370 L 658 375 M 650 370 L 655 382',
        delay: 2.1,
    },
];

// Decorative corner doodles — small spirals and circles for whiteboard feel
const CORNER_DOODLES = [
    // Top-left corner spiral
    {
        d: 'M 60 50 C 70 40, 85 42, 82 55 C 79 68, 62 66, 65 53',
        delay: 2.4,
    },
    // Bottom-right star decoration
    {
        d: 'M 920 520 L 930 510 M 925 525 L 925 505 M 918 518 L 932 518',
        delay: 2.6,
    },
    // Wavy underline beneath "Reimagined" text area
    {
        d: 'M 380 370 Q 430 358, 480 370 T 580 370 T 620 370',
        delay: 1.0,
        color: 'rgba(20, 184, 166, 0.4)',
        width: 3,
    },
];

export function AutoDrawingSVG() {
    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
            viewBox="0 0 1000 600"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
        >
            {/* Bold dashed arrows from sticky notes toward center */}
            {ARROWS.map((arrow, i) => (
                <motion.path
                    key={`arrow-${i}`}
                    d={arrow.d}
                    stroke="rgba(30, 30, 30, 0.6)"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="8 6"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                        pathLength: {
                            duration: 1.2,
                            ease: 'easeInOut',
                            delay: arrow.delay,
                        },
                        opacity: {
                            duration: 0.3,
                            delay: arrow.delay,
                        },
                    }}
                />
            ))}

            {/* Corner doodles */}
            {CORNER_DOODLES.map((doodle, i) => (
                <motion.path
                    key={`doodle-${i}`}
                    d={doodle.d}
                    stroke={doodle.color || 'rgba(30, 30, 30, 0.35)'}
                    strokeWidth={doodle.width || 2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                        pathLength: {
                            duration: 1.5,
                            ease: 'easeInOut',
                            delay: doodle.delay,
                        },
                        opacity: {
                            duration: 0.4,
                            delay: doodle.delay,
                        },
                    }}
                />
            ))}
        </svg>
    );
}
