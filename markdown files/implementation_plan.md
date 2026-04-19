# FieldSpec – Refined Implementation Plan (MVP)

> **Confirmed Technology Choices:** Storage → **Cloudinary** | Maps → **Mapbox GL JS** | Email → **Resend**

## Overview

This document defines the complete, phased build plan for the FieldSpec SaaS platform.
No code is produced until this plan is approved.

> [!IMPORTANT]
> This plan strictly follows the constraints defined in `tech_stack.md`, `architecture.md`, `layouts.md`, `ux_rules.md`, `ai_spec.md`, `agents.md`, and `database_schema.md`. All design decisions are governed by `design-tokens.css`.

---

## User Review Required

> [!NOTE]
> **Storage Provider**: ✅ **Confirmed — Cloudinary**. Pre-signed direct upload strategy will be used.

> [!NOTE]
> **Maps Provider**: ✅ **Confirmed — Mapbox GL JS**. `react-map-gl` wrapper will be used.

> [!NOTE]
> **Email Provider**: ✅ **Confirmed — Resend**. Nodemailer will use Resend's SMTP relay (`smtp.resend.com`). API key required from resend.com.

---

## Phase 0 – Project Setup

### 0.1 Bootstrap

- Initialise Next.js with App Router, TypeScript, and Tailwind enabled.
- Install all dependencies upfront (see below).

### 0.2 Core Dependencies

| Package | Purpose |
|---|---|
| `prisma` + `@prisma/client` | ORM & DB access |
| `zod` | Schema validation (API & AI) |
| `zustand` | Global frontend state |
| `bullmq` + `ioredis` | Queue + Redis |
| `jsonwebtoken` + `bcryptjs` | JWT auth + password hashing |
| `nodemailer` | SMTP email via **Resend** (confirmed) |
| `cloudinary` | Image storage + CDN delivery (**confirmed**) |
| `jspdf` + `html2canvas` | PDF export |
| `mapbox-gl` + `react-map-gl` | Interactive map — **Mapbox GL JS (confirmed)** |
| `react-dropzone` | Upload UI |
| `react-window` | Virtualised image grid |
| `@tanstack/react-query` | Server state + AI status polling |
| `winston` | Logging (API, queue, AI) |
| `pino` (alternative) | Lightweight structured logging |

---

### 0.3 Environment Configuration (.env)

The following environment variables must be defined before any code runs.

```
# ─── Application ───────────────────────────────
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ─── Database ──────────────────────────────────
DATABASE_URL=postgresql://user:password@localhost:5432/fieldspec

# ─── JWT ───────────────────────────────────────
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# ─── Redis ─────────────────────────────────────
REDIS_URL=redis://localhost:6379

# ─── Storage (Cloudinary) ──────────────────────
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# ─── Storage (S3 – alternative) ────────────────
# AWS_ACCESS_KEY_ID=
# AWS_SECRET_ACCESS_KEY=
# AWS_REGION=
# S3_BUCKET_NAME=

# ─── Email (Resend via SMTP — CONFIRMED) ──────────────
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASS=your-resend-api-key       # Obtain from resend.com dashboard
EMAIL_FROM=noreply@fieldspec.app

# ─── AI (DeepSeek) ─────────────────────────────
DEEPSEEK_API_KEY=your-deepseek-key
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions

# ─── Maps ──────────────────────────────────────
# ─── Maps (Mapbox GL JS — CONFIRMED) ──────────────────
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-public-token

# ─── Logging ───────────────────────────────────
LOG_LEVEL=info
```

> [!CAUTION]
> `.env` must NEVER be committed to version control. Add it to `.gitignore` immediately on project creation.

---

### 0.4 Folder Structure

