# FieldSpec – Agents Specification (MVP)

## Overview

This document defines the internal system agents responsible for executing tasks within FieldSpec.

Agents are modular workers that:

* Perform specific responsibilities
* Operate asynchronously where required
* Communicate via the queue system (Redis + BullMQ)

Goals:

* Separation of concerns
* Scalable processing
* Reliable AI execution
* Non-blocking user experience

---

## 1. Agent Architecture

### Core Principles

* Each agent has a single responsibility
* Agents do not directly depend on UI
* All long-running tasks must be handled asynchronously
* Communication between agents happens via jobs (queue)

---

## 2. Agent Types

### 2.1 Upload Agent

#### Purpose

Handle secure image uploads and storage preparation.

#### Responsibilities

* Generate signed upload URLs
* Validate file type and size
* Confirm upload completion
* Trigger thumbnail generation

#### Inputs

* File metadata
* Project ID

#### Outputs

* Image record (DB)
* Storage URL

#### Notes

* Does NOT store files directly (uses S3/Cloudinary)

---

### 2.2 Image Processing Agent

#### Purpose

Prepare images for use in the system.

#### Responsibilities

* Generate thumbnails
* Extract metadata (EXIF, GPS)
* Optimise images for delivery

#### Inputs

* Raw image file

#### Outputs

* Thumbnail URL
* GPS coordinates
* Processed metadata

---

### 2.3 Tagging Support Agent (Optional – MVP Lite)

#### Purpose

Assist with image categorisation (future enhancement).

#### Responsibilities

* Suggest categories based on metadata or patterns

#### Notes

* Not required for MVP (manual tagging is primary)

---

### 2.4 AI Caption Agent

#### Purpose

Generate captions, findings, and recommendations per image.

#### Responsibilities

* Consume image + metadata
* Format AI input schema
* Call DeepSeek API
* Return structured output

#### Inputs

* Image ID
* Category
* User note
* Context

#### Outputs

* caption
* finding
* recommendation

#### Constraints

* Must follow strict AI schema
* Must NOT return unstructured text

---

### 2.5 AI Summary Agent

#### Purpose

Generate category-level insights from grouped images.

#### Responsibilities

* Aggregate images by category
* Generate:

  * Summary of findings
  * Consolidated recommendations

#### Inputs

* Grouped AI outputs
* Project context

#### Outputs

* Section-level summaries

---

### 2.6 Report Synthesis Agent

#### Purpose

Construct the final report structure.

#### Responsibilities

* Combine:

  * Project metadata
  * AI outputs
  * Map snapshot
* Organise into sections

#### Inputs

* Project data
* AI outputs
* Map data

#### Outputs

* Structured report object (JSON)

---

### 2.7 Validation Agent (CRITICAL)

#### Purpose

Ensure all AI outputs are valid and safe.

#### Responsibilities

* Validate JSON structure (Zod)
* Enforce required fields:

  * caption
  * finding
  * recommendation
* Reject invalid responses
* Trigger retry logic if needed

#### Inputs

* Raw AI response

#### Outputs

* Validated AI output OR rejection

---

### 2.8 Queue Worker Agent

#### Purpose

Execute all background jobs.

#### Responsibilities

* Process jobs from Redis queue
* Handle:

  * AI generation
  * Image processing
  * Report generation
* Retry failed jobs
* Update job status

#### Job Types

* caption_generation
* summary_generation
* full_report

---

### 2.9 Export Agent

#### Purpose

Generate final PDF reports.

#### Responsibilities

* Convert report JSON → HTML
* Render PDF (html2pdf.js)
* Ensure layout integrity
* Store exported file

#### Inputs

* Final report content

#### Outputs

* PDF file URL

---

### 2.10 Notification Agent (Optional – MVP Lite)

#### Purpose

Provide user feedback on long processes.

#### Responsibilities

* Notify user when:

  * AI job completes
  * Export is ready

#### Notes

* MVP can rely on polling instead

---

## 3. Agent Interaction Flow

### Example: Report Generation

1. User clicks "Generate Report"

2. Backend creates AI job → Queue

3. Queue Worker triggers:

   * AI Caption Agent (per batch)
   * Validation Agent (per response)

4. After all images processed:

   * AI Summary Agent runs

5. Report Synthesis Agent:

   * Builds report structure

6. Store final report in database

---

## 4. Job Lifecycle

### Status States

* pending
* processing
* completed
* failed

### Behaviour

* Jobs must be retryable
* Failures must not crash system
* Progress must be trackable (0–100%)

---

## 5. Error Handling Strategy

### AI Failures

* Retry with stricter prompt
* Fallback to empty structured output

### Processing Failures

* Retry job automatically
* Log error message

### Export Failures

* Retry PDF generation
* Notify user

---

## 6. Scaling Strategy

* Agents are stateless
* Queue allows horizontal scaling
* Multiple workers can process jobs concurrently

---

## 7. Constraints (MVP)

* No real-time agent communication
* No multi-agent orchestration engine (simple queue only)
* No autonomous decision-making agents

---

## 8. Design Rules

* Agents must never block the main thread
* Agents must never bypass validation
* Agents must log all critical actions
* Agents must remain modular and replaceable

---
