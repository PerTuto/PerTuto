import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { SpotlightCard } from '../components/SpotlightCard';
import { ClayButton } from '../components/ClayButton';
import { clsx } from 'clsx';
import { Trash2, Plus } from 'lucide-react';

type Mode = 'ib' | 'igcse';

interface IBSubject {
    id: number;
    name: string;
    level: 'HL' | 'SL';
    grade: number;
}

interface IGCSESubject {
    id: number;
    name: string;
    percentage: number;
}

const DEFAULT_IB_SUBJECTS: IBSubject[] = [
    { id: 1, name: 'Maths AA', level: 'HL', grade: 6 },
    { id: 2, name: 'Physics', level: 'HL', grade: 6 },
    { id: 3, name: 'Economics', level: 'HL', grade: 6 },
    { id: 4, name: 'English A', level: 'SL', grade: 6 },
    { id: 5, name: 'Chemistry', level: 'SL', grade: 5 },
    { id: 6, name: 'French B', level: 'SL', grade: 5 },
];

const DEFAULT_IGCSE_SUBJECTS: IGCSESubject[] = [
    { id: 1, name: 'Maths', percentage: 85 },
    { id: 2, name: 'Physics', percentage: 78 },
    { id: 3, name: 'Chemistry', percentage: 92 },
    { id: 4, name: 'English Lang', percentage: 70 },
    { id: 5, name: 'Computer Science', percentage: 88 },
];

