import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ExternalLink, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getPublishedResources } from "@/lib/firebase/services";
import { Resource } from "@/lib/types";

const DEFAULT_TENANT_ID = "pertuto-default";

// Board descriptions and metadata for SEO and header
const BOARD_METADATA: Record<string, { title: string, description: string }> = {
  // K-12
  "ib": { title: "IB Resources", description: "Comprehensive study materials, past papers, and IA guides for the International Baccalaureate Programme." },
  "caie": { title: "CAIE Resources", description: "Expertly curated notes and exam prep for Cambridge IGCSE and A-Levels." },
  "edexcel": { title: "Edexcel Resources", description: "Dedicated revision materials and syllabus breakdowns for Edexcel International GCSEs and A-Levels." },
  "cbse": { title: "CBSE Resources", description: "Chapter-wise notes, NCERT solutions, and sample papers for CBSE Class 9 to 12." },
  "icse": { title: "ICSE Resources", description: "Premium study materials tailored specifically for the rigorous ICSE board." },
  "ap": { title: "AP Resources", description: "High-yield review sheets and practice tests for Advanced Placement subjects." },
  "moe": { title: "UAE MOE Resources", description: "Bilingual support and curriculum-aligned materials for UAE National Curriculum students." },

  // Higher Ed
  "engineering": { title: "University Engineering", description: "Advanced calculus, physics, and major-specific resources for engineering undergraduates." },
  "computer-science": { title: "Computer Science", description: "Algorithms, data structures, and programming paradigms for CS majors." },
  "business": { title: "Business & Finance", description: "Accounting, microeconomics, and corporate finance study guides." },
  
  // Professional
  "ai-ml": { title: "AI & Machine Learning", description: "Upskilling paths from foundational Python to advanced deep learning architectures." },
  "data-science": { title: "Data Science", description: "Practical guides on pandas, SQL, and statistical modelling for data professionals." },
  "web-dev": { title: "Web Development", description: "Modern React, Next.js, and comprehensive backend engineering resources." }
};

export async function generateMetadata({ params }: { params: Promise<{ board: string }> }) {
  const resolvedParams = await params;
  const boardData = BOARD_METADATA[resolvedParams.board.toLowerCase()];
  if (!boardData) return { title: "Resources | PerTuto" };
  return {
    title: `${boardData.title} | PerTuto Resources`,
    description: boardData.description,
  };
}

export default async function BoardPage({ params }: { params: Promise<{ board: string }> }) {
  const resolvedParams = await params;
  const boardId = resolvedParams.board.toLowerCase();
  const boardData = BOARD_METADATA[boardId];

  if (!boardData) {
    notFound();
  }

  // Fetch only resources specifically matching this board
  const resources = await getPublishedResources(DEFAULT_TENANT_ID);
  const boardResources = resources.filter(
    (r: Resource) => r.board?.toLowerCase() === boardId || r.curriculum?.toLowerCase() === boardId
  );

  // Group by grade/level, then by subject
  const groupedResources = boardResources.reduce((acc: Record<string, Resource[]>, resource: Resource) => {
    const level = resource.grade || "General";
    if (!acc[level]) acc[level] = [];
    acc[level].push(resource);
    return acc;
  }, {} as Record<string, Resource[]>);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Setup */}
        <div className="space-y-4">
          <Link href="/resources" className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700">
            <ArrowLeft className="w-4 h-4 me-1" /> Back to All Resources
          </Link>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-slate-900 tracking-tight">
              {boardData.title}
            </h1>
            <p className="mt-4 text-xl text-slate-600 leading-relaxed">
              {boardData.description}
            </p>
          </div>
        </div>

        {/* Dynamic Level Sections */}
        {Object.keys(groupedResources).length === 0 && (
          <div className="py-24 text-center">
            <p className="text-lg text-slate-500">We are currently updating our {boardData.title} materials. Check back soon!</p>
          </div>
        )}

        {Object.keys(groupedResources).length > 0 && (
          <div className="space-y-16">
            {Object.keys(groupedResources).sort((a, b) => {
              const strA = a.toUpperCase();
              const strB = b.toUpperCase();
              if (strA === strB) return 0;
              if (strA === "K") return -1;
              if (strB === "K") return 1;
              
              const numA = parseInt(a);
              const numB = parseInt(b);
              const isValidA = !isNaN(numA);
              const isValidB = !isNaN(numB);
              
              if (isValidA && isValidB) return numA - numB;
              if (isValidA && !isValidB) return -1;
              if (!isValidA && isValidB) return 1;
              
              return a.localeCompare(b);
            }).map(level => {
              const levelResources = groupedResources[level];
              
              // Group within level by subject
              const subjects = Array.from(new Set<string>(levelResources.map((r: Resource) => r.subject)));

              return (
                <section key={level} className="space-y-6">
                  <div className="border-b pb-4">
                    <h2 className="text-2xl font-headline font-bold text-slate-900">
                      Level: {level.toUpperCase()}
                    </h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map((subject: string) => {
                      // Get the slug for the first syllabus resource, or falling back to a safe URL
                      const firstRes = levelResources.find((r: Resource) => r.subject === subject);
                      const slug = firstRes ? `${firstRes.subject.toLowerCase().replace(/\s+/g, '-')}-${firstRes.grade.toLowerCase().replace(/\s+/g, '-')}` : subject.toLowerCase().replace(/\s+/g, '-');
                      
                      return (
                        <Link key={subject} href={`/resources/${boardId}/${slug}`} className="block group">
                          <Card className="h-full border-slate-200 transition-all duration-300 hover:border-emerald-200 hover:shadow-lg hover:-translate-y-1 bg-white">
                            <CardHeader className="pb-4">
                              <CardTitle className="flex items-center justify-between text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                                {subject}
                                <ChevronRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                              </CardTitle>
                              <CardDescription>
                                {levelResources.filter((r: Resource) => r.subject === subject).length} resources available
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-slate-600 line-clamp-2">
                                Access complete syllabus breakdowns, topic-wise practice questions, and curated past paper solutions for {subject}.
                              </p>
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
