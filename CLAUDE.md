# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website ("Mr.Ant's Portfolio") built with React, TypeScript, and Vite. Currently early-stage with a placeholder route — the `knowledge/` directory describes the intended architecture that hasn't been built out yet.

## Tech Stack

- **React 19** + **TypeScript 6** + **Vite 8**
- **Tailwind CSS 4** (v4 syntax: `@import "tailwindcss"`, `@custom-variant` directives)
- **shadcn/ui** (radix-lyra style) with **Phosphor Icons** as the icon library
- **Zustand** (state), **TanStack React Query** (server state), **react-hook-form** + **Zod** (forms) — installed but not yet wired in

## Commands

```bash
npm run dev        # Start Vite dev server (http://localhost:5173)
npm run build      # TypeScript check (tsc -b) then Vite production build
npm run lint       # Run ESLint
npm run preview    # Preview production build locally
```

No test framework is configured. No `format` script exists despite being mentioned in `knowledge/development-guide.md`.

## Architecture

Standard Vite + React SPA. The `@/` path alias maps to `src/`.

```
src/
├── main.tsx          # Entry point
├── App.tsx           # Root — BrowserRouter + routes
├── index.css         # Tailwind imports + CSS variable design tokens (OKLCH)
├── components/ui/    # shadcn/ui components (CVA variant pattern)
├── lib/utils.ts      # cn() utility (clsx + tailwind-merge)
└── assets/           # Static images
```

## Session Behavior

### On Session Start

When a new session begins, **always ask the user** before doing any work:

> Would you like to create a new branch or continue on the current branch?

- If "new branch" → ask for a branch name (or suggest one based on the task), then create and switch to it via `git checkout -b <branch>`.
- If "current branch" → confirm the current branch with `git branch --show-current` and proceed.

Do not make assumptions or skip this prompt.

### On Session End (Goodbye)

When the user signals they are finishing the session — any phrase like "ok thank you today", "bye bye", "see you", "goodbye", "that's all for today", "I'm done", or similar — **before responding with a farewell**, automatically:

1. Run `git diff` (and `git diff --cached`) to gather all changes made during the session.
2. Create a markdown file in `knowledge/` named with today's date: `knowledge/YYYY-MM-DD.md`.
3. Write the file with this structure:

```markdown
# Daily Progress — YYYY-MM-DD

## Branch
<current branch name>

## Files Changed
<list of files modified/added/deleted>

## Summary
<brief description of what was accomplished this session>

## Details
<more detailed breakdown if the session involved multiple tasks>
```

4. Confirm the file was written before saying goodbye.

Do not skip this step. Even a session with no code changes should produce a file noting that (e.g., "No code changes — planning/discussion only").

## Key Conventions

- **shadcn/ui components**: Live in `src/components/ui/`, use CVA for variants, Radix `Slot` for `asChild` polymorphism. See `button.tsx` as the canonical example.
- **CSS variables for theming**: Light/dark mode defined via OKLCH tokens in `index.css`. Dark mode uses `@custom-variant dark (&:is(.dark *))` (Tailwind v4 syntax).
- **Font**: JetBrains Mono as the base font (`@fontsource-variable/jetbrains-mono`), set via `@apply font-mono` on `<html>`.
- **No `src/data/` or `src/pages/` directories exist yet** — `knowledge/` references them as planned.
