'use client';

import { useEffect, useRef } from 'react';
import { useGamificationStore } from '@/lib/store/useGamificationStore';
import { useSoundEffect } from '@/hooks/use-sound-effect';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, RotateCcw } from 'lucide-react';

export function ComboMeterHUD() {
    const { comboScore, maxScore, hasUnlockedGoldenState, resetScore } = useGamificationStore();
    const progressPercentage = (comboScore / maxScore) * 100;
    const { play } = useSoundEffect();
    const prevScoreRef = useRef(0);
    const hasPlayedGoldenRef = useRef(false);

    // Play sound on score change
    useEffect(() => {
        if (comboScore > prevScoreRef.current) {
            play('combo-up');
        }
        prevScoreRef.current = comboScore;
    }, [comboScore, play]);

    // Play golden unlock sound once
    useEffect(() => {
        if (hasUnlockedGoldenState && !hasPlayedGoldenRef.current) {
            hasPlayedGoldenRef.current = true;
            play('golden-unlock');
        }
    }, [hasUnlockedGoldenState, play]);

    if (comboScore === 0) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
            >
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-white/20 shadow-lg dark:shadow-2xl rounded-2xl p-4 w-64 flex flex-col gap-3 relative overflow-hidden group">
                    
                    {/* Golden Glow Background when maxed */}
                    {hasUnlockedGoldenState && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 z-0"
                        />
                    )}

                    <div className="flex justify-between items-center relative z-10">
                        <div className="flex items-center gap-2">
                            {hasUnlockedGoldenState ? (
                                <Sparkles className="w-5 h-5 text-yellow-500" />
                            ) : (
                                <Zap className="w-5 h-5 text-blue-500" />
                            )}
                            <span className="font-headline font-bold text-sm text-foreground">
                                {hasUnlockedGoldenState ? "MAX COMBO!" : "Interaction Combo"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs font-mono font-bold text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                                {comboScore}/{maxScore}
                            </span>
                            <button
                                onClick={() => {
                                    play('click');
                                    resetScore();
                                    hasPlayedGoldenRef.current = false;
                                }}
                                className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground transition-colors"
                                title="Reset Playground"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative z-10">
                        <motion.div 
                            className={`h-full rounded-full ${hasUnlockedGoldenState ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ type: "spring", stiffness: 100, damping: 15 }}
                        />
                    </div>

                    {/* Golden State Badge */}
                    {hasUnlockedGoldenState && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-xs font-bold text-amber-600 dark:text-amber-400 text-center relative z-10"
                        >
                            ✨ You&apos;ve explored everything!
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
