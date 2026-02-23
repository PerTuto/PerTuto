import type { Metadata } from 'next';
import { LeadCaptureForm } from '@/components/public/lead-capture-form';
import { AnimatedSection } from '@/components/public/animated-section';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Get in touch with PerTuto for personalized tutoring. Book a free demo or reach us on WhatsApp.',
};

const CONTACT_INFO = [
    { icon: Phone, label: '+971 55 600 6565', href: 'https://wa.me/971556006565', description: 'WhatsApp (preferred)' },
    { icon: Mail, label: 'hello@pertuto.com', href: 'mailto:hello@pertuto.com', description: 'Email us anytime' },
    { icon: MapPin, label: 'Dubai, UAE', href: '#', description: 'Online sessions worldwide' },
    { icon: Clock, label: '9 AM – 9 PM GST', href: '#', description: 'Mon – Sat' },
];

export default function ContactPage() {
    return (
        <section className="py-16 px-6">
            <div className="max-w-5xl mx-auto">
                <AnimatedSection className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground mb-4">Get In Touch</h1>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Ready to start your learning journey? Fill in the form below and we&apos;ll call you within 2 hours.
                    </p>
                </AnimatedSection>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Form */}
                    <AnimatedSection animation="fade-left">
                        <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
                            <h2 className="font-headline text-xl font-bold mb-6 text-foreground">Book Your Free Demo</h2>
                            <LeadCaptureForm variant="full" />
                        </div>
                    </AnimatedSection>

                    {/* Contact Details */}
                    <AnimatedSection animation="fade-right" delay={150}>
                        <div className="space-y-6">
                            <h2 className="font-headline text-xl font-bold text-foreground">Contact Details</h2>
                            <div className="space-y-4">
                                {CONTACT_INFO.map(({ icon: Icon, label, href, description }) => (
                                    <Link key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} className="flex items-center gap-4 group p-4 rounded-xl hover:bg-secondary transition-colors">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                            <Icon className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-foreground group-hover:text-primary transition-colors">{label}</div>
                                            <div className="text-sm text-muted-foreground">{description}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </section>
    );
}
