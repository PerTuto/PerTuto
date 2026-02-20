import { useOutletContext, Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { SpotlightCard } from '../components/SpotlightCard';
import { ClayButton } from '../components/ClayButton';
import { DemoOffer } from '../components/DemoOffer';

interface LayoutContext {
    viewMode: 'school' | 'pro';
    isSchool: boolean;
}

export const IGCSETutoringPage = () => {
    const { isSchool } = useOutletContext<LayoutContext>();

    const subjects = [
        { name: 'Maths', icon: '📐', desc: 'Core & Extended syllabi. Master algebra, geometry, and statistics.' },
        { name: 'Physics', icon: '⚡', desc: 'From mechanics to electricity. Hands-on problem solving.' },
        { name: 'Chemistry', icon: '🧪', desc: 'Organic, inorganic, physical chemistry made simple.' },
        { name: 'Biology', icon: '🧬', desc: 'Cell biology to ecology. Visual learning with diagrams.' },
        { name: 'English Literature', icon: '📚', desc: 'Essay writing, poetry analysis, and exam technique.' },
        { name: 'Computer Science', icon: '💻', desc: 'Programming fundamentals and computational thinking.' },
    ];

    return (
        <>
            <SEOHead
                title="IGCSE Tutoring Dubai | Expert IGCSE Tutors Online & In-Person"
                description="Top-rated IGCSE tutoring in Dubai. Expert tutors for Math, Science, English & more. Personalized 1:1 sessions, flexible scheduling. Book your free trial today!"
                canonicalPath="/igcse-tutoring"
            />

            {/* Hero */}
            <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1 mb-6 rounded-full border border-[#7C3AED]/30 bg-[#7C3AED]/10 backdrop-blur-md">
                            <span className="font-mono text-xs text-[#d8b4fe] tracking-widest uppercase">IGCSE Specialists</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                            IGCSE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#DB2777]">Tutoring</span>
                        </h1>

                        <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                            {isSchool
                                ? <span className="text-white font-medium">May Exams are just 12 weeks away. Is your child ready?</span>
                                : "The IGCSE curriculum is the foundation for university success. Ensure your child isn't leaving their future to chance with our examiner-led tuition."
                            }
                            {isSchool && <span className="block mt-2 text-gray-400 text-sm md:text-base">Gaps in understanding right now will cost grades in May. We identify and fix them instantly.</span>}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <ClayButton variant="primary" className="h-14 px-8 text-base" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                                Book Gap Assessment
                            </ClayButton>
                            <ClayButton variant="secondary" className="h-14 px-8 text-base">
                                View Past Papers
                            </ClayButton>
                        </div>
                    </div>
                </div>
            </header>

            {/* Subjects Grid */}
            <section className="py-24 px-6 bg-black/50">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
                        IGCSE <span className="text-[#7C3AED]">Subjects</span> We Cover
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subjects.map((subject, i) => {
                            let path = '#';
                            if (subject.name === 'Maths') path = '/subjects/igcse-math';
                            if (subject.name === 'Physics') path = '/subjects/igcse-physics';
                            if (subject.name === 'Chemistry') path = '/subjects/igcse-chemistry';

                            return (
                                <Link to={path} key={i} className="group">
                                    <SpotlightCard className="h-full group-hover:border-[#7C3AED]/50 transition-colors">
                                        <div className="text-4xl mb-4">{subject.icon}</div>
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-[#7C3AED] transition-all">{subject.name}</h3>
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

            {/* Why IGCSE with PerTuto */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-8">
                                Why Choose <span className="text-[#7C3AED]">PerTuto</span> for IGCSE?
                            </h2>
                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-[#7C3AED]/20 flex items-center justify-center text-[#7C3AED] shrink-0">✓</div>
                                    <div>
                                        <h4 className="font-bold mb-1">Past Paper Specialists</h4>
                                        <p className="text-gray-400 text-sm">Our tutors have solved 1000s of past papers. We know exactly what examiners look for.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-[#7C3AED]/20 flex items-center justify-center text-[#7C3AED] shrink-0">✓</div>
                                    <div>
                                        <h4 className="font-bold mb-1">Exam Board Experts</h4>
                                        <p className="text-gray-400 text-sm">Cambridge & Edexcel certified. We understand the marking schemes inside out.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-[#7C3AED]/20 flex items-center justify-center text-[#7C3AED] shrink-0">✓</div>
                                    <div>
                                        <h4 className="font-bold mb-1">UAE-Based Support</h4>
                                        <p className="text-gray-400 text-sm">100% legal, MoHRE compliant tutors. Safe and verified for Dubai families.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <SpotlightCard className="bg-gradient-to-br from-[#1a1a1a] to-black p-10">
                            <div className="text-center">
                                <div className="text-6xl mb-6">🏆</div>
                                <h3 className="text-3xl font-bold mb-4">Exam Technique is Everything</h3>
                                <p className="text-gray-400 mb-6">Knowledge gets you a C. Technique gets you an A*. We teach you exactly what the examiner wants to see.</p>
                                <Link to="/">
                                    <ClayButton variant="primary" className="w-full">See Success Stories</ClayButton>
                                </Link>
                            </div>
                        </SpotlightCard>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 bg-gradient-to-b from-[#7C3AED]/10 to-transparent">
                <div className="container mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">{isSchool ? "Ready to Ace Your IGCSEs?" : "Elevate Your Academic Standard"}</h2>
                    <p className="text-gray-400 mb-10">{isSchool ? "Book a free diagnostic session and get a personalized study plan." : "Schedule a professional consultation to optimize your educational strategy."}</p>
                    <ClayButton variant="primary" className="h-14 px-10 text-lg" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                        {isSchool ? "Book Gap Assessment →" : "Consult with an Expert →"}
                    </ClayButton>
                </div>
            </section>
        </>
    );
};
