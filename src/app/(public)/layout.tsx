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
    { label: 'Resources', href: '/resources' },
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

    // Dark hero pages — transparent navbar until scroll
    const hasDarkHero = pathname === '/nike-proto' || pathname === '/nike-v2';
    // Fully-dark pages stay dark even after scrolling
    const isDarkPage = pathname === '/nike-v2';
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        if (!hasDarkHero) return;
        const handleScroll = () => setScrolled(window.scrollY > 50);
        handleScroll(); // check initial
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasDarkHero]);

    const isTransparent = hasDarkHero && !scrolled;
    const isDarkNav = isTransparent || isDarkPage;
    const textColor = isDarkNav ? 'text-white/80 hover:text-white' : 'text-foreground/70 hover:text-foreground';
    const activeColor = isDarkNav ? 'text-white' : 'text-primary';

    return (
        <>
            {/* ===== NAVBAR ===== */}
            <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                isDarkPage
                    ? (isTransparent ? 'bg-transparent border-transparent' : 'glass-header-dark')
                    : (isTransparent ? 'bg-transparent border-transparent' : 'glass-header')
            }`}>
                <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <PerTutoLogo size="sm" />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8 absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        {NAV_LINKS.map((link) =>
                            link.children ? (
                                // Services Dropdown
                                <div key={link.label} className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setServicesOpen(!servicesOpen)}
                                        className={`flex items-center gap-1 text-sm font-medium transition-colors ${textColor}`}
                                    >
                                        {link.label}
                                        <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {servicesOpen && (
                                        <div className={`absolute top-full start-1/2 -translate-x-1/2 mt-3 w-72 rounded-xl border shadow-lg p-2 animate-fade-in ${isDarkPage ? 'bg-[#1a1f2e] border-white/10' : 'bg-white border-border'}`}>
                                            {link.children.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    onClick={() => setServicesOpen(false)}
                                                    className={`block px-4 py-3 rounded-lg transition-colors ${isDarkPage ? 'hover:bg-white/10' : 'hover:bg-secondary'}`}
                                                >
                                                    <div className={`font-medium text-sm ${isDarkPage ? 'text-white' : 'text-foreground'}`}>{child.label}</div>
                                                    <div className={`text-xs mt-0.5 ${isDarkPage ? 'text-white/50' : 'text-muted-foreground'}`}>{child.description}</div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    key={link.label}
                                    href={link.href!}
                                    className={`text-sm font-semibold transition-colors nav-link-animated pb-1 ${
                                        pathname === link.href
                                            ? activeColor
                                            : textColor
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
                            className={`md:hidden p-2 ${isTransparent ? 'text-white' : 'text-foreground'}`}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className={`md:hidden border-t px-6 py-4 space-y-1 animate-fade-in ${isDarkPage ? 'bg-[#1a1f2e] border-white/10' : 'bg-white border-border'}`}>
                        <Link href="/services/k12" onClick={() => setMobileMenuOpen(false)} className={`block py-3 text-sm font-medium ${isDarkPage ? 'text-white/80 hover:text-primary' : 'text-foreground hover:text-primary'}`}>
                            K-12 Tutoring
                        </Link>
                        <Link href="/services/university" onClick={() => setMobileMenuOpen(false)} className={`block py-3 text-sm font-medium ${isDarkPage ? 'text-white/80 hover:text-primary' : 'text-foreground hover:text-primary'}`}>
                            Higher Education
                        </Link>
                        <Link href="/services/professional" onClick={() => setMobileMenuOpen(false)} className={`block py-3 text-sm font-medium ${isDarkPage ? 'text-white/80 hover:text-primary' : 'text-foreground hover:text-primary'}`}>
                            Professional Upskilling
                        </Link>
                        <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className={`block py-3 text-sm font-medium ${isDarkPage ? 'text-white/80 hover:text-primary' : 'text-foreground hover:text-primary'}`}>
                            Pricing
                        </Link>
                        <Link href="/resources" onClick={() => setMobileMenuOpen(false)} className={`block py-3 text-sm font-medium ${isDarkPage ? 'text-white/80 hover:text-primary' : 'text-foreground hover:text-primary'}`}>
                            Resources
                        </Link>
                        <Link href="/about" onClick={() => setMobileMenuOpen(false)} className={`block py-3 text-sm font-medium ${isDarkPage ? 'text-white/80 hover:text-primary' : 'text-foreground hover:text-primary'}`}>
                            About
                        </Link>
                        <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className={`block py-3 text-sm font-medium ${isDarkPage ? 'text-white/80 hover:text-primary' : 'text-foreground hover:text-primary'}`}>
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
            <footer className={`border-t pt-16 pb-8 px-6 mt-auto ${isDarkPage ? 'bg-[#0c0f1a] border-white/10' : 'bg-background border-border'}`}>
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1">
                            <div className="mb-6">
                                <PerTutoLogo size="md" />
                            </div>
                            <p className={`text-sm leading-relaxed mb-4 ${isDarkPage ? 'text-white/50' : 'text-muted-foreground'}`}>
                                Personalized tutoring that delivers measurable results. Building confidence, one student at a time.
                            </p>
                            {/* Contact Details */}
                            <div className={`space-y-2 text-sm mb-6 ${isDarkPage ? 'text-white/50' : 'text-muted-foreground'}`}>
                                <p className="flex items-center gap-2">
                                    <span className="text-primary">📍</span> Dubai, United Arab Emirates
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="text-primary">📧</span>
                                    <a href="mailto:hello@pertuto.com" className="hover:text-primary transition-colors">hello@pertuto.com</a>
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="text-primary">📱</span>
                                    <a href="tel:+971585801639" className="hover:text-primary transition-colors">+971 58 580 1639</a>
                                </p>
                            </div>
                            {/* Social Icons */}
                            <div className="flex items-center gap-3">
                                <a
                                    href="https://wa.me/971585801639"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 flex items-center justify-center transition-colors"
                                    aria-label="WhatsApp"
                                >
                                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.61.61l4.458-1.496A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.328 0-4.536-.668-6.426-1.905l-.322-.204-3.34 1.12 1.12-3.34-.204-.322A9.956 9.956 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
                                </a>
                                <a
                                    href="https://www.instagram.com/pertuto_official"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-full bg-pink-500/10 hover:bg-pink-500/20 flex items-center justify-center transition-colors"
                                    aria-label="Instagram"
                                >
                                    <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                                </a>
                                <a
                                    href="https://www.linkedin.com/company/pertuto"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-full bg-blue-500/10 hover:bg-blue-500/20 flex items-center justify-center transition-colors"
                                    aria-label="LinkedIn"
                                >
                                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h4 className={`font-headline font-bold mb-6 ${isDarkPage ? 'text-white' : 'text-foreground'}`}>Services</h4>
                            <ul className={`space-y-3 text-sm ${isDarkPage ? 'text-white/50' : 'text-muted-foreground'}`}>
                                <li><Link href="/services/k12" className="hover:text-primary transition-colors">K-12 Tutoring</Link></li>
                                <li><Link href="/services/university" className="hover:text-primary transition-colors">Higher Education</Link></li>
                                <li><Link href="/services/professional" className="hover:text-primary transition-colors">Professional Upskilling</Link></li>
                                <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className={`font-headline font-bold mb-6 ${isDarkPage ? 'text-white' : 'text-foreground'}`}>Company</h4>
                            <ul className={`space-y-3 text-sm ${isDarkPage ? 'text-white/50' : 'text-muted-foreground'}`}>
                                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                                <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                                <li><Link href="/resources" className="hover:text-primary transition-colors">Resources</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className={`font-headline font-bold mb-6 ${isDarkPage ? 'text-white' : 'text-foreground'}`}>Legal</h4>
                            <ul className={`space-y-3 text-sm ${isDarkPage ? 'text-white/50' : 'text-muted-foreground'}`}>
                                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>
                    {/* Trust Badges */}
                    <div className={`border-t py-6 mb-4 flex flex-wrap items-center justify-center gap-6 ${isDarkPage ? 'border-white/10' : 'border-border'}`}>
                        <div className={`flex items-center gap-2 text-sm font-medium ${isDarkPage ? 'text-white/50' : 'text-muted-foreground'}`}>
                            <span className="text-amber-400">★★★★★</span>
                            <span>4.9/5 Google Rating</span>
                        </div>
                        <span className={`w-1 h-1 rounded-full ${isDarkPage ? 'bg-white/20' : 'bg-border'}`} />
                        <div className={`flex items-center gap-2 text-sm font-medium ${isDarkPage ? 'text-white/50' : 'text-muted-foreground'}`}>
                            <span className="text-primary">✓</span>
                            <span>500+ Students Worldwide</span>
                        </div>
                        <span className={`w-1 h-1 rounded-full ${isDarkPage ? 'bg-white/20' : 'bg-border'}`} />
                        <div className={`flex items-center gap-2 text-sm font-medium ${isDarkPage ? 'text-white/50' : 'text-muted-foreground'}`}>
                            <span className="text-primary">✓</span>
                            <span>Free Demo Available</span>
                        </div>
                    </div>
                    <div className={`border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 ${isDarkPage ? 'border-white/10' : 'border-border'}`}>
                        <p className={`text-xs ${isDarkPage ? 'text-white/55' : 'text-muted-foreground'}`}>© {new Date().getFullYear()} PerTuto. All rights reserved.</p>
                        <div className="flex items-center gap-6">
                            <a
                                href="https://wa.me/971585801639?text=Hi%20PerTuto"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-xs hover:text-primary transition-colors font-medium ${isDarkPage ? 'text-white/50' : 'text-muted-foreground'}`}
                            >
                                Still have questions? Chat with us →
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

            <FloatingWhatsApp />
        </>
    );
}
