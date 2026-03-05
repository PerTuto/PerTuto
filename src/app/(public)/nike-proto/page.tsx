import type { Metadata } from 'next';
import { NikeProtoContent } from './nike-proto-content';

export const metadata: Metadata = {
    title: 'PerTuto — Expert Tutoring That Delivers Results',
    description: 'Premium 1-on-1 online tutoring for IB, IGCSE, A-Level, CBSE, and professional upskilling in AI & Data Science. 500+ students across 12+ countries.',
    robots: { index: false, follow: false },
};

export default function NikeProtoPage() {
    return <NikeProtoContent />;
}
