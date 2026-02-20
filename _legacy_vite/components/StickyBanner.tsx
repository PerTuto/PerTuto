import { useState } from 'react';
import { ClayButton } from './ClayButton';

export const StickyBanner = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="w-full bg-gradient-to-r from-[#ffe4e6] via-[#fce7f3] to-[#e0e7ff] text-gray-900 py-3 shadow-lg border-b border-white/20 animate-in slide-in-from-top duration-500 relative z-50">
            <div className="container mx-auto max-w-7xl px-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                    <span className="hidden md:inline-flex bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                        Limited Time
                    </span>
                    <p className="text-sm md:text-base font-medium">
                        <span className="font-bold">🎯 Exam Crash Course:</span> Get a full 60-min diagnostic session + study plan for just <span className="font-bold text-red-600">AED 100</span>.
                    </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <ClayButton
                        variant="primary"
                        className="!py-1.5 !px-4 !text-sm !h-auto bg-gray-900 text-white hover:bg-gray-800 border-none shadow-md"
                        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        Claim Offer →
                    </ClayButton>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-gray-500 hover:text-gray-900 transition-colors"
                        aria-label="Close banner"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
};
