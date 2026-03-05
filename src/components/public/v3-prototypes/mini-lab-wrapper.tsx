'use client';

import dynamic from 'next/dynamic';

/**
 * MiniLabWrapper — Client component wrapper for MiniLabSandbox.
 * Uses dynamic import with ssr:false to fix dnd-kit hydration mismatch
 * (aria-describedby IDs differ between server and client renders).
 */
const MiniLabSandbox = dynamic(
    () => import('@/components/public/v3-prototypes/mini-lab-sandbox').then(mod => mod.MiniLabSandbox),
    { ssr: false, loading: () => <div className="py-24 text-center text-muted-foreground">Loading Mini-Lab…</div> }
);

export function MiniLabWrapper({ dark = false }: { dark?: boolean }) {
    return <MiniLabSandbox dark={dark} />;
}
