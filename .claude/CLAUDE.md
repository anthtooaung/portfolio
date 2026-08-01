<!-- GSD:project-start source:PROJECT.md -->

## Project

**Mr.Ant's Portfolio — Personal Website Upgrade**

A personal website for a developer ("Mr.Ant") that serves as both portfolio and professional presence. Built on an existing React + TypeScript + Vite SPA with markdown-driven content. The goal is to elevate it from a functional prototype to a polished, personal-feeling website with a resume/CV page and warmer, more refined visual design.

**Core Value:** The site must feel like **mine** — not a template. Warmer colors, real content, a distinctive hero section with motion, and a professional resume page I can share with employers.

### Constraints

- **Tech stack**: React 19 + TypeScript 6 + Vite 8 + Tailwind CSS 4 — no framework switches
- **Content format**: Markdown with YAML frontmatter, parsed by existing `parseYamlSimple` — only add flat key-value or simple array frontmatter
- **Icon library**: Phosphor Icons (`@phosphor-icons/react`) — no new icon libraries
- **Component pattern**: shadcn/ui + CVA variants — follow established conventions
- **Single-page architecture**: Main site stays as single scroll; only `/resume` is a new route
- **Static hosting**: No server-side rendering; everything runs client-side or at build time

<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->

## Technology Stack

## Languages

- TypeScript ~6.0.2 - All application code (`src/**/*.ts`, `src/**/*.tsx`)
- CSS (Tailwind v4 syntax) - Styling via `src/index.css` and utility classes throughout
- Markdown - Content authoring (`src/content/**/*.md`)
- JavaScript - Config files only (`eslint.config.js`, `vite.config.ts`)

## Runtime

- Node.js v26.2.0
- Browser (SPA) - React 19 renders client-side via `index.html`
- npm (lockfile: `package-lock.json` present)
- No `.nvmrc` file — Node version not pinned in the repo

## Frameworks

- React 19.2.6 + React DOM 19.2.6 - UI framework (`src/main.tsx`, `src/App.tsx`)
- TypeScript 6.0.2 - Type checking and compilation (`tsconfig.json`, `tsconfig.app.json`)
- Vite 8.0.12 - Build tool and dev server (`vite.config.ts`)
- Tailwind CSS 4.3.1 - Utility-first CSS (`@tailwindcss/vite` plugin, `src/index.css`)
- tw-animate-css 1.4.0 - Animation utilities (imported in `src/index.css`)
- shadcn/ui 4.11.0 (radix-lyra style) - Component library (`src/components/ui/`)
- class-variance-authority 0.7.1 (CVA) - Component variant pattern (`src/components/ui/button.tsx`)
- clsx 2.1.1 + tailwind-merge 3.6.0 - Class name composition (`src/lib/utils.ts`)
- @tailwindcss/typography 0.5.20 - Prose styling for markdown content
- JetBrains Mono Variable - Base/mono font (`@fontsource-variable/jetbrains-mono`, applied via `@apply font-mono` on `<html>`)
- Inter Variable - Sans-serif font (`@fontsource-variable/inter`, set as `--font-sans` in `src/index.css`)
- react-hook-form 7.79.0 - Form state management (`src/components/ContactSection.tsx`)
- @hookform/resolvers 5.5.7 - Schema resolver integration
- Zod 4.4.3 - Form validation schemas (`src/lib/schemas/contact.ts`)
- react-markdown 10.1.0 - Markdown rendering (`src/components/AboutSection.tsx`, `ProjectCard.tsx`, `ContactSection.tsx`)
- remark-gfm 4.0.1 - GitHub Flavored Markdown support (tables, strikethrough, etc.)
- react-router-dom 7.17.0 - Client-side routing (`src/App.tsx` — single route `/`)
- Zustand 5.0.14 - Client state store
- TanStack React Query 5.101.0 - Server state management
- @phosphor-icons/react 2.1.10 - Primary icon library (configured in `components.json`)
- lucide-react 1.18.0 - Secondary icon library (installed, usage in shadcn/ui components)

## Key Dependencies

- `@emailjs/browser` ^4.4.1 - Contact form email sending (`src/components/ContactSection.tsx`)
- `react-markdown` ^10.1.0 + `remark-gfm` ^4.0.1 - Renders markdown content from `src/content/` files
- `react-hook-form` ^7.79.0 + `zod` ^4.4.3 - Contact form validation and submission
- `radix-ui` ^1.5.0 - Headless UI primitives (shadcn/ui foundation)
- `@vitejs/plugin-react` ^6.0.1 - React fast refresh and JSX transform
- `@tailwindcss/vite` ^4.3.2 - Tailwind CSS Vite plugin (no PostCSS config needed)

