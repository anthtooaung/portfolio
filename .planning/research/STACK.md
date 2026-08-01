# Technology Stack — Personal Website Upgrade

**Project:** Mr.Ant's Portfolio — Personal Website Upgrade
**Researched:** 2026-08-01

## Current Stack (Do Not Re-Evaluate)

These are already in the project and working. No changes needed.

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.6 | UI framework |
| TypeScript | 6.0.2 | Type checking |
| Vite | 8.0.12 | Build tool + dev server |
| Tailwind CSS | 4.3.1 | Utility-first CSS (v4 syntax) |
| shadcn/ui | 4.11.0 (radix-lyra) | Component library |
| Phosphor Icons | 2.1.10 | Icon library |
| react-hook-form | 7.79.0 | Form state |
| Zod | 4.4.3 | Validation |
| react-markdown | 10.1.0 | Markdown rendering |
| react-router-dom | 7.17.0 | Client-side routing |

---

## New Additions for This Milestone

### 1. Hero Section 3D Tilt Effect — Use `react-parallax-tilt` (HIGH confidence)

**Recommendation:** `react-parallax-tilt` v1.7.336 — the standard, purpose-built choice.

**Why this over alternatives:**

- **React 15-19 support** verified in peer dependencies (`^15.0.0 || ^16 || ^17 || ^18 || ^19`) — zero peer dep warnings with React 19.2.6.
- **2.9kB gzipped, zero dependencies** — trivial bundle impact. No extra animation framework needed.
- **Purpose-built for exactly this use case** — mouse-tracking tilt with glare effects, parallax depth, and gyroscope support (mobile).
- **Well-maintained** — last publish 2026-07-29 (3 days ago), active GitHub at mkosir/react-parallax-tilt.
- **TypeScript built-in** — no `@types` package needed.

**Key props for our profile image tilt:**

| Prop | Default | Our Value | Rationale |
|------|---------|-----------|-----------|
| `tiltMaxAngleX` | 20 | 12 | Subtle, not disorienting |
| `tiltMaxAngleY` | 20 | 12 | Match X for symmetry |
| `glareEnable` | false | true | Polished effect |
| `glareMaxOpacity` | 0.7 | 0.25 | Subtle shimmer, not blinding |
| `glarePosition` | "bottom" | "all" | Even illumination |
| `glareBorderRadius` | "0" | "50%" | Match circular profile image |
| `scale` | 1 | 1.02 | Micro-growth on hover |
| `perspective` | 1000 | 800 | Closer = more dramatic |
| `transitionSpeed` | 400 | 300 | Snappier feel |
| `reset` | true | true | Reset on mouse leave |

**Alternatives rejected:**

| Alternative | Why Not |
|-------------|---------|
| `motion` / framer-motion | Already installed is not needed; motion is a full animation framework (~40kB). We only need tilt — react-parallax-tilt is 2.9kB. Overkill for this use case. |
| `react-tilt` v1.0.2 | Last published 2023-03-27, unmaintained. Peer deps pinned to React 18 only. |
| Custom `onMouseMove` + CSS transform | Reinvents the wheel. The glare effect alone would take 50+ lines. No benefit over the proven library. |
| `@react-three/fiber` v9.7.0 | Full Three.js abstraction (~150kB). Massive overkill for a tilt effect on a profile image. |

**Installation:**

```bash
npm install react-parallax-tilt
```

**Usage pattern for HeroSection.tsx:**

```tsx
import Tilt from 'react-parallax-tilt';

<Tilt
  tiltMaxAngleX={12}
  tiltMaxAngleY={12}
  glareEnable
  glareMaxOpacity={0.25}
  glarePosition="all"
  glareBorderRadius="50%"
  scale={1.02}
  perspective={800}
  transitionSpeed={300}
  gyroscope
>
  <img
    src="/profile.jpg"
    alt="Ant Htoo Aung"
    className="w-40 h-40 md:w-56 md:h-56 rounded-full object-cover ring-4 ring-primary/20 shadow-lg"
  />
</Tilt>
```

---

### 2. Light Theme Warm Palette — Pure OKLCH Token Overhaul (HIGH confidence)

**Recommendation:** Replace the current `:root` OKLCH tokens in `src/index.css` with warm-hued equivalents. No library needed — this is pure CSS variable changes.

**Why this approach:**

- The project already uses OKLCH design tokens with Tailwind v4 — the infrastructure is fully in place.
- No palette library needed; OKLCH makes warm/cool shifts trivial by adjusting the hue channel.
- Warm hues in OKLCH live around hue 60-90 (yellow-orange) to 30-40 (red-orange). The current palette sits at hue 280 (cool violet). Shifting to warm means moving the hue channel to the 50-80 range.

**Proposed warm palette (OKLCH):**

