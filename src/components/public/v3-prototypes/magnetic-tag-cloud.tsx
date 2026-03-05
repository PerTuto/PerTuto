'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';
import { useGamificationStore } from '@/lib/store/useGamificationStore';
import { useSoundEffect } from '@/hooks/use-sound-effect';

/* ------------------------------------------------------------------ */
/*  Keyword Data                                                       */
/* ------------------------------------------------------------------ */

interface Keyword {
    id: string;
    label: string;
    category: 'k12' | 'university' | 'ai' | 'all';
    color: string;
    /** Base position (% of container) */
    x: number;
    y: number;
    size: 'sm' | 'md' | 'lg';
    stat?: string;
}

const KEYWORDS: Keyword[] = [
    // ── Math cluster (top-left quadrant) ──
    { id: 'igcse-math', label: 'IGCSE Math', category: 'k12', color: '#10b981', x: 4, y: 8, size: 'md', stat: '16 active tutors' },
    { id: 'a-level-math', label: 'A-Level Math', category: 'k12', color: '#10b981', x: 18, y: 18, size: 'sm', stat: '15 active tutors' },
    { id: 'ib-math', label: 'IB Math HL', category: 'k12', color: '#10b981', x: 8, y: 32, size: 'lg', stat: '6.2/7 avg score' },
    { id: 'cbse-math', label: 'CBSE Math', category: 'k12', color: '#10b981', x: 30, y: 6, size: 'sm', stat: '8 active tutors' },
    { id: 'calculus', label: 'Calculus', category: 'university', color: '#3b82f6', x: 22, y: 40, size: 'lg', stat: '18 active tutors' },
    { id: 'linear-algebra', label: 'Linear Algebra', category: 'university', color: '#3b82f6', x: 6, y: 52, size: 'md', stat: '12 active tutors' },
    { id: 'differential-eq', label: 'Differential Equations', category: 'university', color: '#3b82f6', x: 20, y: 58, size: 'sm', stat: '7 active tutors' },
    { id: 'statistics', label: 'Statistics', category: 'university', color: '#3b82f6', x: 38, y: 50, size: 'sm', stat: '10 active tutors' },

    // ── Science cluster (top-right quadrant) ──
    { id: 'myp-sciences', label: 'MYP Sciences', category: 'k12', color: '#10b981', x: 62, y: 5, size: 'sm', stat: '11 active tutors' },
    { id: 'igcse-physics', label: 'IGCSE Physics', category: 'k12', color: '#10b981', x: 78, y: 10, size: 'md', stat: '14 active tutors' },
    { id: 'a-level-chem', label: 'A-Level Chemistry', category: 'k12', color: '#10b981', x: 88, y: 22, size: 'md', stat: '95% satisfaction' },
    { id: 'ib-chem', label: 'IB Chemistry', category: 'k12', color: '#10b981', x: 72, y: 28, size: 'md', stat: '12 active tutors' },
    { id: 'a-level-bio', label: 'A-Level Biology', category: 'k12', color: '#10b981', x: 92, y: 38, size: 'sm', stat: '10 active tutors' },
    { id: 'cbse-science', label: 'CBSE Science', category: 'k12', color: '#10b981', x: 60, y: 18, size: 'sm', stat: '6 active tutors' },
    { id: 'organic-chem', label: 'Organic Chemistry', category: 'university', color: '#3b82f6', x: 82, y: 48, size: 'md', stat: '9 active tutors' },

    // ── Standalone K-12 ──
    { id: 'ib-econ', label: 'IB Economics', category: 'k12', color: '#10b981', x: 48, y: 25, size: 'sm', stat: '9 active tutors' },

    // ── AI & Tech cluster (bottom half) ──
    { id: 'python', label: 'Python', category: 'ai', color: '#8b5cf6', x: 35, y: 68, size: 'lg', stat: '22 active tutors' },
    { id: 'javascript', label: 'JavaScript', category: 'ai', color: '#8b5cf6', x: 18, y: 75, size: 'sm', stat: '11 active tutors' },
    { id: 'sql', label: 'SQL & Databases', category: 'ai', color: '#8b5cf6', x: 8, y: 88, size: 'sm', stat: '8 active tutors' },
    { id: 'data-science', label: 'Data Science', category: 'ai', color: '#8b5cf6', x: 30, y: 85, size: 'md', stat: '13 active tutors' },
    { id: 'machine-learning', label: 'Machine Learning', category: 'ai', color: '#8b5cf6', x: 55, y: 62, size: 'lg', stat: '15 active tutors' },
    { id: 'deep-learning', label: 'Deep Learning', category: 'ai', color: '#8b5cf6', x: 72, y: 72, size: 'sm', stat: '7 active tutors' },
    { id: 'nlp', label: 'NLP', category: 'ai', color: '#8b5cf6', x: 88, y: 68, size: 'sm', stat: '5 active tutors' },
    { id: 'computer-vision', label: 'Computer Vision', category: 'ai', color: '#8b5cf6', x: 82, y: 85, size: 'sm', stat: '4 active tutors' },
];

