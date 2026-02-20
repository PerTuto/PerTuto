import { useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SpotlightCard } from '../components/SpotlightCard';
import { ClayButton } from '../components/ClayButton';
import { DemoOffer } from '../components/DemoOffer';
import { Briefcase, TrendingUp, Code, Database, Globe, Cpu } from 'lucide-react';

interface LayoutContext {
    viewMode: 'school' | 'pro';
    isSchool: boolean;
}

export const ExecutivePage = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    useOutletContext<LayoutContext>();

    const skills = [
        { name: 'System Design', icon: <Cpu />, desc: 'Architect scalable distributed systems. Crack the hardest interviews.' },
        { name: 'Data Science', icon: <Database />, desc: 'From SQL to RAG. Build production-grade data pipelines.' },
        { name: 'Full Stack', icon: <Code />, desc: 'React, Node, Next.js. Ship complete products from scratch.' },
        { name: 'Technical PM', icon: <Briefcase />, desc: 'Speak the language of engineers. Lead technical teams effectively.' },
    ];

    return (
        <>
            <Helmet>
                <title>Executive Tech Coaching Dubai | Coding & Data Science for Pros | PerTuto</title>
                <meta name="description" content="Accelerate your career with 1:1 technical mentorship. Learn System Design, Data Science, and Full Stack dev from senior engineers in Dubai." />
                <link rel="canonical" href="https://pertuto.com/executive" />
            </Helmet>

            {/* Hero */}
            <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1 mb-6 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md">
                            <span className="font-mono text-xs text-blue-300 tracking-widest uppercase">For Ambitious Professionals</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                            Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Acceleration</span>
                        </h1>

                        <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                            Stop watching tutorials. Start building. Get 1:1 mentorship from senior engineers at top tech companies.
                            <span className="block mt-2 text-gray-400 text-sm md:text-base">We don't teach "coding". We teach you how to ship software and clear senior interviews.</span>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <ClayButton variant="primary" className="h-14 px-8 text-base" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                                Book Skill Audit
                            </ClayButton>
                            <ClayButton variant="secondary" className="h-14 px-8 text-base" onClick={() => document.getElementById('tracks')?.scrollIntoView({ behavior: 'smooth' })}>
                                Explore Tracks
                            </ClayButton>
                        </div>
                    </div>
                </div>
            </header>

            {/* Tracks Grid */}
            <section id="tracks" className="py-24 px-6 bg-black/50">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
                        High-Impact <span className="text-blue-500">Skill Tracks</span>
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {skills.map((skill, i) => (
                            <SpotlightCard key={i} className="p-8 group hover:border-blue-500/30 transition-colors">
                                <div className="flex items-start gap-6">
                                    <div className="p-4 rounded-xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform duration-300">
                                        {skill.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">{skill.name}</h3>
                                        <p className="text-gray-400 leading-relaxed">{skill.desc}</p>
                                    </div>
                                </div>
                            </SpotlightCard>
                        ))}
                    </div>

                    <div className="mt-16 max-w-3xl mx-auto">
                        <DemoOffer />
                    </div>
                </div>
            </section>

            {/* Why Executive */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-8">
                                The <span className="text-blue-500">PerTuto</span> Advantage
                            </h2>
                            <ul className="space-y-8">
                                <li className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                                        <Globe size={16} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1 text-white">Real World Projects</h4>
                                        <p className="text-gray-400 text-sm">Build a production-grade portfolio. No to-do apps. We build search engines, load balancers, and analytics dashboards.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                                        <TrendingUp size={16} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1 text-white">Interview Prep</h4>
                                        <p className="text-gray-400 text-sm">Mock interviews with senior staff. Leetcode patterns, system design rounds, and behavioral coaching.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <SpotlightCard className="bg-gradient-to-br from-[#0f172a] to-black p-10 border-blue-500/20">
                            <div className="text-center">
                                <div className="text-6xl mb-6">💼</div>
                                <h3 className="text-3xl font-bold mb-4 text-white">ROI Focused</h3>
                                <p className="text-gray-400 mb-8">Our students have landed roles at Careem, Talabat, and major fintechs. The investment pays for itself in your first month's salary bump.</p>
                                <ClayButton variant="primary" className="w-full bg-blue-600 hover:bg-blue-500" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                                    Book Strategy Call
                                </ClayButton>
                            </div>
                        </SpotlightCard>
                    </div>
                </div>
            </section>
        </>
    );
};
