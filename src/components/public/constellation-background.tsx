'use client';

import React, { useRef, useEffect, useCallback } from 'react';

/**
 * ConstellationBackground — Interactive Canvas 2D constellation
 * V2 Overhaul: Immersive "Gamified" aesthetic.
 * Particles drift gently, react to mouse movement (springy repulsion).
 * Added depth, floating abstract shapes (plus, circle, triangle),
 * and vibrant gradient coloring for a Brilliant/Duolingo feel.
 */

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  z: number;
  r: number;
  driftPhaseX: number;
  driftPhaseY: number;
  driftSpeedX: number;
  driftSpeedY: number;
  driftAmplitudeX: number;
  driftAmplitudeY: number;
  type: 'dot' | 'plus' | 'triangle' | 'ring';
  color: string;
}

const PARTICLE_COUNT = 75; // Increased density
const LINE_MAX_DIST = 160;
const MOUSE_RADIUS = 280;
const MOUSE_PUSH = 70;
const BASE_COLOR_LIGHT = '#f8f9fc';
const BASE_COLOR_DARK = '#0c0f1a';
const LINE_COLOR_LIGHT = '100, 116, 139';
const LINE_COLOR_DARK = '148, 163, 184';

// Playful, gamified color palette
const PALETTE = [
  '27, 122, 109',  // Brand Teal
  '245, 158, 11',  // Amber
  '79, 70, 229',   // Indigo
  '236, 72, 153',  // Pink
  '16, 185, 129',  // Emerald
];

interface ConstellationProps {
  variant?: 'light' | 'dark';
}

