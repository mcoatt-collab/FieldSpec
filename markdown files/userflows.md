# FieldSpec – User Flows (MVP)

## Overview

This document defines the step-by-step user interactions within FieldSpec.

Each flow represents a complete user journey and is designed to:

* Minimise friction
* Support large image workflows (100–500 images)
* Enable fast report generation
* Maintain clarity and control over AI outputs

---

## Flow 1: User Onboarding

### Goal

Allow a new user to create an account and start their first report in under 3 minutes.

### Steps

1. User lands on landing page

2. Clicks "Sign Up"

3. Authentication

   * Option A: Email + Password
   * Option B: Google OAuth

4. Basic Profile Setup

   * Input:

     * Name (required)
     * Company Name (optional)

5. Redirect to Dashboard

### System Behaviour

* Create new user record
* Initialize empty dashboard state
* Auto-focus on primary CTA: "+ New Report"

---

## Flow 2: Create New Report

### Goal

Start a new project and prepare for image upload

### Steps

1. User clicks "+ New Report"

2. Modal/Input appears:

   * Project Name (required)

3. User submits

4. System creates project:

   * status = "draft"
   * photo_count = 0
   * created_at timestamp

5. Redirect to Upload Screen

---

## Flow 3: Upload & Organise Images

### Goal

Upload and prepare large batches of images efficiently

### Steps

1. User uploads images

   * Drag & drop OR file picker
   * Supported formats: JPEG, PNG, TIFF

2. System Behaviour

   * Generate signed upload URLs
   * Upload directly to storage (S3/Cloudinary)
   * Show upload progress (per file + batch)

3. After upload:

   * Display images in a virtualised grid
   * Generate thumbnails

4. Auto-grouping (basic)

   * Group by:

     * Time
     * GPS proximity (if available)

5. Tagging & Notes

   * For each image:

     * Select category:

       * crop_health
       * erosion
       * damage
       * irrigation
       * general
     * Add short note (optional)

6. Bulk Actions

   * Multi-select images
   * Apply tag to multiple images

7. Filtering

   * Filter grid by category
   * Show tagged vs untagged

### System Constraints

* Must handle 100–500 images without UI lag
* Use virtualised rendering for performance

---

## Flow 4: Map Review

### Goal

Provide spatial context and validate image locations

### Steps

1. User navigates to "Map View"

2. System displays:

   * Map with markers for each image
   * Marker color based on category

3. User interactions:

   * Click marker → show:

     * Image preview
     * Tags
     * Notes

4. Adjust marker position

   * Drag marker to correct GPS inaccuracies

5. Filtering

   * Toggle categories on/off

6. Save Map Snapshot

   * User clicks "Save Map View"
   * Snapshot stored for report inclusion

---

## Flow 5: Generate Report

### Goal

Convert tagged images + notes into structured report

### Steps

1. User clicks "Generate Report"

2. System triggers AI pipeline:

   * Queue job (Redis + BullMQ)

3. AI Processing (asynchronous)

   * Image caption generation
   * Category-based grouping
   * Findings generation
   * Recommendations generation

4. Output Structure

   * Cover Page
   * Introduction
   * Sections by category
   * Image annotations (caption per image)
   * Summary of findings
   * Recommendations

5. Progress Feedback

   * Show loading state
   * Show progress indicator (e.g. % or steps)

6. On completion:

   * Update project status → "report_generated"
   * Redirect to Report Builder

---

## Flow 6: Report Builder & Insight Trace

### Goal

Allow user to review, validate, and edit AI-generated content

### Steps

1. Display report in structured layout

2. For each AI-generated insight:

   * Show:

     * Caption / Finding / Recommendation
     * Confidence score
     * "AI Generated" label

3. Insight Trace

   * "View Source" action:

     * Highlight related images + notes

4. User Actions:

   * Accept (no change)
   * Edit text
   * Reject (remove)

5. Editing Capabilities:

   * Edit any text
   * Reorder sections
   * Add/remove images

6. Auto-save

   * Changes persist in real-time

---

## Flow 7: Export & Archive

### Goal

Deliver final report and store project

### Steps

1. User clicks "Export"

2. System validation:

   * Check for:

     * Untagged images
     * Empty sections
   * Show warnings if needed

3. Export options:

   * Download PDF
   * (Future: shareable link)

4. System generates PDF:

   * Apply print styles
   * Ensure layout consistency

5. On success:

   * status → "exported"

6. Save report metadata

---

## Flow 8: Dashboard & Project Management

### Goal

Allow users to manage all reports efficiently

### Dashboard View

Displays list of projects:

* Project Name
* Date
* Photo Count
* Last Edited
* Status:

  * Draft
  * Report Generated
  * Exported

### User Actions

For each project:

* Continue Editing
* Generate Report
* Export PDF
* Duplicate Project

### Search & Filter

* Search by project name
* Filter by date

---

## Global System Rules

### Performance

* No full page reloads
* Optimistic UI updates for tagging
* Background processing for AI

### Data Integrity

* All actions must be idempotent
* Auto-save enabled throughout flows

### AI Behaviour

* AI outputs must always be:

  * Structured
  * Editable
  * Traceable

### Error Handling

* Upload failures → retry option
* AI failures → fallback to manual editing
* Export failures → retry with feedback

---

## Edge Cases

* User uploads unsupported file → reject with message
* Missing GPS data → map still functional (no marker)
* User skips tagging → warning before report generation
* AI job fails → allow manual report creation
* Large upload interruption → resume capability

---
