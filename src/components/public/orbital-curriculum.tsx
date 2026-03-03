'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface OrbitalCurriculumProps {
  curricula?: string[];
  className?: string;
}

interface Tag {
  label: string;
  theta: number;  // polar angle
  phi: number;    // azimuthal angle
  href: string;
  color: string;
}

// Gamified color palette for the labels
const PALETTE = [
  '27, 122, 109',  // Brand Teal
  '245, 158, 11',  // Amber
  '79, 70, 229',   // Indigo
  '236, 72, 153',  // Pink
  '16, 185, 129',  // Emerald
];

const EXTENDED_CURRICULA = [
  'IB DP', 'IGCSE', 'CBSE', 'A-Level', 'MYP', 'AP', 'SAT', 'ICSE', 
  'Data Science', 'Calculus', 'Physics', 'Machine Learning', 'Chemistry', 
  'ReactJS', 'Python', 'Biology', 'Economics', 'Business', 'Algebra'
];

/**
 * OrbitalCurriculum — 3D rotating tag sphere using Canvas 2D.
 * V2: Deep gamification aesthetic. More words, varied colors, 
 * spring-like interaction, bold typography.
 */
export function OrbitalCurriculum({
  curricula = EXTENDED_CURRICULA,
  className = '',
}: OrbitalCurriculumProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number; inside: boolean }>({ x: 0, y: 0, inside: false });
  const rotationRef = useRef({ val: 0, velocity: 0.003 });
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  const hrefMap: Record<string, string> = {
    'IB DP': '/resources/ib',
    'IGCSE': '/resources/igcse',
    'CBSE': '/resources/cbse',
    'A-Level': '/resources/a-level',
    'MYP': '/resources/ib',
    'AP': '/resources/ap',
    'SAT': '/resources/sat',
    'ICSE': '/resources/icse',
  };

  // Spherical distribution using Fibonacci lattice for even spacing of many items
  const tags = useRef<Tag[]>(
    curricula.map((label, i) => {
      const n = curricula.length;
      const goldenRatio = (1 + Math.sqrt(5)) / 2;
      
      // Fibonacci lattice math
      const iPlusHalf = i + 0.5;
      const phi = Math.acos(1 - 2 * iPlusHalf / n);
      const theta = 2 * Math.PI * iPlusHalf / goldenRatio;
      
      return {
        label,
        theta: phi, // Map to our coordinate system naming
        phi: theta,
        href: hrefMap[label] || '/resources',
        color: PALETTE[i % PALETTE.length]
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
    // Scale up the sphere slightly to fit more items
    const sphereR = Math.min(w, h) * 0.45;

    // Physics-based rotation (spins faster on leave, slows on enter)
    if (!mouseRef.current.inside) {
      rotationRef.current.velocity += (0.003 - rotationRef.current.velocity) * 0.05;
    } else {
      rotationRef.current.velocity *= 0.95; // Break
    }
    rotationRef.current.val += rotationRef.current.velocity;
    const rot = rotationRef.current.val;

    // Project tags to 2D
    const projected = tags.map((tag) => {
      const x3d = sphereR * Math.sin(tag.theta) * Math.cos(tag.phi + rot);
      const z3d = sphereR * Math.sin(tag.theta) * Math.sin(tag.phi + rot);
      const y3d = sphereR * Math.cos(tag.theta);

      // Stronger perspective for a deeper 3D feel
      const perspective = 800;
      const scale = perspective / (perspective + z3d);
      const x2d = cx + x3d * scale;
      const y2d = cy + y3d * scale * 0.5; // Flatten Y for oval look

      return { ...tag, x: x2d, y: y2d, z: z3d, scale };
    });

    // Sort by z for correct overlap (far first)
    projected.sort((a, b) => a.z - b.z);

    // Dynamic Connections (Constellation lines)
    ctx.lineWidth = 1;
    for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
            const dx = projected[i].x - projected[j].x;
            const dy = projected[i].y - projected[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            // Connect only very close siblings
            if (dist < sphereR * 0.4) {
                const lineAlpha = (1 - dist / (sphereR * 0.4)) * 0.15 * projected[i].scale;
                ctx.beginPath();
                ctx.moveTo(projected[i].x, projected[i].y);
                ctx.lineTo(projected[j].x, projected[j].y);
                ctx.strokeStyle = `rgba(100, 116, 139, ${lineAlpha})`; // Slate line
                ctx.stroke();
            }
        }
    }

    let newHovered: string | null = null;
    const drawnBoxes: { x: number; y: number; w: number; h: number }[] = [];

    projected.forEach((p) => {
      // Exaggerated font scaling
      const baseFontSize = w < 768 ? 12 : 16;
      const fontSize = Math.max(10, Math.round(baseFontSize * Math.pow(p.scale, 1.5)));
      const opacity = 0.2 + (p.scale - 0.5) * 1.5;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const distToMouse = Math.sqrt((mx - p.x) ** 2 + (my - p.y) ** 2);
      const isHovered = mouseRef.current.inside && distToMouse < fontSize * 2.5 && p.scale > 0.8;

      if (isHovered) newHovered = p.label;

      const fontWeight = isHovered ? '900' : '800';
      ctx.font = `${fontWeight} ${fontSize}px 'Space Grotesk', 'DM Sans', sans-serif`;
      const textW = ctx.measureText(p.label).width;
      const textH = fontSize * 1.2;
      const padding = 12 * p.scale;
      
      const box = { x: p.x - textW / 2 - padding, y: p.y - textH / 2 - padding/2, w: textW + padding*2, h: textH + padding };

      // Check overlap
      const isOverlapping = drawnBoxes.some(
        (b) =>
          box.x < b.x + b.w &&
          box.x + box.w > b.x &&
          box.y < b.y + b.h &&
          box.y + box.h > b.y
      );

      // Cull dense overlaps entirely to prevent mess, unless hovered
      if (isOverlapping && !isHovered && p.scale < 1.1) return;

      const finalOpacity = isHovered ? 1 : Math.max(0.1, Math.min(1, opacity));

      ctx.save();
      
      // Draw pill background for hovered items
      if (isHovered) {
          ctx.beginPath();
          ctx.roundRect(box.x, box.y, box.w, box.h, 16);
          ctx.fillStyle = `rgba(${p.color}, 0.15)`;
          ctx.fill();
          ctx.strokeStyle = `rgba(${p.color}, 0.5)`;
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Glow
          ctx.shadowColor = `rgba(${p.color}, 0.4)`;
          ctx.shadowBlur = 20;
      }

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Colored text if front/hovered, else greyed out
      if (p.scale > 1.1 || isHovered) {
        ctx.fillStyle = `rgba(${p.color}, ${finalOpacity})`;
      } else {
        ctx.fillStyle = `rgba(100, 116, 139, ${finalOpacity * 0.8})`; // Slate
      }

      ctx.fillText(p.label, p.x, p.y);
      ctx.restore();

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
        className="w-full h-full touch-none"
      />
      
      {/* V2 Framer Motion Tooltip/Badge */}
      <AnimatePresence>
        {hoveredTag && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute bottom-4 start-1/2 -translate-x-1/2 px-6 py-2 bg-white/80 border-2 border-primary/30 rounded-full text-sm font-black text-primary uppercase tracking-widest backdrop-blur-md pointer-events-none shadow-xl"
          >
            Study {hoveredTag} →
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