## Configuration

- `.env.example` file documents required vars (never commit `.env`)
- Vite env prefix: `VITE_` (accessed via `import.meta.env.VITE_*`)
- Required env vars:
- `vite.config.ts` — Vite config with React plugin, Tailwind plugin, and `@/` path alias
- `tsconfig.json` — References `tsconfig.app.json` and `tsconfig.node.json`
- `tsconfig.app.json` — App source: ES2023 target, bundler module resolution, strict linting options (`noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`)
- `tsconfig.node.json` — Node/config files: covers `vite.config.ts` only
- `components.json` — shadcn/ui config: radix-lyra style, neutral base color, phosphor icons, CSS variables enabled
- `eslint.config.js` — Flat config format, TypeScript + React Hooks + React Refresh rules, ignores `dist/`
- `src/index.css` — CSS custom properties via OKLCH color space
- Dark mode: `@custom-variant dark (&:is(.dark *))` (Tailwind v4 syntax)
- shadcn/ui design tokens: background, foreground, card, primary, secondary, muted, accent, destructive, border, input, ring, popover, sidebar, chart-1 through chart-5

## Platform Requirements

- Node.js (v26+ recommended, not pinned)
- npm
- Modern browser (ES2023 target, IntersectionObserver, CSS OKLCH support)
- Static hosting (SPA — no server-side rendering)
- Deploy target: Not configured (no `dist/` deployment pipeline detected)
- No CI/CD configuration detected in the repository

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

## Naming Patterns

- React components (sections, pages, cards, UI primitives): PascalCase `.tsx` — `src/components/Header.tsx`, `src/pages/Home.tsx`, `src/components/ui/button.tsx`
- shadcn/ui primitives: **lowercase** filenames (`button.tsx`, `input.tsx`, `textarea.tsx`) — matches shadcn generator output
- Hooks: camelCase with `use` prefix — `src/hooks/useScrollSpy.ts`
- Utilities/lib: camelCase — `src/lib/utils.ts`, `src/lib/markdown.ts`
- Zod schemas: camelCase — `src/lib/schemas/contact.ts`
- Markdown content: lowercase kebab-case — `src/content/home/hero.md`, `src/content/projects/portfolio.md`
- PascalCase function declarations: `export function HeroSection()`, `export function Button()` (named exports)
- UI primitives use plain function declarations, not arrow functions: `function Input(...) {...}` then `export { Input }` (`src/components/ui/input.tsx`)
- Section components use inline `export function X()` (`src/components/HeroSection.tsx`)
- camelCase — `parseFrontmatter`, `getSection`, `getProjects`, `handleNavClick`, `measure`
- `parseYamlValue`, `parseYamlSimple` are the only internal helpers (module-private, not exported)
- Only one default export in the entire codebase: `App` in `src/App.tsx`. Everything else uses named exports.
- camelCase — `aboutData`, `submitStatus`, `activeId`, `navRef`, `mobileOpen`
- React state pairs follow `[value, setValue]` naming: `const [scrolled, setScrolled]`, `const [dark, setDark]`
- Boolean state reads as adjectives: `scrolled`, `mobileOpen`, `dark`
- PascalCase interfaces — `AboutCard`, `Skill`, `Social`, `ProjectCardProps`, `MarkdownFile`, `ProjectFile`
- Props interfaces named `<Component>Props` — `ProjectCardProps` (`src/components/ProjectCard.tsx`)
- Union types for status enums: `type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'` (`src/components/ContactSection.tsx`)
- Form data types derived from Zod: `export type ContactFormData = z.infer<typeof contactFormSchema>` (`src/lib/schemas/contact.ts`)
- `React.ComponentProps<"button">` used for UI primitive props (`src/components/ui/button.tsx`)

## Code Style

