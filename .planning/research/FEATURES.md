# Feature Landscape

**Domain:** Personal developer portfolio website upgrade
**Researched:** 2026-08-01
**Overall confidence:** MEDIUM (ecosystem patterns are well-established; specific design recommendations are opinionated)

## Table Stakes

Features users expect from a polished developer portfolio. Missing any of these makes the site feel like a template or incomplete project.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Warm light theme with cohesive design tokens | User explicitly requested this; current OKLCH tokens use cold neutral grays at hue 280 that read as sterile/default. Without warmer tones, the site still looks like a shadcn/ui starter. | Medium | Replace `:root` OKLCH tokens: background should shift to cream/warm-white range, foreground to warm dark brown, primary accent to a warm copper/terracotta. Affects all sections. Dark mode tokens also need warming. Must maintain WCAG AA contrast (4.5:1+). |
| Resume/CV page at `/resume` | Developer portfolios are expected to have a shareable resume. Recruiters will search for `/resume` or `/cv` on any portfolio URL. | Medium | New route + new page component. Requires: professional layout, responsive to single-column, `@media print` stylesheet (hide nav/footer, force white background, simplify to paper-friendly), `window.print()` button. Data source: markdown with YAML frontmatter (consistent with existing pattern). |
| Real content in all sections | Placeholder text screams "template." A portfolio without real data is worse than no portfolio at all. | Low (content) / Medium (images) | User provides: bio text, project descriptions, skill list, certificate list. Requires project screenshots in `public/images/projects/`. Depends on user input, not code. |
| Professional profile photo treatment | Headshot/avatar is a baseline signal of a real person. Already partially exists (profile.jpg in hero) but could be better integrated. | Low | Photo already added. Polish: ensure consistent sizing, proper alt text, warm ring/border treatment matching new palette. |
| Responsive design polish | Recruiters browse on phones. Broken layouts lose candidates immediately. | Low | Most responsiveness exists via Tailwind. Audit for: header on small screens, project cards stacking, contact form usability on mobile, resume page readability on 320px+ widths. |
| Functional contact form with anti-spam | Contact forms are table stakes for any professional site. Without anti-spam, the form becomes a liability. | Low | Form exists with EmailJS. Needs: honeypot hidden field (CSS-hidden input bots fill but humans do not), client-side cooldown (disable form for 30s after submit), cleanup of `setTimeout` on unmount (CONCERNS.md bug). |
| Clean, intentional navigation | Users need to know where they are and where to go. Scroll-spy already exists but needs refinement with new sections. | Low | Existing scroll-spy works. Add `/resume` link to nav. Ensure nav styling matches warm theme. |

## Differentiators