/**
 * Constellation connections — each line represents a real academic relationship:
 *  → = curriculum progression (IGCSE → A-Level → IB → University)
 *  ↔ = prerequisite / co-requisite
 *  ⤳ = cross-discipline bridge
 */
const CONNECTIONS: [string, string][] = [
    // ── Math progression ladder ──
    ['igcse-math', 'a-level-math'],       // IGCSE → A-Level
    ['igcse-math', 'cbse-math'],          // parallel curricula
    ['a-level-math', 'ib-math'],          // A-Level ↔ IB (same tier)
    ['ib-math', 'calculus'],              // IB HL → university math
    ['a-level-math', 'calculus'],          // A-Level → university math
    ['calculus', 'linear-algebra'],        // core university pair
    ['calculus', 'differential-eq'],       // calculus → diff eq
    ['calculus', 'statistics'],            // math branches

    // ── Science progression ladder ──
    ['myp-sciences', 'igcse-physics'],     // MYP → IGCSE
    ['myp-sciences', 'cbse-science'],      // MYP ↔ CBSE (same tier)
    ['igcse-physics', 'a-level-chem'],     // IGCSE sciences → A-Level
    ['igcse-physics', 'ib-chem'],          // IGCSE → IB
    ['a-level-chem', 'ib-chem'],           // A-Level ↔ IB (same tier)
    ['a-level-chem', 'a-level-bio'],       // sister A-Level sciences
    ['a-level-chem', 'organic-chem'],      // A-Level → university chem
    ['a-level-bio', 'organic-chem'],       // biology ↔ biochemistry
    ['ib-chem', 'organic-chem'],           // IB → university chem

    // ── Programming → AI pipeline ──
    ['python', 'javascript'],              // sibling languages
    ['python', 'sql'],                     // data stack
    ['python', 'data-science'],            // Python is the data-science language
    ['python', 'machine-learning'],        // Python → ML
    ['data-science', 'sql'],               // data tools
    ['data-science', 'machine-learning'],  // DS ↔ ML
    ['machine-learning', 'deep-learning'], // ML → DL
    ['deep-learning', 'nlp'],              // DL applications
    ['deep-learning', 'computer-vision'],  // DL applications

    // ── Cross-discipline bridges ──
    ['linear-algebra', 'machine-learning'],// math foundation for ML
    ['statistics', 'data-science'],        // stats powers data science
    ['statistics', 'machine-learning'],    // stats powers ML
    ['differential-eq', 'machine-learning'],// diff eq in neural nets
    ['ib-econ', 'statistics'],             // economics uses statistics
];

const CATEGORIES = [
    { id: 'all' as const, label: 'All' },
    { id: 'k12' as const, label: 'K-12' },
    { id: 'university' as const, label: 'University' },
    { id: 'ai' as const, label: 'AI & Tech' },
];

const SIZE_CLASSES = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5 font-bold',
};

/* ------------------------------------------------------------------ */
/*  Individual Keyword Pill                                            */
/* ------------------------------------------------------------------ */

