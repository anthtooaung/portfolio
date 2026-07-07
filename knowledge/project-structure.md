# Project Structure

## Root Directory
```
portfolio/
├── public/              # Static assets
│   ├── index.html
│   └── favicon.ico
├── src/                 # Source code
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components
│   ├── assets/          # Images, fonts, etc.
│   ├── styles/          # Global styles
│   ├── data/            # Project data (JSON/JS)
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   └── utils/           # Utility functions
├── knowledge/           # Documentation
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Folder Descriptions

### `/public`
- Contains static files served directly
- `index.html`: Main HTML template
- `favicon.ico`: Browser tab icon

### `/src`
Main source code directory.

#### `/src/components`
Reusable UI components that can be used across multiple pages.
- `Header.jsx` - Site header/navigation
- `Footer.jsx` - Site footer
- `ProjectCard.jsx` - Individual project display
- `SkillBadge.jsx` - Technology/skill badge
- `ContactForm.jsx` - Contact form component

#### `/src/pages`
Page-level components for different routes.
- `Home.jsx` - Landing/home page
- `Projects.jsx` - Projects listing page
- `About.jsx` - About me page
- `Contact.jsx` - Contact page

#### `/src/assets`
Static assets like images, fonts, and icons.
- `images/` - Project screenshots, profile photos
- `fonts/` - Custom fonts (if any)
- `icons/` - SVG icons

#### `/src/styles`
Global styles and Tailwind configuration.
- `globals.css` - Global CSS rules
- `tailwind.css` - Tailwind directives

#### `/src/data`
Project data stored in JavaScript/JSON files.
- `projects.js` - Array of project objects
- `skills.js` - Skills/technologies data

#### `/src/context`
React context providers for state management.
- `ThemeContext.jsx` - Theme/dark mode context

#### `/src/hooks`
Custom React hooks for reusable logic.
- `useLocalStorage.js` - Local storage hook
- `useMediaQuery.js` - Responsive breakpoint hook

#### `/src/utils`
Utility/helper functions.
- `helpers.js` - General utility functions
- `formatters.js` - Data formatting functions

## File Naming Conventions
- Components: PascalCase (e.g., `ProjectCard.jsx`)
- Pages: PascalCase (e.g., `Home.jsx`)
- Utilities: camelCase (e.g., `helpers.js`)
- Styles: kebab-case (e.g., `globals.css`)
