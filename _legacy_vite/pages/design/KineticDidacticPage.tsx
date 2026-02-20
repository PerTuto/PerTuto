import { motion } from 'framer-motion';
import { useState } from 'react';
import { GraduationCap, Briefcase } from 'lucide-react';

export const KineticDidacticPage = () => {
    const [hover, setHover] = useState<'left' | 'right' | null>(null);

    // Smooth width transitions
    const leftFlex = hover === 'left' ? 2 : (hover === 'right' ? 0.5 : 1);
    const rightFlex = hover === 'right' ? 2 : (hover === 'left' ? 0.5 : 1);

    return (
        <div className="h-screen w-full flex bg-black overflow-hidden font-sans">
            {/* Left: Student */}
            <motion.div
                className="relative h-full flex flex-col justify-center px-12 md:px-24 bg-[#0a0a0a] border-r border-white/10 cursor-pointer group"
                initial={{ flex: 1 }}
                animate={{ flex: leftFlex }}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
                onMouseEnter={() => setHover('left')}
                onMouseLeave={() => setHover(null)}
            >
                {/* Abstract Line Art Background */}
                <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <motion.path
                            d="M0 100 Q 50 50 100 0"
                            stroke="#3B82F6"
                            strokeWidth="0.5"
                            fill="none"
                            animate={{ d: hover === 'left' ? "M0 100 Q 50 20 100 0" : "M0 100 Q 50 50 100 0" }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                        />
                        <motion.path
                            d="M0 80 Q 50 30 100 20"
                            stroke="#8B5CF6"
                            strokeWidth="0.5"
                            fill="none"
                            animate={{ d: hover === 'left' ? "M0 80 Q 50 10 100 20" : "M0 80 Q 50 30 100 20" }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                        />
                    </svg>
                </div>

                <div className="relative z-10 mix-blend-difference text-white">
                    <motion.div
                        initial={{ opacity: 0.5, y: 20 }}
                        animate={{ opacity: hover === 'left' ? 1 : 0.5, y: hover === 'left' ? 0 : 20 }}
                        className="flex items-center gap-4 mb-4"
                    >
                        <div className="p-2 rounded-full border border-blue-500/50">
                            <GraduationCap className="text-blue-400" />
                        </div>
                        <span className="text-blue-400 tracking-[0.2em] text-sm uppercase font-mono">Student</span>
                    </motion.div>

                    <motion.h1
                        className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.8]"
                        layout
                    >
                        ACE<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">EXAMS</span>
                    </motion.h1>

                    <motion.p
                        className="mt-8 text-xl text-gray-400 max-w-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hover === 'left' ? 1 : 0 }}
                    >
                        IGCSE. IB. A-Level.<br />
                        Dominance is a choice.
                    </motion.p>
                </div>
            </motion.div>

            {/* Right: Pro */}
            <motion.div
                className="relative h-full flex flex-col justify-center items-end px-12 md:px-24 bg-[#050505] cursor-pointer group text-right"
                initial={{ flex: 1 }}
                animate={{ flex: rightFlex }}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
                onMouseEnter={() => setHover('right')}
                onMouseLeave={() => setHover(null)}
            >
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-amber-500/30 to-transparent blur-[100px]" />
                </div>

                <div className="relative z-10 text-white">
                    <motion.div
                        initial={{ opacity: 0.5, y: 20 }}
                        animate={{ opacity: hover === 'right' ? 1 : 0.5, y: hover === 'right' ? 0 : 20 }}
                        className="flex items-center justify-end gap-4 mb-4"
                    >
                        <span className="text-amber-400 tracking-[0.2em] text-sm uppercase font-mono">Pro</span>
                        <div className="p-2 rounded-full border border-amber-500/50">
                            <Briefcase className="text-amber-400" />
                        </div>
                    </motion.div>

                    <motion.h1
                        className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.8]"
                        layout
                    >
                        CAREER<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-l from-amber-500 to-orange-600">SHIFT</span>
                    </motion.h1>

                    <motion.p
                        className="mt-8 text-xl text-gray-400 max-w-md ml-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hover === 'right' ? 1 : 0 }}
                    >
                        MBA. Leadership. Tech.<br />
                        Accelerate with industry giants.
                    </motion.p>
                </div>
            </motion.div>
        </div>
    );
};
