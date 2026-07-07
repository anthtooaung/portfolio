# Development Guide

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
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
# or
yarn install
```

### 3. Start Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

## Development Workflow

### Adding a New Project
1. Open `/src/data/projects.js`
2. Add a new project object to the array:
```javascript
{
  id: 4,
  title: "Project Name",
  description: "Brief description",
  image: "/images/projects/project4.png",
  technologies: ["React", "Node.js"],
  github: "https://github.com/username/repo",
  live: "https://project-url.com",
  featured: true
}
```
3. Add project screenshot to `/public/images/projects/`

### Adding a New Skill
1. Open `/src/data/skills.js`
2. Add skill to appropriate category:
```javascript
{
  name: "Technology",
  icon: "icon-name",
  level: "intermediate"
}
```

### Creating a New Component
1. Create file in `/src/components/`
2. Use PascalCase naming: `NewComponent.jsx`
3. Import in parent component

### Adding a New Page
1. Create file in `/src/pages/`
2. Add route in `App.jsx`

## Code Style Guidelines

### JavaScript/JSX
- Use functional components with hooks
- Destructure props in function parameters
- Use meaningful variable names
- Keep components small and focused

### CSS/Tailwind
- Use Tailwind utility classes
- Mobile-first responsive design
- Use custom CSS only when necessary

## Git Workflow

### Branch Naming
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `update/update-description` - Updates to existing code

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

### Common Issues

**Port already in use:**
```bash
npx kill-port 5173
npm run dev
```

**Dependencies not installing:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build errors:**
- Check for syntax errors
- Verify all imports are correct
- Ensure all dependencies are installed
