import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Aurora } from '../components/Aurora';
import { StickyBanner } from '../components/StickyBanner';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';
import { ClayButton } from '../components/ClayButton';
import { Menu, X, Twitter, Instagram, Linkedin } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { clsx } from 'clsx';
import { SkylineBackground } from '../components/SkylineBackground';

interface MainLayoutProps {
    viewMode: 'school' | 'pro';
    setViewMode: (mode: 'school' | 'pro') => void;
}

export const MainLayout = ({ viewMode, setViewMode }: MainLayoutProps) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isSchool = viewMode === 'school';

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setMobileMenuOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans selection:bg-[#7C3AED] selection:text-white overflow-x-hidden relative transition-colors duration-300">
            <Helmet>
                <title>PerTuto - Premium 1:1 Tutoring in Dubai | IGCSE, IB, A-Level</title>
                <meta name="description" content="Elite tutoring for IB, A-Levels, IGCSE & AP in Dubai. Verified tutors, adaptive learning, and real results. Book your free diagnostic session today." />
                <meta property="og:title" content="PerTuto - Premium 1:1 Tutoring in Dubai" />
                <meta property="og:description" content="Elite tutoring for IB, A-Levels, IGCSE & AP. Book your free diagnostic session." />
                <link rel="canonical" href="https://pertuto.com" />
            </Helmet>

            {/* Background Grid - Education/Math Theme */}
            <div className="fixed inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(#999 1px, transparent 1px), linear-gradient(90deg, #999 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Background Aurora - Calmer Blue/Teal */}
            <Aurora
                speed={0.15}
                colorStops={isSchool
                    ? ["#0F4C75", "#1B262C", "#0D7377"] // Deep calm blues and teals
                    : ["#1B262C", "#0F4C75", "#14274E"] // Professional dark blues
                }
            />

            {/* Subtle Dubai Silhouette */}
            <SkylineBackground />

            {/* Header: Sticky Banner + Navbar */}
            <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
                <StickyBanner />
                <nav className="bg-white/50 dark:bg-black/50 backdrop-blur-lg border-b border-black/5 dark:border-white/10 w-full">
                    <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#DB2777] flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(124,58,237,0.5)]">
                                P
                            </div>
                            <span className="text-xl font-bold tracking-tight">PERTUTO</span>
                        </Link>

                        {/* Center Toggle */}
                        <div className="hidden md:flex items-center glass-panel rounded-full p-1 absolute left-1/2 -translate-x-1/2">
                            <button
                                onClick={() => setViewMode('school')}
                                className={clsx(
                                    "px-6 py-2 rounded-full text-xs font-mono font-bold transition-all duration-300 whitespace-nowrap",
                                    isSchool ? "bg-[#7C3AED] text-white shadow-[0_0_15px_rgba(124,58,237,0.5)]" : "text-gray-400 hover:text-white"
                                )}
                            >
                                SCHOOL STUDENTS
                            </button>
                            <button
                                onClick={() => setViewMode('pro')}
                                className={clsx(
                                    "px-6 py-2 rounded-full text-xs font-mono font-bold transition-all duration-300 whitespace-nowrap",
                                    !isSchool ? "bg-[#DB2777] text-white shadow-[0_0_15px_rgba(219,39,119,0.5)]" : "text-gray-400 hover:text-white"
                                )}
                            >
                                PROFESSIONALS
                            </button>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8">
                            <Link to="/igcse-tutoring" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">IGCSE</Link>
                            <Link to="/ib-tutoring" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">IB</Link>
                            <button onClick={() => scrollToSection('contact')} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                                {isSchool ? 'The Vibe' : 'Strategy'}
                            </button>
                            <ClayButton variant="primary" className="h-10 px-6 text-sm" onClick={() => scrollToSection('contact')}>
                                {isSchool ? 'Join Waitlist' : 'Consult Now'}
                            </ClayButton>
                        </div>

                        {/* Mobile Menu Button */}
                        <button className="md:hidden text-black dark:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    <div className={clsx(
                        "md:hidden absolute top-20 left-0 right-0 bg-white dark:bg-black border-b border-black/5 dark:border-white/10 transition-all duration-300 overflow-hidden",
                        mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}>
                        <div className="p-6 flex flex-col gap-4">
                            <button onClick={() => setViewMode('school')} className={clsx("text-left font-bold", isSchool ? "text-[#7C3AED]" : "text-gray-400")}>SCHOOL STUDENTS</button>
                            <button onClick={() => setViewMode('pro')} className={clsx("text-left font-bold", !isSchool ? "text-[#DB2777]" : "text-gray-400")}>PROFESSIONALS</button>
                            <hr className="border-white/10" />
                            <Link to="/igcse-tutoring" className="text-left text-gray-400" onClick={() => setMobileMenuOpen(false)}>IGCSE Tutoring</Link>
                            <Link to="/ib-tutoring" className="text-left text-gray-400" onClick={() => setMobileMenuOpen(false)}>IB Tutoring</Link>
                            <button onClick={() => scrollToSection('contact')} className="text-left text-white font-bold uppercase">
                                {isSchool ? 'Join Waitlist' : 'Consult with an Expert'}
                            </button>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Page Content */}
            <main>
                <Outlet context={{ viewMode, setViewMode, isSchool }} />
            </main>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-black/5 dark:border-white/10 bg-gray-50 dark:bg-black relative z-10 transition-colors duration-300">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-4 gap-8 mb-12">
                        {/* Brand */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#DB2777] flex items-center justify-center font-bold text-white text-xs">P</div>
                                <span className="font-bold tracking-tight">PERTUTO</span>
                            </div>
                            <p className="text-gray-500 text-sm">Premium 1:1 tutoring for students who want to dominate.</p>
                        </div>

                        {/* Curricula */}
                        <div>
                            <h4 className="font-bold text-black dark:text-white mb-4">Curricula</h4>
                            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                                <li><Link to="/igcse-tutoring" className="hover:text-[#7C3AED] dark:hover:text-white transition-colors">IGCSE Tutoring</Link></li>
                                <li><Link to="/ib-tutoring" className="hover:text-white transition-colors">IB Tutoring</Link></li>
                                <li><Link to="/a-level-tutoring" className="hover:text-white transition-colors">A-Level Tutoring</Link></li>
                                <li><Link to="/cbse-tutoring" className="hover:text-white transition-colors">CBSE Tutoring</Link></li>
                            </ul>
                        </div>

                        {/* Trust & Compliance */}
                        <div>
                            <h4 className="font-bold text-black dark:text-white mb-4">Legal & Safety</h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-black font-bold">✓</div>
                                    <span className="text-[10px] text-green-500/80 font-mono font-bold tracking-tighter uppercase">100% MoHRE/DED Compliant</span>
                                </div>
                                <p className="text-[11px] text-gray-500 leading-relaxed">
                                    PerTuto strictly partners with verified, permit-holding educators. We fully adhere to Dubai's latest 2023-2024 academic regulations for safe & legal private tutoring.
                                </p>
                            </div>
                        </div>

                        {/* Resources */}
                        <div>
                            <h4 className="font-bold text-black dark:text-white mb-4">Resources</h4>
                            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                                <li><Link to="/resources/past-papers" className="hover:text-[#7C3AED] dark:hover:text-white transition-colors">Past Papers</Link></li>
                                <li><Link to="/resources/grade-calculator" className="hover:text-[#7C3AED] dark:hover:text-white transition-colors">Grade Calculator</Link></li>
                                <li><Link to="/about/verified-tutors" className="hover:text-[#7C3AED] dark:hover:text-white transition-colors">Our Tutors</Link></li>
                            </ul>
                            <div className="flex items-center gap-4 mt-4">
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#0077B5] dark:hover:text-white transition-colors">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-8 border-t border-black/5 dark:border-white/10">
                        <div className="flex gap-6 text-gray-400">
                            <a href="#" className="hover:text-[#1DA1F2] dark:hover:text-white transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="hover:text-[#E1306C] dark:hover:text-white transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="hover:text-[#0077B5] dark:hover:text-white transition-colors"><Linkedin size={20} /></a>
                        </div>
                        <p className="text-gray-600 text-sm font-mono">
                            © 2024 Pertuto Education. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>

            {/* Floating WhatsApp */}
            <FloatingWhatsApp />
        </div>
    );
};
