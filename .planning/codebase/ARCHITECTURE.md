<!-- refreshed: 2026-08-01 -->
# Architecture

**Analysis Date:** 2026-08-01

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                       Entry Point                           │
│  index.html → src/main.tsx → src/App.tsx                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Layout Shell                              │
│  Header (fixed nav, scroll spy, dark mode toggle)          │
│  <Routes>                                                   │
│  Footer (social links)                                      │
│  BrowserRouter wraps entire shell                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Page Layer                                │
│  src/pages/Home.tsx — single route, composes all sections   │
├─────────┬──────────┬─────────────┬──────────┬───────────────┤
│  Hero   │  About   │  Projects   │  Skills  │  Contact      │
│  Section│  Section │  Featured   │  Section │  Section      │
│         │          │  Projects   │          │               │
└────┬────┴────┬─────┴──────┬──────┴────┬─────┴───────┬───────┘
     │         │            │           │             │
     ▼         ▼            ▼           ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│              Content / Data Layer                            │
│  src/content/  (markdown + YAML frontmatter)                │
│  src/lib/markdown.ts (parseFrontmatter, getSection,         │
│                       getProjects)                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────────┐
│              UI Primitives Layer                             │
│  src/components/ui/ (shadcn/ui: Button, Input, Textarea)    │
│  src/lib/utils.ts (cn utility)                              │
└─────────────────────────────────────────────────────────────┘
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

**Overall:** Markdown-driven Single Page Application

**Key Characteristics:**
- Content is authored in markdown files with YAML frontmatter, imported as raw strings at build time via Vite `?raw` suffix
- A custom browser-safe YAML parser (`parseYamlSimple`) extracts metadata from frontmatter — no Node.js or external YAML library
- Components fetch their own data via `getSection()` or `getProjects()` calls (no central store, no data fetching library in use)
- Routing is present (`react-router-dom`) but only a single route (`/`) exists — the app functions as a single scrolling page
- Dark mode via class strategy (`document.documentElement.classList.add('dark')`) with localStorage persistence

## Layers

**Entry / Bootstrap:**
- Purpose: Mount the React app
- Location: `src/main.tsx`
- Contains: `createRoot` call, StrictMode wrapper
- Depends on: `src/App.tsx`, `src/index.css`
- Used by: `index.html`

**Layout Shell:**
- Purpose: Provide persistent UI (header, footer) around page content
- Location: `src/App.tsx`
- Contains: BrowserRouter, Header, Footer, Routes
- Depends on: Header, Footer, Home
- Used by: main.tsx

**Page Layer:**
- Purpose: Compose sections into a complete page
- Location: `src/pages/Home.tsx`
- Contains: Imports and renders all section components in order
- Depends on: All section components
- Used by: App.tsx (routed)

**Section Components:**
- Purpose: Render individual page sections (Hero, About, Projects, Skills, Certificates, Contact)
- Location: `src/components/HeroSection.tsx`, `src/components/AboutSection.tsx`, `src/components/FeaturedProjects.tsx`, `src/components/SkillsSection.tsx`, `src/components/CertificatesSection.tsx`, `src/components/ContactSection.tsx`
- Contains: Section layout, data consumption from markdown, local UI logic
- Depends on: `src/lib/markdown.ts`, UI primitives, Phosphor Icons
- Used by: `src/pages/Home.tsx`

**Content Layer:**
- Purpose: Author and store markdown content with structured metadata
- Location: `src/content/home/`, `src/content/projects/`
- Contains: `.md` files with YAML frontmatter
- Depends on: Nothing (static data)
- Used by: `src/lib/markdown.ts` (imported as raw strings)

**Content Parsing Library:**
- Purpose: Parse raw markdown into structured data accessible by components
- Location: `src/lib/markdown.ts`
- Contains: `parseFrontmatter()`, `getSection()`, `getProjects()`, `parseYamlSimple()`
- Depends on: Raw markdown imports
- Used by: All section components

