# FieldSpec – Layout Specification (MVP)

## Overview

This document defines the layout structure of the FieldSpec application.

It ensures:

* Consistent UI structure across all pages
* Predictable navigation and hierarchy
* Scalable layout for future features

All layouts must:

* Use components defined in `components.md`
* Use spacing and styling from `design-tokens.css`

---

## 1. Global App Layout

### Structure

* Sidebar (left)
* Main Content Area (right)
* Top Bar (optional within content)

```
[ Sidebar ] | [ Main Content Area ]
```

---

### Sidebar

#### Purpose

Primary navigation

#### Items

* Dashboard
* New Report
* Projects
* Settings

#### Behaviour

* Fixed position
* Collapsible (future)
* Active state highlighting

---

### Main Content Area

#### Behaviour

* Scrollable
* Contains page-specific content
* Uses consistent padding:

  * `padding: var(--spacing-lg)`

---

## 2. Dashboard Layout

### Purpose

Overview of all projects

### Structure

* Header

  * Title: "Dashboard"
  * CTA: "+ New Report"

* Filters / Search Bar

* Project Grid

```
[ Header ]
[ Filters ]
[ Project Cards Grid ]
```

---

### Project Grid

* Uses `Project Card` component
* Responsive grid:

  * Desktop: 3–4 columns
  * Tablet: 2 columns
  * Mobile: 1 column

---

## 3. Upload & Image Management Layout

### Purpose

Handle large image uploads and organisation

### Structure

* Header

  * Project name
  * Actions:

    * Generate Report
    * View Map

* Upload Dropzone (top)

* Image Grid (main area)

* Right Panel (optional)

  * Tagging controls
  * Notes input

```
[ Header ]
[ Upload Dropzone ]
[ Image Grid ] | [ Tagging Panel ]
```

---

### Image Grid

* Virtualised grid (performance critical)
* Uses `Image Card` component
* Supports:

  * multi-select
  * hover states

---

## 4. Map View Layout

### Purpose

Display spatial distribution of images

### Structure

* Full-width map

* Floating Controls:

  * Filter by category
  * Toggle layers
  * Save map snapshot

* Side Panel (on marker click)

  * Image preview
  * Tags
  * Notes

```
[ Map (full screen) ]
   [ Floating Controls ]
   [ Side Panel (on interaction) ]
```

---

## 5. Report Builder Layout

### Purpose

Review and edit generated report

### Structure

* Header

  * Project name
  * Actions:

    * Export PDF
    * Back to Dashboard

* Main Content:

  * Report Sections (scrollable)

* Right Panel (optional)

  * Insight Trace
  * Source images

```
[ Header ]
[ Report Content ] | [ Insight Panel ]
```

---

### Report Content

* Section-based layout:

  * Introduction
  * Findings
  * Recommendations
  * Image Annotations

* Each section uses `Report Section` component

---

## 6. Modal Layout

### Purpose

Handle focused interactions

### Structure

* Overlay backdrop
* Centered modal container

```
[ Backdrop ]
   [ Modal ]
      [ Header ]
      [ Content ]
      [ Actions ]
```

---

## 7. Settings Layout

### Purpose

User profile management

### Structure

* Header: "Settings"

* Form:

  * Name
  * Company name

* Save button

---

## 8. Empty States

### Rules

Each major view must handle empty states:

#### Dashboard

* “No projects yet”
* CTA: Create new report

#### Image Grid

* “No images uploaded”
* Show upload prompt

#### Report

* “No report generated yet”

---

## 9. Loading States

### Rules

* Use skeleton loaders for:

  * Project cards
  * Image grid
  * Report sections

* Use spinner for:

  * AI processing
  * Export

---

## 10. Responsive Behaviour

### Breakpoints

* Mobile
* Tablet
* Desktop

### Rules

* Sidebar collapses on mobile
* Grid adjusts columns
* Panels become stacked

---

## 11. Layout Rules (CRITICAL)

### Consistency

* All pages must follow defined layout patterns

### Spacing

* Use only spacing tokens:

  * `--spacing-*`

### Alignment

* Use grid/flex layouts
* Avoid arbitrary positioning

### Performance

* Large datasets must use:

  * virtualisation
  * lazy loading

