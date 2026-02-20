import type { Metadata } from 'next';
import { Aurora } from '@/components/public/aurora';

export const metadata: Metadata = {
    title: 'Privacy Policy — PerTuto',
    description: 'How we collect, use, and protect your data at PerTuto.',
};

export default function PrivacyPage() {
    return (
        <>
            <Aurora colorStops={['#3B82F6', '#1E3A8A', '#0f172a']} speed={0.2} />

            <section className="relative pt-32 pb-20 px-6">
                <div className="max-w-3xl mx-auto space-y-12 relative z-10">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-headline font-bold">Privacy Policy</h1>
                        <p className="text-muted-foreground">Last updated: February 2026</p>
                    </div>

                    <div className="prose prose-invert prose-blue max-w-none">
                        <p className="lead text-lg text-muted-foreground">
                            At PerTuto, accessible from pertuto.com, one of our main priorities is the privacy of our visitors and students. This Privacy Policy document contains types of information that is collected and recorded by PerTuto and how we use it.
                        </p>

                        <h2 className="text-2xl font-headline font-semibold mt-12 mb-4">1. Information We Collect</h2>
                        <p>
                            We collect information to provide better services to our users. The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4 text-muted-foreground">
                            <li><strong>Account Information:</strong> Name, email address, phone number, and physical address when you register for an account or book a consultation.</li>
                            <li><strong>Student Data:</strong> Grade level, school curriculum, and academic goals to personalize the tutoring experience.</li>
                            <li><strong>Usage Data:</strong> Information on how you interact with our website, collected via Google Analytics.</li>
                        </ul>

                        <h2 className="text-2xl font-headline font-semibold mt-12 mb-4">2. How We Use Your Information</h2>
                        <p>We use the information we collect in various ways, including to:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-4 text-muted-foreground">
                            <li>Provide, operate, and maintain our website and tutoring services.</li>
                            <li>Improve, personalize, and expand our educational offerings.</li>
                            <li>Understand and analyze how you use our website.</li>
                            <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates, and for marketing purposes.</li>
                        </ul>

                        <h2 className="text-2xl font-headline font-semibold mt-12 mb-4">3. Data Protection Rights (GDPR / DPA)</h2>
                        <p>
                            We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4 text-muted-foreground">
                            <li><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
                            <li><strong>The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate.</li>
                            <li><strong>The right to erasure:</strong> You have the right to request that we erase your personal data, under certain conditions.</li>
                        </ul>

                        <h2 className="text-2xl font-headline font-semibold mt-12 mb-4">4. Contact Us</h2>
                        <p className="text-muted-foreground">
                            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <strong>legal@pertuto.com</strong>.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
