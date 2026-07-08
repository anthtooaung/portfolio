# Evidence — Dieter Rams Audit

All findings sourced from code inspection. No screenshots available (headless audit).

---

## Structural Evidence

**Source:** Structural subagent — full code read of `src/components/`, `src/pages/`, `src/lib/`

| Finding | Value | File:Line |
|---------|-------|-----------|
| Interactive elements | 5 visible (`<a>` tags) + 1 unused `<button>` component | HeroSection.tsx:25, ProjectCard.tsx:52, ProjectCard.tsx:62, ContactSection.tsx:29, ContactSection.tsx:39, ui/button.tsx:55 |
| Zero event handlers | No onClick/onSubmit anywhere | All component files |
| Zero inputs | No `<input>`, `<select>`, `<textarea>` on home page | — |
| Max JSX nesting | 9 levels (SkillsSection progress bar) | SkillsSection.tsx:33 |
| Repeated pattern: section padding | `py-16 md:py-24` on 3 sections | HeroSection.tsx:13, FeaturedProjects.tsx:10, ContactSection.tsx:20 |
| Repeated pattern: CTA styling | Identical hand-coded class string on 2 `<a>` tags | HeroSection.tsx:27, ContactSection.tsx:31 |
| Repeated pattern: wrapper layout | `max-w-6xl mx-auto px-4` on 4 sections | HeroSection.tsx:14, SkillsSection.tsx:16, FeaturedProjects.tsx:11, ContactSection.tsx:21 |
| Dead imports | 0 | — |
| Navigation structure | None — no navbar, header, footer, or sidebar | App.tsx, Home.tsx |
| shadcn Button | Defined in ui/button.tsx but never imported by any page component | ui/button.tsx:55, all page components |
| Dark mode toggle | None — `.dark` class never applied programmatically | index.css:7, index.css:87-119, main.tsx |

---

## Visual Evidence

**Source:** Visual subagent — CSS token analysis, contrast computation, state audit

### Spacing scale (13 unique values)
4, 6, 8, 10, 12, 14, 16, 20, 24, 32, 48, 64, 96 px

### Type scale (9 unique values)
12, 14, 16, 18, 20, 24, 30, 36, 60 px (continuous to 36px, then jumps 1.67x to 60px)

### Color count
11 distinct tokens actually referenced by components. Entirely monochromatic (OKLCH grays only — no hue/chroma in light or dark mode palette, except `--destructive`).

### Contrast ratios (computed from OKLCH → sRGB)

| Pair | Mode | Ratio | WCAG AA (4.5:1) |
|------|------|-------|-----------------|
| `--foreground` on `--background` | Light | 14.8:1 | ✅ Pass |
| `--muted-foreground` on `--background` | Light | 3.26:1 | ❌ Fail |
| `--muted-foreground` on `--muted` | Light | 3.04:1 | ❌ Fail |
| `--foreground` on `--background` | Dark | 14.8:1 | ✅ Pass |
| `--muted-foreground` on `--background` | Dark | 3.26:1 | ❌ Fail |
| `--muted-foreground` on `--muted` | Dark | 1..49:1 | ❌ Fail |

**Lowest contrast that actually renders: 3.04:1** — `--muted-foreground` on `--muted` in light mode (SkillsSection:26, ProjectCard:66, ContactSection:44). Both primary and muted text fail WCAG AA.

### States checklist

| Element | Empty | Loading | Error | Success | Focus | Disabled |
|---------|-------|---------|-------|---------|-------|----------|
| Links (5 on page) | ❌ | ❌ | ❌ | ❌ | ❌ No focus-visible | N/A |
| ProjectCard | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Skill cards | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| button.tsx (unused) | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |

### Dark mode
- Token system fully defined (light + dark in `index.css`)
- Tailwind `dark:` variant wired via `@custom-variant dark (&:is(.dark *))`
- **No toggle UI, no ThemeProvider, no `prefers-color-scheme` query**
- `dark:prose-invert` used in ContactSection.tsx:23, ProjectCard.tsx:45
- Site renders in light mode only

### Animation/motion
- 0 idle animations (no keyframes fire without interaction)
- Hover transitions: `transition-colors` (2 buttons), `transition-all` + `transition-transform` (ProjectCard)
- Abrupt `hover:underline` on demo/repo links (no transition)
- **No `prefers-reduced-motion` handling**

---

## Copy & Honesty Evidence

**Source:** Copy subagent — full read of all markdown content + component strings

### All user-facing strings

