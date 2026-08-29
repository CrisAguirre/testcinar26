---
name: Cinar Sistemas — Plataforma Educativa
description: Educational platform for grade management, exams and learning resources
colors:
  primary: "#4075a6"
  accent: "#ff3e00"
  surface: "#ffffff"
  surface-hover: "#f8fafc"
  surface-alt: "#f9fafb"
  bg-0: "#cad8e4"
  bg-1: "#d1dde8"
  bg-2: "#e6edf4"
  text-primary: "#1f2937"
  text-secondary: "#6b7280"
  text-muted: "#888888"
  text: "rgba(0, 0, 0, 0.7)"
  border: "#e5e7eb"
  success: "#16a34a"
  error: "#dc2626"
  warning: "#d97706"
typography:
  body:
    fontFamily: "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.5
  display:
    fontFamily: "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
    fontSize: "clamp(1.2rem, 4vw, 2rem)"
    fontWeight: 400
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
  exam-card:
    backgroundColor: "rgba(255,255,255,0.12)"
    rounded: "{rounded.lg}"
    padding: "0.85rem 1rem"
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.5rem"
  button-ghost:
    backgroundColor: "rgba(255,255,255,0.08)"
    textColor: "rgba(255,255,255,0.75)"
    rounded: "20px"
    padding: "0.4rem 1rem"
  input:
    backgroundColor: "rgba(255,255,255,0.1)"
    textColor: "#ffffff"
    rounded: "12px"
    padding: "0.85rem 1rem"
  badge:
    backgroundColor: "#dbeafe"
    textColor: "#1d4ed8"
    rounded: "12px"
    padding: "0.15rem 0.5rem"
---

# Design System: Cinar Sistemas

## 1. Overview

**Creative North Star: "The Academic Dashboard"**

A functional, clear educational platform designed for students and coordinators. The aesthetic prioritizes readability, data clarity, and trust over decoration. The interface uses blue (`--color-primary: #4075a6`) as its anchor — a trustworthy, institutional tone — with a restrained orange accent (`--color-accent: #ff3e00`) for primary actions and emphasis.

The system explicitly rejects: glassmorphism as decoration, gradient text, numbered section markers, and the hero-metric template. Surfaces are solid and flat at rest; shadows appear only as hover feedback for interactive elements.

**Key Characteristics:**
- Clean, data-forward layouts with clear typographic hierarchy
- Color-coded feedback (green success, red error, amber warning) consistent across the system
- Responsive from mobile to desktop with a single 600px breakpoint
- Scoped, context-specific styles rather than a heavy global design system

## 2. Colors

A restrained palette anchored by a professional blue primary, with a warm orange accent for calls to action.

### Primary
- **Steel Blue** (`#4075a6` / `--color-primary`): Primary brand color. Used for headers, navigation backgrounds, role badges, and the main subject-card gradient. Conveys trust and institutionality.
- **Deep Steel** (`#2c5f8a` / `--color-primary-hover`): Hover variant for primary surfaces.

### Accent
- **Signal Orange** (`#ff3e00` / `--color-accent`): Primary actions, interactive links, close buttons, detail-score values, and the close-btn background. Used sparingly for emphasis.

### Neutral
- **White** (`#ffffff` / `--color-surface`): Card backgrounds, modal surfaces, table rows.
- **Cloud** (`#f8fafc` / `--color-surface-hover`): Hover state for clickable rows, detail summary cards.
- **Dawn** (`#f9fafb` / `--color-surface-alt`): Student answer background.
- **Sky Tint 0–2** (`--color-bg-0/1/2`): Page background gradient layers — soft blue-greys that create depth behind content.

### Text
- **Ink** (`#1f2937` / `--color-text-primary`): Body text and question copy.
- **Grey** (`#6b7280` / `--color-text-secondary`): Table headers, meta labels, secondary info.
- **Muted Grey** (`#888888` / `--color-text-muted`): Footer text, loading/empty states.

### Feedback
- **Leaf** (`#16a34a` / `--color-success`): Correct answers, graded confirmation.
- **Rose** (`#dc2626` / `--color-error`): Incorrect answers, error messages.
- **Amber** (`#d97706` / `--color-warning`): Pending review, warnings.

### Named Rules
**The Three-Color Feedback Rule.** Success, error, and warning are the only semantic colors. They appear exclusively on badges, result labels, and status indicators — never on decorative elements.

## 3. Typography

**Body Font:** Arial stack (system sans-serif)
**Label/Mono Font:** Fira Mono (monospace, for code blocks)

