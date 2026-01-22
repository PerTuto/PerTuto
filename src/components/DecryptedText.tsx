import { useEffect, useState } from 'react';

interface DecryptedTextProps {
    text: string;
    speed?: number;
    className?: string;
    parentClassName?: string;
}

export default function DecryptedText({
    text,
    speed = 50,
    className,
    parentClassName,
}: DecryptedTextProps) {
    const [displayText, setDisplayText] = useState(text);

    // Simple Scramble Logic
    useEffect(() => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+";
        let iter = 0;
        const interval = setInterval(() => {
            setDisplayText(() =>
                text.split("").map((letter, index) => {
                    // Should we show the correct letter?
                    if (index < iter) {
                        return text[index];
                    }
                    // Return random char, but keep spaces as spaces
                    if (letter === ' ') return ' ';
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join("")
            );

            if (iter >= text.length) {
                clearInterval(interval);
                setDisplayText(text);
            }
            iter += 1 / 3; // Speed factor
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed]);

    return (
        <span className={parentClassName}>
            <span className={className}>{displayText}</span>
        </span>
    );
}
