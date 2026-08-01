# Codebase Structure

**Analysis Date:** 2026-08-01

## Directory Layout

```
portfolio/
├── index.html                    # HTML entry point
├── package.json                  # Dependencies and scripts
├── vite.config.ts                # Vite config (React, Tailwind, @/ alias)
├── tsconfig.json                 # Root TS config (references app + node)
├── tsconfig.app.json             # App TS config (ES2023, React JSX, path aliases)
├── tsconfig.node.json            # Node TS config (for vite.config.ts)
├── components.json               # shadcn/ui configuration (radix-lyra style)
├── eslint.config.js              # ESLint flat config
├── .env.example                  # EmailJS env var template
├── .gitignore                    # Git ignore rules
├── CLAUDE.md                     # Project instructions for Claude Code
├── README.md                     # Project readme
├── public/                       # Static assets served as-is
│   ├── favicon.svg               # Favicon
│   ├── icons.svg                 # Icon sprite
│   ├── profile.jpg               # Profile photo
│   └── certificates/             # PDF certificate files
│       └── *.pdf (6 files)
├── src/                          # Application source code
│   ├── main.tsx                  # React entry (createRoot + StrictMode)
│   ├── App.tsx                   # Root component (Router, Header, Footer, Routes)
│   ├── index.css                 # Tailwind imports, design tokens, animations
│   ├── assets/                   # Bundled static assets (images, SVGs)
│   │   ├── hero.png
│   │   ├── typescript.svg
│   │   └── vite.svg
│   ├── components/               # Feature components (one per section)
│   │   ├── Header.tsx            # Fixed navbar with scroll spy + dark mode
│   │   ├── Footer.tsx            # Social links + copyright
│   │   ├── HeroSection.tsx       # Hero with title, CTA, profile photo
│   │   ├── AboutSection.tsx      # Bio + info cards
│   │   ├── FeaturedProjects.tsx  # Project grid (filtered by featured flag)
│   │   ├── ProjectCard.tsx       # Single project card
│   │   ├── SkillsSection.tsx     # Skill bars with progress %
│   │   ├── CertificatesSection.tsx # Certificate badge icons
│   │   ├── ContactSection.tsx    # Contact form + info + social links
│   │   └── ui/                   # shadcn/ui primitive components
│   │       ├── button.tsx        # CVA variant button with Radix Slot
│   │       ├── input.tsx         # Styled text input
│   │       └── textarea.tsx      # Styled textarea
│   ├── content/                  # Markdown content files with YAML frontmatter
│   │   ├── home/                 # Homepage section content
│   │   │   ├── hero.md           # Hero title, subtitle, CTA
│   │   │   ├── about.md          # About bio + cards
│   │   │   ├── skills.md         # Skills list with levels
│   │   │   └── contact.md        # Contact info + social links
│   │   └── projects/             # Project entries
│   │       ├── portfolio.md      # This portfolio project
│   │       └── dashboard.md      # Analytics dashboard project
│   ├── hooks/                    # Custom React hooks
│   │   └── useScrollSpy.ts       # IntersectionObserver-based section tracker
│   ├── lib/                      # Utilities and business logic
│   │   ├── utils.ts              # cn() — clsx + tailwind-merge
│   │   ├── markdown.ts           # Frontmatter parser, getSection, getProjects
│   │   └── schemas/              # Zod validation schemas
│   │       └── contact.ts        # Contact form schema
│   └── pages/                    # Page-level components (routed)
│       └── Home.tsx              # Single page composing all sections
├── docs/                         # Design/planning documents
│   └── superpowers/
│       ├── plans/                # Implementation plans
│       └── specs/                # Design specs
├── knowledge/                    # Session logs and project knowledge
│   ├── development-guide.md
│   ├── portfolio-flow.md
│   ├── project-structure.md
│   └── YYYY-MM-DD.md             # Daily session logs
└── DESIGN-IS-2026-07-08/         # Design audit documents
    ├── 00-scope.md
    ├── 01-evidence.md
    ├── 02-scorecard.md
    ├── 03-verdict.md
    └── 04-handoff-prompt.md
```

## Directory Purposes

**`src/components/`:**
- Purpose: Feature-level React components, one per page section
- Contains: `.tsx` files — each exports a single named component
- Key files: `Header.tsx` (most complex, 187 lines), `ContactSection.tsx` (241 lines)

**`src/components/ui/`:**
- Purpose: Reusable, variant-driven UI primitives (shadcn/ui pattern)
- Contains: `.tsx` files using CVA for styling variants and Radix `Slot` for `asChild` polymorphism
- Key files: `button.tsx` (canonical shadcn/ui pattern), `input.tsx`, `textarea.tsx`

**`src/content/`:**
- Purpose: Markdown content files that drive what renders on the page
- Contains: `.md` files with YAML frontmatter between `---` delimiters
- Key files: `home/hero.md` (title/subtitle/CTA), `home/skills.md` (skills array with levels), `projects/portfolio.md` and `projects/dashboard.md`

**`src/lib/`:**
- Purpose: Shared business logic, utilities, and schemas
- Contains: TypeScript modules
- Key files: `markdown.ts` (content parsing system, 165 lines — most complex utility), `utils.ts` (cn helper), `schemas/contact.ts` (Zod schema)

