import { useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SpotlightCard } from '../../components/SpotlightCard';
import { ClayButton } from '../../components/ClayButton';

interface LayoutContext {
    viewMode: 'school' | 'pro';
    isSchool: boolean;
}

export const IGCSEMathPage = () => {
    const { isSchool } = useOutletContext<LayoutContext>();

    const modules = [
        { title: 'Number & Algebra', icon: '🔢', topics: ['Quadratic Equations', 'Sequences', 'Indices & surds', 'Simplifying expressions'] },
        { title: 'Shape & Space', icon: '📐', topics: ['Trigonometry', 'Transformation Geometry', 'Mensuration', 'Circle Theorems'] },
        { title: 'Probability & Stats', icon: '📊', topics: ['Compound Probability', 'Histogram Analysis', 'Mean, Median, Mode', 'Conditional Probability'] },
        { title: 'Calculus (Add Math)', icon: '📈', topics: ['Basic Differentiation', 'Basic Integration', 'Kinematics', 'Rate of Change'] },
    ];

    return (
        <>
            <Helmet>
                <title>IGCSE Mathematics Tutoring Dubai | Extended & Add Math Help | PerTuto</title>
                <meta name="description" content="Master IGCSE Mathematics Extended & Additional Math. Expert 1:1 tutoring in Dubai focusing on past papers and exam technique. Book your free trial session." />
                <meta property="og:title" content="IGCSE Math Tutoring Dubai | PerTuto" />
                <link rel="canonical" href="https://pertuto.com/subjects/igcse-math" />
            </Helmet>

            {/* Hero */}
            <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-green-500/30 bg-green-500/10 backdrop-blur-md">
                                <span className="font-mono text-xs text-green-300 tracking-widest uppercase">Subject Pillar: IGCSE Mathematics</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                                Build a Strong <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Foundation</span>
                            </h1>

                            <p className="text-xl text-gray-400 leading-relaxed">
                                {isSchool
                                    ? "IGCSE Math is the launchpad for your future. We make sure you don't just pass, but hit that A* with confidence and zero stress."
                                    : "The transition to higher mathematics begins here. Our tutors specialize in simplifying complex IGCSE concepts for maximum retention."
                                }
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <ClayButton variant="primary" className="h-14 px-8 text-base bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                                    Book Free Trial
                                </ClayButton>
                                <ClayButton variant="secondary" className="h-14 px-8 text-base w-full sm:w-auto" onClick={() => document.getElementById('resources')?.scrollIntoView({ behavior: 'smooth' })}>
                                    Free Cheat Sheets
                                </ClayButton>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <SpotlightCard className="relative bg-black/40 backdrop-blur-xl border-emerald-500/20 p-0 overflow-hidden aspect-square">
                                <img
                                    src="/assets/heroes/igcse-math.png"
                                    alt="IGCSE Math Visual"
                                    className="w-full h-full object-cover mix-blend-lighten opacity-80 group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Foundation Master</span>
                                        <span className="text-[10px] text-green-500 font-bold uppercase">Topic: Geometry</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-600 w-[95%] animate-pulse"></div>
                                    </div>
                                </div>
                            </SpotlightCard>
                        </div>
                    </div>
                </div>
            </header>

            {/* Modules Grid */}
            <section className="py-24 px-6 bg-black/50 backdrop-blur-sm">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 px-4">IGCSE <span className="text-emerald-500">Curriculum</span></h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {modules.map((module, i) => (
                            <SpotlightCard key={i} className="h-full border-emerald-500/10 hover:border-emerald-500/30 transition-colors">
                                <div className="text-4xl mb-4">{module.icon}</div>
                                <h3 className="text-xl font-bold mb-3 text-emerald-400">{module.title}</h3>
                                <ul className="space-y-4">
                                    {module.topics.map((topic, idx) => (
                                        <li key={idx} className="text-xs text-gray-400 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
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
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Mastery <span className="text-emerald-500">Kits</span></h2>
                        <p className="text-gray-400">Everything you need to secure that A* in your IGCSE exams.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: 'Algebra Cheat Sheet', desc: 'Factorization, expansion, and quadratic formulas explained simply.', icon: '📐' },
                            { title: 'Circle Theorems Poster', desc: 'A visual summary of all 8 theorems and how to spot them in exams.', icon: '⭕' },
                            { title: 'Past Paper Trap-Map', desc: 'Identify the common tricks used in Extended Paper 2 & 4.', icon: '🗺️' },
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
                                    Get Resource
                                </ClayButton>
                            </SpotlightCard>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};