```
fieldspec/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx              ← Centered, no sidebar
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── verify-email/page.tsx
│   │   └── reset-password/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx              ← PERSISTENT: Sidebar + content area
│   │   ├── page.tsx                ← Default dashboard overview
│   │   ├── projects/page.tsx
│   │   ├── upload/page.tsx
│   │   ├── report/page.tsx
│   │   ├── map/page.tsx
│   │   └── settings/page.tsx
│   ├── api/
│   │   ├── auth/[...route]/route.ts
│   │   ├── projects/route.ts
│   │   ├── projects/[id]/route.ts
│   │   ├── upload/initiate/route.ts
│   │   ├── images/metadata/route.ts
│   │   ├── images/[id]/route.ts
│   │   ├── ai/generate/route.ts
│   │   ├── ai/status/[jobId]/route.ts
│   │   ├── reports/[projectId]/route.ts
│   │   ├── report/export/route.ts
│   │   ├── map/[id]/snapshot/route.ts
│   │   └── clients/route.ts
│   ├── layout.tsx                  ← Root layout (fonts, globals)
│   └── globals.css                 ← @import design-tokens.css
├── components/
│   ├── ui/                         ← Reusable primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   ├── Skeleton.tsx
│   │   └── ProgressBar.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── TopBar.tsx
│   ├── dashboard/ProjectCard.tsx
│   ├── upload/
│   │   ├── DropZone.tsx
│   │   ├── ImageGrid.tsx
│   │   └── ImageCard.tsx
│   ├── report/
│   │   ├── ReportSection.tsx
│   │   └── InsightTrace.tsx
│   └── map/MapView.tsx
├── lib/
│   ├── prisma.ts
│   ├── auth.ts                     ← JWT sign/verify
│   ├── queue.ts                    ← BullMQ queue definitions
│   ├── redis.ts
│   ├── storage.ts                  ← Pre-signed URL logic
│   ├── email.ts                    ← Nodemailer transporter
│   ├── ai.ts                       ← DeepSeek API proxy
│   └── logger.ts                   ← Winston logger singleton
├── workers/
│   ├── index.ts                    ← Worker process entry point
│   ├── imageProcessingWorker.ts
│   ├── reportGenerationWorker.ts
│   └── emailWorker.ts
├── store/
│   ├── useUploadStore.ts
│   ├── useProjectStore.ts
│   ├── useReportStore.ts
│   └── useUIStore.ts
├── schemas/
│   ├── authSchemas.ts
│   ├── projectSchemas.ts
│   ├── imageSchemas.ts
│   └── aiSchemas.ts                ← Zod schema for DeepSeek output
├── middleware.ts                   ← JWT route protection
├── styles/
│   └── design-tokens.css
├── prisma/
│   └── schema.prisma
└── types/
    └── index.ts
```

---

## Phase 1 – Database (Prisma Schema)

All models are defined below in full. The schema follows the `database_schema.md` specification exactly.

---

### Model: User

```prisma
model User {
  id           String      @id @default(uuid())
  email        String      @unique
  passwordHash String?
  authProvider AuthProvider @default(email)
  name         String
  companyName  String?
  isVerified   Boolean     @default(false)
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  projects   Project[]
  clients    Client[]
  authTokens AuthToken[]
}

enum AuthProvider {
  email
  google
}
```

---

### Model: AuthToken

```prisma
model AuthToken {
  id        String        @id @default(uuid())
  userId    String
  tokenHash String
  type      TokenType
  expiresAt DateTime
  isUsed    Boolean       @default(false)
  createdAt DateTime      @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([type])
  @@index([expiresAt])
}

enum TokenType {
  email_verification
  password_reset
}
```

> [!NOTE]
> Raw tokens are NEVER stored. Only the hashed version is persisted. The raw token is sent via email only.

---

### Model: Client

```prisma
model Client {
  id          String   @id @default(uuid())
  userId      String
  name        String
  company     String?
  contactInfo Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  projects Project[]
}
```

---

### Model: Project

```prisma
model Project {
  id              String        @id @default(uuid())
  userId          String
  clientId        String?
  name            String
  location        String?
  status          ProjectStatus @default(draft)
  photoCount      Int           @default(0)
  mapSnapshotUrl  String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  user    User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  client  Client?  @relation(fields: [clientId], references: [id])
  images  Image[]
  aiJobs  AiJob[]
  report  Report?

  @@index([userId])
  @@index([clientId])
  @@index([status])
}

enum ProjectStatus {
  draft
  report_generated
  exported
}
```

---

### Model: Image

```prisma
model Image {
  id           String         @id @default(uuid())
  projectId    String
  url          String
  thumbnailUrl String
  category     ImageCategory?
  notes        String?
  gpsLat       Float?
  gpsLng       Float?
  createdAt    DateTime       @default(now())

  project  Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  aiOutput AiOutput?

  @@index([projectId])
  @@index([category])
}

enum ImageCategory {
  crop_health
  erosion
  damage
  irrigation
  general
}
```

---

### Model: AiJob

```prisma
model AiJob {
  id           String     @id @default(uuid())
  projectId    String
  type         JobType
  status       JobStatus  @default(pending)
  progress     Int        @default(0)
  errorMessage String?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
  @@index([status])
}

enum JobType {
  caption_generation
  summary_generation
  full_report
}

enum JobStatus {
  pending
  processing
  completed
  failed
}
```

