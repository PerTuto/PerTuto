import { Star, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { SpotlightCard } from './SpotlightCard';

export interface Review {
    id: string;
    name: string;
    role: string; // e.g., "IB Student (Math AA HL)"
    avatar?: string;
    rating: number;
    text: string;
    verified: boolean;
    date: string;
    platform?: 'google' | 'whatsapp' | 'email';
}

interface ReviewCardProps {
    review: Review;
    className?: string;
}

export const ReviewCard = ({ review, className }: ReviewCardProps) => {
    return (
        <SpotlightCard className={clsx("h-full flex flex-col justify-between", className)}>
            <div>
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {review.avatar ? (
                            <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#DB2777] flex items-center justify-center text-white font-bold">
                                {review.name.charAt(0)}
                            </div>
                        )}
                        <div>
                            <h4 className="font-bold text-white leading-tight flex items-center gap-1">
                                {review.name}
                                {review.verified && (
                                    <CheckCircle size={14} className="text-green-500 fill-green-500/20" />
                                )}
                            </h4>
                            <p className="text-xs text-gray-400">{review.role}</p>
                        </div>
                    </div>

                    {/* Platform Icon/Badge could go here */}
                    <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={14}
                                className={clsx(
                                    i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
                                )}
                            />
                        ))}
                    </div>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    "{review.text}"
                </p>
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">
                    {review.date}
                </span>
                {review.platform && (
                    <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider flex items-center gap-1">
                        Verified via {review.platform}
                    </span>
                )}
            </div>
        </SpotlightCard>
    );
};
