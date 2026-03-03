'use client';

import { motion } from 'framer-motion';
import { Target, Users, Sparkles } from 'lucide-react';
import { TiltCard } from '@/components/public/tilt-card';

export function HowItWorksGrid() {
    return (
        <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.15 } }
            }}
            className="grid md:grid-cols-3 gap-8 md:gap-12 relative z-10"
        >
            {[
                { icon: Target, step: "01", title: "Tell Us What You Need", desc: "Share your subject, curriculum, and goals. We'll find the perfect match.", color: "primary" },
                { icon: Users, step: "02", title: "Meet Your Expert", desc: "Get matched with a vetted tutor who specializes in your exact needs.", color: "amber-500" },
                { icon: Sparkles, step: "03", title: "Start Learning", desc: "Join your first session—online, flexible, and designed around you.", color: "indigo-500" },
            ].map(({ icon: Icon, step, title, desc, color }) => (
                <motion.div 
                    key={step} 
                    variants={{
                        hidden: { opacity: 0, y: 50, scale: 0.9 },
                        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } }
                    }}
                    className="relative h-full"
                >
                    <TiltCard className="h-full">
                        <div className={`p-8 md:p-10 rounded-3xl bg-white border border-border/50 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative group overflow-hidden h-full flex flex-col`}>
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 shadow-inner relative z-10 group-hover:scale-110 transition-transform duration-500 text-slate-700">
                                <Icon className="w-8 h-8" />
                            </div>
                            <div className={`text-sm font-black text-${color} tracking-widest uppercase mb-2`}>
                                Step {step}
                            </div>
                            <h3 className="text-2xl font-headline font-bold mb-3 text-foreground relative z-10 tracking-tight">
                                {title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed text-base font-medium relative z-10 flex-grow">
                                {desc}
                            </p>
                        </div>
                    </TiltCard>
                </motion.div>
            ))}
        </motion.div>
    );
}
