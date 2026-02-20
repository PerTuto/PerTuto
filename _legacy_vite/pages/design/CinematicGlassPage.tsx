import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { ClayButton } from '../../components/ClayButton';

export const CinematicGlassPage = () => {
    const [hovered, setHovered] = useState<'student' | 'pro' | null>(null);

    // Placeholder images (Unsplash) - Ideally these would be looping high-res videos
    const studentBg = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2670&auto=format&fit=crop";
    const proBg = "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop";

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden flex">

            {/* Student Section */}
            <div
                className="relative h-full flex-1 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden cursor-pointer"
                style={{ flex: hovered === 'student' ? 1.5 : (hovered === 'pro' ? 0.8 : 1) }}
                onMouseEnter={() => setHovered('student')}
                onMouseLeave={() => setHovered(null)}
            >
                <div
                    className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[2s]"
                    style={{ backgroundImage: `url(${studentBg})`, transform: hovered === 'student' ? 'scale(1.0)' : 'scale(1.1)' }}
                />
                {/* Glass Overlay - Clears on hover */}
                <div className={`absolute inset-0 transition-all duration-700 ${hovered === 'student' ? 'bg-black/30 backdrop-blur-none' : 'bg-black/60 backdrop-blur-xl'}`} />

                <div className="absolute bottom-20 left-12 md:left-24 z-20">
                    <h2 className="text-white text-5xl font-light tracking-wide mb-2 italic serif">The Scholar</h2>
                    <p className="text-gray-200 text-lg font-light max-w-xs leading-relaxed border-l-2 border-blue-500 pl-4">
                        Master the art of <span className="text-blue-400 font-medium">exams</span>. Personalized mentorship for the ambitious.
                    </p>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: hovered === 'student' ? 1 : 0, y: hovered === 'student' ? 0 : 10 }}
                        className="mt-8"
                    >
                        <ClayButton variant="primary">Begin Journey</ClayButton>
                    </motion.div>
                </div>
            </div>

            {/* Pro Section */}
            <div
                className="relative h-full flex-1 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden cursor-pointer border-l border-white/10"
                style={{ flex: hovered === 'pro' ? 1.5 : (hovered === 'student' ? 0.8 : 1) }}
                onMouseEnter={() => setHovered('pro')}
                onMouseLeave={() => setHovered(null)}
            >
                <div
                    className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[2s]"
                    style={{ backgroundImage: `url(${proBg})`, transform: hovered === 'pro' ? 'scale(1.0)' : 'scale(1.1)' }}
                />
                {/* Glass Overlay */}
                <div className={`absolute inset-0 transition-all duration-700 ${hovered === 'pro' ? 'bg-black/30 backdrop-blur-none' : 'bg-black/60 backdrop-blur-xl'}`} />

                <div className="absolute bottom-20 right-12 md:right-24 z-20 text-right">
                    <h2 className="text-white text-5xl font-light tracking-wide mb-2 italic serif">The Executive</h2>
                    <div className="flex flex-col items-end">
                        <p className="text-gray-200 text-lg font-light max-w-xs leading-relaxed border-r-2 border-amber-500 pr-4">
                            Refine your <span className="text-amber-400 font-medium">craft</span>. Leadership strategies for the modern era.
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: hovered === 'pro' ? 1 : 0, y: hovered === 'pro' ? 0 : 10 }}
                        className="mt-8 flex justify-end"
                    >
                        <ClayButton variant="secondary">Consult Expert</ClayButton>
                    </motion.div>
                </div>
            </div>

            {/* Center Brand - Fades out on hover */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 transition-opacity duration-500 ${hovered ? 'opacity-0' : 'opacity-100'}`}>
                <div className="w-24 h-24 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-md bg-white/5">
                    <Play fill="white" size={24} className="ml-1" />
                </div>
            </div>

        </div>
    );
};
