import type { Metadata } from 'next';
import { adminFirestore } from '@/lib/firebase/admin-app';

type Props = {
  params: { board: string; slug: string };
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { board, slug } = params;
  const boardParam = board.toLowerCase();
  
  // Create a fallback title
  const cleanTitle = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  let seoTitle = `${boardParam.toUpperCase()} — ${cleanTitle} | PerTuto Resources`;
  let seoDescription = `Access premium ${boardParam.toUpperCase()} ${cleanTitle} study materials, past papers, syllabi, and FAQs for free.`;
  let keywords: string[] = [boardParam, cleanTitle, 'tutoring', 'resources'];

  try {
    // Attempt to find the primary resource that matches this slug to inherit its specific SEO metadata
    const snapshot = await adminFirestore.collection('resources')
        .where('published', '==', true)
        .get();

    if (!snapshot.empty) {
        const slugKeywords = slug.toLowerCase().split("-");
        const resources = snapshot.docs.map(d => d.data());
        
        // Find the best matching resource (preferably a Syllabus or Study Guide with explicit SEO)
        const matchedResource = resources.find(r => {
            const matchesBoard = r.board?.toLowerCase() === boardParam || r.curriculum?.toLowerCase() === boardParam;
            if (!matchesBoard) return false;
            const searchString = `${r.subject} ${r.grade}`.toLowerCase();
            return slugKeywords.every(kw => searchString.includes(kw));
        });

        if (matchedResource) {
            if (matchedResource.seoTitle) seoTitle = matchedResource.seoTitle;
            if (matchedResource.seoDescription) seoDescription = matchedResource.seoDescription;
            if (matchedResource.keywords && matchedResource.keywords.length > 0) {
                keywords = [...keywords, ...matchedResource.keywords];
            }
        }
    }
  } catch (e) {
      console.warn("Could not fetch specific SEO metadata for resource layout:", e);
  }

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: keywords.join(', '),
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: 'article',
    }
  };
}

export default function ResourceLayout({ children }: Props) {
  return <>{children}</>;
}
