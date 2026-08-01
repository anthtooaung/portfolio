# Testing Patterns

**Analysis Date:** 2026-08-01

## Test Framework

**Runner:**
- **Not installed.** No test framework, no test runner, no test configuration file exists in this project.
- No `*.test.*`, `*.spec.*`, or `*.stories.*` files exist anywhere in the codebase.
- No test dependencies in `devDependencies` (`vitest`, `jest`, `@testing-library/react`, `playwright`, etc. are all absent from `package.json`).
- The `knowledge/development-guide.md` mentions `npm run format` as a script, but no `format` script exists in `package.json`. Similarly, no `test` script is defined.

**Run Commands:**
```bash
# No commands available. All of the following need to be set up first:
npm run build    # TypeScript compilation (tsc -b) is the only quality gate
npm run lint     # ESLint is the only code quality check
```

**Available quality gates (non-test):**
```bash
npm run build    # tsc -b (strict type checking) + vite build — catches type errors
npm run lint     # ESLint with react-hooks, react-refresh, typescript-eslint — catches runtime bugs and best-practice violations
```

## Recommended Test Framework Setup

Given this stack (Vite 8, React 19, TypeScript 6, Tailwind CSS 4), Vitest + React Testing Library is the natural choice.

**Install:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

**Add to `package.json` scripts:**
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

**Create `vitest.config.ts`** at the project root:
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

**Create `src/test/setup.ts`:**
```ts
import '@testing-library/jest-dom/vitest'
```

## Test File Organization

**Recommended location (co-located):** Place test files next to their source files following the `<name>.test.tsx` convention.

**Expected structure:**
```
src/
├── components/
│   ├── HeroSection.tsx
│   ├── HeroSection.test.tsx    # Unit tests for HeroSection
│   └── ui/
│       ├── button.tsx
│       └── button.test.tsx     # Unit tests for Button
├── hooks/
│   ├── useScrollSpy.ts
│   └── useScrollSpy.test.ts    # Unit tests for hook
├── lib/
│   ├── markdown.ts
│   ├── markdown.test.ts        # Unit tests for parser
│   ├── utils.ts
│   └── utils.test.ts           # Unit tests for cn()
└── test/
    └── setup.ts                # Global test setup
```

## Test Structure

**Suite organization — follow this pattern:**
```tsx
import { render, screen } from '@testing-library/react'
import { HeroSection } from './HeroSection'

// Mock the markdown data source
vi.mock('@/lib/markdown', () => ({
  getSection: vi.fn().mockReturnValue({
    meta: {
      title: 'Hello',
      subtitle: 'Full-Stack Developer',
      cta: 'View My Work',
      ctaLink: '#projects',
    },
    content: '',
  }),
}))

describe('HeroSection', () => {
  it('renders the title from markdown data', () => {
    render(<HeroSection />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('renders subtitle when present', () => {
    render(<HeroSection />)
    expect(screen.getByText('Full-Stack Developer')).toBeInTheDocument()
  })

  it('returns null when section data is missing', async () => {
    const { getSection } = await import('@/lib/markdown')
    vi.mocked(getSection).mockReturnValue(null)
    const { container } = render(<HeroSection />)
    expect(container.firstChild).toBeNull()
  })
})
```

**Patterns:**
- Use `vi.mock()` at the top level of the test file (not `beforeEach`)
- Use `vi.mocked()` for typing mocked functions
- Test both the happy path and the guard-clause null-return path (every section component returns `null` on missing data)
- Group related assertions in `describe` blocks when multiple behaviors exist

## Mocking

**Framework:** Vitest built-in `vi.mock()`

**Patterns:**
```tsx
// Mocking the markdown data layer (most common mock need)
vi.mock('@/lib/markdown', () => ({
  getSection: vi.fn().mockReturnValue({ meta: {}, content: '' }),
  getProjects: vi.fn().mockReturnValue([]),
}))

// Mocking a hook
vi.mock('@/hooks/useScrollSpy', () => ({
  useScrollSpy: vi.fn().mockReturnValue('home'),
}))

// Mocking env variables
vi.stubEnv('VITE_EMAILJS_SERVICE_ID', 'test-service-id')
vi.stubEnv('VITE_EMAILJS_TEMPLATE_ID', 'test-template-id')
vi.stubEnv('VITE_EMAILJS_PUBLIC_KEY', 'test-public-key')

// Mocking an external module (EmailJS)
vi.mock('@emailjs/browser', () => ({
  default: {
    send: vi.fn().mockResolvedValue({ status: 200 }),
  },
}))
```

