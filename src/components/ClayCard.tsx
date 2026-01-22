import { type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface ClayCardProps {
    children: ReactNode;
    className?: string;
}

export function ClayCard({ children, className }: ClayCardProps) {
    return (
        <div
            className={twMerge(
                "glass-panel relative overflow-hidden transition-all duration-300 group rounded-[32px] p-8",
                className
            )}
        >
            {/* Gradient Border Glow on Hover */}
            <div className="absolute inset-0 rounded-[32px] p-[1px] bg-gradient-to-br from-white/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />

            {/* Inner Sheen */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 h-full">
                {children}
            </div>
        </div>
    );
}
