import { useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SpotlightCard } from '../../components/SpotlightCard';
import { ClayButton } from '../../components/ClayButton';

interface LayoutContext {
    viewMode: 'school' | 'pro';
    isSchool: boolean;
}

export const ALevelPhysicsPage = () => {
    const { isSchool } = useOutletContext<LayoutContext>();

    const modules = [
        { title: 'Mechanics & Materials', icon: '⚙️', topics: ['Vectors & Scalars', 'Projectiles', 'Young\'s Modulus', 'Work, Energy & Power'] },
        { title: 'Electricity & Particles', icon: '⚡', topics: ['Current & Resistance', 'Quantum Phenomena', 'Particle Physics', 'DC Circuits'] },
        { title: 'Fields & Nuclear', icon: '⚛️', topics: ['Electric & Magnetic Fields', 'Gravitational Fields', 'Radioactive Decay', 'Capacitance'] },
        { title: 'Turning Points', icon: '🔭', topics: ['Special Relativity', 'Wave-Particle Duality', 'Cathode Rays', 'Electron Microscopy'] },
    ];

    return (
        <>
            <Helmet>
                <title>A-Level Physics Tutoring Dubai | Elite A* Prep Online & In-Person | PerTuto</title>
                <meta name="description" content="Prepare for A-Level Physics with expert tutors in Dubai. Specialized support for OCR, AQA, and Edexcel. Master Mechanics, Fields, and Quantum. Book your free trial!" />
                <link rel="canonical" href="https://pertuto.com/subjects/a-level-physics" />
            </Helmet>

            {/* Hero */}
            <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none" />
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md">
                                <span className="font-mono text-xs text-blue-300 tracking-widest uppercase">Subject Pillar: A-Level Physics</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                                The Physics of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Possibility</span>
                            </h1>

                            <p className="text-xl text-gray-400 leading-relaxed">
                                {isSchool
                                    ? "From Special Relativity to Quantum Mechanics, we turn abstract theories into intuitive mental models that win the A*."
                                    : "Advanced Physics support for A-Level students. Our tutors help bridge the gap between complex theory and practical application."
                                }
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <ClayButton variant="primary" className="h-14 px-8 text-base bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                                    Book Free Trial
                                </ClayButton>
                                <ClayButton variant="secondary" className="h-14 px-8 text-base w-full sm:w-auto" onClick={() => document.getElementById('resources')?.scrollIntoView({ behavior: 'smooth' })}>
                                    Formula Vault
                                </ClayButton>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <SpotlightCard className="relative bg-black/40 backdrop-blur-xl border-blue-500/20 p-0 overflow-hidden aspect-square">
                                <img
                                    src="/assets/heroes/a-level-physics.png"
                                    alt="A-Level Physics Visual"
                                    className="w-full h-full object-cover mix-blend-lighten opacity-80 group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Quantum State</span>
                                        <span className="text-[10px] text-green-500 font-bold uppercase">Topic: Fields</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-600 w-[90%] animate-pulse"></div>
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
                    <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 px-4">A-Level <span className="text-blue-500">Curriculum</span></h2>
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
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Physics <span className="text-blue-500">Mastery</span></h2>
                        <p className="text-gray-400">Elite resources designed to help you dominate the most challenging Physics papers.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: 'The Fields Masterclass', desc: 'Understanding Electric, Magnetic, and Gravitational fields through visualization.', icon: '⚛️' },
                            { title: 'Quantum Survival Guide', desc: 'Break down wave-particle duality and the Standard Model for full marks.', icon: '🔭' },
                            { title: 'A-Level Practical Pack', desc: 'Data analysis and uncertainty calculation templates for high-tier students.', icon: '🧪' },
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
