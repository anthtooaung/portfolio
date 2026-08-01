# Coding Conventions

**Analysis Date:** 2026-08-01

## Naming Patterns

**Files:**
- React components (sections, pages, cards, UI primitives): PascalCase `.tsx` — `src/components/Header.tsx`, `src/pages/Home.tsx`, `src/components/ui/button.tsx`
- shadcn/ui primitives: **lowercase** filenames (`button.tsx`, `input.tsx`, `textarea.tsx`) — matches shadcn generator output
- Hooks: camelCase with `use` prefix — `src/hooks/useScrollSpy.ts`
- Utilities/lib: camelCase — `src/lib/utils.ts`, `src/lib/markdown.ts`
- Zod schemas: camelCase — `src/lib/schemas/contact.ts`
- Markdown content: lowercase kebab-case — `src/content/home/hero.md`, `src/content/projects/portfolio.md`

**Components:**
- PascalCase function declarations: `export function HeroSection()`, `export function Button()` (named exports)
- UI primitives use plain function declarations, not arrow functions: `function Input(...) {...}` then `export { Input }` (`src/components/ui/input.tsx`)
- Section components use inline `export function X()` (`src/components/HeroSection.tsx`)

**Functions:**
- camelCase — `parseFrontmatter`, `getSection`, `getProjects`, `handleNavClick`, `measure`
- `parseYamlValue`, `parseYamlSimple` are the only internal helpers (module-private, not exported)
- Only one default export in the entire codebase: `App` in `src/App.tsx`. Everything else uses named exports.

**Variables:**
- camelCase — `aboutData`, `submitStatus`, `activeId`, `navRef`, `mobileOpen`
- React state pairs follow `[value, setValue]` naming: `const [scrolled, setScrolled]`, `const [dark, setDark]`
- Boolean state reads as adjectives: `scrolled`, `mobileOpen`, `dark`

**Types:**
- PascalCase interfaces — `AboutCard`, `Skill`, `Social`, `ProjectCardProps`, `MarkdownFile`, `ProjectFile`
- Props interfaces named `<Component>Props` — `ProjectCardProps` (`src/components/ProjectCard.tsx`)
- Union types for status enums: `type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'` (`src/components/ContactSection.tsx`)
- Form data types derived from Zod: `export type ContactFormData = z.infer<typeof contactFormSchema>` (`src/lib/schemas/contact.ts`)
- `React.ComponentProps<"button">` used for UI primitive props (`src/components/ui/button.tsx`)

## Code Style

**Formatting:**
- No Prettier config, no `format` script exists (documented in `knowledge/development-guide.md` but not actually present)
- Style inconsistency: shadcn/ui components (`src/components/ui/*.tsx`, `src/lib/utils.ts`) use **double quotes, no semicolons, no trailing commas**; hand-written app code (`src/components/*.tsx`, `src/pages/*.tsx`, `src/lib/*.ts`) uses **single quotes, semicolons, trailing commas**
- shadcn/ui files use 2-space indent consistently; `src/index.css` uses 4-space indent (minor inconsistency)
- String quotes: single quotes for app code, double quotes inside shadcn/ui components

**Linting:**
- ESLint flat config at `eslint.config.js` (ESLint 10)
- Extends: `js.configs.recommended`, `tseslint.configs.recommended`, `reactHooks.configs.flat.recommended`, `reactRefresh.configs.vite`
- `globalIgnores(['dist'])`; globals set to `globals.browser`
- Run with `npm run lint`

**TypeScript strictness** (`tsconfig.app.json`):
- `noUnusedLocals: true`, `noUnusedParameters: true` — unused imports/vars fail the build
- `verbatimModuleSyntax: true` — **must use `import type` for type-only imports** (e.g., `import { clsx, type ClassValue } from "clsx"` in `src/lib/utils.ts`, `import { contactFormSchema, type ContactFormData } from '@/lib/schemas/contact'`)
- `erasableSyntaxOnly: true` — no enums or namespaces; use unions instead (see `SubmitStatus`)
- `target: "es2023"`, `strict` implied by Vite template defaults
- `allowImportingTsExtensions: true` — imports may include `.tsx` extension (`src/main.tsx` imports `./App.tsx`)

## Import Organization

**Order:**
1. External packages / react imports — `import React from 'react'` style, library imports first
2. `@/` alias imports (internal modules) — e.g., `import { getSection } from '@/lib/markdown'`
3. Relative imports — e.g., `import { ProjectCard } from './ProjectCard'` (`src/components/FeaturedProjects.tsx`)

Observed examples:
```tsx
// src/components/ContactSection.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import emailjs from '@emailjs/browser';
import { getSection } from '@/lib/markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { contactFormSchema, type ContactFormData } from '@/lib/schemas/contact';
```

