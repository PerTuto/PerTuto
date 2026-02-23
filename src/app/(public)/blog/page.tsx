import type { Metadata } from 'next';
import Link from 'next/link';
import { getBlogPosts } from '@/lib/mdx';
import { CalendarIcon, UserIcon, ArrowRight } from 'lucide-react';
import { SpotlightCard } from '@/components/public/spotlight-card';

export const metadata: Metadata = {
  title: 'Blog | PerTuto',
  description: 'Expert insights, study tips, and industry news from Dubai\'s top tutors.',
};

export default function BlogIndexPage() {
  const posts = getBlogPosts();

  return (
    <>
      <section className="relative min-h-[40vh] flex flex-col items-center justify-center px-6 overflow-hidden bg-background pt-20">
        <div className="max-w-3xl mx-auto text-center space-y-4 relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold tracking-tight">
            The PerTuto <span className="text-primary">Journal</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Study strategies, curriculum updates, and industry insights.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-24 border border-border/50 rounded-2xl bg-card/20">
              <p className="text-muted-foreground">No blog posts found. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="block h-full cursor-pointer">
                  <SpotlightCard className="h-full flex flex-col justify-between">
                    <div>
                      {/* Optional Cover Image Area */}
                      {post.coverImage && (
                        <div className="w-full h-48 bg-muted rounded-lg mb-6 overflow-hidden">
                           <img 
                              src={post.coverImage} 
                              alt={post.title} 
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                           />
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 font-mono">
                        <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {post.date}</span>
                        <span className="flex items-center gap-1"><UserIcon className="w-3 h-3" /> {post.author}</span>
                      </div>
                      <h2 className="font-headline text-xl font-bold mb-3 line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-6 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                    
                    <span className="text-primary text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read Article <ArrowRight className="w-4 h-4" />
                    </span>
                  </SpotlightCard>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
