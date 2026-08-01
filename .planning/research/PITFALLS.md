# Domain Pitfalls: Personal Portfolio Upgrade

**Domain:** React personal portfolio website upgrade (3D animation, theme migration, resume page, print stylesheet)
**Researched:** 2026-08-01
**Overall confidence:** HIGH (codebase-specific + domain-specific findings)

## Critical Pitfalls

Mistakes that cause rewrites, broken deployments, or silent data corruption.

### Pitfall 1: 3D Tilt Animation Causes Layout Thrashing and Jank

**What goes wrong:** Adding a CSS 3D tilt/shake effect to the profile photo (e.g., `transform: perspective(800px) rotateY(5deg) rotateX(-3deg)`) using mouse-tracking or hover triggers layout reflows if not implemented carefully. The common mistake is reading `offsetWidth`/`offsetHeight` or `getBoundingClientRect` inside a mousemove handler to recalculate the transform, which forces synchronous layout on every mouse event (~60Hz). On mobile, this is worse because touch events fire more frequently and GPU compositing is weaker.

**Why it happens:** Developers naturally want the tilt angle to follow the cursor position, which requires reading mouse coordinates and computing a transform. If they also read DOM metrics to position the element or calculate the transform origin, each mousemove triggers a layout reflow. Additionally, animating `transform` without `will-change` or `transform-style: preserve-3d` can cause the browser to create a new compositing layer on every frame.

**Consequences:** Visible jank on the hero section (the first thing visitors see). 100% CPU usage on mobile devices. Battery drain. The "impressive" animation becomes the reason users leave.

**Prevention:**
- Use `transform` and `opacity` only (GPU-composited properties). Never animate `width`, `height`, `top`, `left`, `margin`, or `padding`.
- Apply `will-change: transform` to the animated element, but remove it after animation completes if it is not always-active.
- Use `transform-style: preserve-3d` on the container and `perspective()` on the parent for true 3D depth.
- For mouse-tracking tilt: read mouse coordinates in `onMouseMove` (no layout read needed), compute transform in `requestAnimationFrame`, and set the style directly. Do not read any DOM metrics in the handler.
- Wrap the tilt element in `React.memo` to prevent parent re-renders from resetting animation state.
- Add `@media (prefers-reduced-motion: reduce) { transform: none !important; }` to disable on reduced-motion users. The codebase already has this pattern in `index.css` (line 156-166).

**Detection:** Chrome DevTools Performance tab showing "Recalculate Style" or "Layout" in the flame chart during mousemove. FPS counter dropping below 60.

**Phase:** Theme/Animation phase (the 3D tilt is part of the hero redesign)

---

### Pitfall 2: Print Stylesheet Fails to Override Tailwind Utilities

**What goes wrong:** Tailwind generates utility classes like `bg-background`, `text-foreground`, `border-border` that use CSS custom properties. In print, browsers typically ignore background colors and colors default to black/white. But because Tailwind's utilities use `!important`-level specificity via class names, the print stylesheet's `color: #000; background: #fff` declarations lose the specificity battle. The resume prints with invisible text on invisible backgrounds, or with the wrong color scheme entirely.

**Why it happens:** Tailwind v4 generates utilities at a specific CSS layer. The print `@media` rule must either override at the same layer specificity or use `@layer` ordering to win. Most developers write `@media print { .bg-background { background: white; } }` which works in Tailwind v3 but can fail in v4 because of the layer system. The existing `index.css` already uses `@layer base`, `@layer utilities`, and `@custom-variant dark` -- the print stylesheet must be aware of this layering.

**Consequences:** Resume page prints as blank, or with dark-mode colors on white paper, or with elements that should be hidden still visible.

