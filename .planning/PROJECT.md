# Mr.Ant's Portfolio — Personal Website Upgrade

## What This Is

A personal website for a developer ("Mr.Ant") that serves as both portfolio and professional presence. Built on an existing React + TypeScript + Vite SPA with markdown-driven content. The goal is to elevate it from a functional prototype to a polished, personal-feeling website with a resume/CV page and warmer, more refined visual design.

## Core Value

The site must feel like **mine** — not a template. Warmer colors, real content, a distinctive hero section with motion, and a professional resume page I can share with employers.

## Requirements

### Validated

- ✓ Single-page scrolling portfolio (Hero, About, Projects, Skills, Certificates, Contact) — existing
- ✓ Markdown-driven content system (frontmatter + raw imports) — existing
- ✓ Contact form with react-hook-form + Zod + EmailJS — existing
- ✓ Scroll-spy navigation with active section highlighting — existing
- ✓ shadcn/ui + Phosphor Icons component system — existing
- ✓ Tailwind CSS 4 with OKLCH design tokens — existing

### Active

- [ ] Populate all sections with real content (user-provided: bio, projects, skills, certificates)
- [ ] Polish overall feel: refine spacing, typography, transitions across all sections

### Out of Scope

- Blog section — easy to add later via existing markdown architecture, defer to v2
- Testimonials section — not needed for current version
- Experience/work history timeline — separate from resume page, not in scope
- Multi-page navigation for main site — keep single-scroll, only `/resume` is a separate route
- OAuth / authentication — static portfolio, no user accounts
- CMS or admin dashboard — content authored as markdown files in repo

## Context

**Existing codebase:**
- React 19 + TypeScript 6 + Vite 8 + Tailwind CSS 4
- shadcn/ui (radix-lyra style) with Phosphor Icons
- Markdown content in `src/content/` parsed by custom `parseYamlSimple` in `src/lib/markdown.ts`
- Components in `src/components/`, pages in `src/pages/`
- Dark-only theme (no toggle)
- Routes: `/`, `/resume`, `/certificates`, `/certificates/:skill` via react-router-dom — all nested under `DefaultLayout`

**Known issues to be aware of:**
- Custom YAML parser (`parseYamlSimple`) has no test coverage, limited to flat key-value and simple arrays
- Certificate data driven by `src/content/certificates.json` + `src/lib/certs.ts`
- Markdown parsing runs on every render with no memoization
- No error boundaries, no 404 page, no SEO meta tags
- Unused dependencies: zustand, @tanstack/react-query, lucide-react
- Missing project images (fallback gradients show instead)

**Worktree context:**
- Working in `.claude/worktrees/add-profile-and-certs`
- Prior commits already added profile photo and certificates section
- Branch: `worktree-add-profile-and-certs`

## Constraints

- **Tech stack**: React 19 + TypeScript 6 + Vite 8 + Tailwind CSS 4 — no framework switches
- **Content format**: Markdown with YAML frontmatter, parsed by existing `parseYamlSimple` — only add flat key-value or simple array frontmatter
- **Icon library**: Phosphor Icons (`@phosphor-icons/react`) — no new icon libraries
- **Component pattern**: shadcn/ui + CVA variants — follow established conventions
- **Single-page architecture**: Main site stays as single scroll; only `/resume` is a new route
- **Static hosting**: No server-side rendering; everything runs client-side or at build time

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Dark-only theme | Simplifies implementation, no toggle needed | Shipped |
| Print stylesheet for PDF resume | Zero-dependency approach, matches web page exactly, user CTRL+P to save | — Pending |
| Skip blog for now | Low friction to add later via markdown architecture; focus on polish first | — Pending |
| User provides real data | Replace placeholder content with actual projects, skills, bio | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-08-01 after initialization*
