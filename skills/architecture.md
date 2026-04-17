# FieldSpec – System Architecture (MVP)

## Overview

FieldSpec is a distributed web application designed to handle large image datasets and asynchronous AI processing.

The system is composed of:

* Frontend (Client Application)
* Backend API (Control Layer)
* AI Processing Layer
* Queue System
* Storage Layer
* Database Layer

The architecture prioritises:

* Performance with large datasets (100–500 images)
* Asynchronous processing (AI workloads)
* Scalability
* Reliability

---

## 1. High-Level Architecture

### Components

1. Client (Frontend)
2. API Layer (Backend)
3. Queue System (Job Processing)
4. AI Layer (DeepSeek Integration)
5. Storage Layer (Images)
6. Database (Structured Data)

### Flow Summary

1. User interacts with frontend
2. Frontend sends request to backend API
3. Backend:

   * Validates input
   * Stores metadata
   * Queues AI jobs
4. Queue workers process jobs asynchronously
5. AI layer generates outputs
6. Results stored in database
7. Frontend polls or subscribes for updates

---

## 2. Frontend Architecture

### Stack

* Next.js (App Router)
* React (SPA behaviour)
* Tailwind CSS
* Zustand (state management)

### Responsibilities

* UI rendering
* User interactions
* State management
* API communication
* Optimistic updates

### Key Requirements

* No full page reloads
* Virtualised image grid (react-window)
* Lazy loading for images
* Real-time feedback for uploads and AI status

### Core Views

* Dashboard
* Upload & Image Grid
* Map View
* Report Builder
* Settings

---

## 3. Backend Architecture (Control Layer)

### Stack

* Node.js (Next.js API routes or Express)
* Zod (validation)

### Responsibilities

* API endpoints
* Authentication (JWT)
* Input validation
* Signed URL generation
* Queue job creation
* Data persistence

### Design Principles

* Stateless APIs
* Idempotent endpoints
* Strict schema validation

---

## 4. API Layer Design

### Core Endpoints

* POST /upload/initiate
  → Returns signed upload URL

* POST /images/metadata
  → Stores tags and notes

* POST /ai/generate
  → Creates AI job and queues it

* GET /ai/status/:jobId
  → Returns job progress

* POST /report/export
  → Triggers PDF generation

### Requirements

* All endpoints must be idempotent
* Must validate all inputs using schema
* Must not block on long-running tasks

---

## 5. Queue System (MANDATORY)

### Stack

* Redis
* BullMQ

### Purpose

Handle all asynchronous and heavy operations.

### Why It’s Critical

* AI processing is slow and unpredictable
* Prevents API blocking
* Enables retries and scaling

### Job Types

* Image caption generation
* Section summary generation
* Full report synthesis

### Behaviour

* Jobs processed in background workers
* Retry failed jobs automatically
* Track job progress (status, percentage)

---

## 6. AI Layer (Controlled Intelligence System)

### Provider

* DeepSeek API

### Access Pattern

* Backend-only (never directly from frontend)
* Through secure API proxy

### Responsibilities

* Generate captions
* Generate findings
* Generate recommendations

### Constraints

* Strict input schema
* Strict JSON output
* No free-form prompts

### Validation Layer

* Validate AI output using schema (Zod)
* Reject invalid responses
* Retry with stricter prompts if needed

---

## 7. Image Storage Layer

### Stack

* AWS S3 or Cloudinary
* CDN (CloudFront or equivalent)

### Responsibilities

* Store original images
* Store thumbnails
* Serve images efficiently

### Requirements

* Signed URL uploads
* Direct-to-cloud upload (bypass backend)
* Fast CDN delivery
* Thumbnail-first loading

### Performance Strategy

* Lazy loading (Intersection Observer)
* Virtualised rendering
* Optimised image sizes

---

## 8. Database Architecture

### Stack

* PostgreSQL

### Responsibilities

* Store structured data:

  * Users
  * Projects
  * Images
  * AI jobs
  * AI outputs
  * Reports

### Design Principles

* Normalised schema
* Strong relationships between entities
* Efficient querying for large datasets

---

## 9. State Management Strategy (Frontend)

### Tool

* Zustand (preferred)

### State Domains

* Upload state (progress, files)
* Image tagging state
* AI job status
* Report editing state
* UI state (filters, selections)

### Requirements

* Minimal re-renders
* Predictable updates
* Separation of UI vs data state

---

## 10. Report Rendering Engine

### Approach

* HTML-based rendering using React components

### Responsibilities

* Convert report data into structured layout
* Support dynamic sections
* Prepare content for export

---

## 11. PDF Export Engine

### Tool

* html2pdf.js

### Responsibilities

* Convert HTML report into PDF

### Requirements

* Print-specific CSS
* Page break control
* Asset preloading before export
* Prevent layout breaking

---

## 12. Security Architecture

### Authentication

* JWT-based authentication

### File Upload Security

* Signed URLs (temporary, secure access)

### API Protection

* Rate limiting (especially AI endpoints)

### Input Sanitisation

* Validate and clean all user inputs
* Prevent prompt injection into AI system

---

## 13. Performance Strategy

### Key Requirements

* Handle 100–500 images per project
* Maintain UI responsiveness
* Avoid blocking operations

### Techniques

* Virtualised lists (image grid)
* Lazy loading
* Background job processing
* Batch AI processing (10–20 images per batch)

---

## 14. Scalability Considerations

* Queue-based architecture allows horizontal scaling
* Stateless API allows load balancing
* CDN ensures fast global image delivery
* Database indexing for large datasets

---

## 15. Failure Handling & Recovery

### AI Failures

* Retry jobs automatically
* Fallback to manual editing

### Upload Failures

* Retry upload
* Resume interrupted uploads

### Export Failures

* Retry export
* Provide user feedback

### System Resilience

* No single point of failure in critical flows
* Background processing ensures UI stability

---

## 16. Non-Goals (MVP)

* No real-time collaboration
* No offline mode
* No third-party integrations
* No multi-tenant team architecture (yet)

---
## 17. Email Service (SMTP)
### Purpose

Handle transactional emails within the system.

### Use Cases (MVP / Near Future)

* User signup confirmation
* Password reset
* Report export notification (optional)
* System alerts

### Protocol

* SMTP (Simple Mail Transfer Protocol)

### Integration Options

* Nodemailer (Node.js)
* External providers (e.g. SendGrid, Mailgun)

### Architecture Placement

* Email sending must be handled by backend only
* Never exposed directly to frontend

### Processing Strategy

* Emails must be sent asynchronously via queue (BullMQ)
* Must not block API responses

### Security

* Store SMTP credentials in environment variables
* Do not expose credentials in client-side code

### Failure Handling

* Retry failed email jobs
* Log failures for debugging