import { useOutletContext, Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { SpotlightCard } from '../components/SpotlightCard';
import { ClayButton } from '../components/ClayButton';
import { DemoOffer } from '../components/DemoOffer';

interface LayoutContext {
    viewMode: 'school' | 'pro';
    isSchool: boolean;
}

export const CBSETutoringPage = () => {
    const { isSchool } = useOutletContext<LayoutContext>();

    const subjects = [
        { name: 'Mathematics', icon: '📐', desc: 'Focus on NCERT solutions, previous year papers, and board exam strategy.', path: '/subjects/cbse-math' },
        { name: 'Physics', icon: '⚡', desc: 'Detailed conceptual understanding and numerical problem solving.', path: '/subjects/cbse-physics' },
        { name: 'Chemistry', icon: '🧪', desc: 'Master organic, inorganic, and physical chemistry with targeted notes.', path: '#' },
        { name: 'Biology', icon: '🧬', desc: 'Systematic study of diagrams, theory, and board-specific keywords.', path: '#' },
    ];

    return (
        <>
            <SEOHead
                title="CBSE Tutoring Dubai | 9th-12th Grade Board Exam Prep"
                description="Expert CBSE tutoring in Dubai for grades 9-12. Focused board exam preparation, NCERT mastery, and regular mock tests. Book your free consultation today!"
                canonicalPath="/cbse-tutoring"
            />

            {/* Hero */}
            <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1 mb-6 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md">
                            <span className="font-mono text-xs text-blue-300 tracking-widest uppercase">CBSE Board Specialists</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                            CBSE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">Mastery</span>
                        </h1>

                        <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                            {isSchool
                                ? <span className="text-white font-medium">Board Exams start Feb 15. Is your child prepared — or panicking?</span>
                                : "Professional-grade CBSE board preparation and academic strategy for high-performing students."
                            }
                            {isSchool && <span className="block mt-2 text-gray-400 text-sm md:text-base">We turn exam stress into 95%+ confidence with our targeted crash courses.</span>}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <ClayButton variant="primary" className="h-14 px-8 text-base bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                                {isSchool ? "Book Gap Assessment" : "Consult with an Expert"}
                            </ClayButton>
                        </div>
                    </div>
                </div>
            </header>

            {/* Subjects */}
            <section className="py-24 px-6 bg-black/50">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
                        CBSE <span className="text-blue-500">Subjects</span>
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {subjects.map((subject, i) => (
                            <Link key={i} to={subject.path} className="group">
                                <SpotlightCard className="h-full border-blue-500/20 group-hover:border-blue-500/50 transition-colors">
                                    <div className="text-4xl mb-4">{subject.icon}</div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{subject.name}</h3>
                                    <p className="text-gray-400 text-sm">{subject.desc}</p>
                                </SpotlightCard>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-16 max-w-3xl mx-auto">
                        <DemoOffer />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 bg-gradient-to-b from-blue-500/10 to-transparent">
                <div className="container mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">{isSchool ? "Ready to Ace Your Boards?" : "Optimize Board Performance"}</h2>
                    <p className="text-gray-400 mb-10">{isSchool ? "Book a free diagnostic session and get a personalized board exam roadmap." : "Schedule a professional consultation to secure your path to 95%+ results."}</p>
                    <ClayButton variant="primary" className="h-14 px-10 text-lg bg-blue-600 hover:bg-blue-700 font-bold" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                        {isSchool ? "Book Gap Assessment →" : "Consult with an Expert →"}
                    </ClayButton>
                </div>
            </section>
        </>
    );
};
