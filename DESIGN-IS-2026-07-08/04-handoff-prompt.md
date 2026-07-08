# Handoff Prompt — /make-plan

---

/make-plan Refine the Mr.Ant portfolio home page based on a Dieter Rams audit (total 21/30).

Verdict paragraph:
> Total score: 21/30. No individual principle scored 0. The bones are good — clean token system, honest copy, unobtrusive layout, long-lasting aesthetics — but thoroughness (#8) and accessibility gaps prevent this from being a strong portfolio. The structural foundation (markdown-driven content, OKLCH tokens, component architecture) is sound. What's missing are finishing touches: accessibility states, empty states, broken images, dark mode activation, and cleanup of unused dependencies.

Keep (already strong, do NOT touch in this pass):
- Principle #5 (unobtrusive) scored 3 — Evidence: No decorative elements, chrome recedes completely, every visible element serves content delivery. Regression check: confirm no new chrome/decoration is added during the refine.
- Principle #7 (long-lasting) scored 3 — Evidence: Monochromatic OKLCH tokens, clean JetBrains Mono, no skeuomorphism or trend markers. Regression check: confirm no fad gradients, trendy typography, or year-specific patterns are introduced.
- Principle #10 (as little design as possible) scored 3 — Evidence: Four sections, each serving one distinct purpose. No decorative elements, no duplicated affordances. Regression check: confirm no new sections or decorative elements are added.

Fix in priority order (top 5 moves from the audit):
1. Thorough (#8) — Add missing interactive states. Links need `focus-visible` styling. ProjectCard needs hover/focus states. Every section needs empty-state fallback copy when markdown content is missing. Evidence: 01-evidence.md:States checklist — 0/6 states present on links, 0/6 on cards.
2. Thorough (#8) — Fix broken images and add dark mode toggle. Project images (`/images/projects/portfolio.png`, `/images/projects/dashboard.png`) return 404 — either create placeholder images or remove the `image` field from project frontmatter. The dark mode token system is fully wired (index.css:87-119) but has no activation mechanism — add a toggle button and `prefers-color-scheme` default. Evidence: 01-evidence.md:Weight (broken refs), Visual (no toggle).
3. Aesthetic (#3) — Unify button styling. Two CTA buttons use hand-coded `<a>` tags with duplicated class strings (HeroSection.tsx:27, ContactSection.tsx:31) instead of the shadcn Button component with `asChild`. Replace with `<Button asChild><a href="...">...</a></Button>` to use the design system consistently. Evidence: 01-evidence.md:Structural (repeated CTA pattern), button.tsx (unused).
4. Honest (#6) — Fix label-behavior mismatches. "View My Work" (hero.md:4) scrolls to `#projects` but implies navigation — relabel to "See My Projects" or "Scroll to Projects". "Featured Projects" (FeaturedProjects.tsx:12) shows all projects when only 2 exist — either add actual filtering logic or rename to "My Projects". Evidence: 01-evidence.md:Copy (mismatches section).
5. Environmentally friendly (#9) — Remove unused dependencies and font subsets. Uninstall 8 unused npm packages (@phosphor-icons/react, @tanstack/react-query, zustand, react-hook-form, zod, lucide-react, shadcn CLI, tw-animate-css). Configure @fontsource to load only the latin subset. Delete orphaned assets (src/assets/hero.png, src/assets/typescript.svg, src/assets/vite.svg, public/icons.svg). Evidence: 01-evidence.md:Weight (unused deps, font subsets, orphaned assets).

Out of scope for this refine pass:
- Adding new routes or pages (beyond the single home page)
- Adding a navigation bar or footer (structural addition, not a refine)
- Replacing the markdown content system or component architecture
- Adding animations or page transitions
- Adding new dependencies beyond what's needed for the fixes above

Deliverables for the plan:
- Per-fix: target files, exact change, verification step
- Token/contrast fixes consolidated in one place (muted-foreground needs to meet WCAG AA 4.5:1)
- Regression checklist for every "Keep" item above

Anti-patterns to guard against (specific to REFINE):
- Adding new abstractions where a direct change suffices (e.g., don't create a new Layout component just to fix section padding)
- Restyling areas that already scored 3 (don't touch the monochromatic token system, the type scale, or the section structure)
- Scope creep into structural redesign (if adding a nav bar is needed, that's REDESIGN territory)
- Letting fixes mutate principles outside the priority list (don't add animations, don't add new sections, don't change the content model)
