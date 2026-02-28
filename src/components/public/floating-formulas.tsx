'use client';

import React, { useRef, useEffect, useCallback } from 'react';

const SYMBOLS = ['∑', 'π', '∫', 'Δ', '√', 'λ', '∞', 'α', 'β', 'ε', 'θ', 'φ', 'σ', 'μ', 'Ω', '∂', '∇', '≈'];

interface FloatingSymbol {
  x: number;
  y: number;
  char: string;
  size: number;
  rotation: number;
  rotSpeed: number;
  driftX: number;
  driftY: number;
  phase: number;
  opacity: number;
}

/**
 * FloatingFormulas — Canvas 2D background with slowly drifting
 * math/science Unicode symbols. Decorative, not distracting.
 */
export function FloatingFormulas({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const symbolsRef = useRef<FloatingSymbol[]>([]);
  const initializedRef = useRef(false);

  const initSymbols = useCallback((w: number, h: number) => {
    const count = Math.max(12, Math.min(20, Math.floor((w * h) / 25000)));
    symbolsRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      char: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      size: 18 + Math.random() * 32,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.005,
      driftX: (Math.random() - 0.5) * 0.3,
      driftY: 0.1 + Math.random() * 0.2,
      phase: Math.random() * Math.PI * 2,
      opacity: 0.06 + Math.random() * 0.08,
    }));
  }, []);

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

    if (!initializedRef.current) {
      initSymbols(w, h);
      initializedRef.current = true;
    }

    const t = time * 0.001;

    symbolsRef.current.forEach((sym) => {
      // Sinusoidal horizontal drift
      sym.x += sym.driftX + Math.sin(t + sym.phase) * 0.15;
      sym.y += sym.driftY;
      sym.rotation += sym.rotSpeed;

      // Wrap around edges
      if (sym.y > h + sym.size) { sym.y = -sym.size; sym.x = Math.random() * w; }
      if (sym.x > w + sym.size) sym.x = -sym.size;
      if (sym.x < -sym.size) sym.x = w + sym.size;

      ctx.save();
      ctx.translate(sym.x, sym.y);
      ctx.rotate(sym.rotation);
      ctx.font = `${sym.size}px 'Space Grotesk', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = `rgba(255, 255, 255, ${sym.opacity})`;
      ctx.fillText(sym.char, 0, 0);
      ctx.restore();
    });

    animRef.current = requestAnimationFrame(draw);
  }, [initSymbols]);

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
