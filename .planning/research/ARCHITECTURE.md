# Architecture Patterns

**Domain:** Personal developer portfolio website upgrade
**Researched:** 2026-08-01
**Mode:** Architecture dimension for existing React SPA

## Current State Summary

The existing architecture is a single-route React SPA with markdown-driven content. The key constraint is that `parseYamlSimple` (the custom YAML parser in `src/lib/markdown.ts`) only handles flat key-value pairs and simple arrays of objects — no nested objects, no arrays of arrays. This limits what can be expressed in markdown frontmatter and directly influences the resume data structure decision.

Other current constraints that shape the architecture:
- Content is imported as raw strings via Vite `?raw` and registered manually in a `modules` record (`src/lib/markdown.ts:15-29`). `import.meta.glob` does not work with the current Vite/Rolldown config, so every new content file needs a manual import + registration.
- `parseFrontmatter()` runs on every render with no memoization (per `markdown.ts` — components call `getSection()` in render body).
- Routing exists (react-router-dom 7) but only `/` is registered, in `src/App.tsx`.
- Dark mode is class-based: `.dark` on `<html>`, CSS variables in OKLCH defined in `src/index.css` (`:root` at lines 54-87, `.dark` at 89-121).
- `prefers-reduced-motion` is already respected in `src/index.css:156-166`.
- No error boundaries, no 404 page, no per-route scroll restoration.

## Recommended Architecture

### Route Structure: Two-Route Split with Conditional Chrome

The existing `src/App.tsx` wraps everything (Header, Routes, Footer) in one BrowserRouter layout. Two viable structures exist:

| Pattern | What it does | Verdict |
|---------|-------------|---------|
| **Shared shell (current)** | Header + Footer wrap both Home and Resume | Rejected — the fixed header runs scroll-spy and mobile-menu logic that is meaningless on a resume, and print CSS must then hide it via `display:none` |
| **Conditional chrome** | Header + Footer render only on `/`; `/resume` renders standalone | **Recommended** — no dead logic on the resume page, simpler print CSS, cleaner component boundary |

**Implementation:** read `useLocation().pathname` in `App.tsx`. Keep Header/Footer when path is `/`; render ResumePage standalone at `/resume`. This is a small, low-risk change to the single existing route registration point (`App.tsx:12`).

```
src/App.tsx
├── BrowserRouter
│   └── <div className="min-h-screen flex flex-col">
│       ├── (only when pathname === "/") <Header />
│       ├── <Routes>
│       │   ├── "/"       → <Home />
│       │   └── "/resume" → <ResumePage />   // standalone, no chrome
│       └── (only when pathname === "/") <Footer />
```

**Route-scroll concern:** react-router does not auto-reset scroll between routes. Navigating from a scrolled position on `/` to `/resume` (e.g., via a Header "Resume" link) would open the resume mid-scroll. A `ScrollToTop` component (a `<ScrollRestoration>`-style effect on `pathname` change, ~10 lines) should be added when wiring the route.

**Header integration:** The Header currently has 6 scroll-spy anchor links (`#home`, `#about`, `#projects`, `#skills`, `#certificates`, `#contact`). A "Resume" link must be a **router link to `/resume`**, not another `#anchor` — otherwise it breaks scroll-spy (it observes only section IDs on `/`). Keep `NAV_LINKS` for anchors, add a separate top-level `<Link to="/resume">`.

### Component Boundaries

| Component | Responsibility | Communicates With | New/Existing |
|-----------|---------------|-------------------|--------------|
| `App` | Route selection + conditional chrome | Header, Footer, Home, ResumePage | Modified |
| `Home` | Composes all section components on `/` | All section components | Existing |
| `ResumePage` | Page composer for resume; owns screen/print layout switch | Resume sections, print utilities | New |
| `ResumeProfile` | Name, title, contact links summary | Resume data | New |
| `ResumeExperience` | Work-history entries (date range, title, company, bullets) | Resume data | New |
| `ResumeEducation` | Degree entries | Resume data | New |
| `ResumeSkills` | Skill grouping + proficiency bars | Resume data | New |
| `ResumeCertificates` | Credential links (reuse icon-badge pattern) | Resume data, Certificate icon | New |
| `HeroSection` | Add 3D tilt wrapper around profile photo | TiltProfile3D, hero markdown | Modified |
| `TiltProfile3D` | Mouse-tracked 3D tilt on profile photo | none (self-contained, pointer events only) | New |
| `useResume` | Loads + parses resume data (markdown or JSON) | resume content module, parseYamlSimple or JSON import | New |
| `markdown.ts` | Extend `modules` record with resume content file | resume content file | Extended |

