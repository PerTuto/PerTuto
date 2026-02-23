'use client';

import React from 'react';

interface PerTutoLogoProps {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'full' | 'icon-only';
    className?: string;
}

const SIZES = {
    sm: { icon: 32, text: 'text-lg' },
    md: { icon: 40, text: 'text-xl' },
    lg: { icon: 48, text: 'text-2xl' },
};

/**
 * PerTuto brand logo — traced from the official logo PNG.
 * The icon is a stylized upward chevron/mountain with a leaf accent.
 */
export function PerTutoLogo({ size = 'sm', variant = 'full', className = '' }: PerTutoLogoProps) {
    const { icon, text } = SIZES[size];

    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            {/* Icon Mark */}
            <svg
                width={icon}
                height={icon}
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                {/* Main upward chevron / mountain shape */}
                <path
                    d="M32 8L12 44h8l12-24 12 24h8L32 8z"
                    fill="#1B7A6D"
                />
                {/* Leaf accent on the left side */}
                <path
                    d="M20 28c-4 8-2 16 4 20-2-6 0-14 8-20"
                    stroke="#1B7A6D"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
                {/* Bottom chevron notch */}
                <path
                    d="M26 44l6-12 6 12"
                    stroke="#1B7A6D"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            </svg>

            {/* Wordmark */}
            {variant === 'full' && (
                <span
                    className={`${text} font-bold tracking-tight`}
                    style={{ color: '#1A2744', fontFamily: "'DM Sans', 'Inter', sans-serif" }}
                >
                    PerTuto
                </span>
            )}
        </div>
    );
}
