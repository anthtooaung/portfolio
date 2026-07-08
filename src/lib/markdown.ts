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

// Individual raw imports (Vite 8 / rolldown doesn't support import.meta.glob with .md)
import heroRaw from '../content/home/hero.md?raw';
import aboutRaw from '../content/home/about.md?raw';
import skillsRaw from '../content/home/skills.md?raw';
import contactRaw from '../content/home/contact.md?raw';
import portfolioRaw from '../content/projects/portfolio.md?raw';
import dashboardRaw from '../content/projects/dashboard.md?raw';

const modules: Record<string, string> = {
  './content/home/hero.md': heroRaw,
  './content/home/about.md': aboutRaw,
  './content/home/skills.md': skillsRaw,
  './content/home/contact.md': contactRaw,
  './content/projects/portfolio.md': portfolioRaw,
  './content/projects/dashboard.md': dashboardRaw,
};

/**
 * Minimal frontmatter parser — browser-safe, no Node.js dependencies.
 * Expects YAML between --- delimiters at the top of the file.
 */
function parseYamlValue(value: string): unknown {
  if (value === '' || value === '[]') return [];
  if (value.startsWith('[') && value.endsWith(']')) {
    return value.slice(1, -1).split(',').map(s => s.trim());
  }
  if (value.startsWith('"') && value.endsWith('"')) return value.slice(1, -1);
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (!isNaN(Number(value))) return Number(value);
  return value;
}

function parseYamlSimple(yaml: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  let currentKey = '';
  let isArray = false;
  let arrayItemIndent = -1;
  let currentObject: Record<string, unknown> | null = null;

  for (const line of yaml.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Array item (continuation of previous key)
    if (isArray && /^-\s/.test(trimmed)) {
      const indent = line.length - line.trimStart().length;

      // If the item has inline content like `- name: "React"`, parse as object
      const afterDash = trimmed.slice(2);
      const colonIdx = afterDash.indexOf(':');
      if (colonIdx !== -1) {
        const objKey = afterDash.slice(0, colonIdx).trim();
        const objValue = afterDash.slice(colonIdx + 1).trim();
        currentObject = { [objKey]: parseYamlValue(objValue) };
        arrayItemIndent = indent;
        (result[currentKey] as unknown[]).push(currentObject);
      } else {
        // Simple array item like `- item1`
        currentObject = null;
        arrayItemIndent = -1;
        (result[currentKey] as unknown[]).push(parseYamlValue(afterDash));
      }
      continue;
    }

    // Indented property under current array object (e.g., `  level: 90` under `- name: "React"`)
    if (currentObject && isArray && arrayItemIndent >= 0) {
      const indent = line.length - line.trimStart().length;
      const propColon = trimmed.indexOf(':');
      if (indent > arrayItemIndent && propColon !== -1) {
        const propKey = trimmed.slice(0, propColon).trim();
        const propValue = trimmed.slice(propColon + 1).trim();
        currentObject[propKey] = parseYamlValue(propValue);
        continue;
      }
    }

    const colon = trimmed.indexOf(':');
    if (colon === -1) continue;

    const key = trimmed.slice(0, colon).trim();
    const value = trimmed.slice(colon + 1).trim();

    currentKey = key;
    isArray = false;
    currentObject = null;
    arrayItemIndent = -1;

    if (value === '' || value === '[]') {
      result[key] = [];
      isArray = true;
    } else if (value.startsWith('[') && value.endsWith(']')) {
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
