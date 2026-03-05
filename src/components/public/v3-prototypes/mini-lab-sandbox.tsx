'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DndContext,
    useDraggable,
    useDroppable,
    DragEndEvent,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { CheckCircle2, XCircle, RotateCcw, Beaker } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGamificationStore } from '@/lib/store/useGamificationStore';
import { useSoundEffect } from '@/hooks/use-sound-effect';
import { FlashCardsGame } from './flash-cards-game';
import { MatchGame } from './match-game';

const TABS = [
    { id: 'equations', label: '🧮 Equations' },
    { id: 'flashcards', label: '🃏 Flash Cards' },
    { id: 'matchgame', label: '🧩 Match Game' },
] as const;
type TabId = typeof TABS[number]['id'];

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

interface MathPuzzle {
    id: string;
    subject: string;
    instruction: string;
    /** The blocks available to drag */
    blocks: { id: string; label: string }[];
    /** The drop zones (slots) in the equation */
    slots: { id: string; placeholder: string }[];
    /** Correct mapping: slotId → blockId */
    solution: Record<string, string>;
}

const PUZZLES: MathPuzzle[] = [
    {
        id: 'p1',
        subject: 'IB Math AA',
        instruction: 'Drag the blocks to complete the derivative:  d/dx [x³ + 2x]',
        blocks: [
            { id: 'b1', label: '3x²' },
            { id: 'b2', label: '+ 2' },
            { id: 'b3', label: '+ 2x' },
            { id: 'b4', label: '6x' },
        ],
        slots: [
            { id: 's1', placeholder: '?' },
            { id: 's2', placeholder: '?' },
        ],
        solution: { s1: 'b1', s2: 'b2' },
    },
    {
        id: 'p2',
        subject: 'IGCSE Physics',
        instruction: 'Complete the equation:  F = ?  ×  ?',
        blocks: [
            { id: 'b1', label: 'm' },
            { id: 'b2', label: 'a' },
            { id: 'b3', label: 'v' },
            { id: 'b4', label: 't' },
        ],
        slots: [
            { id: 's1', placeholder: '?' },
            { id: 's2', placeholder: '?' },
        ],
        solution: { s1: 'b1', s2: 'b2' },
    },
    {
        id: 'p3',
        subject: 'A-Level Chemistry',
        instruction: 'Balance:  ?H₂ + ?O₂ → ?H₂O',
        blocks: [
            { id: 'b1', label: '2' },
            { id: 'b2', label: '1' },
            { id: 'b3', label: '2' },
            { id: 'b4', label: '3' },
        ],
        slots: [
            { id: 's1', placeholder: '?' },
            { id: 's2', placeholder: '?' },
            { id: 's3', placeholder: '?' },
        ],
        solution: { s1: 'b1', s2: 'b2', s3: 'b3' },
    },
];

/* ------------------------------------------------------------------ */
/*  Draggable Block                                                    */
/* ------------------------------------------------------------------ */

function DraggableBlock({ id, label, isPlaced, dark = false }: { id: string; label: string; isPlaced: boolean; dark?: boolean }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });

    const style: React.CSSProperties = {
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
        opacity: isDragging ? 0.6 : isPlaced ? 0.3 : 1,
        cursor: isPlaced ? 'not-allowed' : 'grab',
        pointerEvents: isPlaced ? 'none' : 'auto',
    };

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            whileHover={!isPlaced ? { scale: 1.08, y: -2 } : {}}
            whileTap={!isPlaced ? { scale: 0.95 } : {}}
            className={`
                inline-flex items-center justify-center px-5 py-3 rounded-xl font-mono font-bold text-lg
                border-2 shadow-md select-none transition-colors
                ${isPlaced
                    ? dark ? 'bg-white/[0.03] border-white/10 text-white/30' : 'bg-slate-100 border-slate-200 text-slate-400'
                    : dark ? 'bg-white/[0.06] border-primary/40 text-primary hover:border-primary hover:shadow-lg hover:shadow-primary/10' : 'bg-white border-primary/30 text-primary hover:border-primary hover:shadow-lg'
                }
            `}
        >
            {label}
        </motion.div>
    );
}

/* ------------------------------------------------------------------ */
/*  Droppable Slot                                                     */
/* ------------------------------------------------------------------ */

