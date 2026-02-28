'use client';

import React, { useRef, useEffect, useCallback } from 'react';

/**
 * SpaceBackground — A space/science themed Canvas 2D background
 * with twinkling stars, faint constellation lines, and subtle
 * nebula-like color clouds. Lightweight, no dependencies.
 */

interface Star {
  x: number;
  y: number;
  r: number;        // radius
  twinkle: number;  // twinkle phase offset
  speed: number;    // twinkle speed
  brightness: number;
}

interface Nebula {
  x: number;
  y: number;
  r: number;
  hue: number;
  drift: number;
}

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const nebulaeRef = useRef<Nebula[]>([]);
  const initedRef = useRef(false);

  const init = useCallback((w: number, h: number) => {
    // Generate stars — mix of sizes
    const starCount = Math.floor((w * h) / 3000); // density scales with viewport
    starsRef.current = Array.from({ length: starCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() < 0.85 ? 0.5 + Math.random() * 1 : 1.5 + Math.random() * 1.5, // mostly small, few bright
      twinkle: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 2,
      brightness: 0.3 + Math.random() * 0.7,
    }));

    // Generate subtle nebula clouds
    nebulaeRef.current = [
      { x: w * 0.2, y: h * 0.3, r: w * 0.35, hue: 220, drift: 0.0003 },  // blue
      { x: w * 0.75, y: h * 0.6, r: w * 0.3, hue: 280, drift: -0.0002 }, // purple
      { x: w * 0.5, y: h * 0.15, r: w * 0.25, hue: 170, drift: 0.00025 }, // teal (brand)
    ];
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

    if (!initedRef.current) {
      init(w, h);
      initedRef.current = true;
    }

    const t = time * 0.001;

    // Clear with dark blue-black base
    ctx.fillStyle = '#0c0e1a';
    ctx.fillRect(0, 0, w, h);

    // Draw nebula clouds — very subtle radial gradients
    nebulaeRef.current.forEach((neb) => {
      const nx = neb.x + Math.sin(t * neb.drift * 100) * 30;
      const ny = neb.y + Math.cos(t * neb.drift * 80) * 20;

      const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, neb.r);
      grad.addColorStop(0, `hsla(${neb.hue}, 60%, 40%, 0.08)`);
      grad.addColorStop(0.4, `hsla(${neb.hue}, 50%, 30%, 0.04)`);
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    });

    // Draw constellation lines between close bright stars
    const brightStars = starsRef.current.filter((s) => s.r > 1.2);
    ctx.strokeStyle = 'rgba(150, 180, 220, 0.06)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < brightStars.length; i++) {
      for (let j = i + 1; j < brightStars.length; j++) {
        const dx = brightStars[i].x - brightStars[j].x;
        const dy = brightStars[i].y - brightStars[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(brightStars[i].x, brightStars[i].y);
          ctx.lineTo(brightStars[j].x, brightStars[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw twinkling stars
    starsRef.current.forEach((star) => {
      // Twinkle: sinusoidal brightness variation
      const twinkle = 0.5 + 0.5 * Math.sin(t * star.speed + star.twinkle);
      const alpha = star.brightness * twinkle;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 230, 255, ${alpha})`;
      ctx.fill();

      // Bright stars get a subtle glow
      if (star.r > 1.2 && alpha > 0.5) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${alpha * 0.1})`;
        ctx.fill();
      }
    });

    animRef.current = requestAnimationFrame(draw);
  }, [init]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
