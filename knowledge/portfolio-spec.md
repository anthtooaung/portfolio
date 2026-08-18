# Portfolio System Architecture & Master Specification

> **System Overview:** A dynamic, developer-focused, dark-mode-only portfolio built using Markdown files for page content and JSON database schemas for certificate-to-skill logic, embedded PDF viewers, and an audio guide interface.

---

## System Specifications Summary

| Feature | Specification |
| :--- | :--- |
| **Theme** | Dark Mode Only (`bg-slate-950`, `#0b0f19`) |
| **Content Engine** | File-based Markdown (`.md`) parsing |
| **Skill Logic** | Certificate-driven dynamic skill percentage & verification |
| **Documents** | In-app PDF preview & Direct Download (`.pdf`) |
| **Navigation** | Sticky header + **Achievements** Dropdown (`Certificates` & `CV`) |
| **Interactive Feature** | Toggleable Voice Guide Audio Control (`/audio/intro.mp3`) |

---

## Complete Project Directory Structure

```text
portfolio-app/
├── public/
│   ├── audio/
│   │   └── intro-guide.mp3           # Voice guide audio recording
│   └── docs/
│       ├── resume.pdf                # CV file format (PDF)
│       └── certificates/
│           ├── git-github-cert.pdf   # Individual Certificate PDF
│           ├── react-cert.pdf        # Individual Certificate PDF
│           └── database-cert.pdf     # Individual Certificate PDF
├── content/
│   ├── hero.md                       # Hero section content
│   ├── about.md                      # About Us section content
│   ├── contact.md                    # Contact information & socials
│   ├── projects/
│   │   ├── project-1.md              # Markdown file for Project 1
│   │   └── project-2.md              # Markdown file for Project 2
│   └── certificates.json             # Skill-linked Certificates database
└── src/                              # Source code implementation
```

---

## Implementation Phases

### Phase 1: Dark Mode Only Theme [HIGH PRIORITY]

**Goal:** Remove light mode entirely, force dark mode as default across the site.

**Tasks:**
- [x] Remove light mode CSS variables from `:root` block in `index.css`
- [x] Move dark mode variables to be the default (directly in `:root`)
- [x] Remove the `.dark` class selector from `index.css`
- [x] Remove dark mode toggle button from `Header.tsx` (both desktop and mobile)
- [x] Remove `dark` state and `useEffect` for theme switching from `Header.tsx`
- [x] Remove `localStorage` theme persistence logic
- [x] Remove `Sun` and `Moon` icon imports from `Header.tsx`
- [x] Add `class="dark"` to `<html>` in `index.html` (ensure dark mode is always active)
- [x] Verify all components render correctly in dark-only mode

**Files to modify:**
- `src/index.css`
- `src/components/Header.tsx`
- `index.html`

---

### Phase 2: Content Engine - JSON Certificate Database [MEDIUM PRIORITY]

**Goal:** Replace hardcoded certificate data with a JSON database that drives skill percentages and verification.

**Tasks:**
- [x] Create `src/content/certificates.json` with certificate-to-skill mapping
- [x] Create `src/lib/certs.ts` helper to load and parse certificate data
- [x] Refactor `CertificatesCarousel.tsx` to use JSON data
- [x] Add TypeScript types for certificate data structure
- [x] Implement skill percentage calculation based on certificate count

**JSON Schema:**
```json
{
  "certificates": [
    {
      "id": "git-github",
      "title": "Git & GitHub Mastery",
      "skill": "Version Control",
      "pdf": "/docs/certificates/git-github-cert.pdf",
      "percentage": 95,
      "issuedDate": "2024-01-15"
    }
  ]
}
```

---

### Phase 3: PDF Viewer Component [MEDIUM PRIORITY]

**Goal:** Add in-app PDF preview capability for certificates and resume.

**Tasks:**
- [x] Create `src/components/PdfViewer.tsx` component
- [x] Use native `<object>` or `<iframe>` for PDF rendering
- [x] Add modal/dialog wrapper for certificate preview
- [x] Add download button in PDF viewer modal
- [x] Integrate with `CertificatesCarousel.tsx`
- [x] Create PDF viewer for Resume page

**Component API:**
```tsx
<PdfViewer
  src="/docs/certificates/react-cert.pdf"
  title="React Certificate"
  showDownload={true}
/>
```

---

### Phase 4: Audio Guide Feature [LOW PRIORITY]

**Goal:** Add a toggleable voice guide audio player for site introduction.

**Tasks:**
- [x] Create `public/audio/intro-guide.mp3` placeholder
- [x] Create `src/components/AudioGuide.tsx` component
- [x] Add play/pause button with icon
- [x] Add global toggle in Header component
- [x] Persist audio preference in `localStorage`
- [x] Implement autoplay on first visit (optional)
- [x] Add `aria-label` for accessibility

**Component API:**
```tsx
<AudioGuide
  src="/audio/intro-guide.mp3"
  autoPlay={false}
  showControls={true}
/>
```

---

### Phase 5: Navigation Enhancement [LOW PRIORITY]

**Goal:** Add "Achievements" dropdown menu to navigation header.

**Tasks:**
- [x] Add `DropdownMenu` component from shadcn/ui
- [x] Create "Achievements" dropdown with links:
  - Certificates (#certificates)
  - Resume (#resume or /resume)
  - Skills (#skills)
- [x] Update `Header.tsx` with dropdown menu
- [x] Ensure mobile menu includes dropdown items
- [x] Test smooth scroll to achievement sections

---

### Phase 6: Resume Page Route [MEDIUM PRIORITY]

**Goal:** Create dedicated `/resume` route with markdown content and PDF preview.

**Tasks:**
- [x] Create `src/pages/Resume.tsx` page component
- [x] Create `src/content/resume.md` with markdown content
- [x] Register route in `src/App.tsx`
- [x] Add navigation link in `Header.tsx`
- [x] Implement PDF viewer for resume download
- [x] Add back navigation to home page

---

## Implementation Roadmap

| Phase | Milestones | Priority | Effort |
|-------|------------|----------|--------|
| **Phase 1** | Dark mode only | HIGH | ~1 day |
| **Phase 2** | JSON certificate database | MEDIUM | ~1 day |
| **Phase 3** | PDF viewer | MEDIUM | ~0.5 days |
| **Phase 4** | Audio guide | LOW | ~1 day |
| **Phase 5** | Navigation dropdown | LOW | ~0.5 days |
| **Phase 6** | Resume page | MEDIUM | ~1 day |

**Total estimated effort:** ~5 days

---

## Quick Start Checklist

1. **Phase 1:** Remove light mode toggle, force dark mode
2. **Phase 2:** Add `certificates.json` and refactor `CertificatesSection`
3. **Phase 3:** Build PDF viewer component
4. **Phase 4:** Add audio guide feature
5. **Phase 5:** Enhance navigation with dropdown
6. **Phase 6:** Create resume page with routing

---

## Notes

- All new assets (audio, PDFs) go in `public/` folder for static hosting
- Markdown files use YAML frontmatter parsed by `parseYamlSimple`
- shadcn/ui components follow CVA variant pattern
- Single-page architecture except for `/resume` route
- No server-side rendering required
