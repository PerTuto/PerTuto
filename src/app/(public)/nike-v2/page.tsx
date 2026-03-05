import type { Metadata } from 'next';
import { NikeV2Content } from './nike-v2-content';

export const metadata: Metadata = {
    title: 'PerTuto — Dark Immersive Prototype',
    description: 'Dark immersive design exploration for PerTuto landing page.',
};

export default function NikeV2Page() {
    return <NikeV2Content />;
}
