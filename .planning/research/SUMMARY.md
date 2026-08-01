# Project Research Summary

**Project:** Mr.Ant's Portfolio — Personal Website Upgrade
**Domain:** Personal developer portfolio website (React SPA)
**Researched:** 2026-08-01
**Confidence:** HIGH

## Executive Summary

This is a focused upgrade of an existing React 19 + TypeScript + Vite + Tailwind CSS 4 single-page portfolio. The goal is threefold: shift the visual identity from a sterile cool-white template to a warm, personal-feeling design; add a `/resume` page with print-to-PDF capability; and add a 3D tilt effect on the hero profile image. The existing codebase is well-structured with markdown-driven content, shadcn/ui components, and OKLCH design tokens — but it is still early-stage with placeholder content and several known anti-patterns (hardcoded certificate data, no memoization on markdown parsing, no error boundaries).

The recommended approach leverages what already exists. The warm theme is a CSS-only OKLCH hue shift in `index.css` — no library needed. The resume page follows the established markdown+frontmatter pattern and adds `@media print` CSS — no JS print library needed. The 3D tilt effect is best implemented as a hand-rolled pointer-tracking component using CSS custom properties and transforms — no animation library needed. Only one new npm package is recommended as a safe fallback (`react-parallax-tilt`, 2.9kB) plus three shadcn/ui components (Card, Badge, Separator) for the resume layout.

The three critical risks are: (1) the OKLCH theme shift breaking dark mode if light and dark tokens are not updated in lockstep, (2) the `/resume` route breaking the existing scroll-spy navigation system, and (3) the print stylesheet failing to override Tailwind utility specificity. All three are well-understood with clear mitigations documented in the pitfalls research. The overall risk profile is LOW — this is a visual and structural polish pass on a working codebase, not a greenfield build.

## Key Findings

### Recommended Stack

The project already has all core technologies in place. The milestone adds minimal new dependencies. The primary approach for the tilt effect is dependency-free (hand-rolled CSS+JS); `react-parallax-tilt` is the safe fallback if the hand-rolled feel is insufficient. Three shadcn/ui components should be installed for resume page layout.

**Core technologies (existing, unchanged):**
- React 19.2.6 + TypeScript 6.0.2 + Vite 8.0.12 — the build pipeline, no changes needed
- Tailwind CSS 4.3.1 — utility CSS with v4 syntax (`@import`, `@custom-variant`), OKLCH tokens already in place
- shadcn/ui (radix-lyra) — component system with CVA variants, already drives all UI
- react-router-dom 7.17.0 — client-side routing, needs one new route registered
- Phosphor Icons 2.1.10 — icon library, no changes needed
- `parseYamlSimple` in `src/lib/markdown.ts` — custom YAML parser, must stay within its flat key-value / simple array limits

**New additions this milestone:**
- `react-parallax-tilt` v1.7.336 — fallback for hero tilt effect (2.9kB, zero deps, React 19 compatible, actively maintained)
- shadcn/ui Card, Badge, Separator — resume page layout components (`npx shadcn@4.16.1 add card badge separator`)
- No animation library (`motion`/framer-motion rejected at ~40kB for effects achievable in ~30 lines of CSS+JS)

**Key constraint:** The custom `parseYamlSimple` parser only handles flat key-value pairs and simple arrays of objects. No nested objects, no arrays of arrays. All markdown frontmatter must stay within these bounds.

### Expected Features

**Must have (table stakes):**
- Warm light theme with cohesive OKLCH design tokens — current cool-violet hue 280 palette reads as a template default; must shift to warm hue 50-80 range for cream/terracotta feel
- Resume/CV page at `/resume` with print stylesheet — recruiters expect a shareable resume; `@media print` CSS enables Ctrl+P to PDF with zero dependencies
- Real content in all sections — placeholder text undermines the entire purpose of a portfolio
- Professional profile photo with warm theme treatment — already partially exists, needs polish to match new palette
- Responsive design polish — already mostly works via Tailwind, needs audit for resume page and new sections
- Functional contact form with anti-spam — honeypot field and client-side cooldown needed
- Navigation with `/resume` link — Header needs a router link (not hash link) to the new route

