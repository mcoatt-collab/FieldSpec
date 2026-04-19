# FieldSpec – AI Specification (DeepSeek Integration)

## Overview

This document defines how AI operates within FieldSpec.

AI is used to:

* Generate image captions
* Produce findings and recommendations
* Assist in report synthesis

AI is strictly controlled and must:

* Follow predefined input schemas
* Return structured JSON outputs only
* Remain fully editable by the user

Provider:

* DeepSeek (via backend API proxy)

---

## 1. AI Design Principles

### 1.1 Controlled Intelligence

* AI is not autonomous
* AI does not make final decisions
* AI outputs must always be editable

### 1.2 Deterministic Structure

* No free-form responses
* All outputs must follow strict JSON schema

### 1.3 Transparency

* Every AI output must:

  * Show confidence score
  * Link to source images (Insight Trace)

### 1.4 Performance

* AI must operate asynchronously
* Batch processing required (10–20 images per job)

---

## 2. AI System Architecture

### Flow

1. Frontend sends structured request → Backend
2. Backend:

   * Normalises input
   * Validates schema
   * Queues AI job
3. Worker:

   * Calls DeepSeek API
   * Receives structured output
4. Validation Layer:

   * Validates JSON response (Zod)
   * Rejects invalid outputs
5. Store result in database
6. Frontend fetches updated results

---

## 3. Input Schema (MANDATORY)

All AI requests must follow this structure:

{
"category": "crop_health",
"user_note": "Yellowing leaves in section B",
"context": "Maize farm, 5 acres"
}

### Rules

* category must be a predefined enum
* user_note is optional but recommended
* context is project-level metadata

### Constraints

* No raw user prompts sent directly to AI
* All inputs must be normalised before sending

---

## 4. Output Schema (STRICT)

AI must return ONLY this structure:

{
"caption": "string",
"finding": "string",
"recommendation": "string"
}

### Rules

* No additional fields allowed
* No markdown or formatting
* No explanations outside JSON

---

## 5. Prompt Engineering (DeepSeek)

### System Role Definition

"You are an agricultural and land survey analyst.
You analyse drone imagery data and produce clear, professional, and structured observations."

---

### Prompt Structure

Each request must include:

1. Role definition
2. Context (project-level)
3. Image category
4. User note
5. Explicit output format requirement

---

### Example Prompt

"You are an agricultural survey analyst.

Context:
Maize farm, 5 acres.

Category:
crop_health

User note:
Yellowing leaves in section B.

Task:
Generate a structured analysis.

Output format (STRICT JSON):
{
"caption": "...",
"finding": "...",
"recommendation": "..."
}

Rules:

* Be concise and professional
* Use domain-specific language
* Do not include uncertainty (e.g., 'maybe', 'possibly')
* Do not include text outside JSON"

---

## 6. AI Processing Types

### 6.1 Caption Generation

* Runs per image
* Produces:

  * caption
  * finding
  * recommendation

---

### 6.2 Section-Level Summarisation

* Groups images by category
* Produces:

  * summary of findings
  * aggregated recommendations

---

### 6.3 Full Report Synthesis (Optional in MVP)

* Combines all outputs into structured report sections

---

## 7. Validation Layer (CRITICAL)

### Steps

1. Validate JSON format
2. Validate required fields:

   * caption
   * finding
   * recommendation
3. Reject:

   * malformed JSON
   * missing fields
   * extra fields

### On Failure

* Retry with stricter prompt
* If still failing:

  * Return empty structured fallback
  * Flag for manual editing

---

## 8. Confidence Scoring

### Purpose

Build trust in AI outputs

### Approach (MVP)

* Heuristic-based score:

  * Input completeness
  * Category clarity
  * Note presence

### Output

* confidence_score (0–100%)

---

## 9. Human-in-the-Loop Editing

### Rules

* All AI outputs must be editable
* Track:

  * original AI output
  * user-edited version

### Field

* is_edited (boolean)

---

## 10. Batch Processing Strategy

### Rules

* Process images in batches (10–20 per job)
* Parallel execution with rate limiting
* Queue-based processing (BullMQ)

### Benefits

* Prevent API overload
* Improve performance
* Enable retries

---

## 11. Rate Limiting & Cost Control

### Requirements

* Limit requests per user
* Track monthly usage
* Prevent abuse

---

## 12. Fallback Strategy

If AI fails:

1. Generate empty structured template:
   {
   "caption": "",
   "finding": "",
   "recommendation": ""
   }

2. Allow manual user input

---

## 13. Safety & Input Sanitisation

### Requirements

* Clean user notes before sending to AI
* Remove:

  * scripts
  * malicious instructions
  * prompt injection attempts

---

## 14. Non-Goals (MVP)

* No conversational AI
* No free-form prompting
* No autonomous decision-making
* No domain-specific fine-tuning (yet)

---

## 15. Future Enhancements

* Smarter auto-tagging
* Cross-image reasoning
* Domain-specific fine-tuned models
* Improved confidence scoring (ML-based)
* Multi-language support

---