**Boundary rules:**
- Resume components never read section markdown; Home sections never read resume data.
- `ResumePage` is the only component that knows about the print/screen split. Section components render content; the page owns layout classes (`print:...` / `screen:...`).
- `TiltProfile3D` is a pure presentational wrapper. It takes `children`, adds `onMouseMove`/`onMouseLeave`, applies transforms, and respects `prefers-reduced-motion`. It does not fetch data.
- Data access stays as close to the consumer as today (components call a getter in render). Do not introduce a global store for resume data — it is read once by one page.

### Data Flow

#### Home page (unchanged, single scroll)
Same as today: `Home.tsx` → section components → `getSection('home/*.md')` / `getProjects()` → `parseFrontmatter` + `parseYamlSimple` → `meta` (rendered data) + `content` (react-markdown body).

#### Resume page
```
ResumePage
   │ useResume()  ← reads content module (raw import registered in markdown.ts modules)
   │              → parseFrontmatter / JSON.parse → typed ResumeData
   ▼
ResumeProfile ── ResumeExperience ── ResumeEducation ── ResumeSkills ── ResumeCertificates
   │                  │                  │                 │                │
   └──────────────────┴──────────────────┴─────────────────┴────────────────┘
                           all consume the same ResumeData shape
```

- The resume is a **separate content file** — not a section in `home/`. It lives in `src/content/resume/` and is registered as a module in `markdown.ts` (manual registration is the documented constraint).
- `ResumePage` fetches the data once via `useResume()` (memoized) and passes **slices** down as props (e.g., `<ResumeExperience items={data.experience} />`). This keeps each section presentational and testable in isolation.
- **Direction is explicit and one-way:** content file → parser → `useResume` → `ResumePage` → section components → UI. No child writes back to data.

#### Hero 3D tilt
```
PointerEvent on wrapper div → normalized (-0.5..0.5) motion values → spring-smoothed rotateX/rotateY → CSS transform
   │
   └── prefers-reduced-motion / pointer:coarse guard → no tilt, static image
```
Data flow is self-contained; the tilt wrapper does not touch content or state outside itself.

### Resume Data Structure: Markdown + Frontmatter (not JSON, not inline)

| Option | Fit with existing system | Verdict |
|--------|-------------------------|---------|
| **Inline JSX** (resume hardcoded in a component) | Breaks the markdown-driven convention the whole site uses; resumes change frequently (job applications) | Rejected |
| **JSON file** (`src/content/resume/resume.json`) | Clean structured data, but introduces a second content format outside the existing markdown pipeline; `parseYamlSimple` is bypassed; TypeScript needs `resolveJsonModule` or a `.ts` wrapper to type it | Rejected for now |
| **Markdown + YAML frontmatter** | Matches the established content system exactly; `getSection('resume/resume.md')` works with zero pipeline changes | **Recommended** |

**Why markdown+frontmatter wins here specifically:**
1. The existing `parseYamlSimple` already handles the two shapes needed: flat key-values (`name`, `title`, `email`) and arrays of objects (`- title: "..."`, `  company: "..."`, `  bullets: [...]`). A resume section like Experience is exactly "array of objects, each with scalar fields + a simple array of bullet strings." The skills.md and about.md files already exercise this shape (`skills.md` has `- name` / `level`).
2. No new parser, no new imports of a second content type, no TypeScript config change.
3. `@tailwindcss/typography` is already installed — the markdown body renders through `react-markdown` + `remark-gfm` for free-form resume sections (summary paragraph, custom notes) while frontmatter drives the structured parts.

**Proposed frontmatter shape** (flat keys + arrays of objects, within `parseYamlSimple` limits):

