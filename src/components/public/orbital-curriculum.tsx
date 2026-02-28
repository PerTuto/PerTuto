'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface OrbitalCurriculumProps {
  curricula?: string[];
  className?: string;
}

interface Tag {
  label: string;
  theta: number;  // polar angle
  phi: number;    // azimuthal angle
  href: string;
}

/**
 * OrbitalCurriculum — 3D rotating tag sphere using Canvas 2D.
 *
 * Tags orbit on a sphere, closest to viewer are larger/bolder.
 * Mouse hover pauses rotation, click navigates to the curriculum page.
 */
export function OrbitalCurriculum({
  curricula = ['IB', 'IGCSE', 'CBSE', 'A-Level', 'MYP', 'AP', 'SAT', 'ICSE'],
  className = '',
}: OrbitalCurriculumProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number; inside: boolean }>({ x: 0, y: 0, inside: false });
  const rotationRef = useRef(0);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  const hrefMap: Record<string, string> = {
    'IB': '/resources/ib',
    'IGCSE': '/resources/igcse',
    'CBSE': '/resources/cbse',
    'A-Level': '/resources/a-level',
    'MYP': '/resources/ib',
    'AP': '/resources/ap',
    'SAT': '/resources/sat',
    'ICSE': '/resources/icse',
  };

  // Distribute tags evenly on sphere using equidistant bands
  // Better than Fibonacci for small N (8 items) — avoids clustering
  const tags = useRef<Tag[]>(
    curricula.map((label, i) => {
      const n = curricula.length;
      // Place in 2-3 horizontal bands with equal phi spacing
      const band = Math.floor(i / Math.ceil(n / 3)); // 0, 1, or 2
      const bandIndex = i % Math.ceil(n / 3);
      const bandCount = Math.ceil(n / 3);
      const theta = (Math.PI * (band + 1)) / 4; // 45°, 90°, 135°
      const phi = (2 * Math.PI * bandIndex) / bandCount + band * 0.4; // offset per band
      return {
        label,
        theta,
        phi,
        href: hrefMap[label] || '/resources',
      };
    })
  ).current;

  const draw = useCallback(() => {
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

    const cx = w / 2;
    const cy = h / 2;
    const sphereR = Math.min(w, h) * 0.38;

    // Slow auto-rotation unless mouse is inside
    if (!mouseRef.current.inside) {
      rotationRef.current += 0.003;
    }
    const rot = rotationRef.current;

    // Project tags to 2D
    const projected = tags.map((tag) => {
      const x3d = sphereR * Math.sin(tag.theta) * Math.cos(tag.phi + rot);
      const z3d = sphereR * Math.sin(tag.theta) * Math.sin(tag.phi + rot);
      const y3d = sphereR * Math.cos(tag.theta);

      // Simple perspective
      const perspective = 600;
      const scale = perspective / (perspective + z3d);
      const x2d = cx + x3d * scale;
      const y2d = cy + y3d * scale * 0.6; // slightly squished for aesthetics

      return { ...tag, x: x2d, y: y2d, z: z3d, scale };
    });

    // Sort by z for correct overlap (far first)
    projected.sort((a, b) => a.z - b.z);

    // Draw constellation lines between nearby tags
    ctx.strokeStyle = 'rgba(27, 122, 109, 0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const dx = projected[i].x - projected[j].x;
        const dy = projected[i].y - projected[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < sphereR * 0.9) {
          ctx.beginPath();
          ctx.moveTo(projected[i].x, projected[i].y);
          ctx.lineTo(projected[j].x, projected[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw tags with collision detection
    let newHovered: string | null = null;
    const drawnBoxes: { x: number; y: number; w: number; h: number }[] = [];

    projected.forEach((p) => {
      const fontSize = Math.max(12, Math.round(20 * p.scale));
      const opacity = 0.3 + (p.scale - 0.5) * 1.4;

      // Check if mouse is near this tag
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const distToMouse = Math.sqrt((mx - p.x) ** 2 + (my - p.y) ** 2);
      const isHovered = mouseRef.current.inside && distToMouse < fontSize * 2;

      if (isHovered) newHovered = p.label;

      // Measure text width for collision detection
      ctx.font = `${isHovered ? '900' : '800'} ${fontSize}px 'Space Grotesk', 'DM Sans', sans-serif`;
      const textW = ctx.measureText(p.label).width;
      const textH = fontSize * 1.2;
      const box = { x: p.x - textW / 2, y: p.y - textH / 2, w: textW, h: textH };

      // Check overlap with already drawn labels
      const isOverlapping = drawnBoxes.some(
        (b) =>
          box.x < b.x + b.w + 8 &&
          box.x + box.w + 8 > b.x &&
          box.y < b.y + b.h + 4 &&
          box.y + box.h + 4 > b.y
      );

      // Reduce opacity for overlapping far-away labels (keep hovered always visible)
      const finalOpacity = isOverlapping && !isHovered ? Math.max(0.05, opacity * 0.3) : opacity;

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isHovered
        ? `rgba(27, 122, 109, ${Math.min(1, finalOpacity + 0.4)})`
        : `rgba(80, 80, 80, ${Math.max(0.05, finalOpacity)})`;

      if (isHovered) {
        ctx.shadowColor = 'rgba(27, 122, 109, 0.3)';
        ctx.shadowBlur = 12;
      }

      ctx.fillText(p.label, p.x, p.y);
      ctx.restore();

      // Track this label's bounding box
      drawnBoxes.push(box);
    });
    setHoveredTag(newHovered);

    animRef.current = requestAnimationFrame(draw);
  }, [tags]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      inside: true,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.inside = false;
    setHoveredTag(null);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (hoveredTag) {
      const tag = tags.find((t) => t.label === hoveredTag);
      if (tag) {
        window.location.href = tag.href;
      }
    }
  }, [hoveredTag, tags]);

  return (
    <div
      ref={containerRef}
      className={`w-full relative ${className}`}
      style={{ cursor: hoveredTag ? 'pointer' : 'default' }}
    >
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="w-full h-full"
      />
      {hoveredTag && (
        <div className="absolute bottom-4 start-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold text-primary uppercase tracking-wider backdrop-blur-sm pointer-events-none animate-fade-in-up">
          Explore {hoveredTag} →
        </div>
      )}
    </div>
  );
}