- No Prettier config, no `format` script exists (documented in `knowledge/development-guide.md` but not actually present)
- Style inconsistency: shadcn/ui components (`src/components/ui/*.tsx`, `src/lib/utils.ts`) use **double quotes, no semicolons, no trailing commas**; hand-written app code (`src/components/*.tsx`, `src/pages/*.tsx`, `src/lib/*.ts`) uses **single quotes, semicolons, trailing commas**
- shadcn/ui files use 2-space indent consistently; `src/index.css` uses 4-space indent (minor inconsistency)
- String quotes: single quotes for app code, double quotes inside shadcn/ui components
- ESLint flat config at `eslint.config.js` (ESLint 10)
- Extends: `js.configs.recommended`, `tseslint.configs.recommended`, `reactHooks.configs.flat.recommended`, `reactRefresh.configs.vite`
- `globalIgnores(['dist'])`; globals set to `globals.browser`
- Run with `npm run lint`
- `noUnusedLocals: true`, `noUnusedParameters: true` — unused imports/vars fail the build
- `verbatimModuleSyntax: true` — **must use `import type` for type-only imports** (e.g., `import { clsx, type ClassValue } from "clsx"` in `src/lib/utils.ts`, `import { contactFormSchema, type ContactFormData } from '@/lib/schemas/contact'`)
- `erasableSyntaxOnly: true` — no enums or namespaces; use unions instead (see `SubmitStatus`)
- `target: "es2023"`, `strict` implied by Vite template defaults
- `allowImportingTsExtensions: true` — imports may include `.tsx` extension (`src/main.tsx` imports `./App.tsx`)

## Import Organization

- `@/` maps to `src/` — configured in `tsconfig.app.json` (`"paths": { "@/*": ["./src/*"] }`) and `vite.config.ts` (`alias: { "@": path.resolve(__dirname, "./src") }`)
- shadcn/ui imports use `@/lib/utils`, `@/components/ui/...` (`components.json` aliases: `components`, `utils`, `ui`, `lib`, `hooks`)
- Section/page components import via `@/lib/markdown`, `@/hooks/useScrollSpy`
- One relative import within same directory: `src/components/FeaturedProjects.tsx` imports `./ProjectCard`

## Error Handling

- Zod validation for form data — schema in `src/lib/schemas/contact.ts`, resolver wired via `zodResolver(contactFormSchema)` (`src/components/ContactSection.tsx`)
- Error display via `errors.<field>.message` and `aria-invalid={errors.x ? 'true' : 'false'}` on inputs
- try/catch around async external calls (EmailJS `emailjs.send`), with `console.error` + status state transition (`src/components/ContactSection.tsx:76-79`)
- Guard clause pattern for missing content: `if (!aboutData) return null;` / `if (projects.length === 0) return null;` — section components render nothing when markdown content is absent
- No global error boundary exists; no error utility module

## Logging

- `console.error('EmailJS configuration missing')` — missing env config check (`src/components/ContactSection.tsx:55`)
- `console.error('Failed to send email:', error)` — caught async failure (`src/components/ContactSection.tsx:77`)
- No `console.log` in production source code

## Comments

- Complex/algorithmic logic — e.g., the frontmatter parser documents its YAML handling constraints: `"Minimal frontmatter parser — browser-safe, no Node.js dependencies."` (`src/lib/markdown.ts:32-33`)
- Why-not/contextual explanations — `"// Icons that match the original project's intent: wrench/code, lightbulb, chart"` (`src/components/AboutSection.tsx:11`), `"// Sliding active indicator — animates transform, not left"` (`src/components/Header.tsx:102`)
- Section markers in JSX: `{/* Title with gradient + blinking cursor */}` (`src/components/HeroSection.tsx:28`)
- Vite limitation note: `"// Individual raw imports (Vite 8 / rolldown doesn't support import.meta.glob with .md)"` (`src/lib/markdown.ts:14`)
- Used sparingly in `src/lib/markdown.ts` for public functions and interfaces: `/** Parsed markdown file metadata and content */`, `/** Parse raw markdown into frontmatter metadata and body content. */`
- One multiline JSDoc block on `useScrollSpy` in `src/hooks/useScrollSpy.ts`
- Components do NOT use JSDoc; props interfaces carry the documentation burden

## Function Design

- Components return JSX or `null` (guard clauses)
- Data helpers return typed values: `getSection(path: string): MarkdownFile | null`, `getProjects(): ProjectFile[]`
- `useScrollSpy(sectionIds: string[])` returns `string` (the active section id)

## Module Design

## Component Conventions