```yaml
---
name: "Ant Htoo Aung"
title: "Full-Stack Developer & UI Designer"
email: "ant@example.com"
location: "Yangon, Myanmar"
website: "https://mr-ants-portfolio.dev"
linkedin: "https://linkedin.com/in/anthtooaung"
github: "https://github.com/anthtooaung"
summary: "Frontend developer focused on clean, responsive React applications."
experience:
  - title: "Frontend Developer"
    company: "Company A"
    period: "2024-01 — Present"
    bullets: ["Built React dashboards", "Led UI redesign"]
  - title: "Web Developer"
    company: "Company B"
    period: "2022-06 — 2023-12"
    bullets: ["Maintained marketing sites"]
education:
  - degree: "B.Sc. Computer Science"
    school: "University"
    period: "2018 — 2022"
skills:
  - name: "Frontend"
    items: ["React", "TypeScript", "Tailwind CSS"]
  - name: "Backend"
    items: ["Node.js", "PostgreSQL"]
certificates:
  - name: "AWS Certified Developer"
    file: "certificate-xxx.pdf"
---
```

Constraint check: every line above is either `key: scalar` or an array-of-objects block with scalar sub-keys — exactly what `parseYamlSimple` supports. One caveat: an inline array like `items: ["React", "TypeScript"]` parses, but a nested `skills` array of objects each containing a list (`items:`) is **not** supported. If skills with per-group lists are desired, the workaround is flat `skills: ["React", "TypeScript"]` plus grouping done by the component (filter by tag prefix) — or keep a single flat skill list for the resume. This is a documented parser limitation, not a blocker.

**Migration note:** This should live in a separate file `src/content/resume/resume.md` registered in `markdown.ts`. Do not co-locate resume data with `home/` sections.

### Print Stylesheet Architecture

**Approach: CSS-in-file `@media print` rules — not a separate stylesheet, not a JS print library.**

| Approach | Verdict |
|----------|---------|
| Separate `print.css` linked only in the Resume page | Rejected — Vite SPA loads one bundled CSS; a separate file adds a link/handling step for zero benefit |
| `window.print()` + `@media print` block in `src/index.css` | **Recommended** — zero dependencies, works in every browser, the resume page HTML *is* the printable document |
| Pre-generated PDF via Puppeteer/wkhtmltopdf at build time | Rejected for this milestone — adds a Node build step, needs a new devDependency and a deploy pipeline that doesn't exist; revisit only if recruiters need a download link that cannot be a print dialog |

**Structure — a `@media print` section in `src/index.css`** (or a dedicated `@layer print` block imported into it). Since the resume page renders standalone (conditional chrome above), print CSS only needs to target resume classes:

```css
@media print {
  @page { size: A4; margin: 1.2cm; }
  html, body { background: #fff !important; }
  .print-hide { display: none !important; }
  .print-only { display: block !important; }
  .resume-section { break-inside: avoid; }
  h2, h3 { break-after: avoid; }
  a { color: #000; text-decoration: none; }
  a[href^="http"]::after { content: " (" attr(href) ")"; font-size: 0.8em; color: #555; }
  .screen-only { display: none !important; }
}
```

Key decisions:
- **`break-inside: avoid`** on each resume section so an experience entry never splits across a page boundary.
- **`break-after: avoid`** on headings so a heading never orphans at the bottom of a page.
- **Force light/white colors in print** — dark mode must not print dark. Override `color-scheme` and set `background:#fff; color:#000` at the root; do not rely on `print-color-adjust`.
- **Do NOT rely on the `.dark` class during print** — the toggle lives in Header, which the resume page does not render, but the `.dark` class persists on `<html>` from the user's last session. Print CSS must explicitly reset colors rather than assume light mode.
- **The Download/Print button** calls `window.print()` and is `display:none` in print (`print-hide`).
- **ATS note:** search engines and ATS parsers read the HTML, so keep semantic `h1`/`h2`/`h3`, `<ul>`, `<address>`, and real text — no decorative-only markup in the resume page.

