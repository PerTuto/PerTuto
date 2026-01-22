import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
    title: string;
    description: string;
    canonicalPath?: string;
    ogImage?: string;
    type?: 'website' | 'article';
    noIndex?: boolean;
}

export const SEOHead = ({
    title,
    description,
    canonicalPath,
    ogImage = 'https://pertuto.com/og-image.jpg',
    type = 'website',
    noIndex = false
}: SEOHeadProps) => {
    const siteUrl = 'https://pertuto.com';
    const canonicalUrl = canonicalPath ? `${siteUrl}${canonicalPath}` : siteUrl;

    return (
        <Helmet>
            <title>{title} | PerTuto</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonicalUrl} />

            {noIndex && <meta name="robots" content="noindex, nofollow" />}

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content="PerTuto" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />
        </Helmet>
    );
};