Features that make this portfolio feel personal and memorable. Not universally expected, but they elevate the experience.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| 3D tilt/shake effect on profile image | The hero image is the first thing visitors see. A subtle mouse-tracking tilt effect makes it feel alive and signals technical skill. User explicitly requested this. | Medium | Use `vanilla-tilt.js` (lightweight, no React wrapper needed) or CSS `perspective` + `onMouseMove` handler. Keep rotation to 5-15 degrees max. Must respect `prefers-reduced-motion`. Add subtle glow/shadow that shifts with tilt angle. |
| Scroll-triggered section reveal animations | Animations that fire as sections enter viewport create a sense of discovery and polish. Partially exists (fade-up keyframe) but only in hero. | Low-Medium | Extend existing `animate-fade-up` pattern to all sections. Consider adding slide-in from left/right variants. Use `IntersectionObserver` (already used by `useScrollSpy`) or a lightweight `react-intersection-observer`. Stagger children within each section. |
| Warm, cohesive color palette with intentional shadows/spacing | A unified warm palette across every element (not just background) signals design craft. Goes beyond swapping CSS variables to include shadow warmth, border warmth, and consistent spacing rhythm. | Medium | Beyond token changes: warm-toned shadows (`rgba(180, 150, 120, 0.1)` instead of `rgba(0,0,0,...)`), warm borders, consistent spacing scale (multiples of 4px or 8px). Consider subtle paper/grain texture overlay. |
| Project case studies (not just cards) | 3-4 projects with brief narrative (problem, approach, result) outperform 20 project cards with no context. Shows thinking, not just output. | Medium | Expand project cards to include: 1-2 sentence problem statement, key technologies used (as tags), result/outcome. Requires user-provided content. Project images needed in `public/images/projects/`. |
| Interactive project cards with hover effects | Hover states on project cards (image zoom, overlay, scale, color shift) signal attention to detail. | Low | CSS-only: `group-hover` for image scale (1.0 -> 1.05), subtle overlay with project summary on hover. Tailwind `transition-all duration-300` pattern. |
| Dark mode with smooth transition | The existing toggle works but the color switch is jarring. A 300ms CSS transition on all color properties creates a polished feel. | Low | Add `transition: background-color 300ms, color 300ms` to `html` and key elements. Requires careful testing to avoid flickering on page load (existing localStorage persistence helps). |
| SEO and Open Graph meta tags | Without these, shared links on LinkedIn/Twitter show generic previews. A portfolio shared with a recruiter should show a professional preview. | Low | Add `<meta>` tags in `index.html`: description, og:title, og:description, og:image, twitter:card. Use a profile photo or site screenshot as og:image. Consider react-helmet-async for dynamic meta on /resume route. |
| Print-optimized resume with one-click download | A "Download PDF" button that triggers `window.print()` with a clean print stylesheet is more user-friendly than telling people to use Ctrl+P. | Low | Add visible "Download PDF" button on /resume page. `@media print` rules: hide nav/header/footer, force white background, single column, proper margins via `@page`, `break-inside: avoid` on sections. Link URLs shown in parentheses for printed version. |

## Anti-Features

Features to explicitly NOT build. These are either out of scope, add unnecessary complexity, or would detract from the portfolio's focus.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Blog section | Requires ongoing content creation and maintenance. User explicitly deferred to v2. The markdown architecture makes it easy to add later. | Add in a future milestone when content strategy is clear. Existing `react-markdown` + frontmatter pattern is ready for it. |
| Testimonials section | Needs real quotes from real people. Placeholder testimonials look worse than having no section at all. | Skip entirely for now. Can add when user has actual testimonials to include. |
| Full 3D scene with Three.js/WebGL | Massive bundle size increase (Three.js is ~600KB minified). Overkill for a profile photo effect. The 3D tilt effect achieves 90% of the visual impact at 1% of the weight. | Use CSS perspective transforms + vanilla-tilt.js or Framer Motion for the tilt effect. No 3D libraries. |
| Multi-page navigation for main site | Splitting into /about, /projects, /skills etc. fragments the single-scroll experience and breaks existing scroll-spy. | Keep single-scroll architecture. Only `/resume` is a separate route (required because it serves a different purpose: ATS-friendly document). |
| CMS or admin dashboard | Over-engineered for a personal site where content changes infrequently. Adds authentication, database, deployment complexity. | Author content as markdown files in `src/content/`. This is the existing pattern and works well. |
| Chat widget / AI assistant | Distracts from portfolio content. Adds third-party dependency, privacy concerns, and ongoing cost. Recruiters want to see your work, not chat with a bot. | Keep contact form as the communication channel. It is simpler and more professional. |
| Analytics dashboard or visitor metrics display | Recruiters do not care about your page views. Internal analytics (simple Vercel Analytics or Plausible) are fine but should never be displayed to visitors. | Add lightweight analytics for personal use only. Never surface metrics to visitors. |
| Authentication / user accounts | Static portfolio has no concept of users. Auth adds complexity for zero value. | N/A -- not applicable to this project type. |
| Complex page transitions (GSAP/React Spring full-page) | Full-screen transition animations between routes are impressive but distracting for a portfolio. They add complexity and can confuse users navigating with browser back/forward. | Use simple fade transitions only if needed. The main site is single-page; only /resume is a new route, and a direct load is fine there. |
| Social proof counters ("X years experience", "Y projects delivered") | These often feel inflated or meaningless. "5 years of experience" tells a recruiter nothing; a well-documented project does. | Let the work speak for itself through project case studies and skills section. |

