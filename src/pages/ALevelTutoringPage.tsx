import { useOutletContext, Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { SpotlightCard } from '../components/SpotlightCard';
import { ClayButton } from '../components/ClayButton';
import { DemoOffer } from '../components/DemoOffer';

interface LayoutContext {
    viewMode: 'school' | 'pro';
    isSchool: boolean;
}

export const ALevelTutoringPage = () => {
    const { isSchool } = useOutletContext<LayoutContext>();

    const subjects = [
        { name: 'Mathematics', icon: '📐', desc: 'Pure Math, Statistics, and Mechanics support. Master the A* criteria.', path: '/subjects/a-level-math' },
        { name: 'Further Mathematics', icon: '♾️', desc: 'Advanced concepts for students targeting top-tier STEM universities.', path: '#' },
        { name: 'Physics', icon: '⚛️', desc: 'Conceptual depth and exam-focused practical understanding.', path: '/subjects/a-level-physics' },
        { name: 'Chemistry', icon: '🧪', desc: 'Organic mechanisms, physical chemistry, and inorganic trends.', path: '#' },
    ];

    return (
        <>
            <SEOHead
                title="A-Level Tutoring Dubai | Elite A* Result Driven Tutors"
                description="Elite A-Level tutoring in Dubai for Math, Science, and more. Tutors from Oxford, Cambridge, and Ivy League. Predicted grade support. Book your free trial!"
                canonicalPath="/a-level-tutoring"
            />

            {/* Hero */}
            <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1 mb-6 rounded-full border border-orange-500/30 bg-orange-500/10 backdrop-blur-md">
                            <span className="font-mono text-xs text-orange-300 tracking-widest uppercase">A-Level Specialists</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                            A-Level <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Excellence</span>
                        </h1>

                        <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                            {isSchool
                                ? <span className="text-white font-medium">Teachers who know how marks are earned.</span>
                                : "University offers depend on predicted grades. Don't risk a rejection letter. Get the examiner-level support your child needs to secure an A*."
                            }
                            {isSchool && <span className="block mt-2 text-gray-400 text-sm md:text-base">A-Levels are the hardest exams you'll ever take. If you're not efficiently revising by now, you're already behind.</span>}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <ClayButton variant="primary" className="h-14 px-8 text-base bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-500/20" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
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
                        A-Level <span className="text-orange-500">Subjects</span>
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {subjects.map((subject, i) => (
                            <Link key={i} to={subject.path} className="group">
                                <SpotlightCard className="h-full border-orange-500/20 group-hover:border-orange-500/50 transition-colors">
                                    <div className="text-4xl mb-4">{subject.icon}</div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-orange-400 transition-colors">{subject.name}</h3>
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
            <section className="py-24 px-6 bg-gradient-to-b from-orange-500/10 to-transparent">
                <div className="container mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">{isSchool ? "Ready for the A* Jump?" : "Optimize Your Academic Results"}</h2>
                    <p className="text-gray-400 mb-10">{isSchool ? "Book a free diagnostic session and build your university entry roadmap." : "Schedule a professional consultation to secure your placement at a top-tier institution."}</p>
                    <ClayButton variant="primary" className="h-14 px-10 text-lg bg-orange-600 hover:bg-orange-700" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                        {isSchool ? "Book Gap Assessment →" : "Consult with an Expert →"}
                    </ClayButton>
                </div>
            </section>
        </>
    );
};
