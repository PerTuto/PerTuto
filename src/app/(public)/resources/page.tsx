"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, FileText, HelpCircle, Lightbulb, ArrowRight, Loader2, GraduationCap, Code2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPublishedResources } from "@/lib/firebase/services";
import { SpotlightCard } from "@/components/public/spotlight-card";
import { LeadCaptureForm } from "@/components/public/lead-capture-form";
import { cn } from "@/lib/utils";

const DEFAULT_TENANT_ID = "pertuto-default";

type CourseCard = {
  slug: string;
  label: string;
  description: string;
  color: string;
  icon: string;
  curriculum: string;
  subject: string;
  grades: string[];
};

const VERTICALS = [
  { id: "k12", label: "K-12 Tutoring", subtitle: "IB, IGCSE, A-Level, CBSE", icon: BookOpen },
  { id: "higher-ed", label: "Higher Education", subtitle: "University, Research, Academic Writing", icon: GraduationCap },
  { id: "professional", label: "Professional Upskilling", subtitle: "AI, Data Science, Web Dev, Cloud", icon: Code2 },
];

// ═══════════ K-12 CARDS ═══════════
const K12_CARDS: CourseCard[] = [
  { slug: "cbse-mathematics-8", label: "CBSE Math — Class 8", description: "Rational numbers, algebraic expressions, mensuration", color: "from-blue-500 to-blue-600", icon: "8", curriculum: "CBSE", subject: "Mathematics", grades: ["8"] },
  { slug: "cbse-mathematics-9", label: "CBSE Math — Class 9", description: "Number systems, polynomials, coordinate geometry", color: "from-blue-600 to-blue-700", icon: "9", curriculum: "CBSE", subject: "Mathematics", grades: ["9"] },
  { slug: "cbse-mathematics-10", label: "CBSE Math — Class 10", description: "Board exam — algebra, trigonometry, statistics", color: "from-blue-700 to-indigo-600", icon: "10", curriculum: "CBSE", subject: "Mathematics", grades: ["10"] },
  { slug: "cbse-mathematics-11", label: "CBSE Math — Class 11", description: "Sets, calculus, complex numbers, conics", color: "from-indigo-500 to-indigo-600", icon: "11", curriculum: "CBSE", subject: "Mathematics", grades: ["11"] },
  { slug: "cbse-mathematics-12", label: "CBSE Math — Class 12", description: "Board exam — calculus, vectors, probability", color: "from-indigo-600 to-violet-600", icon: "12", curriculum: "CBSE", subject: "Mathematics", grades: ["12"] },
  { slug: "ib-mathematics-aa", label: "IB Math AA", description: "Analysis & Approaches — SL & HL", color: "from-violet-500 to-purple-600", icon: "IB", curriculum: "IB", subject: "Mathematics AA", grades: ["SL", "HL"] },
  { slug: "ib-chemistry", label: "IB Chemistry", description: "Structure & Reactivity — SL & HL", color: "from-emerald-500 to-emerald-600", icon: "IB", curriculum: "IB", subject: "Chemistry", grades: ["SL", "HL"] },
  { slug: "igcse-physics", label: "IGCSE Physics", description: "Motion, Waves, Electricity, Nuclear Physics", color: "from-orange-500 to-orange-600", icon: "IG", curriculum: "IGCSE", subject: "Physics", grades: ["Core"] },
  { slug: "igcse-mathematics", label: "IGCSE Mathematics", description: "Number, Algebra, Geometry, Statistics", color: "from-amber-500 to-amber-600", icon: "IG", curriculum: "IGCSE", subject: "Mathematics", grades: ["Extended"] },
  { slug: "a-level-biology", label: "A-Level Biology", description: "Cell Biology, Genetics, Ecology — AS & A2", color: "from-green-500 to-green-600", icon: "AL", curriculum: "A-Level", subject: "Biology", grades: ["AS", "A2"] },
];