**UI Primitives:**
- Purpose: Reusable styled base components (shadcn/ui pattern)
- Location: `src/components/ui/`
- Contains: Button, Input, Textarea — all using CVA for variants
- Depends on: `src/lib/utils.ts`, Radix UI, class-variance-authority
- Used by: Section components (HeroSection, ContactSection)

**Utility / Schema Layer:**
- Purpose: Shared utilities and validation schemas
- Location: `src/lib/utils.ts`, `src/lib/schemas/contact.ts`
- Contains: `cn()` utility, Zod `contactFormSchema`
- Depends on: clsx, tailwind-merge, zod
- Used by: UI primitives, ContactSection

**Hooks:**
- Purpose: Shared custom React hooks
- Location: `src/hooks/useScrollSpy.ts`
- Contains: `useScrollSpy()` — IntersectionObserver-based section tracking
- Depends on: Browser API (IntersectionObserver)
- Used by: Header

## Data Flow

### Primary Content Rendering (Build Time + Runtime)

1. Markdown files in `src/content/` are imported as raw strings via Vite `?raw` imports (`src/lib/markdown.ts:15-20`)
2. A static `modules` record maps import paths to raw strings (`src/lib/markdown.ts:22-29`)
3. `getSection(path)` looks up the module and runs `parseFrontmatter()` on it (`src/lib/markdown.ts:137-142`)
4. `parseFrontmatter()` splits YAML frontmatter from markdown body (`src/lib/markdown.ts:126-131`)
5. `parseYamlSimple()` extracts metadata into a key-value record (`src/lib/markdown.ts:47-121`)
6. Components call `getSection()` at render time and use both `meta` (structured data) and `content` (markdown body)

### Contact Form Submission

1. User fills form → react-hook-form validates against Zod schema (`src/lib/schemas/contact.ts:3-7`)
2. `handleSubmit(onSubmit)` triggers the `onSubmit` callback (`src/components/ContactSection.tsx:147`)
3. `onSubmit` reads EmailJS config from `import.meta.env.VITE_EMAILJS_*` (`src/components/ContactSection.tsx:50-52`)
4. `emailjs.send()` sends the email with form data (`src/components/ContactSection.tsx:60-68`)
5. `submitStatus` state drives UI feedback (idle → submitting → success/error) (`src/components/ContactSection.tsx:25`)

### Dark Mode Toggle

1. Header reads initial state from `localStorage('theme')` or `prefers-color-scheme` media query (`src/components/Header.tsx:23-28`)
2. Toggle flips `dark` state (`src/components/Header.tsx:132`)
3. `useEffect` adds/removes `.dark` class on `document.documentElement` (`src/components/Header.tsx:31-38`)
4. CSS `.dark { ... }` rules in `src/index.css:89-121` apply the dark palette
5. State is persisted to `localStorage('theme')` (`src/components/Header.tsx:38`)

### Scroll Spy Navigation

1. `useScrollSpy(sectionIds)` creates an IntersectionObserver with `rootMargin: '-40% 0px -40% 0px'` (`src/hooks/useScrollSpy.ts:13-22`)
2. Observer watches all section elements by ID (`src/hooks/useScrollSpy.ts:29-33`)
3. `activeId` state updates based on which section intersects the viewport center (`src/hooks/useScrollSpy.ts:16-20`)
4. Header uses `activeId` to highlight the current nav link and position the sliding indicator (`src/components/Header.tsx:56-60`)

**State Management:**
- Component-local `useState` only — no Zustand, no TanStack React Query usage yet
- Theme state: `useState` + `localStorage` in Header
- Form state: react-hook-form (ContactSection)
- Navigation state: `useScrollSpy` hook (Header)
- Mobile menu state: `useState` in Header

## Key Abstractions

**Markdown Content Module:**
- Purpose: Decouple content authoring from component rendering
- Examples: `src/content/home/hero.md`, `src/content/projects/portfolio.md`
- Pattern: Vite `?raw` imports create a build-time registry; components fetch data via `getSection()` / `getProjects()` functions