---

## 12. Navigation Flow

* Sidebar → primary navigation
* Buttons → secondary actions
* No deep nested navigation

---

## 13. Future Extensions

* Multi-panel resizing
* Split-screen editing
* Collaborative cursors
* Dark mode layouts

---
## 14. Global Component Rules (CRITICAL)

This system does not rely on a predefined `components.md`.

Instead, all UI components must follow these global rules to ensure consistency and scalability.

---

### 14.1 Token Enforcement (STRICT)

All components must use `design-tokens.css`.

#### Rules

* No hardcoded values allowed:

  * ❌ hex colors
  * ❌ px spacing
  * ❌ arbitrary border radius

* Always use:

  * `var(--color-*)`
  * `var(--spacing-*)`
  * `var(--radius-*)`
  * `var(--font-size-*)`

---

### 14.2 Component Structure Consistency

All components must follow a predictable structure:

* Container
* Content
* Optional actions

#### Example Pattern

```id="k3b9cl"
<Component>
  <Container>
    <Content />
    <Actions />
  </Container>
</Component>
```

---

### 14.3 Variant System (MANDATORY)

All reusable UI elements must support variants via props.

#### Examples

* Button → primary, secondary, ghost
* Tag → category-based variants
* Cards → default, selected

#### Rule

Variants must:

* Be controlled via props
* Not create separate components

---

### 14.4 State Handling (MANDATORY)

All interactive components must define explicit states:

* default
* hover
* active
* disabled
* loading (if applicable)

#### Rules

* No implicit styling changes
* All states must be visually distinct

---

### 14.5 Spacing Rules

* Use only spacing tokens
* Maintain consistent padding across components

#### Example

* Small → `--spacing-sm`
* Medium → `--spacing-md`
* Large → `--spacing-lg`

---

### 14.6 Typography Rules

* Use token-based typography only
* Maintain hierarchy:

#### Example

* Headings → larger font tokens
* Body → base font size
* Labels → smaller font size

---

### 14.7 Interaction Rules

* All clickable elements must:

  * Have hover feedback
  * Have focus states
  * Be accessible via keyboard

---

### 14.8 Reusability Rules

* No duplicate components
* If a pattern repeats:
  → Convert it into a reusable component

---

### 14.9 Layout-Driven Components

Components must adapt to layout context:

* Grid-based layouts → responsive components
* Sidebar → compact variants
* Full-page → expanded variants

---

### 14.10 Performance Rules

* Lists must support:

  * virtualisation
  * lazy loading

* Images must:

  * use thumbnails
  * load progressively

---

### 14.11 Accessibility (Baseline)

* Buttons must be keyboard accessible
* Inputs must have focus states
* Contrast must meet readability standards

---

### 14.12 IDE Enforcement Rules

The IDE must:

* Prefer reusable components over inline UI
* Follow variant + state patterns
* Reject hardcoded styles when tokens exist
* Maintain consistency across all screens

---

### 14.13 Design Consistency Principle

If two elements serve the same purpose:
→ They must look and behave the same.

No visual inconsistency is allowed.

---
### 14.14 Token Priority Clarification (CRITICAL)

All typography, spacing, and elevation decisions must strictly use tokens defined in:

`design-tokens.css`

---

### Typography Rules

* All font sizes must use:

  * `var(--font-size-*)`

* All font weights must use:

  * `var(--font-weight-*)`

* No Tailwind font size utilities allowed:

  * ❌ `text-sm`, `text-lg`, etc.

---

### Spacing Rules

* All padding, margin, and gaps must use:

  * `var(--spacing-*)`

* No Tailwind spacing utilities allowed:

  * ❌ `p-4`, `m-2`, `gap-6`

---

### Elevation (Shadows) Rules

* All shadows must use:

  * `var(--shadow-*)`

* No custom or Tailwind shadow utilities:

  * ❌ `shadow-md`, `shadow-lg`

---

### Enforcement Priority

When styling conflicts occur:

1. `design-tokens.css` (HIGHEST PRIORITY)
2. Layout rules (`layout.md`)
3. Tailwind defaults (LOWEST PRIORITY)

---

### Strict Rule

If a token exists, it MUST be used.

No exceptions.

---