| String | Location | Type |
|--------|----------|------|
| `"Mr.Ant"` | hero.md:2 | h1 |
| `"Full-Stack Developer & UI Designer"` | hero.md:3 | subtitle |
| `"View My Work"` | hero.md:4 | CTA label |
| `"Building modern web experiences with clean code and thoughtful design."` | hero.md:8 | body |
| `"Skills & Technologies"` | skills.md:2, SkillsSection.tsx:17 | h2 (duplicated — md + hardcoded) |
| `"I work with modern web technologies to build fast, accessible, and beautiful applications."` | skills.md:18 | body |
| 6 skill labels + percentages | skills.md:4-14 | card content |
| `"Get In Touch"` | contact.md:2 | h2 |
| `"Let's build something great together."` | contact.md:13 | body |
| `"Email Me"` | ContactSection.tsx:32 | button label |
| `"GitHub"`, `"LinkedIn"`, `"Twitter"` | contact.md:6-10 | social link labels |
| `"Featured Projects"` | FeaturedProjects.tsx:12 | h2 (hardcoded, not from md) |
| `"Portfolio Website"` | portfolio.md:2 | card title |
| `"Analytics Dashboard"` | dashboard.md:2 | card title |
| `"Live Demo →"`, `"Source Code →"` | ProjectCard.tsx:58,68 | link labels |

### Flagged inflations
- `"build fast, accessible, and beautiful applications"` — skills.md:18 — unsubstantiated
- `"clean code and thoughtful design"` — hero.md:8 — unverifiable self-assessment
- `"great together"` — contact.md:13 — vague

**No extreme superlatives found.** Copy is relatively restrained.

### Dark patterns
**None found.**

### Jargon (acceptable for developer portfolio audience)
- `"Full-Stack Developer"` — hero.md:3 — opaque to non-technical visitors
- Skill names (React, TypeScript, Node.js, PostgreSQL, etc.) — technical labels

### Label→behavior mismatches
- **`"View My Work"`** (hero.md:4) → scrolls to `#projects` on same page (HeroSection.tsx:26). Suggests navigation to a separate page.
- **`"Featured Projects"`** (FeaturedProjects.tsx:12) → filters `meta.featured: true`, but both existing projects have `featured: true`, so it displays ALL projects, not a curated subset.

### Empty states
- **Every section uses `return null` for missing data** — no fallback copy, no error message, no "coming soon"
- HeroSection.tsx:5, SkillsSection.tsx:10, FeaturedProjects.tsx:7, ContactSection.tsx:12
- Zero empty-state or error-state copy on the entire home page

---

## Weight & Friction Evidence

**Source:** Weight subagent — `npm run build`, dist/ analysis, dependency audit

### Bundle size

| Asset | Uncompressed | Gzipped |
|-------|-------------|---------|
| `index-*.js` | 384.8 KB | 118.2 KB |
| `index-*.css` | 57.2 KB | 12.4 KB |
| **Total** | **442 KB** | **130.6 KB** |

Single monolithic JS chunk — no code splitting, no lazy loading.

### Network requests (home page)
8 requests: HTML + 1 JS + 1 CSS + 5 font subsets

### TTI estimate
- Desktop broadband: ~150-200ms
- Mobile 4G: ~300-500ms
- Mobile 3G: ~1,500-2,000ms

### Idle animations: 0
### Notifications/modals on load: 0

### Font weight
- JetBrains Mono variable font, 5 subsets loaded (latin, latin-ext, cyrillic, vietnamese, greek)
- Total: 82.2 KB — only latin (40 KB) needed for English site
- **42 KB of unnecessary font subsets**

### Broken images
- `portfolio.md` references `/images/projects/portfolio.png` — **404 (file does not exist)**
- `dashboard.md` references `/images/projects/dashboard.png` — **404 (file does not exist)**

### Orphaned assets
- `src/assets/hero.png` (12.8 KB) — not referenced
- `src/assets/typescript.svg` (1.3 KB) — not referenced
- `src/assets/vite.svg` (8.5 KB) — not referenced
- `public/icons.svg` (4.9 KB) — not referenced

### Unused npm dependencies (8 of 17)
- `@phosphor-icons/react` — zero imports
- `@tanstack/react-query` — zero imports
- `zustand` — zero imports
- `react-hook-form` — zero imports
- `zod` — zero imports
- `lucide-react` — zero imports
- `shadcn` — CLI tool, not runtime dep
- `tw-animate-css` — imported in CSS but zero animation classes used

### Dead code in src/
- `src/components/ui/button.tsx` — never imported by any page component
