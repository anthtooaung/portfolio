# Phase 1: Warm Theme + Route Skeleton - Research

## Context

Phase 1 focuses on two main goals:
1. Shifting the site's design tokens from a violet palette to a warm amber/gold palette (light and dark mode).
2. Implementing routing to support a `/resume` page that has conditional chrome (no Header/Footer) and scrolls to top on navigation.

## Theme Architecture

### Token Shift (THME-01, THME-02)
- All colors are defined as OKLCH tokens in `src/index.css` inside `:root` and `.dark` blocks.
- The `UI-SPEC.md` provides exact OKLCH values for both light and dark mode, using a warm amber/gold hue (~75).
- Both modes must be updated together to satisfy THME-02 (no jarring hue flash on toggle).

### Gradient Refactor (THME-03)
- The `.text-gradient-violet` utility in `src/index.css` hardcodes the second stop to `oklch(0.75 0.18 310)`.
- It should be renamed to `.text-gradient-warm` and its stops updated.
- `UI-SPEC.md` recommends `oklch(0.78 0.12 75)` for the second stop, with `var(--primary)` as the first.
- `src/components/HeroSection.tsx` must be updated to use the new `.text-gradient-warm` class.

## Routing Architecture

The project uses `react-router-dom` v7.

### Conditional Chrome (ROUT-01)
- Currently, `src/App.tsx` wraps all routes with `Header` and `Footer`:
  ```tsx
  <div className="min-h-screen flex flex-col">
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
    <Footer />
  </div>
  ```
- This needs to be refactored to use a Layout route pattern:
  - Create a `DefaultLayout` component that includes `Header`, `Outlet`, and `Footer`.
  - Update `App.tsx` routes:
    ```tsx
    <Routes>
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
      <Route path="/resume" element={<ResumePage />} />
    </Routes>
    ```

### ScrollToTop (ROUT-03)
- When navigating to a new route in React Router, the scroll position often remains unchanged.
- We need a `ScrollToTop` component that listens to `useLocation()` and calls `window.scrollTo(0, 0)` on route changes.
- It should be placed inside `BrowserRouter` but outside `Routes` in `App.tsx`.

### Header Navigation (ROUT-02, ROUT-04)
- `src/components/Header.tsx` defines `NAV_LINKS`.
- We need to add a "Resume" link. However, `NAV_LINKS` currently expects hash links (`href: '#home'`) and uses `handleNavClick` for smooth scrolling.
- We should add the Resume link as a distinct item using `react-router-dom`'s `Link` component, bypassing the hash scrolling logic.
- D-07 states it goes after Contact.
- D-08 states it is never scroll-spy highlighted.
- `useScrollSpy` is safe: `Header` won't render on `/resume`, so it won't mount and won't throw errors. ROUT-04 is naturally satisfied.

## Implementation Steps

1. **Tokens**: Update `src/index.css` with the new OKLCH values from `UI-SPEC.md`. Rename `.text-gradient-violet` to `.text-gradient-warm`.
2. **Hero**: Update `src/components/HeroSection.tsx` to use the new gradient class.
3. **Routing Components**: Create `src/components/DefaultLayout.tsx` and `src/components/ScrollToTop.tsx`.
4. **Resume Placeholder**: Create `src/pages/Resume.tsx` with a minimal placeholder `div`.
5. **App Setup**: Update `src/App.tsx` to wire up the new layout and routes.
6. **Header**: Update `src/components/Header.tsx` to include a `Link` to `/resume` in both desktop and mobile menus, using the `FileText` icon.

## Validation Architecture

- **Test Theme Toggle**: Click the theme toggle; observe smooth background transition without abrupt hue shifts.
- **Test Routing**: Click "Resume" in the header; verify navigation to `/resume`, scroll position at top, and Header/Footer absent.
- **Test Back Navigation**: Click browser back; verify navigation to `/`, Header/Footer present.
- **Test Contrast**: Verify WCAG AA contrast (4.5:1) for primary text on backgrounds.

## OUTLINE COMPLETE
