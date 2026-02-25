"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, FileText, HelpCircle, Lightbulb, ArrowRight, Loader2, Beaker, Atom, Calculator, Microscope } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPublishedResources } from "@/lib/firebase/services";
import { SpotlightCard } from "@/components/public/spotlight-card";
import { LeadCaptureForm } from "@/components/public/lead-capture-form";

const DEFAULT_TENANT_ID = "pertuto-default";

type CourseCard = {
  slug: string;
  label: string;
  description: string;
  color: string;
  icon: string;
  curriculum: string;
  subject: string;
  grades: string[]; // grades that belong to this card
};

const COURSE_CARDS: CourseCard[] = [
  // CBSE Mathematics
  { slug: "cbse-mathematics-8", label: "CBSE Math — Class 8", description: "Rational numbers, algebraic expressions, mensuration, and data handling", color: "from-blue-500 to-blue-600", icon: "8", curriculum: "CBSE", subject: "Mathematics", grades: ["8"] },
  { slug: "cbse-mathematics-9", label: "CBSE Math — Class 9", description: "Number systems, polynomials, coordinate geometry, and probability", color: "from-blue-600 to-blue-700", icon: "9", curriculum: "CBSE", subject: "Mathematics", grades: ["9"] },
  { slug: "cbse-mathematics-10", label: "CBSE Math — Class 10", description: "Board exam prep — algebra, trigonometry, statistics & probability", color: "from-blue-700 to-indigo-600", icon: "10", curriculum: "CBSE", subject: "Mathematics", grades: ["10"] },
  { slug: "cbse-mathematics-11", label: "CBSE Math — Class 11", description: "Sets, calculus foundations, complex numbers, permutations & conics", color: "from-indigo-500 to-indigo-600", icon: "11", curriculum: "CBSE", subject: "Mathematics", grades: ["11"] },
  { slug: "cbse-mathematics-12", label: "CBSE Math — Class 12", description: "Board exam — calculus, vectors, linear programming, probability", color: "from-indigo-600 to-violet-600", icon: "12", curriculum: "CBSE", subject: "Mathematics", grades: ["12"] },

  // IB
  { slug: "ib-mathematics-aa", label: "IB Math AA", description: "Analysis & Approaches — Number, Functions, Trigonometry, Stats, Calculus (SL & HL)", color: "from-violet-500 to-purple-600", icon: "IB", curriculum: "IB", subject: "Mathematics AA", grades: ["SL", "HL"] },
  { slug: "ib-chemistry", label: "IB Chemistry", description: "Structure & Reactivity framework — Bonding, Energetics, Kinetics, Organic (SL & HL)", color: "from-emerald-500 to-emerald-600", icon: "IB", curriculum: "IB", subject: "Chemistry", grades: ["SL", "HL"] },

  // IGCSE
  { slug: "igcse-physics", label: "IGCSE Physics", description: "Motion, Thermal Physics, Waves, Electricity, Nuclear & Space Physics", color: "from-orange-500 to-orange-600", icon: "IG", curriculum: "IGCSE", subject: "Physics", grades: ["Core"] },
  { slug: "igcse-mathematics", label: "IGCSE Mathematics", description: "Number, Algebra, Geometry, Trigonometry, Statistics & Probability", color: "from-amber-500 to-amber-600", icon: "IG", curriculum: "IGCSE", subject: "Mathematics", grades: ["Extended"] },

  // A-Level
  { slug: "a-level-biology", label: "A-Level Biology", description: "Cell Biology, Genetics, Ecology, Respiration, Photosynthesis & more (AS & A2)", color: "from-green-500 to-green-600", icon: "AL", curriculum: "A-Level", subject: "Biology", grades: ["AS", "A2"] },
];

export default function ResourcesHubPage() {
  const [resourceCounts, setResourceCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCounts() {
      try {
        const allResources = await getPublishedResources(DEFAULT_TENANT_ID);
        // Build counts keyed by "curriculum|subject"
        const counts: Record<string, number> = {};
        allResources.forEach((r: any) => {
          const key = `${r.curriculum}|${r.subject}|${r.grade}`;
          counts[key] = (counts[key] || 0) + 1;
        });
        setResourceCounts(counts);
      } catch {
        // Silently handle
      } finally {
        setLoading(false);
      }
    }
    loadCounts();
  }, []);

  function getCountForCard(card: CourseCard): number {
    let total = 0;
    card.grades.forEach((g) => {
      const key = `${card.curriculum}|${card.subject}|${g}`;
      total += resourceCounts[key] || 0;
    });
    return total;
  }

  // Group cards by curriculum
  const cbseCards = COURSE_CARDS.filter((c) => c.curriculum === "CBSE");
  const ibCards = COURSE_CARDS.filter((c) => c.curriculum === "IB");
  const igcseCards = COURSE_CARDS.filter((c) => c.curriculum === "IGCSE");
  const aLevelCards = COURSE_CARDS.filter((c) => c.curriculum === "A-Level");

  function renderSection(title: string, subtitle: string, cards: CourseCard[]) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-headline text-2xl font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card) => {
            const count = getCountForCard(card);
            return (
              <Link key={card.slug} href={`/resources/${card.slug}`}>
                <SpotlightCard className="h-full group">
                  <div className="flex flex-col h-full space-y-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm">{card.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-headline text-lg font-bold mb-1">{card.label}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          {count} {count === 1 ? "resource" : "resources"}
                        </Badge>
                      )}
                      <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Explore <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </SpotlightCard>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center px-6 overflow-hidden bg-background">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10 pt-20 pb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary mb-4">
            <BookOpen className="w-4 h-4" />
            Free Study Resources
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold tracking-tight leading-[1.1]">
            Study Resources Hub
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Syllabus outlines, past year papers, study guides, and FAQs — covering CBSE, IB, IGCSE, and A-Level curricula.
          </p>
        </div>
      </section>

      {/* Content Type Legend */}
      <section className="px-6 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Syllabus Outlines</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="w-4 h-4 text-purple-600" />
              <span>Past Year Papers</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Lightbulb className="w-4 h-4 text-green-600" />
              <span>Study Guides</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>FAQs</span>
            </div>
          </div>
        </div>
      </section>

      {/* All Sections */}
      <section className="px-6 pb-24 space-y-16">
        <div className="max-w-6xl mx-auto space-y-16">
          {renderSection("CBSE Mathematics", "Grades 8–12 — Complete chapter-wise syllabus aligned to CBSE 2024-25", cbseCards)}
          {renderSection("IB Diploma Programme", "SL & HL — Analysis & Approaches, Chemistry", ibCards)}
          {renderSection("Cambridge IGCSE", "Core & Extended — Physics, Mathematics", igcseCards)}
          {renderSection("Cambridge A-Level", "AS & A2 — Biology", aLevelCards)}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-primary/5 border-y border-primary/10">
        <div className="max-w-lg mx-auto">
          <div className="rounded-2xl border border-primary/20 bg-card/80 backdrop-blur-md p-8 md:p-10 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="font-headline text-2xl md:text-3xl font-bold mb-2">Need Expert Tutoring?</h2>
              <p className="text-sm text-muted-foreground">Book a free consultation today. We&apos;ll call you within 2 hours.</p>
            </div>
            <LeadCaptureForm variant="minimal" />
          </div>
        </div>
      </section>
    </>
  );
}
