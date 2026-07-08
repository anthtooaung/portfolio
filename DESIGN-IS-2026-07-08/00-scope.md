# Scope — Dieter Rams Audit

**Date:** 2026-07-08

## What is being audited

- **Live URL:** http://localhost:5173 (Vite dev server)
- **Repo path:** `/home/pc/Documents/AI vibe coding/Portfolio/portfolio`
- **Audited surface:** Single-page Home view — `src/pages/Home.tsx` composing `HeroSection`, `SkillsSection`, `FeaturedProjects`, `ContactSection`
- **Single route:** `/` (no other routes exist)

## Primary user

Potential employer, client, or collaborator evaluating Mr.Ant's development skills and work.

## Primary task

Quickly understand who Mr.Ant is, what they can do, see examples of their work, and get in touch.

## Constraints

- **Stack:** React 19 + TypeScript + Vite 8 + Tailwind CSS 4 + shadcn/ui
- **Content model:** Markdown-driven (YAML frontmatter + body) via custom `src/lib/markdown.ts` parser
- **Design system:** OKLCH CSS variables, JetBrains Mono font, shadcn/ui component library
- **No test framework** configured
- **Early-stage project** — many installed dependencies unused

## Reference designs / competitors

None provided. Standard developer portfolio pattern assumed.
