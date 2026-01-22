import { useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SpotlightCard } from '../../components/SpotlightCard';
import { ClayButton } from '../../components/ClayButton';

interface LayoutContext {
    viewMode: 'school' | 'pro';
    isSchool: boolean;
}

export const IBPhysicsPage = () => {
    const { isSchool } = useOutletContext<LayoutContext>();

    const modules = [
        { title: 'Mechanics & Energy', icon: '⚙️', topics: ['Rotational Dynamics', 'Work, Energy & Power', 'Friction & Forces', 'Circular Motion'] },
        { title: 'Fields & Waves', icon: '〰️', topics: ['Gravitational Fields', 'Electric Fields', 'Simple Harmonic Motion', 'Wave Phenomena'] },
        { title: 'Nuclear & Quantum', icon: '⚛️', topics: ['Standard Model', 'Radioactive Decay', 'Photoelectric Effect', 'Emission Spectra'] },
        { title: 'Optional Topics', icon: '🔭', topics: ['Relativity', 'Engineering Physics', 'Imaging', 'Astrophysics'] },
    ];

    return (
        <>
            <Helmet>
                <title>IB Physics HL Tutoring Dubai | 7/7 Concept Mastery | PerTuto</title>
                <meta name="description" content="Dominate IB Physics HL. Expert 1:1 tutoring in Dubai covering Quantum, Relativity, and Mechanics. Detailed IA feedback and exam strategy for students." />
                <meta property="og:title" content="IB Physics HL Tutoring Dubai | PerTuto" />
                <link rel="canonical" href="https://pertuto.com/subjects/ib-physics-hl" />
            </Helmet>

            {/* Hero */}
            <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none" />
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md">
                                <span className="font-mono text-xs text-blue-300 tracking-widest uppercase">Subject Pillar: IB Physics HL</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                                Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">Universe</span>
                            </h1>

                            <p className="text-xl text-gray-400 leading-relaxed">
                                {isSchool
                                    ? "Paper 1 is a trap. We teach you how to spot the examiner's tricks and master the hardest Mechanics and Quantum concepts."
                                    : "Physics HL requires deep conceptual intuition. Our tutors bridge the gap between abstract theory and practical problem-solving."
                                }
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <ClayButton variant="primary" className="h-14 px-8 text-base bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                                    Book Free Diagnostic
                                </ClayButton>
                                <ClayButton variant="secondary" className="h-14 px-8 text-base w-full sm:w-auto" onClick={() => document.getElementById('resources')?.scrollIntoView({ behavior: 'smooth' })}>
                                    View Formula Sheets
                                </ClayButton>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <SpotlightCard className="relative bg-black/40 backdrop-blur-xl border-blue-500/20 p-0 overflow-hidden aspect-square">
                                <img
                                    src="/assets/heroes/ib-physics.png"
                                    alt="IB Physics HL Visual"
                                    className="w-full h-full object-cover mix-blend-lighten opacity-80 group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Quantum Simulation</span>
                                        <span className="text-[10px] text-green-500 font-bold uppercase">Topic: Particle Physics</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 w-[85%] animate-pulse"></div>
                                    </div>
                                </div>
                            </SpotlightCard>
                        </div>
                    </div>
                </div>
            </header>

            {/* Roadmap */}
            <section className="py-24 px-6 bg-black/50 backdrop-blur-sm">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Physics <span className="text-blue-500">Curriculum</span></h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">From core mechanics to higher-level options, we cover it all.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {modules.map((module, i) => (
                            <SpotlightCard key={i} className="h-full border-blue-500/10 hover:border-blue-500/30 transition-colors">
                                <div className="flex gap-6">
                                    <div className="text-4xl">{module.icon}</div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-3 text-blue-400">{module.title}</h3>
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {module.topics.map((topic, idx) => (
                                                <li key={idx} className="text-xs text-gray-400 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                    {topic}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </SpotlightCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Resources Section (Lead Magnet) */}
            <section id="resources" className="py-24 px-6 relative overflow-hidden">
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Physics <span className="text-blue-500">Vault</span></h2>
                        <p className="text-gray-400">Master the equations and the theory with our exclusive study packs.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: 'The Equation Bible', desc: 'Detailed breakdown of every variable and constant in the data booklet.', icon: '📖' },
                            { title: 'Paper 1 Mastery Guide', desc: 'Over 100 multiple-choice tricks that examiners always use.', icon: '🎯' },
                            { title: 'Physics IA Toolkit', desc: 'Sample reports and uncertainty calculation templates.', icon: '🧪' },
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
                                    Get Study Pack
                                </ClayButton>
                            </SpotlightCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 bg-blue-500/5 backdrop-blur-sm border-y border-blue-500/10">
                <div className="container mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to <span className="text-blue-500">Level Up</span>?</h2>
                    <p className="text-gray-400 mb-10 text-lg">Book your diagnostic and get a personalized physics study plan today.</p>
                    <ClayButton variant="primary" className="h-16 px-12 text-xl bg-blue-600 hover:bg-blue-700" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                        Book Trial Session →
                    </ClayButton>
                </div>
            </section>
        </>
    );
};
