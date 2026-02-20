import type { Metadata } from 'next';
import { LeadCaptureForm } from '@/components/public/lead-capture-form';
import { Mail, Phone, MapPin } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Contact PerTuto — Book a Demo Class in Dubai',
    description: 'Get in touch with PerTuto for expert tutoring in Dubai. Book a free demo class or reach us on WhatsApp.',
};

export default function ContactPage() {
    return (
        <section className="py-24 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Get In Touch
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Ready to get started? Fill out the form or reach us directly.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Form */}
                    <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8">
                        <h2 className="font-headline text-xl font-bold mb-6">Book Your Demo</h2>
                        <LeadCaptureForm variant="full" />
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="font-headline text-xl font-bold mb-6">Contact Details</h2>
                            <div className="space-y-5">
                                <a href="https://wa.me/919899266498" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                                        <Phone className="w-5 h-5 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold group-hover:text-primary transition-colors">WhatsApp</p>
                                        <p className="text-xs text-muted-foreground">+91 98992 66498</p>
                                    </div>
                                </a>
                                <a href="mailto:hello@pertuto.com" className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <Mail className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold group-hover:text-primary transition-colors">Email</p>
                                        <p className="text-xs text-muted-foreground">hello@pertuto.com</p>
                                    </div>
                                </a>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                                        <MapPin className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">Dubai, UAE</p>
                                        <p className="text-xs text-muted-foreground">Online sessions worldwide</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-xl border border-border/30 bg-card/30">
                            <p className="text-sm font-semibold mb-2">💬 Prefer WhatsApp?</p>
                            <p className="text-xs text-muted-foreground">Most of our students reach us on WhatsApp. Tap the green button in the corner to start a chat instantly.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
