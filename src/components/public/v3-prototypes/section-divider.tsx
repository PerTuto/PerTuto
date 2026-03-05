'use client';

/**
 * SectionDivider — Smooth visual connectors between page sections.
 *
 * Two variants:
 * - "wave" → Subtle sine-wave SVG separator
 * - "gradient" → 80px gradient fade between two background colors
 */

interface SectionDividerProps {
    from: string;
    to: string;
    variant?: 'wave' | 'gradient';
    /** Flip the wave vertically */
    flip?: boolean;
    /** Taller divider for dark→light transitions */
    tall?: boolean;
}

export function SectionDivider({ from, to, variant = 'gradient', flip = false, tall = false }: SectionDividerProps) {
    if (variant === 'gradient') {
        return (
            <div
                aria-hidden
                className="w-full pointer-events-none"
                style={{
                    height: tall ? '140px' : '80px',
                    background: `linear-gradient(to bottom, ${from}, ${to})`,
                }}
            />
        );
    }

    // Wave variant
    return (
        <div
            aria-hidden
            className="w-full pointer-events-none relative"
            style={{
                height: '60px',
                backgroundColor: to,
                transform: flip ? 'scaleY(-1)' : undefined,
            }}
        >
            <svg
                className="absolute bottom-full w-full"
                viewBox="0 0 1440 60"
                preserveAspectRatio="none"
                style={{ display: 'block', height: '60px' }}
            >
                <path
                    d="M0,30 C240,55 480,5 720,30 C960,55 1200,5 1440,30 L1440,60 L0,60 Z"
                    fill={to}
                />
            </svg>
        </div>
    );
}
