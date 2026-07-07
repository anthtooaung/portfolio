// src/lib/markdown.ts
import matter from 'gray-matter';

// Vite loads all .md files as raw strings at build time
const modules = import.meta.glob('./content/**/*.md', {
  as: 'raw',
  eager: true,
});

/**
 * Parse raw markdown into frontmatter metadata and body content.
 */
export function parseFrontmatter(raw: string): {
  meta: Record<string, any>;
  content: string;
} {
  const { data, content } = matter(raw);
  return { meta: data, content };
}

/**
 * Get a singleton section by its content path (e.g., 'home/hero.md').
 * Returns null if the file doesn't exist.
 */
export function getSection(
  path: string
): { meta: Record<string, any>; content: string } | null {
  // The glob keys are relative to this file, prefixed with ./content/
  const key = `./content/${path}`;
  const raw = modules[key];
  if (!raw) return null;
  return parseFrontmatter(raw as string);
}

/**
 * Get all project files from src/content/projects/.
 * Returns an array sorted by date (newest first).
 */
export function getProjects(): Array<{
  meta: Record<string, any>;
  content: string;
  slug: string;
}> {
  const projects: Array<{
    meta: Record<string, any>;
    content: string;
    slug: string;
  }> = [];

  for (const [key, raw] of Object.entries(modules)) {
    if (key.startsWith('./content/projects/') && key !== './content/projects/_index.md') {
      const slug = key.replace('./content/projects/', '').replace('.md', '');
      const { meta, content } = parseFrontmatter(raw as string);
      projects.push({ meta, content, slug });
    }
  }

  // Sort by date, newest first
  return projects.sort((a, b) => {
    const dateA = new Date(a.meta.date || 0);
    const dateB = new Date(b.meta.date || 0);
    return dateB.getTime() - dateA.getTime();
  });
}
