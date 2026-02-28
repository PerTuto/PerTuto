'use client';

import React, { useEffect, useRef, useCallback } from 'react';

/**
 * ColorBreathing — A very subtle ambient radial gradient that
 * slowly pulses (breathes) in the background. Creates a living,
 * organic feel without being distracting.
 *
 * Works by cycling hue/opacity on a large radial gradient using
 * Canvas 2D and requestAnimationFrame.
 */
export function ColorBreathing({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);

  const draw = useCallback((time: number) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const t = time * 0.0003; // very slow

    // Two pulsing orbs, slightly offset, cycling through teal tones
    const orbs = [
      {
        cx: w * (0.3 + Math.sin(t * 0.7) * 0.05),
        cy: h * (0.4 + Math.cos(t * 0.5) * 0.08),
        r: Math.min(w, h) * (0.5 + Math.sin(t) * 0.08),
        hue: 168 + Math.sin(t * 0.8) * 8,           // teal range
        sat: 60 + Math.sin(t * 1.1) * 8,
        light: 42 + Math.sin(t * 0.6) * 4,
        alpha: 0.04 + Math.sin(t * 0.9) * 0.015,     // very subtle
      },
      {
        cx: w * (0.7 + Math.cos(t * 0.6) * 0.06),
        cy: h * (0.6 + Math.sin(t * 0.4) * 0.1),
        r: Math.min(w, h) * (0.4 + Math.cos(t * 0.7) * 0.06),
        hue: 162 + Math.cos(t * 0.9) * 10,
        sat: 55 + Math.cos(t * 0.7) * 6,
        light: 45 + Math.cos(t * 0.5) * 5,
        alpha: 0.03 + Math.cos(t * 1.0) * 0.01,
      },
    ];

    orbs.forEach((orb) => {
      const gradient = ctx.createRadialGradient(
        orb.cx, orb.cy, 0,
        orb.cx, orb.cy, orb.r
      );
      gradient.addColorStop(0, `hsla(${orb.hue}, ${orb.sat}%, ${orb.light}%, ${orb.alpha})`);
      gradient.addColorStop(0.5, `hsla(${orb.hue}, ${orb.sat}%, ${orb.light}%, ${orb.alpha * 0.5})`);
      gradient.addColorStop(1, `hsla(${orb.hue}, ${orb.sat}%, ${orb.light}%, 0)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    });

    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return (
    <div ref={containerRef} className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