**Prevention:**
- Place print styles in `@layer base` (which has lower priority than `@layer utilities`) and use `@media print` to override.
- Alternatively, use `@layer utilities` for print overrides but ensure they load after the main theme.
- Test the print stylesheet with `Ctrl+P` / `Cmd+P` early and often -- do not leave it to the end.
- Set explicit colors for print: `@media print { body { color: #000; background: #fff; } }` plus override each semantic color variable.
- Use `-webkit-print-color-adjust: exact; print-color-adjust: exact;` on elements where background color must survive printing (like skill badges or section headers).
- Define `@page { size: A4; margin: 1.5cm; }` to control the page box.
- Hide non-resume elements: `@media print { header, footer, nav, .scroll-indicator { display: none; } }`.

**Detection:** Print preview showing wrong colors, missing backgrounds, or visible navigation elements.

**Phase:** Resume page phase (print stylesheet is part of the `/resume` route)

---

### Pitfall 3: Warm Theme Migration Breaks Dark Mode via OKLCH Variable Naming

**What goes wrong:** When changing the light theme from the current cool white (`oklch(1 0 0)`) to warmer cream/beige tones, developers often change `:root` variables without updating `.dark` variables, or they change the hue angle in `oklch(L C H)` without testing both modes. The specific risk in this codebase: the existing OKLCH values use `H=280` (violet) throughout. Changing light-mode `--background` to a warm tone (e.g., `oklch(0.97 0.01 80)` for cream) while leaving dark mode at `H=280` creates a jarring hue shift when toggling themes -- the light mode feels warm but the dark mode stays cold violet.

**Why it happens:** The theme system has 40+ CSS custom properties in `:root` and `.dark` blocks (lines 54-121 of `index.css`). Changing the light theme requires updating all of them consistently. It is tempting to only change `--background` and `--foreground` and call it done, but the card, border, muted, and accent colors all need coordinated hue shifts.

**Consequences:** Inconsistent visual feel between light and dark modes. Some elements look warm in light mode but clash with cold dark-mode counterparts. The "warm, personal" feel only works in one mode.

**Prevention:**
- Map out the full OKLCH palette before changing any values. For warm light theme: shift the hue angle from 280 (violet) toward 80-100 (warm yellow/amber) for background, card, muted, accent, and border tokens. Keep primary at 280 or shift it slightly.
- Change both `:root` and `.dark` blocks together -- never change one without the other.
- Use a visual diff tool: take screenshots of both modes before and after changes, compare side by side.
- Test every section (Hero, About, Projects, Skills, Certificates, Contact) in both modes after changes.
- The `@theme inline` block (lines 10-52 of `index.css`) maps semantic names to CSS variables -- do not change these mappings, only change the variable values in `:root` and `.dark`.

**Detection:** Toggle dark/light mode and notice hue mismatches between sections. Cards look warm but borders look cold.

**Phase:** Theme redesign phase (first active requirement)

---

### Pitfall 4: Adding `/resume` Route Breaks Scroll-Spy and Navigation

**What goes wrong:** Adding a `<Route path="/resume" element={<ResumePage />} />` to `App.tsx` works for routing, but the existing scroll-spy system in `Header.tsx` assumes the user is always on `/` (the home page). When navigating to `/resume`, the scroll-spy tries to find `#home`, `#about`, etc. section elements on the resume page -- they do not exist, so the scroll-spy returns no active section and the sliding indicator breaks. Additionally, the nav links (`#home`, `#about`, etc.) are hash links that only work on the home page. Clicking them from `/resume` navigates to `/#home` which works, but the smooth scroll may not fire because the page needs to load first.

**Why it happens:** The `useScrollSpy` hook (referenced in `Header.tsx` line 22) queries DOM elements by ID. On the `/resume` page, those IDs do not exist. The `handleNavClick` function (line 74-79) uses `document.querySelector(href)` which returns `null` on the wrong page. The `SECTION_IDS` constant (line 14) is hardcoded and does not vary by route.

**Consequences:** Navigation appears broken on the resume page. The active indicator is stuck on the first item. Clicking nav links does nothing or jumps to the wrong place.

