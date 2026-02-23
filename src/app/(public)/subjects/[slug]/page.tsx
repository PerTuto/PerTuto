import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSubjectBySlug, subjectsData } from '@/data/subjects';
import { SpotlightCard } from '@/components/public/spotlight-card';
import { LeadCaptureForm } from '@/components/public/lead-capture-form';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, BookOpen, AlertCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';

// Generate static params so these pages are built at compile time (SSG)
export async function generateStaticParams() {
  return subjectsData.map((subject) => ({
    slug: subject.slug,
  }));
}

// Dynamically generate SEO metadata based on the subject slug
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const subject = getSubjectBySlug(resolvedParams.slug);

  if (!subject) {
    return { title: 'Subject Not Found' };
  }

  return {
    title: subject.seoTitle,
    description: subject.seoDescription,
    openGraph: {
      title: subject.seoTitle,
      description: subject.seoDescription,
      type: 'website',
    },
  };
}

export default async function SubjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const subject = getSubjectBySlug(resolvedParams.slug);

  if (!subject) {
    notFound();
  }

  return (
    <>
      {/* ===== HERO (Dynamic) ===== */}
      <section className="relative min-h-[70vh] flex items-center justify-center px-6 overflow-hidden bg-background">
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10 pt-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary mb-4">
            <BookOpen className="w-4 h-4" />
            Specialized Tutoring Dubai
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-bold tracking-tight leading-[1.1]">
            {subject.hero.headline}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {subject.hero.subheadline}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="#book-demo">
              <Button size="lg" className="h-12 px-8 text-base font-semibold">
                {subject.hero.ctaText} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PROBLEM SECTION (PAS Framework) ===== */}
      <section className="py-24 px-6 bg-card/20 border-y border-border/20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="font-headline text-3xl md:text-4xl font-bold">
            {subject.problemSection.heading}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {subject.problemSection.paragraph}
          </p>
        </div>
      </section>

      {/* ===== AGITATE SECTION (PAS Framework) ===== */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-headline text-3xl font-bold text-center mb-12">
            {subject.agitateSection.heading}
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {subject.agitateSection.bulletPoints.map((point, index) => (
              <div key={index} className="bg-card/50 border border-border/50 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-destructive/60"></div>
                <p className="text-muted-foreground leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SOLUTION SECTION (PAS Framework) ===== */}
      <section className="py-24 px-6 bg-primary/5 border-y border-primary/10">
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-headline text-3xl md:text-4xl font-bold">
            {subject.solutionSection.heading}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {subject.solutionSection.paragraph}
          </p>
        </div>

        {/* Features Grid */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {subject.features.map((feature, index) => (
            <SpotlightCard key={index} className="h-full">
              <div className="flex flex-col h-full space-y-4">
                <CheckCircle2 className="w-8 h-8 text-primary" />
                <h3 className="font-headline text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* ===== LEAD CAPTURE (CTA) ===== */}
      <section id="book-demo" className="py-24 px-6 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-lg mx-auto relative z-10">
          <div className="rounded-2xl border border-primary/20 bg-card/80 backdrop-blur-md p-8 md:p-10 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="font-headline text-2xl md:text-3xl font-bold mb-2">Ready to Master {subject.slug.split('-').join(' ')}?</h2>
              <p className="text-sm text-muted-foreground">Book a free consultation today. We&apos;ll call you within 2 hours.</p>
            </div>
            {/* Using the pre-built, converting LeadCaptureForm */}
            <LeadCaptureForm variant="minimal" />
          </div>
        </div>
      </section>
    </>
  );
}