**Should have (differentiators):**
- 3D tilt/shake effect on profile image — mouse-tracking tilt makes the hero feel alive and signals technical skill
- Scroll-triggered section reveal animations — extends existing `animate-fade-up` pattern to all sections
- Dark mode smooth transition — 300ms CSS transition on color properties eliminates jarring theme toggle
- Project case studies with hover effects — narrative (problem/approach/result) outperforms card grids
- SEO/OG meta tags — professional preview when links are shared on LinkedIn/Twitter

**Defer (v2+):**
- Blog section — architecture ready, content strategy needed first
- Testimonials section — needs real quotes from real people
- CMS or admin dashboard — over-engineered for infrequent content changes
- Chat widget / AI assistant — distracts from portfolio content
- Complex page transitions (GSAP/React Spring) — the main site is single-page; overkill

### Architecture Approach

The architecture uses a two-route split with conditional chrome: the main portfolio (`/`) renders with Header + Footer (scroll-spy, mobile menu, dark mode toggle), while the resume page (`/resume`) renders standalone with no shared chrome. This avoids dead scroll-spy logic on the resume page and simplifies print CSS. The `App.tsx` routing logic checks `useLocation().pathname` and conditionally renders chrome components.

The resume data follows the existing markdown+frontmatter pattern. A new file `src/content/resume/resume.md` is registered in the `modules` record in `markdown.ts`. A `useResume` hook parses the data once and passes typed slices down to presentational section components (ResumeProfile, ResumeExperience, ResumeEducation, ResumeSkills, ResumeCertificates). This keeps the data flow explicit, one-way, and consistent with the home page pattern.

The warm theme is a CSS-only operation: shift OKLCH hue values in `:root` from 280 (violet) to the 50-80 range (amber/terracotta) for all design tokens, and update `.dark` tokens to match with warm dark tones. The `.text-gradient-violet` utility must be changed to read from `var(--primary)` so the hero gradient shifts automatically.

**Major components:**
1. `ResumePage` — page composer for `/resume`, owns screen/print layout switch, fetches data via `useResume`
2. `TiltProfile3D` — self-contained pointer-tracking tilt wrapper, respects `prefers-reduced-motion` and `pointer: coarse`
3. `App` — modified for conditional chrome based on pathname
4. `HeroSection` — modified to wrap profile image in tilt component
5. Resume sub-components (Profile, Experience, Education, Skills, Certificates) — all presentational, receive data via props

### Critical Pitfalls

1. **OKLCH theme migration breaks dark mode (Pitfall 3)** — Changing light-mode tokens without updating `.dark` tokens in lockstep creates a jarring hue shift when toggling themes. Prevention: map the full palette for both modes before changing any values; change `:root` and `.dark` blocks together; screenshot both modes side-by-side after every change.

2. **Print stylesheet fails to override Tailwind utilities (Pitfall 2)** — Tailwind v4's CSS layer system can cause `@media print` rules to lose specificity battles against generated utilities. Prevention: place print styles at appropriate layer specificity; force `background: #fff; color: #000` explicitly on body; add `print-color-adjust: exact` to elements that must retain color; test with Ctrl+P early and often.

3. **`/resume` route breaks scroll-spy navigation (Pitfall 4)** — The `useScrollSpy` hook queries DOM element IDs that do not exist on the resume page. Prevention: conditionally render scroll-spy-aware Header only on `/`; use `<Link to="/resume">` (not hash links) in the Header; add a `ScrollToTop` component for route transitions.

4. **Content migration silently drops data via YAML parser limits (Pitfall 5)** — `parseYamlSimple` silently fails on complex YAML structures. Prevention: keep frontmatter flat; never nest beyond one level; manually verify parsed output in browser console after adding any new content file; register every `.md` file in the `modules` map.

5. **3D tilt animation causes layout thrashing (Pitfall 1)** — Reading DOM metrics inside mousemove handlers forces synchronous layout. Prevention: use only `transform` and `opacity` (GPU-composited); compute transforms from pointer coordinates only; gate on `prefers-reduced-motion` and `pointer: coarse`; wrap in `React.memo`.