**Prevention:**
- Conditionally render the scroll-spy-aware header only on the home page, or disable scroll-spy when not on `/`.
- Use `useLocation()` from `react-router-dom` to check the current path. If not `/`, skip scroll-spy initialization.
- For nav links from `/resume`: use `<Link to="/#about">` instead of `<a href="#about">` so react-router handles the cross-page navigation.
- Consider rendering the Header differently on `/resume` -- hide the section nav links, show only a "Back to Portfolio" link.
- Test: navigate to `/resume`, verify header does not throw errors or show broken UI.

**Detection:** Visit `/resume` -- header shows no active section or the indicator is stuck. Nav links do not scroll.

**Phase:** Resume page phase (route addition is the first step)

---

### Pitfall 5: Content Migration Silently Drops Data via YAML Parser Limitations

**What goes wrong:** When migrating placeholder data (hardcoded `CERTS` array in `CertificatesSection.tsx`) to markdown frontmatter, the custom `parseYamlSimple` parser in `src/lib/markdown.ts` silently fails on complex YAML structures. For example, if certificate frontmatter uses nested objects (`certificates: [{ name: "AWS", issuer: "Amazon", date: "2024-01-01" }]`), the parser only handles one level of nesting (line 62-88 of `markdown.ts`). Multi-level nesting, quoted strings with colons, or YAML flow syntax will produce partial or wrong data with no error.

**Why it happens:** The `parseYamlSimple` function (lines 47-121) is a hand-written parser that handles flat key-value, simple arrays, and single-level array-of-objects. It does not handle: nested objects beyond one level, multi-line strings, YAML comments between array items, or quoted keys containing colons. The function silently returns partial data on malformed YAML (line 128: `if (!match) return { meta: {}, content: raw }`).

**Consections:** Certificate names appear as `undefined`. Some certificates are silently missing. The section renders empty or with wrong data. No console error because the parser does not throw.

**Prevention:**
- Keep frontmatter structures flat: `title: "Certificate Name"`, `issuer: "AWS"`, `date: "2024-01"`. Use simple arrays of flat objects: `certificates: [{name: "AWS", issuer: "Amazon"}]`.
- Never use nested objects in frontmatter: avoid `cert: { name: "AWS", details: { issuer: "Amazon" } }`.
- After adding any new markdown content file, manually verify the parsed output in the browser console (add a temporary `console.log` in the component).
- The `modules` map in `markdown.ts` (lines 22-29) must be updated for every new `.md` file -- this is a two-step process (import + map entry) that is easy to forget.
- Consider adding a `console.warn` in `getSection()` when a key is not found: `if (!raw) { console.warn(`Content not found: ${path}`); return null; }`.

**Detection:** Section shows empty or partial data. Console has no errors. Manually log the parsed `meta` object to verify.

**Phase:** Content migration phase (part of "populate all sections with real content")

---

## Moderate Pitfalls

Issues that cause frustration, visual bugs, or performance degradation but not outright failure.

### Pitfall 6: Missing Error Boundaries Cause Full White-Screen Crash

**What goes wrong:** If any section component throws during render (e.g., `AboutSection` receives malformed `cards` data from YAML, or `HeroSection` tries to render `undefined` as JSX), the entire page crashes to a white screen with a React error overlay in development or nothing in production.

**Why it happens:** No React Error Boundary wraps any component. The codebase has null guards (`if (!hero) return null`) but these only handle missing data, not runtime exceptions. A TypeError on `undefined.map()` or a JSX rendering error bypasses the null guard.

**Consequences:** One broken section takes down the entire site. The user sees a blank page.

**Prevention:**
- Wrap each section in `Home.tsx` with an Error Boundary: `<ErrorBoundary fallback={<p>Section unavailable</p>}>...</ErrorBoundary>`.
- Use `react-error-boundary` package to avoid writing a class component.
- Place boundaries at the section level (not per-component) so one section failure does not cascade.
- Log errors via `componentDidCatch` to understand what broke.
- Add a top-level boundary in `App.tsx` as a last resort.

**Detection:** Remove a required prop from a section component -- the whole page should crash without boundaries, degrade gracefully with them.

**Phase:** Polish/hardening phase (can be done at any point, but best before adding new complex sections)