**CVA Variant Components:**
- Purpose: Composable, variant-driven styling for UI primitives
- Examples: `src/components/ui/button.tsx`
- Pattern: `cva()` defines variant maps, components accept variant props, `cn()` merges class names

**ScrollSpy Section Tracking:**
- Purpose: Map viewport position to active navigation section
- Examples: `src/hooks/useScrollSpy.ts`, used by `src/components/Header.tsx`
- Pattern: IntersectionObserver with negative rootMargin centered on viewport

## Entry Points

**Application Entry:**
- Location: `src/main.tsx`
- Triggers: Browser loads `index.html`, Vite serves module
- Responsibilities: Mount React root, render `<App />`

**HTML Entry:**
- Location: `index.html`
- Triggers: Browser navigation to any URL
- Responsibilities: Load module script, provide `<div id="root">`

**Build Entry:**
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

**What happens:** `CertificatesSection` injects CSS via `<style>{...}</style>` for `.cert-ico-link` and `.cert-ico` classes (`src/components/CertificatesSection.tsx:43-63`).
**Why it's wrong:** Bypasses the Tailwind utility system, creates global class name pollution, and these styles are not scoped to the component.
**Do this instead:** Use Tailwind utility classes directly on elements, or add custom utilities to `src/index.css` under `@layer utilities`.

### Hardcoded Certificate Data

**What happens:** Certificate filenames are hardcoded in a `CERTS` array inside `src/components/CertificatesSection.tsx:3-10`.
**Why it's wrong:** Adding or removing certificates requires editing component source code. The pattern is inconsistent with the markdown-driven content approach used elsewhere.
**Do this instead:** Move certificate data into a markdown file (e.g., `src/content/home/certificates.md`) and consume it via `getSection()`, matching the pattern used by Hero, About, Skills, and Contact.

### Manual Module Registration in markdown.ts

**What happens:** Every new markdown file requires a new `import` statement and manual addition to the `modules` record in `src/lib/markdown.ts:15-29`.
**Why it's wrong:** Error-prone and creates friction for content updates. The comment at line 14 acknowledges this is a workaround for `import.meta.glob` not working with the current toolchain.
**Do this instead:** When the toolchain supports it, switch to `import.meta.glob('./content/**/*.md', { as: 'raw' })` to auto-discover content files. Until then, document the manual step clearly.

## Error Handling

**Strategy:** Minimal — inline conditional rendering with early returns.

**Patterns:**
- Section components return `null` when data is missing (e.g., `src/components/HeroSection.tsx:8`: `if (!hero) return null`)
- Contact form uses `submitStatus` state machine (`'idle' | 'submitting' | 'success' | 'error'`) to drive UI feedback (`src/components/ContactSection.tsx:25`)
- EmailJS errors are caught and logged to `console.error` (`src/components/ContactSection.tsx:76-78`)
- Missing EmailJS env vars cause an early return with error status (`src/components/ContactSection.tsx:54-58`)

## Cross-Cutting Concerns

**Styling:** Tailwind CSS v4 with OKLCH CSS custom properties for theming. Dark mode via `.dark` class on `<html>`. Design tokens defined in `src/index.css:54-121`.

**Validation:** Zod schemas in `src/lib/schemas/`. Only `contactFormSchema` exists currently (`src/lib/schemas/contact.ts:3-7`). Used with react-hook-form via `zodResolver`.

**Icons:** Phosphor Icons (`@phosphor-icons/react`) used throughout. Import individual icons (e.g., `House`, `User`, `Certificate`) rather than a barrel import.

**Accessibility:** Sections use `scroll-mt-14` for scroll offset. Form fields use `aria-invalid`. Nav links use `aria-label` on icon-only buttons. `prefers-reduced-motion` is respected in `src/index.css:156-166`.

---

*Architecture analysis: 2026-08-01*
