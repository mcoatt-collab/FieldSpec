# FieldSpec – API Specification (MVP)

## Overview

This document defines all backend API endpoints for FieldSpec.

Principles:

* RESTful design
* JSON-based communication
* Strict validation (Zod)
* Idempotent operations
* No long-running operations in request/response cycle

Base URL:
`/api`

Authentication:

* JWT (Bearer token required for all protected routes)

---

## 1. Authentication

### POST /auth/signup

#### Purpose

Create a new user account

#### Request

{
"email": "string",
"password": "string",
"name": "string",
"company_name": "string (optional)"
}

#### Response

{
"token": "jwt_token",
"user": {
"id": "uuid",
"email": "string",
"name": "string"
}
}

---

### POST /auth/login

#### Purpose

Authenticate existing user

#### Request

{
"email": "string",
"password": "string"
}

#### Response

{
"token": "jwt_token"
}

---

## 2. Projects

### POST /projects

#### Purpose

Create new project

#### Request

{
"name": "string",
"client_id": "uuid (optional)"
}

#### Response

{
"id": "uuid",
"name": "string",
"status": "draft"
}

---

### GET /projects

#### Purpose

Fetch all user projects

#### Query Params

* search (optional)
* status (optional)
* date_from (optional)
* date_to (optional)

#### Response

[
{
"id": "uuid",
"name": "string",
"status": "draft",
"photo_count": 0,
"created_at": "timestamp"
}
]

---

### GET /projects/:id

#### Purpose

Fetch single project

#### Response

{
"id": "uuid",
"name": "string",
"status": "draft",
"images": [...],
"report": {...}
}

---

## 3. Image Upload

### POST /upload/initiate

#### Purpose

Generate signed upload URL

#### Request

{
"file_name": "string",
"file_type": "string",
"project_id": "uuid"
}

#### Response

{
"upload_url": "string",
"file_url": "string"
}

---

### POST /images/metadata

#### Purpose

Store image metadata after upload

#### Request

{
"project_id": "uuid",
"images": [
{
"url": "string",
"thumbnail_url": "string",
"gps_lat": "number (optional)",
"gps_lng": "number (optional)"
}
]
}

#### Response

{
"success": true
}

---

## 4. Image Tagging

### PATCH /images/:id

#### Purpose

Update image category and notes

#### Request

{
"category": "crop_health | erosion | damage | irrigation | general",
"notes": "string"
}

#### Response

{
"id": "uuid",
"category": "string",
"notes": "string"
}

---

## 5. AI Processing

### POST /ai/generate

#### Purpose

Trigger AI processing for a project

#### Request

{
"project_id": "uuid"
}

#### Response

{
"job_id": "uuid",
"status": "pending"
}

---

### GET /ai/status/:jobId

#### Purpose

Check AI job progress

#### Response

{
"job_id": "uuid",
"status": "pending | processing | completed | failed",
"progress": 0
}

---

## 6. Reports

### GET /reports/:projectId

#### Purpose

Fetch generated report

#### Response

{
"project_id": "uuid",
"content": { ...structured report JSON... },
"status": "draft | final"
}

---

### PATCH /reports/:projectId

#### Purpose

Update report content (user edits)

#### Request

{
"content": { ...updated report JSON... }
}

#### Response

{
"success": true
}

---

## 7. Export

### POST /report/export

#### Purpose

Generate PDF report

#### Request

{
"project_id": "uuid"
}

#### Response

{
"file_url": "string",
"status": "completed"
}

---

## 8. Map

### POST /projects/:id/map-snapshot

#### Purpose

Save map snapshot for report

#### Request

{
"image_url": "string"
}

#### Response

{
"success": true
}

---

## 9. Clients (Basic MVP)

### POST /clients

#### Request

{
"name": "string",
"company": "string (optional)"
}

#### Response

{
"id": "uuid"
}

---

### GET /clients

#### Response

[
{
"id": "uuid",
"name": "string"
}
]

---

## 10. Error Handling

### Standard Error Response

{
"error": {
"message": "string",
"code": "string"
}
}

---

## 11. API Rules

* All endpoints must:

  * Validate input (Zod)
  * Return consistent JSON
  * Be idempotent where applicable

* No endpoint should:

  * Block on AI processing
  * Perform heavy computation synchronously

---

## 12. Status Codes

* 200 → Success
* 201 → Created
* 400 → Bad Request
* 401 → Unauthorized
* 404 → Not Found
* 500 → Internal Error

---
## 13. Email Verification

### POST /auth/send-verification

#### Purpose

Send email verification link to user

#### Request

{
"email": "string"
}

#### Response

{
"success": true
}

#### Behaviour

* Generate secure verification token
* Store token (hashed) with expiry
* Queue email job (SMTP)
* Send verification link:
  `/auth/verify-email?token=...`

---

### GET /auth/verify-email

#### Purpose

Verify user email

#### Query Params

* token

#### Response

{
"success": true
}

#### Behaviour

* Validate token
* Mark user as verified
* Invalidate token

---

## 14. Password Reset

### POST /auth/forgot-password

#### Purpose

Send password reset email

#### Request

{
"email": "string"
}

#### Response

{
"success": true
}

#### Behaviour

* Generate secure reset token
* Store token (hashed) with expiry
* Queue email job (SMTP)
* Send reset link:
  `/auth/reset-password?token=...`

---

### POST /auth/reset-password

#### Purpose

Reset user password

#### Request

{
"token": "string",
"new_password": "string"
}

#### Response

{
"success": true
}

#### Behaviour

* Validate token
* Hash new password
* Update user record
* Invalidate token

---

## 15. Email Job Handling (Internal)

### Notes

* All email sending must:

  * Use SMTP via backend
  * Be processed through queue (BullMQ)

* Email types:

  * verification_email
  * password_reset_email

* Jobs must:

  * Retry on failure
  * Log status

---

## 16. Security Considerations (Auth)

* Tokens must:

  * Be cryptographically secure
  * Have expiry (e.g. 15–60 minutes)
  * Be single-use

* Store tokens hashed (not raw)

* Do not reveal whether email exists in system (for forgot password)

---
