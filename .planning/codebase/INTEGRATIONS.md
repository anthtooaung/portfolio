# External Integrations

**Analysis Date:** 2026-08-01

## APIs & External Services

**Email Service:**
- EmailJS - Contact form email delivery (sends emails directly from the browser)
  - SDK/Client: `@emailjs/browser` ^4.4.1
  - Implementation: `src/components/ContactSection.tsx` (lines 60-69)
  - Auth: Three env vars — `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`
  - Template variables sent: `from_name`, `from_email`, `message`
  - Note: EmailJS provides a browser-side email service with no backend required. The public key is exposed client-side by design.

**Social Platforms (linked, not integrated):**
- GitHub — Profile link displayed in contact section
- LinkedIn — Profile link displayed in contact section
- Twitter — Profile link displayed in contact section
- Icon mapping: `src/components/ContactSection.tsx` (lines 19-23) maps platform names to Phosphor icons
- Social data sourced from markdown frontmatter: `src/content/home/contact.md`

## Data Storage

**Databases:**
- None detected. All content is sourced from local markdown files.

**File Storage:**
- Local filesystem only — Static assets in `src/assets/` and `public/`
- Content stored as markdown files in `src/content/`:
  - `src/content/home/hero.md`
  - `src/content/home/about.md`
  - `src/content/home/skills.md`
  - `src/content/home/contact.md`
  - `src/content/projects/portfolio.md`
  - `src/content/projects/dashboard.md`
- Content is loaded at build time via Vite raw imports (`?raw` suffix) in `src/lib/markdown.ts`
- A custom YAML frontmatter parser extracts metadata from markdown files (no external parser dependency)

**Caching:**
- None detected

## Authentication & Identity

**Auth Provider:**
- None detected. No authentication system is implemented.

## Content Management

**Approach:**
- Static markdown files with YAML frontmatter, imported at build time via Vite's `?raw` query parameter
- Custom parser in `src/lib/markdown.ts` handles frontmatter extraction without external dependencies
- `getSection(path)` retrieves individual sections by content path (e.g., `'home/hero.md'`)
- `getProjects()` retrieves all project files sorted by date (newest first)
- No CMS, headless API, or dynamic content backend

**Limitations:**
- Adding new content requires editing markdown files and redeploying
- Content structure is hard-coded in `src/lib/markdown.ts` (individual imports, not dynamic glob)

## Monitoring & Observability

**Error Tracking:**
- None detected (no Sentry, LogRocket, or similar)

**Logs:**
- `console.error` for EmailJS failures (`src/components/ContactSection.tsx` line 78)
- `console.error` for missing config (`src/components/ContactSection.tsx` line 55)

## CI/CD & Deployment

**Hosting:**
- Not configured. No deployment pipeline, Vercel/Netlify config, or GitHub Actions workflow detected.

**CI Pipeline:**
- None detected. No `.github/workflows/` directory or CI configuration files found.

## Environment Configuration

**Required env vars:**
- `VITE_EMAILJS_SERVICE_ID` — EmailJS service ID
- `VITE_EMAILJS_TEMPLATE_ID` — EmailJS template ID
- `VITE_EMAILJS_PUBLIC_KEY` — EmailJS public key

**Optional env vars:**
- None

**Secrets location:**
- `.env` file (gitignored — see `.gitignore`)
- `.env.example` documents the required variables with placeholder values
- All three EmailJS values are `VITE_` prefixed, meaning they are bundled into the client-side code (intentional for EmailJS browser SDK)

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- EmailJS API call — `emailjs.send()` from `src/components/ContactSection.tsx`
  - Triggered on contact form submission
  - Sends to EmailJS cloud endpoint (URL handled by the SDK)
  - Payload: `{ from_name, from_email, message }`

## Future Integrations (Planned but Not Implemented)

Based on `knowledge/` documentation:
- No additional integrations are documented as planned beyond the current EmailJS setup.

---

*Integration audit: 2026-08-01*