---

### Model: AiOutput (Insight)

> [!NOTE]
> Called `AiOutput` in the schema but represents what the PRD refers to as an "Insight" — the AI-generated result per image including caption, finding, recommendation, and confidence score.

```prisma
model AiOutput {
  id                String   @id @default(uuid())
  imageId           String   @unique
  caption           String
  finding           String
  recommendation    String
  confidenceScore   Float?
  isEdited          Boolean  @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  image Image @relation(fields: [imageId], references: [id], onDelete: Cascade)

  @@index([imageId])
}
```

---

### Model: Report

```prisma
model Report {
  id              String       @id @default(uuid())
  projectId       String       @unique
  title           String
  templateType    String       @default("default")
  status          ReportStatus @default(draft)
  content         Json
  exportedFileUrl String?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
}

enum ReportStatus {
  draft
  final
}
```

---

## Phase 2 – Auth System

### Route Protection Strategy

**`middleware.ts`** (project root) intercepts all requests:

```
Protected paths:  /dashboard/*  and  /api/* (except /api/auth/*)
Unprotected:      /(auth)/*  and  /  (landing)
```

**Strategy:**
1. Extract JWT from `Authorization: Bearer <token>` header or `httpOnly` cookie
2. Verify with `JWT_SECRET`
3. On failure → redirect to `/login` (page routes) or return `401` (API routes)
4. On success → attach decoded `userId` to request context

> [!IMPORTANT]
> Middleware runs at the Edge. JWT verification must be done with the Edge-compatible `jose` library, NOT `jsonwebtoken`, which is Node-only. Add `jose` to dependencies.

---

### Auth Flows

| Flow | Endpoint | Key Behaviour |
|---|---|---|
| Signup | `POST /api/auth/signup` | Hash password → create user → queue verification email job |
| Login | `POST /api/auth/login` | Verify password → check `isVerified` → issue JWT |
| Send Verification | `POST /api/auth/send-verification` | Generate token → hash → store in AuthToken → queue email job |
| Verify Email | `GET /api/auth/verify-email?token=` | Hash incoming token → match DB → mark used → set isVerified |
| Forgot Password | `POST /api/auth/forgot-password` | Always return 200 (prevents user enumeration) → queue email job |
| Reset Password | `POST /api/auth/reset-password` | Validate token → hash new password → mark token used |

---

## Phase 3 – Layout Architecture

### Persistent Dashboard Layout (CRITICAL)

> [!IMPORTANT]
> The dashboard is a **single application surface**. The sidebar must never unmount. Navigation between views only replaces the main content area — never the full page.

```
app/dashboard/layout.tsx
└── <DashboardShell>
      ├── <Sidebar />              ← Fixed, never re-renders on navigation
      └── <main>{children}</main>  ← Only this area changes between views
```

**Navigation pattern:**
- Sidebar links use Next.js `<Link>` components
- Active route detected via `usePathname()` hook
- No `router.push()` with full-reload patterns
- No query-param-based view switching

**Views within the dashboard:**

| URL | View |
|---|---|
| `/dashboard` | Overview / project summary |
| `/dashboard/projects` | Project listing |
| `/dashboard/upload` | Upload & image management |
| `/dashboard/report` | Report builder |
| `/dashboard/map` | Map view |
| `/dashboard/settings` | User settings |

---

## Phase 4 – Upload System

### File Upload Strategy (Pre-Signed URLs)

> [!IMPORTANT]
> Files are NEVER routed through the Next.js backend. The backend only generates a temporary, signed URL. The client uploads directly to Cloudinary (or S3).

> [!NOTE]
> Storage provider is **Cloudinary** (confirmed). All image assets are stored and delivered via Cloudinary's CDN.

**Flow:**

```
1. Client selects files via DropZone
2. Client calls POST /api/upload/initiate { fileName, fileType, projectId }
3. Backend:
   - Validates input (Zod)
   - Generates a Cloudinary signed upload URL (server-side, using CLOUDINARY_API_SECRET)
   - Returns { uploadUrl, fileUrl, publicId }
4. Client uploads file directly to Cloudinary (bypasses Next.js server entirely)
5. On success, client calls POST /api/images/metadata to save the DB record
6. Backend queues: image_processing_job
```

