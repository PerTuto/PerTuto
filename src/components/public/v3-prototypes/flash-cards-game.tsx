'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamificationStore } from '@/lib/store/useGamificationStore';
import { useSoundEffect } from '@/hooks/use-sound-effect';

/* ------------------------------------------------------------------ */
/*  Flash Card Data                                                    */
/* ------------------------------------------------------------------ */

interface FlashCard {
    id: string;
    question: string;
    answer: string;
    emoji: string;
}

const FLASH_CARDS: FlashCard[] = [
    { id: 'fc1', question: 'What is the derivative of sin(x)?', answer: 'cos(x)', emoji: '📐' },
    { id: 'fc2', question: 'What is the chemical formula for water?', answer: 'H₂O', emoji: '🧪' },
    { id: 'fc3', question: "What is Newton's Second Law?", answer: 'F = ma', emoji: '🍎' },
    { id: 'fc4', question: 'What does DNA stand for?', answer: 'Deoxyribonucleic Acid', emoji: '🧬' },
    { id: 'fc5', question: 'What is the integral of 1/x?', answer: 'ln|x| + C', emoji: '∫' },
    { id: 'fc6', question: 'What is the speed of light?', answer: '3 × 10⁸ m/s', emoji: '💡' },
];

/* ------------------------------------------------------------------ */
/*  Individual Card                                                    */
/* ------------------------------------------------------------------ */

function FlashCardItem({ card, onRate, dark = false }: { card: FlashCard; onRate: (confidence: string) => void; dark?: boolean }) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [rated, setRated] = useState(false);
    const { play } = useSoundEffect();

    const handleFlip = () => {
        if (!isFlipped) {
            setIsFlipped(true);
            play('click');
        }
    };

    const handleRate = (confidence: string) => {
        if (rated) return;
        setRated(true);
        play('success');
        onRate(confidence);
    };

    return (
        <motion.div
            layout
            className="w-full max-w-sm mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            {/* Card */}
            <div
                onClick={handleFlip}
                className={`relative cursor-pointer select-none ${!isFlipped ? 'hover:scale-[1.02]' : ''} transition-transform`}
                style={{ perspective: '800px' }}
            >
                <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Front — Question */}
                    <div
                        className={`w-full min-h-[200px] rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg border-2 ${dark ? 'bg-white/[0.06] border-primary/30 backdrop-blur-xl' : 'bg-white border-primary/20'}`}
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        <span className="text-4xl mb-4">{card.emoji}</span>
                        <p className={`text-base font-bold leading-relaxed ${dark ? 'text-white' : 'text-foreground'}`}>{card.question}</p>
                        <span className={`text-[10px] mt-4 uppercase tracking-widest font-bold ${dark ? 'text-white/40' : 'text-muted-foreground'}`}>
                            Tap to reveal answer
                        </span>
                    </div>

                    {/* Back — Answer */}
                    <div
                        className={`w-full min-h-[200px] rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg absolute inset-0 border-2 ${dark ? 'bg-primary/10 border-primary/40 backdrop-blur-xl' : 'bg-primary/5 border-primary/30'}`}
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                        <span className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Answer</span>
                        <p className={`text-xl font-black ${dark ? 'text-white' : 'text-foreground'}`}>{card.answer}</p>
                    </div>
                </motion.div>
            </div>

            {/* Confidence Rating (shows after flip) */}
            <AnimatePresence>
                {isFlipped && !rated && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-center gap-3 mt-4"
                    >
                        <span className={`text-xs font-bold uppercase tracking-wider ${dark ? 'text-white/40' : 'text-muted-foreground'}`}>How did you do?</span>
                        {[
                            { label: '😊', value: 'easy' },
                            { label: '😐', value: 'medium' },
                            { label: '😢', value: 'hard' },
                        ].map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => handleRate(opt.value)}
                                className="text-2xl hover:scale-125 active:scale-95 transition-transform p-1"
                            >
                                {opt.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* ------------------------------------------------------------------ */
/*  Main Flash Cards Game                                              */
/* ------------------------------------------------------------------ */

export function FlashCardsGame({ dark = false }: { dark?: boolean }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [completed, setCompleted] = useState(0);
    const addScore = useGamificationStore((s) => s.addScore);

    const handleRate = useCallback(() => {
        addScore(15);
        // Move to next card after a short delay
        setTimeout(() => {
            if (currentIndex < FLASH_CARDS.length - 1) {
                setCurrentIndex((i) => i + 1);
            }
            setCompleted((c) => c + 1);
        }, 600);
    }, [currentIndex, addScore]);

    const isComplete = completed >= FLASH_CARDS.length;

    return (
        <div className="py-8">
            {/* Progress */}
            <div className="flex items-center justify-between mb-6 max-w-sm mx-auto">
                <span className={`text-xs font-bold uppercase tracking-wider ${dark ? 'text-white/40' : 'text-muted-foreground'}`}>
                    Card {Math.min(currentIndex + 1, FLASH_CARDS.length)} of {FLASH_CARDS.length}
                </span>
                <span className="text-xs font-bold text-primary">
                    +{completed * 15} combo
                </span>
            </div>

            {/* Progress Bar */}
            <div className={`w-full max-w-sm mx-auto h-1.5 rounded-full mb-6 overflow-hidden ${dark ? 'bg-white/10' : 'bg-slate-200'}`}>
                <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(completed / FLASH_CARDS.length) * 100}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
            </div>

            {/* Current Card */}
            <AnimatePresence mode="wait">
                {!isComplete ? (
                    <FlashCardItem
                        key={FLASH_CARDS[currentIndex].id}
                        card={FLASH_CARDS[currentIndex]}
                        onRate={handleRate}
                        dark={dark}
                    />
                ) : (
                    <motion.div
                        key="complete"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8"
                    >
                        <span className="text-5xl mb-4 block">🎉</span>
                        <h3 className={`text-lg font-black mb-1 ${dark ? 'text-white' : 'text-foreground'}`}>All cards reviewed!</h3>
                        <p className={`text-sm ${dark ? 'text-white/50' : 'text-muted-foreground'}`}>
                            You earned <span className="text-primary font-bold">+{FLASH_CARDS.length * 15} combo</span> points.
                        </p>
                        <button
                            onClick={() => { setCurrentIndex(0); setCompleted(0); }}
                            className={`mt-4 px-5 py-2 rounded-full text-sm font-bold transition-colors ${dark ? 'bg-white/10 text-primary hover:bg-white/20 border border-white/10' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                        >
                            Play Again
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
