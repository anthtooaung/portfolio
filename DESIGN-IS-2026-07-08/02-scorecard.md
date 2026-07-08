# Scorecard — Dieter Rams Audit

**Total: 21 / 30**

---

### 1. Good design is innovative — Score: 1/3
**Evidence:** Markdown-driven content is a common developer portfolio pattern. No novel interaction, no technology-driven form advancement. The `?raw` import approach is a minor implementation variation, not a design innovation.
**Justification:** Imitates the standard developer portfolio template with minor variation in content management approach.

### 2. Good design makes a product useful — Score: 2/3
**Evidence:** Primary task (see work → get in touch) is achievable via vertical scroll. But no navbar, no section anchors, no jump-to-section. "View My Work" scrolls to `#projects` (HeroSection.tsx:26) — a same-page anchor, not a separate portfolio view. Zero event handlers, zero inputs, zero dynamic interaction.
**Justification:** Primary task completes but the single-page-scroll-only approach adds friction when revisiting specific sections.

### 3. Good design is aesthetic — Score: 2/3
**Evidence:** OKLCH token system defines 11 referenced colors, all monochromatic grays. Spacing scale has 13 distinct values (01-evidence.md:Visual). Type scale has 9 values with a clean progression up to 36px, then a 1.67x jump to 60px. CTA buttons are hand-coded with duplicated class strings (HeroSection.tsx:27, ContactSection.tsx:31) bypassing the shadcn Button component.
**Justification:** Clean monochromatic system with consistent spacing, but the duplicated CTA styling and unused design system component show inconsistency.

### 4. Good design makes a product understandable — Score: 2/3
**Evidence:** Four clearly labeled sections (hero, skills, projects, contact). Progress bars intuitively convey skill levels. "Full-Stack Developer" (hero.md:3) is jargon for non-technical visitors. "View My Work" suggests navigation but scrolls (HeroSection.tsx:26). Section headings are clear and descriptive.
**Justification:** Structure clarifies function for the target audience (tech), but one jargon term and one misleading label need attention.

### 5. Good design is unobtrusive — Score: 3/3
**Evidence:** No decorative elements, no chrome that competes with content. Monochromatic palette ensures content is the figure, UI the ground. No modals, no notifications, no badges on load. Sections are purely content-driven (hero text, skill cards, project cards, contact info).
**Justification:** Chrome recedes completely; every visible element serves content delivery.

### 6. Good design is honest — Score: 2/3
**Evidence:** No extreme superlatives, no dark patterns (01-evidence.md:Copy). "View My Work" (hero.md:4) implies navigation but scrolls — minor label-behavior mismatch. "Featured Projects" (FeaturedProjects.tsx:12) implies curation but displays all projects (both have `featured: true`). Three mild unsubstantiated claims in body copy.
**Justification:** Generally honest, but two labels overstate what they deliver.

### 7. Good design is long-lasting — Score: 3/3
**Evidence:** Monochromatic OKLCH tokens, clean JetBrains Mono typography, no skeuomorphism, no fad gradients, no trend-driven decorative elements. Progress bars and card layouts are evergreen patterns. The "→" link arrows are timeless. No year-specific trend markers.
**Justification:** Visual language would read as current 3+ years from now.

### 8. Good design is thorough down to the last detail — Score: 1/3
**Evidence:** Links have no focus-visible styling (01-evidence.md:States). Zero empty states — every section returns `null` for missing data (HeroSection.tsx:5, SkillsSection.tsx:10, FeaturedProjects.tsx:7, ContactSection.tsx:12). Zero loading states. Zero error states. Two broken image references (portfolio.md, dashboard.md → 404). No dark mode toggle despite full token system. `prefers-reduced-motion` not respected.
**Justification:** 4+ states missing across all interactive elements; broken images and missing dark mode toggle show gaps in edge-case consideration.

### 9. Good design is environmentally friendly — Score: 2/3
**Evidence:** Gzipped JS: 118.2 KB (01-evidence.md:Weight). Zero idle animations. No autoplay video. But: 8 unused npm dependencies adding to install weight, 42 KB of unnecessary font subsets loaded, react-markdown + remark-gfm ecosystem is heavy for rendering 5 small markdown files, no `prefers-reduced-motion` handling, no code splitting.
**Justification:** Acceptable bundle size for a portfolio, but unnecessary weight from unused deps and font subsets, plus missing motion gating.

### 10. Good design is as little design as possible — Score: 3/3
**Evidence:** Four sections, each serving one distinct purpose (identity, skills, work, contact). No decorative elements. No duplicated affordances. No ornamentation. Every element on the page earns its place in the information hierarchy.
**Justification:** Every element serves the primary task; removing any section would break the portfolio's purpose.
