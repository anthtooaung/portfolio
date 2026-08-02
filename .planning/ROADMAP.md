# Roadmap: Mr.Ant's Portfolio — Personal Website Upgrade

## Overview

Four-phase upgrade that transforms a functional prototype into a polished, personal-feeling developer portfolio. Phase 1 lays the warm visual foundation and route skeleton. Phase 2 delivers the resume/CV page with print-to-PDF capability. Phase 3 adds the 3D tilt hero effect and populates all sections with real content. Phase 4 hardens the contact form, adds scroll animations, and cleans up technical debt.

## Phases

- [ ] **Phase 1: Warm Theme + Route Skeleton** - Shift light/dark OKLCH tokens to warm amber/cream palette; add `/resume` route with conditional chrome
- [ ] **Phase 2: Resume Page + Print** - Build the `/resume` page from markdown data with a print-optimized stylesheet and one-click PDF download
- [ ] **Phase 3: Hero Tilt + Content Population** - Add 3D tilt effect on hero profile image; populate all sections with real content
- [ ] **Phase 4: Polish + Contact Hardening + Cleanup** - Scroll animations, dark mode transition, contact anti-spam, error boundaries, dependency cleanup

## Phase Details

### Phase 1: Warm Theme + Route Skeleton
**Goal**: Users experience a warm, inviting color palette and can navigate to the resume page
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: THME-01, THME-02, THME-03, THME-04, ROUT-01, ROUT-02, ROUT-03, ROUT-04
**Success Criteria** (what must be TRUE):
  1. Site displays warm cream/amber tones in light mode and complementary warm dark tones in dark mode
  2. Toggling between light and dark mode produces no jarring hue flash
  3. Clicking "Resume" in the header navigates to `/resume` with Header and Footer hidden
  4. Navigating to `/resume` from `/` scrolls to the top of the resume page
  5. Scroll-spy navigation does not activate or throw errors on the `/resume` page

**Wave 1**
- **Plan 01: Warm Theme Foundation** — Update design tokens to oklch amber/gold, refactor gradient to primary stop
- **Plan 02: Route Skeleton and Conditional Chrome** — Configure routes, DefaultLayout, ScrollToTop, and Header resume link

**Cross-cutting constraints:**
- None (independent slices executing in wave 1)

### Phase 2: Resume Page + Print
**Goal**: Users can view a professional resume page and print it as a PDF with one click
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: RESM-01, RESM-02, RESM-03, RESM-04, RESM-05, RESM-06
**Success Criteria** (what must be TRUE):
  1. `/resume` page renders Profile, Experience, Education, Skills, and Certificates sections from markdown data
  2. Resume page uses Card, Badge, and Separator components for a clean, professional layout
  3. Clicking "Print Resume" triggers browser print dialog with a clean single-column A4 layout
  4. Printed output hides navigation/footer, forces white background, and preserves text colors
**Plans**: TBD

### Phase 3: Hero Tilt + Content Population
**Goal**: The hero section feels alive with motion and all sections display real, meaningful content
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: ANIM-01, ANIM-02, ANIM-03, ANIM-04, CNTN-01, CNTN-02
**Success Criteria** (what must be TRUE):
  1. Moving the mouse over the hero profile image produces a 3D tilt effect that tracks the pointer
  2. On touch devices or when `prefers-reduced-motion` is set, the tilt effect is disabled
  3. All sections (About, Projects, Skills, Certificates) display real user-provided content instead of placeholders
  4. Certificate data is sourced from markdown files, not hardcoded in component files
  5. Dark mode toggle transitions smoothly over ~300ms without a flash of wrong colors
**Plans**: TBD

### Phase 4: Polish + Contact Hardening + Cleanup
**Goal**: The site is production-ready with hardened forms, smooth animations, error resilience, and clean code
**Mode:** mvp
**Depends on**: Phase 3
**Requirements**: CONT-01, CONT-02, CONT-03, CLNP-01, CLNP-02, CLNP-03, CLNP-04
**Success Criteria** (what must be TRUE):
  1. Contact form spam submissions are blocked by a hidden honeypot field
  2. After a successful form submission, the submit button is disabled for 30 seconds
  3. Sections that fail to render show a fallback instead of crashing the entire page
  4. Unused packages (zustand, @tanstack/react-query, lucide-react) are not present in `node_modules`
  5. The CertificatesSection renders without any inline `<style>` tags
  6. Sharing the site URL on social media shows a proper title, description, and preview image
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Warm Theme + Route Skeleton | 0/0 | Not started | - |
| 2. Resume Page + Print | 0/0 | Not started | - |
| 3. Hero Tilt + Content Population | 0/0 | Not started | - |
| 4. Polish + Contact Hardening + Cleanup | 0/0 | Not started | - |
