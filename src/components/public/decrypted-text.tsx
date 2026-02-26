'use client';

import { useEffect, useState } from 'react';

interface DecryptedTextProps {
    text: string;
    speed?: number;
    className?: string;
}

export function DecryptedText({ text, speed = 50, className }: DecryptedTextProps) {
    // Replaced the scramble effect with a stable output to fix Critical Bug #1 (Garbled Text)
    // The scramble animation was occasionally halting midway or causing hydration mismatches.
    return <span className={className}>{text}</span>;
}
