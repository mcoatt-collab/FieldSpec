# FieldSpec – Product Requirements Document (MVP)

## 1. Product Overview

FieldSpec is an AI-powered web platform that transforms drone-captured survey images into structured, professional, client-ready reports.

It enables drone operators, agronomists, and survey professionals to go from raw image data to actionable insights in minutes instead of hours.

---

## 2. Problem Statement

Drone operators capture large volumes of images during surveys but lack an efficient way to convert them into structured reports.

Current workflow issues:

* No unified system for managing images and building reports
* Manual sorting and annotation is time-consuming and error-prone
* Reports are inconsistent in structure and quality
* Insights from field observations are often lost
* Scaling reporting across multiple clients is difficult

---

## 3. Product Goal (MVP)

Reduce report creation time from 2–6 hours to under 15 minutes by automating:

* Image annotation
* Caption generation
* Findings and recommendations
* Report structuring and formatting

---

## 4. Target Users

### Primary Users

* Drone Operators & Surveyors
* Agronomists & Agricultural Consultants
* Construction & Infrastructure Inspectors
* Environmental Analysts
* Drone Service Agencies

---

## 5. Core User Workflow

1. User creates a new report
2. Uploads drone images (100+ supported)
3. Tags images and adds notes
4. Reviews images on a map
5. Generates AI report
6. Reviews and edits content
7. Exports report (PDF)
8. Saves and manages project

---

## 6. MVP Features

### 6.1 Image Upload & Organisation

* Drag-and-drop upload
* Support for multiple images
* Image tagging (crop health, erosion, damage, etc.)
* Filtering by category

### 6.2 AI Report Generation

* Generate captions per image
* Generate findings and recommendations
* Structured report output

### 6.3 Report Template (Single)

* Sections:

  * Introduction
  * Findings
  * Recommendations
  * Image Annotations

### 6.4 Editable Report Preview

* Users can edit AI-generated content
* Basic text editing only

### 6.5 Export System

* Export report as PDF
* Clean, client-ready format

### 6.6 Project Saving

* Save reports in-app
* Resume editing later

### 6.7 Insight Trace

* Show source images for each AI insight
* Display confidence score
* Label AI-generated content

### 6.8 Map Visualisation

* Display image markers on map
* Color-coded by category
* Click to preview image + notes
* Adjust marker positions
* Export map snapshot

### 6.9 Dashboard & History

* View all projects
* Project metadata:

  * Name
  * Date
  * Photo count
  * Status
* Actions:

  * Continue editing
  * Export
  * Duplicate

---

## 7. Success Metrics

### Efficiency

* Report creation time < 15 minutes
* 60%+ time saved

### AI Quality

* < 30% manual edits required
* User satisfaction ≥ 4/5

### Usage

* 2–3 reports per user per week
* 30-day retention > 40%

### Reliability

* PDF export success > 98%
* Export time < 10 seconds

---

## 8. Constraints (MVP)

* Single user per account
* One report template only
* No team collaboration
* No external integrations
* AI requires structured input (no free-form prompts)

---

## 9. Key Principles

* AI is assistive, not authoritative
* All AI output must be editable
* System must remain fast with large image sets (100–500 images)
* Outputs must be consistent and professional
* UX must be simple enough for non-technical users

---

## 10. Risks

* Poor input → poor AI output
* Low-quality images reduce accuracy
* Users may not trust AI-generated insights
* Large file handling may affect performance

Mitigation:

* Insight Trace + confidence scores
* Editable outputs
* Validation and structured inputs
