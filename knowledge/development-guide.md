# Development Guide

## Prerequisites
- Node.js (v18 or higher)
- npm package manager
- Git

## Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd portfolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Development Workflow

### Adding a New Project
1. Create a new markdown file in `src/content/projects/`
2. Add YAML frontmatter (title, date, description, tags, image, etc.)
3. Import the file in `src/lib/markdown.ts` and add to the `modules` map

### Adding a New Skill/Certificate
1. Edit `src/content/certificates.json`
2. Add certificate entries with `title`, `skill`, `pdf` path
3. Skills are auto-derived from certificate data via `src/lib/certs.ts`

### Creating a New Component
1. Create file in `src/components/` (use PascalCase)
2. Follow shadcn/ui pattern for UI primitives (CVA variants)
3. Import in parent component

### Adding a New Page
1. Create file in `src/pages/`
2. Add route in `src/App.tsx` inside the `DefaultLayout` route

### Adding Markdown Content
1. Create `.md` file with YAML frontmatter in `src/content/`
2. Import with `?raw` suffix in `src/lib/markdown.ts`
3. Add to the `modules` record with key `./content/<path>`
4. Call `getSection('<path>')` from your component

## Code Style Guidelines

### TypeScript/React
- Use functional components with hooks
- Use TypeScript for all files
- Destructure props in function parameters

### CSS/Tailwind
- Use Tailwind utility classes
- Mobile-first responsive design
- OKLCH design tokens defined in `index.css`
- Dark-only theme (no light mode toggle)

## Git Workflow

### Branch Naming
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `update/update-description` - Updates

### Commit Messages
Use conventional commits:
- `feat: add new project card component`
- `fix: resolve contact form validation`
- `update: improve responsive layout`
- `docs: add development guide`

## Building for Production
```bash
npm run build
```
Output will be in `/dist` folder.

## Deployment
The portfolio can be deployed to:
- Vercel (recommended for Vite)
- Netlify
- GitHub Pages

## Troubleshooting

### Port already in use
```bash
npx kill-port 5173
npm run dev
```

### Dependencies not installing
```bash
rm -rf node_modules package-lock.json
npm install
```
