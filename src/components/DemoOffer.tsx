import { ClayButton } from './ClayButton';
import { SpotlightCard } from './SpotlightCard';

interface DemoOfferProps {
    className?: string;
    onClick?: () => void;
}

export const DemoOffer = ({ className = "", onClick }: DemoOfferProps) => {
    const scrollToContact = () => {
        if (onClick) {
            onClick();
            return;
        }
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <SpotlightCard className={`relative overflow-hidden border-[#7C3AED]/50 bg-gradient-to-br from-[#7C3AED]/10 to-transparent ${className}`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-[#7C3AED] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                            Limited Offer
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                        🎯 Try The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#DB2777]">Demo Package</span>
                    </h3>
                    <p className="text-gray-400 text-sm max-w-md">
                        Experience our premium teaching style. Includes a full diagnostic assessment + 1-hour private session.
                    </p>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                    <div className="text-right">
                        <span className="block text-xs text-gray-500 line-through">$350</span>
                        <span className="block text-3xl font-black text-white">$100</span>
                    </div>
                    <ClayButton variant="primary" onClick={scrollToContact} className="whitespace-nowrap shadow-[0_0_20px_rgba(124,58,237,0.3)]">
                        Claim Offer →
                    </ClayButton>
                </div>
            </div>

            {/* Decorative Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#7C3AED] opacity-20 blur-[80px] rounded-full pointer-events-none"></div>
        </SpotlightCard>
    );
};
