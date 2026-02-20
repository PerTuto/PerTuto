import { useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SpotlightCard } from '../../components/SpotlightCard';
import { ClayButton } from '../../components/ClayButton';

interface LayoutContext {
    viewMode: 'school' | 'pro';
    isSchool: boolean;
}

export const CBSEMathPage = () => {
    const { isSchool } = useOutletContext<LayoutContext>();

    const modules = [
        { title: 'Calculus', icon: '📈', topics: ['Continuity & Differentiability', 'Integrals', 'Differential Equations', 'Applications of Derivatives'] },
        { title: 'Calculus & Vectors', icon: '📐', topics: ['Vectors Algebra', 'Three Dimensional Geometry', 'Linear Programming', 'Inverse Trig'] },
        { title: 'Algebra', icon: '🔢', topics: ['Matrices', 'Determinants', 'Complex Numbers (Class 11)', 'Binomial Theorem'] },
        { title: 'Probability', icon: '📊', topics: ['Conditional Probability', 'Baye\'s Theorem', 'Independent Events', 'Bernoulli Trials'] },
    ];

    return (
        <>
            <Helmet>
                <title>CBSE Math Tutoring Dubai | Class 10th-12th Board Exam Strategy | PerTuto</title>
                <meta name="description" content="Expert CBSE Mathematics tutoring in Dubai for Grade 12 Boards. Focused on NCERT mastery, Previous Year Papers (PYQs), and scoring 100/100. Book a trial!" />
                <link rel="canonical" href="https://pertuto.com/subjects/cbse-math" />
            </Helmet>

            {/* Hero */}
            <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none" />
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center text-left">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md">
                                <span className="font-mono text-xs text-blue-300 tracking-widest uppercase">Subject Pillar: CBSE Mathematics</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                                Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Boards</span>
                            </h1>

                            <p className="text-xl text-gray-400 leading-relaxed">
                                {isSchool
                                    ? "Board exams are about strategy as much as math. We help you master NCERT solutions and time management for a perfect 100."
                                    : "Dedicated CBSE support focusing on the Class 12 board curriculum. Expert guidance on scoring high through structured practice."
                                }
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <ClayButton variant="primary" className="h-14 px-8 text-base bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                                    Get Free Trial
                                </ClayButton>
                                <ClayButton variant="secondary" className="h-14 px-8 text-base w-full sm:w-auto" onClick={() => document.getElementById('resources')?.scrollIntoView({ behavior: 'smooth' })}>
                                    NCERT Solutions
                                </ClayButton>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <SpotlightCard className="relative bg-black/40 backdrop-blur-xl border-blue-500/20 p-0 overflow-hidden aspect-square">
                                <img
                                    src="/assets/heroes/cbse-math.png"
                                    alt="CBSE Math Visual"
                                    className="w-full h-full object-cover mix-blend-lighten opacity-80 group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Board Prep Tracker</span>
                                        <span className="text-[10px] text-green-500 font-bold uppercase">Topic: Calculus</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-600 w-[91%] animate-pulse"></div>
                                    </div>
                                </div>
                            </SpotlightCard>
                        </div>
                    </div>
                </div>
            </header>

            {/* Grid */}
            <section className="py-24 px-6 bg-black/50 backdrop-blur-sm">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 px-4">Board Exam <span className="text-blue-500">Focus</span></h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {modules.map((module, i) => (
                            <SpotlightCard key={i} className="h-full border-blue-500/10 hover:border-blue-500/30 transition-colors">
                                <div className="text-4xl mb-4">{module.icon}</div>
                                <h3 className="text-xl font-bold mb-3 text-blue-400">{module.title}</h3>
                                <ul className="space-y-4">
                                    {module.topics.map((topic, idx) => (
                                        <li key={idx} className="text-xs text-gray-400 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                            {topic}
                                        </li>
                                    ))}
                                </ul>
                            </SpotlightCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Resources Section (Lead Magnet) */}
            <section id="resources" className="py-24 px-6 relative overflow-hidden">
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Board topper <span className="text-blue-500">Toolkit</span></h2>
                        <p className="text-gray-400">Everything you need to score a perfect 100/100 in your board exams.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: 'NCERT Exemplar Solutions', desc: 'Step-by-step walkthrough of the most challenging problems.', icon: '📐' },
                            { title: '10-Year PYQ Analysis', desc: 'Weightage-based priority list for your final revision month.', icon: '📊' },
                            { title: 'Formula Mind-Map', desc: 'A single visual sheet covering every formula from Class 12 Math.', icon: '🧠' },
                        ].map((resource, i) => (
                            <SpotlightCard key={i} className="text-center p-8 group">
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{resource.icon}</div>
                                <h3 className="text-lg font-bold mb-2">{resource.title}</h3>
                                <p className="text-sm text-gray-500 mb-6">{resource.desc}</p>
                                <ClayButton
                                    variant="secondary"
                                    className="w-full text-xs"
                                    onClick={() => {
                                        const contactForm = document.getElementById('contact');
                                        if (contactForm) {
                                            contactForm.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }}
                                >
                                    Access Resources
                                </ClayButton>
                            </SpotlightCard>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};
