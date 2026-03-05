'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/* ------------------------------------------------------------------ */
/*  Stats Data                                                         */
/* ------------------------------------------------------------------ */

interface StatNote {
    id: string;
    emoji: string;
    value: string;
    label: string;
    bgColor: string;
    borderColor: string;
    pinColor: string;
    rotation: number;
}

const STAT_NOTES: StatNote[] = [
    {
        id: 's1',
        emoji: '🎓',
        value: '500+',
        label: 'Students Tutored',
        bgColor: '#fef9c3',
        borderColor: '#fde047',
        pinColor: '#ef4444',
        rotation: -3,
    },
    {
        id: 's2',
        emoji: '⭐',
        value: '4.9★',
        label: 'Average Rating',
        bgColor: '#dbeafe',
        borderColor: '#93c5fd',
        pinColor: '#3b82f6',
        rotation: 2,
    },
    {
        id: 's3',
        emoji: '🌍',
        value: '12+',
        label: 'Countries',
        bgColor: '#d1fae5',
        borderColor: '#6ee7b7',
        pinColor: '#10b981',
        rotation: -2,
    },
    {
        id: 's4',
        emoji: '📈',
        value: '95%',
        label: 'Score Improvement',
        bgColor: '#fce7f3',
        borderColor: '#f9a8d4',
        pinColor: '#ec4899',
        rotation: 3,
    },
];

/* ------------------------------------------------------------------ */
/*  Push Pin SVG                                                        */
/* ------------------------------------------------------------------ */

function PushPin({ color }: { color: string }) {
    return (
        <svg
            width="22"
            height="26"
            viewBox="0 0 24 28"
            fill="none"
            className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20 drop-shadow-md"
        >
            <circle cx="12" cy="8" r="7" fill={color} />
            <circle cx="12" cy="8" r="4" fill="white" opacity="0.35" />
            <path d="M12 15 L10.5 24 L13.5 24 Z" fill="#555" opacity="0.6" />
            <circle cx="10" cy="6" r="2" fill="white" opacity="0.5" />
        </svg>
    );
}

/* ------------------------------------------------------------------ */
/*  Animated Counter                                                    */
/* ------------------------------------------------------------------ */

function AnimatedValue({ value, inView }: { value: string; inView: boolean }) {
    // Extract the numeric part and suffix
    const match = value.match(/^([\d.]+)(.*)$/);
    const numericPart = match ? parseFloat(match[1]) : 0;
    const suffix = match ? match[2] : value;
    // Detect decimal places in original value
    const decimalPlaces = match && match[1].includes('.') ? (match[1].split('.')[1]?.length ?? 0) : 0;

    const [count, setCount] = React.useState(0);
    const hasAnimated = useRef(false);

    React.useEffect(() => {
        if (!inView || hasAnimated.current) return;
        hasAnimated.current = true;

        const duration = 1500; // Faster animation
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutQuart
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = decimalPlaces > 0
                ? parseFloat((eased * numericPart).toFixed(decimalPlaces))
                : Math.floor(eased * numericPart);
            setCount(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setCount(numericPart);
            }
        };

        requestAnimationFrame(animate);
    }, [inView, numericPart, decimalPlaces]);

    return (
        <span>
            {decimalPlaces > 0 ? count.toFixed(decimalPlaces) : count}{suffix}
        </span>
    );
}

/* ------------------------------------------------------------------ */
/*  Individual Stat Note                                                */
/* ------------------------------------------------------------------ */