**Reduced-motion:** the existing `prefers-reduced-motion` block in `index.css` covers entrance animations. The tilt effect must additionally gate itself on `prefers-reduced-motion` and on coarse pointers (`@media (pointer: coarse)` — no hover, no tilt).

### 3D Tilt Animation: CSS-only vs Library

| Option | Bundle cost | Effect quality | Verdict |
|--------|-------------|----------------|---------|
| **Pure CSS hover transform** (`perspective` + `rotateX/Y` transition) | 0 KB | Static hover-only tilt; cannot track the mouse; feels rigid | Rejected — the user wants a distinctive, mouse-tracked treatment |
| **CSS perspective + JS pointer tracking** (hand-rolled `onMouseMove` setting `--rx`/`--ry` custom props) | ~0 KB | Full mouse tracking with CSS transition easing; spring feel achievable via `transition` timing | **Recommended** — no new dependency, GPU-accelerated `transform`, ~30 lines |
| `react-parallax-tilt` | ~4-6 KB | Purpose-built tilt wrapper, glare option, simple API | Viable alternative; adds a dependency for one effect |
| `framer-motion` / `motion` | ~35-50 KB | Best-in-class spring physics, but the project uses none of it yet | Rejected — heavy for a single hover effect; the project already ships tw-animate-css and prefers zero new animation deps |
| Three.js / React Three Fiber | ~150 KB+ | Full 3D scene | Rejected — massively over-scoped for a profile photo |

**Recommendation: hand-rolled mouse-tracking tilt with CSS custom properties.** Rationale: the effect is exactly one component (`TiltProfile3D`), the math is `rotateY = (x - 0.5) * maxAngle`, and CSS custom properties keep the animation on the compositor thread (only `transform` mutates). No new runtime dependency, no bundle growth, and it degrades gracefully to a static image on `pointer: coarse` / `prefers-reduced-motion`.

```tsx
// TiltProfile3D — conceptual shape
function TiltProfile3D({ children, maxAngle = 10 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const onMove = (e: React.PointerEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5..0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ ry: x * maxAngle, rx: -y * maxAngle });       // rotateY from x, rotateX from y
  };

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={() => setTilt({ rx: 0, ry: 0 })}
         className="[transform-style:preserve-3d] [transition:transform_0.3s_ease-out] will-change-transform motion-reduce:transition-none motion-reduce:transform-none pointer-coarse:transform-none"
         style={{ transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` }}>
      {children}
    </div>
  );
}
```

**Design guardrails (from research):** keep tilt 5-15 degrees max; combine at most 2-3 motion effects in the hero (the site already has staggered `animate-fade-up` + cursor blink — the tilt should be the third and final one); do not tilt on the scroll indicator or CTAs.

### Warm Light Theme Token Strategy

The theme lives entirely in CSS variables in `src/index.css`. **Warm theme = shift hue + lower lightness/chroma of the light-mode tokens only.** The dark theme (`:root .dark`) can stay cool (dark mode already reads fine) or get a slight warm shift for consistency — but the critical work is the light `:root` block.

| Token | Current (cool, hue 280) | Warm target (hue ~70-90) | Rationale |
|-------|------------------------|--------------------------|-----------|
| `--background` | `oklch(1 0 0)` pure white | `oklch(0.975 0.012 85)` cream | Remove clinical white; cream base |
| `--foreground` | `oklch(0.145 0 0)` near-black | `oklch(0.28 0.02 55)` warm dark brown | Softer, warmer text |
| `--card` | `oklch(1 0 0)` | `oklch(0.99 0.008 88)` warm off-white | Surface slightly lighter than bg |
| `--primary` | `oklch(0.54 0.22 280)` violet | `oklch(0.55 0.14 50)` warm amber/terracotta | Signature accent shifts warm |
| `--secondary` / `--muted` / `--accent` | cool gray-violets | `oklch(0.95 0.015 80)` warm tints | Hover/tint fills feel warm |
| `--border` / `--input` | `oklch(0.90 0.01 280)` | `oklch(0.88 0.015 80)` | Warm hairline borders |
| `--ring` | violet | warm amber | Focus ring matches primary |
| `--chart-*` | cool hues | warm hues (amber, terracotta, olive) | Chart tokens follow the family |

**Rules for a safe warm shift:**
1. **Do not restructure the token system.** Every shadcn token already exists; only values change. Components using `bg-background`, `text-muted-foreground`, `border-border` etc. update automatically — zero component churn.
2. **Contrast is preserved by lightness, not hue.** Keep foreground lightness ≤ 0.30 (dark text) and muted-foreground ≤ 0.50 against the ~0.975 cream background to hold WCAG AA 4.5:1. Warm hues have slightly lower perceived brightness than cool ones at equal OKLCH lightness, so verify `--foreground` at ~0.28 and `--primary` (used for text links) at ~0.55 with a contrast check.
3. **The `.text-gradient-violet` utility** (`index.css:169-175`) hardcodes violet; it should read from `var(--primary)` instead so the hero gradient shifts warm automatically.
4. **The amber hardcoded in CertificatesSection** (`const AMBER = '#f59e0b'`) is a separate concern — it stays amber and actually complements the warm palette; no change required, though the anti-pattern (inline `#f59e0b`) could move to `--cert-accent` token if consistency is desired.
5. **Dark mode:** optionally shift `--background` to a warm dark (`oklch(0.18 0.01 70)`) so toggling does not feel like a different site. Low priority; the dark block already has warm-compatible chroma.
6. **`color-scheme`:** set `color-scheme: light dark` (or declare on each block) so native form controls, scrollbars, and focus rings follow the active theme.

