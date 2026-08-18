# Portfolio Design Fixes

**Created:** 2026-08-18  
**Status:** Open  
**Scope:** Architecture, UX, content model, and production polish

This document captures design and implementation issues identified during a project review. Work through items in priority order — earlier sections have the highest impact.

---

## Priority Summary

| Priority | Issue | Impact |
|----------|-------|--------|
| P0 | Route layout inconsistent | Resume/Certificates pages missing header & footer |
| P0 | Nested `<main>` elements | Invalid HTML, accessibility issue |
| P1 | Conflicting product direction in docs | Builds against wrong spec |
| P1 | Dual content source for skills | Orphaned `skills.md`, confusing data model |
| P2 | Stale planning/knowledge docs | Misleading for future work and AI agents |
| P2 | PdfViewer not reused on Certificates page | Duplicated PDF logic |
| P2 | Production gaps (404, SEO, error boundaries) | Bad UX when sharing links |
| P3 | Performance: markdown re-parsed every render | Unnecessary work at runtime |
| P3 | Placeholder content & skill percentages | Looks unfinished to visitors |
| P3 | Unused dependency (`lucide-react`) | Dead weight in bundle metadata |

---

## P0 — Route Layout

### Problem

`/resume` and `/certificates` routes are registered **outside** `DefaultLayout`, so those pages do not render the global header or footer.

**File:** `src/App.tsx`

```tsx
// Current (broken)
<Route element={<DefaultLayout />}>
  <Route path="/" element={<Home />} />
</Route>
<Route path="/resume" element={<ResumePage />} />
<Route path="/certificates" element={<CertificatesPage />} />
<Route path="/certificates/:skill" element={<CertificatesPage />} />
```

Users on Resume/Certificates only see a "Back to Home" link — no Achievements dropdown, audio guide, or consistent navigation.

### Fix

Nest all routes under `DefaultLayout`:

```tsx
<Route element={<DefaultLayout />}>
  <Route path="/" element={<Home />} />
  <Route path="/resume" element={<ResumePage />} />
  <Route path="/certificates" element={<CertificatesPage />} />
  <Route path="/certificates/:skill" element={<CertificatesPage />} />
</Route>
```

Optionally add a catch-all 404 route at the same level.

### Verification

- [ ] `/resume` shows header with Achievements dropdown and footer
- [ ] `/certificates` and `/certificates/:skill` show header and footer
- [ ] Mobile menu works on all routes
- [ ] "Back to Home" links still work (or can be removed if nav is sufficient)

---

## P0 — Nested `<main>` Elements

### Problem

`DefaultLayout.tsx` wraps page content in `<main>`, and `Home.tsx` adds another `<main>` inside it. HTML allows only one `<main>` per document.

**Files:**
- `src/components/DefaultLayout.tsx` (line 9)
- `src/pages/Home.tsx` (line 10)

### Fix

Remove the `<main>` wrapper from `Home.tsx`. Use a fragment or `<div>` instead:

```tsx
export function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      {/* ... */}
    </>
  );
}
```

Keep the single `<main>` in `DefaultLayout.tsx`.

### Verification

- [ ] Only one `<main>` in the DOM on `/`
- [ ] Layout and scroll behavior unchanged

---

## P1 — Conflicting Product Direction

### Problem

Three documents disagree on theme strategy:

| Source | Direction |
|--------|-----------|
| `.planning/PROJECT.md` | Warmer **light** theme, dark mode toggle |
| `knowledge/portfolio-spec.md` | **Dark mode only** |
| Current code (`index.css`, `index.html`) | Dark only, no toggle |

GSD state (`.planning/STATE.md`) references phase `warm-theme-route-skeleton`, which implies a light warm theme — but the codebase ships dark-only.

### Fix

**Step 1 — Decide** (pick one):

- **Option A:** Stay dark-only → update `PROJECT.md`, `STATE.md`, and phase docs to match
- **Option B:** Add warm light theme → implement tokens in `index.css` and optionally restore toggle

**Step 2 — Update docs** so all of these agree:

- `.planning/PROJECT.md`
- `.planning/STATE.md`
- `knowledge/portfolio-spec.md`
- `.planning/codebase/ARCHITECTURE.md`

