'use client';

import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useGamificationStore } from '@/lib/store/useGamificationStore';
import { useSoundEffect } from '@/hooks/use-sound-effect';

interface StickyNoteData {
    id: string;
    emoji: string;
    title: string;
    tagline: string;
    backText: string;
    bgColor: string;
    borderColor: string;
    pinColor: string;
    rotation: number;
    position: { top?: string; bottom?: string; left?: string; right?: string };
}

const STICKY_NOTES: StickyNoteData[] = [
    {
        id: 'n1',
        emoji: '📐',
        title: 'IB Math HL',
        tagline: '6.2/7 avg score',
        backText: 'Our students consistently score in the top 15% globally in IB Math HL. Personalized problem sets and exam strategy.',
        bgColor: '#fef9c3',   // warm yellow
        borderColor: '#fde047',
        pinColor: '#ef4444',
        rotation: -5,
        position: { top: '6%', left: '3%' },
    },
    {
        id: 'n2',
        emoji: '🧪',
        title: 'Chemistry',
        tagline: 'Visualize & conquer',
        backText: 'From molecular geometry to organic reactions — we use 3D models and whiteboard walkthroughs to make it click.',
        bgColor: '#dbeafe',   // sky blue
        borderColor: '#93c5fd',
        pinColor: '#3b82f6',
        rotation: 3,
        position: { top: '4%', right: '8%' },
    },
    {
        id: 'n3',
        emoji: '🤖',
        title: 'AI & ML',
        tagline: 'Zero to deployed',
        backText: 'Build real ML models from scratch. Python, TensorFlow, and hands-on projects — not just theory.',
        bgColor: '#ede9fe',   // lavender
        borderColor: '#c4b5fd',
        pinColor: '#8b5cf6',
        rotation: -2,
        position: { bottom: '18%', left: '4%' },
    },
    {
        id: 'n4',
        emoji: '⭐',
        title: 'Testimonial',
        tagline: '"B to A* in 3 months"',
        backText: '"My son went from a B to an A* in IGCSE Physics. The tutor was patient, structured, and really cared." — Sarah M.',
        bgColor: '#fce7f3',   // salmon pink
        borderColor: '#f9a8d4',
        pinColor: '#ec4899',
        rotation: 4,
        position: { bottom: '12%', right: '3%' },
    },
    {
        id: 'n5',
        emoji: '🎯',
        title: '1-on-1',
        tagline: 'Your pace, your goals',
        backText: 'Every session is custom-designed around YOUR learning style. No cookie-cutter lesson plans.',
        bgColor: '#d1fae5',   // mint green
        borderColor: '#6ee7b7',
        pinColor: '#10b981',
        rotation: -1,
        position: { top: '40%', left: '1%' },
    },
    {
        id: 'n6',
        emoji: '🌍',
        title: 'Global',
        tagline: '12+ countries',
        backText: 'Students from Dubai, London, Singapore, Toronto, and 8 more countries trust PerTuto for academic excellence.',
        bgColor: '#ffedd5',   // peach
        borderColor: '#fdba74',
        pinColor: '#f97316',
        rotation: 2,
        position: { top: '36%', right: '1%' },
    },
];

/* ------------------------------------------------------------------ */
/*  Push Pin SVG                                                        */
/* ------------------------------------------------------------------ */

function PushPin({ color }: { color: string }) {
    return (
        <svg
            width="24"
            height="28"
            viewBox="0 0 24 28"
            fill="none"
            className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 drop-shadow-md"
        >
            {/* Pin head */}
            <circle cx="12" cy="8" r="7" fill={color} />
            <circle cx="12" cy="8" r="4" fill="white" opacity="0.35" />
            {/* Pin spike */}
            <path d="M12 15 L10.5 24 L13.5 24 Z" fill="#555" opacity="0.6" />
            {/* Highlight */}
            <circle cx="10" cy="6" r="2" fill="white" opacity="0.5" />
        </svg>
    );
}

/* ------------------------------------------------------------------ */
/*  Individual Sticky Note                                              */
/* ------------------------------------------------------------------ */

