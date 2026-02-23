import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms & Conditions — PerTuto',
    description: 'Terms of service and usage guidelines for PerTuto students and parents.',
};

export default function TermsPage() {
    return (
        <>

            <section className="relative pt-32 pb-20 px-6">
                <div className="max-w-3xl mx-auto space-y-12 relative z-10">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-headline font-bold">Terms & Conditions</h1>
                        <p className="text-muted-foreground">Last updated: February 2026</p>
                    </div>

                    <div className="prose prose-invert prose-blue max-w-none">
                        <p className="lead text-lg text-muted-foreground">
                            Welcome to PerTuto. These terms and conditions outline the rules and regulations for the use of PerTuto's Website and Tutoring Services.
                        </p>

                        <h2 className="text-2xl font-headline font-semibold mt-12 mb-4">1. Acceptance of Terms</h2>
                        <p className="text-muted-foreground">
                            By accessing this website and booking our services, we assume you accept these terms and conditions. Do not continue to use PerTuto if you do not agree to take all of the terms and conditions stated on this page.
                        </p>

                        <h2 className="text-2xl font-headline font-semibold mt-12 mb-4">2. Service Provision & Enrollment</h2>
                        <ul className="list-disc pl-6 space-y-2 mt-4 text-muted-foreground">
                            <li>All tutoring sessions are subject to tutor availability and final confirmation by PerTuto administration.</li>
                            <li>The "Diagnostic Trial" is limited to one per new student and cannot be repeated.</li>
                            <li>Monthly retainers guarantee a specific number of instructional hours per calendar month. Unused hours do not roll over unless explicit written permission is granted due to documented medical emergencies.</li>
                        </ul>

                        <h2 className="text-2xl font-headline font-semibold mt-12 mb-4">3. Cancellation & Rescheduling Policy</h2>
                        <p className="text-muted-foreground">
                            We respect our tutors' time. Cancellations made less than <strong>24 hours</strong> before a scheduled session will be billed at the full session rate. Rescheduling requests must be submitted at least 24 hours in advance to avoid penalties.
                        </p>

                        <h2 className="text-2xl font-headline font-semibold mt-12 mb-4">4. Payment Terms</h2>
                        <p className="text-muted-foreground">
                            Invoices for monthly packages are generated on the 1st of every month and are due within 5 business days. Failure to clear invoices may result in the suspension of tutoring services. All payments are non-refundable once a session block has commenced.
                        </p>

                        <h2 className="text-2xl font-headline font-semibold mt-12 mb-4">5. Code of Conduct</h2>
                        <p className="text-muted-foreground">
                            PerTuto reserves the right to terminate services immediately if a student or parent engages in abusive, disrespectful, or completely uncooperative behavior towards any of our academic staff. In such rare events, prorated refunds for remaining unused hours will be issued.
                        </p>

                        <h2 className="text-2xl font-headline font-semibold mt-12 mb-4">Contact</h2>
                        <p className="text-muted-foreground">
                            For any inquiries regarding these terms, please contact <strong>legal@pertuto.com</strong>.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
