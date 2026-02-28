'use client';

import React, { useRef, useCallback, useState } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;       // max rotation degrees (default ±8°)
  glareOpacity?: number;  // max glare opacity (default 0.12)
  perspective?: number;   // CSS perspective in px (default 800)
}

export function TiltCard({
  children,
  className = '',
  maxTilt = 8,
  glareOpacity = 0.12,
  perspective = 800,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('rotateX(0deg) rotateY(0deg)');
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  // Disable tilt on touch devices (no hover capability)
  const isTouchDevice = typeof window !== 'undefined' && 
    window.matchMedia('(hover: none)').matches;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isTouchDevice) return;
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      // Normalise cursor position to -1…+1 from center
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      // rotateX is driven by vertical position (inverted for natural feel)
      const rotateX = (-y * maxTilt).toFixed(2);
      const rotateY = (x * maxTilt).toFixed(2);

      setTransform(`rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
      setGlarePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    },
    [maxTilt],
  );

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTransform('rotateX(0deg) rotateY(0deg)');
    setGlarePos({ x: 50, y: 50 });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        perspective: `${perspective}px`,
        WebkitPerspective: `${perspective}px`,
      }}
    >
      <div
        style={{
          transform,
          transition: isHovered
            ? 'transform 0.1s ease-out'
            : 'transform 0.5s cubic-bezier(.25,.46,.45,.94)',
          transformStyle: 'preserve-3d',
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        {/* Glare overlay */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            zIndex: 10,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,${isHovered ? glareOpacity : 0}), transparent 60%)`,
            transition: isHovered ? 'none' : 'background 0.5s ease',
          }}
        />
        {children}
      </div>
    </div>
  );
}
