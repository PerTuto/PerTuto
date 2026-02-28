'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';

/**
 * NeuralPathway — A thick, glowing SVG connector that draws itself
 * smoothly on scroll, with a pulsing dot travelling along the path.
 *
 * Place this in a `relative` parent wrapping the How It Works grid.
 * Uses ResizeObserver to stay in sync with layout changes.
 */
export function NeuralPathway() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [progress, setProgress] = useState(0);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  // ----- Scroll-linked progress -----
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const onScroll = () => {
      const rect = node.getBoundingClientRect();
      const viewH = window.innerHeight;
      // Start when container top enters bottom 80% of viewport
      // Finish when container CENTER reaches viewport CENTER — step 3 filled when user sees it
      const start = viewH * 0.8;
      const end = viewH * 0.5;
      const total = rect.height + start - end;
      const scrolled = start - rect.top;
      const pct = Math.min(1, Math.max(0, scrolled / total));
      setProgress(pct);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ----- Track container size -----
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const obs = new ResizeObserver(([entry]) => {
      setDims({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  // ----- Path definition -----
  const isMobile = dims.w < 640;
  const pathD = useMemo(() => {
    if (dims.w === 0 || dims.h === 0) return '';
    if (isMobile) {
      // Vertical smooth S-curve
      const cx = dims.w / 2;
      const topY = dims.h * 0.06;
      const midY = dims.h * 0.5;
      const botY = dims.h * 0.94;
      return `M ${cx} ${topY} C ${cx + 80} ${topY + (midY - topY) * 0.5}, ${cx - 80} ${midY - (midY - topY) * 0.3}, ${cx} ${midY} C ${cx + 80} ${midY + (botY - midY) * 0.3}, ${cx - 80} ${botY - (botY - midY) * 0.5}, ${cx} ${botY}`;
    }
    // Horizontal: align to step circle centers (1/6, 3/6, 5/6 of width)
    const leftX = dims.w * (1 / 6);
    const midX = dims.w * (3 / 6);
    const rightX = dims.w * (5 / 6);
    // Align Y to the vertical center of step circles (approx 35% from top)
    const cy = dims.h * 0.22;
    const cpOffset = 40; // control point vertical offset for smooth wave
    return `M ${leftX} ${cy} C ${leftX + (midX - leftX) * 0.55} ${cy - cpOffset}, ${midX - (midX - leftX) * 0.55} ${cy + cpOffset}, ${midX} ${cy} C ${midX + (rightX - midX) * 0.55} ${cy - cpOffset}, ${rightX - (rightX - midX) * 0.55} ${cy + cpOffset}, ${rightX} ${cy}`;
  }, [dims.w, dims.h, isMobile]);

  // ----- Compute drawn length & glow dot position -----
  const pathLength = pathRef.current?.getTotalLength() ?? 0;
  const drawnLength = pathLength * progress;
  const dotPoint = pathRef.current?.getPointAtLength(drawnLength) ?? { x: 0, y: 0 };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-0"
      aria-hidden
    >
      <svg
        width={dims.w}
        height={dims.h}
        className="absolute top-0 start-0 hidden md:block"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Gradient for the active path — fades from primary to a lighter shade */}
          <linearGradient id="pathway-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
          </linearGradient>

          {/* Glow filter for the dot */}
          <filter id="dot-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ghost background path — dashed for a "track" feel */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke="hsl(var(--primary) / 0.12)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray="8 6"
          />
        )}

        {/* Animated drawn path — thick, glowing */}
        {pathD && (
          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke="url(#pathway-gradient)"
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={pathLength || 1}
            strokeDashoffset={pathLength - drawnLength}
            style={{
              filter: 'drop-shadow(0 0 8px hsl(var(--primary) / 0.35))',
              transition: 'stroke-dashoffset 0.15s ease-out',
            }}
          />
        )}

        {/* Glowing leading dot — larger, with filter glow */}
        {pathLength > 0 && progress > 0.01 && (
          <g filter="url(#dot-glow)">
            <circle
              cx={dotPoint.x}
              cy={dotPoint.y}
              r={8}
              fill="hsl(var(--primary))"
              style={{
                transition: 'cx 0.15s ease-out, cy 0.15s ease-out',
              }}
            />
            {/* Inner bright core */}
            <circle
              cx={dotPoint.x}
              cy={dotPoint.y}
              r={3}
              fill="white"
              opacity={0.9}
              style={{
                transition: 'cx 0.15s ease-out, cy 0.15s ease-out',
              }}
            />
          </g>
        )}

        {/* Step node rings — pulsing rings at each step position */}
        {!isMobile && pathLength > 0 && [0, 0.5, 1].map((t, i) => {
          const pt = pathRef.current?.getPointAtLength(pathLength * t);
          if (!pt) return null;
          const active = progress >= t;
          return (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={12}
              fill="none"
              stroke={active ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.15)'}
              strokeWidth={2}
              style={{
                transition: 'stroke 0.4s ease, r 0.3s ease',
                filter: active ? 'drop-shadow(0 0 6px hsl(var(--primary) / 0.3))' : 'none',
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
