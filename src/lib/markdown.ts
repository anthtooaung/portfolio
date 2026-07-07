// src/lib/markdown.ts

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
const modules = import.meta.glob('../content/**/*.md', {
  as: 'raw',
  eager: true,
});

/**
 * Minimal frontmatter parser — browser-safe, no Node.js dependencies.
 * Expects YAML between --- delimiters at the top of the file.
 */
function parseYamlSimple(yaml: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  let currentKey = '';
  let isArray = false;

  for (const line of yaml.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Array item (continuation of previous key)
    if (isArray && /^-\s/.test(trimmed)) {
      const val = trimmed.replace(/^-\s+/, '');
      const arr = result[currentKey] as string[];
      arr.push(val);
      continue;
    }

    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;

    const key = trimmed.slice(0, colonIdx).trim();
    const value = trimmed.slice(colonIdx + 1).trim();

    currentKey = key;
    isArray = false;

    if (value === '' || value === '[]') {
      // Could be a multi-line array or empty
      result[key] = [];
      isArray = true;
    } else if (value.startsWith('[') && value.endsWith(']')) {
      // Inline array: [a, b, c]
      result[key] = value.slice(1, -1).split(',').map(s => s.trim());
    } else if (value.startsWith('"') && value.endsWith('"')) {
      result[key] = value.slice(1, -1);
    } else if (value === 'true') {
      result[key] = true;
    } else if (value === 'false') {
      result[key] = false;
    } else if (!isNaN(Number(value))) {
      result[key] = Number(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Parse raw markdown into frontmatter metadata and body content.
 */
export function parseFrontmatter(raw: string): MarkdownFile {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, content: raw };
  const [, yaml, content] = match;
  return { meta: parseYamlSimple(yaml), content };
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
