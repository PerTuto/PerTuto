'use client';

import React, { useEffect, useState } from 'react';

interface BouncyTextProps {
  text: string;
  highlightWord?: string;        // word to color differently
  highlightClass?: string;       // Tailwind class for the highlighted word
  className?: string;            // applied to the outer container
  wordClassName?: string;        // applied to each word span
  staggerMs?: number;            // delay between words (default 120ms)
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

/**
 * BouncyText — Brilliant.org–style per-word spring entrance animation.
 *
 * Each word fades in + scales up with a slight overshoot (bounce),
 * staggered sequentially to create a wave across the headline.
 */
export function BouncyText({
  text,
  highlightWord,
  highlightClass = 'text-primary',
  className = '',
  wordClassName = '',
  staggerMs = 120,
  as: Tag = 'h1',
}: BouncyTextProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay so the animation triggers after mount paint
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const words = text.split(' ');

  return (
    <Tag className={className}>
      {words.map((word, i) => {
        const isHighlight = highlightWord && word.toLowerCase() === highlightWord.toLowerCase();
        return (
          <span
            key={i}
            className={`inline-block ${isHighlight ? highlightClass : ''} ${wordClassName}`}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible
                ? 'translateY(0) scale(1)'
                : 'translateY(24px) scale(0.85)',
              transition: `opacity 0.5s cubic-bezier(.34,1.56,.64,1) ${i * staggerMs}ms, transform 0.6s cubic-bezier(.34,1.56,.64,1) ${i * staggerMs}ms`,
              marginRight: '0.25em',
            }}
          >
            {word}
          </span>
        );
      })}
    </Tag>
  );
}
