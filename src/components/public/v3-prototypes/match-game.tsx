'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamificationStore } from '@/lib/store/useGamificationStore';
import { useSoundEffect } from '@/hooks/use-sound-effect';

/* ------------------------------------------------------------------ */
/*  Match Pairs Data                                                   */
/* ------------------------------------------------------------------ */

interface MatchPair {
    id: string;
    term: string;
    match: string;
}

const MATCH_PAIRS: MatchPair[] = [
    { id: 'p1', term: 'F = ma', match: "Newton's Second Law" },
    { id: 'p2', term: 'E = mc²', match: 'Mass-Energy Equivalence' },
    { id: 'p3', term: '∫ x dx', match: 'x²/2 + C' },
    { id: 'p4', term: 'H₂O', match: 'Water' },
    { id: 'p5', term: 'DNA', match: 'Deoxyribonucleic Acid' },
    { id: 'p6', term: 'π', match: '3.14159…' },
];

interface CardData {
    uid: string;     // unique per card (not per pair)
    pairId: string;  // shared by the two cards of a pair
    label: string;
    side: 'term' | 'match';
}

function shuffleArray<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function buildDeck(): CardData[] {
    const deck: CardData[] = [];
    MATCH_PAIRS.forEach((pair) => {
        deck.push({ uid: `${pair.id}-t`, pairId: pair.id, label: pair.term, side: 'term' });
        deck.push({ uid: `${pair.id}-m`, pairId: pair.id, label: pair.match, side: 'match' });
    });
    return shuffleArray(deck);
}

/* ------------------------------------------------------------------ */
/*  Game Component                                                     */
/* ------------------------------------------------------------------ */

export function MatchGame({ dark = false }: { dark?: boolean }) {
    const addScore = useGamificationStore((s) => s.addScore);
    const { play } = useSoundEffect();
    const hasAwardedBonusRef = useRef(false);

    // Cards in state so they re-shuffle on reset
    const [cards, setCards] = useState<CardData[]>(() => buildDeck());
    const [flippedIds, setFlippedIds] = useState<string[]>([]);
    const [matchedPairIds, setMatchedPairIds] = useState<Set<string>>(new Set());
    const [moves, setMoves] = useState(0);
    const [isChecking, setIsChecking] = useState(false);

    const isComplete = matchedPairIds.size === MATCH_PAIRS.length;

    const handleCardClick = useCallback((card: CardData) => {
        if (isChecking) return;
        if (flippedIds.includes(card.uid)) return;
        if (matchedPairIds.has(card.pairId)) return;

        const newFlipped = [...flippedIds, card.uid];
        setFlippedIds(newFlipped);
        play('click');

        if (newFlipped.length === 2) {
            setMoves((m) => m + 1);
            setIsChecking(true);

            const first = cards.find((c) => c.uid === newFlipped[0])!;
            const second = cards.find((c) => c.uid === newFlipped[1])!;

            if (first.pairId === second.pairId && first.side !== second.side) {
                // Match!
                setTimeout(() => {
                    setMatchedPairIds((prev) => new Set([...prev, first.pairId]));
                    setFlippedIds([]);
                    setIsChecking(false);
                    play('success');
                    addScore(5);
                }, 500);
            } else {
                // No match — flip back
                setTimeout(() => {
                    setFlippedIds([]);
                    setIsChecking(false);
                }, 1000);
            }
        }
    }, [flippedIds, matchedPairIds, isChecking, cards, play, addScore]);

    // Completion bonus — guarded against double-fire
    useEffect(() => {
        if (isComplete && !hasAwardedBonusRef.current) {
            hasAwardedBonusRef.current = true;
            addScore(30);
            play('golden-unlock');
        }
    }, [isComplete, addScore, play]);

    const handleReset = () => {
        setCards(buildDeck());
        setFlippedIds([]);
        setMatchedPairIds(new Set());
        setMoves(0);
        hasAwardedBonusRef.current = false;
    };

    return (
        <div className="py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 max-w-md mx-auto">
                <span className={`text-xs font-bold uppercase tracking-wider ${dark ? 'text-white/40' : 'text-muted-foreground'}`}>
                    {matchedPairIds.size}/{MATCH_PAIRS.length} matched • {moves} moves
                </span>
                <span className="text-xs font-bold text-primary">
                    +{matchedPairIds.size * 5} combo
                </span>
            </div>

            {/* Card Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto">
                {cards.map((card) => {
                    const isFlipped = flippedIds.includes(card.uid);
                    const isMatched = matchedPairIds.has(card.pairId);

                    return (
                        <motion.button
                            key={card.uid}
                            onClick={() => handleCardClick(card)}
                            className={`
                                relative aspect-[3/4] rounded-xl font-bold text-xs sm:text-sm
                                transition-all duration-200 select-none overflow-hidden
                                ${isMatched
                                    ? dark ? 'bg-primary/10 border-2 border-primary/30 cursor-default' : 'bg-primary/10 border-2 border-primary/30 cursor-default'
                                    : isFlipped
                                        ? dark ? 'bg-white/[0.08] border-2 border-primary/40 shadow-lg' : 'bg-white border-2 border-primary/40 shadow-lg'
                                        : dark ? 'bg-white/[0.06] border-2 border-white/10 hover:border-primary/30 hover:bg-white/10 cursor-pointer shadow-sm' : 'bg-slate-100 border-2 border-slate-200 hover:border-primary/30 hover:bg-slate-50 cursor-pointer shadow-sm'
                                }
                            `}
                            whileHover={!isFlipped && !isMatched ? { scale: 1.05 } : {}}
                            whileTap={!isFlipped && !isMatched ? { scale: 0.95 } : {}}
                        >
                            <AnimatePresence mode="wait">
                                {isFlipped || isMatched ? (
                                    <motion.div
                                        key="front"
                                        initial={{ opacity: 0, rotateY: 90 }}
                                        animate={{ opacity: 1, rotateY: 0 }}
                                        exit={{ opacity: 0, rotateY: -90 }}
                                        transition={{ duration: 0.2 }}
                                        className={`absolute inset-0 flex items-center justify-center p-2 ${isMatched ? 'text-primary' : dark ? 'text-white' : 'text-foreground'}`}
                                    >
                                        <span className="leading-tight text-center">{card.label}</span>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="back"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className={`absolute inset-0 flex items-center justify-center ${dark ? 'text-white/20' : 'text-slate-300'}`}
                                    >
                                        <span className="text-2xl">?</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    );
                })}
            </div>

            {/* Completion */}
            <AnimatePresence>
                {isComplete && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mt-8"
                    >
                        <span className="text-4xl block mb-2">🏆</span>
                        <h3 className={`text-lg font-black mb-1 ${dark ? 'text-white' : 'text-foreground'}`}>
                            All pairs matched in {moves} moves!
                        </h3>
                        <p className={`text-sm mb-4 ${dark ? 'text-white/50' : 'text-muted-foreground'}`}>
                            Bonus <span className="text-primary font-bold">+30 combo</span> for completing the game.
                        </p>
                        <button
                            onClick={handleReset}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${dark ? 'bg-white/10 text-primary hover:bg-white/20 border border-white/10' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                        >
                            Play Again
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
