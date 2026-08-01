# Codebase Concerns

**Analysis Date:** 2026-08-01

## Tech Debt

**Unused Dependencies:**
- Issue: `zustand`, `@tanstack/react-query`, and `lucide-react` are installed in `package.json` but never imported anywhere in source code. They add to `node_modules` weight and could confuse future contributors.
- Files: `package.json` (lines 19, 33)
- Impact: Increased install size, misleading dependency graph. `lucide-react` coexists with `@phosphor-icons/react` which is the actual icon library in use.
- Fix approach: Remove unused packages from `package.json`: `npm uninstall zustand @tanstack/react-query lucide-react`. Verify no CSS imports reference them (they don't).

**Stale Knowledge Documents:**
- Issue: `knowledge/project-structure.md` describes an entirely different architecture (JSX files, `src/data/`, `src/styles/`, `src/context/`, `src/utils/`) that no longer exists. `knowledge/development-guide.md` references `npm run format` (not in `package.json`), and file paths like `src/data/projects.js` and `src/data/skills.js` that don't exist.
- Files: `knowledge/project-structure.md`, `knowledge/development-guide.md`
- Impact: Misleads developers and AI agents into expecting directories/files that don't exist, leading to wrong file placement.
- Fix approach: Rewrite both documents to match current architecture: TypeScript, markdown-driven content in `src/content/`, components in `src/components/`, no `src/data/` or `src/styles/`.

**Hardcoded Certificate Data:**
- Issue: `CertificatesSection.tsx` contains a hardcoded `CERTS` array mapping certificate names to PDF filenames. Any new certificate requires editing the component source.
- Files: `src/components/CertificatesSection.tsx` (lines 3-10)
- Impact: Every certificate addition is a code change rather than a content change, breaking the markdown-driven content pattern used elsewhere.
- Fix approach: Migrate certificate metadata to a markdown file (e.g., `src/content/home/certificates.md`) with frontmatter, similar to how skills/about/hero work.

**Manual Module Registration for Markdown:**
- Issue: `src/lib/markdown.ts` requires manually importing each `.md` file and adding it to the `modules` map (lines 15-29). Adding a new content file requires two edits: an import statement and a map entry.
- Files: `src/lib/markdown.ts` (lines 15-29)
- Impact: Friction for content updates; a forgotten registration silently produces a 404-like `null` return.
- Fix approach: Consider `import.meta.glob` (may need Vite plugin support for .md) or a build-time codegen step.

**Inline CSS in CertificatesSection:**
- Issue: `CertificatesSection.tsx` injects raw CSS via a `<style>` tag (lines 43-63) with hardcoded class names (`.cert-ico-link`, `.cert-ico`). This bypasses Tailwind's utility system and the project's design token approach.
- Files: `src/components/CertificatesSection.tsx` (lines 43-63)
- Impact: Styles are not tree-shaken, not composable with Tailwind, and create global class name conflicts if duplicated.
- Fix approach: Convert to Tailwind utility classes and `@layer utilities` custom classes in `index.css`, or use the existing `animate-fade-up` pattern with Tailwind hover variants.

## Known Bugs

**Missing Project Images:**
- Symptoms: Project cards for "Portfolio Website" and "Analytics Dashboard" reference `/images/projects/portfolio.png` and `/images/projects/dashboard.png`, but the `public/images/` directory does not exist. The cards silently fall back to the gradient placeholder with the title initial.
- Files: `src/content/projects/portfolio.md` (line 6), `src/content/projects/dashboard.md` (line 6)
- Trigger: View the Featured Projects section — all project cards show the letter "P" or "A" gradient instead of screenshots.
- Workaround: The gradient fallback works visually but looks incomplete. Create `public/images/projects/` and add the screenshots.

**setTimeout Without Cleanup in ContactSection:**
- Symptoms: If the user navigates away from the page within 5 seconds of submitting the contact form, the `setTimeout` callback fires after unmount, attempting to call `setSubmitStatus('idle')` on an unmounted component.
- Files: `src/components/ContactSection.tsx` (line 75)
- Trigger: Submit the form, then quickly navigate or unmount the component.
- Workaround: Low severity in a single-page portfolio (unlikely to unmount), but technically a React warning in StrictMode development.

**Duplicate `@layer utilities` Blocks:**
- Symptoms: `index.css` defines `@layer utilities` twice (lines 141 and 168). While CSS layers merge, splitting them creates maintenance confusion.
- Files: `src/index.css` (lines 141-153, 168-175)
- Trigger: None visible — CSS layers handle merging correctly.
- Workaround: Cosmetic. Merge into a single `@layer utilities` block.

## Security Considerations

**EmailJS Contact Form Abuse:**
- Risk: The contact form has no rate limiting, CAPTCHA, or cooldown between submissions. An attacker could flood the form, sending many emails through the EmailJS service.
- Files: `src/components/ContactSection.tsx` (lines 46-80)
- Current mitigation: None.
- Recommendations: Add a client-side cooldown (e.g., disable the form for 30 seconds after successful submit). For stronger protection, add a honeypot field or integrate a CAPTCHA service.

**Certificate PDFs Publicly Accessible:**
- Risk: All 6 certificate PDFs in `public/certificates/` are served directly by the static file server with no access control. Anyone with the URL can download them.
- Files: `public/certificates/*.pdf`
- Current mitigation: Obscure filenames (random IDs like `certificate-bwsddiaa3s3c-1785140297.pdf`).
- Recommendations: If certificates are meant to be publicly shareable (typical for a portfolio), this is acceptable. If any contain sensitive information, move them behind authentication or remove them.

**Exposed EmailJS Public Key:**
- Risk: The EmailJS public key is bundled into client JavaScript (required by EmailJS SDK). While designed to be public, it can be extracted and used to send emails through the service.
- Files: `src/components/ContactSection.tsx` (line 52), `.env.example`
- Current mitigation: EmailJS rate limiting on their dashboard (must be configured manually).
- Recommendations: Ensure EmailJS dashboard rate limits are configured. Consider server-side email sending for production if spam becomes an issue.

## Performance Bottlenecks

**Repeated Markdown Parsing on Every Render:**
- Problem: `getSection()` and `getProjects()` in `src/lib/markdown.ts` parse YAML frontmatter on every call. These functions are called during component render (e.g., `HeroSection`, `AboutSection`, `SkillsSection`, `FeaturedProjects`, `ContactSection` all call them at the top level of their render function). The underlying content is static — it never changes at runtime.
- Files: `src/lib/markdown.ts` (`getSection` line 137, `getProjects` line 148), called from `src/components/HeroSection.tsx` (line 6), `src/components/AboutSection.tsx` (line 15), `src/components/SkillsSection.tsx` (line 10), `src/components/FeaturedProjects.tsx` (line 6), `src/components/ContactSection.tsx` (line 28)
- Cause: `parseFrontmatter` and `parseYamlSimple` run on the same string on every render with no memoization.
- Improvement path: Add module-level caching — parse each markdown file once and cache the result. Example: `const sectionCache = new Map<string, MarkdownFile | null>()` checked before parsing in `getSection()`.

**useScrollSpy Recreates Observer on Each Render:**
- Problem: `useScrollSpy` in `src/hooks/useScrollSpy.ts` depends on `sectionIds` (an array). Since `SECTION_IDS` in `Header.tsx` is a `const` derived from `NAV_LINKS.map(...)`, it creates a new array reference each render (though defined outside the component, so it's stable). However, the observer re-queries DOM elements each time the effect runs.
- Files: `src/hooks/useScrollSpy.ts` (lines 8-38), `src/components/Header.tsx` (line 14)
- Cause: Array identity comparison in `useEffect` dependency — `sectionIds` is recreated on each render of the parent if not memoized.
- Improvement path: Ensure `SECTION_IDS` is defined as a module-level constant (it is — line 14 of Header.tsx) or wrap in `useMemo`. Current implementation is acceptable but fragile if refactored.

**Large Certificate PDFs in Git History:**
- Problem: 6 PDF files totaling ~610KB are tracked in git. Every version of these files persists in git history forever, bloating clone size.
- Files: `public/certificates/*.pdf` (6 files, ~610KB total)
- Cause: Binary files committed directly to git.
- Improvement path: Consider Git LFS for binary assets, or host certificates externally (e.g., Google Drive, cloud storage) with link-based references instead.

## Fragile Areas

**Custom YAML Frontmatter Parser:**
- Files: `src/lib/markdown.ts` (`parseYamlSimple` lines 47-121, `parseYamlValue` lines 35-45)
- Why fragile: Hand-written YAML parser with significant limitations:
  - No support for nested objects beyond one level (e.g., `address: { city: "X" }` fails)
  - No support for quoted keys containing colons
  - No multi-line string support
  - No flow mapping syntax
  - Comments between array items can break parsing
  - `parseYamlValue` treats bare strings with leading numbers as numeric (e.g., `"123abc"` becomes `"123abc"` but `"123"` becomes `123`)
  - Silently returns partial data on malformed YAML instead of throwing errors
- Safe modification: Only add frontmatter properties that are flat key-value pairs, simple arrays, or single-level array-of-objects. Test any new frontmatter structure manually. Never use nested objects or complex YAML features.
- Test coverage: None — no unit tests exist for this parser.

**Section Rendering Null Guards:**
- Files: `src/components/HeroSection.tsx` (line 7), `src/components/AboutSection.tsx` (line 16), `src/components/SkillsSection.tsx` (line 11), `src/components/ContactSection.tsx` (line 40)
- Why fragile: Each component silently returns `null` when its content is missing. If the markdown file is renamed, moved, or the key in the `modules` map is wrong, the section simply disappears with no console warning or error.
- Safe modification: When adding or renaming content files, always verify the key in `src/lib/markdown.ts` `modules` map matches the `getSection()` call. Check the browser console for missing sections.
- Test coverage: None.

**Header Navigation Section IDs:**
- Files: `src/components/Header.tsx` (lines 5-14), `src/pages/Home.tsx` (lines 9-18)
- Why fragile: Navigation links (`NAV_LINKS`) reference `#home`, `#about`, `#projects`, `#skills`, `#certificates`, `#contact` — these must match the `id` attributes on the `<section>` elements in `Home.tsx` and each section component. A mismatch silently breaks scroll-spy highlighting.
- Safe modification: When adding or reordering sections, update both `NAV_LINKS` in `Header.tsx` and the `id` attributes on each `<section>`. Verify the order matches.
- Test coverage: None.

## Scaling Limits

**Content Volume:**
- Current capacity: 2 project files, 4 home content files. All imported individually.
- Limit: Adding ~20+ content files would make the manual import/map pattern in `markdown.ts` tedious and error-prone.
- Scaling path: Implement dynamic import pattern or build-time content discovery.

**Single-Page Architecture:**
- Current capacity: All sections on one page (`/`). Router exists but only has one route.
- Limit: Adding many sections will make the page long and slow to scroll. No code splitting.
- Scaling path: Convert to multi-page routing with `react-router-dom` routes when content grows.

## Dependencies at Risk

**Custom YAML Parser (`src/lib/markdown.ts`):**
- Risk: Hand-maintained parser with no test coverage. Any YAML syntax change in content files can silently break metadata parsing.
- Impact: Sections show wrong data or fall back to defaults with no error.
- Migration plan: Evaluate `js-yaml` (lightweight) or `gray-matter` (purpose-built for markdown frontmatter) if parsing needs grow.

**`@emailjs/browser`:**
- Risk: Client-side email sending depends on a third-party service. If EmailJS changes their API, pricing, or shuts down, the contact form breaks.
- Impact: Contact form becomes non-functional.
- Migration plan: Build a simple serverless function (e.g., Vercel Edge Function, Cloudflare Worker) that sends email via SMTP or a provider API. The contact form would POST to this endpoint instead.

## Missing Critical Features

**No Error Boundaries:**
- Problem: No React Error Boundary wraps any component. If any section throws during render, the entire page crashes to a white screen.
- Blocks: Resilient degradation — a single broken section shouldn't take down the whole site.

**No 404 Page:**
- Problem: `App.tsx` only defines a single route (`/`). Any other URL shows a blank page with header/footer but no content or redirect.
- Blocks: Handling direct URL access, shared links, or browser navigation errors.

**No SEO / Open Graph Meta Tags:**
- Problem: `index.html` only has `<title>Mr.Ant's Portfolio</title>`. No `<meta name="description">`, no Open Graph tags (`og:title`, `og:description`, `og:image`), no Twitter Card tags.
- Blocks: Proper social media sharing, search engine indexing, and link previews.

**No `format` Script:**
- Problem: `knowledge/development-guide.md` documents `npm run format` but no such script exists in `package.json`. No Prettier or Biome configuration exists.
- Blocks: Consistent code formatting across contributors. CLAUDE.md also mentions no `format` script exists.

**No Favicon in Expected Format:**
- Problem: `knowledge/project-structure.md` references `favicon.ico` but the project uses `favicon.svg` (referenced in `index.html`). No `.ico` file exists.
- Blocks: Browser compatibility for older browsers that don't support SVG favicons.

## Test Coverage Gaps

**Entire Codebase — No Tests:**
- What's not tested: Every component, hook, utility function, and the YAML parser has zero test coverage. No test framework is configured (no Jest, Vitest, or Testing Library in `package.json`).
- Files: All source files — `src/components/*.tsx`, `src/hooks/useScrollSpy.ts`, `src/lib/markdown.ts`, `src/lib/utils.ts`, `src/lib/schemas/contact.ts`
- Risk: Regression bugs go undetected. Refactoring components, changing the YAML parser, or modifying the form schema could silently break functionality.
- Priority: High — at minimum, unit tests for `parseFrontmatter`/`parseYamlSimple` (complex custom logic) and the Zod contact schema. Component tests for form submission flow.

**YAML Parser — Critical Ungested Path:**
- What's not tested: `parseYamlSimple` handles edge cases (arrays of objects, nested properties, various value types) with zero tests. This is the most complex custom code in the project.
- Files: `src/lib/markdown.ts` (lines 47-121)
- Risk: Any change to markdown frontmatter format could silently produce wrong data.
- Priority: High.

---

*Concerns audit: 2026-08-01*
