import { useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SpotlightCard } from '../../components/SpotlightCard';
import { ClayButton } from '../../components/ClayButton';

interface LayoutContext {
    viewMode: 'school' | 'pro';
    isSchool: boolean;
}

export const IBChemistryPage = () => {
    const { isSchool } = useOutletContext<LayoutContext>();

    const modules = [
        { title: 'Stoichiometry & Bonding', icon: '🧪', topics: ['The Mole Concept', 'VSEPR Theory', 'Hybridization', 'Lattice Enthalpies'] },
        { title: 'Physical Chemistry', icon: '🔋', topics: ['Thermodynamics (Born-Haber)', 'Kinetics (Arrhenius)', 'Equilibrium (Kc/Kp)', 'Redox & Electrochemistry'] },
        { title: 'Organic Chemistry', icon: '🧬', topics: ['Reaction Mechanisms (Sn1/Sn2)', 'NMR/IR Spectroscopy', 'Stereoisomerism', 'Synthetic Routes'] },
        { title: 'Optional Topics', icon: '🔬', topics: ['Medicinal Chemistry', 'Biochemistry', 'Materials', 'Energy'] },
    ];

    return (
        <>
            <Helmet>
                <title>IB Chemistry HL Tutoring Dubai | Reactivity & Spectroscopy Mastery | PerTuto</title>
                <meta name="description" content="Master IB Chemistry HL. Expert 1:1 tutoring in Dubai covering Organic Mechanisms, Kinetics, and Thermodynamics. 100% IA guidance included. Book your free session!" />
                <link rel="canonical" href="https://pertuto.com/subjects/ib-chemistry-hl" />
            </Helmet>

            {/* Hero */}
            <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-pink-500/10 to-transparent pointer-events-none" />
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-pink-500/30 bg-pink-500/10 backdrop-blur-md">
                                <span className="font-mono text-xs text-pink-300 tracking-widest uppercase">Subject Pillar: IB Chemistry HL</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                                Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600">Molecular World</span>
                            </h1>

                            <p className="text-xl text-gray-400 leading-relaxed">
                                {isSchool
                                    ? "Sn1 or Sn2? Carbocations or Transition States? We make the hardest Organic and Physical Chemistry concepts feel like second nature."
                                    : "Chemistry HL is one of the most demanding IB subjects. Our tutors focus on conceptual clarity and rigorous exam prep for a 7/7 result."
                                }
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <ClayButton variant="accent" className="h-14 px-8 text-base shadow-lg shadow-pink-500/20" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                                    Book Free Diagnostic
                                </ClayButton>
                                <ClayButton variant="secondary" className="h-14 px-8 text-base w-full sm:w-auto" onClick={() => document.getElementById('resources')?.scrollIntoView({ behavior: 'smooth' })}>
                                    View Study Resources
                                </ClayButton>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-rose-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <SpotlightCard className="relative bg-black/40 backdrop-blur-xl border-pink-500/20 p-0 overflow-hidden aspect-square">
                                <img
                                    src="/assets/heroes/ib-chemistry.png"
                                    alt="IB Chemistry HL Visual"
                                    className="w-full h-full object-cover mix-blend-lighten opacity-80 group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-mono text-pink-400 uppercase tracking-widest">Reaction Mapping</span>
                                        <span className="text-[10px] text-green-500 font-bold uppercase">Topic: Organic Mechanisms</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-pink-500 to-rose-600 w-[78%] animate-pulse"></div>
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
                    <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 px-4">The Chemistry <span className="text-pink-500">Curriculum</span></h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {modules.map((module, i) => (
                            <SpotlightCard key={i} className="h-full border-pink-500/10 hover:border-pink-500/30 transition-colors">
                                <div className="flex gap-6">
                                    <div className="text-4xl">{module.icon}</div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-3 text-pink-400">{module.title}</h3>
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {module.topics.map((topic, idx) => (
                                                <li key={idx} className="text-xs text-gray-400 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
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
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Chemistry <span className="text-pink-500">Lab Notes</span></h2>
                        <p className="text-gray-400">Essential reaction pathways and thermodynamics summaries for the final push.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: 'Organic Pathway Map', desc: 'Every Sn1, Sn2, and elimination reaction on a single A3 sheet.', icon: '🧪' },
                            { title: 'Born-Haber Simplified', desc: 'No-nonsense guide to perfect thermodynamics energy cycles.', icon: '📉' },
                            { title: 'The Chemistry IA Bible', desc: '20+ high-scoring IA ideas with methodology assistance.', icon: '🧬' },
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
                                    Download Notes
                                </ClayButton>
                            </SpotlightCard>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};
