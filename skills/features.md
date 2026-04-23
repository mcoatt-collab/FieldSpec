# FieldSpec – Features Specification (MVP)

## Overview

This document defines all MVP features as modular, buildable units.

Each feature includes:

* Purpose
* Inputs
* Outputs
* Core behaviour
* Edge cases

---

## 1. Photo Upload & Organisation

### Purpose

Allow users to upload, view, and organise large volumes of drone images efficiently.

### Inputs

* Image files (JPEG, PNG, TIFF)
* Project ID

### Outputs

* Stored image URLs
* Thumbnail previews
* Image metadata records

### Core Behaviour

* Drag-and-drop and file picker upload
* Use signed URLs for direct-to-cloud upload
* Show upload progress (per file + batch)
* Generate thumbnails after upload
* Display images in a virtualised grid
* Support 100–500 images without lag

### Additional Capabilities

* Delete image
* Replace image
* Retry failed upload

### Edge Cases

* Unsupported file type → reject with message
* Upload failure → retry option
* Large batch upload interruption → resume support

---

## 2. Image Tagging & Notes

### Purpose

Enable users to categorise images and provide context for AI processing.

### Inputs

* Image ID
* Category (enum)
* User note (string)

### Category Enum

* crop_health
* erosion
* damage
* irrigation
* general

### Outputs

* Updated image metadata

### Core Behaviour

* Tag individual images
* Add/edit notes per image
* Bulk tagging (multi-select)
* Filter images by category
* Show tagged vs untagged state

### Edge Cases

* No tag applied → flagged before report generation
* Empty notes → allowed but may reduce AI quality

---

## 3. Map Visualisation

### Purpose

Provide spatial context for survey images using geolocation data.

### Inputs

* Image metadata (GPS coordinates)
* Category

### Outputs

* Map with image markers
* Map snapshot for report

### Core Behaviour

* Display markers for each image
* Color-code markers by category
* Click marker → show image preview + notes
* Allow marker reposition (manual correction)
* Filter markers by category
* Save map snapshot for report inclusion

### Edge Cases

* Missing GPS data → image not shown on map
* Incorrect GPS → user can manually adjust

---

## 4. AI Caption Generation

### Purpose

Generate structured captions for each image.

### Inputs

* Image ID
* Category
* User note
* Context (project-level)

### Outputs

* Caption (string)

### Core Behaviour

* Process images in batches (10–20 per job)
* Use queue system (async processing)
* Return structured caption per image

### Constraints

* Must follow strict schema
* No free-form responses

### Edge Cases

* AI failure → retry or fallback to empty caption
* Poor user input → low-quality output

---

## 5. AI Findings & Recommendations

### Purpose

Generate higher-level insights from grouped images.

### Inputs

* Tagged images (by category)
* User notes
* Context

### Outputs

* Findings (string)
* Recommendations (string)

### Core Behaviour

* Group images by category
* Generate section-level summaries
* Produce actionable recommendations

### Constraints

* Output must be structured and editable
* No speculative or uncertain language

### Edge Cases

* Sparse data → minimal output
* Conflicting inputs → generic recommendation

---

## 6. Report Generation Engine

### Purpose

Convert AI outputs into a structured report.

### Inputs

* Project data
* AI outputs (captions, findings, recommendations)
* Map snapshot

### Outputs

* Structured report object

### Report Structure

* Cover Page
* Introduction
* Sections (by category)
* Image Annotations
* Summary of Findings
* Recommendations

### Core Behaviour

* Automatically organise content into sections
* Attach captions to corresponding images
* Inject map snapshot into report

### Edge Cases

* Missing data → skip section gracefully
* Untagged images → excluded or flagged

---

## 7. Report Builder (Editable)

### Purpose

Allow users to review and modify AI-generated reports.

### Inputs

* Generated report object

### Outputs

* Updated report content

### Core Behaviour

* Edit text (captions, findings, recommendations)
* Reorder sections
* Add/remove images
* Real-time auto-save

### Insight Trace

* Show source images for each AI insight
* Display confidence score
* Highlight related inputs

### Edge Cases

* User deletes critical content → allowed (no restriction)
* Large reports → must remain responsive

---

## 8. Export System

### Purpose

Generate a client-ready PDF report.

### Inputs

* Final report content

### Outputs

* Downloadable PDF

### Core Behaviour

* Convert HTML report to PDF
* Apply print styles
* Ensure consistent layout
* Preload all assets before export

### Constraints

* Export time < 10 seconds
* High reliability (>98%)

### Edge Cases

* Export failure → retry option
* Missing assets → block export with warning

---

## 9. Project Dashboard & Management

### Purpose

Provide an overview and management of all reports.

### Inputs

* User projects

### Outputs

* Project list view

### Core Behaviour

* Display projects (card or table view)
* Show metadata:

  * Name
  * Date
  * Photo count
  * Status
* Status types:

  * Draft
  * Report Generated
  * Exported

### Actions

* Continue editing
* Generate report
* Export PDF
* Duplicate project

### Edge Cases

* No projects → empty state UI
* Large number of projects → pagination or lazy loading

---

## 10. Project Saving & Persistence

### Purpose

Ensure all work is saved and recoverable.

### Inputs

* Project state changes

### Outputs

* Persisted project data

### Core Behaviour

* Auto-save on all edits
* Resume editing from last state
* Maintain version consistency

### Constraints

* No data loss during normal use

### Edge Cases

* Network interruption → retry save
* Conflict state (future multi-user) → not applicable in MVP

---

## 11. Basic User Settings

### Purpose

Allow minimal profile customisation.

### Inputs

* Name
* Company name

### Outputs

* Updated user profile

### Core Behaviour

* Edit profile details
* Reflect company name in report cover

### Edge Cases

* Empty company name → omit from report

---

## System-Wide Constraints

* Must support 100–500 images per project
* AI processing must be asynchronous
* All AI outputs must be editable
* UI must remain responsive at all times
* No blocking operations on main thread

---

# appearance

- Read the code structure 
- In the split container, the content doesn't fit in the container, vertically
- Make the hieght of the split container ajust to the content hieght.