export function ConstellationBackground({ variant = 'light' }: ConstellationProps) {
  const isDark = variant === 'dark';
  const isDarkRef = useRef(isDark);
  isDarkRef.current = isDark;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const sizeRef = useRef({ w: 0, h: 0 });
  const isTouchRef = useRef(false);
  const initedRef = useRef(false);

  const initParticles = useCallback((w: number, h: number) => {
    const particles: Particle[] = [];
    const types: ('dot' | 'plus' | 'triangle' | 'ring')[] = ['dot', 'dot', 'dot', 'plus', 'triangle', 'ring'];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const z = 0.3 + Math.random() * 0.7; // depth
      const bx = Math.random() * w;
      const by = Math.random() * h;
      
      particles.push({
        x: bx,
        y: by,
        baseX: bx,
        baseY: by,
        z,
        r: 2 + z * 4,  // 2–6px radius based on depth (larger now)
        driftPhaseX: Math.random() * Math.PI * 2,
        driftPhaseY: Math.random() * Math.PI * 2,
        driftSpeedX: 0.15 + Math.random() * 0.3,
        driftSpeedY: 0.1 + Math.random() * 0.25,
        driftAmplitudeX: 20 + Math.random() * 40,
        driftAmplitudeY: 15 + Math.random() * 30,
        type: types[Math.floor(Math.random() * types.length)],
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)]
      });
    }
    particlesRef.current = particles;
  }, []);

  const drawShape = useCallback((ctx: CanvasRenderingContext2D, p: Particle, x: number, y: number, alpha: number, glow: number) => {
    ctx.beginPath();
    ctx.strokeStyle = `rgba(${p.color}, ${alpha + glow})`;
    ctx.fillStyle = `rgba(${p.color}, ${alpha + glow})`;
    ctx.lineWidth = 1.5 + p.z;

    // Add soft glow
    if (p.z > 0.7 || glow > 0.1) {
        ctx.shadowColor = `rgba(${p.color}, 0.5)`;
        ctx.shadowBlur = 10 * p.z;
    } else {
        ctx.shadowBlur = 0;
    }

    const size = p.r * 1.5;

    switch (p.type) {
      case 'plus':
        ctx.moveTo(x - size, y);
        ctx.lineTo(x + size, y);
        ctx.moveTo(x, y - size);
        ctx.lineTo(x, y + size);
        ctx.stroke();
        break;
      case 'triangle':
        ctx.moveTo(x, y - size);
        ctx.lineTo(x + size * 0.866, y + size * 0.5);
        ctx.lineTo(x - size * 0.866, y + size * 0.5);
        ctx.closePath();
        ctx.stroke();
        break;
      case 'ring':
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case 'dot':
      default:
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fill();
        break;
    }

    ctx.shadowBlur = 0; // Reset
  }, []);

  const draw = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { w, h } = sizeRef.current;
    if (w === 0 || h === 0) {
      animRef.current = requestAnimationFrame(draw);
      return;
    }

    const t = time * 0.001;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    // Clear background
    ctx.fillStyle = isDarkRef.current ? BASE_COLOR_DARK : BASE_COLOR_LIGHT;
    ctx.fillRect(0, 0, w, h);

    const particles = particlesRef.current;

    // Update particle positions
    particles.forEach((p) => {
      // Ambient drift
      const targetX = p.baseX + Math.sin(t * p.driftSpeedX + p.driftPhaseX) * p.driftAmplitudeX;
      const targetY = p.baseY + Math.cos(t * p.driftSpeedY + p.driftPhaseY) * p.driftAmplitudeY;

      // Mouse repulsion (Spring-like)
      let pushX = 0;
      let pushY = 0;
      if (!isTouchRef.current && mx > -9000) {
        const dx = targetX - mx;
        const dy = targetY - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = Math.pow(1 - dist / MOUSE_RADIUS, 2) * MOUSE_PUSH * (1 + p.z); // Snappier push
          pushX = (dx / dist) * force;
          pushY = (dy / dist) * force;
        }
      }

      // Smooth interpolation
      p.x += (targetX + pushX - p.x) * 0.12; // Faster snap back
      p.y += (targetY + pushY - p.y) * 0.12;
    });

    // Draw lines
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < LINE_MAX_DIST) {
          const avgZ = (a.z + b.z) * 0.5;
          const lineAlpha = (1 - dist / LINE_MAX_DIST) * 0.12 * avgZ;

          let boost = 1;
          if (!isTouchRef.current && mx > -9000) {
            const midX = (a.x + b.x) * 0.5;
            const midY = (a.y + b.y) * 0.5;
            const mDist = Math.sqrt((midX - mx) ** 2 + (midY - my) ** 2);
            if (mDist < MOUSE_RADIUS) {
              boost = 1 + Math.pow(1 - mDist / MOUSE_RADIUS, 2) * 2;
            }
          }

          // Use a neutral grey-blue for connections, tinting gently towards brand teal
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          const lineRgb = isDarkRef.current ? LINE_COLOR_DARK : LINE_COLOR_LIGHT;
          ctx.strokeStyle = `rgba(${lineRgb}, ${lineAlpha * boost * (isDarkRef.current ? 2 : 1)})`;
          ctx.lineWidth = 0.5 + avgZ * 0.6;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach((p) => {
      const alpha = isDarkRef.current ? (0.35 + p.z * 0.5) : (0.2 + p.z * 0.4);

      let glowBoost = 0;
      if (!isTouchRef.current && mx > -9000) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const mDist = Math.sqrt(dx * dx + dy * dy);
        if (mDist < MOUSE_RADIUS) {
          glowBoost = Math.pow(1 - mDist / MOUSE_RADIUS, 2) * 0.6;
        }
      }

      drawShape(ctx, p, p.x, p.y, alpha, glowBoost);
    });

    animRef.current = requestAnimationFrame(draw);
  }, [drawShape]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    isTouchRef.current = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

    const dpr = window.devicePixelRatio || 1;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width: w, height: h } = entry.contentRect;
      sizeRef.current = { w, h };
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!initedRef.current) {
        initParticles(w, h);
        initedRef.current = true;
      }
    });
    ro.observe(container);

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [draw, initParticles]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden z-0"
      aria-hidden
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