---

### Pitfall 7: Markdown Parsing Repeats on Every Render (Performance)

**What goes wrong:** Every component that calls `getSection()` (HeroSection, AboutSection, SkillsSection, ContactSection, FeaturedProjects) re-parses the same markdown file on every render. With 5+ sections each calling `parseFrontmatter()` which calls `parseYamlSimple()`, this means 5+ YAML parses per render cycle. On initial load this is negligible, but during theme toggling, scroll-spy updates, or any state change that triggers a re-render of `Home`, all parsers run again.

**Why it happens:** `getSection()` (line 137-142 of `markdown.ts`) calls `parseFrontmatter(raw)` every time it is invoked. There is no caching. The `parseFrontmatter` function (line 126-131) runs a regex and YAML parse on every call.

**Consequences:** Unnecessary CPU work on every render. Not a critical performance issue at current scale (5 sections), but becomes one if content grows or if the 3D animation triggers frequent re-renders of the parent.

**Prevention:**
- Add module-level caching in `markdown.ts`: `const cache = new Map<string, MarkdownFile>()` and check it in `getSection()` before parsing.
- Since content is static (never changes at runtime), parsing once at module load is safe.
- Alternatively, move parsing to a React context or a `useMemo` at the `Home` level and pass data down as props.

**Detection:** Chrome DevTools Performance tab showing `parseFrontmatter` in the flame chart during renders.

**Phase:** Performance optimization phase (should be done before adding the 3D animation to avoid compounding re-renders)

---

### Pitfall 8: Resume Page Prints as Web Page (Not as Document)

**What goes wrong:** The resume page at `/resume` looks great on screen but prints as a full web page with header, footer, navigation, background colors, and wide layout. The printed result looks like a screenshot of a website, not a professional resume document. Printers add headers/footers with URLs and dates. Margins are wrong. The layout does not fit on A4/Letter paper.

**Why it happens:** Developers design the resume page for screen viewing and add print styles as an afterthought. The print stylesheet needs to: hide header/footer/nav, remove background colors, set explicit page size/margins, ensure text is high-contrast, and reflow content to fit paper dimensions. Without `@page { size: A4; margin: 2cm; }`, the browser uses its default margins and the content overflows.

**Consequences:** The "download as PDF" workflow (Ctrl+P, save as PDF) produces an unprofessional document. The user loses confidence in the tool and manually rewrites the resume in Word/Google Docs.

**Prevention:**
- Design the resume page with print in mind from the start: use a single-column layout, explicit width constraints (`max-w-[210mm]`), and semantic HTML (`<section>`, `<h2>`, `<ul>`).
- Write the print stylesheet early (in the same phase as the resume page, not later).
- Test print output frequently: `Ctrl+P` in Chrome, check Print Preview.
- Use `@media print` to: hide header/footer/nav, remove backgrounds, set `@page { size: A4; margin: 1.5cm; }`, set `body { font-size: 10pt; }`, add `break-inside: avoid` on sections.
- Consider `@page :first { margin-top: 1cm; }` for the first page (no browser header on first page).

**Detection:** Print preview shows navigation, background colors, or content overflowing page boundaries.

**Phase:** Resume page phase (print stylesheet is co-designed with the page)

---

### Pitfall 9: Dark Mode Toggle Does Not Persist Across Routes

**What goes wrong:** The dark mode state in `Header.tsx` (lines 23-39) uses `useState` with `localStorage` initialization. When navigating from `/` to `/resume`, the `Header` component unmounts and remounts (because `App.tsx` re-renders the layout). The `useState` initializer runs again, reading from `localStorage` -- this works. But if the resume page has its own theme toggle or if the dark class is not applied before the first paint, there is a flash of wrong theme (FOUT).

**Why it happens:** The dark class is applied via `useEffect` (line 31-39), which runs after render. On initial page load or route change, the HTML renders without the `.dark` class, then the effect adds it, causing a brief flash of light theme even when dark mode is active.

**Consequences:** Flash of unstyled content on route changes. Minor but noticeable.

