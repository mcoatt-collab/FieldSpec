# FieldSpec – Design Tokens Specification

## Overview

This document defines how design tokens are used within FieldSpec.

Source of Truth:

* `design-tokens.css`

All styling decisions must reference this file.

---

## 1. Core Principle

### Single Source of Truth

* All colors, spacing, typography, and visual styles must come from:
  `design-tokens.css`

* No hardcoded values allowed in components:

  * ❌ `#FFFFFF`
  * ❌ `16px`
  * ❌ `border-radius: 8px`

* Always use token variables:

  * ✅ `var(--color-primary)`
  * ✅ `var(--spacing-md)`
  * ✅ `var(--radius-sm)`

---

## 2. Token Categories

The system assumes the following token structure exists in `design-tokens.css`.

---

### 2.1 Colors (Semantic)

Tokens must be semantic, not raw.

#### Examples

* `--color-primary`
* `--color-primary-hover`
* `--color-secondary`
* `--color-background`
* `--color-surface`
* `--color-border`
* `--color-text-primary`
* `--color-text-secondary`
* `--color-success`
* `--color-warning`
* `--color-error`

#### Usage Rules

* Use semantic meaning, not visual guess
* Example:

  * Buttons → `--color-primary`
  * Errors → `--color-error`

---

### 2.2 Typography

#### Tokens

* `--font-family-base`
* `--font-size-xs`
* `--font-size-sm`
* `--font-size-md`
* `--font-size-lg`
* `--font-size-xl`
* `--font-weight-regular`
* `--font-weight-medium`
* `--font-weight-bold`
* `--line-height-base`

#### Usage Rules

* Do not define font sizes inline
* Maintain consistent hierarchy

---

### 2.3 Spacing

#### Tokens

* `--spacing-xs`
* `--spacing-sm`
* `--spacing-md`
* `--spacing-lg`
* `--spacing-xl`

#### Usage Rules

* All margins and padding must use spacing tokens
* Avoid arbitrary spacing values

---

### 2.4 Border Radius

#### Tokens

* `--radius-sm`
* `--radius-md`
* `--radius-lg`

---

### 2.5 Shadows

#### Tokens

* `--shadow-sm`
* `--shadow-md`
* `--shadow-lg`

---

### 2.6 Z-Index (Optional)

#### Tokens

* `--z-base`
* `--z-dropdown`
* `--z-modal`
* `--z-overlay`

---

## 3. Token Usage Rules

### 3.1 No Hardcoding

Never use raw values when a token exists.

---

### 3.2 Consistency First

* Same component → same tokens
* Do not override tokens locally unless necessary

---

### 3.3 Theming (Future-Ready)

* Tokens must support:

  * Light mode
  * Dark mode (future)

---

## 4. Integration with Tailwind CSS

### Approach

Tokens should be mapped into Tailwind config:

Example:

```js
theme: {
  extend: {
    colors: {
      primary: 'var(--color-primary)',
      background: 'var(--color-background)'
    }
  }
}
```

### Rules

* Tailwind classes should reference tokens indirectly
* Avoid mixing raw Tailwind colors (e.g. `bg-blue-500`) with tokens

---


## 5. Do’s and Don’ts

### ✅ Do

* Use semantic tokens
* Keep UI consistent
* Reference `design-tokens.css` always

### ❌ Don’t

* Hardcode values
* Mix token system with random styles
* Override tokens unnecessarily

---

## 6. Enforcement Rules (IMPORTANT)

You must:

* Reject hardcoded styles when a token exists
* Prefer tokens over Tailwind defaults
* Keep styling consistent across components
* Follow semantic usage (not visual guessing)

---

## 7. Future Extensions

* Dark mode tokens
* Brand theming
* Token scaling system
* Design system versioning

---
