# Verdict — Dieter Rams Audit

## REFINE

Total score: 21/30. No individual principle scored 0. The bones are good — clean token system, honest copy, unobtrusive layout, long-lasting aesthetics — but thoroughness (#8) and accessibility gaps prevent this from being a strong portfolio.

## Why REFINE and not REDESIGN

The structural foundation (markdown-driven content, OKLCH tokens, component architecture) is sound. The layout is clean and purposeful. What's missing are finishing touches: accessibility states, empty states, broken images, dark mode activation, and cleanup of unused dependencies. These are fixable in a single refinement pass without structural changes.

## Top 5 highest-leverage moves

1. **Thorough (#8) — Add missing interactive states.** Links need `focus-visible` styling. ProjectCard needs hover/focus states. Every section needs empty-state fallback copy when markdown content is missing. Evidence: 01-evidence.md:States checklist — 0/6 states present on links, 0/6 on cards.

2. **Thorough (#8) — Fix broken images and add dark mode toggle.** Project images (`/images/projects/portfolio.png`, `/images/projects/dashboard.png`) return 404. The dark mode token system is fully wired but has no activation mechanism. Evidence: 01-evidence.md:Weight (broken refs), Visual (no toggle).

3. **Aesthetic (#3) — Unify button styling.** Two CTA buttons use hand-coded `<a>` tags with duplicated class strings (HeroSection.tsx:27, ContactSection.tsx:31) instead of the shadcn Button component with `asChild`. This creates inconsistency and bypasses the design system. Evidence: 01-evidence.md:Structural (repeated CTA pattern), button.tsx (unused).

4. **Honest (#6) — Fix label-behavior mismatches.** "View My Work" scrolls, not navigates. "Featured Projects" shows all projects, not a curated subset. Either relabel or add actual filtering. Evidence: 01-evidence.md:Copy (mismatches section).

5. **Environmentally friendly (#9) — Remove unused dependencies and font subsets.** 8 npm packages are installed but never imported. 4 font subsets (42 KB) load for an English-only site. Unused assets (`hero.png`, `typescript.svg`, `vite.svg`) add to install weight. Evidence: 01-evidence.md:Weight (unused deps, font subsets, orphaned assets).