## Implications for Roadmap

Based on dependency analysis across all four research files, the following phase structure is recommended.

### Phase 1: Foundation — Warm Theme + Route Skeleton
**Rationale:** The warm theme is the visual foundation that every subsequent change sits on. The `/resume` route must exist before any resume components can be built. Both are prerequisites for everything else and have zero coupling to each other — they can be worked in parallel within the phase.
**Delivers:** Warm OKLCH design tokens in light and dark mode; `/resume` route with conditional chrome (Header/Footer hidden on resume); `ScrollToTop` component; Header "Resume" link; fixed dark mode flash (blocking `<script>` in `index.html`).
**Addresses:** Warm light theme (table stakes), navigation with `/resume` link (table stakes), dark mode smooth transition (differentiator).
**Avoids:** Pitfall 3 (OKLCH dark mode break) by updating both `:root` and `.dark` together; Pitfall 9 (dark mode FOUT) by adding blocking script; Pitfall 4 (scroll-spy break) by conditional chrome.

### Phase 2: Resume Page — Data + Components + Print
**Rationale:** Depends on Phase 1 route structure. The resume data file, parsing, and section components form a self-contained unit. Print stylesheet must be co-designed with the page (not added later) to avoid the "prints as web page" problem.
**Delivers:** `src/content/resume/resume.md` with typed frontmatter; `useResume` hook; ResumePage with all sub-components (Profile, Experience, Education, Skills, Certificates); `@media print` stylesheet; "Print Resume" button with `window.print()`.
**Addresses:** Resume/CV page (table stakes), print-optimized resume with one-click download (differentiator).
**Avoids:** Pitfall 2 (print vs Tailwind specificity) by co-designing print CSS with the page; Pitfall 8 (resume prints as web page) by designing with print in mind from the start; Pitfall 5 (YAML parser drops data) by keeping frontmatter flat; Pitfall 10 (hardcoded certificate data) by using markdown from the start.

### Phase 3: Hero Polish — 3D Tilt + Content Population
**Rationale:** The tilt effect is independent of resume work and can proceed in parallel or sequentially. Content population (real bio, projects, skills, certificates) is user-dependent but structurally simple. Grouping them keeps this phase focused on "making the existing site feel real and alive."
**Delivers:** `TiltProfile3D` component wrapping the hero profile image; warm ring/border treatment on profile photo; real content in all sections (user-provided); migrated certificate data from hardcoded to markdown.
**Addresses:** 3D tilt effect (differentiator), real content in all sections (table stakes), professional profile photo treatment (table stakes).
**Avoids:** Pitfall 1 (layout thrashing) by using pointer coordinates only, `will-change: transform`, and `prefers-reduced-motion` guard; Pitfall 10 (hardcoded certificates) by migrating to markdown; Pitfall 7 (markdown parsing repeats on every render) by adding module-level cache.

### Phase 4: Polish — Animations, Contact Hardening, Cleanup
**Rationale:** This phase catches the remaining differentiators and fixes known technical debt. It comes last because the prior phases establish the visual foundation and core features — polish is about refinement, not structure.
**Delivers:** Scroll-triggered section reveal animations; dark mode smooth transition (if not done in Phase 1); contact form honeypot + cooldown + setTimeout fix; error boundaries around section components; removal of unused dependencies (zustand, react-query, lucide-react); inline `<style>` tag removal in CertificatesSection.
**Addresses:** Scroll-triggered animations (differentiator), dark mode transition (differentiator), contact form anti-spam (table stakes).
**Avoids:** Pitfall 6 (missing error boundaries) by adding `react-error-boundary` wrappers; Pitfall 11 (inline `<style>` tag) by converting to Tailwind utilities; Pitfall 12 (unused dependencies) by removing them.

### Phase Ordering Rationale

