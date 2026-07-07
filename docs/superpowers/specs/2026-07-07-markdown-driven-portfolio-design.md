# Markdown-Driven Portfolio — Home Page Design

## Overview

A personal portfolio website where all content is authored as markdown files in the repo. The home page renders three sections (hero, skills, featured projects, contact) by parsing `.md` files at runtime using `react-markdown` and `gray-matter`.

## Goals

- All site content lives in markdown files — single source of truth
- Frontmatter + body format for structured metadata
- Simple to maintain: edit a `.md` file, hot reload updates the UI
- No external CMS, no server — pure static site

## Content Structure

Markdown files live in `src/content/`:

```
src/content/
├── home/
│   ├── hero.md
│   ├── skills.md
│   └── contact.md
├── projects/
│   ├── project-a.md
│   ├── project-b.md
│   └── _index.md
└── blog/
    └── _index.md
```

### Frontmatter Format

Each `.md` file uses YAML frontmatter:

```markdown
---
title: "Project Name"
tags: ["React", "TypeScript"]
date: "2026-03-15"
featured: true
image: "/images/projects/project-a.png"
---

Markdown body content here...
```

### File Types

- **Singleton sections** (`home/*.md`): One file per section, rendered directly
- **Collections** (`projects/*.md`, `blog/*.md`): Multiple files, filtered/sorted by frontmatter

## Parsing Layer

### Dependencies

- `react-markdown` — render markdown body
- `gray-matter` — parse YAML frontmatter
- `remark-gfm` — GitHub-flavored markdown (tables, strikethrough, etc.)

### `src/lib/markdown.ts`

Two main exports:

1. **`parseFrontmatter(raw: string)`** — splits raw markdown into `{ meta, content }`
2. **`getSection(path: string)`** — returns parsed section from content map, or null if missing

### Content Loading

Uses Vite's `import.meta.glob`:

```ts
const modules = import.meta.glob('./content/**/*.md', { as: 'raw', eager: true });
```

- All `.md` files bundled as raw strings at build time
- No runtime fetches
- Hot reload works automatically via Vite file watching

## Home Page Components

```
src/pages/Home.tsx
├── HeroSection        ← home/hero.md
├── SkillsSection      ← home/skills.md
├── FeaturedProjects   ← projects/*.md where featured: true
└── ContactSection     ← home/contact.md
```

### Component Pattern

Each section is a thin wrapper:

```tsx
import { getSection } from '@/lib/markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const hero = getSection('home/hero.md');

export function HeroSection() {
  if (!hero) return null;
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {hero.content}
        </ReactMarkdown>
      </div>
    </section>
  );
}
```

### Featured Projects

Filters the projects collection:

```tsx
const featuredProjects = getProjects().filter(p => p.meta.featured);
```

### Layout

```
┌─────────────────────────────┐
│         Hero Section        │  ← name, tagline, CTA
├─────────────────────────────┤
│       Skills Section        │  ← badge grid
├─────────────────────────────┤
│     Featured Projects       │  ← 2-3 cards
├─────────────────────────────┤
│       Contact Section       │  ← email, links
└─────────────────────────────┘
```

## Styling

### Approach

- Tailwind CSS utilities (existing setup)
- shadcn/ui components for cards and UI elements
- OKLCH CSS variable tokens for dark/light mode

### Responsive Breakpoints

- **Skills grid:** 2-col mobile, 3-col tablet, 4-col desktop
- **Projects grid:** 1-col mobile, 2-col tablet, 3-col desktop
- **Hero:** stacked mobile, side-by-side desktop

### Section Spacing

- Full-width with `py-16 md:py-24`
- Max-width wrapper: `max-w-6xl mx-auto`

### Typography

- JetBrains Mono as base font (existing)
- No font changes needed

## Error Handling

### Missing Content Files

If a markdown file doesn't exist, the component returns `null` — section doesn't render.

```tsx
const hero = getSection('home/hero.md');
if (!hero) return null;
```

### Missing Frontmatter Fields

Fallback defaults:
- `title` → "Untitled"
- `tags` → `[]`
- `date` → current date
- `featured` → `false`
- `image` → no image shown

### Broken Markdown

`react-markdown` handles malformed markdown gracefully — renders what it can, skips what it can't parse.

### Dev Experience

Adding a new `.md` file triggers Vite hot reload automatically. No manual registration needed.

## File Structure

```
src/
├── content/
│   ├── home/
│   │   ├── hero.md
│   │   ├── skills.md
│   │   └── contact.md
│   └── projects/
│       ├── project-a.md
│       └── project-b.md
├── lib/
│   └── markdown.ts        ← parsing utilities
├── pages/
│   └── Home.tsx            ← assembles sections
├── components/
│   ├── HeroSection.tsx
│   ├── SkillsSection.tsx
│   ├── FeaturedProjects.tsx
│   ├── ContactSection.tsx
│   └── ProjectCard.tsx
└── App.tsx                 ← route: / → Home
```

## Scope (First Pass)

- Home page only (hero, skills, featured projects, contact)
- Navigation and other pages deferred to later iterations
