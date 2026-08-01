# Phase 1: Warm Theme + Route Skeleton - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-08-01
**Phase:** 1-Warm Theme + Route Skeleton
**Areas discussed:** Warm palette direction, Resume link in Header, Conditional chrome pattern

---

## Warm palette direction

### Q1: What warm direction should the palette go?

| Option | Description | Selected |
|--------|-------------|----------|
| Warm amber/gold | Soft golden tones, light cream backgrounds, feels warm but professional. Amber primary accent on warm neutral surfaces. | ✓ |
| Earthy terracotta | Rich earthy warmth, slightly darker backgrounds, feels grounded and distinctive. Terracotta or burnt orange primary. | |
| You decide | You pick what works best with the existing shadcn/ui OKLCH system — I trust your judgment on contrast and harmony. | |

**User's choice:** Warm amber/gold
**Notes:** None

---

### Q2: How saturated should the primary accent be?

| Option | Description | Selected |
|--------|-------------|----------|
| Soft amber (Recommended) | Moderate saturation (chroma ~0.15), warm amber at hue 70-80. Balanced — not too bold, not too muted. Works well as primary for both light and dark. | ✓ |
| Vibrant gold | Higher saturation (chroma ~0.20), golden at hue 65-75. More vibrant, stands out on cream backgrounds. Needs careful dark mode pairing. | |
| Muted warm | Lower saturation (chroma ~0.10), muted warm at hue 75-85. Subtle, professional, pairs with any accent color later. | |

**User's choice:** Soft amber (Recommended)
**Notes:** None

---

### Q3: How warm should the light-mode background be?

| Option | Description | Selected |
|--------|-------------|----------|
| Warm white (Recommended) | Just a hint of warm tint on the background — nearly white but noticeably warmer than pure white. Subtle and clean. | ✓ |
| Cream/beige | Distinctly cream-colored background. More noticeable warmth, feels cozy and personal. Stronger personality. | |
| You decide | You choose the background warmth level that pairs well with soft amber primary. | |

**User's choice:** Warm white (Recommended)
**Notes:** None

---

### Q4: Hero gradient in the warm palette?

| Option | Description | Selected |
|--------|-------------|----------|
| Refactor to var(--primary) (Recommended) | Make gradient dynamic — reads from var(--primary) so it adapts to theme. Same effect, warm amber gradient instead of violet. | ✓ |
| Remove gradient | Remove the gradient utility entirely. Use solid primary color everywhere — simpler, cleaner. | |
| You decide | You decide what works best with the warm palette. | |

**User's choice:** Refactor to var(--primary) (Recommended)
**Notes:** None

---

## Resume link in Header

### Q1: How should the Resume link appear in the header?

| Option | Description | Selected |
|--------|-------------|----------|
| Same style, in nav bar | Place Resume link after the nav hash links (or before), styled as a router Link — distinct from hash anchors. Keeps single cohesive header. | ✓ |
| Button-style CTA | Rendered as a small outlined/pill button — visually distinct as an external-type action. Common portfolio pattern. | |
| You decide | You decide based on the existing header layout. | |

**User's choice:** Same style, in nav bar
**Notes:** None

---

### Q2: Should the Resume link appear in the mobile menu too?

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, in mobile menu (Recommended) | Include Resume in the mobile dropdown menu alongside the other nav items. Consistent on all viewports. | ✓ |
| Desktop only | Desktop only — mobile users miss the resume link entirely. Not recommended. | |
| You decide | You decide where it belongs on mobile. | |

**User's choice:** Yes, in mobile menu (Recommended)
**Notes:** None

---

### Q3: Where should the Resume link sit in the nav order?

| Option | Description | Selected |
|--------|-------------|----------|
| After Contact (Recommended) | Place after Contact — resume is an external-facing action, natural last item in nav flow. | ✓ |
| First, before Home | Place before the section links — resume as primary destination for employers. | |
| You decide | You decide based on the current layout. | |

**User's choice:** After Contact (Recommended)
**Notes:** None

---

### Q4: Should the Resume link ever show as the scroll-spy active state?

| Option | Description | Selected |
|--------|-------------|----------|
| Never highlighted (Recommended) | Resume is a router link, never a hash anchor. It should never show the scroll-spy active highlight. Consistent with its different behavior. | ✓ |
| Highlight when on /resume | Only highlight when on the /resume route. Needs useLocation check in Header to detect route. | |
| You decide | You decide how active state works. | |

**User's choice:** Never highlighted (Recommended)
**Notes:** None

---

## Conditional chrome pattern

### Q1: How should Header and Footer be hidden on the /resume page?

| Option | Description | Selected |
|--------|-------------|----------|
| Layout wrapper component (Recommended) | Wrap Header + Footer + Outlet in a layout component. Routes that need no chrome use a bare Route. Clean separation, easy to extend. | ✓ |
| Conditional render in Header/Footer | Header and Footer check useLocation() and hide themselves on /resume. Simpler but couples UI to routing. | |
| You decide | You decide the cleanest approach for this codebase. | |

**User's choice:** Layout wrapper component (Recommended)
**Notes:** None

---

### Q2: What should the layout component be called and how structured?

| Option | Description | Selected |
|--------|-------------|----------|
| DefaultLayout with Header+Footer | Single wrapper: Header + Outlet + Footer. Clean, minimal. Resume gets a bare Route with no wrapper. | ✓ |
| Separate layout for resume | Two wrappers: one with chrome (main site), one without (resume). Explicit, self-documenting intent. | |
| You decide | You decide the naming and structure. | |

**User's choice:** DefaultLayout with Header+Footer
**Notes:** None

---

### Q3: What should happen to scroll position when navigating?

| Option | Description | Selected |
|--------|-------------|----------|
| ScrollToTop on route change (Recommended) | Add a ScrollToTop component (onMount scroll to 0). Handles all route transitions. | ✓ |
| Scroll to top only on /resume | Only scroll to top when entering /resume. Going back to / keeps current scroll position. | |
| You decide | You decide the scroll behavior. | |

**User's choice:** ScrollToTop on route change (Recommended)
**Notes:** None

---

### Q4: Special scroll-spy handling for /resume?

| Option | Description | Selected |
|--------|-------------|----------|
| No special handling needed (Recommended) | ScrollToTop handles position. Header is completely absent on /resume, so scroll-spy doesn't exist there. No extra work needed. | ✓ |
| Explicit disable for /resume | If Resume page ever shares the DefaultLayout, we'd need to disable scroll-spy explicitly. Future-proof but unnecessary now. | |
| You decide | You decide if we need to handle this. | |

**User's choice:** No special handling needed (Recommended)
**Notes:** None

---

## Claude's Discretion

Exact OKLCH values for each token in both light and dark modes — user chose direction (warm amber/gold, soft amber primary, warm white background) and left specific color values to Claude's discretion. Must maintain WCAG AA contrast (THME-04).

## Deferred Ideas

None — discussion stayed within phase scope.
