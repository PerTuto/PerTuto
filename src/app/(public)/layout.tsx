import Link from 'next/link';
import { FloatingWhatsApp } from '@/components/public/floating-whatsapp';
import { Button } from '@/components/ui/button';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* Floating Glass Navigation Pill (Noora Style) */}
            <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-8 px-8 py-3 rounded-full bg-background/60 backdrop-blur-xl border border-border/50 shadow-2xl transition-all">
                <nav className="flex items-center justify-between w-full min-w-[320px] md:min-w-[600px]">
                    <Link href="/" className="font-headline text-xl font-bold tracking-tight text-foreground">
                        Per<span className="text-primary">Tuto</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/services/k12" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            K-12 Tutoring
                        </Link>
                        <Link href="/services/professional" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Professional
                        </Link>
                        <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Contact
                        </Link>
                    </div>

                    <Link href="/contact">
                        {/* Ghost Button styling for primary CTA in Nav */}
                        <Button variant="outline" size="sm" className="font-semibold rounded-full border-border/50 bg-transparent hover:bg-foreground hover:text-background transition-colors">
                            Book Demo
                        </Button>
                    </Link>
                </nav>
            </header>

            {/* Main Content */}
            <main className="min-h-screen pt-16">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-border/30 bg-background/50">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="font-headline text-lg font-bold mb-3">
                                Per<span className="text-primary">Tuto</span>
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Expert tutoring for students and professionals in Dubai.
                                Personalized learning that delivers results.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm mb-3 text-foreground">Services</h4>
                            <div className="space-y-2">
                                <Link href="/services/k12" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    K-12 Tutoring
                                </Link>
                                <Link href="/services/professional" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Professional Upskilling
                                </Link>
                                <Link href="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm mb-3 text-foreground">Connect</h4>
                            <div className="space-y-2">
                                <a href="https://wa.me/919899266498" target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    WhatsApp
                                </a>
                                <a href="mailto:hello@pertuto.com" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    hello@pertuto.com
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-border/20 text-center">
                        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} PerTuto. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            <FloatingWhatsApp />
        </>
    );
}
