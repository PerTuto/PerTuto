"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  Lightbulb,
  HelpCircle,
  Download,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Loader2,
  Calendar,
  Tag,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPublishedResources } from "@/lib/firebase/services";
import { ResourceType } from "@/lib/types";
import type { Resource } from "@/lib/types";
import { cn } from "@/lib/utils";
import { LeadCaptureForm } from "@/components/public/lead-capture-form";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const DEFAULT_TENANT_ID = "pertuto-default";

const TABS = [
  { id: "syllabus", label: "Syllabus", icon: BookOpen, type: ResourceType.Syllabus },
  { id: "past-papers", label: "Past Papers", icon: FileText, type: ResourceType.PastPaper },
  { id: "study-guides", label: "Study Guides", icon: Lightbulb, type: ResourceType.StudyGuide },
  { id: "faqs", label: "FAQs", icon: HelpCircle, type: ResourceType.FAQ },
];

function GradePageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params.slug as string;
  const boardParam = (params.board as string)?.toLowerCase();

  // Create a clean title from the slug (e.g., mathematics-aa-sl -> Mathematics Aa Sl)
  const cleanTitle = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const title = `${boardParam.toUpperCase()} — ${cleanTitle}`;

  const activeTab = searchParams.get("tab") || "syllabus";

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function load() {
      try {
        // Fetch all published resources
        const [allResources] = await getPublishedResources(DEFAULT_TENANT_ID);
        
        // Filter by board matching and slug keywords matching
        const slugKeywords = slug.toLowerCase().split("-");
        
        const filtered = allResources.filter((r: Resource) => {
          const matchesBoard = r.board?.toLowerCase() === boardParam || r.curriculum?.toLowerCase() === boardParam;
          if (!matchesBoard) return false;
          
          const searchString = `${r.subject} ${r.grade}`.toLowerCase();
          return slugKeywords.every(kw => searchString.includes(kw));
        });

        setResources(filtered.sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0)));
      } catch {
        // Silently handle
      } finally {
        setLoading(false);
      }
    }
    if (slug && boardParam) load();
  }, [slug, boardParam]);

  const activeTabData = TABS.find((t) => t.id === activeTab) || TABS[0];
  const filteredResources = useMemo(
    () => resources.filter((r) => r.type === activeTabData.type),
    [resources, activeTabData]
  );

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    TABS.forEach((t) => {
      counts[t.id] = resources.filter((r) => r.type === t.type).length;
    });
    return counts;
  }, [resources]);

  function toggleExpand(id: string) {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function setTab(tab: string) {
    router.push(`/resources/${slug}?tab=${tab}`, { scroll: false });
  }

  // Schema.org FAQPage (only for FAQ tab)
  const faqJsonLd =
    activeTab === "faqs" && filteredResources.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: filteredResources.map((r) => ({
            "@type": "Question",
            name: r.title,
            acceptedAnswer: {
              "@type": "Answer",
              text: r.content,
            },
          })),
        }
      : null;

  return (
    <>
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* Header */}
      <section className="pt-24 pb-8 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All Resources
          </Link>
          <h1 className="text-3xl md:text-4xl font-headline font-bold tracking-tight mb-2">
            {title}
          </h1>
          <p className="text-muted-foreground text-lg">
            Complete study resources — syllabus outlines, past papers, study guides, and FAQs.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-1 overflow-x-auto py-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const count = tabCounts[tab.id] || 0;
              return (
                <button
                  key={tab.id}
                  onClick={() => setTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {count > 0 && (
                    <Badge
                      variant={isActive ? "secondary" : "outline"}
                      className="text-[10px] h-5 px-1.5"
                    >
                      {count}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <activeTabData.icon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">No {activeTabData.label} Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {activeTabData.label} for {title} are coming soon. Check back later!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Syllabus Tab — Accordion */}
              {activeTab === "syllabus" &&
                filteredResources.map((r) => {
                  const expanded = expandedItems.has(r.id);
                  return (
                    <Card key={r.id} className="overflow-hidden">
                      <button
                        className="w-full p-5 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
                        onClick={() => toggleExpand(r.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center shrink-0">
                            <BookOpen className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="font-semibold">{r.title}</span>
                        </div>
                        {expanded ? (
                          <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                        )}
                      </button>
                      {expanded && (
                        <CardContent className="pt-0 pb-5 px-5">
                          <div className="pl-11 prose prose-sm dark:prose-invert max-w-none text-slate-700">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {r.content}
                            </ReactMarkdown>
                          </div>
                          {r.tags && r.tags.length > 0 && (
                            <div className="flex items-center gap-1.5 pl-11 mt-4">
                              <Tag className="w-3 h-3 text-muted-foreground" />
                              {r.tags.map((tag: string) => (
                                <Badge key={tag} variant="outline" className="text-[10px]">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      )}
                    </Card>
                  );
                })}

              {/* Past Papers Tab — Download Cards */}
              {activeTab === "past-papers" &&
                filteredResources.map((r) => (
                  <Card key={r.id} className="overflow-hidden">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{r.title}</h3>
                            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                              {r.year && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" /> {r.year}
                                </span>
                              )}
                              {r.session && <span>· {r.session}</span>}
                            </div>
                          </div>
                        </div>
                        {r.fileUrl ? (
                          <Button asChild size="sm" variant="outline" className="gap-2">
                            <a href={r.fileUrl} target="_blank" rel="noopener noreferrer" download>
                              <Download className="w-4 h-4" /> Download PDF
                            </a>
                          </Button>
                        ) : (
                          <Badge variant="outline" className="text-xs">Coming soon</Badge>
                        )}
                      </div>
                      {r.content && (
                        <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 mt-3 pl-[52px]">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {r.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

              {/* Study Guides Tab — Content Cards */}
              {activeTab === "study-guides" &&
                filteredResources.map((r) => (
                  <Card key={r.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-950/30 flex items-center justify-center shrink-0">
                          <Lightbulb className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-lg">{r.title}</h3>
                      </div>
                      <div className="prose prose-sm dark:prose-invert max-w-none pl-[52px] text-slate-700">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {r.content}
                        </ReactMarkdown>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {/* FAQs Tab — Q&A Accordion */}
              {activeTab === "faqs" &&
                filteredResources.map((r) => {
                  const expanded = expandedItems.has(r.id);
                  return (
                    <Card key={r.id} className="overflow-hidden">
                      <button
                        className="w-full p-5 text-left flex items-start gap-3 hover:bg-muted/30 transition-colors"
                        onClick={() => toggleExpand(r.id)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center shrink-0 mt-0.5">
                          <HelpCircle className="w-4 h-4 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold">{r.title}</span>
                        </div>
                        {expanded ? (
                          <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                        )}
                      </button>
                      {expanded && (
                        <CardContent className="pt-0 pb-5 px-5">
                          <div className="pl-11 prose prose-sm dark:prose-invert max-w-none text-slate-700">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {r.content}
                            </ReactMarkdown>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-primary/5 border-y border-primary/10">
        <div className="max-w-lg mx-auto">
          <div className="rounded-2xl border border-primary/20 bg-card/80 backdrop-blur-md p-8 md:p-10 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="font-headline text-2xl md:text-3xl font-bold mb-2">
                Need Help with {title}?
              </h2>
              <p className="text-sm text-muted-foreground">
                Book a free consultation. We&apos;ll create a personalized study plan for your child.
              </p>
            </div>
            <LeadCaptureForm variant="minimal" />
          </div>
        </div>
      </section>
    </>
  );
}

export default function GradeResourcePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <GradePageContent />
    </Suspense>
  );
}
