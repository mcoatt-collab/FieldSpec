# FieldSpec – Database Schema (MVP)

## Overview

This document defines the relational database structure for FieldSpec.

Database:

* PostgreSQL

Goals:

* Support large image datasets (100–500 per project)
* Maintain strong relationships between entities
* Enable efficient querying and updates
* Support asynchronous AI workflows

---

## 1. Users Table

### Purpose

Store user account information.

### Fields

* id (UUID, PK)
* email (string, unique, required)
* password_hash (string, nullable for OAuth)
* auth_provider (enum: "email", "google")
* name (string, required)
* company_name (string, nullable)
* is_verified (boolean, default false)
* created_at (timestamp)
* updated_at (timestamp)


## 1.1 Auth_Tokens Table

### Purpose

Store secure, temporary tokens for authentication-related actions.

Used for:

* Email verification
* Password reset

---

### Fields

* id (UUID, PK)

* user_id (UUID, FK → Users.id)

* token_hash (string, required)
  // Store hashed version of token (never raw token)

* type (enum):

  * email_verification
  * password_reset

* expires_at (timestamp, required)

* is_used (boolean, default false)

* created_at (timestamp)

---

### Indexes

* index on user_id
* index on type
* index on expires_at

---

### Behaviour Rules

* Tokens must be:

  * Single-use (`is_used = true` after consumption)
  * Time-limited (checked via `expires_at`)

* Raw tokens:

  * Sent via email (SMTP)
  * NEVER stored in database

* On verification/reset:

  * Validate token
  * Mark as used
  * Reject if expired or already used

---

### Security Rules

* Token must be:

  * Cryptographically secure (random, high entropy)
  * Hashed before storage (e.g. SHA-256 or bcrypt)

* Do not expose whether token exists or not in API responses

---

### Cleanup Strategy

* Expired tokens should be:

  * Periodically deleted (cron job or worker)
  * Or ignored during queries

---

---

## 2. Clients Table

### Purpose

Store client information linked to projects.

### Fields

* id (UUID, PK)
* user_id (UUID, FK → Users.id)
* name (string, required)
* company (string, nullable)
* contact_info (jsonb, nullable)
* created_at (timestamp)
* updated_at (timestamp)

---

## 3. Projects Table (Survey Sessions)

### Purpose

Represent a survey/report project.

### Fields

* id (UUID, PK)
* user_id (UUID, FK → Users.id)
* client_id (UUID, FK → Clients.id, nullable)
* name (string, required)
* location (string, nullable)
* status (enum: "draft", "report_generated", "exported")
* photo_count (integer, default 0)
* map_snapshot_url (string, nullable)
* created_at (timestamp)
* updated_at (timestamp)

### Indexes

* index on user_id
* index on client_id
* index on status

---

## 4. Images Table

### Purpose

Store metadata for uploaded images.

### Fields

* id (UUID, PK)
* project_id (UUID, FK → Projects.id)
* url (string, required)
* thumbnail_url (string, required)
* category (enum):

  * crop_health
  * erosion
  * damage
  * irrigation
  * general
* notes (text, nullable)
* gps_lat (float, nullable)
* gps_lng (float, nullable)
* created_at (timestamp)

### Indexes

* index on project_id
* index on category

---

## 5. AI_Jobs Table

### Purpose

Track asynchronous AI processing jobs.

### Fields

* id (UUID, PK)
* project_id (UUID, FK → Projects.id)
* type (enum):

  * caption_generation
  * summary_generation
  * full_report
* status (enum):

  * pending
  * processing
  * completed
  * failed
* progress (integer, 0–100)
* error_message (text, nullable)
* created_at (timestamp)
* updated_at (timestamp)

### Indexes

* index on project_id
* index on status

---

## 6. AI_Outputs Table

### Purpose

Store AI-generated results for each image.

### Fields

* id (UUID, PK)
* image_id (UUID, FK → Images.id)
* caption (text)
* finding (text)
* recommendation (text)
* confidence_score (float, nullable)
* is_edited (boolean, default false)
* created_at (timestamp)
* updated_at (timestamp)

### Indexes

* index on image_id

---

## 7. Reports Table

### Purpose

Store generated report structure and metadata.

### Fields

* id (UUID, PK)
* project_id (UUID, FK → Projects.id)
* title (string)
* template_type (enum: "default")
* status (enum: "draft", "final")
* content (jsonb)  // structured report data
* exported_file_url (string, nullable)
* created_at (timestamp)
* updated_at (timestamp)

### Indexes

* index on project_id

---

## 8. Relationships Overview

* One User → Many Projects
* One User → Many Clients
* One Client → Many Projects
* One Project → Many Images
* One Project → Many AI_Jobs
* One Image → One AI_Output
* One Project → One Report

---

## 9. Data Integrity Rules

* All foreign keys must be enforced

* Cascade delete:

  * Deleting a project deletes:

    * Images
    * AI outputs
    * AI jobs
    * Report

* Category must always be a valid enum

* Status fields must follow defined enums

---

## 10. Performance Considerations

* Use indexes for:

  * project_id (high-frequency queries)
  * status filtering
  * category filtering

* Store large content (report) as JSONB for flexibility

* Avoid storing raw images in DB (use cloud storage)

---

## 11. Scalability Considerations

* Designed for large image datasets per project
* AI jobs decoupled from main data flow
* JSONB allows flexible report evolution
* Can extend to multi-user teams in future

---

## 12. Future Extensions (Not in MVP)

* Team/Workspace tables
* Role-based access control
* Version history for reports
* AI audit logs
* Multi-template support

---
