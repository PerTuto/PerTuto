'use client';

/**
 * FluidBlob — CSS-only animated gradient blobs for hero backgrounds.
 * Renders 3 overlapping softly-morphing shapes behind content.
 * Zero JavaScript runtime cost — pure CSS animations.
 */
export function FluidBlob() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {/* Teal blob — large, slow float */}
            <div
                className="absolute -top-20 -left-20 w-[500px] h-[500px] animate-blob opacity-[0.12]"
                style={{
                    background: 'radial-gradient(circle, #1B7A6D 0%, transparent 70%)',
                    animationDelay: '0s',
                    animationDuration: '8s',
                }}
            />
            {/* Mint blob — medium, offset float */}
            <div
                className="absolute top-10 right-0 w-[400px] h-[400px] animate-blob opacity-[0.15]"
                style={{
                    background: 'radial-gradient(circle, #78C6B8 0%, transparent 70%)',
                    animationDelay: '2s',
                    animationDuration: '10s',
                }}
            />
            {/* Gold blob — subtle, very slow */}
            <div
                className="absolute -bottom-10 left-1/3 w-[350px] h-[350px] animate-blob opacity-[0.06]"
                style={{
                    background: 'radial-gradient(circle, #D4A853 0%, transparent 70%)',
                    animationDelay: '4s',
                    animationDuration: '12s',
                }}
            />
        </div>
    );
}
