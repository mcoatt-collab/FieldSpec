# FieldSpec – Tech Stack Specification

## Overview

This document defines the approved technologies and tools used in FieldSpec.

All development must adhere strictly to this stack.

---

## 1. Frontend

* Framework: Next.js (App Router)
* Library: React
* Styling: Tailwind CSS + `design-tokens.css`
* State Management: Zustand

### Rules

* No additional UI libraries
* No inline styles when tokens exist
* No alternative state libraries (e.g. Redux)

---

## 2. Backend

* Runtime: Node.js
* Framework: Next.js API routes (or Express if separated)
* Validation: Zod

### Rules

* All endpoints must be stateless
* All inputs must be validated

---

## 3. Database

* PostgreSQL

### Rules

* Follow `database-schema.md`
* No schema changes without updating documentation

---

## 4. AI Layer

* Provider: DeepSeek

### Rules

* Must follow `ai-spec.md`
* No direct frontend access to AI
* All outputs must be structured JSON

---

## 5. Queue System

* Redis
* BullMQ

### Rules

* All long-running tasks must use the queue
* No blocking API calls

---

## 6. Storage

* AWS S3 or Cloudinary
* CDN for delivery

### Rules

* Use signed URLs for uploads
* No file handling directly in backend

---

## 7. PDF Generation

* html2pdf.js

---

## 8. Maps

* Mapbox or Google Maps API

---

## 9. Development Tools

* Version Control: Git
* IDE: AI-assisted IDE (e.g. Antigravity)

---

## 10. Non-Allowed Tools

* Redux
* Firebase (unless explicitly added later)
* Uncontrolled AI integrations
* Random UI component libraries

---

## 11. Core Principle

Consistency over preference.

No developer or AI agent should introduce tools outside this stack.

---
## Routing

- Framework: Next.js App Router
- No external routing libraries allowed (e.g. React Router DOM)