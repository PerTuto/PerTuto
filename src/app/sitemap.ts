import type { MetadataRoute } from 'next';
import { subjectsData } from '@/data/subjects';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://pertuto.com';

    // Base static routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/services/k12`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/services/professional`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ];

    // Dynamic subject routes
    const subjectRoutes: MetadataRoute.Sitemap = subjectsData.map((subject) => ({
        url: `${baseUrl}/subjects/${subject.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    return [...staticRoutes, ...subjectRoutes];
}
