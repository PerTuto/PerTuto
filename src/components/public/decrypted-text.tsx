'use client';

import { useEffect, useState } from 'react';

interface DecryptedTextProps {
    text: string;
    speed?: number;
    className?: string;
}

export function DecryptedText({ text, speed = 50, className }: DecryptedTextProps) {
    const [displayText, setDisplayText] = useState(text);

    useEffect(() => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        let iter = 0;
        const interval = setInterval(() => {
            setDisplayText(
                text.split("").map((letter, index) => {
                    if (index < iter) return text[index];
                    if (letter === ' ') return ' ';
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join("")
            );
            if (iter >= text.length) {
                clearInterval(interval);
                setDisplayText(text);
            }
            iter += 1 / 3;
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed]);

    return <span className={className}>{displayText}</span>;
}
