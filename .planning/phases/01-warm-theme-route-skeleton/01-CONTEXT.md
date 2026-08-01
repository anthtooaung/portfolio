# Phase 1: Warm Theme + Route Skeleton - Context

**Gathered:** 2026-08-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Shift the entire design token system from violet (hue 280) to a warm amber/gold palette, and add the `/resume` route skeleton with conditional chrome so the resume page renders without the site Header and Footer. This phase is the visual foundation and navigation skeleton for later phases (Resume content in Phase 2, Hero tilt in Phase 3).

Requirements covered: THME-01, THME-02, THME-03, THME-04, ROUT-01, ROUT-02, ROUT-03, ROUT-04.

</domain>

<decisions>
## Implementation Decisions

### Warm Palette Direction
- **D-01:** Palette mood: **warm amber/gold** — soft golden tones, professional, not earthy terracotta.
- **D-02:** Primary accent: **soft amber** — moderate saturation (chroma ~0.15), hue 70-80. Balanced, works as primary in both light and dark.
- **D-03:** Light-mode background: **warm white** — subtle warm tint, nearly white but noticeably warmer than pure white. Not full cream/beige.
- **D-04:** Hero gradient utility (`.text-gradient-violet`): **refactor to read from `var(--primary)`** instead of hardcoded violet. Gradient becomes warm amber automatically. Do NOT remove the gradient utility.

### Resume Link in Header
- **D-05:** Resume link styled **same as other nav items** (not a button/CTA). Uses router `Link` for `/resume`, not a hash anchor.
- **D-06:** Resume link appears **in the mobile menu too**.
- **D-07:** Resume link position: **after Contact** in the nav order.
- **D-08:** Resume link is **never scroll-spy highlighted** — it's a route link, not a hash anchor, so it participates in neither the active state nor the sliding indicator.

### Conditional Chrome Pattern
- **D-09:** Use a **`DefaultLayout` wrapper component** containing `Header` + `Outlet` + `Footer`. Main site routes (`/`) render inside it.
- **D-10:** `/resume` uses a **bare `Route` with no layout wrapper** — Header and Footer simply never render there.
- **D-11:** Add a **`ScrollToTop` component** (onMount scroll to 0) to handle route transitions — works for both `/` → `/resume` and `/resume` → `/`.
- **D-12:** Scroll-spy needs **no special handling** — Header is absent on `/resume`, so scroll-spy is naturally disabled. ROUT-04 satisfied structurally.

### Claude's Discretion
- Exact OKLCH values (chroma, lightness, hue) for each token (background, foreground, card, muted, secondary, accent, border, ring, chart-1..5, sidebar) in both light and dark modes. Must satisfy WCAG AA (4.5:1) contrast (THME-04).
- Whether chart tokens follow the warm hue or use complementary accents (e.g., warm orange, green) for visual distinction.
- Whether the secondary hue shift should be applied across all surfaces or only primary/foreground.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & Roadmap
- `.planning/REQUIREMENTS.md` — THME-01..04, ROUT-01..04 requirement definitions (hue 50-80 warm range, conditional chrome, ScrollToTop, scroll-spy disable)
- `.planning/ROADMAP.md` §Phase 1 — Phase goal, success criteria (5 criteria: warm tones, no jarring toggle, resume nav, scroll-to-top, no scroll-spy errors)
- `.planning/PROJECT.md` — Core value ("site must feel like mine"), constraints (no framework switches, single-scroll + `/resume` route only)

### Design Tokens & Routing
- `src/index.css` — Current OKLCH tokens at hue 280 (violet), light + dark blocks, `.text-gradient-violet` utility, `@custom-variant dark`
- `src/App.tsx` — Current routing: BrowserRouter, single `/` route, Header/Footer outside Routes
- `src/components/Header.tsx` — Nav structure: NAV_LINKS array, scroll-spy active state, sliding indicator, mobile menu, dark mode toggle

### Codebase Maps
- `.planning/codebase/STACK.md` — Full tech stack confirmation (React 19, Vite 8, Tailwind 4, react-router-dom 7)
- `.planning/codebase/STRUCTURE.md` — File layout, content organization

No external specs — requirements fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`useScrollSpy` hook** (`src/hooks/useScrollSpy.ts`): Already takes section ids, IntersectionObserver-based. Naturally unused on /resume since Header won't render.
- **Dark mode toggle logic** in `Header.tsx`: `useState` + localStorage + `.dark` class on `<html>`. Theme token shift is pure CSS — no component changes needed.
- **`cn()` utility** (`src/lib/utils.ts`): Available for any new layout styling.
- **react-router-dom 7**: Already has `Link`, `Outlet`, `useLocation` — no new routing dependency needed.

### Established Patterns
- **Design tokens via CSS variables**: All colors flow through `:root` / `.dark` blocks in `index.css` with `@theme inline` mapping. Changing token hue values is the single point of change for theming.
- **shadcn/ui style**: `@custom-variant dark`, CVA components, Phosphor icons with `weight="bold"`.
- **Single default export**: Only `App` in `src/App.tsx`. New components (DefaultLayout, ScrollToTop, ResumePage) should use named exports.
- **Guard clause pattern**: Section components return `null` when content absent.

### Integration Points
- **`src/App.tsx`**: Where DefaultLayout, ScrollToTop, and `/resume` route get wired in.
- **`src/components/Header.tsx`**: Where the Resume `Link` gets added to NAV_LINKS (or a separate links structure) + mobile menu.
- **`src/index.css`**: Where all token hue shifts land. `.text-gradient-violet` refactor lives here.
- **`src/pages/`**: Where `Resume.tsx` will live (Phase 2 builds content; Phase 1 may need a minimal placeholder page to satisfy the route).

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches. User chose the "you decide" discretion for exact token values but gave clear direction: warm amber/gold, soft amber primary, warm white background, gradient reads from `var(--primary)`.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 1-Warm Theme + Route Skeleton*
*Context gathered: 2026-08-01*