**Cloudinary specifics:**
- Thumbnails auto-generated via Cloudinary transformations (no manual processing needed)
- CDN delivery URL format: `https://res.cloudinary.com/{cloud_name}/image/upload/{publicId}`
- Signed URL expires after 60 seconds (configurable)

**image_processing_job responsibilities:**
- Confirm thumbnail exists (Cloudinary auto-generates)
- Extract EXIF metadata (GPS lat/lng) via `exifr` library
- Update Image record with `gpsLat`, `gpsLng`, `thumbnailUrl`

---

## Phase 5 – Queue System

### Redis + BullMQ Architecture

**Three queue types** are defined:

---

#### 1. `image_processing_job`

| Field | Value |
|---|---|
| Trigger | After image metadata saved |
| Worker | `imageProcessingWorker.ts` |
| Payload | `{ imageId, projectId }` |
| Retries | 3 |
| On failure | Log error, mark image as unprocessed |

**Steps:**
1. Extract EXIF/GPS from uploaded image URL
2. Update `Image` record with GPS coordinates
3. Confirm thumbnail

---

#### 2. `report_generation_job`

This is a composite job that runs three sub-stages sequentially:

| Sub-Job | Description |
|---|---|
| `caption_generation` | Per image: call DeepSeek, validate, store AiOutput |
| `summary_generation` | Per category: aggregate insights, generate section summary |
| `full_report` | Compile all sections into Report.content (JSONB) |

| Field | Value |
|---|---|
| Trigger | `POST /api/ai/generate` |
| Worker | `reportGenerationWorker.ts` |
| Payload | `{ projectId, userId }` |
| Retries | 2 per sub-stage |
| Progress | Updated 0→100% across all stages in AiJob.progress |

---

#### 3. `email_job`

| Field | Value |
|---|---|
| Trigger | Signup (verification), forgot password (reset) |
| Worker | `emailWorker.ts` |
| Payload | `{ to, type: 'verification' \| 'reset', token }` |
| Retries | 3 |
| On failure | Log failure, do NOT expose error to user |

---

## Phase 6 – AI Processing & Validation Layer

### DeepSeek Integration

**All AI calls are backend-only**, made from within queue workers. The frontend never calls DeepSeek directly.

### AI Input Schema (Zod)

```typescript
// schemas/aiSchemas.ts
const AiInputSchema = z.object({
  category: z.enum(['crop_health', 'erosion', 'damage', 'irrigation', 'general']),
  user_note: z.string().optional(),
  context: z.string().optional(),
})
```

### AI Output Validation (CRITICAL)

Every DeepSeek response is parsed through the following Zod schema before being stored:

```typescript
const AiOutputSchema = z.object({
  caption: z.string().min(1),
  finding: z.string().min(1),
  recommendation: z.string().min(1),
})
```

**Validation flow per image:**

```
1. Call DeepSeek API with structured prompt
2. Parse JSON response
3. Validate with AiOutputSchema
4. On PASS → store in AiOutput table
5. On FAIL (attempt 1) → retry with stricter prompt
6. On FAIL (attempt 2) → store empty fallback:
   { caption: "", finding: "", recommendation: "" }
   Flag image for manual editing
7. Log all failures (see Logging Strategy)
```

### Confidence Score (Heuristic)

| Signal | Score |
|---|---|
| `category` is set | +40 |
| `user_note` is present | +30 |
| `context` (project location) is set | +30 |
| **Max** | **100** |

---

## Phase 7 – Logging Strategy

All logging uses a single `lib/logger.ts` singleton (Winston). Logs are structured JSON.

### Log Levels

| Level | Used For |
|---|---|
| `info` | Normal system events (job started, job completed) |
| `warn` | Non-critical issues (AI retry triggered) |
| `error` | Failures requiring attention (AI fallback, queue crash, email failure) |

### What Must Be Logged

#### API Errors
- Request method + path
- Error code + message
- User ID (if authenticated)
- Stack trace (development only)

#### Queue Failures
- Job type + ID
- Failure reason
- Retry count
- Payload (sanitized — no raw tokens)

#### AI Failures
- Image ID
- Attempt number (1 or 2)
- Raw DeepSeek response (truncated to 500 chars)
- Zod validation error detail
- Whether fallback was used

### Log Output

- **Development**: Console (pretty-printed)
- **Production**: File or external service (e.g., Logtail, Axiom)

---

## Phase 8 – Report Builder

### Report Content Structure (JSONB)