## Feature Dependencies

```
Warm theme tokens ──────────────> All section styling (everything depends on this)
                                > Dark mode refinement
                                > Print stylesheet (resume uses light palette)

Profile photo (exists) ─────────> 3D tilt effect (needs the image to exist)

Project images ─────────────────> Project case studies (need visuals before expanding content)

Resume markdown data ───────────> Resume page rendering
                                > Print stylesheet (data drives both views)

Honeypot field ─────────────────> Contact form anti-spam (one field addition)
Cooldown timer ─────────────────> Contact form anti-spam (independent)

Scroll observer (exists) ───────> Section reveal animations (reuse IntersectionObserver)

Real user content ──────────────> Everything meaningful (portfolio is content-driven)
```

## MVP Recommendation

**Prioritize (Phase 1 -- Foundation):**
1. Warm light theme tokens in `index.css` -- this is the foundation that everything else builds on
2. Resume page with print stylesheet -- the primary new feature the user requested
3. Real content population -- user provides data, we structure it

**Then (Phase 2 -- Polish):**
4. 3D tilt effect on hero profile image -- the requested "wow" factor
5. Scroll-triggered section animations -- extends existing fade-up to all sections
6. Contact form hardening (honeypot + cooldown + setTimeout fix)

**Finally (Phase 3 -- Refinement):**
7. Project case studies with images
8. SEO/OG meta tags
9. 404 page for invalid routes
10. Typography refinement (if warm palette alone is insufficient)

**Defer:**
- Blog: architecture is ready, content strategy needed first
- Testimonials: need real quotes
- Any feature requiring third-party service integration beyond existing EmailJS

## Feature-to-Section Mapping

| Portfolio Section | Table Stakes Features | Differentiator Features |
|-------------------|----------------------|------------------------|
| **Hero** | Warm theme tokens, real name/title from content | 3D tilt on profile photo, staggered entrance animation, animated gradient text |
| **About** | Real bio content, warm theme styling | Scroll-reveal animation, optional timeline of career milestones |
| **Projects** | Real project data, images in `public/images/projects/` | Project case studies (narrative), hover effects on cards, tech tags |
| **Skills** | Real skill list from user | Staggered skill tag animations, visual grouping by category |
| **Certificates** | Real certificate data (migrate from hardcoded to markdown) | Badge-style icons (already partially implemented), hover effects |
| **Contact** | Honeypot anti-spam, cooldown, setTimeout fix | Availability notice ("respond within 48h"), warm-themed form styling |
| **Resume** (new) | `/resume` route, print stylesheet, download button | ATS-friendly semantic HTML, JSON-LD structured data, one-click PDF |
| **Header/Nav** | Add `/resume` link, warm theme | Smooth dark mode toggle transition |
| **Footer** | Warm theme, real copyright year | Minimal -- do not over-design the footer |

## Sources

- Awwwards portfolio category taxonomy and tag analysis (awwwards.com/websites/portfolio/)
- Web search synthesis on developer portfolio table stakes and differentiators
- Web search synthesis on resume page patterns (print stylesheet, PDF generation)
- Web search synthesis on warm color palette design for web (WCAG contrast ratios, OKLCH values)
- Web search synthesis on contact form best practices (honeypot anti-spam, success states)
- Web search synthesis on hero section 3D tilt implementation (vanilla-tilt.js, Framer Motion, CSS perspective)
- Web search synthesis on portfolio micro-interactions (scroll reveals, hover states, animations)
- Analysis of existing codebase: `src/index.css` (design tokens), `src/components/HeroSection.tsx`, `src/components/ContactSection.tsx`, `src/App.tsx`
- CONCERNS.md: known bugs (setTimeout, missing project images, hardcoded certificates)
- PROJECT.md: validated requirements, out-of-scope decisions, constraints
