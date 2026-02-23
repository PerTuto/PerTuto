export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        name: 'PerTuto',
        url: 'https://pertuto.com',
        logo: 'https://pertuto.com/logo.png',
        description: 'Expert tutoring for students and professionals in Dubai. IB, IGCSE, A-Level, CBSE + AI, Data Science & more.',
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Dubai',
            addressCountry: 'AE',
        },
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+91-98992-66498',
            contactType: 'customer service',
            availableLanguage: ['English', 'Hindi'],
        },
        sameAs: [
            'https://wa.me/971556006565',
        ],
    };
}

export function generateServiceSchema(name: string, description: string, url: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name,
        description,
        url,
        provider: {
            '@type': 'EducationalOrganization',
            name: 'PerTuto',
        },
        areaServed: {
            '@type': 'City',
            name: 'Dubai',
        },
        serviceType: 'Tutoring',
    };
}

export function generateFAQSchema(faqs: { q: string; a: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.a,
            },
        })),
    };
}