```json
{
  "title": "Project Name – Survey Report",
  "generatedAt": "2026-04-14T00:00:00Z",
  "sections": [
    {
      "category": "crop_health",
      "label": "Crop Health",
      "summary": "AI-generated section summary",
      "recommendations": "AI-generated aggregated recommendations",
      "images": [
        {
          "imageId": "uuid",
          "url": "https://...",
          "caption": "...",
          "finding": "...",
          "recommendation": "...",
          "confidenceScore": 85,
          "isEdited": false
        }
      ]
    }
  ],
  "mapSnapshot": "https://..."
}
```

### Editing Behaviour
- All text fields are inline-editable
- `PATCH /api/reports/:projectId` saves updated content
- Debounced auto-save (1 second after last keystroke)
- Setting `isEdited = true` on `AiOutput` when user modifies any AI field

### Insight Trace
- "View Source" button → highlights originating images in a side panel
- Shows: confidence score badge, "AI Generated" label, source image thumbnails

---

## Phase 9 – State Management

### Global State (Zustand) vs Local State

This boundary is enforced strictly across all components.

**Global (Zustand) — shared across components or persisted across navigation:**

| Store | Manages |
|---|---|
| `useProjectStore` | Active project ID, project list, project status |
| `useUploadStore` | Upload queue, per-file progress, failed uploads |
| `useReportStore` | Report content, edit state, auto-save status |
| `useUIStore` | Sidebar state, active modal, active category filter, selected image IDs |

**Local State (useState / useReducer) — UI-only, component-scoped:**

| Component | Local State |
|---|---|
| `Input.tsx` | Focus state, validation error message |
| `Modal.tsx` | Internal animation/open state |
| `ImageCard.tsx` | Hover state |
| `DropZone.tsx` | Drag-over state |
| `ReportSection.tsx` | Edit mode toggle (before committed to store) |

> [!NOTE]
> If a state value needs to survive a component unmount or be read by a sibling component, it belongs in Zustand. If it is purely presentational or ephemeral, it stays local.

---

## Phase 10 – API Layer Summary

All endpoints follow these rules:
- Validated with Zod (reject before business logic)
- Return `{ data }` on success or `{ error: { message, code } }` on failure
- No synchronous AI, export, or email calls
- Auth middleware enforced on all non-auth routes

| Group | Method | Path | Description |
|---|---|---|---|
| **Auth** | POST | `/api/auth/signup` | Create account |
| | POST | `/api/auth/login` | Authenticate |
| | POST | `/api/auth/send-verification` | Send verification email |
| | GET | `/api/auth/verify-email` | Confirm email token |
| | POST | `/api/auth/forgot-password` | Request password reset |
| | POST | `/api/auth/reset-password` | Set new password |
| **Projects** | GET | `/api/projects` | List all user projects |
| | POST | `/api/projects` | Create project |
| | GET | `/api/projects/:id` | Get single project |
| | PATCH | `/api/projects/:id` | Update project |
| | DELETE | `/api/projects/:id` | Delete project (cascade) |
| **Upload** | POST | `/api/upload/initiate` | Get pre-signed URL |
| **Images** | POST | `/api/images/metadata` | Save image record post-upload |
| | PATCH | `/api/images/:id` | Update category/notes |
| | DELETE | `/api/images/:id` | Remove image |
| **AI** | POST | `/api/ai/generate` | Trigger AI report job |
| | GET | `/api/ai/status/:jobId` | Poll job progress |
| **Reports** | GET | `/api/reports/:projectId` | Fetch report |
| | PATCH | `/api/reports/:projectId` | Save edits |
| **Export** | POST | `/api/report/export` | Generate PDF |
| **Map** | POST | `/api/map/:id/snapshot` | Save map image |
| **Clients** | GET | `/api/clients` | List clients |
| | POST | `/api/clients` | Create client |

---

## Integration Order (STRICT)

Build in this exact sequence. Do not begin a phase until all prior phases are functional.

