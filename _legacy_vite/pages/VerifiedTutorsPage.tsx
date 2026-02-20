import { Helmet } from 'react-helmet-async';
import { SpotlightCard } from '../components/SpotlightCard';
import { ClayButton } from '../components/ClayButton';
import { Check } from 'lucide-react';

export const VerifiedTutorsPage = () => {
    const tutors = [
        {
            name: "Dr. Sarah Mitchell",
            role: "Head of Sciences",
            education: "PhD Physics, Imperial College London",
            specialty: "IB Physics HL & A-Level Physics",
            experience: "12 Years",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop"
        },
        {
            name: "James Anderson",
            role: "Math Specialist",
            education: "MMath, University of Cambridge",
            specialty: "IGCSE & IB Math AA HL",
            experience: "8 Years",
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop"
        },
        {
            name: "Priya Sharma",
            role: "Chemistry Expert",
            education: "MSc Chemistry, NUS",
            specialty: "CBSE & IB Chemistry",
            experience: "10 Years",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2661&auto=format&fit=crop"
        },
        {
            name: "Michael Chang",
            role: "Computer Science Lead",
            education: "BSc CompSci, Stanford University",
            specialty: "AP & IB Computer Science",
            experience: "6 Years",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2670&auto=format&fit=crop"
        }
    ];

    return (
        <>
            <Helmet>
                <title>Verified Tutors Dubai | MoHRE Compliant & Legal | PerTuto</title>
                <meta name="description" content="Meet our team of verified, legal, and expert tutors in Dubai. All PerTuto educators are MoHRE/DED compliant. Safety and quality guaranteed." />
                <link rel="canonical" href="https://pertuto.com/about/verified-tutors" />
            </Helmet>

            <header className="relative pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1 mb-6 rounded-full border border-green-500/30 bg-green-500/10 backdrop-blur-md">
                        <Check size={14} className="text-green-400" />
                        <span className="font-mono text-xs text-green-400 tracking-widest uppercase">100% Compliant</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6">Verified <span className="text-green-500">Expertise</span></h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        We don't just hire students. We partner with career educators. Every tutor is background checked, verified, and legally permitted to teach in Dubai (MoHRE/DED Compliant).
                    </p>
                </div>
            </header>

            <section className="pb-24 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {tutors.map((tutor, i) => (
                            <SpotlightCard key={i} className="h-full p-0 overflow-hidden bg-black/40 border-white/10">
                                <div className="h-64 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                                    <img
                                        src={tutor.image}
                                        alt={tutor.name}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                    <div className="absolute bottom-4 left-4 z-20">
                                        <div className="bg-green-500 text-black text-[10px] font-bold px-2 py-0.5 rounded shadow mb-1 w-fit">VERIFIED</div>
                                        <h3 className="font-bold text-lg text-white">{tutor.name}</h3>
                                        <p className="text-xs text-green-400 font-mono">{tutor.role}</p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-3 text-sm text-gray-400">
                                        <div className="flex items-start gap-3">
                                            <span className="text-white shrink-0">🎓</span>
                                            <span>{tutor.education}</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="text-white shrink-0">⭐</span>
                                            <span>{tutor.specialty}</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="text-white shrink-0">🕒</span>
                                            <span>{tutor.experience} Teaching</span>
                                        </div>
                                    </div>
                                    <ClayButton variant="secondary" className="w-full mt-6 text-sm" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                                        Book with {tutor.name.split(' ')[0]}
                                    </ClayButton>
                                </div>
                            </SpotlightCard>
                        ))}
                    </div>

                    <div className="mt-20 p-8 rounded-3xl bg-white/5 border border-white/10 text-center">
                        <h2 className="text-2xl font-bold mb-4">Why Compliance Matters</h2>
                        <div className="grid md:grid-cols-3 gap-8 text-left mt-8">
                            <div>
                                <h3 className="font-bold text-green-400 mb-2">Safety First</h3>
                                <p className="text-sm text-gray-400">All tutors undergo rigorous background checks. We prioritize your child's safety above all else.</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-green-400 mb-2">Legal Security</h3>
                                <p className="text-sm text-gray-400">Private tutoring in Dubai requires specific permits. We handle all legalities so you don't risk fines.</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-green-400 mb-2">Quality Assurance</h3>
                                <p className="text-sm text-gray-400">Verification isn't just about legality. It's about proving academic credentials and teaching ability.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