- shadcn/ui primitives use the CVA variant pattern (`cva(...)`), `data-slot` attributes, and Radix `Slot` for `asChild` polymorphism — `src/components/ui/button.tsx` is the canonical example
- Icons come from `@phosphor-icons/react`, always rendered with `weight="bold"` and a `size-*` Tailwind class (e.g., `className="size-5 text-primary"`)
- Sections follow a consistent structure: `<section id="..." className="py-20 md:py-28 scroll-mt-14">` → `<div className="max-w-6xl mx-auto px-4">` → icon + `h2` header → description → content grid
- Tailwind CSS 4 syntax: `@import "tailwindcss"`, `@custom-variant dark (&:is(.dark *))`, `@theme inline`, OKLCH color tokens in `src/index.css`
- JetBrains Mono (`font-mono`) used for terminal-style accents (the `_` cursor, `>` prompt prefix)
- Reduced-motion respected via `@media (prefers-reduced-motion: reduce)` in `src/index.css` and inline `<style>` in `src/components/CertificatesSection.tsx`

<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

## System Overview

```text

```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| `App` | Root layout, routing, shell composition | `src/App.tsx` |
| `Header` | Fixed navbar, scroll spy, dark mode toggle, mobile menu | `src/components/Header.tsx` |
| `Footer` | Social links, copyright | `src/components/Footer.tsx` |
| `Home` | Page composer — orders all section components | `src/pages/Home.tsx` |
| `HeroSection` | Hero with title, subtitle, CTA, profile photo, status pill | `src/components/HeroSection.tsx` |
| `AboutSection` | Bio text + info cards rendered from markdown frontmatter | `src/components/AboutSection.tsx` |
| `FeaturedProjects` | Grid of project cards filtered by `featured: true` | `src/components/FeaturedProjects.tsx` |
| `ProjectCard` | Single project display (image, tags, description, links) | `src/components/ProjectCard.tsx` |
| `SkillsSection` | Skill bars rendered from markdown frontmatter | `src/components/SkillsSection.tsx` |
| `CertificatesSection` | Badge-style certificate icons linking to PDFs | `src/components/CertificatesSection.tsx` |
| `ContactSection` | Contact form (react-hook-form + Zod + EmailJS) + info | `src/components/ContactSection.tsx` |
| `Button` | CVA variant-based button with Radix Slot `asChild` | `src/components/ui/button.tsx` |
| `Input` | Styled input component | `src/components/ui/input.tsx` |
| `Textarea` | Styled textarea component | `src/components/ui/textarea.tsx` |

## Pattern Overview

- Content is authored in markdown files with YAML frontmatter, imported as raw strings at build time via Vite `?raw` suffix
- A custom browser-safe YAML parser (`parseYamlSimple`) extracts metadata from frontmatter — no Node.js or external YAML library
- Components fetch their own data via `getSection()` or `getProjects()` calls (no central store, no data fetching library in use)
- Routing is present (`react-router-dom`) but only a single route (`/`) exists — the app functions as a single scrolling page
- Dark mode via class strategy (`document.documentElement.classList.add('dark')`) with localStorage persistence

## Layers

- Purpose: Mount the React app
- Location: `src/main.tsx`
- Contains: `createRoot` call, StrictMode wrapper
- Depends on: `src/App.tsx`, `src/index.css`
- Used by: `index.html`
- Purpose: Provide persistent UI (header, footer) around page content
- Location: `src/App.tsx`
- Contains: BrowserRouter, Header, Footer, Routes
- Depends on: Header, Footer, Home
- Used by: main.tsx
- Purpose: Compose sections into a complete page
- Location: `src/pages/Home.tsx`
- Contains: Imports and renders all section components in order
- Depends on: All section components
- Used by: App.tsx (routed)
- Purpose: Render individual page sections (Hero, About, Projects, Skills, Certificates, Contact)
- Location: `src/components/HeroSection.tsx`, `src/components/AboutSection.tsx`, `src/components/FeaturedProjects.tsx`, `src/components/SkillsSection.tsx`, `src/components/CertificatesSection.tsx`, `src/components/ContactSection.tsx`
- Contains: Section layout, data consumption from markdown, local UI logic
- Depends on: `src/lib/markdown.ts`, UI primitives, Phosphor Icons
- Used by: `src/pages/Home.tsx`
- Purpose: Author and store markdown content with structured metadata
- Location: `src/content/home/`, `src/content/projects/`
- Contains: `.md` files with YAML frontmatter
- Depends on: Nothing (static data)
- Used by: `src/lib/markdown.ts` (imported as raw strings)
- Purpose: Parse raw markdown into structured data accessible by components
- Location: `src/lib/markdown.ts`
- Contains: `parseFrontmatter()`, `getSection()`, `getProjects()`, `parseYamlSimple()`
- Depends on: Raw markdown imports
- Used by: All section components
- Purpose: Reusable styled base components (shadcn/ui pattern)
- Location: `src/components/ui/`
- Contains: Button, Input, Textarea — all using CVA for variants
- Depends on: `src/lib/utils.ts`, Radix UI, class-variance-authority
- Used by: Section components (HeroSection, ContactSection)
- Purpose: Shared utilities and validation schemas
- Location: `src/lib/utils.ts`, `src/lib/schemas/contact.ts`
- Contains: `cn()` utility, Zod `contactFormSchema`
- Depends on: clsx, tailwind-merge, zod
- Used by: UI primitives, ContactSection
- Purpose: Shared custom React hooks
- Location: `src/hooks/useScrollSpy.ts`
- Contains: `useScrollSpy()` — IntersectionObserver-based section tracking
- Depends on: Browser API (IntersectionObserver)
- Used by: Header