**Prevention:**
- Apply the `.dark` class in `index.html` via a blocking `<script>` tag before React hydrates: `document.documentElement.classList.toggle('dark', localStorage.getItem('theme') === 'dark' || ...)`.
- The current codebase does not have this script (confirmed by reading `App.tsx` and `Header.tsx`).
- For the resume page, ensure the same theme persistence mechanism is used -- do not create a separate theme state.

**Detection:** Navigate to `/resume` with dark mode active. Observe a flash of light theme before dark mode applies.

**Phase:** Theme redesign phase (fix the FOUT early, before adding more routes)

---

### Pitfall 10: Hardcoded Certificate Data Breaks Content Architecture

**What goes wrong:** The `CERTS` array in `CertificatesSection.tsx` (lines 3-10) contains hardcoded certificate names and filenames. Adding a new certificate requires editing the component source code, not just adding a markdown file. This breaks the project's core architecture where content is markdown-driven.

**Why it happens:** The certificates section was added before the content migration was complete. The developer needed a quick way to display certificates and hardcoded them. The migration to markdown was deferred.

**Consequences:** Every certificate update is a code change requiring a rebuild. The content architecture is inconsistent (some content is markdown, some is hardcoded). Contributors cannot add certificates without touching React components.

**Prevention:**
- Migrate certificate data to a markdown file (e.g., `src/content/home/certificates.md`) with frontmatter containing a simple array of objects.
- The `parseYamlSimple` parser supports `certificates: [{name: "AWS", file: "aws.pdf"}]` format (one level of nesting in array items).
- Update `CertificatesSection.tsx` to use `getSection('home/certificates.md')` instead of the hardcoded array.
- Register the new markdown file in the `modules` map in `markdown.ts`.
- Verify the parsed output matches the expected structure before removing the hardcoded data.

**Detection:** Check `CertificatesSection.tsx` -- if it has a `const CERTS = [...]` array, the migration is not complete.

**Phase:** Content migration phase (part of "populate all sections with real content")

---

## Minor Pitfalls

Issues that cause annoyance or technical debt but not user-facing problems.

### Pitfall 11: Inline `<style>` Tag in CertificatesSection Bypasses Tailwind

**What goes wrong:** `CertificatesSection.tsx` (lines 43-63) injects raw CSS via a `<style>` tag with hardcoded class names (`.cert-ico-link`, `.cert-ico`). This bypasses Tailwind's utility system, is not tree-shaken, and creates global class name conflicts if any other component uses the same class names.

**Why it happens:** Quick solution to add hover effects without converting to Tailwind utilities. The `transform: scale(1.25)` and `filter: drop-shadow(...)` effects are easy to write in raw CSS.

**Consequences:** Global CSS pollution. No composition with Tailwind. Maintenance confusion -- future developers look for `.cert-ico-link` in Tailwind config and find nothing.

**Prevention:**
- Convert to Tailwind utility classes: `className="inline-flex items-center transition-transform hover:scale-125 hover:drop-shadow-[0_0_6px_currentColor]"`.
- The `prefers-reduced-motion` override can be handled by the existing global rule in `index.css` (line 156-166) if the animation classes match.
- Remove the `<style>` tag entirely.

**Detection:** Search for `<style>` tags in component files -- they should not exist in a Tailwind project.

**Phase:** Polish phase (low priority, cosmetic fix)

---

### Pitfall 12: Unused Dependencies Add Confusion and Bundle Weight

**What goes wrong:** `zustand`, `@tanstack/react-query`, and `lucide-react` are installed but never imported. They add to `node_modules` size and confuse developers who see them in `package.json` and expect them to be used. `lucide-react` coexists with `@phosphor-icons/react` which is the actual icon library.

**Why it happens:** Dependencies were installed during initial scaffolding or experimentation and never removed.

**Consequences:** Larger install size. Confusing dependency graph. Developers may accidentally import from the wrong icon library.

