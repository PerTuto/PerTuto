import { useOutletContext, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SpotlightCard } from '../../components/SpotlightCard';
import { ClayButton } from '../../components/ClayButton';

interface LayoutContext {
    viewMode: 'school' | 'pro';
    isSchool: boolean;
}

export const IBMathPage = () => {
    const { isSchool } = useOutletContext<LayoutContext>();

    const modules = [
        { title: 'Calculus', icon: '📈', topics: ['Differentiation from First Principles', 'Maclaurin Series', 'Differential Equations', 'Kinematics'] },
        { title: 'Algebra & Functions', icon: '🔢', topics: ['Complex Numbers', 'Mathematical Induction', 'Polynomials', 'Logarithmic Functions'] },
        { title: 'Geometry & Trig', icon: '📐', topics: ['Vector Geometry', 'Trigonometric Identities', 'Circle Circular Functions', 'Arc Length'] },
        { title: 'Stats & Probability', icon: '📊', topics: ['Probability Distributions', 'Bayes Theorem', 'Hypothesis Testing', 'Correlation'] },
    ];

    return (
        <>
            <Helmet>
                <title>IB Math AA HL Tutoring Dubai | 7/7 Strategy & IA Support | PerTuto</title>
                <meta name="description" content="Master IB Mathematics Analysis & Approaches HL. Expert 1:1 tutoring in Dubai covering Calculus, Vectors, and Complex Numbers. 100% IA support included. Book a trial!" />
                <meta property="og:title" content="IB Math AA HL Tutoring Dubai | PerTuto" />
                <link rel="canonical" href="https://pertuto.com/subjects/ib-math-aa-hl" />
            </Helmet>

            {/* Hero */}
            <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#7C3AED]/10 to-transparent pointer-events-none" />
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#7C3AED]/30 bg-[#7C3AED]/10 backdrop-blur-md">
                                <span className="font-mono text-xs text-[#d8b4fe] tracking-widest uppercase text-shadow-sm">Subject Pillar: IB Math AA HL</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                                Secure Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#DB2777]">Math 7</span>
                            </h1>

                            <p className="text-xl text-gray-400 leading-relaxed">
                                {isSchool
                                    ? "Analysis & Approaches HL is the 'final boss' of the IB. We give you the cheat codes—from Calculus mastery to Euler's Identity."
                                    : "Advanced mathematical mentorship for professional educators and candidates targeting high-level quantitative mastery."
                                }
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <ClayButton variant="primary" className="h-14 px-8 text-base shadow-lg shadow-[#7C3AED]/20" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                                    Book Free Diagnostic
                                </ClayButton>
                                <Link to="/resources/grade-calculator">
                                    <ClayButton variant="secondary" className="h-14 px-8 text-base w-full sm:w-auto">
                                        Check Grade Boundaries
                                    </ClayButton>
                                </Link>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#7C3AED] to-[#DB2777] rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <SpotlightCard className="relative bg-black/40 backdrop-blur-xl border-[#7C3AED]/20 p-0 overflow-hidden aspect-square">
                                <img
                                    src="/assets/heroes/ib-math.png"
                                    alt="IB Math AA HL Visual"
                                    className="w-full h-full object-cover mix-blend-lighten opacity-80 group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-mono text-[#7C3AED] uppercase tracking-widest">Mastery Metric</span>
                                        <span className="text-[10px] text-green-500 font-bold uppercase">Topic: Complex Numbers</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-[#7C3AED] to-[#DB2777] w-[92%] animate-pulse"></div>
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
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">The AA HL <span className="text-[#7C3AED]">Roadmap</span></h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">We don't just teach the syllabus; we teach you how to think like an examiner.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {modules.map((module, i) => (
                            <SpotlightCard key={i} className="h-full">
                                <div className="flex gap-6">
                                    <div className="text-4xl">{module.icon}</div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-3">{module.title}</h3>
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {module.topics.map((topic, idx) => (
                                                <li key={idx} className="text-xs text-gray-400 flex items-center gap-2">
                                                    <span className="w-1 h-1 rounded-full bg-[#7C3AED]"></span>
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
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Mastery <span className="text-[#DB2777]">Resources</span></h2>
                        <p className="text-gray-400">Locked and loaded for your exam prep. Get exclusive mock solutions & cheat sheets.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: 'Calculus Cheat Sheet', desc: 'Every derivative and integral you need to know for Paper 1.', icon: '📜' },
                            { title: 'Paper 3 Case Study Pack', desc: 'Mock exploration questions designed by IB examiners.', icon: '📚' },
                            { title: 'IA Step-by-Step Guide', desc: 'From topic selection to scoring the elusive 20/20.', icon: '🎯' },
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
                                    Request Access
                                </ClayButton>
                            </SpotlightCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* IA Rescue */}
            <section className="py-24 px-6 bg-[#DB2777]/5 backdrop-blur-sm border-y border-[#DB2777]/10">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col items-center text-center">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">The Math IA <span className="text-[#DB2777]">Saviour</span></h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
                            Stuck on your exploration? Whether it's optimization, modelling, or complex stats, our tutors provide one-on-one guidance to turn your IA into a masterpiece.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <ClayButton variant="accent" className="h-14 px-10 text-lg shadow-lg shadow-[#DB2777]/20" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                                Book IA Review
                            </ClayButton>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
