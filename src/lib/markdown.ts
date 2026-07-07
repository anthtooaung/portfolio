// src/lib/markdown.ts
import matter from 'gray-matter';

/** Parsed markdown file metadata and content */
export interface MarkdownFile {
  meta: Record<string, unknown>;
  content: string;
}

/** Parsed project file with slug */
export interface ProjectFile extends MarkdownFile {
  slug: string;
}

// Vite loads all .md files as raw strings at build time
const modules = import.meta.glob('./content/**/*.md', {
  as: 'raw',
  eager: true,
});

/**
 * Parse raw markdown into frontmatter metadata and body content.
 */
export function parseFrontmatter(raw: string): MarkdownFile {
  const { data, content } = matter(raw);
  return { meta: data as Record<string, unknown>, content };
}

/**
 * Get a singleton section by its content path (e.g., 'home/hero.md').
 * Returns null if the file doesn't exist.
 */
export function getSection(path: string): MarkdownFile | null {
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
export function getProjects(): ProjectFile[] {
  const projects: ProjectFile[] = [];

  for (const [key, raw] of Object.entries(modules)) {
    if (key.startsWith('./content/projects/') && key !== './content/projects/_index.md') {
      const slug = key.replace('./content/projects/', '').replace('.md', '');
      const { meta, content } = parseFrontmatter(raw as string);
      projects.push({ meta, content, slug });
    }
  }

  // Sort by date, newest first
  return projects.sort((a, b) => {
    const dateA = new Date(String(a.meta.date || 0));
    const dateB = new Date(String(b.meta.date || 0));
    return dateB.getTime() - dateA.getTime();
  });
}
