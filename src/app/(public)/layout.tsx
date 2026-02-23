import Link from 'next/link';
import { FloatingWhatsApp } from '@/components/public/floating-whatsapp';
import { Button } from '@/components/ui/button';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* Navigation (Stitch Glass Header) */}
            <header className="fixed top-0 w-full z-50 glass-header">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="text-primary group-hover:text-primary-glow transition-colors">
                            {/* Embedded Token SVG */}
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white group-hover:text-slate-100 transition-colors">PerTuto</span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Link href="/services/k12" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Services</Link>
                        <Link href="/pricing" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Pricing</Link>
                        <Link href="/about" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">About</Link>
                    </nav>

                    {/* CTA */}
                    <div className="flex items-center gap-4">
                        <Link href="/contact" className="hidden sm:flex items-center justify-center px-5 py-2 rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5 text-sm font-medium transition-all text-white">
                            Book Demo
                        </Link>
                        {/* Mobile Menu Icon Placeholder */}
                        <button className="md:hidden text-white p-2">
                             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="min-h-screen pt-16">
                {children}
            </main>

            {/* Footer (Stitch Premium Dark Layout) */}
             <footer className="border-t border-white/5 bg-background-dark pt-16 pb-8 px-6 mt-auto">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="text-primary">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                                    </svg>
                                </div>
                                <span className="text-xl font-bold tracking-tight text-white">PerTuto</span>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                Redefining education through technology and elite mentorship. Building the future, one student at a time.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6">Platform</h4>
                            <ul className="space-y-3 text-sm text-slate-500">
                                <li><Link href="/services/k12" className="hover:text-primary transition-colors">K-12 Pricing</Link></li>
                                <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                                <li><Link href="/instructors" className="hover:text-primary transition-colors">Tutors</Link></li>
                                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6">Company</h4>
                            <ul className="space-y-3 text-sm text-slate-500">
                                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                                <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6">Legal</h4>
                            <ul className="space-y-3 text-sm text-slate-500">
                                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-600 text-xs">© {new Date().getFullYear()} PerTuto Inc. All rights reserved.</p>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
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
