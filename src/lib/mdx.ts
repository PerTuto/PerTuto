import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'src', 'content', 'blog');

export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  coverImage?: string;
}

export function getBlogPosts(): BlogPostMeta[] {
  // Ensure directory exists
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  // Get file names under /content/blog
  const fileNames = fs.readdirSync(contentDir);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
    .map((fileName) => {
      // Remove ".mdx" or ".md" from file name to get slug
      const slug = fileName.replace(/\.mdx?$/, '');

      // Read markdown file as string
      const fullPath = path.join(contentDir, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Combine the data with the slug
      return {
        slug,
        title: matterResult.data.title,
        excerpt: matterResult.data.excerpt,
        date: matterResult.data.date,
        author: matterResult.data.author,
        coverImage: matterResult.data.coverImage,
      } as BlogPostMeta;
    });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getPostBySlug(slug: string) {
  const fullPathMDX = path.join(contentDir, `${slug}.mdx`);
  const fullPathMD = path.join(contentDir, `${slug}.md`);

  let fileContents;
  try {
     if (fs.existsSync(fullPathMDX)) {
       fileContents = fs.readFileSync(fullPathMDX, 'utf8');
     } else if (fs.existsSync(fullPathMD)) {
       fileContents = fs.readFileSync(fullPathMD, 'utf8');
     } else {
         return null;
     }
  } catch (err) {
      return null;
  }

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  return {
    slug,
    meta: {
        title: matterResult.data.title,
        excerpt: matterResult.data.excerpt,
        date: matterResult.data.date,
        author: matterResult.data.author,
        coverImage: matterResult.data.coverImage,
    } as BlogPostMeta,
    content: matterResult.content, // The raw markdown content body
  };
}
