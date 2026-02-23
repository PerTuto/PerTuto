'use client';

import { useEffect, useRef, useState, type ReactNode, Children, isValidElement, cloneElement, type ReactElement } from 'react';

interface AnimatedSectionProps {
    children: ReactNode;
    animation?: 'fade-up' | 'fade-left' | 'fade-right' | 'scale-in';
    delay?: number;
    className?: string;
    /** If true, animates each direct child sequentially with 100ms gaps */
    stagger?: boolean;
}

const ANIMATION_CLASSES: Record<string, { initial: string; animate: string }> = {
    'fade-up': {
        initial: 'opacity-0 translate-y-8',
        animate: 'opacity-100 translate-y-0',
    },
    'fade-left': {
        initial: 'opacity-0 -translate-x-8',
        animate: 'opacity-100 translate-x-0',
    },
    'fade-right': {
        initial: 'opacity-0 translate-x-8',
        animate: 'opacity-100 translate-x-0',
    },
    'scale-in': {
        initial: 'opacity-0 scale-95',
        animate: 'opacity-100 scale-100',
    },
};

/**
 * AnimatedSection — Intersection Observer wrapper for scroll-triggered animations.
 * Wraps content in a div that fades/slides in when scrolled into view.
 * With `stagger=true`, each direct child animates sequentially with 100ms gaps.
 */
export function AnimatedSection({
    children,
    animation = 'fade-up',
    delay = 0,
    className = '',
    stagger = false,
}: AnimatedSectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.15 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const { initial, animate } = ANIMATION_CLASSES[animation];

    if (stagger) {
        return (
            <div ref={ref} className={className}>
                {Children.map(children, (child, index) => {
                    const childDelay = delay + index * 100;
                    return (
                        <div
                            className={`transition-all duration-700 ease-out ${isVisible ? animate : initial}`}
                            style={{ transitionDelay: `${childDelay}ms` }}
                        >
                            {child}
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${isVisible ? animate : initial} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}