### Patterns to Follow

#### Pattern 1: Data-slice prop passing for the resume
**What:** `ResumePage` fetches typed data once, passes immutable slices to presentational section components.
**When:** Any page that composes structured sections (resume, future blog index).
**Example:** `<ResumeExperience items={data.experience} />`.

#### Pattern 2: CSS-only print, content-first HTML
**What:** The resume page is the printable document. Print styles only reflow/lay out; they never inject content that matters.
**When:** Any printable page.

#### Pattern 3: Hand-rolled compositor-friendly animation
**What:** Mouse-tracked effects use JS only to compute values and CSS custom properties + `transform` to apply them; keep motion on `transform`/`opacity`.
**When:** A single bespoke effect where a library is overkill.

### Anti-Patterns to Avoid

#### Anti-Pattern 1: Shared chrome on the resume page
**What:** Header (fixed, scroll-spy, mobile menu) + Footer render on `/resume`.
**Why bad:** Dead scroll-spy on a non-scroll page; print CSS must `display:none` the header; mobile menu state persists for nothing.
**Instead:** Conditional chrome in `App.tsx` by pathname.

#### Anti-Pattern 2: A "Resume" entry inside the scroll-spy `NAV_LINKS`
**What:** Adding `{ label: 'Resume', href: '#resume' }` to the anchor nav.
**Why bad:** `useScrollSpy` observes section IDs that do not exist on `/resume`; clicking it on `/` scrolls nowhere or breaks the active-link indicator.
**Instead:** A separate top-level `<Link to="/resume">` rendered next to the anchor nav.

#### Anti-Pattern 3: Nested arrays or objects in resume frontmatter
**What:** `skills:\n  - name: "X"\n    items: [...]` (array inside an array-of-objects).
**Why bad:** `parseYamlSimple` does not support it; it silently misparses or produces wrong data with no error.
**Instead:** Flat arrays (`skills: ["React", "TypeScript"]`) or arrays of objects with scalar values only. Document the limitation at the top of the resume content file.

#### Anti-Pattern 4: `import.meta.glob` for resume discovery
**What:** Trying to auto-discover content now that there are more files.
**Why bad:** Documented as unsupported with the current Vite/Rolldown config (`markdown.ts:14`); it will fail at build time.
**Instead:** Manual import + `modules` registration, exactly like the existing five files.

#### Anti-Pattern 5: Animating with JS for something CSS can do
**What:** Adding framer-motion or react-parallax-tilt for a hover tilt and a print button.
**Why bad:** ~40 KB of dependencies for effects achievable with 30 lines + CSS transitions, in a project that deliberately keeps animations light (tw-animate-css, CSS keyframes).
**Instead:** Hand-rolled tilt (Pattern 3); `window.print()`.

