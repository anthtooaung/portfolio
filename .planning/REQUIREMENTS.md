# Requirements: Mr.Ant's Portfolio — Personal Website Upgrade

**Defined:** 2026-08-01
**Core Value:** The site must feel like mine — not a template. Warmer colors, real content, a distinctive hero section with motion, and a professional resume page I can share with employers.

## v1 Requirements

### Theme

- [ ] **THME-01**: Shift light-mode OKLCH tokens from hue 280 (violet) to hue 50-80 (warm amber/cream)
- [ ] **THME-02**: Update `.dark` tokens in lockstep with light-mode to prevent jarring theme toggle
- [ ] **THME-03**: Refactor hero gradient utility to read from `var(--primary)` instead of hardcoded violet
- [ ] **THME-04**: Verify WCAG AA contrast ratios (4.5:1 minimum) on all new token values

### Routing

- [ ] **ROUT-01**: Add `/resume` route with conditional chrome (Header/Footer hidden on resume page)
- [ ] **ROUT-02**: Header "Resume" link navigates to `/resume` via router Link (not hash link)
- [ ] **ROUT-03**: Add ScrollToTop component to handle route transitions
- [ ] **ROUT-04**: Disable scroll-spy when not on `/`

### Resume

- [ ] **RESM-01**: `/resume` page with sections: Profile, Experience, Education, Skills, Certificates
- [ ] **RESM-02**: Resume data stored as markdown with YAML frontmatter in `src/content/resume/resume.md`
- [ ] **RESM-03**: `useResume` hook parses data via existing markdown pipeline
- [ ] **RESM-04**: `@media print` stylesheet: hide nav/footer, force white bg, single-column, A4 page size
- [ ] **RESM-05**: "Print Resume" button triggering `window.print()`
- [ ] **RESM-06**: Install shadcn/ui Card, Badge, Separator components for resume layout

### Animations

- [ ] **ANIM-01**: 3D tilt effect on hero profile image (pointer-tracking CSS perspective)
- [ ] **ANIM-02**: Respect `prefers-reduced-motion` and `pointer: coarse` for tilt
- [ ] **ANIM-03**: Scroll-triggered section reveal animations (extend existing `animate-fade-up`)
- [ ] **ANIM-04**: Dark mode smooth transition (300ms CSS transition on color properties)

### Content

- [ ] **CNTN-01**: User-provided real content for all sections (bio, projects, skills, certificates)
- [ ] **CNTN-02**: Migrate hardcoded certificate data from CertificatesSection.tsx to markdown frontmatter

### Contact

- [ ] **CONT-01**: Add honeypot field to contact form for anti-spam
- [ ] **CONT-02**: Add client-side cooldown (30s) after successful form submission
- [ ] **CONT-03**: Fix setTimeout cleanup in ContactSection to prevent state update after unmount

### Cleanup

- [ ] **CLNP-01**: Add error boundary around section components to prevent white-screen crashes
- [ ] **CLNP-02**: Remove unused dependencies (zustand, @tanstack/react-query, lucide-react)
- [ ] **CLNP-03**: Convert CertificatesSection inline `<style>` tag to Tailwind utilities
- [ ] **CLNP-04**: Add SEO/OG meta tags to index.html

## v2 Requirements

### Blog

- **BLOG-01**: Blog section with markdown-authored posts
- **BLOG-02**: Post list page and individual post page (`/blog/:slug`)
- **BLOG-03**: SEO metadata per post

### Testimonials

- **TEST-01**: Testimonials section with quotes from colleagues/clients
- **TEST-02**: Carousel or stacked layout for testimonial display

### Experience Timeline

- **EXP-01**: Work history timeline section with role, company, dates, descriptions
- **EXP-02**: Visual timeline connector between entries

## Out of Scope

| Feature | Reason |
|---------|--------|
| Blog | Architecture ready but content strategy needed; easy to add later via markdown pipeline |
| Testimonials | Needs real quotes from real people; premature without actual references |
| Experience timeline | Separate from resume page; user chose to handle work history in the /resume route |
| CMS / admin dashboard | Content is markdown in repo; admin UI over-engineered for infrequent updates |
| Chat widget / AI assistant | Distracts from portfolio content; not core value |
| Complex page transitions (GSAP/React Spring) | Main site is single-page; overkill for this scope |
| OAuth / authentication | Static portfolio; no user accounts needed |
| Multi-page navigation for main site | User chose single-scroll + separate /resume route |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| THME-01 | Phase 1 | Pending |
| THME-02 | Phase 1 | Pending |
| THME-03 | Phase 1 | Pending |
| THME-04 | Phase 1 | Pending |
| ROUT-01 | Phase 1 | Pending |
| ROUT-02 | Phase 1 | Pending |
| ROUT-03 | Phase 1 | Pending |
| ROUT-04 | Phase 1 | Pending |
| RESM-01 | Phase 2 | Pending |
| RESM-02 | Phase 2 | Pending |
| RESM-03 | Phase 2 | Pending |
| RESM-04 | Phase 2 | Pending |
| RESM-05 | Phase 2 | Pending |
| RESM-06 | Phase 2 | Pending |
| ANIM-01 | Phase 3 | Pending |
| ANIM-02 | Phase 3 | Pending |
| ANIM-03 | Phase 3 | Pending |
| ANIM-04 | Phase 3 | Pending |
| CNTN-01 | Phase 3 | Pending |
| CNTN-02 | Phase 3 | Pending |
| CONT-01 | Phase 4 | Pending |
| CONT-02 | Phase 4 | Pending |
| CONT-03 | Phase 4 | Pending |
| CLNP-01 | Phase 4 | Pending |
| CLNP-02 | Phase 4 | Pending |
| CLNP-03 | Phase 4 | Pending |
| CLNP-04 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 27 total
- Mapped to phases: 27
- Unmapped: 0 ✓

---
*Requirements defined: 2026-08-01*
*Last updated: 2026-08-01 after roadmap creation*
