import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, MousePointerClick } from 'lucide-react';
import { ClayButton } from './ClayButton';

interface PersonaSplitHeroProps {
    onSelect: (mode: 'school' | 'pro') => void;
}

export const PersonaSplitHero = ({ onSelect }: PersonaSplitHeroProps) => {
    const [hoveredSide, setHoveredSide] = useState<'student' | 'pro' | null>(null);

    // Using the same Unsplash images as the Cinematic prototype
    // TODO: Phase 4.2 - Replace with local optimized video assets
    const studentBg = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2670&auto=format&fit=crop";
    // Professional Business Meeting - "People Discussing" (User Preferred)
    const proBg = "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop";

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col md:flex-row">

            {/* Navigation Cue - Animated Pointer */}
            {!hoveredSide && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none flex flex-col items-center animate-pulse">
                    <MousePointerClick className="text-white/80 w-8 h-8 mb-2" />
                    <span className="text-white/60 text-xs tracking-widest uppercase font-mono bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                        Select Your Path
                    </span>
                </div>
            )}

            {/* Student Section */}
            <div
                className="relative h-1/2 md:h-full flex-1 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden cursor-pointer"
                style={{ flex: hoveredSide === 'student' ? 1.5 : (hoveredSide === 'pro' ? 0.8 : 1) }}
                onMouseEnter={() => setHoveredSide('student')}
                onMouseLeave={() => setHoveredSide(null)}
                onClick={() => onSelect('school')}
            >
                <div
                    className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[2s]"
                    style={{ backgroundImage: `url(${studentBg})`, transform: hoveredSide === 'student' ? 'scale(1.0)' : 'scale(1.1)' }}
                />
                {/* Glass Overlay - Clears on hover */}
                <div className={`absolute inset-0 transition-all duration-700 ${hoveredSide === 'student' ? 'bg-black/30 backdrop-blur-none' : 'bg-black/60 backdrop-blur-xl'}`} />

                <div className="absolute bottom-12 md:bottom-20 left-8 md:left-24 z-20">
                    <h2 className="text-white text-4xl md:text-5xl font-light tracking-wide mb-2 italic serif">The Scholar</h2>
                    <p className="text-gray-200 text-sm md:text-lg font-light max-w-xs leading-relaxed border-l-2 border-blue-500 pl-4">
                        Master the art of <span className="text-blue-400 font-medium">exams</span>. Personalized mentorship for the ambitious.
                    </p>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: hoveredSide === 'student' ? 1 : 0, y: hoveredSide === 'student' ? 0 : 10 }}
                        className="mt-6 md:mt-8"
                    >
                        <ClayButton variant="primary" className="bg-blue-600/80 hover:bg-blue-600 border border-blue-400/30 backdrop-blur-md">Begin Journey</ClayButton>
                    </motion.div>
                </div>
            </div>

            {/* Pro Section */}
            <div
                className="relative h-1/2 md:h-full flex-1 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden cursor-pointer border-t md:border-t-0 md:border-l border-white/10"
                style={{ flex: hoveredSide === 'pro' ? 1.5 : (hoveredSide === 'student' ? 0.8 : 1) }}
                onMouseEnter={() => setHoveredSide('pro')}
                onMouseLeave={() => setHoveredSide(null)}
                onClick={() => onSelect('pro')}
            >
                <div
                    className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[2s]"
                    style={{ backgroundImage: `url(${proBg})`, transform: hoveredSide === 'pro' ? 'scale(1.0)' : 'scale(1.1)' }}
                />
                {/* Glass Overlay */}
                <div className={`absolute inset-0 transition-all duration-700 ${hoveredSide === 'pro' ? 'bg-black/30 backdrop-blur-none' : 'bg-black/60 backdrop-blur-xl'}`} />

                <div className="absolute bottom-12 md:bottom-20 right-8 md:right-24 z-20 text-right">
                    <h2 className="text-white text-4xl md:text-5xl font-light tracking-wide mb-2 italic serif">The Executive</h2>
                    <div className="flex flex-col items-end">
                        <p className="text-gray-200 text-sm md:text-lg font-light max-w-xs leading-relaxed border-r-2 border-amber-500 pr-4">
                            Refine your <span className="text-amber-400 font-medium">craft</span>. Leadership strategies for the modern era.
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: hoveredSide === 'pro' ? 1 : 0, y: hoveredSide === 'pro' ? 0 : 10 }}
                        className="mt-6 md:mt-8 flex justify-end"
                    >
                        <ClayButton variant="secondary" className="bg-amber-600/80 hover:bg-amber-600 border border-amber-400/30 backdrop-blur-md">Consult Expert</ClayButton>
                    </motion.div>
                </div>
            </div>

            {/* Center Brand - Fades out on hover */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40 transition-opacity duration-500 ${hoveredSide ? 'opacity-0' : 'opacity-100'}`}>
                <div className="w-20 h-20 md:w-24 md:h-24 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-md bg-white/5">
                    <Play fill="white" size={24} className="ml-1" />
                </div>
            </div>

        </div>
    );
};