**What to Mock:**
- `@/lib/markdown` (getSection, getProjects) — this is the data source for all section components
- `@emailjs/browser` — external service calls
- `window.matchMedia`, `localStorage` — for theme toggle tests in Header
- Environment variables via `vi.stubEnv()` — for EmailJS config checks

**What NOT to Mock:**
- React, react-dom, react-router-dom — test the real behavior
- Tailwind CSS classes — not testable at unit level; use E2E/visual regression for style verification
- shadcn/ui primitives (`@/components/ui/*`) — test the real components; they are simple wrappers

## Fixtures and Factories

**Test Data:**
```ts
// A shared fixture for section data (create at src/test/fixtures/section-data.ts)
export const mockHeroData = {
  meta: { title: 'Hello', subtitle: 'Full-Stack Developer', cta: 'View My Work', ctaLink: '#projects' },
  content: '',
}

export const mockProjectData = {
  meta: {
    title: 'Test Project',
    tags: ['React', 'TypeScript'],
    date: '2026-07-01',
    featured: true,
    image: '/test-image.png',
    repo: 'https://github.com/test/repo',
  },
  content: 'Test project description.',
  slug: 'test-project',
}

export const mockContactData = {
  meta: {
    title: 'Get In Touch',
    email: 'hello@test.dev',
    socials: [{ name: 'GitHub', url: 'https://github.com/test' }],
  },
  content: 'Test content.',
}
```

**Location:** Create `src/test/fixtures/` directory for shared test data.

## Coverage

**Requirements:** None enforced. No coverage tooling is installed.

**View Coverage (after Vitest setup):**
```bash
npm run test:coverage
```

**Recommended thresholds to set in `vitest.config.ts`:**
```ts
coverage: {
  provider: 'v8',
  thresholds: {
    lines: 70,
    functions: 70,
    branches: 60,
    statements: 70,
  },
}
```

## Test Types

**Unit Tests:**
- Scope: Individual components, hooks, and utility functions in isolation
- Focus: `src/lib/markdown.ts` (frontmatter parser), `src/lib/utils.ts` (cn utility), `src/hooks/useScrollSpy.ts`, individual section components
- Priority: Start with `markdown.ts` parser (most logic-dense, 165 lines, pure functions), then section components' guard clauses, then the contact form validation flow

**Integration Tests:**
- Scope: Page-level rendering with routing (App.tsx wraps Home in BrowserRouter)
- Focus: `src/pages/Home.tsx` renders all sections; `src/components/ContactSection.tsx` form submission flow with mocked EmailJS
- Approach: Use `MemoryRouter` from react-router-dom for route isolation

**E2E Tests:**
- **Not used.** If added later, Playwright is recommended for Vite projects.
- Priority areas for E2E: dark mode toggle persistence (localStorage), contact form submission, mobile nav open/close, smooth scroll navigation.

## What to Test (Priority Order)

**Priority 1 — Logic-heavy:**
1. `src/lib/markdown.ts` — `parseFrontmatter`, `getSection`, `getProjects` (pure functions, many edge cases: missing frontmatter, empty files, date sorting, slug extraction)
2. `src/lib/utils.ts` — `cn()` function (class merging behavior)
3. `src/hooks/useScrollSpy.ts` — IntersectionObserver setup, cleanup, id tracking

**Priority 2 — Component guard clauses:**
4. Each section component's `return null` path when `getSection()` returns `null`
5. `FeaturedProjects` returning `null` when no projects match the `featured` filter
6. `ContactSection` displaying error state when EmailJS env vars are missing

**Priority 3 — User interaction:**
7. Contact form validation messages (name too short, invalid email, message too short)
8. Header dark mode toggle (adds/removes `.dark` class on `<html>`)
9. Mobile nav open/close toggle
10. Smooth scroll navigation on nav link click

---

*Testing analysis: 2026-08-01*