| Token | Current (cool) | Warm Replacement | Rationale |
|-------|---------------|------------------|-----------|
| `--background` | `oklch(1 0 0)` | `oklch(0.98 0.008 72)` | Cream background, not sterile white |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.22 0.01 55)` | Deep warm brown, not black |
| `--card` | `oklch(1 0 0)` | `oklch(0.97 0.01 72)` | Slightly warmer than background |
| `--card-foreground` | `oklch(0.145 0 0)` | `oklch(0.22 0.01 55)` | Match foreground |
| `--primary` | `oklch(0.54 0.22 280)` | `oklch(0.58 0.16 55)` | Warm amber/terracotta as primary |
| `--primary-foreground` | `oklch(0.985 0 0)` | `oklch(0.98 0.008 72)` | Cream white |
| `--secondary` | `oklch(0.965 0.01 280)` | `oklch(0.94 0.015 70)` | Warm beige |
| `--muted` | `oklch(0.965 0.005 280)` | `oklch(0.94 0.01 68)` | Warm off-white |
| `--accent` | `oklch(0.965 0.015 280)` | `oklch(0.93 0.02 65)` | Warm cream |
| `--border` | `oklch(0.90 0.01 280)` | `oklch(0.88 0.015 70)` | Warm subtle border |
| `--ring` | `oklch(0.54 0.22 280)` | `oklch(0.58 0.16 55)` | Match primary |

**Dark mode** should also shift to warm hues (darker warm-brown backgrounds instead of cool violet).

**Hue reference for OKLCH warm colors:**

| Hue Range | Family | Example |
|-----------|--------|---------|
| 0-15 | Red | Pure warm reds |
| 15-40 | Orange | Terracotta, coral |
| 40-70 | Yellow-orange | Amber, gold |
| 70-90 | Yellow | Cream, parchment |
| 90-130 | Yellow-green | Olive, sage |
| 280 | Blue-violet | Current palette (cool) |

**What to build:** A small utility or `@theme` extension to expose named warm palette tokens alongside the shadcn/ui tokens, so the warm palette can be used as Tailwind classes (e.g. `bg-warm-cream`, `text-warm-brown`).

**Rejected approaches:**

| Approach | Why Not |
|----------|---------|
| Tailwind's `@theme` auto-generated palette | The default palette generator creates utility colors, not semantic design tokens. We need `--background`, `--primary`, etc. |
| A third-party color system (e.g., Open Color, Open Props) | Adds dependencies. We control the tokens directly — no abstraction layer needed. |
| HSL palette | OKLCH is perceptually uniform and already the project's format. HSL is not — adjusting hue in HSL creates uneven brightness. |

---

### 3. Resume Page Layout — shadcn/ui Components (HIGH confidence)

**Recommendation:** Install shadcn/ui Card, Separator, and Badge components for the resume page. No extra layout library.

**Components to add:**

| Component | shadcn/ui Command | Purpose |
|-----------|-------------------|---------|
| Card | `npx shadcn@4.16.1 add card` | Resume sections (Experience, Education, Projects) |
| Badge | `npx shadcn@4.16.1 add badge` | Skill tags, tech stack indicators |
| Separator | `npx shadcn@4.16.1 add separator` | Visual breaks between resume sections |
| Table | `npx shadcn@4.16.1 add table` | Skills matrix or structured data |

**Why these specific components:**

- **Card** provides `CardHeader`, `CardTitle`, `CardContent`, `CardFooter` — maps directly to resume section structure (Section title + date in header, content in body).
- **Badge** with `variant="outline"` for skill tags is consistent with the existing CertificateSection badge pattern.
- **Separator** is the cleanest way to break sections visually without arbitrary `border-b` divs.
- **Table** is optional — only needed if a skills matrix or structured comparison is included.

**Installation (use current shadcn CLI version):**

```bash
npx shadcn@4.16.1 add card badge separator
# Table only if needed:
npx shadcn@4.16.1 add table
```

**Rejected approaches:**

| Approach | Why Not |
|----------|---------|
| Radix UI primitives directly | shadcn/ui wraps them with Tailwind styling already. No benefit to going lower-level. |
| A resume-specific library | Adds a dependency with limited value. A resume page is just structured content in styled containers. |
| react-to-print | We are using `@media print` CSS, not a JS-based print approach. react-to-print has stale issues with React 19. |

---

### 4. Print Stylesheet for Resume Page — Pure CSS (HIGH confidence)

**Recommendation:** Write a dedicated `@media print` block in `src/pages/resume.css` (or append to `index.css`). No library needed.

**Critical print CSS rules:**

```css
@media print {
  /* Hide non-resume elements */
  .no-print,
  nav,
  footer,
  [data-header],
  .scroll-to-top {
    display: none !important;
  }

  /* Page setup */
  @page {
    size: letter;
    margin: 0.6in 0.7in;
  }

  /* Reset for print */
  body {
    font-size: 11pt;
    color: #000;
    background: #fff;
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Prevent page breaks inside content blocks */
  section,
  .experience-item,
  .education-item,
  .project-item,
  .skill-group,
  .certificate-item {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  /* Prevent orphaned headings */
  h1, h2, h3, h4, h5, h6 {
    break-after: avoid;
    page-break-after: avoid;
  }

  /* Orphan/widow control for paragraphs */
  p, li {
    orphans: 3;
    widows: 3;
  }

  /* Force page break before major sections */
  .resume-section + .resume-section {
    break-before: page;
  }

  /* Show links as URLs */
  a[href]::after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
    color: #555;
  }

  /* Preserve key colors (badges, primary) */
  .badge-primary,
  .skill-bar {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* No shadows or borders that waste ink */
  * {
    box-shadow: none !important;
    text-shadow: none !important;
  }
}
```

**Key pitfalls to avoid:**

| Pitfall | Prevention |
|---------|------------|
| CSS Grid/Flexbox layouts breaking in print | Use `display: block` or test thoroughly. Some browsers collapse flex containers. Add `break-inside: avoid` to grid items. |
| Missing `print-color-adjust: exact` | Add to both body and specific elements (badges, colored backgrounds). Without it, browsers strip background colors. |
| Links not showing URLs | `a[href]::after` with `content: " (" attr(href) ")"` — but only show once if same link is repeated. |
| Page breaks mid-table | Apply `break-inside: avoid` to `tr` elements inside tables. |
| Dark mode printing dark backgrounds | Always force `background: white; color: black` in `@media print` — never assume user is in light mode. |
| Overflow content | Use `overflow: visible` in print — no scrolling in print. |

**The `window.print()` trigger:**

```tsx
<Button
  variant="outline"
  size="sm"
  onClick={() => window.print()}
  className="no-print"  /* Hide in print itself */
>
  <Printer weight="bold" />
  Print Resume
</Button>
```

---

### 5. Motion Library — Not Installed, Do Not Add (MEDIUM confidence)

**Recommendation:** Do not install `motion` (framer-motion successor) for this project.

**Rationale:**

- The tilt effect is handled by `react-parallax-tilt` (2.9kB).
- The project already has custom CSS animations (`animate-fade-up`, `animate-cursor-blink`, `animate-pulse`) in `index.css` — these are sufficient for entrance animations, scroll-triggered fades, and hover transitions.
- `motion` v12.43.0 (formerly framer-motion, import from `motion/react`) is excellent but at ~40kB gzipped. Adding it for a few parallax fades on a personal portfolio is disproportionate.
- If scroll-triggered animations become a priority later (e.g., staggered section reveals), consider `@react-spring/parallax` or IntersectionObserver-based CSS animations — both lighter than a full motion library.

**When you WOULD add motion:**

- If the project needs layout animations (shared element transitions between pages).
- If you want gesture-driven page transitions (swipe to navigate).
- If the project grows to need AnimatePresence for route transitions.
None of these are in scope.

---

## Installation Summary

Run in order:

```bash
# 1. Tilt effect for hero profile image
npm install react-parallax-tilt

# 2. shadcn/ui components for resume page
npx shadcn@4.16.1 add card badge separator

# 3. No other packages needed — palette changes are CSS-only,
#    print stylesheets are CSS-only, animations are CSS-only
```

---

## Versions Verified

| Package | Version | Last Published | Peer Deps (React) | Source |
|---------|---------|---------------|-------------------|--------|
| react-parallax-tilt | 1.7.336 | 2026-07-29 | ^15.0.0 \|\| ^16 \|\| ^17 \|\| ^18 \|\| ^19 | npm registry |
| motion (framer-motion) | 12.43.0 | 2026-07-28 | ^18.0.0 \|\| ^19.0.0 | npm registry |
| shadcn/ui (CLI) | 4.16.1 | current | n/a | npm registry |
| react | 19.2.6 | installed | — | package-lock.json |
| tailwindcss | 4.3.3 | installed | — | package-lock.json |
| lucide-react | 1.28.0 | installed | — | package-lock.json |
| zustand | 5.0.14 | installed | — | package-lock.json |

---

## Sources

- npm registry for react-parallax-tilt: peer deps and props — https://www.npmjs.com/package/react-parallax-tilt (verified 2026-08-01)
- npm registry for motion/framer-motion — https://www.npmjs.com/package/motion (verified 2026-08-01)
- shadcn/ui official docs — Card: https://ui.shadcn.com/docs/components/card, Badge: https://ui.shadcn.com/docs/components/badge, Separator: https://ui.shadcn.com/docs/components/separator, Table: https://ui.shadcn.com/docs/components/table (fetched 2026-08-01)
- oklch.com — OKLCH color picker and palette reference (fetched 2026-08-01)
- CSS print best practices — https://www.smashingmagazine.com/2015/01/designing-for-print-with-css/ (fetched 2026-08-01)
