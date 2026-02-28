'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useInView } from 'framer-motion';

interface TypingTestimonialProps {
  quote: string;
  typingSpeed?: number;  // ms per character (default 30)
  className?: string;
}

/**
 * TypingTestimonial — Types out a quote character-by-character
 * when the element scrolls into view. Blinking cursor at end.
 */
export function TypingTestimonial({
  quote,
  typingSpeed = 30,
  className = '',
}: TypingTestimonialProps) {
  const ref = useRef<HTMLQuoteElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [displayedLength, setDisplayedLength] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [typingDone, setTypingDone] = useState(false);

  // Faster typing on mobile (18ms) since users scroll faster
  const effectiveSpeed = typeof window !== 'undefined' && 
    window.matchMedia('(hover: none)').matches 
      ? Math.min(typingSpeed, 18) 
      : typingSpeed;

  // Type out the quote
  useEffect(() => {
    if (!isInView) return;
    if (displayedLength >= quote.length) {
      setTypingDone(true);
      return;
    }

    // Slight randomness in speed for natural feel
    const jitter = effectiveSpeed * (0.7 + Math.random() * 0.6);
    const timer = setTimeout(() => {
      setDisplayedLength((prev) => prev + 1);
    }, jitter);

    return () => clearTimeout(timer);
  }, [isInView, displayedLength, quote.length, typingSpeed]);

  // Blink cursor
  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(interval);
  }, [isInView]);

  // Hide cursor 600ms after typing completes
  useEffect(() => {
    if (!typingDone) return;
    const timer = setTimeout(() => setCursorVisible(false), 600);
    return () => clearTimeout(timer);
  }, [typingDone]);

  return (
    <blockquote ref={ref} className={className}>
      &ldquo;{quote.slice(0, displayedLength)}
      {(!typingDone || cursorVisible) && (
        <span
          className="inline-block w-[2px] h-[1em] bg-primary ms-0.5 align-text-bottom"
          style={{ opacity: cursorVisible ? 1 : 0, transition: 'opacity 0.1s' }}
        />
      )}
      {typingDone && <>&rdquo;</>}
    </blockquote>
  );
}
