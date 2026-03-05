'use client';

import { useCallback, useRef } from 'react';

/**
 * useSoundEffect — Lightweight sound effect hook using Web Audio API.
 * No external dependency needed beyond `use-sound` which is installed.
 * 
 * Since we don't have actual .mp3 files yet, this uses Web Audio API
 * to synthesize satisfying UI sounds programmatically.
 */

type SoundName = 'click' | 'success' | 'combo-up' | 'golden-unlock' | 'checkpoint';

const SOUND_CONFIG: Record<SoundName, { frequency: number; type: OscillatorType; duration: number; ramp?: number }> = {
    'click':          { frequency: 800,  type: 'sine',     duration: 0.08 },
    'success':        { frequency: 523,  type: 'sine',     duration: 0.25, ramp: 784 },
    'combo-up':       { frequency: 660,  type: 'triangle', duration: 0.15, ramp: 880 },
    'golden-unlock':  { frequency: 440,  type: 'sine',     duration: 0.5,  ramp: 1320 },
    'checkpoint':     { frequency: 587,  type: 'sine',     duration: 0.2,  ramp: 784 },
};

export function useSoundEffect() {
    const audioCtxRef = useRef<AudioContext | null>(null);

    const play = useCallback((name: SoundName) => {
        try {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            const ctx = audioCtxRef.current;
            const config = SOUND_CONFIG[name];
            if (!config) return;

            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.type = config.type;
            oscillator.frequency.setValueAtTime(config.frequency, ctx.currentTime);

            if (config.ramp) {
                oscillator.frequency.linearRampToValueAtTime(config.ramp, ctx.currentTime + config.duration);
            }

            gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + config.duration);

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + config.duration);
        } catch {
            // Silently fail if audio isn't available
        }
    }, []);

    return { play };
}