**Prevention:**
- Remove unused packages: `npm uninstall zustand @tanstack/react-query lucide-react`.
- Verify no CSS imports reference them (confirmed: they do not).
- If zustand or react-query are planned for future use, do not install them until needed.

**Detection:** `grep -r "from 'zustand'" src/` returns nothing. Same for react-query and lucide-react.

**Phase:** Cleanup phase (do early to avoid confusion during other phases)

---

### Pitfall 13: Section Null Guards Hide Missing Content Silently

**What goes wrong:** Every section component returns `null` when its content is missing (e.g., `HeroSection` line 7: `if (!hero) return null`). If a markdown file is renamed, moved, or the key in the `modules` map is wrong, the section simply disappears with no console warning or error.

**Why it happens:** Defensive coding -- returning null prevents crashes. But without logging, it also prevents debugging.

**Consequences:** Developer adds a new content file, forgets to register it in `markdown.ts`, and the section silently vanishes. They spend 20 minutes debugging before realizing the registration step was missed.

**Prevention:**
- Add `console.warn` in `getSection()` when a key is not found: `if (!raw) { console.warn(\`[markdown] Content not found: ${path}\`); return null; }`.
- This only fires in development (production console.warn is often suppressed) but catches the mistake immediately.
- Consider adding a build-time check that verifies all imported `.md` files are registered.

**Detection:** Remove a key from the `modules` map -- the corresponding section should produce a console warning.

**Phase:** Polish/hardening phase (quick fix, high value)

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Warm theme redesign | OKLCH hue mismatch between light/dark modes (Pitfall 3) | Map full palette before changing any values; test both modes after every change |
| 3D tilt animation | Layout thrashing from mousemove + DOM reads (Pitfall 1) | Use requestAnimationFrame; read only mouse coordinates; never read DOM metrics in handler |
| 3D tilt animation | Mobile performance degradation | Test on real devices; add `prefers-reduced-motion` override; consider CSS-only tilt (hover) as fallback |
| Resume page route | Scroll-spy breaks on non-home routes (Pitfall 4) | Check `useLocation().pathname` before initializing scroll-spy; conditionally render nav links |
| Resume page route | Flash of wrong theme on navigation (Pitfall 9) | Add blocking `<script>` in `index.html` to apply `.dark` class before React hydrates |
| Print stylesheet | Tailwind utilities override print styles (Pitfall 2) | Use `@layer base` for print overrides; test with Ctrl+P early and often |
| Print stylesheet | Resume prints as web page, not document (Pitfall 8) | Design with print in mind from start; use `@page { size: A4; margin: 1.5cm; }` |
| Content migration | YAML parser silently drops complex data (Pitfall 5) | Keep frontmatter flat; test parsed output in console; do not nest beyond one level |
| Content migration | Hardcoded data not migrated (Pitfall 10) | Migrate CERTS array to markdown before adding new certificates |
| Markdown system | No memoization on repeated parses (Pitfall 7) | Add module-level cache in `markdown.ts` before adding new content files |
| All phases | No error boundaries -- one crash kills the whole page (Pitfall 6) | Add `react-error-boundary` wrappers around each section in `Home.tsx` |

---

## Sources

- Tailwind CSS v4 documentation: `https://tailwindcss.com/docs/theme` -- `@theme` directive, CSS variable naming, `inline` keyword, tree-shaking behavior
- MDN `@media#print`: `https://developer.mozilla.org/en-US/docs/Web/CSS/@media#print` -- print stylesheet best practices, `@page` rules, color adjust
- MDN `prefers-reduced-motion`: `https://developer.mozilla.org/en-US/docs/Web/CSS/@media` -- media feature for animation accessibility
- React Error Boundaries: `https://react.dev/reference/react/Component` -- `getDerivedStateFromError`, `componentDidCatch`, `captureOwnerStack`
- Codebase analysis: `src/lib/markdown.ts`, `src/index.css`, `src/App.tsx`, `src/components/Header.tsx`, `src/components/CertificatesSection.tsx`, `src/components/HeroSection.tsx`

---

*Pitfalls research: 2026-08-01*