export const GradeCalculatorPage = () => {
    const [mode, setMode] = useState<Mode>('ib');

    // IB State
    const [ibSubjects, setIbSubjects] = useState<IBSubject[]>(DEFAULT_IB_SUBJECTS);
    const [corePoints, setCorePoints] = useState(2);

    // IGCSE State
    const [igcseSubjects, setIgcseSubjects] = useState<IGCSESubject[]>(DEFAULT_IGCSE_SUBJECTS);

    // --- IB Logic ---
    const updateIBGrade = (id: number, delta: number) => {
        setIbSubjects(curr => curr.map(s => {
            if (s.id !== id) return s;
            const newGrade = Math.min(7, Math.max(1, s.grade + delta));
            return { ...s, grade: newGrade };
        }));
    };

    const toggleLevel = (id: number) => {
        setIbSubjects(curr => curr.map(s =>
            s.id === id ? { ...s, level: s.level === 'HL' ? 'SL' : 'HL' } : s
        ));
    };

    const ibTotal = ibSubjects.reduce((acc, s) => acc + s.grade, 0) + corePoints;

    // --- IGCSE Logic ---
    const getIGCSEGrade = (percentage: number) => {
        if (percentage >= 90) return '9';
        if (percentage >= 80) return '8';
        if (percentage >= 70) return '7';
        if (percentage >= 60) return '6';
        if (percentage >= 50) return '5';
        if (percentage >= 40) return '4';
        if (percentage >= 30) return '3';
        if (percentage >= 20) return '2';
        return '1';
    };

    const updateIGCSEPercentage = (id: number, val: number) => {
        setIgcseSubjects(curr => curr.map(s =>
            s.id === id ? { ...s, percentage: Math.min(100, Math.max(0, val)) } : s
        ));
    };

    const igcseAverage = igcseSubjects.length > 0
        ? Math.round(igcseSubjects.reduce((acc, s) => acc + s.percentage, 0) / igcseSubjects.length)
        : 0;

    const addNewSubject = () => {
        if (mode === 'ib') {
            setIbSubjects([...ibSubjects, {
                id: Date.now(),
                name: 'New Subject',
                level: 'SL',
                grade: 5
            }]);
        } else {
            setIgcseSubjects([...igcseSubjects, {
                id: Date.now(),
                name: 'New Subject',
                percentage: 75
            }]);
        }
    };

    const removeSubject = (id: number) => {
        if (mode === 'ib') {
            setIbSubjects(ibSubjects.filter(s => s.id !== id));
        } else {
            setIgcseSubjects(igcseSubjects.filter(s => s.id !== id));
        }
    };

    return (
        <>
            <Helmet>
                <title>Grade Calculator | IB Points & IGCSE Grades | PerTuto Dubai</title>
                <meta name="description" content="Calculate your IB Diploma points or estimate IGCSE grades with our free tools. Tailored for Dubai students." />
                <link rel="canonical" href="https://pertuto.com/resources/grade-calculator" />
            </Helmet>

            <header className="relative pt-32 pb-12 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1 mb-6 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                        <span className="font-mono text-xs text-[#7C3AED] tracking-widest uppercase">Free Utility</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6">
                        Grade <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#DB2777]">Calculator</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Stop guessing. Use our algorithm to predict your final outcome and see exactly what you need to score to hit your university targets.
                    </p>

                    {/* Mode Toggle */}
                    <div className="flex justify-center mt-10">
                        <div className="bg-white/5 border border-white/10 p-1 rounded-full flex gap-1">
                            <button
                                onClick={() => setMode('ib')}
                                className={clsx(
                                    "px-8 py-3 rounded-full font-bold text-sm transition-all duration-300",
                                    mode === 'ib' ? "bg-[#DB2777] text-white shadow-[0_0_15px_rgba(219,39,119,0.5)]" : "text-gray-400 hover:text-white"
                                )}
                            >
                                IB Diploma
                            </button>
                            <button
                                onClick={() => setMode('igcse')}
                                className={clsx(
                                    "px-8 py-3 rounded-full font-bold text-sm transition-all duration-300",
                                    mode === 'igcse' ? "bg-[#7C3AED] text-white shadow-[0_0_15px_rgba(124,58,237,0.5)]" : "text-gray-400 hover:text-white"
                                )}
                            >
                                IGCSE / GCSE
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <section className="pb-24 px-6">
                <div className="container mx-auto max-w-5xl">
                    <div className="grid lg:grid-cols-3 gap-8 items-start">

                        {/* Calculator Area */}
                        <div className="lg:col-span-2 space-y-6">
                            {mode === 'ib' ? (
                                <>
                                    <div className="space-y-3">
                                        {ibSubjects.map((s) => (
                                            <div key={s.id} className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors flex items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <input
                                                        value={s.name}
                                                        onChange={(e) => setIbSubjects(curr => curr.map(sub => sub.id === s.id ? { ...sub, name: e.target.value } : sub))}
                                                        className="bg-transparent text-white font-bold w-full outline-none placeholder-gray-600"
                                                        placeholder="Subject Name"
                                                    />
                                                    <button
                                                        onClick={() => toggleLevel(s.id)}
                                                        className={clsx(
                                                            "text-[10px] px-2 py-0.5 rounded font-mono font-bold mt-1 transition-colors",
                                                            s.level === 'HL' ? "bg-[#DB2777]/20 text-[#DB2777]" : "bg-blue-500/20 text-blue-400"
                                                        )}
                                                    >
                                                        {s.level}
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-3 bg-black/40 rounded-lg p-1">
                                                    <button onClick={() => updateIBGrade(s.id, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-md text-gray-400 hover:text-white">-</button>
                                                    <span className={clsx("w-6 text-center font-bold text-lg", s.grade === 7 ? "text-[#DB2777]" : s.grade >= 5 ? "text-white" : "text-gray-500")}>{s.grade}</span>
                                                    <button onClick={() => updateIBGrade(s.id, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-md text-gray-400 hover:text-white">+</button>
                                                </div>

                                                <button onClick={() => removeSubject(s.id)} className="text-gray-600 hover:text-red-500 transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Core Points */}
                                    <div className="p-5 rounded-2xl bg-[#DB2777]/10 border border-[#DB2777]/20 flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-[#DB2777]">Core Points (TOK + EE)</h3>
                                            <p className="text-xs text-pin-200/60 mt-0.5">Bonus points out of 3</p>
                                        </div>
                                        <div className="flex gap-1">
                                            {[0, 1, 2, 3].map(p => (
                                                <button
                                                    key={p}
                                                    onClick={() => setCorePoints(p)}
                                                    className={clsx(
                                                        "w-10 h-10 rounded-lg font-bold border transition-all",
                                                        corePoints === p ? "bg-[#DB2777] border-[#DB2777] text-white shadow-lg" : "bg-transparent border-[#DB2777]/30 text-[#DB2777]/50 hover:bg-[#DB2777]/10"
                                                    )}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                // IGCSE Mode
                                <div className="space-y-3">
                                    {igcseSubjects.map((s) => (
                                        <div key={s.id} className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                                            <div className="flex items-center justify-between mb-4">
                                                <input
                                                    value={s.name}
                                                    onChange={(e) => setIgcseSubjects(curr => curr.map(sub => sub.id === s.id ? { ...sub, name: e.target.value } : sub))}
                                                    className="bg-transparent text-white font-bold outline-none placeholder-gray-600"
                                                    placeholder="Subject Name"
                                                />
                                                <button onClick={() => removeSubject(s.id)} className="text-gray-600 hover:text-red-500 transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs text-gray-400 font-mono">
                                                    <span>Percentage</span>
                                                    <span>{s.percentage}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={s.percentage}
                                                    onChange={(e) => updateIGCSEPercentage(s.id, parseInt(e.target.value))}
                                                    className="w-full appearance-none h-2 bg-white/10 rounded-full overflow-hidden [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#7C3AED] cursor-pointer"
                                                />
                                                <div className="flex justify-between items-center mt-2">
                                                    <div className="h-1 w-full bg-gradient-to-r from-red-500 via-orange-400 to-green-500 rounded-full opacity-20"></div>
                                                    <span className="ml-4 text-2xl font-black text-[#7C3AED] min-w-[30px] text-center">
                                                        {getIGCSEGrade(s.percentage)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={addNewSubject}
                                className="w-full py-4 rounded-xl border border-dashed border-white/20 text-gray-400 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={18} /> Add Subject
                            </button>
                        </div>

                        {/* Results Sidebar */}
                        <div className="lg:sticky lg:top-28 space-y-6">
                            <SpotlightCard className={clsx("text-center p-8", mode === 'ib' ? "border-[#DB2777]/30" : "border-[#7C3AED]/30")}>
                                <div className="space-y-1">
                                    <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                                        {mode === 'ib' ? 'Predicted Total' : 'Average Score'}
                                    </span>
                                    <div className={clsx(
                                        "text-8xl font-black my-4 text-transparent bg-clip-text bg-gradient-to-r",
                                        mode === 'ib' ? "from-[#DB2777] to-orange-500" : "from-[#7C3AED] to-blue-500"
                                    )}>
                                        {mode === 'ib' ? ibTotal : `${igcseAverage}%`}
                                    </div>
                                    <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-300">
                                        {mode === 'ib'
                                            ? (ibTotal >= 40 ? "🎓 Ivy League / Oxbridge" : ibTotal >= 35 ? "🏛️ Russell Group Target" : "📚 Good Foundation")
                                            : `Avg Grade: ${getIGCSEGrade(igcseAverage)}`
                                        }
                                    </div>
                                </div>
                            </SpotlightCard>

                            <div className="bg-gradient-to-b from-white/10 to-transparent p-1 rounded-3xl">
                                <div className="bg-black/90 backdrop-blur-xl rounded-[22px] p-6 text-center border border-white/10">
                                    <h3 className="font-bold text-white mb-2">Need a score boost?</h3>
                                    <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                                        Our tutors specialize in turning {mode === 'ib' ? '30s into 40s' : '5s into 9s'}. Book a gap assessment and we'll build your roadmap.
                                    </p>
                                    <ClayButton
                                        variant="primary"
                                        className="w-full justify-center"
                                        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                                    >
                                        Book Assessment
                                    </ClayButton>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
};