**Step 3 — Mark completed phases** in `knowledge/portfolio-spec.md` (Phases 4–6 are done in code but still show open checkboxes).

### Verification

- [ ] Single documented theme direction
- [ ] Phase checklists reflect shipped work
- [ ] No doc references dark mode toggle unless it exists in `Header.tsx`

---

## P1 — Dual Content Source for Skills

### Problem

Skills data is split across two systems:

1. **`src/content/certificates.json`** — used by `SkillsSection` via `lib/certs.ts` (skill names, levels, cert links)
2. **`src/content/home/skills.md`** — registered in `lib/markdown.ts` but **never consumed**

`SkillsSection` also hardcodes its section subtitle instead of reading from markdown.

### Fix

**Recommended:** JSON owns structured skill/cert data; markdown owns copy only.

1. Either delete `skills.md` and remove its import from `markdown.ts`, **or**
2. Use `skills.md` for section title + intro paragraph only; keep skill list in `certificates.json`

Update `SkillsSection.tsx` to read title/intro from markdown if keeping the file:

```tsx
const section = getSection('home/skills.md');
const title = section?.meta.title ?? 'Skills & Technologies';
const intro = section?.content ?? '';
```

### Verification

- [ ] No orphaned content files in `markdown.ts` modules map
- [ ] One clear rule: JSON = structured data, MD = narrative copy
- [ ] Adding a skill requires editing only the intended file(s)

---

## P2 — Stale Documentation

### Problem

Several docs describe an older architecture:

| File | Stale claims |
|------|--------------|
| `.planning/codebase/ARCHITECTURE.md` | Dark mode toggle, single route, `CertificatesSection.tsx` |
| `.planning/codebase/CONCERNS.md` | Hardcoded certs, `#certificates` in scroll-spy nav |
| `knowledge/project-structure.md` | Old `src/data/`, `src/styles/` layout |
| `knowledge/development-guide.md` | `npm run format`, non-existent paths |
| `knowledge/portfolio-spec.md` | Phases 4–6 unchecked despite being implemented |

### Fix

Refresh or archive each file. Minimum updates for `ARCHITECTURE.md`:

- Routes: `/`, `/resume`, `/certificates`, `/certificates/:skill`
- Layout: `DefaultLayout` with Header/Footer (once P0 is fixed)
- Certificates: standalone page + `certificates.json`, not `CertificatesSection`
- Theme: dark-only (unless P1 Option B chosen)
- Skills: driven by `lib/certs.ts`, not markdown frontmatter arrays

### Verification

- [ ] `grep -r "CertificatesSection" .planning/ knowledge/` returns nothing (or archived note)
- [ ] `grep -r "dark mode toggle" .planning/ knowledge/` matches reality
- [ ] Architecture diagram lists all current routes

---

## P2 — PdfViewer Duplication

### Problem

`Resume.tsx` uses the shared `PdfViewer` modal component. `Certificates.tsx` duplicates PDF preview with inline `<object>` tags and separate open/download handlers.

### Fix

Refactor `Certificates.tsx` to use `PdfViewer` for in-modal preview (same pattern as Resume). Keep grid thumbnails as click targets that open the modal.

### Verification

- [ ] Certificate "Open" opens `PdfViewer` modal
- [ ] Download works from modal and card actions
- [ ] No duplicate PDF handler logic between pages

---

## P2 — Production Gaps

### 404 Page

**Problem:** Unknown URLs render blank content.  
**Fix:** Add `<Route path="*" element={<NotFound />} />` under `DefaultLayout`.  
**File:** `src/pages/NotFound.tsx` (new), `src/App.tsx`

### Error Boundaries

**Problem:** One thrown error in any section white-screens the entire app.  
**Fix:** Wrap route outlets or individual sections in a React error boundary.  
**File:** `src/components/ErrorBoundary.tsx` (new)

### SEO / Open Graph

**Problem:** `index.html` only has `<title>`. No description or social preview tags.  
**Fix:** Add to `index.html` or use `react-helmet-async` per route:

```html
<meta name="description" content="..." />
<meta property="og:title" content="Mr.Ant's Portfolio" />
<meta property="og:description" content="..." />
<meta property="og:image" content="/og-image.png" />
```

