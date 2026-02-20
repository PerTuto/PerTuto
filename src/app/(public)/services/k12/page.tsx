import type { Metadata } from 'next';
import { SpotlightCard } from '@/components/public/spotlight-card';
import { LeadCaptureForm } from '@/components/public/lead-capture-form';
import { GraduationCap, BookOpen, FlaskConical, Atom, Languages, BarChart3, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'K-12 Tutoring — IB, IGCSE, A-Level, CBSE | PerTuto Dubai',
    description: 'Expert tutoring for IB MYP & DP, IGCSE, A-Level, and CBSE students. Math, Science, English and more. Book a free demo class today.',
};

const CURRICULA = [
    { name: 'IB (MYP & DP)', desc: 'Internal Assessments, exam prep, and Level 7 mastery', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { name: 'IGCSE', desc: 'Cambridge curriculum support — past papers, exam technique', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { name: 'A-Level', desc: 'Advanced subject mastery for university readiness', color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { name: 'CBSE & ICSE', desc: 'Board exam prep with structured, disciplined guidance', color: 'text-green-400', bg: 'bg-green-500/10' },
];

const SUBJECTS = [
    { icon: BarChart3, name: 'Mathematics', desc: 'AA/AI, Pure, Applied, Statistics' },
    { icon: Atom, name: 'Physics', desc: 'HL/SL, Mechanics, Waves, Fields' },
    { icon: FlaskConical, name: 'Chemistry', desc: 'Organic, Inorganic, Physical' },
    { icon: BookOpen, name: 'Biology', desc: 'Cell Biology, Genetics, Ecology' },
    { icon: Languages, name: 'English', desc: 'Literature, Language, Essay Writing' },
    { icon: GraduationCap, name: 'Business', desc: 'Economics, Business Management' },
];

export default function K12Page() {
    return (
        <>
            {/* Hero */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
                        K-12 Tutoring That <span className="text-primary">Gets Results</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        From IB Internal Assessments to IGCSE past papers — we don&apos;t just teach, we prepare you to excel.
                    </p>
                    <Link href="#book-demo">
                        <Button size="lg" className="h-12 px-8 font-semibold mt-4">
                            Book Free Demo <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Curricula */}
            <section className="py-20 px-6 bg-card/20 border-y border-border/20">
                <div className="max-w-5xl mx-auto">
                    <h2 className="font-headline text-3xl font-bold text-center mb-12">Curricula We Cover</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {CURRICULA.map(c => (
                            <SpotlightCard key={c.name}>
                                <h3 className={`font-headline text-xl font-bold ${c.color} mb-2`}>{c.name}</h3>
                                <p className="text-muted-foreground text-sm">{c.desc}</p>
                            </SpotlightCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Subjects */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="font-headline text-3xl font-bold text-center mb-12">Subjects</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {SUBJECTS.map(({ icon: Icon, name, desc }) => (
                            <div key={name} className="flex items-start gap-4 p-5 rounded-xl border border-border/30 bg-card/30 hover:border-primary/30 transition-colors">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <Icon className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">{name}</h3>
                                    <p className="text-xs text-muted-foreground mt-1">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lead Form */}
            <section id="book-demo" className="py-24 px-6 bg-card/20 border-t border-border/20">
                <div className="max-w-lg mx-auto rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 md:p-10">
                    <div className="text-center mb-8">
                        <h2 className="font-headline text-2xl font-bold mb-2">Start Your Journey</h2>
                        <p className="text-sm text-muted-foreground">Book a free demo. No commitments.</p>
                    </div>
                    <LeadCaptureForm variant="minimal" />
                </div>
            </section>
        </>
    );
}