**`src/hooks/`:**
- Purpose: Custom React hooks
- Contains: `.ts` files exporting hook functions
- Key files: `useScrollSpy.ts` (IntersectionObserver-based section tracking)

**`src/pages/`:**
- Purpose: Page-level components that map to routes
- Contains: `.tsx` files, each composing section components
- Key files: `Home.tsx` (the only page — composes all 6 sections)

**`public/`:**
- Purpose: Static assets served at root path without processing
- Contains: Images, SVGs, PDFs
- Key files: `profile.jpg`, `certificates/*.pdf`, `favicon.svg`

**`knowledge/`:**
- Purpose: Project documentation, session logs, development guides
- Contains: `.md` files (daily progress logs, architecture guides)
- Generated: Yes (daily logs created by session-end workflow)
- Committed: Yes

**`docs/`:**
- Purpose: Design specs and implementation plans
- Contains: `.md` files organized under `superpowers/`
- Generated: No (authored manually)

## Key File Locations

**Entry Points:**
- `index.html`: HTML shell, loads `/src/main.tsx` as module
- `src/main.tsx`: React DOM mount (`createRoot`), StrictMode wrapper
- `src/App.tsx`: Root component — BrowserRouter, Header, Footer, Routes

**Configuration:**
- `vite.config.ts`: Vite plugins (React, Tailwind), `@/` path alias
- `tsconfig.app.json`: TypeScript compiler options (ES2023 target, path aliases, strict checks)
- `components.json`: shadcn/ui config (radix-lyra style, phosphor icons, Tailwind CSS variables)
- `eslint.config.js`: ESLint flat config (TS, React hooks, React Refresh)

**Core Logic:**
- `src/lib/markdown.ts`: Content system — `parseFrontmatter()`, `parseYamlSimple()`, `getSection()`, `getProjects()`
- `src/hooks/useScrollSpy.ts`: Section visibility tracking via IntersectionObserver
- `src/lib/schemas/contact.ts`: Zod validation for contact form

**Styling:**
- `src/index.css`: Tailwind v4 imports, OKLCH design tokens (light + dark), custom animations, base styles

## Naming Conventions

**Files:**
- Components: `PascalCase.tsx` — e.g., `HeroSection.tsx`, `ProjectCard.tsx`, `CertificatesSection.tsx`
- UI primitives: `lowercase.tsx` — e.g., `button.tsx`, `input.tsx`, `textarea.tsx`
- Hooks: `camelCase.ts` with `use` prefix — e.g., `useScrollSpy.ts`
- Utilities: `camelCase.ts` — e.g., `markdown.ts`, `utils.ts`
- Schemas: `camelCase.ts` — e.g., `contact.ts`
- Content: `lowercase.md` — e.g., `hero.md`, `skills.md`, `portfolio.md`
- Pages: `PascalCase.tsx` — e.g., `Home.tsx`

**Directories:**
- All lowercase, no hyphens or underscores — e.g., `components`, `content`, `hooks`, `lib`, `schemas`
- Content subdirectories mirror section hierarchy: `home/`, `projects/`

**Exports:**
- Named exports for all components — `export function HeroSection() { ... }`
- Default export only for `App.tsx` — `export default function App()`

## Where to Add New Code

**New Page/Route:**
- Page component: `src/pages/[PageName].tsx`
- Route registration: `src/App.tsx` (add to `<Routes>`)

**New Section Component:**
- Component file: `src/components/[SectionName]Section.tsx`
- Page composition: `src/pages/Home.tsx` (import and render)
- Content: `src/content/home/[section].md` (markdown + frontmatter)
- Module registration: `src/lib/markdown.ts` (add raw import + `modules` entry)

**New shadcn/ui Component:**
- Component file: `src/components/ui/[name].tsx`
- Install via: `npx shadcn@latest add [component]` (respects `components.json` config)

**New Zod Schema:**
- Schema file: `src/lib/schemas/[domain].ts`

**New Custom Hook:**
- Hook file: `src/hooks/use[HookName].ts`

**New Static Asset:**
- Public (served as-is): `public/[filename]`
- Bundled (imported by code): `src/assets/[filename]`

**New Project Entry:**
- Content file: `src/content/projects/[slug].md` (include `title`, `tags`, `date`, `featured` in frontmatter)
- Module registration: `src/lib/markdown.ts` (add raw import + `modules` entry)

## Special Directories

**`dist/`:**
- Purpose: Vite production build output
- Generated: Yes
- Committed: No (in `.gitignore`)

**`node_modules/`:**
- Purpose: Installed npm packages
- Generated: Yes
- Committed: No

**`.planning/`:**
- Purpose: GSD codebase analysis documents
- Generated: Yes (by codebase mapper tools)
- Committed: Yes (used by planning/execution tools)

**`DESIGN-IS-2026-07-08/`:**
- Purpose: Design audit scope, evidence, scorecard, verdict, and handoff prompt
- Generated: No (authored manually)
- Committed: Yes

**`knowledge/`:**
- Purpose: Daily progress logs and project knowledge documents
- Generated: Partially (daily logs via session-end workflow)
- Committed: Yes

---

*Structure analysis: 2026-08-01*
