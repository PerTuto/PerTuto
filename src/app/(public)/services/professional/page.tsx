import type { Metadata } from 'next';
import { SpotlightCard } from '@/components/public/spotlight-card';
import { LeadCaptureForm } from '@/components/public/lead-capture-form';
import { Brain, Code2, Database, TrendingUp, Cpu, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Professional Upskilling — AI, Data Science, Programming | PerTuto Dubai',
    description: 'Level up your career with personalized tutoring in AI, Data Science, Python, and more. For working professionals in Dubai.',
};

const COURSES = [
    { icon: Brain, name: 'AI & Machine Learning', desc: 'From fundamentals to deploying production models. TensorFlow, PyTorch, LLMs.', color: 'text-violet-400' },
    { icon: Database, name: 'Data Science', desc: 'Python, pandas, SQL, visualization — end-to-end data pipelines.', color: 'text-blue-400' },
    { icon: Code2, name: 'Programming', desc: 'Python, JavaScript, TypeScript, React, Node.js — build real projects.', color: 'text-emerald-400' },
    { icon: TrendingUp, name: 'Professional Degrees', desc: 'MBA coursework, CFA prep, research assistance — learn efficiently.', color: 'text-amber-400' },
    { icon: Cpu, name: 'AI Upskilling for Teams', desc: 'Custom training programs for organizations adopting AI.', color: 'text-pink-400' },
];

export default function ProfessionalPage() {
    return (
        <>
            {/* Hero */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/5 text-sm text-violet-400">
                        <Brain className="w-4 h-4" />
                        For Working Professionals
                    </div>
                    <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
                        Learn the Critical 90%<br />
                        <span className="text-violet-400">In 10% of the Time</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Personalized 1-on-1 tutoring in AI, Data Science, and Programming.
                        Designed for busy professionals who need results fast.
                    </p>
                    <Link href="#book-demo">
                        <Button size="lg" className="h-12 px-8 font-semibold mt-4 bg-violet-600 hover:bg-violet-700">
                            Book Free Session <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Courses */}
            <section className="py-20 px-6 bg-card/20 border-y border-border/20">
                <div className="max-w-5xl mx-auto">
                    <h2 className="font-headline text-3xl font-bold text-center mb-12">What You Can Learn</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {COURSES.map(({ icon: Icon, name, desc, color }) => (
                            <SpotlightCard key={name} spotlightColor="rgba(167, 139, 250, 0.12)">
                                <div className="space-y-3">
                                    <Icon className={`w-8 h-8 ${color}`} />
                                    <h3 className="font-headline text-lg font-bold">{name}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                                </div>
                            </SpotlightCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Us */}
            <section className="py-20 px-6">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                    <h2 className="font-headline text-3xl font-bold">Why Professionals Choose Us</h2>
                    <div className="grid sm:grid-cols-3 gap-6 text-left">
                        {[
                            { title: 'Flexible Hours', desc: 'Evenings, weekends — sessions that fit your calendar.' },
                            { title: 'Project-Based', desc: 'Work on real projects relevant to your career goals.' },
                            { title: 'Expert Tutors', desc: 'Industry practitioners, not just academics.' },
                        ].map(item => (
                            <div key={item.title} className="p-5 rounded-xl border border-border/30 bg-card/30">
                                <h3 className="font-semibold text-sm mb-2">{item.title}</h3>
                                <p className="text-xs text-muted-foreground">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lead Form */}
            <section id="book-demo" className="py-24 px-6 bg-card/20 border-t border-border/20">
                <div className="max-w-lg mx-auto rounded-2xl border border-violet-500/20 bg-card/50 backdrop-blur-sm p-8 md:p-10">
                    <div className="text-center mb-8">
                        <h2 className="font-headline text-2xl font-bold mb-2">Book a Free Session</h2>
                        <p className="text-sm text-muted-foreground">Tell us your goal. We&apos;ll match you with the right expert.</p>
                    </div>
                    <LeadCaptureForm variant="minimal" />
                </div>
            </section>
        </>
    );
}
