import { useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SpotlightCard } from '../../components/SpotlightCard';
import { ClayButton } from '../../components/ClayButton';

interface LayoutContext {
    viewMode: 'school' | 'pro';
    isSchool: boolean;
}

export const ALevelMathPage = () => {
    const { isSchool } = useOutletContext<LayoutContext>();

    const modules = [
        { title: 'Pure Mathematics', icon: '📐', topics: ['Calculus (Differentiation & Integration)', 'Trigonometric Identities', 'Coordinate Geometry', 'Logarithms & Exponentials'] },
        { title: 'Mechanics', icon: '⚙️', topics: ['Kinematics', 'Forces & Newton\'s Laws', 'Moments', 'Projectiles'] },
        { title: 'Statistics', icon: '📊', topics: ['Probability Distributions', 'Hypothesis Testing', 'Data Representation', 'Correlation & Regression'] },
        { title: 'Further Math (Optional)', icon: '♾️', topics: ['Complex Numbers', 'Matrices', 'Differential Equations', 'Hyperbolic Functions'] },
    ];

    return (
        <>
            <Helmet>
                <title>A-Level Math Tutoring Dubai | Pure, Mechanics & Stats Support | PerTuto</title>
                <meta name="description" content="Elite A-Level Mathematics tutoring in Dubai. Covering Pure Math, Mechanics, and Statistics for Edexcel, AQA, and OCR. Master the A* criteria today!" />
                <link rel="canonical" href="https://pertuto.com/subjects/a-level-math" />
            </Helmet>

            {/* Hero */}
            <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-500/10 to-transparent pointer-events-none" />
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8 text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 backdrop-blur-md">
                                <span className="font-mono text-xs text-orange-300 tracking-widest uppercase text-shadow-sm">Subject Pillar: A-Level Mathematics</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                                Secure Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">A* Excellence</span>
                            </h1>

                            <p className="text-xl text-gray-400 leading-relaxed">
                                {isSchool
                                    ? "The jump from GCSE to A-Level is notorious. We don't just teach you the formulas; we teach you how to dominate the mark scheme."
                                    : "Professional-grade A-Level Mathematics mentorship for candidates targeting top-tier STEM university entries."
                                }
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <ClayButton variant="primary" className="h-14 px-8 text-base bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-500/20" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                                    Book Free Trial
                                </ClayButton>
                                <ClayButton variant="secondary" className="h-14 px-8 text-base w-full sm:w-auto" onClick={() => document.getElementById('resources')?.scrollIntoView({ behavior: 'smooth' })}>
                                    Download Formula Sheet
                                </ClayButton>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-red-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <SpotlightCard className="relative bg-black/40 backdrop-blur-xl border-orange-500/20 p-0 overflow-hidden aspect-square">
                                <img
                                    src="/assets/heroes/a-level-math.png"
                                    alt="A-Level Math Visual"
                                    className="w-full h-full object-cover mix-blend-lighten opacity-80 group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest">A* Trajectory</span>
                                        <span className="text-[10px] text-green-500 font-bold uppercase">Topic: Differentiation</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-orange-400 to-red-600 w-[88%] animate-pulse"></div>
                                    </div>
                                </div>
                            </SpotlightCard>
                        </div>
                    </div>
                </div>
            </header>

            {/* Modules */}
            <section className="py-24 px-6 bg-black/50 backdrop-blur-sm">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 px-4">The A* <span className="text-orange-500">Curriculum</span></h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {modules.map((module, i) => (
                            <SpotlightCard key={i} className="h-full border-orange-500/10 hover:border-orange-500/30 transition-colors">
                                <div className="text-4xl mb-4">{module.icon}</div>
                                <h3 className="text-xl font-bold mb-3 text-orange-400">{module.title}</h3>
                                <ul className="space-y-4">
                                    {module.topics.map((topic, idx) => (
                                        <li key={idx} className="text-xs text-gray-400 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
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
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Mastery <span className="text-orange-500">Vault</span></h2>
                        <p className="text-gray-400">Master the hardest A-Level questions with our specialized resource packs.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: 'The Integration Bible', desc: 'Substitution, Parts, and Partial Fractions—every technique mastered.', icon: '📐' },
                            { title: 'Mechanics Cheat Sheet', desc: 'Forces, Pulley systems, and Projectiles simplified for Paper 3.', icon: '⚙️' },
                            { title: 'A* Exam Strategy Guide', desc: 'How to manage your time and master the "explain" questions.', icon: '🎯' },
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
                                    Get Vault Access
                                </ClayButton>
                            </SpotlightCard>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};