- **Theme first:** Every visual change depends on the design tokens. Building resume components or tilt effects against the wrong palette means rework.
- **Route before components:** The `/resume` route structure must be locked before any resume components exist — otherwise conditional chrome logic is built in a vacuum.
- **Print co-designed with resume:** Leaving print CSS to a later phase causes the "prints as web page" problem (Pitfall 8) because the HTML structure was not built with print in mind.
- **Tilt last among features:** It is the most self-contained new feature and benefits from the theme already being settled. Scheduling it after resume work avoids context-switching between unrelated concerns.
- **Cleanup in final phase:** Removing unused deps, adding error boundaries, and fixing inline styles are all low-risk polish tasks that should not be mixed with feature work.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (Resume):** Exact frontmatter shape needs validation against `parseYamlSimple` limitations — particularly the skills section with per-group lists. The parser cannot handle nested arrays-of-arrays; flat skill list or component-side grouping may be needed.
- **Phase 1 (Theme):** Exact OKLCH values need WCAG contrast verification — the proposed warm values are estimates; contrast ratios must be checked with a tool like oklch.com or Chrome DevTools before acceptance.

Phases with standard patterns (skip research-phase):
- **Phase 3 (Hero Tilt):** Hand-rolled pointer-tracking tilt with CSS custom properties is a well-documented pattern with clear implementation guidance.
- **Phase 4 (Polish):** Error boundaries, CSS animations, and dependency cleanup follow established React/Tailwind patterns.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All technologies verified against npm registry and codebase; react-parallax-tilt peer deps confirmed for React 19 |
| Features | MEDIUM | Table stakes are clear (ecosystem patterns well-established); differentiator rankings are opinionated based on portfolio design conventions |
| Architecture | HIGH | Route structure, data flow, and component boundaries derived from direct codebase analysis; all decisions grounded in existing patterns |
| Pitfalls | HIGH | Codebase-specific findings (parseYamlSimple limits, scroll-spy behavior, Tailwind layer system) verified by reading source directly; domain patterns (print CSS, tilt animation) cross-checked against official docs |

**Overall confidence:** HIGH

### Gaps to Address

- **OKLCH warm palette exact values:** The proposed token values are educated estimates. Must be validated against WCAG AA contrast requirements (4.5:1 for normal text) using a contrast checker before finalizing. Handle during Phase 1 planning.
- **Resume frontmatter nesting depth:** The `parseYamlSimple` parser's exact limits with array-of-objects containing simple arrays (like `bullets: ["...", "..."]`) need manual verification. The parser handles this in existing files (skills.md) but edge cases should be tested. Handle during Phase 2 planning.
- **Print layout across browsers:** Print CSS behaves differently across Chrome, Firefox, and Safari. The `@media print` rules need cross-browser validation. Handle during Phase 2 execution with early Ctrl+P testing.
- **Mobile tilt performance:** The hand-rolled tilt effect should be tested on real mobile devices. The `pointer: coarse` guard disables tilt on touch devices, but the guard itself needs validation. Handle during Phase 3 execution.

## Sources

### Primary (HIGH confidence)
- Codebase ground truth: `src/App.tsx`, `src/index.css`, `src/lib/markdown.ts`, `src/components/Header.tsx`, `src/components/HeroSection.tsx`, `src/components/CertificatesSection.tsx`, `src/pages/Home.tsx`, `tsconfig.app.json`, `package.json`
- npm registry verification: react-parallax-tilt 1.7.336 peer deps, motion 12.43.0 bundle size
- shadcn/ui official docs: Card, Badge, Separator component APIs

### Secondary (MEDIUM confidence)
- Web synthesis: developer portfolio table stakes and differentiator taxonomy
- Web synthesis: print CSS best practices (MDN `@media print`, `@page` rules)
- Web synthesis: OKLCH warm color palette references (oklch.com)
- Web synthesis: 3D tilt implementation patterns (vanilla-tilt.js, CSS perspective)

### Tertiary (LOW confidence)
- Exact OKLCH warm token values — proposals that need WCAG contrast verification
- Cross-browser print layout behavior — documented patterns but not tested in this codebase

---
*Research completed: 2026-08-01*
*Ready for roadmap: yes*
