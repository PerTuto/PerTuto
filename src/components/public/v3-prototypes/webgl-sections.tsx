'use client';

import dynamic from 'next/dynamic';

const MagnetizedFocusModes = dynamic(
    () => import('@/components/public/v3-prototypes/magnetized-focus-modes').then((m) => m.MagnetizedFocusModes),
    { ssr: false, loading: () => <div className="w-full h-[600px] bg-slate-950 flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div> }
);

const JourneyMap3D = dynamic(
    () => import('@/components/public/v3-prototypes/journey-map-3d').then((m) => m.JourneyMap3D),
    { ssr: false, loading: () => <div className="w-full h-[80vh] bg-[#0a0f1a] flex items-center justify-center"><div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" /></div> }
);

export function WebGLSections() {
    return (
        <>
            <MagnetizedFocusModes />
            <JourneyMap3D />
        </>
    );
}
