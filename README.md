# Mr.Ant's Portfolio

A personal portfolio website built with React, TypeScript, and Vite — featuring a modern dark theme, markdown-driven content, and smooth animations.

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | React 19, TypeScript 6, Vite 8 |
| **Styling** | Tailwind CSS 4, OKLCH design tokens |
| **UI Components** | shadcn/ui (Radix primitives), Phosphor Icons |
| **Content** | Markdown with frontmatter (gray-matter, react-markdown) |
| **State** | Zustand, TanStack React Query |
| **Forms** | react-hook-form + Zod validation |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── main.tsx                 # Entry point
├── App.tsx                  # Root — BrowserRouter + routes
├── index.css                # Tailwind imports + CSS variable design tokens
├── components/
│   ├── ui/                  # shadcn/ui components (button, etc.)
│   ├── HeroSection.tsx      # Landing hero with animated intro
│   ├── FeaturedProjects.tsx # Project showcase grid
│   ├── ProjectCard.tsx      # Individual project card
│   ├── SkillsSection.tsx    # Skills display
│   └── ContactSection.tsx   # Contact form / info
├── pages/
│   └── Home.tsx             # Assembles all homepage sections
├── content/
│   ├── home/                # Markdown files for homepage sections
│   └── projects/            # Markdown files for project details
├── lib/
│   ├── utils.ts             # cn() utility (clsx + tailwind-merge)
│   └── markdown.ts          # Markdown parsing helpers
└── assets/                  # Static images and icons
```

## Content System

Pages are driven by Markdown files with YAML frontmatter in `src/content/`. This makes it easy to update text, skills, and projects without touching component code.

## License

Personal project — not open for redistribution.