## Data Flow

### Primary Content Rendering (Build Time + Runtime)

### Contact Form Submission

### Dark Mode Toggle

### Scroll Spy Navigation

- Component-local `useState` only — no Zustand, no TanStack React Query usage yet
- Theme state: `useState` + `localStorage` in Header
- Form state: react-hook-form (ContactSection)
- Navigation state: `useScrollSpy` hook (Header)
- Mobile menu state: `useState` in Header

## Key Abstractions

- Purpose: Decouple content authoring from component rendering
- Examples: `src/content/home/hero.md`, `src/content/projects/portfolio.md`
- Pattern: Vite `?raw` imports create a build-time registry; components fetch data via `getSection()` / `getProjects()` functions
- Purpose: Composable, variant-driven styling for UI primitives
- Examples: `src/components/ui/button.tsx`
- Pattern: `cva()` defines variant maps, components accept variant props, `cn()` merges class names
- Purpose: Map viewport position to active navigation section
- Examples: `src/hooks/useScrollSpy.ts`, used by `src/components/Header.tsx`
- Pattern: IntersectionObserver with negative rootMargin centered on viewport

## Entry Points

- Location: `src/main.tsx`
- Triggers: Browser loads `index.html`, Vite serves module
- Responsibilities: Mount React root, render `<App />`
- Location: `index.html`
- Triggers: Browser navigation to any URL
- Responsibilities: Load module script, provide `<div id="root">`
- Location: `vite.config.ts`
- Triggers: `npm run dev` / `npm run build`
- Responsibilities: Configure React plugin, Tailwind CSS plugin, `@/` path alias

## Architectural Constraints

- **Single Route:** Only `/` exists. All "pages" are sections on the same scrollable page. Adding routes requires creating files in `src/pages/` and registering them in `src/App.tsx:12`.
- **No Server-Side Rendering:** Pure client-side SPA. Content is bundled at build time via Vite raw imports.
- **Build-Time Content:** Content changes require a rebuild. Markdown files cannot be updated at runtime.
- **Manual Module Registration:** New markdown content files must be manually imported and added to the `modules` record in `src/lib/markdown.ts:22-29`. The comment notes `import.meta.glob` is not supported with the current Vite/Rolldown configuration.
- **No Global State Store:** Zustand is installed but unused. All state is local to components.
- **No Data Fetching Layer:** TanStack React Query is installed but unused. No API calls except the EmailJS send.
- **Inline `<style>` Tags:** `CertificatesSection` uses an inline `<style>` tag for custom CSS rather than Tailwind utilities or the global stylesheet (`src/components/CertificatesSection.tsx:43-63`).

## Anti-Patterns

### Inline `<style>` Tags in Components

### Hardcoded Certificate Data

### Manual Module Registration in markdown.ts

## Error Handling

- Section components return `null` when data is missing (e.g., `src/components/HeroSection.tsx:8`: `if (!hero) return null`)
- Contact form uses `submitStatus` state machine (`'idle' | 'submitting' | 'success' | 'error'`) to drive UI feedback (`src/components/ContactSection.tsx:25`)
- EmailJS errors are caught and logged to `console.error` (`src/components/ContactSection.tsx:76-78`)
- Missing EmailJS env vars cause an early return with error status (`src/components/ContactSection.tsx:54-58`)

## Cross-Cutting Concerns

<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