**Character:** A pragmatic, system-native sans-serif stack that loads instantly (no web fonts). The lack of a custom typeface is intentional: this is a utility-forward educational tool, not a brand marketing site.

### Hierarchy
- **Display** (400, clamp(1.2rem, 4vw, 2rem), default): Page titles (`h1`). Centered by default.
- **Headline** (400, ~1.15–1.3rem, default): Section titles (`h2`) inside cards and subject modules.
- **Body** (400, 0.9rem, 1.5): Question text, grade values, link descriptions.
- **Label** (700, 0.65–0.82rem, uppercase + letter-spacing): Tags, badges, table headers, metadata.

### Named Rules
**The No-Webfont Rule.** All text uses system fonts. Fast loading trumps typographic personality.

## 4. Elevation

The system is primarily flat. Depth is conveyed through:
- **Background layering**: The page background uses a subtle blue-grey gradient (three tones), with content cards in solid white resting on top.
- **Hover shadows**: Interactive elements (cards, exam cards, buttons) rise on hover via `box-shadow` and `translateY(-2px to -4px)`. Rest state is flat.
- **No persistent shadows**: Cards have only a faint `0 2px 12px rgba(0,0,0,0.06)` shadow at rest. The modal overlay uses `rgba(0,0,0,0.4)` backdrop.

### Shadow Vocabulary
- **Card Rest** (`0 2px 12px rgba(0,0,0,0.06)`): Subtle separation for card surfaces.
- **Interactive Hover** (varies, up to `0 12px 40px rgba(64,117,166,0.4)`): Floating state for clickable elements.
- **Modal Backdrop** (`rgba(0,0,0,0.4)`): Full-screen dimmer.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to hover and focus states.

## 5. Components

### Cards
- **Shape:** Gently curved corners (12px).
- **Background:** Solid white (`--color-surface`).
- **Shadow Strategy:** Flat at rest, subtle hover lift.
- **Border:** None at rest; 1px `--color-border` on detail panels.
- **Internal Padding:** 1.5rem (24px).

### Buttons
- **Primary (close/confirm):** Signal Orange background, white text, 8px radius, 0.75rem padding. Hover reduces opacity.
- **Ghost (back):** Semi-transparent white background, 20px pill radius, 0.4rem 1rem padding. Hover increases opacity with subtle lift.
- **Logout:** Semi-transparent white background, 2px border, 6px radius. Hover brightens border.

### Exam Cards (subject navigation)
- **Shape:** Rounded corners (12px) with glass affordance (semi-transparent white bg on gradient parent).
- **States:** Hover lifts 3px with glow border and shine sweep animation.
- **Content:** Icon + label + arrow. Arrow slides right on hover.

### Inputs (search)
- **Style:** Semi-transparent interior with blur backdrop, 12px radius, 2px transparent border.
- **Focus:** Expanded glow (blue ring), slight scale(1.01), brighter background.

### Chips / Badges
- **MC Badge:** Blue tint (`#dbeafe` bg, `#1d4ed8` text), 12px pill, uppercase.
- **Open Badge:** Amber tint (`#fef3c7` bg, `#92400e` text), same shape.
- **Tag (enlaces page):** Per-category color scheme, uppercase, 8px radius.

### Navigation
- **Header:** dark steel blue background (`--color-theme-2`), white links, brand logo on the left, user name + logout on the right.
- **Mobile:** wraps to stacked layout, centered logo, justified nav.

### Modal (exam detail)
- **Style:** White surface, 12px radius, 720px max-width, scrollable body.
- **Overlay:** Fixed full-screen dimmer (0.4 opacity), closes on backdrop click or close button.
- **Content:** Summary cards (3-column), question accordion list with status badges.

## 6. Do's and Don'ts

### Do:
- **Do** use the three feedback colors exclusively for semantic status (success/error/warning).
- **Do** keep surfaces flat at rest; use shadows only for hover/focus feedback.
- **Do** prefer system fonts over web fonts for fast loading.
- **Do** use semantic `<a>` tags for navigation and `<button>` for actions.
- **Do** scope component styles locally rather than globally.

### Don't:
- **Don't** use glassmorphism (`backdrop-filter: blur`) as a decorative default.
- **Don't** use gradient text (`background-clip: text` with gradient).
- **Don't** put numbered section markers (01 / 02 / 03) as decorative scaffolding.
- **Don't** use the hero-metric template (big number + small label + stats).
- **Don't** hard-code colors that have a corresponding design token.
- **Don't** use bounce or elastic easing on animations.
- **Don't** use `border-left` or `border-right` greater than 1px as colored accent stripes.
