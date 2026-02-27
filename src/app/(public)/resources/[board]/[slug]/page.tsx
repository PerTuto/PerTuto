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
  Clock,
  Award,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  FileDown,
  Layers,
  Target,
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

/* ─── Syllabus chapter card ─── */
function SyllabusChapter({ r, expanded, onToggle }: { r: any; expanded: boolean; onToggle: () => void }) {
  const hasStructured = r.overview || r.keyTopics?.length || r.formulas?.length;

  return (
    <Card className="overflow-hidden border border-border/60 shadow-sm transition-all duration-300 hover:shadow-md">
      <button
        className="w-full p-5 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <span className="font-semibold block truncate">{r.title}</span>
            {r.unit && (
              <span className="text-xs text-muted-foreground">{r.unit}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {r.weightage && (
            <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[11px] font-semibold hidden sm:inline-flex">
              <Award className="w-3 h-3 mr-1" />
              {r.weightage}
            </Badge>
          )}
          {expanded ? (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {expanded && (
        <CardContent className="pt-0 pb-6 px-5 animate-fade-in">
          <div className="pl-12 space-y-5">
            {/* Weightage badge (mobile) */}
            {r.weightage && (
              <div className="sm:hidden">
                <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[11px] font-semibold">
                  <Award className="w-3 h-3 mr-1" />
                  {r.weightage}
                </Badge>
              </div>
            )}

            {/* Overview */}
            {r.overview && (
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                {r.overview}
              </p>
            )}

            {/* Key Topics as pill chips */}
            {r.keyTopics && r.keyTopics.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  Key Topics
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {r.keyTopics.map((topic: string, i: number) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/8 text-primary border border-primary/15 transition-colors hover:bg-primary/15"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Formulas table */}
            {r.formulas && r.formulas.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Key Formulas
                </h4>
                <div className="rounded-lg border border-primary/15 overflow-hidden bg-primary/[0.02]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-primary/10 bg-primary/5">
                        <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary/70">
                          Name
                        </th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary/70">
                          Formula
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {r.formulas.map((f: { name: string; formula: string }, i: number) => (
                        <tr
                          key={i}
                          className={cn(
                            "border-b border-primary/5 last:border-0",
                            i % 2 === 1 && "bg-primary/[0.02]"
                          )}
                        >
                          <td className="px-4 py-2.5 text-muted-foreground font-medium whitespace-nowrap">{f.name}</td>
                          <td className="px-4 py-2.5 font-mono text-foreground text-[13px]">{f.formula}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Exam Tips */}
            {r.examTips && r.examTips.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  Exam Tips
                </h4>
                <ul className="space-y-2">
                  {r.examTips.map((tip: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* NCERT Link */}
            {r.ncertUrl && (
              <div className="pt-1">
                <a
                  href={r.ncertUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Read on NCERT
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Fallback: Raw markdown for non-structured content */}
            {!hasStructured && r.content && (
              <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {r.content}
                </ReactMarkdown>
              </div>
            )}

            {/* Tags */}
            {r.tags && r.tags.length > 0 && (
              <div className="flex items-center gap-1.5 pt-2 border-t border-border/40">
                <Tag className="w-3 h-3 text-muted-foreground/50" />
                {r.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-[10px] text-muted-foreground/60 border-border/40">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

/* ─── Past paper card ─── */
function PastPaperCard({ r }: { r: any }) {
  const hasStructured = r.totalMarks || r.sections?.length;

  return (
    <Card className="overflow-hidden border border-border/60 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col">
      {/* Coloured header strip */}
      <div className="h-1.5 bg-gradient-to-r from-primary via-primary/70 to-accent/60" />

      <CardContent className="p-5 flex flex-col flex-1">
        {/* Title & Year */}
        <div className="mb-4">
          <h3 className="font-semibold text-[15px] leading-snug mb-1">{r.title}</h3>
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            {r.year && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {r.year}
              </span>
            )}
            {r.session && <span>· {r.session}</span>}
            {r.paperCode && <span>· Code {r.paperCode}</span>}
          </div>
        </div>

        {/* Structured Metadata */}
        {hasStructured && (
          <>
            {/* Marks / Duration / Sections row */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {r.totalMarks && (
                <div className="flex flex-col items-center py-2.5 px-2 rounded-lg bg-muted/60">
                  <FileText className="w-4 h-4 text-primary mb-1" />
                  <span className="text-lg font-bold">{r.totalMarks}</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Marks</span>
                </div>
              )}
              {r.duration && (
                <div className="flex flex-col items-center py-2.5 px-2 rounded-lg bg-muted/60">
                  <Clock className="w-4 h-4 text-primary mb-1" />
                  <span className="text-lg font-bold">{r.duration.replace(' hours', 'h')}</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Duration</span>
                </div>
              )}
              {r.sections && (
                <div className="flex flex-col items-center py-2.5 px-2 rounded-lg bg-muted/60">
                  <Layers className="w-4 h-4 text-primary mb-1" />
                  <span className="text-lg font-bold">{r.sections.length}</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Sections</span>
                </div>
              )}
            </div>

            {/* Sections breakdown chips */}
            {r.sections && r.sections.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {r.sections.map((s: any, i: number) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-muted/80 text-foreground/80 border border-border/40"
                  >
                    {s.count} {s.type.split(' ')[0]}{s.type.includes('/') ? '' : s.count > 1 ? 's' : ''}
                  </span>
                ))}
              </div>
            )}
          </>
        )}

        {/* Description (if any) */}
        {r.content && (
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{r.content}</p>
        )}

        {/* Action buttons — pushed to bottom */}
        <div className="mt-auto pt-3 border-t border-border/30 flex items-center gap-2">
          {r.fileUrl ? (
            <Button asChild size="sm" className="gap-2 flex-1">
              <a href={r.fileUrl} target="_blank" rel="noopener noreferrer">
                <Download className="w-4 h-4" />
                Download PDF
              </a>
            </Button>
          ) : (
            <Badge variant="outline" className="text-xs flex-1 justify-center py-1.5">Coming soon</Badge>
          )}
          {r.markingSchemeUrl && (
            <Button asChild size="sm" variant="outline" className="gap-2">
              <a href={r.markingSchemeUrl} target="_blank" rel="noopener noreferrer">
                <FileDown className="w-4 h-4" />
                Marking Scheme
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


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
        const allResources = await getPublishedResources(DEFAULT_TENANT_ID);
        
        // Filter by board matching and slug keywords matching
        const filtered = allResources.filter((r: Resource) => {
          const matchesBoard = r.board?.toLowerCase() === boardParam || r.curriculum?.toLowerCase() === boardParam;
          if (!matchesBoard) return false;
          
          const expectedSlug = r.grade ? 
            `${r.subject.toLowerCase().replace(/\s+/g, '-')}-${r.grade.toLowerCase().replace(/\s+/g, '-')}` : 
            r.subject.toLowerCase().replace(/\s+/g, '-');
            
          return slug === expectedSlug;
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
    router.push(`/resources/${boardParam}/${slug}?tab=${tab}`, { scroll: false });
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
            href={`/resources/${boardParam}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to {boardParam.toUpperCase()} Resources
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
            <>
              {/* Syllabus Tab — Rich Accordion */}
              {activeTab === "syllabus" && (
                <div className="space-y-3">
                  {filteredResources.map((r) => (
                    <SyllabusChapter
                      key={r.id}
                      r={r}
                      expanded={expandedItems.has(r.id)}
                      onToggle={() => toggleExpand(r.id)}
                    />
                  ))}
                </div>
              )}

              {/* Past Papers Tab — 2-column Grid */}
              {activeTab === "past-papers" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredResources.map((r) => (
                    <PastPaperCard key={r.id} r={r} />
                  ))}
                </div>
              )}

              {/* Study Guides Tab — Content Cards */}
              {activeTab === "study-guides" &&
                filteredResources.map((r) => (
                  <Card key={r.id} className="overflow-hidden mb-4">
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
                    <Card key={r.id} className="overflow-hidden mb-4">
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
            </>
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
