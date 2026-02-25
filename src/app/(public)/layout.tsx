'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FloatingWhatsApp } from '@/components/public/floating-whatsapp';
import { PerTutoLogo } from '@/components/brand/logo';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const NAV_LINKS = [
    {
        label: 'Services',
        children: [
            { label: 'K-12 Tutoring', href: '/services/k12', description: 'IB, IGCSE, A-Level, CBSE' },
            { label: 'Higher Education', href: '/services/university', description: 'University, Distance Learning, Adults' },
            { label: 'Professional Upskilling', href: '/services/professional', description: 'AI, Data Science, Programming' },
        ],
    },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setServicesOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const bookDemoHref = pathname === '/' ? '#book-demo' : '/contact';

    return (
        <>
            {/* ===== NAVBAR ===== */}
            <header className="fixed top-0 w-full z-50 glass-header">
                <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <PerTutoLogo size="sm" />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        {NAV_LINKS.map((link) =>
                            link.children ? (
                                // Services Dropdown
                                <div key={link.label} className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setServicesOpen(!servicesOpen)}
                                        className="flex items-center gap-1 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                        <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {servicesOpen && (
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-white rounded-xl border border-border shadow-lg p-2 animate-fade-in">
                                            {link.children.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    onClick={() => setServicesOpen(false)}
                                                    className="block px-4 py-3 rounded-lg hover:bg-secondary transition-colors"
                                                >
                                                    <div className="font-medium text-sm text-foreground">{child.label}</div>
                                                    <div className="text-xs text-muted-foreground mt-0.5">{child.description}</div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    key={link.label}
                                    href={link.href!}
                                    className={`text-sm font-medium transition-colors ${
                                        pathname === link.href
                                            ? 'text-primary'
                                            : 'text-foreground/70 hover:text-foreground'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            )
                        )}
                    </nav>

                    {/* CTA + Mobile Menu */}
                    <div className="flex items-center gap-4">
                        <Link
                            href={bookDemoHref}
                            className="hidden sm:flex items-center justify-center px-5 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                        >
                            Book Demo
                        </Link>
                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden text-foreground p-2"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-border px-6 py-4 space-y-1 animate-fade-in">
                        <Link href="/services/k12" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-sm font-medium text-foreground hover:text-primary">
                            K-12 Tutoring
                        </Link>
                        <Link href="/services/university" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-sm font-medium text-foreground hover:text-primary">
                            Higher Education
                        </Link>
                        <Link href="/services/professional" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-sm font-medium text-foreground hover:text-primary">
                            Professional Upskilling
                        </Link>
                        <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-sm font-medium text-foreground hover:text-primary">
                            Pricing
                        </Link>
                        <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-sm font-medium text-foreground hover:text-primary">
                            About
                        </Link>
                        <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-sm font-medium text-foreground hover:text-primary">
                            Contact
                        </Link>
                        <div className="pt-2">
                            <Link
                                href={bookDemoHref}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block w-full text-center py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm"
                            >
                                Book Free Demo
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="min-h-screen pt-[72px]">
                {children}
            </main>

            {/* ===== FOOTER ===== */}
            <footer className="border-t border-border bg-background pt-16 pb-8 px-6 mt-auto">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1">
                            <div className="mb-6">
                                <PerTutoLogo size="md" />
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                                Personalized tutoring that delivers measurable results. Building confidence, one student at a time.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-headline font-bold text-foreground mb-6">Services</h4>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                <li><Link href="/services/k12" className="hover:text-primary transition-colors">K-12 Tutoring</Link></li>
                                <li><Link href="/services/university" className="hover:text-primary transition-colors">Higher Education</Link></li>
                                <li><Link href="/services/professional" className="hover:text-primary transition-colors">Professional Upskilling</Link></li>
                                <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                                <li><Link href="/tutors" className="hover:text-primary transition-colors">Our Tutors</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-headline font-bold text-foreground mb-6">Company</h4>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                                <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-headline font-bold text-foreground mb-6">Legal</h4>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-muted-foreground text-xs">© {new Date().getFullYear()} PerTuto. All rights reserved.</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            All systems operational
                        </div>
                    </div>
                </div>
            </footer>

            <FloatingWhatsApp />
        </>
    );
}
