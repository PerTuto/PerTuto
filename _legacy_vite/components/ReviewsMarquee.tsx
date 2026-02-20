import { ReviewCard } from './ReviewCard';
import type { Review } from './ReviewCard';
import Marquee from 'react-fast-marquee';

interface ReviewsMarqueeProps {
    reviews: Review[];
    speed?: number;
    direction?: 'left' | 'right';
}

export const ReviewsMarquee = ({ reviews, speed = 40, direction = 'left' }: ReviewsMarqueeProps) => {
    return (
        <div className="w-full overflow-hidden py-12 relative">
            {/* Fade Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

            <Marquee gradient={false} speed={speed} direction={direction} pauseOnHover>
                <div className="flex gap-6 pr-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="w-[350px]">
                            <ReviewCard review={review} />
                        </div>
                    ))}
                </div>
            </Marquee>
        </div>
    );
};
