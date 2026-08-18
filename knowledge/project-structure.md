# Project Structure

## Root Directory
```
portfolio/
├── public/                    # Static assets
│   ├── audio/
│   │   └── intro-guide.mp3
│   ├── certificates/          # Certificate PDFs
│   ├── images/                # Static images
│   ├── favicon.svg
│   └── og-image.png
├── src/                       # Source code
│   ├── components/
│   │   ├── ui/                # shadcn/ui primitives (Button, Input, Textarea)
│   │   ├── Header.tsx         # Fixed nav, scroll spy, achievements dropdown
│   │   ├── DefaultLayout.tsx  # Layout wrapper (Header + Outlet + Footer)
│   │   ├── Footer.tsx         # Social links, copyright
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── FeaturedProjects.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── PdfViewer.tsx
│   │   ├── AudioGuide.tsx
│   │   └── ScrollToTop.tsx
│   ├── pages/
│   │   ├── Home.tsx           # Composes all home sections
│   │   ├── Resume.tsx         # /resume route
│   │   └── Certificates.tsx   # /certificates route
│   ├── lib/
│   │   ├── utils.ts           # cn() utility
│   │   ├── markdown.ts        # parseFrontmatter, getSection, getProjects
│   │   └── certs.ts           # getSkills, getSkillLevel, certificates
│   ├── hooks/
│   │   └── useScrollSpy.ts
│   ├── content/
│   │   ├── home/              # Markdown: hero.md, about.md, skills.md, contact.md
│   │   ├── projects/          # Markdown: portfolio.md, dashboard.md
│   │   ├── certificates.json  # Skill/cert structured data
│   │   └── resume.md
│   ├── assets/                # Static images
│   ├── index.css              # Tailwind + OKLCH design tokens
│   ├── main.tsx               # Entry point
│   └── App.tsx                # BrowserRouter + routes
├── knowledge/                 # Documentation
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig*.json
```

## Key Conventions

- **Components:** PascalCase `.tsx` files in `src/components/`
- **Pages:** PascalCase `.tsx` files in `src/pages/`
- **Content:** Markdown with YAML frontmatter in `src/content/`
- **UI Primitives:** shadcn/ui pattern in `src/components/ui/`
- **Icons:** Phosphor Icons (`@phosphor-icons/react`)
- **Styling:** Tailwind CSS 4 with OKLCH design tokens in `index.css`