function StickyNote({ data, constraintsRef }: { data: StickyNoteData; constraintsRef: React.RefObject<HTMLDivElement | null> }) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [hasScored, setHasScored] = useState(false);
    const addScore = useGamificationStore((s) => s.addScore);
    const { play } = useSoundEffect();

    const handleClick = useCallback(() => {
        setIsFlipped((f) => !f);
        play('click');
        if (!hasScored) {
            addScore(10);
            setHasScored(true);
        }
    }, [hasScored, addScore, play]);

    return (
        <motion.div
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.08}
            whileDrag={{ scale: 1.08, rotate: data.rotation + 3, zIndex: 50 }}
            whileHover={{ scale: 1.04, y: -6 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, scale: 0.7, rotate: data.rotation, y: 20 }}
            animate={{ opacity: 1, scale: 1, rotate: data.rotation, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22, delay: Math.random() * 0.4 + 0.2 }}
            onClick={handleClick}
            className="cursor-grab active:cursor-grabbing absolute z-10"
            style={data.position}
        >
            {/* Push Pin */}
            <PushPin color={data.pinColor} />

            <div className="relative" style={{ perspective: '700px' }}>
                <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="relative"
                >
                    {/* ===== FRONT ===== */}
                    <div
                        className="w-44 h-48 sm:w-48 sm:h-52 md:w-56 md:h-56 rounded-lg p-5 flex flex-col items-center justify-center text-center select-none relative overflow-hidden"
                        style={{
                            backgroundColor: data.bgColor,
                            borderLeft: `3px solid ${data.borderColor}`,
                            borderBottom: `3px solid ${data.borderColor}`,
                            borderRight: `1px solid ${data.borderColor}80`,
                            borderTop: `1px solid ${data.borderColor}80`,
                            boxShadow: `
                                0 4px 12px rgba(0,0,0,0.08),
                                0 1px 3px rgba(0,0,0,0.06),
                                inset 0 -2px 4px rgba(0,0,0,0.03),
                                inset 0 1px 0 rgba(255,255,255,0.5)
                            `,
                            backfaceVisibility: 'hidden',
                        }}
                    >
                        {/* Paper lines texture */}
                        <div
                            className="absolute inset-0 pointer-events-none opacity-[0.06]"
                            style={{
                                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 23px, #666 23px, #666 24px)',
                                backgroundSize: '100% 24px',
                            }}
                        />

                        {/* Curled corner illusion */}
                        <div
                            className="absolute bottom-0 right-0 w-6 h-6 pointer-events-none"
                            style={{
                                background: `linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.04) 50%, rgba(0,0,0,0.08) 100%)`,
                                borderRadius: '0 0 8px 0',
                            }}
                        />

                        <span className="text-3xl md:text-4xl mb-2 drop-shadow-sm">{data.emoji}</span>
                        <span className="text-sm md:text-base font-extrabold text-slate-800 leading-tight tracking-tight">
                            {data.title}
                        </span>
                        <span className="text-[11px] md:text-xs text-slate-500 font-semibold mt-1.5 leading-snug">
                            {data.tagline}
                        </span>
                        <span className="text-[9px] text-slate-400 mt-auto pt-2 uppercase tracking-wider font-bold flex items-center gap-1">
                            tap to flip <span className="text-[10px]">↻</span>
                        </span>
                    </div>

                    {/* ===== BACK ===== */}
                    <div
                        className="w-44 h-48 sm:w-48 sm:h-52 md:w-56 md:h-56 rounded-lg p-5 flex flex-col items-center justify-center text-center select-none absolute inset-0 overflow-hidden"
                        style={{
                            backgroundColor: data.bgColor,
                            borderLeft: `3px solid ${data.borderColor}`,
                            borderBottom: `3px solid ${data.borderColor}`,
                            borderRight: `1px solid ${data.borderColor}80`,
                            borderTop: `1px solid ${data.borderColor}80`,
                            boxShadow: `
                                0 4px 12px rgba(0,0,0,0.08),
                                0 1px 3px rgba(0,0,0,0.06),
                                inset 0 -2px 4px rgba(0,0,0,0.03),
                                inset 0 1px 0 rgba(255,255,255,0.5)
                            `,
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                        }}
                    >
                        {/* Paper lines texture */}
                        <div
                            className="absolute inset-0 pointer-events-none opacity-[0.06]"
                            style={{
                                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 23px, #666 23px, #666 24px)',
                                backgroundSize: '100% 24px',
                            }}
                        />

                        <p className="text-[11px] sm:text-xs md:text-sm font-semibold text-slate-700 leading-relaxed relative z-10">
                            &ldquo;{data.backText}&rdquo;
                        </p>
                        <span className="text-[9px] text-slate-400 mt-auto pt-2 uppercase tracking-wider font-bold">
                            tap to flip back ↻
                        </span>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

/* ------------------------------------------------------------------ */
/*  Canvas                                                              */
/* ------------------------------------------------------------------ */

export function StickyNoteCanvas() {
    const constraintsRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={constraintsRef}
            className="absolute inset-0 overflow-hidden z-10"
        >
            {STICKY_NOTES.map((note) => (
                <StickyNote key={note.id} data={note} constraintsRef={constraintsRef} />
            ))}
        </div>
    );
}
