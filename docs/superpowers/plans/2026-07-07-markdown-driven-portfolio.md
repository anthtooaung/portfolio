# Markdown-Driven Portfolio — Home Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a home page that renders hero, skills, featured projects, and contact sections from markdown files with frontmatter.

**Architecture:** Markdown files in `src/content/` are loaded via Vite's `import.meta.glob` as raw strings, parsed with `gray-matter` for frontmatter, and rendered with `react-markdown`. Each section is a thin component wrapper.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS 4, shadcn/ui, react-markdown, gray-matter, remark-gfm

## Global Constraints

- React 19 + TypeScript 6 + Vite 8
- Tailwind CSS 4 (v4 syntax: `@import "tailwindcss"`, `@custom-variant` directives)
- shadcn/ui with Phosphor Icons
- Font: JetBrains Mono (`@fontsource-variable/jetbrains-mono`)
- Path alias: `@/` maps to `src/`
- No test framework configured — manual verification via `npm run dev` and `npm run build`

---

## File Structure

```
src/
├── content/
│   ├── home/
│   │   ├── hero.md           ← hero section content
│   │   ├── skills.md         ← skills section content
│   │   └── contact.md        ← contact section content
│   └── projects/
│       ├── dashboard.md      ← sample project
│       └── portfolio.md      ← sample project
├── lib/
│   └── markdown.ts           ← parsing utilities (NEW)
├── pages/
│   └── Home.tsx              ← home page assembler (NEW)
├── components/
│   ├── HeroSection.tsx       ← hero section (NEW)
│   ├── SkillsSection.tsx     ← skills section (NEW)
│   ├── FeaturedProjects.tsx  ← featured projects (NEW)
│   ├── ContactSection.tsx    ← contact section (NEW)
│   └── ProjectCard.tsx       ← project card (NEW)
└── App.tsx                   ← update route to Home (MODIFY)
```

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Interfaces:**
- Consumes: none
- Produces: react-markdown, gray-matter, remark-gfm available for import

- [ ] **Step 1: Install packages**

```bash
npm install react-markdown gray-matter remark-gfm
```

- [ ] **Step 2: Verify installation**

```bash
npm ls react-markdown gray-matter remark-gfm
```

Expected: all three packages listed with no peer dependency warnings

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add react-markdown, gray-matter, remark-gfm"
```

---

### Task 2: Create Markdown Parsing Utility

**Files:**
- Create: `src/lib/markdown.ts`

**Interfaces:**
- Consumes: none
- Produces:
  - `parseFrontmatter(raw: string): { meta: Record<string, any>, content: string }`
  - `getSection(path: string): { meta: Record<string, any>, content: string } | null`
  - `getProjects(): Array<{ meta: Record<string, any>, content: string, slug: string }>`

- [ ] **Step 1: Create the markdown utility**

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build
```

