---
phase: 01-warm-theme-route-skeleton
reviewed: 2026-08-03T00:00:00Z
depth: standard
files_reviewed: 7
files_reviewed_list:
  - src/index.css
  - src/components/HeroSection.tsx
  - src/components/DefaultLayout.tsx
  - src/components/ScrollToTop.tsx
  - src/pages/Resume.tsx
  - src/App.tsx
  - src/components/Header.tsx
findings:
  critical: 1
  warning: 3
  info: 2
  total: 6
status: issues_found
---

# Phase 1: Code Review Report

**Reviewed:** 2026-08-03T00:00:00Z
**Depth:** standard
**Files Reviewed:** 7
**Status:** issues_found

## Summary

This phase introduced a warm color theme (hue 75 amber/ochre replacing hue 280 violet), extracted a `DefaultLayout` component with Header/Footer, added a `ScrollToTop` utility, created a `/resume` route with a placeholder page, and added a "Resume" nav link to the Header. The routing refactor moved the single-page shell into `DefaultLayout` and placed `/resume` outside it. One critical bug was found: the dark mode class is never applied on the resume page when visited directly, causing a theme mismatch. Three warnings cover invalid nested `<main>` elements, the resume page lacking navigation, and the absence of a 404 route.

## Critical Issues

### CR-01: Dark mode preference lost on `/resume` route (cold start)

**File:** `src/App.tsx:15`, `src/components/Header.tsx:32-40`
**Issue:** The `dark` class on `<html>` is managed exclusively by a `useEffect` inside `Header.tsx` (lines 32-40). The `/resume` route at `App.tsx:15` is placed outside `DefaultLayout`, so `Header` is never rendered on the resume page. When a user navigates directly to `/resume` (via bookmark, shared link, or browser address bar), the `dark` class is never set on the document root. The resume page always renders in light mode regardless of the user's saved preference in `localStorage('theme')`. If the user navigates from home to resume, the class persists on the DOM from the previous render, masking the bug -- but a fresh visit to `/resume` exposes it.

**Fix:** Extract the dark mode initialization logic out of `Header` into a dedicated component or effect that runs on all routes. The simplest approach is to move the dark mode logic into a `ThemeProvider` component that reads `localStorage` and sets the `dark` class before any route renders:

```tsx
// src/components/ThemeProvider.tsx
import { useEffect } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = saved === 'dark' || (!saved && prefersDark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  return <>{children}</>;
}
```

Then wrap `BrowserRouter` children in `<ThemeProvider>` in `App.tsx`, and remove the class-toggling `useEffect` from `Header.tsx` (keep only the `setDark` + `localStorage` write for the toggle button).

## Warnings

### WR-01: Nested `<main>` elements (invalid HTML)

**File:** `src/components/DefaultLayout.tsx:9`, `src/pages/Home.tsx:11`
**Issue:** `DefaultLayout.tsx` wraps `<Outlet />` inside `<main className="flex-grow">` (line 9), and `Home.tsx` returns its content inside its own `<main>` tag (line 11). This produces `<main><main>...</main></main>` in the DOM, which is invalid per the HTML spec (only one `<main>` element is allowed per page). Screen readers and accessibility tools may not correctly identify the main content region.

**Fix:** Remove the `<main>` wrapper from `Home.tsx` since `DefaultLayout` already provides one:

```tsx
// src/pages/Home.tsx
export function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <FeaturedProjects />
      <SkillsSection />
      <CertificatesSection />
      <ContactSection />
    </>
  );
}
```

Alternatively, remove the `<main>` from `DefaultLayout` and let each page control its own semantic structure -- but the first approach is simpler since `DefaultLayout` is the shared shell.

### WR-02: Resume page has no navigation header or footer

**File:** `src/App.tsx:15`
**Issue:** The `/resume` route is a sibling of the `DefaultLayout` route (line 15), not nested inside it. This means the resume page has no Header (site navigation, dark mode toggle) and no Footer (social links, copyright). The only way back to the main site is the "Back to Home" `<Link>` at the top of the resume page. This creates a navigation dead-end -- if a user lands on the resume from a shared link, they have no persistent navigation and no access to social links or the dark mode toggle.

**Fix:** Either nest the `/resume` route inside `DefaultLayout`:

```tsx
<Route element={<DefaultLayout />}>
  <Route path="/" element={<Home />} />
  <Route path="/resume" element={<ResumePage />} />
</Route>
```

Or create a separate layout for the resume page that includes at minimum a minimal header/nav. If the intent is a clean printable resume, consider adding `@media print` styles and still including the Header/Footer for web viewing.

### WR-03: No catch-all/404 route

**File:** `src/App.tsx`
**Issue:** There is no `<Route path="*" ... />` fallback route. If a user navigates to any URL other than `/` or `/resume` (e.g., `/about`, `/projects`, or a mistyped URL), React Router renders nothing -- a blank page with no feedback or navigation.

**Fix:** Add a simple NotFound page and a catch-all route as the last route inside `<Routes>`:

```tsx
<Route path="*" element={<NotFound />} />
```

## Info

### IN-01: HeroSection indentation inconsistency

**File:** `src/components/HeroSection.tsx:21-50`
**Issue:** The inner content of the `<div className="max-w-2xl flex-1">` (line 21) is not indented one additional level relative to its parent. Lines 22-49 are at the same indentation level as the opening tag on line 21, making the nesting structure harder to read.

**Fix:** Indent the children of the flex-1 div one additional level (2 spaces) for consistent nesting.

### IN-02: Two separate `@layer utilities` blocks in index.css

**File:** `src/index.css:141-153`, `src/index.css:168-175`
**Issue:** The CSS file has two separate `@layer utilities` blocks -- one for animation utilities (line 141) and one for the `text-gradient-warm` class (line 168). While CSS allows multiple `@layer` blocks with the same name, consolidating them improves readability and makes it easier to see all utility additions at a glance.

**Fix:** Merge the two `@layer utilities` blocks into one, placing the `text-gradient-warm` class alongside the animation utilities.

---

_Reviewed: 2026-08-03T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
