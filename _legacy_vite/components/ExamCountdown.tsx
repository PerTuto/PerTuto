import { useState, useEffect } from 'react';

type ExamDate = {
    label: string;
    date: string; // YYYY-MM-DD
    color: string;
};

const EXAMS: ExamDate[] = [
    { label: 'CBSE Class 10/12', date: '2026-02-15', color: 'from-green-600 to-emerald-400' },
    { label: 'IB Diploma', date: '2026-04-23', color: 'from-pink-600 to-rose-400' },
    { label: 'IGCSE / A-Level', date: '2026-05-02', color: 'from-blue-600 to-cyan-400' },
];

export const ExamCountdown = () => {
    // Default to first exam, or find next upcoming
    const [selectedExam, setSelectedExam] = useState<ExamDate>(EXAMS[0]);
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

    useEffect(() => {
        // Find the next upcoming exam automatically on load
        const now = new Date();
        const nextExam = EXAMS.find(e => new Date(e.date) > now);
        if (nextExam) setSelectedExam(nextExam);
    }, []);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(selectedExam.date) - +new Date();
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            } else {
                setTimeLeft(null);
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [selectedExam]);

    if (!timeLeft) return null;

    return (
        <div className="w-full max-w-4xl mx-auto my-12 px-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden group">

                {/* Background Gradient Glow */}
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${selectedExam.color} opacity-10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none`}></div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">

                    {/* Left: Text & Selector */}
                    <div className="text-center md:text-left">
                        <h3 className="text-gray-400 text-sm font-medium tracking-widest uppercase mb-2">Exam Countdown</h3>
                        <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                            {EXAMS.map((exam) => (
                                <button
                                    key={exam.label}
                                    onClick={() => setSelectedExam(exam)}
                                    className={`text-xs px-3 py-1 rounded-full border transition-all duration-300 ${selectedExam.label === exam.label
                                        ? 'bg-white text-black border-white font-bold'
                                        : 'bg-transparent text-gray-500 border-gray-700 hover:border-gray-500'
                                        }`}
                                >
                                    {exam.label}
                                </button>
                            ))}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            {selectedExam.label} Starts In:
                        </h2>
                    </div>

                    {/* Right: Timer */}
                    <div className="flex gap-4 text-center">
                        {[
                            { label: 'Days', value: timeLeft.days },
                            { label: 'Hours', value: timeLeft.hours },
                            { label: 'Mins', value: timeLeft.minutes },
                            { label: 'Secs', value: timeLeft.seconds },
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-black/40 border border-white/10 rounded-xl flex items-center justify-center mb-2 shadow-inner">
                                    <span className={`text-2xl md:text-3xl font-mono font-bold bg-clip-text text-transparent bg-gradient-to-br ${selectedExam.color}`}>
                                        {String(item.value).padStart(2, '0')}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-gray-300">
                    <p>⚠️ Don't wait until the last minute.</p>
                    <button
                        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                        className={`text-white font-bold underline decoration-2 underline-offset-4 hover:text-white/80 transition-colors decoration-${selectedExam.color.split(' ')[1].replace('to-', '')}`}
                    >
                        Book Your Gap Assessment Now →
                    </button>
                </div>
            </div>
        </div>
    );
};
