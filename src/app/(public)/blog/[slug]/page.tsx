import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPosts, getPostBySlug } from '@/lib/mdx';
import { CalendarIcon, UserIcon, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { LeadCaptureForm } from '@/components/public/lead-capture-form';

// Generate static params so these pages are built at compile time (SSG)
export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Dynamically generate SEO metadata based on the article's frontmatter
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.meta.title} | PerTuto Blog`,
    description: post.meta.excerpt,
    openGraph: {
      title: post.meta.title,
      description: post.meta.excerpt,
      type: 'article',
      authors: [post.meta.author],
      publishedTime: post.meta.date,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  /*
   * IMPORTANT INSTRUCTION FOR DEVELOPER:
   * Since we are using standard gray-matter to parse raw Markdown content, not `next-mdx-remote`,
   * we cannot execute raw React components scattered within the Markdown body easily here.
   * If React components inside MDX are strictly required, we need to switch from `gray-matter`
   * to `@next/mdx` page compilation or `next-mdx-remote`.
   * For this V1, we will render the Markdown string out directly via dangerouslySetInnerHTML.
   */

  return (
    <>

      <article className="min-h-screen py-24 px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" /> Back to Journal
          </Link>

          {/* Post Header */}
          <header className="mb-12 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight">
              {post.meta.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground font-mono bg-card/30 p-4 rounded-xl border border-border/30">
              <span className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-primary" /> {post.meta.date}
              </span>
              <span className="hidden sm:inline text-border">|</span>
              <span className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-violet-400" /> {post.meta.author}
              </span>
            </div>

             {/* Optional Cover Image */}
             {post.meta.coverImage && (
                <div className="w-full h-64 md:h-96 bg-muted rounded-2xl mb-8 overflow-hidden border border-border/50">
                   <img 
                      src={post.meta.coverImage} 
                      alt={`Cover for ${post.meta.title}`} 
                      className="w-full h-full object-cover"
                   />
                </div>
              )}
          </header>

          {/* Post Content (Raw Markdown Render) */}
          <div 
             className="prose prose-invert prose-lg max-w-none 
                        prose-headings:font-headline prose-headings:font-bold 
                        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-foreground prose-strong:font-bold
                        prose-code:bg-card prose-code:text-primary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono
                        prose-pre:bg-card/50 prose-pre:border prose-pre:border-border/30
                        marker:text-primary"
             dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <hr className="my-16 border-border/50" />

          {/* Bottom Call to Action */}
          <section className="rounded-2xl border border-primary/20 bg-card/50 p-8 md:p-10 text-center">
             <h3 className="font-headline text-2xl font-bold mb-4">Did you find this helpful?</h3>
             <p className="text-muted-foreground mb-8">
               If you're looking for expert guidance tailored to your specific needs, let's talk.
             </p>
             <div className="max-w-md mx-auto">
               <LeadCaptureForm variant="minimal" />
             </div>
          </section>
        </div>
      </article>
    </>
  );
}
