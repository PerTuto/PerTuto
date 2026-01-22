import { motion } from 'framer-motion';

import { SpotlightCard } from './SpotlightCard';

export const HeroVisual = () => {
    return (
        <div className="relative flex justify-center lg:justify-end perspective-[1000px] h-full items-center">
            {/* Background Card (Decorative) */}
            <motion.div
                initial={{ opacity: 0, rotate: 0, x: 0 }}
                animate={{ opacity: 0.4, rotate: 12, x: 40 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute w-80 h-96 bg-gradient-to-br from-[#2563EB] to-[#7C3AED] rounded-[40px] blur-sm"
            />

            {/* Main Card */}
            <motion.div
                initial={{ opacity: 0, y: 50, rotate: 0 }}
                animate={{ opacity: 1, y: 0, rotate: -6 }}
                transition={{ duration: 0.8, type: "spring" }}
                whileHover={{ rotate: 0, scale: 1.02 }}
                className="relative z-10 w-full max-w-md"
            >
                <SpotlightCard className="aspect-[4/5] flex flex-col justify-between !p-10 border-t border-white/20 bg-black/40 backdrop-blur-xl">
                    <div className="flex justify-between items-start">
                        <div className="w-16 h-16 rounded-2xl bg-[#000] border border-white/10 flex items-center justify-center text-3xl shadow-inner">
                            🧠
                        </div>
                        <div className="px-3 py-1 rounded-full bg-[#10B981]/20 border border-[#10B981]/50 text-[#10B981] font-mono text-xs font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                            +150 XP
                        </div>
                    </div>

                    <div>
                        <h3 className="text-4xl font-bold text-white mb-2">Physics II</h3>
                        <p className="text-gray-400 font-medium">"Literally saved my GPA. The visual learning tools are insane."</p>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                        <div className="flex -space-x-3">
                            <div className="w-10 h-10 rounded-full border-2 border-black bg-purple-500 ring-2 ring-black"></div>
                            <div className="w-10 h-10 rounded-full border-2 border-black bg-pink-500 ring-2 ring-black"></div>
                            <div className="w-10 h-10 rounded-full border-2 border-black bg-blue-500 ring-2 ring-black"></div>
                        </div>
                        <span className="text-sm font-bold text-white tracking-wide">+420 Online</span>
                    </div>
                </SpotlightCard>
            </motion.div>
        </div>
    );
};
