'use client';

import React from 'react';

/* ------------------------------------------------------------------ */
/*  Subject tags — two rows scrolling in opposite directions           */
/* ------------------------------------------------------------------ */

const ROW_1 = [
    'IB DP', 'IGCSE', 'A-Level', 'CBSE', 'ICSE', 'MYP', 'SAT', 'AP',
    'IB DP', 'IGCSE', 'A-Level', 'CBSE', 'ICSE', 'MYP', 'SAT', 'AP',
];

const ROW_2 = [
    'Python', 'Data Science', 'Machine Learning', 'ReactJS', 'Calculus',
    'Physics', 'Chemistry', 'Biology', 'Economics', 'Business Studies',
    'Python', 'Data Science', 'Machine Learning', 'ReactJS', 'Calculus',
    'Physics', 'Chemistry', 'Biology', 'Economics', 'Business Studies',
];

function TagPill({ label }: { label: string }) {
    return (
        <span className="flex-shrink-0 px-6 py-3 rounded-full border border-border/60 text-sm font-semibold text-foreground/80 bg-white hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-colors duration-300 cursor-default select-none whitespace-nowrap">
            {label}
        </span>
    );
}

export function SubjectMarquee() {
    return (
        <div className="w-full overflow-hidden py-8 space-y-4">
            {/* Row 1 — scrolls left */}
            <div className="flex gap-4 animate-marquee hover:[animation-play-state:paused]">
                {ROW_1.map((tag, i) => (
                    <TagPill key={`r1-${i}`} label={tag} />
                ))}
            </div>

            {/* Row 2 — scrolls right */}
            <div className="flex gap-4 animate-marquee-reverse hover:[animation-play-state:paused]">
                {ROW_2.map((tag, i) => (
                    <TagPill key={`r2-${i}`} label={tag} />
                ))}
            </div>
        </div>
    );
}
