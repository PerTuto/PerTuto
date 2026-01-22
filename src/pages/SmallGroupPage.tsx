import { useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SpotlightCard } from '../components/SpotlightCard';
import { ClayButton } from '../components/ClayButton';
import { DemoOffer } from '../components/DemoOffer';
import { Users, Sparkles, TrendingUp, PiggyBank } from 'lucide-react';

interface LayoutContext {
    viewMode: 'school' | 'pro';
    isSchool: boolean;
}

export const SmallGroupPage = () => {
    const { isSchool } = useOutletContext<LayoutContext>();

    return (
        <>
            <Helmet>
                <title>Small Group Tutoring Dubai | Affordable Expert Tuition | PerTuto</title>
                <meta name="description" content="Join our small group tutoring sessions (max 4 students). Expert IGCSE, IB & A-Level tuition at 40% less cost. Collaborative learning aimed at top grades." />
                <link rel="canonical" href="https://pertuto.com/services/small-group" />
            </Helmet>

            {/* Hero */}
            <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1 mb-6 rounded-full border border-[#DB2777]/30 bg-[#DB2777]/10 backdrop-blur-md">
                            <span className="font-mono text-xs text-[#f9a8d4] tracking-widest uppercase">Limited Intake: Max 4 Students</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                            Small Group <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DB2777] to-[#7C3AED]">Power Sessions</span>
                        </h1>

                        <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                            {isSchool
                                ? <span className="text-white font-medium">Expert tuition at 40% less cost. Collaborative learning that actually works.</span>
                                : "Professional masterminds for rapid skill acquisition. Learn faster with peer accountability."
                            }
                            <span className="block mt-2 text-gray-400 text-sm md:text-base">Get the same elite tutors, the same resources, but with the added boost of peer motivation.</span>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <ClayButton variant="primary" className="h-14 px-8 text-base" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                                Join a Group
                            </ClayButton>
                            <ClayButton variant="secondary" className="h-14 px-8 text-base" onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}>
                                How it Works
                            </ClayButton>
                        </div>
                    </div>
                </div>
            </header>

            {/* Benefits Grid */}
            <section id="benefits" className="py-24 px-6 bg-black/50">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
                        Why Choose <span className="text-[#DB2777]">Small Group</span>?
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <SpotlightCard className="p-8">
                            <div className="flex items-start gap-6">
                                <div className="p-4 rounded-xl bg-[#DB2777]/10 text-[#DB2777]">
                                    <PiggyBank size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">40% Cost Savings</h3>
                                    <p className="text-gray-400 leading-relaxed">Get elite-level tuition for a fraction of the 1:1 price. Perfect for long-term support throughout the academic year.</p>
                                </div>
                            </div>
                        </SpotlightCard>

                        <SpotlightCard className="p-8">
                            <div className="flex items-start gap-6">
                                <div className="p-4 rounded-xl bg-[#7C3AED]/10 text-[#7C3AED]">
                                    <Users size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Peer Motivation</h3>
                                    <p className="text-gray-400 leading-relaxed">Learning with others creates healthy competition and accountability. Students push each other to do better.</p>
                                </div>
                            </div>
                        </SpotlightCard>

                        <SpotlightCard className="p-8">
                            <div className="flex items-start gap-6">
                                <div className="p-4 rounded-xl bg-blue-500/10 text-blue-500">
                                    <Sparkles size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Diverse Perspectives</h3>
                                    <p className="text-gray-400 leading-relaxed">Someone else's question might be the one you didn't know you needed to ask. Learn from the group's curiosity.</p>
                                </div>
                            </div>
                        </SpotlightCard>

                        <SpotlightCard className="p-8">
                            <div className="flex items-start gap-6">
                                <div className="p-4 rounded-xl bg-green-500/10 text-green-500">
                                    <TrendingUp size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Structured Progression</h3>
                                    <p className="text-gray-400 leading-relaxed">Groups follow a strict syllabus schedule, ensuring you cover every topic before exams with no delays.</p>
                                </div>
                            </div>
                        </SpotlightCard>
                    </div>

                    <div className="mt-16 max-w-3xl mx-auto">
                        <DemoOffer />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 bg-gradient-to-b from-[#DB2777]/10 to-transparent">
                <div className="container mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Form Your Own Squad?</h2>
                    <p className="text-gray-400 mb-10">Bring 2 or more friends and we'll create a custom bespoke group just for you at our discounted rate.</p>
                    <ClayButton variant="primary" className="h-14 px-10 text-lg" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                        Start a Custom Group →
                    </ClayButton>
                </div>
            </section>
        </>
    );
};
