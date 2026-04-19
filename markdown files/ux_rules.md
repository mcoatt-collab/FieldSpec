# FieldSpec – UX Rules Specification (MVP)

## Overview

This document defines user experience rules across FieldSpec.

It ensures:

* Consistent interaction patterns
* Clear feedback to users
* Smooth and predictable workflows

All UI behaviour must follow these rules.

---

## 1. Feedback Principles

### Rule

Every user action must produce immediate, visible feedback.

---

### Examples

* Button click → visual state change (loading/pressed)
* Upload → progress indicator
* AI generation → progress + status
* Save → confirmation feedback

---

## 2. Loading States

### Rules

* Never leave users waiting without feedback
* Use appropriate loading indicators:

#### Use spinner for:

* Short actions (1–3 seconds)

#### Use progress indicators for:

* Long actions (uploads, AI processing)

---

### Skeleton Loaders

Use skeletons for:

* Project cards
* Image grid
* Report sections

---

## 3. Empty States

### Rules

Every empty state must:

* Explain what’s happening
* Provide a next action

---

### Examples

#### Dashboard

* Message: “No projects yet”
* Action: “Create New Report”

#### Image Grid

* Message: “No images uploaded”
* Action: Upload prompt

#### Report

* Message: “No report generated”
* Action: Generate report button

---

## 4. Error Handling

### Rules

* Errors must be:

  * Clear
  * Non-technical
  * Actionable

---

### Examples

❌ “Request failed (500)”
✅ “Something went wrong. Please try again.”

---

### Types of Errors

* Network errors
* Validation errors
* AI processing failures
* Upload failures

---

## 5. Form UX Rules

### Input Behaviour

* Inputs must:

  * Show focus state
  * Validate on blur or submit
  * Show inline error messages

---

### Error Messaging

* Place errors near the field
* Use clear language

---

### Buttons

* Disable submit when invalid
* Show loading state on submit

---

## 6. AI Interaction UX

### Rules

* AI must feel:

  * Assistive, not authoritative

---

### Behaviour

* Always allow edits to AI outputs
* Show:

  * confidence score
  * source trace (images)

---

### Loading

* Show progress:

  * “Analyzing images…”
  * “Generating insights…”

---

## 7. Navigation UX

### Rules

* Navigation must be:

  * Predictable
  * Shallow (no deep nesting)

---

### Behaviour

* Sidebar = primary navigation
* Current page must be clearly highlighted
* Back actions must be obvious

---

## 8. Interaction Feedback

### Hover States

* All interactive elements must have hover feedback

---

### Active States

* Buttons and selections must show active state

---

### Disabled States

* Must be visually distinct
* Must not be clickable

---

## 9. Responsiveness

### Rules

* UI must adapt across:

  * Mobile
  * Tablet
  * Desktop

---

### Behaviour

* Sidebar collapses on small screens
* Grids adjust column count
* Panels stack vertically

---

## 10. Performance UX

### Rules

* Avoid blocking UI

---

### Behaviour

* Use:

  * lazy loading
  * virtualisation

* Keep interactions responsive:

  * <100ms feedback for clicks

---

## 11. Consistency Rules

### Rule

Same action → same behaviour everywhere

---

### Examples

* All buttons behave the same
* All modals follow same structure
* All inputs follow same validation pattern

---

## 12. Accessibility (Baseline)

### Rules

* All actions must be:

  * keyboard accessible

* Focus states must be visible

* Text must be readable (contrast)

---

## 13. Microcopy Rules

### Tone

* Clear
* Direct
* Professional

---

### Guidelines

* Avoid technical jargon
* Be concise
* Guide the user

---

### Examples

❌ “Initiate report generation”
✅ “Generate report”

---

## 14. Trust & Transparency

### Rules

* Users must always know:

  * What is happening
  * What will happen next

---

### AI Transparency

* Show:

  * AI-generated labels
  * Confidence indicators

---

## 15. Interruptions & Confirmations

### Rules

* Confirm destructive actions:

  * delete project
  * remove images

---

### Avoid

* Unnecessary confirmations
* Blocking the user unnecessarily

---

## 16. Progress Visibility

### Rules

Long processes must show:

* Current state
* Progress (if possible)
* Completion feedback

---

### Example

* “Uploading images (3/20)”
* “Generating report…”

---

## 17. UX Anti-Patterns (DO NOT ALLOW)

* No silent failures
* No hidden actions
* No inconsistent UI behaviour
* No blocking UI during long tasks
* No unexplained states

---