**Path Aliases:**
- `@/` maps to `src/` — configured in `tsconfig.app.json` (`"paths": { "@/*": ["./src/*"] }`) and `vite.config.ts` (`alias: { "@": path.resolve(__dirname, "./src") }`)
- shadcn/ui imports use `@/lib/utils`, `@/components/ui/...` (`components.json` aliases: `components`, `utils`, `ui`, `lib`, `hooks`)
- Section/page components import via `@/lib/markdown`, `@/hooks/useScrollSpy`
- One relative import within same directory: `src/components/FeaturedProjects.tsx` imports `./ProjectCard`

## Error Handling

**Patterns:**
- Zod validation for form data — schema in `src/lib/schemas/contact.ts`, resolver wired via `zodResolver(contactFormSchema)` (`src/components/ContactSection.tsx`)
- Error display via `errors.<field>.message` and `aria-invalid={errors.x ? 'true' : 'false'}` on inputs
- try/catch around async external calls (EmailJS `emailjs.send`), with `console.error` + status state transition (`src/components/ContactSection.tsx:76-79`)
- Guard clause pattern for missing content: `if (!aboutData) return null;` / `if (projects.length === 0) return null;` — section components render nothing when markdown content is absent
- No global error boundary exists; no error utility module

## Logging

**Framework:** Plain `console.error` (no logging library)

**Patterns:**
- `console.error('EmailJS configuration missing')` — missing env config check (`src/components/ContactSection.tsx:55`)
- `console.error('Failed to send email:', error)` — caught async failure (`src/components/ContactSection.tsx:77`)
- No `console.log` in production source code

## Comments

**When to Comment:**
- Complex/algorithmic logic — e.g., the frontmatter parser documents its YAML handling constraints: `"Minimal frontmatter parser — browser-safe, no Node.js dependencies."` (`src/lib/markdown.ts:32-33`)
- Why-not/contextual explanations — `"// Icons that match the original project's intent: wrench/code, lightbulb, chart"` (`src/components/AboutSection.tsx:11`), `"// Sliding active indicator — animates transform, not left"` (`src/components/Header.tsx:102`)
- Section markers in JSX: `{/* Title with gradient + blinking cursor */}` (`src/components/HeroSection.tsx:28`)
- Vite limitation note: `"// Individual raw imports (Vite 8 / rolldown doesn't support import.meta.glob with .md)"` (`src/lib/markdown.ts:14`)

**JSDoc/TSDoc:**
- Used sparingly in `src/lib/markdown.ts` for public functions and interfaces: `/** Parsed markdown file metadata and content */`, `/** Parse raw markdown into frontmatter metadata and body content. */`
- One multiline JSDoc block on `useScrollSpy` in `src/hooks/useScrollSpy.ts`
- Components do NOT use JSDoc; props interfaces carry the documentation burden

## Function Design

**Size:** Small, single-responsibility. Largest file is `src/components/ContactSection.tsx` (240 lines); section components average ~60 lines. `src/lib/markdown.ts` (165 lines) groups related parsing helpers.

**Parameters:** Props destructured in the function signature: `({ title, tags = [], image, description, demo, repo }: ProjectCardProps)`. Default parameter values used: `tags = []`.

**Return Values:**
- Components return JSX or `null` (guard clauses)
- Data helpers return typed values: `getSection(path: string): MarkdownFile | null`, `getProjects(): ProjectFile[]`
- `useScrollSpy(sectionIds: string[])` returns `string` (the active section id)

## Module Design

**Exports:** Named exports for everything except `App` (default export in `src/App.tsx`). UI primitives export both component and its variants: `export { Button, buttonVariants }` (`src/components/ui/button.tsx`).

**Barrel Files:** None. No `index.ts` barrel files exist.

**Data layer:** Content is markdown with frontmatter, imported at build time via Vite `?raw` imports and parsed by `src/lib/markdown.ts` (no fetch calls, no React Query usage yet despite being installed). Static data arrays are module-level constants: `NAV_LINKS`, `CERTS`, `SOCIALS`, `CARD_ICONS`.

## Component Conventions

- shadcn/ui primitives use the CVA variant pattern (`cva(...)`), `data-slot` attributes, and Radix `Slot` for `asChild` polymorphism — `src/components/ui/button.tsx` is the canonical example
- Icons come from `@phosphor-icons/react`, always rendered with `weight="bold"` and a `size-*` Tailwind class (e.g., `className="size-5 text-primary"`)
- Sections follow a consistent structure: `<section id="..." className="py-20 md:py-28 scroll-mt-14">` → `<div className="max-w-6xl mx-auto px-4">` → icon + `h2` header → description → content grid
- Tailwind CSS 4 syntax: `@import "tailwindcss"`, `@custom-variant dark (&:is(.dark *))`, `@theme inline`, OKLCH color tokens in `src/index.css`
- JetBrains Mono (`font-mono`) used for terminal-style accents (the `_` cursor, `>` prompt prefix)
- Reduced-motion respected via `@media (prefers-reduced-motion: reduce)` in `src/index.css` and inline `<style>` in `src/components/CertificatesSection.tsx`

---

*Convention analysis: 2026-08-01*
