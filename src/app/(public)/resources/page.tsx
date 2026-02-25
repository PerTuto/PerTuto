"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, FileText, HelpCircle, Lightbulb, ArrowRight, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPublishedResources } from "@/lib/firebase/services";
import { SpotlightCard } from "@/components/public/spotlight-card";
import { LeadCaptureForm } from "@/components/public/lead-capture-form";

const DEFAULT_TENANT_ID = "pertuto-default";

const GRADES = [
  { grade: "8", label: "Class 8", description: "Foundation of algebra, geometry, and data handling", color: "from-blue-500 to-blue-600" },
  { grade: "9", label: "Class 9", description: "Number systems, polynomials, coordinate geometry", color: "from-indigo-500 to-indigo-600" },
  { grade: "10", label: "Class 10", description: "Board exam preparation — algebra, trigonometry, statistics", color: "from-violet-500 to-violet-600" },
  { grade: "11", label: "Class 11", description: "Sets, calculus foundations, complex numbers, conics", color: "from-purple-500 to-purple-600" },
  { grade: "12", label: "Class 12", description: "Board exam — calculus, vectors, linear programming, probability", color: "from-fuchsia-500 to-fuchsia-600" },
];

export default function ResourcesHubPage() {
  const [resourceCounts, setResourceCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCounts() {
      try {
        const allResources = await getPublishedResources(DEFAULT_TENANT_ID);
        const counts: Record<string, number> = {};
        allResources.forEach((r: any) => {
          counts[r.grade] = (counts[r.grade] || 0) + 1;
        });
        setResourceCounts(counts);
      } catch {
        // Silently handle — show 0 counts
      } finally {
        setLoading(false);
      }
    }
    loadCounts();
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center px-6 overflow-hidden bg-background">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10 pt-20 pb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary mb-4">
            <BookOpen className="w-4 h-4" />
            Free CBSE Resources
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold tracking-tight leading-[1.1]">
            CBSE Mathematics Resources
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Complete syllabus outlines, past year papers, study guides, and FAQs for CBSE Mathematics — from Class 8 to Class 12.
          </p>
        </div>
      </section>

      {/* Content Type Legend */}
      <section className="px-6 pb-8">
        <div className="max-w-5xl mx-auto">
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

      {/* Grade Cards */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GRADES.map((g) => {
              const count = resourceCounts[g.grade] || 0;
              const slug = `cbse-mathematics-${g.grade}`;

              return (
                <Link key={g.grade} href={`/resources/${slug}`}>
                  <SpotlightCard className="h-full group">
                    <div className="flex flex-col h-full space-y-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${g.color} flex items-center justify-center`}>
                        <span className="text-white font-bold text-lg">{g.grade}</span>
                      </div>
                      <div>
                        <h3 className="font-headline text-xl font-bold mb-1">{g.label}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{g.description}</p>
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
              <h2 className="font-headline text-2xl md:text-3xl font-bold mb-2">Need Help with CBSE Math?</h2>
              <p className="text-sm text-muted-foreground">Book a free consultation today. We&apos;ll call you within 2 hours.</p>
            </div>
            <LeadCaptureForm variant="minimal" />
          </div>
        </div>
      </section>
    </>
  );
}
