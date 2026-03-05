'use client';

import { motion } from 'framer-motion';
import { useGamificationStore } from '@/lib/store/useGamificationStore';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * GoldenCTA — A premium CTA button that transforms with a shimmer
 * gradient when the user has unlocked the Golden State (combo = max).
 * 
 * Default: Standard primary button.
 * Golden: Apple "slide to unlock" style shimmer + subtle badge.
 */
export function GoldenCTA({ href = '#book-demo', label = 'Book Free Demo' }: { href?: string; label?: string }) {
    const hasUnlockedGoldenState = useGamificationStore((s) => s.hasUnlockedGoldenState);

    if (hasUnlockedGoldenState) {
        return (
            <div className="flex flex-col items-center gap-2">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-xs font-bold text-amber-500 flex items-center gap-1"
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    You&apos;ve explored everything
                </motion.div>
                <a href={href}>
                    <motion.button
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="relative overflow-hidden px-10 py-4 rounded-full font-bold text-base uppercase tracking-wider text-white shadow-xl group"
                        style={{
                            background: 'linear-gradient(135deg, #f59e0b, #f97316, #ef4444, #f59e0b)',
                            backgroundSize: '300% 300%',
                        }}
                    >
                        {/* Shimmer sweep */}
                        <motion.div
                            className="absolute inset-0 opacity-40"
                            style={{
                                background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.6) 45%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.6) 55%, transparent 80%)',
                                backgroundSize: '200% 100%',
                            }}
                            animate={{ backgroundPosition: ['200% 0%', '-200% 0%'] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                        />
                        <span className="relative z-10 flex items-center gap-3">
                            {label}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                        </span>
                    </motion.button>
                </a>
            </div>
        );
    }

    return (
        <a href={href}>
            <button className="bg-transparent text-foreground px-8 py-4 rounded-full font-bold text-base uppercase tracking-wider flex items-center gap-3 border-2 border-foreground/30 hover:border-foreground hover:bg-foreground hover:text-background transition-all duration-300">
                {label}
            </button>
        </a>
    );
}
