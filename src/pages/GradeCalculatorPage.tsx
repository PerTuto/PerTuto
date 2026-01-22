import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { SpotlightCard } from '../components/SpotlightCard';
import { ClayButton } from '../components/ClayButton';

export const GradeCalculatorPage = () => {
    const [subjects, setSubjects] = useState([
        { id: 1, name: 'Subject 1', level: 'HL', grade: 6 },
        { id: 2, name: 'Subject 2', level: 'HL', grade: 6 },
        { id: 3, name: 'Subject 3', level: 'HL', grade: 6 },
        { id: 4, name: 'Subject 4', level: 'SL', grade: 6 },
        { id: 5, name: 'Subject 5', level: 'SL', grade: 6 },
        { id: 6, name: 'Subject 6', level: 'SL', grade: 6 },
    ]);
    const [core, setCore] = useState(2); // TOK/EE points

    const total = subjects.reduce((acc, s) => acc + s.grade, 0) + core;

    const updateGrade = (id: number, val: number) => {
        setSubjects(subjects.map(s => s.id === id ? { ...s, grade: Math.max(1, Math.min(7, val)) } : s));
    };

    return (
        <>
            <Helmet>
                <title>IB Points Calculator | Predict Your IB Diploma Score | PerTuto</title>
                <meta name="description" content="Use our free IB Points Calculator to predict your IB Diploma score. Calculate your HL/SL grades and TOK/EE points. Plan your university path today!" />
                <link rel="canonical" href="https://pertuto.com/resources/grade-calculator" />
            </Helmet>

            <header className="relative pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl md:text-6xl font-black mb-6">IB Points <span className="text-[#DB2777]">Calculator</span></h1>
                    <p className="text-gray-400 text-lg">Predict your predicted grade and see if you hit your dream uni requirements.</p>
                </div>
            </header>

            <section className="pb-24 px-6">
                <div className="container mx-auto max-w-4xl grid lg:grid-cols-3 gap-8">
                    {/* Inputs */}
                    <div className="lg:col-span-2 space-y-4">
                        {subjects.map((s) => (
                            <div key={s.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                                <span className="font-bold">{s.name} ({s.level})</span>
                                <div className="flex items-center gap-4">
                                    <button onClick={() => updateGrade(s.id, s.grade - 1)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20">-</button>
                                    <span className="text-xl font-mono w-4 text-center">{s.grade}</span>
                                    <button onClick={() => updateGrade(s.id, s.grade + 1)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20">+</button>
                                </div>
                            </div>
                        ))}
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#DB2777]/5 border border-[#DB2777]/20">
                            <span className="font-bold text-[#DB2777]">TOK / EE / CAS Bonus</span>
                            <select
                                value={core}
                                onChange={(e) => setCore(parseInt(e.target.value))}
                                className="bg-black border border-white/20 rounded-lg p-1 text-sm outline-none"
                            >
                                <option value={0}>0 Points</option>
                                <option value={1}>1 Point</option>
                                <option value={2}>2 Points</option>
                                <option value={3}>3 Points</option>
                            </select>
                        </div>
                    </div>

                    {/* Results Card */}
                    <SpotlightCard className="h-fit sticky top-32 border-[#DB2777]/30">
                        <div className="text-center">
                            <span className="text-sm font-mono text-gray-400 uppercase tracking-widest">Total Predicted Score</span>
                            <div className="text-7xl font-black my-4 text-transparent bg-clip-text bg-gradient-to-r from-[#DB2777] to-[#7C3AED]">
                                {total}
                            </div>
                            <p className="text-sm text-gray-500 mb-8">
                                {total >= 40 ? "🚀 Ivy League / Oxbridge Tier" : total >= 35 ? "✨ Top Tier Russell Group" : "💪 Strong Foundation"}
                            </p>
                            <ClayButton variant="accent" className="w-full" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                                Get Free IA Review
                            </ClayButton>
                        </div>
                    </SpotlightCard>
                </div>
            </section>
        </>
    );
};
