'use client';

import React, { useRef, useEffect, useCallback } from 'react';

/**
 * ConstellationBackground — Interactive Canvas 2D constellation
 * on a light base. Particles drift gently and react to mouse
 * movement with a soft repulsion effect. Lines connect nearby
 * particles to form a constellation / neural-network look.
 *
 * Zero external dependencies. Replaces Vanta NET.
 */

interface Particle {
  x: number;
  y: number;
  baseX: number;     // home position (drift orbits this)
  baseY: number;
  z: number;         // depth 0.4–1.0 (closer = larger & more opaque)
  r: number;         // visual radius
  driftPhaseX: number;
  driftPhaseY: number;
  driftSpeedX: number;
  driftSpeedY: number;
  driftAmplitudeX: number;
  driftAmplitudeY: number;
}

const PARTICLE_COUNT = 60;
const LINE_MAX_DIST = 130;
const MOUSE_RADIUS = 160;
const MOUSE_PUSH = 40;
const BASE_COLOR = '#f4f3f8';    // lavender hero
const DOT_COLOR = [27, 122, 109]; // brand teal RGB
const LINE_COLOR = [27, 122, 109];

export function ConstellationBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const sizeRef = useRef({ w: 0, h: 0 });
  const isTouchRef = useRef(false);
  const initedRef = useRef(false);

  // Initialize particles spread across the canvas
  const initParticles = useCallback((w: number, h: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const z = 0.4 + Math.random() * 0.6; // depth
      const bx = Math.random() * w;
      const by = Math.random() * h;
      particles.push({
        x: bx,
        y: by,
        baseX: bx,
        baseY: by,
        z,
        r: 1.5 + z * 2.5,  // 1.5–4px radius based on depth
        driftPhaseX: Math.random() * Math.PI * 2,
        driftPhaseY: Math.random() * Math.PI * 2,
        driftSpeedX: 0.2 + Math.random() * 0.4,
        driftSpeedY: 0.15 + Math.random() * 0.35,
        driftAmplitudeX: 15 + Math.random() * 25,
        driftAmplitudeY: 10 + Math.random() * 20,
      });
    }
    particlesRef.current = particles;
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

    // Clear with light base
    ctx.fillStyle = BASE_COLOR;
    ctx.fillRect(0, 0, w, h);

    const particles = particlesRef.current;

    // Update particle positions (ambient drift + mouse repulsion)
    particles.forEach((p) => {
      // Ambient sine drift around base position
      const targetX = p.baseX + Math.sin(t * p.driftSpeedX + p.driftPhaseX) * p.driftAmplitudeX;
      const targetY = p.baseY + Math.cos(t * p.driftSpeedY + p.driftPhaseY) * p.driftAmplitudeY;

      // Mouse repulsion
      let pushX = 0;
      let pushY = 0;
      if (!isTouchRef.current) {
        const dx = targetX - mx;
        const dy = targetY - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (1 - dist / MOUSE_RADIUS) * MOUSE_PUSH * p.z;
          pushX = (dx / dist) * force;
          pushY = (dy / dist) * force;
        }
      }

      // Smoothly interpolate to target (easing)
      p.x += (targetX + pushX - p.x) * 0.08;
      p.y += (targetY + pushY - p.y) * 0.08;
    });

    // Draw constellation lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < LINE_MAX_DIST) {
          // Opacity fades with distance; also factor in average depth
          const avgZ = (a.z + b.z) * 0.5;
          const lineAlpha = (1 - dist / LINE_MAX_DIST) * 0.1 * avgZ;

          // Lines near cursor brighten slightly
          let boost = 1;
          if (!isTouchRef.current) {
            const midX = (a.x + b.x) * 0.5;
            const midY = (a.y + b.y) * 0.5;
            const mDist = Math.sqrt((midX - mx) ** 2 + (midY - my) ** 2);
            if (mDist < MOUSE_RADIUS) {
              boost = 1 + (1 - mDist / MOUSE_RADIUS) * 1.5;
            }
          }

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${LINE_COLOR[0]}, ${LINE_COLOR[1]}, ${LINE_COLOR[2]}, ${lineAlpha * boost})`;
          ctx.lineWidth = 0.6 + avgZ * 0.4;
          ctx.stroke();
        }
      }
    }

    // Draw particles (dots)
    particles.forEach((p) => {
      const alpha = 0.15 + p.z * 0.35; // 0.15–0.50

      // Glow near mouse
      let glowBoost = 0;
      if (!isTouchRef.current) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const mDist = Math.sqrt(dx * dx + dy * dy);
        if (mDist < MOUSE_RADIUS) {
          glowBoost = (1 - mDist / MOUSE_RADIUS) * 0.4;
        }
      }

      // Outer glow
      if (p.z > 0.6 || glowBoost > 0.1) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${DOT_COLOR[0]}, ${DOT_COLOR[1]}, ${DOT_COLOR[2]}, ${(alpha * 0.15) + glowBoost * 0.1})`;
        ctx.fill();
      }

      // Core dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${DOT_COLOR[0]}, ${DOT_COLOR[1]}, ${DOT_COLOR[2]}, ${alpha + glowBoost})`;
      ctx.fill();
    });

    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Detect touch device
    isTouchRef.current =
      typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

    // Set up dimensions with ResizeObserver
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

    // Mouse tracking
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);

    // Start animation
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