function DroppableSlot({ id, placeholder, filledLabel, isCorrect, dark = false }: {
    id: string;
    placeholder: string;
    filledLabel: string | null;
    isCorrect: boolean | null;
    dark?: boolean;
}) {
    const { isOver, setNodeRef } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className={`
                w-20 h-14 rounded-xl border-2 border-dashed flex items-center justify-center font-mono font-bold text-lg
                transition-all duration-200
                ${filledLabel
                    ? isCorrect === true
                        ? dark ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400' : 'bg-emerald-50 border-emerald-400 text-emerald-700'
                        : isCorrect === false
                            ? dark ? 'bg-red-500/20 border-red-400 text-red-400' : 'bg-red-50 border-red-400 text-red-700'
                            : dark ? 'bg-blue-500/20 border-blue-400 text-blue-400' : 'bg-blue-50 border-blue-400 text-blue-700'
                    : isOver
                        ? 'bg-primary/10 border-primary scale-110'
                        : dark ? 'bg-white/[0.04] border-white/20 text-white/40' : 'bg-slate-50 border-slate-300 text-slate-400'
                }
            `}
        >
            {filledLabel || placeholder}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Main Lab Component                                                 */
/* ------------------------------------------------------------------ */

export function MiniLabSandbox({ className = '', dark = false }: { className?: string; dark?: boolean }) {
    const [puzzleIndex, setPuzzleIndex] = useState(0);
    const [placements, setPlacements] = useState<Record<string, string>>({});
    const [verified, setVerified] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const addScore = useGamificationStore((s) => s.addScore);
    const { play } = useSoundEffect();

    const puzzle = PUZZLES[puzzleIndex];
    const allSlotsFilled = puzzle.slots.every((s) => placements[s.id]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } }),
    );

    // Which blocks are currently placed in slots
    const placedBlockIds = new Set(Object.values(placements));

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        // Only allow dropping on slot targets
        const slotId = over.id as string;
        if (!puzzle.slots.find((s) => s.id === slotId)) return;

        setPlacements((prev) => {
            const updated = { ...prev };
            // Remove block from any other slot it was in
            for (const key of Object.keys(updated)) {
                if (updated[key] === active.id) delete updated[key];
            }
            updated[slotId] = active.id as string;
            return updated;
        });
        play('click');
    }, [puzzle, play]);

    const verify = useCallback(() => {
        setVerified(true);
        const correct = puzzle.slots.every(
            (s) => placements[s.id] === puzzle.solution[s.id]
        );
        setIsCorrect(correct);

        if (correct) {
            addScore(50);
            play('success');
            confetti({
                particleCount: 80,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'],
            });
        }
    }, [puzzle, placements, addScore, play]);

    const nextPuzzle = useCallback(() => {
        setPuzzleIndex((i) => (i + 1) % PUZZLES.length);
        setPlacements({});
        setVerified(false);
        setIsCorrect(false);
    }, []);

    const resetPuzzle = useCallback(() => {
        setPlacements({});
        setVerified(false);
        setIsCorrect(false);
    }, []);

    const [activeTab, setActiveTab] = useState<TabId>('equations');

    return (
        <section className={`py-24 md:py-32 px-6 relative ${className}`}>
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold tracking-wide uppercase text-primary mb-6 shadow-sm ${dark ? 'border-primary/30 bg-primary/10' : 'border-primary/20 bg-primary/5'}`}>
                        <Beaker className="w-4 h-4" />
                        Interactive Mini-Lab
                    </div>
                    <h2 className={`text-4xl md:text-5xl font-headline font-black mb-4 tracking-tight ${dark ? 'text-white' : 'text-foreground'}`}>
                        Solve It Yourself
                    </h2>
                    <p className={`text-lg font-medium max-w-lg mx-auto mb-8 ${dark ? 'text-white/60' : 'text-muted-foreground'}`}>
                        Test your knowledge with equations, flash cards, or the matching game.
                    </p>

                    {/* Tab Pills */}
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    px-5 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all duration-300
                                    ${activeTab === tab.id
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : dark ? 'bg-white/[0.06] text-white/60 hover:bg-white/10 hover:text-white border border-white/10' : 'bg-white/80 text-foreground/60 hover:bg-white hover:text-foreground border border-border/50'
                                    }
                                `}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'equations' && (
                        <motion.div key="equations" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
                            {/* Puzzle Card */}
                            <motion.div
                                key={puzzle.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`rounded-3xl border shadow-xl p-8 md:p-10 ${dark ? 'bg-white/[0.04] backdrop-blur-xl border-white/10' : 'bg-white border-border/50'}`}
                            >
                                {/* Subject Badge */}
                                <div className={`text-xs font-bold uppercase tracking-widest mb-4 ${dark ? 'text-primary' : 'text-primary'}`}>
                                    {puzzle.subject}
                                </div>

                                {/* Instruction */}
                                <p className={`text-lg font-semibold mb-8 ${dark ? 'text-white' : 'text-foreground'}`}>
                                    {puzzle.instruction}
                                </p>

                                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                                    {/* Drop Zone Equation */}
                                    <div className={`flex items-center justify-center gap-3 flex-wrap mb-10 p-6 rounded-2xl border ${dark ? 'bg-white/[0.03] border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                                        {puzzle.slots.map((slot, i) => {
                                            const filledBlockId = placements[slot.id];
                                            const filledBlock = puzzle.blocks.find((b) => b.id === filledBlockId);
                                            const slotCorrectness = verified
                                                ? placements[slot.id] === puzzle.solution[slot.id]
                                                : null;

                                            return (
                                                <React.Fragment key={slot.id}>
                                                    <DroppableSlot
                                                        id={slot.id}
                                                        placeholder={slot.placeholder}
                                                        filledLabel={filledBlock?.label || null}
                                                        isCorrect={slotCorrectness}
                                                        dark={dark}
                                                    />
                                                    {i < puzzle.slots.length - 1 && (
                                                        <span className={`font-mono text-xl font-bold mx-1 ${dark ? 'text-white/30' : 'text-slate-400'}`}>
                                                            {puzzle.id === 'p2' ? '×' : puzzle.id === 'p3' ? '' : '+'}
                                                        </span>
                                                    )}
                                                </React.Fragment>
                                            );
                                        })}
                                    </div>

                                    {/* Draggable Blocks */}
                                    <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                                        {puzzle.blocks.map((block) => (
                                            <DraggableBlock
                                                key={block.id}
                                                id={block.id}
                                                label={block.label}
                                                isPlaced={placedBlockIds.has(block.id)}
                                                dark={dark}
                                            />
                                        ))}
                                    </div>
                                </DndContext>

                                {/* Result / Actions */}
                                <AnimatePresence mode="wait">
                                    {verified ? (
                                        <motion.div
                                            key="result"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="text-center"
                                        >
                                            {isCorrect ? (
                                                <div className="flex flex-col items-center gap-3">
                                                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                                    <p className={`font-bold text-lg ${dark ? 'text-emerald-400' : 'text-emerald-600'}`}>Correct! +50 Combo Points 🎉</p>
                                                    <button
                                                        onClick={nextPuzzle}
                                                        className="mt-2 bg-primary text-white px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors"
                                                    >
                                                        Next Puzzle →
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-3">
                                                    <XCircle className="w-12 h-12 text-red-400" />
                                                    <p className={`font-bold text-lg ${dark ? 'text-red-400' : 'text-red-500'}`}>Not quite — try again!</p>
                                                    <button
                                                        onClick={resetPuzzle}
                                                        className={`mt-2 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-colors flex items-center gap-2 ${dark ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                                                    >
                                                        <RotateCcw className="w-4 h-4" /> Reset
                                                    </button>
                                                </div>
                                            )}
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="verify"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="text-center"
                                        >
                                            <button
                                                onClick={verify}
                                                disabled={!allSlotsFilled}
                                                className={`
                                                    px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all
                                                    ${allSlotsFilled
                                                        ? 'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                                                        : dark ? 'bg-white/10 text-white/30 cursor-not-allowed' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                                    }
                                                `}
                                            >
                                                Check Answer
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </motion.div>
                    )}

                    {activeTab === 'flashcards' && (
                        <motion.div key="flashcards" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
                            <div className={`rounded-3xl border shadow-xl p-8 md:p-10 ${dark ? 'bg-white/[0.04] backdrop-blur-xl border-white/10' : 'bg-white border-border/50'}`}>
                                <FlashCardsGame dark={dark} />
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'matchgame' && (
                        <motion.div key="matchgame" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
                            <div className={`rounded-3xl border shadow-xl p-8 md:p-10 ${dark ? 'bg-white/[0.04] backdrop-blur-xl border-white/10' : 'bg-white border-border/50'}`}>
                                <MatchGame dark={dark} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