function StatStickyNote({ data, index, inView }: { data: StatNote; index: number; inView: boolean }) {
    return (
        <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30, rotate: 0 }}
            animate={inView ? { opacity: 1, y: 0, rotate: data.rotation } : {}}
            transition={{
                type: 'spring',
                stiffness: 200,
                damping: 18,
                delay: index * 0.15 + 0.2,
            }}
        >
            <PushPin color={data.pinColor} />

            <motion.div
                whileHover={{ scale: 1.06, rotate: 0, y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-48 h-48 sm:w-52 sm:h-52 md:w-56 md:h-56 rounded-lg p-5 flex flex-col items-center justify-center text-center select-none relative overflow-hidden cursor-default"
                style={{
                    backgroundColor: data.bgColor,
                    borderLeft: `3px solid ${data.borderColor}`,
                    borderBottom: `3px solid ${data.borderColor}`,
                    borderRight: `1px solid ${data.borderColor}80`,
                    borderTop: `1px solid ${data.borderColor}80`,
                    boxShadow: `
                        0 6px 16px rgba(0,0,0,0.08),
                        0 2px 4px rgba(0,0,0,0.05),
                        inset 0 -2px 4px rgba(0,0,0,0.03),
                        inset 0 1px 0 rgba(255,255,255,0.5)
                    `,
                }}
            >
                {/* Paper lines texture */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.05]"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 23px, #666 23px, #666 24px)',
                        backgroundSize: '100% 24px',
                    }}
                />

                {/* Curled corner */}
                <div
                    className="absolute bottom-0 right-0 w-6 h-6 pointer-events-none"
                    style={{
                        background: 'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.04) 50%, rgba(0,0,0,0.08) 100%)',
                        borderRadius: '0 0 8px 0',
                    }}
                />

                <span className="text-2xl mb-2">{data.emoji}</span>
                <span className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight font-headline leading-none mb-1.5">
                    <AnimatedValue value={data.value} inView={inView} />
                </span>
                <span className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest leading-tight">
                    {data.label}
                </span>
            </motion.div>
        </motion.div>
    );
}

/* ------------------------------------------------------------------ */
/*  Hand-drawn SVG Doodles                                              */
/* ------------------------------------------------------------------ */

function WhiteboardDoodles({ inView }: { inView: boolean }) {
    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 800 300"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
        >
            {/* Arrow from note 1 → note 2 */}
            <motion.path
                d="M 220 150 C 280 120, 340 130, 380 150"
                stroke="rgba(30,30,30,0.3)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="6 5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 1.2, delay: 1.0 }}
            />
            {/* Arrow from note 2 → note 3 */}
            <motion.path
                d="M 440 150 C 490 180, 530 170, 570 150"
                stroke="rgba(30,30,30,0.3)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="6 5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 1.2, delay: 1.3 }}
            />

            {/* Small star doodle */}
            <motion.path
                d="M 310 80 L 314 70 L 318 80 L 328 82 L 320 88 L 322 98 L 314 92 L 306 98 L 308 88 L 300 82 Z"
                stroke="rgba(20,184,166,0.4)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 1, delay: 1.6 }}
            />

            {/* Checkmark doodle */}
            <motion.path
                d="M 540 230 L 548 240 L 565 218"
                stroke="rgba(16,185,129,0.5)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 1.8 }}
            />

            {/* Wavy underline */}
            <motion.path
                d="M 300 260 Q 350 248, 400 260 T 500 260"
                stroke="rgba(20,184,166,0.3)"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 1.2, delay: 2.0 }}
            />
        </svg>
    );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                      */
/* ------------------------------------------------------------------ */

export function WhiteboardNoticeboard() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section
            ref={ref}
            className="py-20 md:py-28 px-6 relative overflow-hidden"
            style={{
                backgroundColor: '#ffffff',
                backgroundImage: 'radial-gradient(circle, #c8c8cc 1px, transparent 1px)',
                backgroundSize: '28px 28px',
            }}
        >
            {/* Doodles */}
            <WhiteboardDoodles inView={inView} />

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Section Title */}
                <motion.div
                    className="text-center mb-14"
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <h2
                        className="font-headline font-black text-3xl md:text-4xl lg:text-5xl tracking-tight text-foreground mb-2"
                    >
                        The Results Speak
                    </h2>
                    {/* Hand-drawn underline */}
                    <svg width="200" height="12" viewBox="0 0 200 12" className="mx-auto" fill="none">
                        <motion.path
                            d="M 10 8 Q 50 2, 100 6 T 190 6"
                            stroke="#14b8a6"
                            strokeWidth="3"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={inView ? { pathLength: 1 } : {}}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        />
                    </svg>
                </motion.div>

                {/* Sticky Notes Grid */}
                <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                    {STAT_NOTES.map((note, i) => (
                        <StatStickyNote key={note.id} data={note} index={i} inView={inView} />
                    ))}
                </div>
            </div>
        </section>
    );
}