Expected: TypeScript compiles without errors (the content files don't exist yet, but the code should be valid)

- [ ] **Step 3: Commit**

```bash
git add src/lib/markdown.ts
git commit -m "feat: add markdown parsing utility with parseFrontmatter, getSection, getProjects"
```

---

### Task 3: Create Sample Markdown Content

**Files:**
- Create: `src/content/home/hero.md`
- Create: `src/content/home/skills.md`
- Create: `src/content/home/contact.md`
- Create: `src/content/projects/dashboard.md`
- Create: `src/content/projects/portfolio.md`

**Interfaces:**
- Consumes: none
- Produces: markdown files that the parsing utility can read

- [ ] **Step 1: Create hero markdown**

```markdown
---
title: "Mr.Ant"
subtitle: "Full-Stack Developer & UI Designer"
cta: "View My Work"
ctaLink: "#projects"
---

Building modern web experiences with clean code and thoughtful design.
```

- [ ] **Step 2: Create skills markdown**

```markdown
---
title: "Skills & Technologies"
skills:
  - name: "React"
    level: 90
  - name: "TypeScript"
    level: 85
  - name: "Node.js"
    level: 80
  - name: "Tailwind CSS"
    level: 95
  - name: "Python"
    level: 75
  - name: "PostgreSQL"
    level: 70
---

I work with modern web technologies to build fast, accessible, and beautiful applications.
```

- [ ] **Step 3: Create contact markdown**

```markdown
---
title: "Get In Touch"
email: "hello@mrant.dev"
socials:
  - name: "GitHub"
    url: "https://github.com/mrant"
  - name: "LinkedIn"
    url: "https://linkedin.com/in/mrant"
  - name: "Twitter"
    url: "https://twitter.com/mrant"
---

Let's build something great together.
```

- [ ] **Step 4: Create dashboard project markdown**

```markdown
---
title: "Analytics Dashboard"
tags: ["React", "TypeScript", "Chart.js", "Tailwind"]
date: "2026-03-15"
featured: true
image: "/images/projects/dashboard.png"
demo: "https://demo.mrant.dev/dashboard"
repo: "https://github.com/mrant/dashboard"
---

A real-time analytics dashboard with interactive charts and data visualization.

## Features

- Real-time data updates
- Interactive charts with Chart.js
- Responsive design
- Dark mode support
```

- [ ] **Step 5: Create portfolio project markdown**

```markdown
---
title: "Portfolio Website"
tags: ["React", "TypeScript", "Vite", "Tailwind"]
date: "2026-07-01"
featured: true
image: "/images/projects/portfolio.png"
repo: "https://github.com/mrant/portfolio"
---

This portfolio website you're looking at! Built with a markdown-driven approach for easy content management.

## Features

- Markdown-driven content
- Dark/light mode
- Responsive design
- Fast builds with Vite
```

- [ ] **Step 6: Commit**

```bash
git add src/content/
git commit -m "content: add sample markdown files for home sections and projects"
```

---

### Task 4: Create ProjectCard Component

**Files:**
- Create: `src/components/ProjectCard.tsx`

**Interfaces:**
- Consumes: project data `{ meta: Record<string, any>, content: string, slug: string }`
- Produces: `ProjectCard` component

- [ ] **Step 1: Create the ProjectCard component**

```tsx
// src/components/ProjectCard.tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ProjectCardProps {
  title: string;
  tags?: string[];
  image?: string;
  description: string;
  demo?: string;
  repo?: string;
}

export function ProjectCard({
  title,
  tags = [],
  image,
  description,
  demo,
  repo,
}: ProjectCardProps) {
  return (
    <div className="group rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-md">
      {image && (
        <div className="aspect-video overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="prose prose-sm dark:prose-invert mb-4">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {description}
          </ReactMarkdown>
        </div>
        <div className="flex gap-3">
          {demo && (
            <a
              href={demo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              Live Demo →
            </a>
          )}
          {repo && (
            <a
              href={repo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:underline"
            >
              Source Code →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build
```

Expected: no TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add src/components/ProjectCard.tsx
git commit -m "feat: add ProjectCard component"
```

---

### Task 5: Create HeroSection Component

**Files:**
- Create: `src/components/HeroSection.tsx`

**Interfaces:**
- Consumes: `getSection('home/hero.md')` from `@/lib/markdown`
- Produces: `HeroSection` component

- [ ] **Step 1: Create the HeroSection component**

```tsx
// src/components/HeroSection.tsx
import { getSection } from '@/lib/markdown';

const hero = getSection('home/hero.md');

export function HeroSection() {
  if (!hero) return null;

  const { title, subtitle, cta, ctaLink } = hero.meta;

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {title || 'Hello'}
          </h1>
          {subtitle && (
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {subtitle}
            </p>
          )}
          {cta && ctaLink && (
            <a
              href={ctaLink}
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              {cta}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build
```

Expected: no TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroSection.tsx
git commit -m "feat: add HeroSection component"
```

---

### Task 6: Create SkillsSection Component

**Files:**
- Create: `src/components/SkillsSection.tsx`

**Interfaces:**
- Consumes: `getSection('home/skills.md')` from `@/lib/markdown`
- Produces: `SkillsSection` component

- [ ] **Step 1: Create the SkillsSection component**

```tsx
// src/components/SkillsSection.tsx
import { getSection } from '@/lib/markdown';

const skillsData = getSection('home/skills.md');

interface Skill {
  name: string;
  level: number;
}

export function SkillsSection() {
  if (!skillsData) return null;

  const skills: Skill[] = skillsData.meta.skills || [];

  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Skills & Technologies</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="p-4 rounded-lg border bg-card text-card-foreground"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{skill.name}</span>
                <span className="text-sm text-muted-foreground">
                  {skill.level}%
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build
```

Expected: no TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add src/components/SkillsSection.tsx
git commit -m "feat: add SkillsSection component"
```

---

### Task 7: Create FeaturedProjects Component

**Files:**
- Create: `src/components/FeaturedProjects.tsx`

**Interfaces:**
- Consumes: `getProjects()` from `@/lib/markdown`, `ProjectCard` from `@/components/ProjectCard`
- Produces: `FeaturedProjects` component

- [ ] **Step 1: Create the FeaturedProjects component**

```tsx
// src/components/FeaturedProjects.tsx
import { getProjects } from '@/lib/markdown';
import { ProjectCard } from './ProjectCard';

export function FeaturedProjects() {
  const projects = getProjects().filter((p) => p.meta.featured);

  if (projects.length === 0) return null;

  return (
    <section className="py-16 md:py-24" id="projects">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              title={project.meta.title || 'Untitled Project'}
              tags={project.meta.tags || []}
              image={project.meta.image}
              description={project.content}
              demo={project.meta.demo}
              repo={project.meta.repo}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build
```

Expected: no TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add src/components/FeaturedProjects.tsx
git commit -m "feat: add FeaturedProjects component"
```

---

### Task 8: Create ContactSection Component

**Files:**
- Create: `src/components/ContactSection.tsx`

**Interfaces:**
- Consumes: `getSection('home/contact.md')` from `@/lib/markdown`
- Produces: `ContactSection` component

- [ ] **Step 1: Create the ContactSection component**

```tsx
// src/components/ContactSection.tsx
import { getSection } from '@/lib/markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const contactData = getSection('home/contact.md');

interface Social {
  name: string;
  url: string;
}

export function ContactSection() {
  if (!contactData) return null;

  const { title, email, socials } = contactData.meta;
  const socialLinks: Social[] = socials || [];

  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4">{title || 'Contact'}</h2>
        <div className="prose prose-lg dark:prose-invert mb-8">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {contactData.content}
          </ReactMarkdown>
        </div>
        {email && (
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors mb-6"
          >
            Email Me
          </a>
        )}
        {socialLinks.length > 0 && (
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {social.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build
```

Expected: no TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add src/components/ContactSection.tsx
git commit -m "feat: add ContactSection component"
```

---

### Task 9: Create Home Page

**Files:**
- Create: `src/pages/Home.tsx`

**Interfaces:**
- Consumes: `HeroSection`, `SkillsSection`, `FeaturedProjects`, `ContactSection`
- Produces: `Home` page component

- [ ] **Step 1: Create the Home page**

```tsx
// src/pages/Home.tsx
import { HeroSection } from '@/components/HeroSection';
import { SkillsSection } from '@/components/SkillsSection';
import { FeaturedProjects } from '@/components/FeaturedProjects';
import { ContactSection } from '@/components/ContactSection';

export function Home() {
  return (
    <main>
      <HeroSection />
      <SkillsSection />
      <FeaturedProjects />
      <ContactSection />
    </main>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build
```

Expected: no TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add src/pages/Home.tsx
git commit -m "feat: add Home page assembling all sections"
```

---

### Task 10: Update App.tsx Route

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `Home` from `@/pages/Home`
- Produces: updated routing

- [ ] **Step 1: Update App.tsx**

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build
```

Expected: no TypeScript errors

- [ ] **Step 3: Start dev server and verify**

```bash
npm run dev
```

Expected: Home page renders with hero, skills, featured projects, and contact sections

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: update App.tsx to use Home page"
```

---

### Task 11: Final Verification

**Files:**
- none (verification only)

**Interfaces:**
- Consumes: all previous tasks
- Produces: working home page

- [ ] **Step 1: Full build verification**

```bash
npm run build
```

Expected: build completes without errors

- [ ] **Step 2: Lint check**

```bash
npm run lint
```

Expected: no lint errors

- [ ] **Step 3: Visual verification**

Start dev server and check:
- [ ] Hero section renders with title and subtitle
- [ ] Skills section shows skill bars
- [ ] Featured projects show cards with images, tags, and links
- [ ] Contact section shows email and social links
- [ ] Responsive layout works on mobile/tablet/desktop
- [ ] Dark mode works (if toggle exists)

- [ ] **Step 4: Commit final state**

```bash
git add -A
git commit -m "feat: complete markdown-driven home page"
```
