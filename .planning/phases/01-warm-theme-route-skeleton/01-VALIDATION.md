---
phase: 1
slug: warm-theme-route-skeleton
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-08-01
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None configured — no test framework in this project |
| **Config file** | none |
| **Quick run command** | `npm run build` (TypeScript check + Vite build) |
| **Full suite command** | `npm run build && npm run lint` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && npm run lint`
- **Before `/gsd-verify-work`:** Full build + lint must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|--------------------|--------|
| 01-01-01 | 01 | 1 | THME-01 | build | `npm run build` | ⬜ pending |
| 01-01-02 | 01 | 1 | THME-02 | build | `npm run build` | ⬜ pending |
| 01-01-03 | 01 | 1 | THME-03 | build | `npm run build` | ⬜ pending |
| 01-01-04 | 01 | 1 | THME-04 | manual | DevTools contrast checker | ⬜ pending |
| 01-02-01 | 02 | 1 | ROUT-01 | build | `npm run build` | ⬜ pending |
| 01-02-02 | 02 | 1 | ROUT-02 | build | `npm run build` | ⬜ pending |
| 01-02-03 | 02 | 1 | ROUT-03 | build | `npm run build` | ⬜ pending |
| 01-02-04 | 02 | 1 | ROUT-04 | manual | Navigate to /resume, verify no scroll-spy errors in console | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No test framework installation needed — this phase is CSS tokens and routing skeleton. Build + lint is sufficient automated verification.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Warm amber/cream tones visible | THME-01 | Visual assessment | Open site in browser, verify warm amber/gold palette in both modes |
| No jarring hue flash on toggle | THME-02 | Visual assessment | Toggle dark mode repeatedly, observe smooth transition |
| WCAG AA contrast (4.5:1) | THME-04 | Requires contrast tool | Use Chrome DevTools contrast checker on foreground/background combos |
| Header/Footer hidden on /resume | ROUT-01 | Visual assessment | Navigate to /resume, verify no Header or Footer renders |
| Scroll to top on route change | ROUT-03 | Visual assessment | Scroll down on /, click Resume, verify page starts at top |
| No scroll-spy errors on /resume | ROUT-04 | Console inspection | Open DevTools console on /resume, verify no errors |

---

## Validation Sign-Off

- [ ] All tasks have automated verify or manual verification documented
- [ ] Sampling continuity: build runs after every task
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
