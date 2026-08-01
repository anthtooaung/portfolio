# Technology Stack

**Analysis Date:** 2026-08-01

## Languages

**Primary:**
- TypeScript ~6.0.2 - All application code (`src/**/*.ts`, `src/**/*.tsx`)
- CSS (Tailwind v4 syntax) - Styling via `src/index.css` and utility classes throughout

**Secondary:**
- Markdown - Content authoring (`src/content/**/*.md`)
- JavaScript - Config files only (`eslint.config.js`, `vite.config.ts`)

## Runtime

**Environment:**
- Node.js v26.2.0
- Browser (SPA) - React 19 renders client-side via `index.html`

**Package Manager:**
- npm (lockfile: `package-lock.json` present)
- No `.nvmrc` file — Node version not pinned in the repo

## Frameworks

**Core:**
- React 19.2.6 + React DOM 19.2.6 - UI framework (`src/main.tsx`, `src/App.tsx`)
- TypeScript 6.0.2 - Type checking and compilation (`tsconfig.json`, `tsconfig.app.json`)
- Vite 8.0.12 - Build tool and dev server (`vite.config.ts`)

**Styling:**
- Tailwind CSS 4.3.1 - Utility-first CSS (`@tailwindcss/vite` plugin, `src/index.css`)
- tw-animate-css 1.4.0 - Animation utilities (imported in `src/index.css`)
- shadcn/ui 4.11.0 (radix-lyra style) - Component library (`src/components/ui/`)
- class-variance-authority 0.7.1 (CVA) - Component variant pattern (`src/components/ui/button.tsx`)
- clsx 2.1.1 + tailwind-merge 3.6.0 - Class name composition (`src/lib/utils.ts`)
- @tailwindcss/typography 0.5.20 - Prose styling for markdown content

**Fonts:**
- JetBrains Mono Variable - Base/mono font (`@fontsource-variable/jetbrains-mono`, applied via `@apply font-mono` on `<html>`)
- Inter Variable - Sans-serif font (`@fontsource-variable/inter`, set as `--font-sans` in `src/index.css`)

**Forms:**
- react-hook-form 7.79.0 - Form state management (`src/components/ContactSection.tsx`)
- @hookform/resolvers 5.5.7 - Schema resolver integration
- Zod 4.4.3 - Form validation schemas (`src/lib/schemas/contact.ts`)

**Content:**
- react-markdown 10.1.0 - Markdown rendering (`src/components/AboutSection.tsx`, `ProjectCard.tsx`, `ContactSection.tsx`)
- remark-gfm 4.0.1 - GitHub Flavored Markdown support (tables, strikethrough, etc.)

**Routing:**
- react-router-dom 7.17.0 - Client-side routing (`src/App.tsx` — single route `/`)

**State Management (installed, not yet wired):**
- Zustand 5.0.14 - Client state store
- TanStack React Query 5.101.0 - Server state management

**Icons:**
- @phosphor-icons/react 2.1.10 - Primary icon library (configured in `components.json`)
- lucide-react 1.18.0 - Secondary icon library (installed, usage in shadcn/ui components)

## Key Dependencies

**Critical:**
- `@emailjs/browser` ^4.4.1 - Contact form email sending (`src/components/ContactSection.tsx`)
- `react-markdown` ^10.1.0 + `remark-gfm` ^4.0.1 - Renders markdown content from `src/content/` files
- `react-hook-form` ^7.79.0 + `zod` ^4.4.3 - Contact form validation and submission
- `radix-ui` ^1.5.0 - Headless UI primitives (shadcn/ui foundation)

**Infrastructure:**
- `@vitejs/plugin-react` ^6.0.1 - React fast refresh and JSX transform
- `@tailwindcss/vite` ^4.3.2 - Tailwind CSS Vite plugin (no PostCSS config needed)

## Configuration

**Environment:**
- `.env.example` file documents required vars (never commit `.env`)
- Vite env prefix: `VITE_` (accessed via `import.meta.env.VITE_*`)
- Required env vars:
  - `VITE_EMAILJS_SERVICE_ID` — EmailJS service identifier
  - `VITE_EMAILJS_TEMPLATE_ID` — EmailJS template identifier
  - `VITE_EMAILJS_PUBLIC_KEY` — EmailJS public API key

**Build:**
- `vite.config.ts` — Vite config with React plugin, Tailwind plugin, and `@/` path alias
- `tsconfig.json` — References `tsconfig.app.json` and `tsconfig.node.json`
- `tsconfig.app.json` — App source: ES2023 target, bundler module resolution, strict linting options (`noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`)
- `tsconfig.node.json` — Node/config files: covers `vite.config.ts` only
- `components.json` — shadcn/ui config: radix-lyra style, neutral base color, phosphor icons, CSS variables enabled

**Linting:**
- `eslint.config.js` — Flat config format, TypeScript + React Hooks + React Refresh rules, ignores `dist/`

**Theming:**
- `src/index.css` — CSS custom properties via OKLCH color space
- Dark mode: `@custom-variant dark (&:is(.dark *))` (Tailwind v4 syntax)
- shadcn/ui design tokens: background, foreground, card, primary, secondary, muted, accent, destructive, border, input, ring, popover, sidebar, chart-1 through chart-5

## Platform Requirements

**Development:**
- Node.js (v26+ recommended, not pinned)
- npm
- Modern browser (ES2023 target, IntersectionObserver, CSS OKLCH support)

**Production:**
- Static hosting (SPA — no server-side rendering)
- Deploy target: Not configured (no `dist/` deployment pipeline detected)
- No CI/CD configuration detected in the repository

---

*Stack analysis: 2026-08-01*
