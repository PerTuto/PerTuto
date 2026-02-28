"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useInView } from "framer-motion";

// ============ Particle Burst System ============

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    color: string;
}

function createBurst(cx: number, cy: number, color: string, count = 20): Particle[] {
    return Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 3;
        return {
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.5, // slight upward bias
            life: 1,
            maxLife: 0.8 + Math.random() * 0.6,
            size: 2 + Math.random() * 3,
            color,
        };
    });
}

function useParticleBurst() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animRef = useRef<number>(0);
    const runningRef = useRef(false);

    const tick = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, rect.width, rect.height);

        const dt = 0.016; // ~60fps
        particlesRef.current = particlesRef.current.filter((p) => {
            p.life -= dt / p.maxLife;
            if (p.life <= 0) return false;
            p.vy += 2.5 * dt; // gravity
            p.x += p.vx;
            p.y += p.vy;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            ctx.fillStyle = p.color.replace('1)', `${p.life})`);
            ctx.fill();
            return true;
        });

        if (particlesRef.current.length > 0) {
            animRef.current = requestAnimationFrame(tick);
        } else {
            runningRef.current = false;
        }
    }, []);

    const burst = useCallback((cx: number, cy: number, color: string) => {
        particlesRef.current.push(...createBurst(cx, cy, color));
        if (!runningRef.current) {
            runningRef.current = true;
            animRef.current = requestAnimationFrame(tick);
        }
    }, [tick]);

    useEffect(() => {
        return () => cancelAnimationFrame(animRef.current);
    }, []);

    return { canvasRef, burst };
}

// ============ AnimatedStat ============

interface StatProps {
    value: number;
    label: string;
    suffix?: string;
    duration?: number;
    onComplete?: (rect: DOMRect) => void;
}

const AnimatedStat = ({ value, label, suffix = "", duration = 2, onComplete }: StatProps) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const completedRef = useRef(false);

    useEffect(() => {
        if (!isInView) return;

        let startTime: number | null = null;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / (duration * 1000), 1);
            
            // Easing function: easeOutQuart
            const easeOut = 1 - Math.pow(1 - percentage, 4);
            const currentCount = Math.floor(easeOut * value);
            
            setCount(currentCount);

            if (percentage < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else if (!completedRef.current) {
                completedRef.current = true;
                if (onComplete && ref.current) {
                    onComplete(ref.current.getBoundingClientRect());
                }
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
        };
    }, [isInView, value, duration, onComplete]);

    return (
        <div ref={ref} className="flex flex-col items-center justify-center p-5 text-center rounded-2xl bg-white/60 backdrop-blur-sm">
            <div className="text-4xl md:text-5xl font-black font-headline text-primary mb-2 tracking-tighter flex items-center">
                {count}
                <span className="text-foreground ml-1">{suffix}</span>
            </div>
            <div className="text-sm md:text-base font-semibold text-muted-foreground uppercase tracking-widest">
                {label}
            </div>
        </div>
    );
};

// ============ AnimatedStatsBar ============

export const AnimatedStatsBar = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { canvasRef, burst } = useParticleBurst();

    const handleComplete = useCallback((rect: DOMRect) => {
        const container = containerRef.current;
        if (!container) return;
        const cRect = container.getBoundingClientRect();
        // Fire burst at center of the stat card, relative to container
        const cx = rect.left - cRect.left + rect.width / 2;
        const cy = rect.top - cRect.top + rect.height / 2;
        burst(cx, cy, 'rgba(27, 122, 109, 1)');
    }, [burst]);

    return (
        <div ref={containerRef} className="w-full bg-background border-y border-border py-12 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <div className="w-[80vw] h-[50vh] bg-primary/20 blur-[120px] rounded-full"></div>
            </div>
            
            {/* Particle burst canvas overlay */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none z-20"
            />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    <AnimatedStat value={500} suffix="+" label="Students Tutored" onComplete={handleComplete} />
                    <AnimatedStat value={4} suffix=".9★" label="Average Rating" onComplete={handleComplete} />
                    <AnimatedStat value={12} suffix="+" label="Countries" onComplete={handleComplete} />
                    <AnimatedStat value={95} suffix="%" label="Score Improvement" onComplete={handleComplete} />
                </div>
            </div>
        </div>
    );
};