// ═══════════ HIGHER ED CARDS ═══════════
const HIGHER_ED_CARDS: CourseCard[] = [
  { slug: "university-mathematics", label: "University Mathematics", description: "Calculus I/II/III, Linear Algebra, Differential Equations, Discrete Math", color: "from-sky-500 to-sky-600", icon: "∫", curriculum: "University", subject: "Mathematics", grades: ["Undergraduate"] },
  { slug: "university-statistics", label: "Statistics & Probability", description: "Descriptive stats, distributions, hypothesis testing, regression", color: "from-cyan-500 to-cyan-600", icon: "σ", curriculum: "University", subject: "Statistics", grades: ["Undergraduate"] },
  { slug: "research-methods", label: "Research Methods", description: "Research design, data collection, qualitative & quantitative analysis", color: "from-teal-500 to-teal-600", icon: "R", curriculum: "University", subject: "Research Methods", grades: ["Postgraduate"] },
  { slug: "academic-writing", label: "Academic Writing", description: "Essay structure, thesis writing, critical analysis, APA/MLA", color: "from-slate-500 to-slate-600", icon: "✎", curriculum: "University", subject: "Academic Writing", grades: ["All Levels", "Postgraduate"] },
];

// ═══════════ PROFESSIONAL CARDS ═══════════
const PROFESSIONAL_CARDS: CourseCard[] = [
  { slug: "python-programming", label: "Python Programming", description: "Foundations → OOP → Concurrency & Production", color: "from-yellow-500 to-yellow-600", icon: "Py", curriculum: "Professional", subject: "Python", grades: ["Beginner", "Intermediate", "Advanced"] },
  { slug: "data-science-ml", label: "Data Science & ML", description: "NumPy, Pandas, Scikit-learn, Deep Learning, NLP", color: "from-pink-500 to-pink-600", icon: "ML", curriculum: "Professional", subject: "Data Science", grades: ["Beginner", "Intermediate", "Advanced"] },
  { slug: "sql-databases", label: "SQL & Databases", description: "Queries, joins, indexing, PostgreSQL, NoSQL", color: "from-rose-500 to-rose-600", icon: "DB", curriculum: "Professional", subject: "SQL & Databases", grades: ["Beginner", "Intermediate"] },
  { slug: "web-development", label: "Web Development", description: "HTML/CSS/JS, React, Next.js, Node.js, APIs", color: "from-fuchsia-500 to-fuchsia-600", icon: "WD", curriculum: "Professional", subject: "Web Development", grades: ["Beginner", "Intermediate"] },
  { slug: "cloud-devops", label: "Cloud & DevOps", description: "AWS/GCP, Docker, CI/CD, Terraform, Kubernetes", color: "from-lime-600 to-lime-700", icon: "☁", curriculum: "Professional", subject: "Cloud & DevOps", grades: ["Beginner", "Intermediate"] },
];

const ALL_CARDS: Record<string, CourseCard[]> = {
  k12: K12_CARDS,
  "higher-ed": HIGHER_ED_CARDS,
  professional: PROFESSIONAL_CARDS,
};

export default function ResourcesHubPage() {
  const [activeVertical, setActiveVertical] = useState("k12");
  const [resourceCounts, setResourceCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCounts() {
      try {
        const allResources = await getPublishedResources(DEFAULT_TENANT_ID);
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

  const cards = ALL_CARDS[activeVertical] || K12_CARDS;

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[45vh] flex items-center justify-center px-6 overflow-hidden bg-background">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10 pt-20 pb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary mb-4">
            <BookOpen className="w-4 h-4" />
            Free Study Resources
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold tracking-tight leading-[1.1]">
            Study Resources Hub
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Syllabus outlines, past papers, study guides, and FAQs — covering K-12, university, and professional tracks.
          </p>
        </div>
      </section>

      {/* Vertical Tabs */}
      <section className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-1 overflow-x-auto py-2">
            {VERTICALS.map((v) => {
              const Icon = v.icon;
              const isActive = activeVertical === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setActiveVertical(v.id)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {v.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Content Type Legend */}
      <section className="px-6 py-6">
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

      {/* Card Grid */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {VERTICALS.find(v => v.id === activeVertical)?.subtitle}
            </p>
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
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-primary/5 border-y border-primary/10">
        <div className="max-w-lg mx-auto">
          <div className="rounded-2xl border border-primary/20 bg-card/80 backdrop-blur-md p-8 md:p-10 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="font-headline text-2xl md:text-3xl font-bold mb-2">
                {activeVertical === "k12" ? "Need Expert Tutoring?" : activeVertical === "higher-ed" ? "Stuck on Your Studies?" : "Ready to Level Up?"}
              </h2>
              <p className="text-sm text-muted-foreground">Book a free consultation today. We&apos;ll call you within 2 hours.</p>
            </div>
            <LeadCaptureForm variant="minimal" />
          </div>
        </div>
      </section>
    </>
  );
}