#### Anti-Pattern 6: Print CSS that depends on the `.dark` class
**What:** `@media print` rules that assume the light palette because the resume page hides the toggle.
**Why bad:** `.dark` persists on `<html>` from the user's last session; printing a resume in dark mode is unprofessional and wastes ink.
**Instead:** Explicitly reset `background:#fff; color:#000` in the print block.

## Scalability Considerations

| Concern | At current scale (1 page + resume) | At 10 sections | At blog added (v2) |
|---------|------------------------------------|----------------|--------------------|
| Content registration | Manual `modules` entry per file (works, documented) | Manual entries get tedious | **Switch to `import.meta.glob`** once the toolchain supports it; the modules map is already the only coupling point |
| Routing | 2 routes, conditional chrome | Same pattern holds | Consider `Layout` routes with `<Outlet/>` if a third chrome style appears (e.g., blog layout) |
| Data access | Components call getters in render | Fine; consider memoizing `parseFrontmatter` results (`useMemo` or a module-level cache) | Consider a real store (Zustand is already installed) if shared data grows |
| Print | One print block in `index.css` | Keep `@media print` consolidated in one place | Move to a `print.css` import only if print rules outgrow the main sheet |
| Animation | 3 effects in hero | Keep the "max 2-3 per section" rule | Revisit a motion library only when scroll-driven sequences are needed |

## Build Order (Dependency-Driven)

1. **Warm theme token shift** (`index.css` `:root` values + `text-gradient-violet` → `var(--primary)`) — foundation; every subsequent visual change sits on it. Zero component risk. Verify contrast before proceeding.
2. **`/resume` route skeleton** — conditional chrome in `App.tsx`, `ScrollToTop`, empty `ResumePage`, Header `<Link to="/resume">`. Unblocks everything resume-related and locks the route structure early.
3. **Resume data + sections** — `src/content/resume/resume.md`, `markdown.ts` registration, `useResume`, then section components in dependency order (Profile → Experience → Education → Skills → Certificates). Resume sections are independent once the data shape is fixed, so they can be built in parallel.
4. **Print stylesheet** — after the resume sections render, add the `@media print` block and the print/download button. Requires sections to exist first to validate `break-inside` behavior.
5. **3D tilt on hero** — independent of resume work; can land any time after the theme, but schedule it last so the visual polish pass stays coherent. Must gate on `prefers-reduced-motion` + `pointer: coarse`.
6. **(Optional, later) Certificates markdown migration** — the known anti-pattern (`CERTS` hardcoded, inline `<style>`); not required by this milestone but the resume Certificates section should share the same markdown-driven pattern from day one.

**Parallelization note:** Steps 3 and 5 have no coupling and can proceed in parallel. Steps 1 and 2 are prerequisites for everything visual.

## Sources

- Web research (resume page patterns, print CSS best practices, 3D tilt approaches, warm OKLCH palettes, micro-interactions) — confidence MEDIUM (single-source web, cross-checked against codebase facts)
- Codebase ground truth: `src/App.tsx`, `src/index.css`, `src/lib/markdown.ts`, `src/components/Header.tsx`, `src/components/HeroSection.tsx`, `src/components/CertificatesSection.tsx`, `src/pages/Home.tsx`, `tsconfig.app.json`, `package.json` — confidence HIGH (read directly)
- Existing architecture analysis: `.planning/codebase/ARCHITECTURE.md` and `STACK.md` — confidence HIGH

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Route structure (conditional chrome) | HIGH | Matches existing router version; minimal change to a documented registration point |
| Resume data as markdown+frontmatter | HIGH | Directly matches existing parser capabilities and content system; JSON rejected on pipeline-fit grounds |
| Print stylesheet (CSS `@media print` + `window.print()`) | MEDIUM | Standard practice; final layout quality must be validated with browser print preview |
| CSS+JS tilt vs library | MEDIUM | Hand-rolled approach is sound and dependency-free; framer-motion remains the fallback if a richer feel is wanted |
| Warm theme token values | MEDIUM | Exact OKLCH values are proposals; must be verified against WCAG contrast targets before acceptance |
