import { useOutletContext, Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { SpotlightCard } from '../components/SpotlightCard';
import { ClayButton } from '../components/ClayButton';
import { DemoOffer } from '../components/DemoOffer';

interface LayoutContext {
    viewMode: 'school' | 'pro';
    isSchool: boolean;
}

export const IBTutoringPage = () => {
    const { isSchool } = useOutletContext<LayoutContext>();

    const subjects = [
        { name: 'Math AA HL/SL', icon: '∫', desc: 'Analysis & Approaches. Calculus, algebra, and proof mastery.' },
        { name: 'Math AI HL/SL', icon: '📊', desc: 'Applications & Interpretation. Statistics and modelling focus.' },
        { name: 'Physics HL/SL', icon: '⚛️', desc: 'From mechanics to quantum. IA support included.' },
        { name: 'Chemistry HL/SL', icon: '🧪', desc: 'Organic synthesis, thermodynamics, and lab skills.' },
        { name: 'Economics HL/SL', icon: '📈', desc: 'Micro, macro, and international economics.' },
        { name: 'English A Lit/Lang', icon: '✍️', desc: 'Literary analysis, Paper 1 & 2, and oral commentary.' },
    ];

    return (
        <>
            <SEOHead
                title="IB Tutoring Dubai | Elite 1:1 IB Tutors (HL/SL)"
                description="Premium IB tutoring in Dubai. Expert tutors for Math AA/AI, Physics, Chem & more. Internal Assessment (IA) support included. Book your free diagnostic."
                canonicalPath="/ib-tutoring"
            />

            {/* Hero */}
            <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1 mb-6 rounded-full border border-[#DB2777]/30 bg-[#DB2777]/10 backdrop-blur-md">
                            <span className="font-mono text-xs text-pink-300 tracking-widest uppercase">IB Diploma Experts</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                            IB Diploma <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DB2777] to-[#7C3AED]">Tutoring</span>
                        </h1>

                        <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                            {isSchool
                                ? <span className="text-white font-medium">IB Exams in April. Your IA deadline is even closer.</span>
                                : "The IB Diploma is a high-stakes game. Ensure your child has the strategic support to navigate IAs, EEs, and exams without the burnout."
                            }
                            {isSchool && <span className="block mt-2 text-gray-400 text-sm md:text-base">From 'It's too hard' to Level 7. We simplify the HL concepts that are keeping you awake at night.</span>}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <ClayButton variant="accent" className="h-14 px-8 text-base" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                                Book Gap Assessment
                            </ClayButton>
                            <ClayButton variant="secondary" className="h-14 px-8 text-base">
                                IA Rescue Session
                            </ClayButton>
                        </div>
                    </div>
                </div>
            </header>

            {/* Subjects Grid */}
            <section className="py-24 px-6 bg-black/50">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
                        IB <span className="text-[#DB2777]">Subjects</span> We Cover
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subjects.map((subject, i) => {
                            let path = '#';
                            if (subject.name.includes('Math AA')) path = '/subjects/ib-math-aa-hl';
                            if (subject.name.includes('Physics')) path = '/subjects/ib-physics-hl';
                            if (subject.name.includes('Chemistry')) path = '/subjects/ib-chemistry-hl';

                            return (
                                <Link to={path} key={i} className="group">
                                    <SpotlightCard className="h-full group-hover:border-[#DB2777]/50 transition-colors">
                                        <div className="text-4xl mb-4">{subject.icon}</div>
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-[#DB2777] transition-all">{subject.name}</h3>
                                        <p className="text-gray-400 text-sm">{subject.desc}</p>
                                    </SpotlightCard>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="mt-16 max-w-3xl mx-auto">
                        <DemoOffer />
                    </div>
                </div>
            </section>

            {/* IA Rescue Section */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <SpotlightCard className="bg-gradient-to-br from-[#DB2777]/20 to-black p-10 order-2 lg:order-1">
                            <div className="text-center">
                                <div className="text-6xl mb-6">🔥</div>
                                <h3 className="text-3xl font-bold mb-4">IA Rescue</h3>
                                <p className="text-gray-400 mb-6">Stuck on your Internal Assessment? Our tutors have guided 500+ IAs to top marks. Get expert feedback now.</p>
                                <ClayButton variant="accent" className="w-full">Book IA Review →</ClayButton>
                            </div>
                        </SpotlightCard>

                        <div className="order-1 lg:order-2">
                            <h2 className="text-3xl md:text-5xl font-bold mb-8">
                                Why Choose <span className="text-[#DB2777]">PerTuto</span> for IB?
                            </h2>
                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-[#DB2777]/20 flex items-center justify-center text-[#DB2777] shrink-0">✓</div>
                                    <div>
                                        <h4 className="font-bold mb-1">IB Examiners on Staff</h4>
                                        <p className="text-gray-400 text-sm">Learn directly from tutors who grade IB exams. They know exactly what earns marks.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-[#DB2777]/20 flex items-center justify-center text-[#DB2777] shrink-0">✓</div>
                                    <div>
                                        <h4 className="font-bold mb-1">IA & EE Specialists</h4>
                                        <p className="text-gray-400 text-sm">Dedicated support for Internal Assessments and Extended Essay. We guide you from topic selection to final draft.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-[#DB2777]/20 flex items-center justify-center text-[#DB2777] shrink-0">✓</div>
                                    <div>
                                        <h4 className="font-bold mb-1">Predicted Grade Boosting</h4>
                                        <p className="text-gray-400 text-sm">Strategic tutoring to help you hit the predicted grades you need for your university applications.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 bg-gradient-to-b from-[#DB2777]/10 to-transparent">
                <div className="container mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">{isSchool ? "Ready to Hit 40+ Points?" : "Ready to Master the Curriculum?"}</h2>
                    <p className="text-gray-400 mb-10">{isSchool ? "Book a free diagnostic session and build your IB success roadmap." : "Schedule a professional consultation to optimize your academic trajectory."}</p>
                    <ClayButton variant="accent" className="h-14 px-10 text-lg" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                        {isSchool ? "Book Gap Assessment →" : "Consult with an Expert →"}
                    </ClayButton>
                </div>
            </section>
        </>
    );
};