### Resume Print Stylesheet

**Problem:** `.planning/PROJECT.md` specifies print-to-PDF via `@media print`; not implemented.  
**Fix:** Add print styles in `src/index.css` or a dedicated `resume-print.css` imported by `Resume.tsx`:

```css
@media print {
  header, footer, .no-print { display: none; }
  /* resume-specific layout */
}
```

### Contact Form Cleanup

**Problem:** `ContactSection.tsx` uses `setTimeout` without cleanup on unmount.  
**Fix:** Store timeout ID in a ref and clear in `useEffect` cleanup.

### Verification

- [ ] `/nonexistent` shows 404 page with nav
- [ ] Broken section shows fallback UI, not white screen
- [ ] Link preview shows title + description when shared
- [ ] Resume prints cleanly (Ctrl+P)
- [ ] No React warnings from contact form timeout on navigation

---

## P3 — Performance

### Markdown Re-parsed on Every Render

**Problem:** `getSection()` and `getProjects()` call `parseFrontmatter()` on every component render. Content is static at build time.

**File:** `src/lib/markdown.ts`

**Fix:** Add module-level cache:

```ts
const sectionCache = new Map<string, MarkdownFile | null>();

export function getSection(path: string): MarkdownFile | null {
  if (sectionCache.has(path)) return sectionCache.get(path)!;
  const result = /* existing lookup + parse */;
  sectionCache.set(path, result);
  return result;
}
```

Apply the same pattern to `getProjects()`.

### Verification

- [ ] Content still updates on hot reload in dev
- [ ] No behavior change in rendered output

---

## P3 — Content Quality

### Placeholder Certificate Titles

**File:** `src/content/certificates.json`

Current values: `"Certificate 1"`, `"Certificate 2"`, etc.

**Fix:** Replace with real certificate names (e.g., "Claude AI Fundamentals", "GitHub Actions Certification").

### Skill Percentage Formula

**File:** `src/lib/certs.ts` — `getSkillLevel()` uses `20 + certCount * 10`.

**Options:**
- Set explicit `level` overrides in `certificates.json` for each skill
- Remove percentage display and show cert count only
- Replace bars with a simpler "verified by N certificates" badge

### Missing Project Images

**Files:** `src/content/projects/*.md` reference `/images/projects/*.png`

**Fix:** Add screenshots to `public/images/projects/` or update frontmatter paths.

### Verification

- [ ] All certificate titles are human-readable
- [ ] Skill display feels credible (not arbitrary percentages)
- [ ] Project cards show screenshots, not letter fallbacks

---

## P3 — Dependency Cleanup

### Unused Packages

**File:** `package.json`

Remove if still unused:

```bash
npm uninstall lucide-react
```

(`zustand` and `@tanstack/react-query` appear already removed.)

Phosphor Icons (`@phosphor-icons/react`) is the canonical icon library — do not add Lucide alongside it.

---

## Suggested Work Order

```
1. P0  Route layout + nested main          (~30 min)
2. P1  Pick theme direction, update docs  (~1 hr)
3. P1  Consolidate skills content source   (~30 min)
4. P2  Refresh stale docs                  (~1 hr)
5. P2  PdfViewer on Certificates page        (~45 min)
6. P2  404 + SEO + print styles              (~2 hr)
7. P3  Markdown cache + content polish       (~1 hr)
8. P3  Remove lucide-react                   (~5 min)
```

---

## Files Reference

| Area | Primary files |
|------|---------------|
| Routing | `src/App.tsx`, `src/components/DefaultLayout.tsx`, `src/pages/Home.tsx` |
| Theme | `src/index.css`, `index.html`, `src/components/Header.tsx` |
| Skills/Certs | `src/lib/certs.ts`, `src/content/certificates.json`, `src/components/SkillsSection.tsx`, `src/pages/Certificates.tsx` |
| Content parsing | `src/lib/markdown.ts`, `src/content/home/skills.md` |
| PDF | `src/components/PdfViewer.tsx`, `src/pages/Resume.tsx` |
| Docs to update | `.planning/PROJECT.md`, `.planning/codebase/*.md`, `knowledge/*.md` |

---

*Last updated: 2026-08-18*