| Step | Phase | Task |
|---|---|---|
| **SETUP** | | |
| 1 | Setup | Bootstrap Next.js project with TypeScript + Tailwind |
| 2 | Setup | Add all core dependencies |
| 3 | Setup | Create `.env` file with all required variables |
| 4 | Setup | Add `design-tokens.css` to `styles/` and import in `globals.css` |
| 5 | Setup | Configure `lib/logger.ts` (Winston) |
| **DATABASE** | | |
| 6 | Database | Write full Prisma schema (all 7 models + enums) |
| 7 | Database | Run `prisma migrate dev` and verify tables |
| 8 | Database | Create `lib/prisma.ts` singleton |
| **AUTH** | | |
| 9 | Auth | Create all Zod auth schemas |
| 10 | Auth | Build signup + login API routes |
| 11 | Auth | Create `middleware.ts` (Edge JWT protection for `/dashboard`) |
| 12 | Auth | Build email token system (generate, hash, validate, expire) |
| 13 | Auth | Set up `emailWorker.ts` + `lib/email.ts` (Nodemailer) |
| 14 | Auth | Build verification + password reset API routes |
| 15 | Auth | Build auth UI pages (login, signup) using design tokens only |
| **LAYOUT** | | |
| 16 | Layout | Build `app/dashboard/layout.tsx` (persistent sidebar + content shell) |
| 17 | Layout | Build `Sidebar.tsx` component with active state detection |
| 18 | Layout | Build dashboard overview page with empty state |
| 19 | Layout | Build `ProjectCard.tsx` component |
| **UPLOAD** | | |
| 20 | Upload | Configure `lib/storage.ts` (Cloudinary pre-signed URL generation) |
| 21 | Upload | Build `POST /api/upload/initiate` route |
| 22 | Upload | Build `POST /api/images/metadata` route |
| 23 | Upload | Build `DropZone.tsx` component |
| 24 | Upload | Build virtualised `ImageGrid.tsx` + `ImageCard.tsx` |
| 25 | Upload | Build image tagging UI + `PATCH /api/images/:id` |
| **QUEUE** | | |
| 26 | Queue | Configure `lib/redis.ts` and `lib/queue.ts` (BullMQ queues) |
| 27 | Queue | Build `workers/index.ts` entry point |
| 28 | Queue | Build `imageProcessingWorker.ts` (EXIF extraction, thumbnail confirm) |
| 29 | Queue | Verify image processing queue with test upload |
| **AI** | | |
| 30 | AI | Build `lib/ai.ts` (DeepSeek API proxy with prompt construction) |
| 31 | AI | Define `aiSchemas.ts` (Zod validation for AI I/O) |
| 32 | AI | Build `reportGenerationWorker.ts` (caption → summary → synthesis stages) |
| 33 | AI | Wire in validation layer + logging for all AI failures |
| 34 | AI | Build `POST /api/ai/generate` + `GET /api/ai/status/:jobId` |
| 35 | AI | Build front-end AI trigger button + polling progress bar |
| **REPORT BUILDER** | | |
| 36 | Report | Build `GET` + `PATCH /api/reports/:projectId` |
| 37 | Report | Build `ReportSection.tsx` component (inline editing) |
| 38 | Report | Build `InsightTrace.tsx` (confidence score + source image panel) |
| 39 | Report | Wire auto-save (debounced PATCH on content change) |
| **MAP** | | |
| 40 | Map | Integrate **Mapbox GL JS** + `react-map-gl` (confirmed provider) |
| 41 | Map | Render image markers (GPS-based, color-coded by category) |
| 42 | Map | Build marker click → side panel with preview |
| 43 | Map | Implement drag-to-reposition (update GPS via PATCH) |
| 44 | Map | Build "Save Map Snapshot" flow (`html2canvas` → upload → store URL) |
| **EXPORT** | | |
| 45 | Export | Build PDF rendering layer (styled HTML → `html2canvas` → `jspdf`) |
| 46 | Export | Build `POST /api/report/export` route |
| 47 | Export | Implement download trigger and `exportedFileUrl` persistence |
| **POLISH** | | |
| 48 | Polish | Add skeleton loaders to all data-loading views |
| 49 | Polish | Add all empty states (dashboard, image grid, report) |
| 50 | Polish | Audit all components for hardcoded styles → replace with tokens |
| 51 | Polish | Add error boundaries to all major view components |
| 52 | Polish | Final accessibility pass (keyboard nav, focus states, contrast) |

---

## Verification Plan

### Per Phase
- Each phase must have at least one functional test (manual or automated) before the next begins.

### End-to-End Validation Checklist
- [ ] Signup → email verification → login → redirect to dashboard
- [ ] Create project → upload 10 images → images appear in grid
- [ ] Tag images by category → filter by category works
- [ ] AI generation triggered → progress bar updates → report appears
- [ ] Report is editable → auto-save fires → changes persist on refresh
- [ ] Map loads with GPS markers → click shows side panel
- [ ] Export PDF → file downloads → layout is correct
- [ ] Password reset flow completes successfully
- [ ] All API errors return structured `{ error: { message, code } }`
- [ ] No hardcoded style values exist in any component

---