interface KeywordPillProps {
    keyword: Keyword;
    isActive: boolean;
    isHovered: boolean;
    mouseX: number;
    mouseY: number;
    containerRef: React.RefObject<HTMLDivElement | null>;
    onHover: (id: string | null) => void;
    onClick: (keyword: Keyword) => void;
}

function KeywordPill({
    keyword, isActive, isHovered, mouseX, mouseY, containerRef, onHover, onClick,
}: KeywordPillProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    // Magnetic repel effect
    useEffect(() => {
        if (!isActive || !ref.current || !containerRef.current) {
            setOffset({ x: 0, y: 0 });
            return;
        }

        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        const el = ref.current.getBoundingClientRect();
        
        // Element center in container-relative pixels
        const elCenterX = el.left - rect.left + el.width / 2;
        const elCenterY = el.top - rect.top + el.height / 2;

        // Mouse in container-relative coords
        const relMouseX = mouseX - rect.left;
        const relMouseY = mouseY - rect.top;

        const dx = elCenterX - relMouseX;
        const dy = elCenterY - relMouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const REPEL_RADIUS = 150;
        const REPEL_STRENGTH = 30;

        if (dist < REPEL_RADIUS && dist > 0) {
            const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
            setOffset({
                x: (dx / dist) * force,
                y: (dy / dist) * force,
            });
        } else {
            setOffset({ x: 0, y: 0 });
        }
    }, [mouseX, mouseY, isActive, containerRef]);

    const springX = useSpring(offset.x, { stiffness: 200, damping: 20 });
    const springY = useSpring(offset.y, { stiffness: 200, damping: 20 });

    useEffect(() => { springX.set(offset.x); }, [offset.x, springX]);
    useEffect(() => { springY.set(offset.y); }, [offset.y, springY]);

    return (
        <motion.div
            ref={ref}
            layout
            className={`absolute cursor-pointer select-none z-10`}
            style={{
                left: `${keyword.x}%`,
                top: `${keyword.y}%`,
                x: springX,
                y: springY,
            }}
            animate={{
                opacity: isActive ? 1 : 0.2,
                scale: isActive ? 1 : 0.6,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onMouseEnter={() => onHover(keyword.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onClick(keyword)}
        >
            <div
                className={`
                    rounded-full border-2 whitespace-nowrap
                    transition-shadow duration-300
                    ${SIZE_CLASSES[keyword.size]}
                    ${isHovered
                        ? 'shadow-lg ring-2 ring-offset-2'
                        : 'shadow-sm'
                    }
                `}
                style={{
                    backgroundColor: isHovered ? keyword.color : `${keyword.color}15`,
                    borderColor: `${keyword.color}40`,
                    color: isHovered ? '#ffffff' : keyword.color,
                }}
            >
                {keyword.label}
            </div>
        </motion.div>
    );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function MagneticTagCloud() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeFilter, setActiveFilter] = useState<'all' | 'k12' | 'university' | 'ai'>('all');
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [tooltipKeyword, setTooltipKeyword] = useState<Keyword | null>(null);
    const [clickedIds, setClickedIds] = useState<Set<string>>(new Set());
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const addScore = useGamificationStore((s) => s.addScore);
    const { play } = useSoundEffect();

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    }, []);

    const handleKeywordClick = useCallback((keyword: Keyword) => {
        setTooltipKeyword((prev) => (prev?.id === keyword.id ? null : keyword));
        play('click');

        if (!clickedIds.has(keyword.id)) {
            addScore(5);
            setClickedIds((prev) => new Set([...prev, keyword.id]));
        }
    }, [clickedIds, addScore, play]);

    // Get positions for SVG lines (using % positions as approximation)
    const getLineCoords = (id: string) => {
        const kw = KEYWORDS.find((k) => k.id === id);
        if (!kw) return null;
        return { x: kw.x, y: kw.y };
    };

    return (
        <section className="py-24 md:py-32 px-6 relative">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-sm font-bold tracking-wide uppercase text-primary mb-6 shadow-sm">
                        🌌 Explore Our Universe
                    </div>
                    <h2 className="text-4xl md:text-5xl font-headline font-black mb-4 tracking-tight text-foreground">
                        Every Subject, Connected
                    </h2>
                    <p className="text-lg text-muted-foreground font-medium max-w-lg mx-auto mb-8">
                        Hover to feel the magnetic pull. Click any subject to explore.
                    </p>

                    {/* Category Filters */}
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => { setActiveFilter(cat.id); setTooltipKeyword(null); }}
                                className={`
                                    px-5 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all duration-300
                                    ${activeFilter === cat.id
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'bg-white/80 text-foreground/60 hover:bg-white hover:text-foreground border border-border/50'
                                    }
                                `}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tag Cloud Area */}
                <div
                    ref={containerRef}
                    className="relative w-full aspect-[16/9] max-h-[500px] rounded-3xl"
                    onMouseMove={handleMouseMove}
                >
                    {/* Constellation Lines (SVG) */}
                    <svg
                        className="absolute inset-0 w-full h-full pointer-events-none z-0"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >
                        {CONNECTIONS.map(([from, to]) => {
                            const a = getLineCoords(from);
                            const b = getLineCoords(to);
                            if (!a || !b) return null;

                            const fromKw = KEYWORDS.find((k) => k.id === from);
                            const toKw = KEYWORDS.find((k) => k.id === to);
                            const fromActive = activeFilter === 'all' || fromKw?.category === activeFilter;
                            const toActive = activeFilter === 'all' || toKw?.category === activeFilter;
                            const lineActive = fromActive && toActive;
                            const lineHovered = hoveredId === from || hoveredId === to;

                            return (
                                <motion.line
                                    key={`${from}-${to}`}
                                    x1={a.x}
                                    y1={a.y}
                                    x2={b.x}
                                    y2={b.y}
                                    stroke={lineHovered ? fromKw?.color || '#94a3b8' : '#cbd5e1'}
                                    strokeWidth={lineHovered ? 0.4 : 0.15}
                                    strokeDasharray={lineHovered ? 'none' : '1 1'}
                                    animate={{
                                        opacity: lineActive ? (lineHovered ? 0.8 : 0.3) : 0.05,
                                    }}
                                    transition={{ duration: 0.3 }}
                                />
                            );
                        })}
                    </svg>

                    {/* Keyword Pills */}
                    {KEYWORDS.map((keyword) => {
                        const isActive = activeFilter === 'all' || keyword.category === activeFilter;
                        return (
                            <KeywordPill
                                key={keyword.id}
                                keyword={keyword}
                                isActive={isActive}
                                isHovered={hoveredId === keyword.id}
                                mouseX={mousePos.x}
                                mouseY={mousePos.y}
                                containerRef={containerRef}
                                onHover={setHoveredId}
                                onClick={handleKeywordClick}
                            />
                        );
                    })}

                    {/* Tooltip */}
                    <AnimatePresence>
                        {tooltipKeyword && (
                            <motion.div
                                key={tooltipKeyword.id}
                                initial={{ opacity: 0, scale: 0.9, y: 8 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 8 }}
                                className="absolute z-50 pointer-events-none"
                                style={{
                                    left: `${Math.min(Math.max(tooltipKeyword.x, 15), 85)}%`,
                                    top: `${tooltipKeyword.y + 6}%`,
                                    transform: 'translateX(-50%)',
                                }}
                            >
                                <div className="bg-white rounded-xl shadow-2xl border border-border/50 px-5 py-3 text-center min-w-[160px]">
                                    <p className="text-sm font-black text-foreground">{tooltipKeyword.label}</p>
                                    {tooltipKeyword.stat && (
                                        <p className="text-xs text-muted-foreground mt-0.5">{tooltipKeyword.stat}</p>
                                    )}
                                    <p className="text-[9px] text-primary font-bold mt-1">+5 combo</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Exploration Progress */}
                <div className="text-center mt-6">
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                        {clickedIds.size}/{KEYWORDS.length} subjects explored • +{clickedIds.size * 5} combo
                    </p>
                </div>
            </div>
        </section>
    );
}
