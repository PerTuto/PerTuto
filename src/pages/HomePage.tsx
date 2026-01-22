import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { SEOHead } from '../components/SEOHead';
import { ClayButton } from '../components/ClayButton';
import { ClayInput } from '../components/ClayInput';
import { SpotlightCard } from '../components/SpotlightCard';
import DecryptedText from '../components/DecryptedText';
import { HeroVisual } from '../components/HeroVisual';
import { Marquee } from '../components/Marquee';
import { StickyBanner } from '../components/StickyBanner';
import { ExamCountdown } from '../components/ExamCountdown';
import { DemoOffer } from '../components/DemoOffer';
import { ReviewsMarquee } from '../components/ReviewsMarquee';
import type { Review } from '../components/ReviewCard';
import { leadService } from '../services/leadService';
import { logEvent } from '../services/analytics';
import type { Lead } from '../services/leadService';
import { Check } from 'lucide-react';
import { clsx } from 'clsx';
import { PersonaSplitHero } from '../components/PersonaSplitHero';

interface LayoutContext {
    viewMode: 'school' | 'pro';
    setViewMode: (mode: 'school' | 'pro') => void;
    isSchool: boolean;
}

export const HomePage = () => {
    const { isSchool, setViewMode } = useOutletContext<LayoutContext>();
    const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [hasSelectedPersona, setHasSelectedPersona] = useState(() => {
        // Check local storage for persistence
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem('hasSelectedPersona');
        }
        return false;
    });

    // FAQ State
    const [faqs, setFaqs] = useState([
        {
            question: 'What is included in the diagnostic trial?',
            answer: 'A comprehensive assessment of current academic standing, a personalized roadmap identifying key growth areas, and a 30-minute active learning session.',
            open: false
        },
        {
            question: 'Do I need to pay anything upfront?',
            answer: 'No. The initial strategy session and diagnostic are completely free. We want to ensure the perfect fit before any commitment.',
            open: false
        },
        {
            question: 'How do the interactive decks work?',
            answer: 'Unlike static PDFs, our learning decks are HTML-based. Students can manipulate graphs, solve code blocks, and drag-and-drop elements in real-time with their tutor.',
            open: false
        },
        {
            question: 'What curriculums do you support?',
            answer: 'We specialize in IB, A-Levels, AP, and IGCSE curriculums across Math, Sciences, English, and Computer Science.',
            open: false
        }
    ]);

    // Form handling
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Lead>();

    // Derived Data
    const features = useMemo(() => [
        {
            title: isSchool ? '1:1 Mentorship' : 'Industry Mentorship',
            icon: isSchool ? '🔥' : '💼',
            desc: isSchool
                ? 'No cookie-cutter classes. We match your vibe with tutors who actually get it.'
                : 'Accelerate your career with technical mentorship from FAANG engineers and industry leaders.'
        },
        {
            title: isSchool ? 'Top 1% Tutors' : 'Domain Experts',
            icon: isSchool ? '💎' : '🎖️',
            desc: isSchool
                ? 'Verified academic weapons from Ivy League & Russell Group unis.'
                : 'Learn from specialists in AI, Data Science, and Executive Leadership.'
        },
        {
            title: isSchool ? 'Adaptive AI' : 'Skill Pathways',
            icon: '🧠',
            desc: isSchool
                ? 'Curriculum that evolves in real-time as you crush new concepts.'
                : 'Project-based learning tracks that build your professional portfolio.'
        },
        {
            title: isSchool ? 'Live Dashboards' : 'ROI Analytics',
            icon: '📊',
            desc: isSchool
                ? 'Track your XP and level up your grades with visual analytics.'
                : 'Transparent data dashboards to monitor skill acquisition and certification readiness.'
        }
    ], [isSchool]);

    const stats = useMemo(() => [
        { value: '98%', label: 'Success Rate' },
        { value: '2.5k+', label: 'Upskilled' },
        { value: '4.9/5', label: isSchool ? 'Vibe Check' : 'Expert Rating' },
        { value: '24/7', label: 'Support' }
    ], [isSchool]);

    const howItWorks = useMemo(() => [
        {
            step: '01',
            title: isSchool ? 'Send Signal' : 'Discovery Call',
            desc: isSchool ? 'Share your mission objectives and current loadout.' : 'Share your career goals and current skill stack.',
            icon: '📡'
        },
        {
            step: '02',
            title: isSchool ? 'Diagnostic' : 'Skills Audit',
            desc: isSchool ? 'We scan for knowledge gaps and build your upgrade path.' : 'We conduct a technical audit to map out your career progression.',
            icon: '🔍'
        },
        {
            step: '03',
            title: isSchool ? 'Liftoff' : 'Scale Up',
            desc: isSchool ? 'Sessions start. Grades go up. Simple as that.' : 'Professional coaching begins. Results delivered. Career scaled.',
            icon: '🚀'
        }
    ], [isSchool]);

    const reviews: Review[] = useMemo(() => isSchool ? [
        {
            id: '1',
            name: 'Sarah J.',
            role: 'IB Math AA HL Student',
            rating: 5,
            text: "I went from a 3 in my mocks to a predicted 7 in just 3 months. My tutor didn't just teach the math, he taught me how the examiners think.",
            verified: true,
            date: '2 Days Ago',
            platform: 'whatsapp'
        },
        {
            id: '2',
            name: 'Ahmed K.',
            role: 'A-Level Physics',
            rating: 5,
            text: "Physics significantly clicked for the first time. The interactive graphs we used in class were amazing.",
            verified: true,
            date: '1 Week Ago',
            platform: 'google'
        },
        {
            id: '3',
            name: 'Priya R.',
            role: 'IGCSE Chemistry',
            rating: 5,
            text: "Honest feedback: I was failing chem. Now I'm top of my class. The crash course material is gold.",
            verified: true,
            date: '2 Weeks Ago',
            platform: 'email'
        },
        {
            id: '4',
            name: 'James T.',
            role: 'IB Economics HL',
            rating: 5,
            text: "The essay structure templates saved my life. I finally understand how to structure my Paper 1 answers.",
            verified: true,
            date: '3 Weeks Ago',
            platform: 'whatsapp'
        }
    ] : [
        {
            id: 'p1',
            name: 'Michael B.',
            role: 'Senior React Dev @ Careem',
            rating: 5,
            text: "The system design mentorship was intense but exactly what I needed to crack my senior interview.",
            verified: true,
            date: '1 Month Ago',
            platform: 'google'
        },
        {
            id: 'p2',
            name: 'Fatima A.',
            role: 'Data Scientist',
            rating: 5,
            text: "I was stuck in tutorial hell with Python. My mentor helped me build a real production-grade RAG app in 4 weeks.",
            verified: true,
            date: '2 Weeks Ago',
            platform: 'email'
        },
        {
            id: 'p3',
            name: 'David L.',
            role: 'Product Manager',
            rating: 5,
            text: "Needed to get technical fast for a new fintech role. We covered API architecture and SQL in record time.",
            verified: true,
            date: '3 Days Ago',
            platform: 'whatsapp'
        }
    ], [isSchool]);

    // Handlers
    const toggleFaq = (index: number) => {
        setFaqs(current => current.map((faq, i) =>
            i === index ? { ...faq, open: !faq.open } : faq
        ));
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const onSubmit = async (data: Lead) => {
        try {
            logEvent('Lead Generation', 'Submit Form', data.curriculum);
            await leadService.submitLead(data);
            setFormStatus('success');
            reset();
            setTimeout(() => setFormStatus('idle'), 5000);
        } catch (error) {
            setFormStatus('error');
        }
    };

    const handlePersonaSelect = (mode: 'school' | 'pro') => {
        // 1. Update UI View Mode
        setViewMode(mode);

        // 2. Persist Choice
        localStorage.setItem('hasSelectedPersona', 'true');
        setHasSelectedPersona(true);

        // 3. Log Analytics (Safe)
        try {
            logEvent('Persona Selection', 'Hero Split Click', mode);
        } catch (e) {
            console.error('Analytics failed', e);
        }

        window.scrollTo(0, 0);
    };

    if (!hasSelectedPersona) {
        return (
            <>
                <SEOHead
                    title="PerTuto - Premium 1:1 Tutoring | Select Your Path"
                    description="Choose your path: Elite school tutoring for IGCSE/IB/A-Level or Professional mentorship for career acceleration."
                />
                <PersonaSplitHero onSelect={handlePersonaSelect} />
            </>
        );
    }

    return (
        <>
            <SEOHead
                title="Premium 1:1 Tutoring for School Students & Professionals"
                description="Elite tutoring for IB, A-Levels, IGCSE & AP in Dubai. Verified tutors, adaptive learning, and real results. Book your free diagnostic session today."
            />

            {/* Sticky Banner */}
            <StickyBanner />

            {/* Hero Section */}
            <header className="relative pt-32 pb-12 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
                <div className="container mx-auto max-w-7xl relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        {/* Left Content */}
                        <div className="text-center lg:text-left space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#7C3AED]/30 bg-[#7C3AED]/10 backdrop-blur-md">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7C3AED] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7C3AED]"></span>
                                </span>
                                <span className="font-mono text-xs text-[#d8b4fe] tracking-widest uppercase">
                                    {isSchool ? 'Academic Weapon Loading...' : 'Career Scaling Initiated'}
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
                                {isSchool ? (
                                    <>
                                        PERSONALIZED<br />
                                        <DecryptedText
                                            text="TUTORING"
                                            speed={40}
                                            className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#DB2777] to-[#7C3AED]"
                                        />
                                    </>
                                ) : (
                                    <>
                                        SCALE<br />
                                        <DecryptedText
                                            text="YOUR CAREER"
                                            speed={40}
                                            className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#DB2777] via-[#7C3AED] to-[#DB2777]"
                                        />
                                    </>
                                )}
                            </h1>

                            <p className="text-xl text-gray-400 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
                                {isSchool
                                    ? "Elite 1:1 mentorship for students who want to dominate the Dubai grade curve. No boring lectures. Just Top-Tier results."
                                    : "Premium executive coaching and technical mentorship for professionals in Dubai. Upskill with the world's leading subject matter experts."
                                }
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <ClayButton variant="primary" className="h-14 px-8 text-base w-full sm:w-auto" onClick={() => scrollToSection('contact')}>
                                    {isSchool ? 'BOOK GAP ASSESSMENT' : 'CONSULT NOW'}
                                </ClayButton>
                                <ClayButton variant="secondary" className="h-14 px-8 text-base w-full sm:w-auto" onClick={() => scrollToSection('how-it-works')}>
                                    HOW IT WORKS
                                </ClayButton>
                            </div>
                        </div>

                        {/* Right Content - 3D Visual */}
                        <div className="hidden lg:block relative h-[500px]">
                            <HeroVisual />
                        </div>
                    </div>
                </div>
            </header>

            {/* Exam Countdown */}
            {isSchool && <ExamCountdown />}

            {/* Marquee */}
            <Marquee items={["MATH", "PHYSICS", "CHEMISTRY", "BIOLOGY", "CODING", "HISTORY", "ECONOMICS", "LITERATURE", "PSYCHOLOGY"]} />

            {/* Demo Offer */}
            <section className="px-6 max-w-4xl mx-auto mt-12 mb-20 relative z-20">
                <DemoOffer />
            </section>

            {/* Stats */}
            <section id="stats" className="px-6 max-w-7xl mx-auto mt-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex flex-col items-center justify-center text-center p-6 border border-white/5 bg-white/5 rounded-3xl hover:bg-white/10 transition-colors cursor-default">
                            <span className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{stat.value}</span>
                            <span className="text-xs font-mono font-bold text-[#7C3AED] uppercase tracking-widest">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Reviews */}
            <section className="py-12 border-y border-white/5 bg-white/[0.02]">
                <div className="container mx-auto px-6 mb-8">
                    <h2 className="text-2xl font-bold text-center">
                        {isSchool ? "Join 400+ Students crushing their exams." : "Accelerating careers across Dubai."}
                    </h2>
                </div>
                <ReviewsMarquee reviews={reviews} speed={30} />
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-6 relative bg-black/50 backdrop-blur-sm">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#DB2777]">Pertuto?</span>
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            We've reengineered the tutoring experience from the ground up.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {features.map((feature, i) => (
                            <SpotlightCard key={i} className="h-full">
                                <div className="text-4xl mb-6">{feature.icon}</div>
                                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </SpotlightCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 px-6 relative overflow-hidden">
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                                From <span className="text-gray-500 line-through">Confusion</span> to <br />
                                <span className="text-[#7C3AED]">Confidence.</span>
                            </h2>
                            <div className="space-y-8">
                                {howItWorks.map((step, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center font-mono font-bold text-gray-500 group-hover:border-[#7C3AED] group-hover:text-[#7C3AED] transition-colors shrink-0">
                                            {step.step}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold mb-2 flex items-center gap-3">
                                                {step.title}
                                                <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-xl">{step.icon}</span>
                                            </h4>
                                            <p className="text-gray-400">
                                                {step.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <SpotlightCard className="bg-gradient-to-br from-[#1a1a1a] to-black aspect-square flex items-center justify-center relative p-0">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay rounded-3xl"></div>
                            <div className="relative z-10 text-center">
                                <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-6 border border-white/20">
                                    <div className="text-4xl">🎓</div>
                                </div>
                                <h3 className="text-2xl font-bold">World Class Tutors</h3>
                                <p className="text-sm text-gray-400 mt-2">Verified & Vetted</p>
                            </div>
                        </SpotlightCard>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="py-24 px-6 bg-black/80 backdrop-blur-sm">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">Frequently Asked</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="border border-white/10 rounded-2xl overflow-hidden bg-white/5">
                                <button
                                    onClick={() => toggleFaq(i)}
                                    className="w-full h-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                                >
                                    <span className="font-bold text-lg">{faq.question}</span>
                                    <span className={clsx("text-2xl transition-transform duration-300", faq.open ? "rotate-45" : "rotate-0")}>
                                        +
                                    </span>
                                </button>
                                <div className={clsx("transition-all duration-300 overflow-hidden", faq.open ? "max-h-48 opacity-100" : "max-h-0 opacity-0")}>
                                    <p className="p-6 pt-0 text-gray-400 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lead Form Section */}
            <section id="contact" className="py-24 px-6 relative">
                <div className="container mx-auto max-w-xl relative z-10">
                    <SpotlightCard className="border-t-4 border-t-[#7C3AED] bg-black/80 backdrop-blur-xl">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold mb-2">
                                {isSchool ? "Level Up Your Grades" : "Accelerate Your Growth"}
                            </h2>
                            <p className="text-gray-400 mb-6">
                                {isSchool ? "Book your free diagnostic session now." : "Schedule a complimentary discovery call with an industry expert."}
                            </p>

                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/20">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-[10px] text-green-500 font-mono font-bold uppercase tracking-wider">100% MoHRE Compliant Tutors</span>
                            </div>
                        </div>

                        {formStatus === 'success' ? (
                            <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
                                    <Check size={32} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                                <p className="text-gray-400">We'll be in touch within 24 hours to schedule your session.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <ClayInput
                                    id="name"
                                    label="Full Name"
                                    placeholder="e.g. Alex Chen"
                                    {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Too short' } })}
                                    error={errors.name}
                                />

                                <ClayInput
                                    id="email"
                                    type="email"
                                    label="Email Address"
                                    placeholder="alex@example.com"
                                    {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                                    error={errors.email}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold font-mono text-gray-400 uppercase tracking-wider ml-1">
                                            {isSchool ? "Curriculum" : "Track"}
                                        </label>
                                        <select
                                            {...register('curriculum', { required: 'Required' })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#7C3AED] transition-all appearance-none text-sm h-[46px]"
                                        >
                                            <option value="" className="bg-black text-gray-500">Select...</option>
                                            {isSchool ? (
                                                <>
                                                    <option value="IGCSE" className="bg-black">IGCSE</option>
                                                    <option value="IB" className="bg-black">IB (Intl. Bacc.)</option>
                                                    <option value="A-Level" className="bg-black">A-Level</option>
                                                    <option value="CBSE" className="bg-black">CBSE</option>
                                                    <option value="AP" className="bg-black">AP</option>
                                                    <option value="Other" className="bg-black">Other</option>
                                                </>
                                            ) : (
                                                <>
                                                    <option value="System Design" className="bg-black">System Design</option>
                                                    <option value="Data Science" className="bg-black">Data Science</option>
                                                    <option value="Full Stack" className="bg-black">Full Stack</option>
                                                    <option value="Technical PM" className="bg-black">Technical PM</option>
                                                    <option value="Leadership" className="bg-black">Leadership</option>
                                                </>
                                            )}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold font-mono text-gray-400 uppercase tracking-wider ml-1">
                                            Referral
                                        </label>
                                        <select
                                            {...register('referralSource')}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#7C3AED] transition-all appearance-none text-sm h-[46px]"
                                        >
                                            <option value="" className="bg-black text-gray-500">Select...</option>
                                            <option value="Google" className="bg-black">Google</option>
                                            <option value="Instagram" className="bg-black">Instagram</option>
                                            <option value="Friend" className="bg-black">Friend</option>
                                            <option value="LinkedIn" className="bg-black">LinkedIn</option>
                                            <option value="Other" className="bg-black">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <ClayInput
                                        id="grade"
                                        label={isSchool ? "Grade / Year" : "Current Role"}
                                        placeholder={isSchool ? "e.g. Year 12 / 11th" : "e.g. Senior Dev"}
                                        {...register('studentGrade', { required: 'Required' })}
                                        error={errors.studentGrade}
                                    />
                                    <ClayInput
                                        id="subject"
                                        label={isSchool ? "Subject Interest" : "Skill Focus"}
                                        placeholder={isSchool ? "e.g. Math AA HL" : "e.g. Next.js / AI"}
                                        {...register('subject', { required: 'Required' })}
                                        error={errors.subject}
                                    />
                                </div>

                                <ClayInput
                                    id="goals"
                                    textarea
                                    label="Key Objectives"
                                    placeholder={isSchool ? "I want to get a 7 in Math..." : "I want to master React and build an AI startup..."}
                                    {...register('goals', { required: 'Please tell us a bit about your goals' })}
                                    error={errors.goals}
                                />

                                <ClayButton
                                    type="submit"
                                    variant="accent"
                                    className="w-full mt-4"
                                    isLoading={isSubmitting}
                                >
                                    {isSubmitting ? 'Sending Signal...' : (isSchool ? 'Send Signal 🚀' : 'Secure Promotion')}
                                </ClayButton>

                                {formStatus === 'error' && (
                                    <p className="text-red-400 text-center text-sm font-mono mt-2">
                                        Something went wrong. Please try again.
                                    </p>
                                )}
                            </form>
                        )}
                    </SpotlightCard>
                </div>
            </section>
        </>
    );
};
