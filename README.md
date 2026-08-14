<div align="center">

<img src="docs/brand/orion-banner.png" alt="Orion — Ask More From CRM." width="820">

<h3>An AI-native CRM and productivity workspace that doesn't just store customer data — it understands it.</h3>

<p>
  <a href="#status"><img alt="Status" src="https://img.shields.io/badge/status-active_development-22d3ee?style=for-the-badge&labelColor=0b1220"></a>
  <a href="#roadmap"><img alt="Phase" src="https://img.shields.io/badge/phase-2%20%C2%B7%20backend-efb34f?style=for-the-badge&labelColor=0b1220"></a>
  <a href="#license"><img alt="License" src="https://img.shields.io/badge/license-proprietary-94a3b8?style=for-the-badge&labelColor=0b1220"></a>
</p>

<p>
  <a href="https://nextjs.org"><img alt="Next.js" src="https://img.shields.io/badge/Next.js-16.2-000?style=flat-square&logo=next.js&logoColor=white"></a>
  <a href="https://react.dev"><img alt="React" src="https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react&logoColor=white"></a>
  <a href="https://www.typescriptlang.org"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square&logo=typescript&logoColor=white"></a>
  <a href="https://tailwindcss.com"><img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white"></a>
  <a href="https://go.dev"><img alt="Go" src="https://img.shields.io/badge/Go-1.24-00add8?style=flat-square&logo=go&logoColor=white"></a>
  <a href="https://www.postgresql.org"><img alt="Postgres" src="https://img.shields.io/badge/Postgres-17-4169e1?style=flat-square&logo=postgresql&logoColor=white"></a>
  <a href="https://nodejs.org"><img alt="Node" src="https://img.shields.io/badge/Node-%E2%89%A520-3c873a?style=flat-square&logo=node.js&logoColor=white"></a>
</p>

<p>
  <b>
  <a href="#vision">Vision</a> &nbsp;·&nbsp;
  <a href="#core-capabilities">Capabilities</a> &nbsp;·&nbsp;
  <a href="#architecture">Architecture</a> &nbsp;·&nbsp;
  <a href="#installation">Getting Started</a> &nbsp;·&nbsp;
  <a href="#roadmap">Roadmap</a> &nbsp;·&nbsp;
  <a href="#contributing">Contributing</a>
  </b>
</p>

</div>

---

## Table of Contents

**Overview**
- [Vision](#vision)
- [Interface](#interface)
- [Core Capabilities](#core-capabilities)
- [Implementation Status](#implementation-status)

**Architecture**
- [System Context](#system-context)
- [Runtime Topology](#runtime-topology)
- [Layered Architecture](#layered-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Data Architecture](#data-architecture)
- [Deployment Architecture](#deployment-architecture)

**Workflows**
- [Request Lifecycle](#request-lifecycle)
- [Authentication Flow](#authentication-flow)
- [Document Ingestion Pipeline](#document-ingestion-pipeline)
- [RAG Answer Flow](#rag-answer-flow)
- [Automation Pipeline](#automation-pipeline)
- [Development Workflow](#development-workflow)
- [Adding a Feature Slice](#adding-a-feature-slice)
- [Git & Release Workflow](#git--release-workflow)

**Reference**
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Environment Variables](#environment-variables)
- [Infrastructure](#infrastructure)
- [Testing](#testing)
- [Design Principles](#design-principles)
- [Roadmap](#roadmap)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Vision

Traditional CRMs store information. **Orion understands it.**

Orion is being built as a CRM that actively helps users discover insights, automate repetitive work, manage contracts, analyze vendors, and interact with business knowledge through AI — grounded in a premium, keyboard-first interface inspired by Linear, Attio, Arc Browser, Raycast, and Superhuman.

---

## Interface

<div align="center">

<img src="docs/screenshots/auth-register.png" alt="Orion sign-up screen" width="900">

<sub><i>Sign-up — glass surfaces, token-driven spacing, fully responsive from 1440px down to 360px.</i></sub>

</div>

---

## Core Capabilities

<table>
<tr>
<td width="33%" valign="top">

### Customer Relationship
- Contact Management
- Company Management
- Deal Pipeline
- Lead Management
- Activity Timeline
- Custom Fields

</td>
<td width="33%" valign="top">

### Sales & Productivity
- Task Management
- Calendar Integration
- Meeting Scheduler
- Notes & Reminders
- Notifications
- Habits & Focus

</td>
<td width="33%" valign="top">

### AI Intelligence
- Nova — AI Assistant
- Smart Search
- AI Summaries
- Workflow Recommendations
- Daily Briefings
- MCP Server Connectors

</td>
</tr>
<tr>
<td width="33%" valign="top">

### Document Intelligence
- Contract Analysis
- Vendor Intelligence
- PDF Processing
- Knowledge Base
- Semantic Search (RAG)

</td>
<td width="33%" valign="top">

### Analytics
- Sales Dashboard
- Team Performance
- Customer Insights
- Pipeline Analytics
- Productivity Metrics

</td>
<td width="33%" valign="top">

### Integrations
- Slack, GitHub, Linear
- Jira, Notion, Salesforce
- Google Workspace
- Microsoft Teams
- MCP protocol servers

</td>
</tr>
</table>

---

## Implementation Status

Orion is mid-build. This table is the honest map of what runs today versus what is designed and scheduled — read it before evaluating any diagram below.

| Layer | Today | Target |
|---|---|---|
| **Web client** | Fully implemented — 13 routes, 12 feature slices, design system, command palette | — |
| **Client data** | Feature-local mock constants + Zustand stores | TanStack Query against the Go API |
| **Intelligence Hub** | Working in-browser simulation — real `.txt`/`.md`/`.csv`/`.docx` text extraction, parent-child chunking, regex entity + PII detection, staged status machine | Server-side pipeline (Docling, Textract, Presidio, pgvector) |
| **Go API** | Stub — [`services/api/main.go`](services/api/main.go) is an empty `main()` with the Phase 2 contract in comments | Fiber REST + SSE, JWT/RBAC, repositories |
| **AI service** | Not started | Python + FastAPI, LangChain chains, LangGraph agents |
| **Workers** | Not started | Redis Streams consumers, ingestion + enrichment jobs |
| **Data** | Postgres 17 + Redis 8 provisioned via Compose, unused by the app | pgvector, S3, RLS multi-tenancy |
| **Infrastructure** | Local Compose only | Terraform, ECS Fargate → EKS |

> Diagrams marked **Target** describe the designed system. Diagrams marked **Current** describe code you can run today.

The complete engineering contract for the AI subsystem — decision log, schema, API surface, security pipeline, scaling path — lives in [`docs/intelligence-hub-blueprint.md`](docs/intelligence-hub-blueprint.md). The frontend dependency rules live in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

# Architecture

Orion is a **modular monorepo** designed to evolve from a modular monolith into independently scalable services without architectural rewrites. Every layer is bounded, feature-first, and independently deployable.

## System Context

Who talks to Orion, and what Orion talks to.

```mermaid
flowchart TB
    User([Sales / Ops / Legal User])
    Admin([Org Admin])

    subgraph Orion["Orion Platform"]
        Web[Web Application]
        Core[Core Services]
        Intel[Document Intelligence]
    end

    IdP[OAuth Providers<br/>Google · GitHub · Microsoft]
    LLMP[LLM Providers<br/>Claude · OpenAI]
    Tools[External Systems<br/>Slack · GitHub · Linear · Jira<br/>Notion · Salesforce · Drive]
    Store[Object Storage<br/>S3]

    User --> Web
    Admin --> Web
    Web --> Core
    Core --> Intel
    Core <--> IdP
    Intel <--> LLMP
    Core <-->|MCP protocol| Tools
    Intel <--> Store
```

| Actor / System | Relationship |
|---|---|
| **User** | Primary operator — CRM records, tasks, calendar, documents, AI chat |
| **Org Admin** | Manages knowledge bases, permissions, workflow rules, audit exports |
| **OAuth Providers** | Federated sign-in; identity claims mapped to org + role |
| **LLM Providers** | Grounded generation and background enrichment; egress-controlled per org |
| **External Systems** | Two-way tool access over MCP — read context, take actions |
| **Object Storage** | Document originals and derived artifacts; quarantine and clean buckets |

## Runtime Topology

**Target.** The full service decomposition, matching the blueprint.

```mermaid
flowchart TB
    FE[Next.js Frontend<br/>apps/web]

    subgraph Edge
        GW[ALB + WAF]
    end

    subgraph Services
        API[Go API · Fiber<br/>services/api]
        AIS[Python AI Service<br/>FastAPI · services/ai]
        WRK[Workers<br/>services/workers]
    end

    subgraph Stores
        PG[(PostgreSQL 17<br/>+ pgvector)]
        RD[(Redis 8<br/>cache · streams · limits)]
        S3Q[(S3 Quarantine)]
        S3C[(S3 Clean + Derived)]
    end

    LLM[Claude API]

    FE -->|HTTPS + JWT| GW --> API
    FE -.->|presigned PUT| S3Q
    API --> PG
    API --> RD
    API -->|internal HTTP · mTLS| AIS
    RD -->|consume jobs| WRK
    WRK --> S3Q
    WRK --> S3C
    WRK --> AIS
    WRK --> PG
    AIS --> PG
    AIS -->|embeddings + vectors| PG
    AIS --> LLM
    AIS -.->|SSE| API
    API -.->|SSE| FE
```

**Traffic rules**

| Path | Protocol | Auth |
|---|---|---|
| Frontend → API | HTTPS REST + SSE | JWT with org + role claims |
| Frontend → S3 | Presigned PUT, 5 min TTL | Presigned signature |
| API → AI service | Internal HTTP, VPC only | mTLS + service token |
| Workers → everything | VPC internal | IAM roles + service token |
| AI service → LLM | HTTPS | API key from Secrets Manager |

## Layered Architecture

Eleven layers. Nine stack vertically; security and automation cross-cut.

```mermaid
flowchart TB
    L1[Presentation] --> L2[API]
    L2 --> L3[Business]
    L3 --> L4[AI]
    L3 --> L5[Document Processing]
    L4 --> L6[Retrieval]
    L6 --> L7[Knowledge]
    L5 --> L8[Data]
    L7 --> L8
    L8 --> L9[Infrastructure]
    L10[Security]:::sec -.crosscuts.-> L2 & L3 & L4 & L5 & L8
    L11[Automation]:::auto -.event-driven.-> L3 & L4 & L5
    classDef sec fill:#dc2626,color:#fff
    classDef auto fill:#f59e0b,color:#fff
```

| Layer | Responsibility | Lives in |
|---|---|---|
| **Presentation** | Routes, feature UI, upload, search, chat, doc viewer, citations | `apps/web` |
| **API** | REST contracts, validation, authn/z, rate limits, SSE fan-out | Go `internal/*/handler` |
| **Business** | Document lifecycle state machine, KB management, quotas | Go `internal/*/service` |
| **AI** | LLM orchestration, prompt templates, agents, guardrails | Python `app/generation`, `app/agents` |
| **Document Processing** | Parse, OCR, clean, chunk, enrich | Python `app/ingestion` + workers |
| **Retrieval** | Hybrid search, rerank, context building, citation mapping | Python `app/retrieval` |
| **Knowledge** | Knowledge bases, entities, tags, knowledge graph | Go + Python, Postgres |
| **Data** | Postgres, vector store, Redis, S3 repositories | Go `internal/*/repository`, Python `app/db` |
| **Infrastructure** | IaC, queues, secrets, networking, observability | `infrastructure/` |
| **Security** *(cross-cutting)* | Scan, PII, injection detection, RBAC, audit, encryption | Every layer |
| **Automation** *(event-driven)* | Post-ingest enrichment, notifications, workflow triggers | Workers |

## Frontend Architecture

**Current.** This layer is fully built and is the reference implementation for the rest of the system.

### Dependency direction

Imports flow one way. A violation in the other direction is an architectural bug.

```mermaid
flowchart LR
    App["app/<br/>routes + composition"] --> Features["features/<br/>domain logic + UI"]
    Features --> Shared["shared/<br/>primitives + layout"]
    Shared --> Packages["packages/<br/>contracts + config"]
```

| Tier | Owns | Must not |
|---|---|---|
| `app/` | Route segments, layouts, page composition | Contain domain logic |
| `features/` | Domain UI, stores, schemas, services, mock data | Import another feature's internals |
| `shared/` | UI primitives, layout chrome, utils, navigation constants | Import from `features/` |
| `packages/` | Cross-app types, constants, configs | Import from the app at all |

Cross-feature access goes through each slice's public `index.ts` — never a deep path into another slice.

### Feature slice anatomy

Every one of the twelve slices follows the same shape:

```text
features/<name>/
├── components/     # React components for this domain
├── hooks/          # Feature-scoped hooks
├── constants/      # Static + mock data (Phase 2: deleted)
├── services/       # API clients and side-effecting logic
├── schemas/        # Zod schemas — runtime validation
├── store/          # Zustand slice for client-only UI state
├── types.ts        # Domain types
└── index.ts        # Public API of the slice — the only import surface
```

### Route map

```mermaid
flowchart TB
    Root["/"] --> AuthG["(auth)"]
    Root --> DashG["(dashboard)"]

    AuthG --> L["/login"]
    AuthG --> R["/register"]

    DashG --> D["/dashboard"]
    DashG --> T["/tasks"]
    DashG --> C["/calendar"]
    DashG --> E["/emails"]
    DashG --> AI["/ai · Nova"]
    DashG --> I["/intelligence"]
    DashG --> ID["/intelligence/[id]"]
    DashG --> CN["/connectors"]
    DashG --> AN["/analytics"]
    DashG --> H["/habits"]
    DashG --> N["/notifications"]
    DashG --> S["/settings"]
```

Route groups `(auth)` and `(dashboard)` carry separate layouts — the auth group renders a bare full-bleed shell, the dashboard group renders sidebar, header, bottom dock, and notification panel.

### State ownership

The single rule that keeps state predictable:

| State kind | Owner | Example |
|---|---|---|
| **Server state** | TanStack Query | Documents, tasks, events, chat history |
| **Client UI state** | Zustand | Sidebar collapsed, active panel, upload queue, command palette |
| **Form state** | React Hook Form + Zod | Every form in the app |
| **URL state** | App Router params | Filters, selected record, pagination |
| **Theme** | next-themes | Light / dark preference |

Zustand never caches server data. TanStack Query never holds UI state. Provider composition lives in [`apps/web/providers/index.tsx`](apps/web/providers/index.tsx).

## Backend Architecture

**Target.** Bounded contexts, one package each, three layers per context.

```mermaid
flowchart TB
    subgraph Go["services/api · Go + Fiber"]
        direction TB
        H[handler/ — Fiber routes + DTOs]
        SV[service/ — business rules + state machines]
        RP[repository/ — Postgres + S3 access]
        H --> SV --> RP
    end

    subgraph Ctx["Bounded contexts"]
        direction LR
        Doc[document] ~~~ Sea[search] ~~~ Cha[chat]
        Kno[knowledge] ~~~ Aut[automation] ~~~ Ana[analytics]
        Aut2[auth] ~~~ Plat[platform]
    end
```

| Context | Owns |
|---|---|
| `document` | Upload, lifecycle state machine, metadata, soft delete |
| `search` | Query orchestration, filters, result assembly |
| `chat` | Session management, SSE fan-out, proxies the AI service |
| `knowledge` | Knowledge bases, membership, ACL source of truth |
| `automation` | Workflow rules, job status and history |
| `analytics` | Usage, search analytics, audit exports |
| `auth` | JWT issuance and verification, RBAC middleware |
| `platform` | Shared infrastructure — db, redis, s3, events, telemetry |

The Python AI service mirrors this with `ingestion`, `retrieval`, `generation`, `agents`, `security`, `prompts`, and `db` modules. Full trees are in [§14 of the blueprint](docs/intelligence-hub-blueprint.md).

## Data Architecture

**Target.** UUIDv7 primary keys, `org_id` on every table, RLS enabled as defense-in-depth behind app-layer filters.

```mermaid
erDiagram
    KNOWLEDGE_BASES ||--o{ DOCUMENTS : contains
    DOCUMENTS ||--o{ DOCUMENT_CHUNKS : "split into"
    DOCUMENT_CHUNKS ||--o| CHUNK_EMBEDDINGS : "children embedded as"
    DOCUMENT_CHUNKS ||--o{ DOCUMENT_CHUNKS : "parent of"
    DOCUMENTS ||--o{ DOCUMENT_ENTITIES : mentions
    ENTITIES ||--o{ DOCUMENT_ENTITIES : "resolved from"
    ENTITIES ||--o{ ENTITY_RELATIONS : "subject of"
    AI_SESSIONS ||--o{ AI_MESSAGES : contains
    AI_MESSAGES ||--o{ CITATIONS : cites
    DOCUMENT_CHUNKS ||--o{ CITATIONS : "cited by"
    DOCUMENTS ||--o{ AUTOMATION_JOBS : triggers
```

| Concern | Design |
|---|---|
| **Tenancy** | `org_id` on every row; Postgres RLS; ACL applied as vector-query pre-filters, never post-filters |
| **Vectors** | `halfvec(1536)` — `text-embedding-3-large` Matryoshka-truncated; HNSW `m=16, ef_construction=64` |
| **Chunking** | Parent-child — 400-token children embedded for retrieval, 1,600-token parents stored for generation context |
| **Full text** | Generated `tsvector` column + GIN index for the BM25 half of hybrid search |
| **Versioning** | `embedding_model` + `embedding_version` columns; re-index writes v(n+1) alongside v(n), then atomic switch |
| **Audit** | Append-only, monthly partitions, two-year retention, SIEM-exportable |

## Deployment Architecture

**Target.**

```mermaid
flowchart TB
    subgraph Edge
        CF[CloudFront] --> WAF[WAF] --> ALB[ALB]
    end
    subgraph VPC["VPC · private subnets"]
        ALB --> ECS1[ECS: Go API]
        ECS1 --> ECS2[ECS: AI Service]
        ECS3[ECS: Workers<br/>autoscale on stream depth]
        ECS1 & ECS2 & ECS3 --> RDS[(RDS Postgres 17<br/>pgvector · Multi-AZ)]
        ECS1 & ECS3 --> EC[(ElastiCache Redis)]
        ECS3 --> CLAM[ClamAV sidecar]
    end
    S3Q[(S3 Quarantine)]
    S3C[(S3 Clean)]
    ECS3 --> S3Q & S3C
    ECS2 -->|NAT egress| LLMAPI[Claude API]
    SM[Secrets Manager] -.-> ECS1 & ECS2 & ECS3
    ECS1 & ECS2 & ECS3 -.-> OTL[OTel Collector] --> GC[Grafana Cloud]
```

| Concern | MVP | Enterprise |
|---|---|---|
| Compute | ECS Fargate, three services | EKS + GPU node pool for reranker and OCR |
| Database | RDS PG17 Multi-AZ with pgvector | Read replica for vector load, or Qdrant cluster |
| Queue | Redis Streams on ElastiCache | Same, plus SQS dead-letter mirror |
| Observability | OpenTelemetry → Grafana Cloud | Per-org SLO dashboards |
| Disaster recovery | RDS snapshots, S3 versioning | Cross-region warm standby |

---

# Workflows

## Request Lifecycle

**Target.** How a read and a write differ.

```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant W as Web · Next.js
    participant Q as TanStack Query
    participant A as API · Go
    participant R as Redis
    participant D as Postgres

    Note over U,D: Read path
    U->>W: Navigates to /tasks
    W->>Q: useQuery(["tasks", filters])
    Q-->>W: Cached data, instant paint
    Q->>A: GET /api/v1/tasks (JWT)
    A->>A: Verify JWT, apply RBAC + rate limit
    A->>R: Check cache
    alt Cache hit
        R-->>A: Cached payload
    else Cache miss
        A->>D: SELECT scoped by org_id
        D-->>A: Rows
        A->>R: Populate cache
    end
    A-->>Q: 200 JSON
    Q-->>W: Revalidated data

    Note over U,D: Write path
    U->>W: Completes a task
    W->>Q: useMutation
    Q-->>W: Optimistic update, UI moves immediately
    Q->>A: PATCH /api/v1/tasks/{id}
    A->>D: UPDATE + audit_logs INSERT
    alt Success
        D-->>A: Committed
        A-->>Q: 200
        Q->>Q: Invalidate ["tasks"]
    else Failure
        A-->>Q: 4xx / 5xx
        Q-->>W: Roll back optimistic update, toast error
    end
```

## Authentication Flow

**Target.** Credentials and OAuth converge on the same JWT.

```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant W as Web
    participant A as API · Go
    participant P as OAuth Provider
    participant D as Postgres

    alt Email + password
        U->>W: Submits /register or /login
        W->>W: Zod validation, client-side
        W->>A: POST /api/v1/auth/{register,login}
        A->>D: Verify or create user, argon2id hash
    else OAuth
        U->>W: Continue with Google
        W->>P: Authorization redirect
        P-->>W: Callback with code
        W->>A: POST /api/v1/auth/oauth/callback
        A->>P: Exchange code for profile
        A->>D: Upsert user, link identity
    end

    D-->>A: User + org + role
    A-->>W: Access token (15 min) + refresh cookie (HttpOnly, 30 d)
    W-->>U: Redirect to /dashboard

    Note over W,A: On 401, the client silently refreshes once and replays the request
```

| Property | Decision |
|---|---|
| Access token | JWT, 15 min, carries `user_id`, `org_id`, `role` |
| Refresh token | HttpOnly + Secure + SameSite cookie, 30 d, rotated on use |
| Password hashing | argon2id |
| Authorization | Middleware guards routes; ACL re-applied at the query layer |
| Roles | `org_admin`, `kb_admin`, `member`, `viewer` |

## Document Ingestion Pipeline

The lifecycle state machine — identical in the shipped simulation and the target system:

```mermaid
stateDiagram-v2
    [*] --> uploaded
    uploaded --> scanning
    scanning --> quarantined: malware or MIME mismatch
    scanning --> processing
    processing --> indexed
    processing --> failed: extraction error
    quarantined --> [*]
    failed --> [*]
    indexed --> [*]
```

**Current.** What [`features/intelligence/services/ingest.ts`](apps/web/features/intelligence/services/ingest.ts) actually does in the browser today:

```mermaid
flowchart LR
    A[File dropped] --> B[Infer doc type<br/>from filename]
    B --> C[Extract text<br/>text/md/csv/json · docx via mammoth]
    C --> D[Parent-child chunking<br/>600-char children, 3 per parent]
    D --> E[Regex analysis<br/>emails · amounts · dates · phones]
    E --> F[Risk score + tags + summary]
    F --> G[status: indexed]
    C -.->|binary or unsupported| H[Simulated chunk set]
    H --> F
```

Status transitions are staged at 0.9 s, 2.3 s, and 4.6 s to mirror real pipeline latency. Chunking is genuine — paragraphs accumulate to a 600-character target, three children group into each parent, page numbers derive from a 1,800-chars-per-page model, and section paths come from the first six words of a chunk. Entity extraction is real regex over the extracted text. Nothing leaves the browser.

**Target.** The server-side pipeline that replaces it:

```mermaid
flowchart LR
    U[Presigned upload] --> V[Validation<br/>magic bytes · ClamAV · dedupe]
    V --> O[OCR<br/>Textract, scanned only]
    O --> P[Parsing<br/>Docling, layout-aware]
    P --> C[Cleaning<br/>boilerplate · unicode · language]
    C --> K[Chunking<br/>parent-child]
    K --> E[Embedding<br/>batched, content-hash cached]
    E --> M[Metadata attach]
    M --> S[(Vector storage<br/>pgvector)]
```

| Stage | Failure behavior |
|---|---|
| Validation | `quarantined`, admin alert, never parsed |
| OCR | Retry ×3, then `failed` |
| Parsing | Fall back to plain-text extractor |
| Cleaning | Log and continue |
| Embedding | Backoff retry, partial resume |
| Vector storage | Transactional with chunk rows |

Ingestion is fully async — the API returns `202` with a `document_id` and streams status transitions to the UI over SSE.

## RAG Answer Flow

**Target.** Hybrid retrieval with reranking and page-level citations.

```mermaid
flowchart LR
    Q[User question] --> QC{Query classifier<br/>Haiku}
    QC -->|vague| MQ[Multi-query ×3]
    QC -->|specific| SQ[Single query]
    MQ & SQ --> D[Dense search<br/>HNSW top-40]
    MQ & SQ --> S[Sparse BM25<br/>top-40]
    D & S --> RRF[RRF fusion<br/>top-50]
    RRF --> RR[Cross-encoder rerank<br/>top-8]
    RR --> PD[Parent swap + dedupe]
    PD --> CB[Context builder<br/>12k token budget]
    CB --> LLM[Claude · grounded prompt]
    LLM --> ANS[Stream tokens + citations]
```

The retrieved child chunk is what matched; the parent chunk is what the model reads. Every citation carries `document_id`, `page`, `section_path`, and the exact quote span, so a footnote opens the viewer at the right page.

ACL is applied as a **pre-filter inside the vector query**, never as a post-filter — post-filtering leaks cross-tenant existence through result counts.

## Automation Pipeline

**Target.** Event-driven fan-out after a document is indexed.

```mermaid
flowchart TB
    E[event: document.indexed] --> F1[Extract metadata]
    E --> F2[Generate summary]
    E --> F3[Extract entities]
    F3 --> F4[Generate tags]
    F3 --> F5[Detect deadlines]
    F3 --> F6[Detect vendors]
    F5 --> A1[Create reminders<br/>CRM tasks]
    F6 --> A2[Link vendor records]
    F1 & F2 & F4 --> A3[Update search index]
    A1 & A2 & A3 --> N[Notify users]
    N --> W[Evaluate org workflow rules]
```

| Property | Design |
|---|---|
| Idempotency | Job key is `(document_id, job_type, doc_checksum)` — re-runs are no-ops |
| Retries | Exponential backoff ×5, then dead-letter stream and admin dashboard |
| Ordering | Fan-out on `document.indexed`; entity-dependent jobs chained behind extraction |
| Cost control | Enrichment runs on Haiku; per-org daily token budget with soft-stop |

## Development Workflow

**Current.** The loop you run today.

```mermaid
flowchart LR
    A[git pull] --> B[npm install]
    B --> C[npm run dev]
    C --> D[Edit slice]
    D --> E[Hot reload<br/>localhost:3000]
    E --> D
    D --> F[npm run lint]
    F --> G[npm run build]
    G --> H[Commit + PR]
```

| Command | What it does |
|---|---|
| `npm run dev` | Next.js dev server on port 3000 |
| `npm run build` | Production build of the web app |
| `npm run lint` | ESLint across the web workspace |
| `npm run dev --workspace=apps/web` | Run only the web workspace |
| `docker compose --profile phase-2 -f infrastructure/docker-compose.yml up -d` | Start Postgres + Redis |
| `docker compose --profile phase-2 -f infrastructure/docker-compose.yml down` | Stop infrastructure |

All three root scripts delegate to `apps/web` — the monorepo has a single runnable workspace until the Go API lands.

## Adding a Feature Slice

The repeatable procedure. Follow it and the dependency rules hold automatically.

```mermaid
flowchart TB
    S1[1 · Scaffold features/name/] --> S2[2 · Define types.ts]
    S2 --> S3[3 · Write Zod schemas]
    S3 --> S4[4 · Add mock data in constants/]
    S4 --> S5[5 · Build components/]
    S5 --> S6[6 · Add Zustand store if UI state is needed]
    S6 --> S7[7 · Export public API in index.ts]
    S7 --> S8[8 · Add route under app/dashboard/]
    S8 --> S9[9 · Register in shared/constants/navigation.ts]
    S9 --> S10[10 · Swap mocks for services/ in Phase 2]
```

1. **Scaffold** the directory with the [standard slice shape](#feature-slice-anatomy). Create only the folders you need.
2. **Define `types.ts`** first — the domain vocabulary drives everything downstream.
3. **Write Zod schemas** in `schemas/`. These become the runtime contract against the API later.
4. **Add mock data** in `constants/`. Shape it exactly like the eventual API response so the swap is mechanical.
5. **Build components** in `components/`. Compose from `shared/components/ui` — do not write new primitives inside a slice.
6. **Add a Zustand store** in `store/` only for client-only UI state. Server data does not belong here.
7. **Export the public API** in `index.ts`. Everything not exported here is private to the slice.
8. **Add the route** as `app/(dashboard)/<name>/page.tsx`, importing only from the slice's `index.ts`.
9. **Register navigation** in [`shared/constants/navigation.ts`](apps/web/shared/constants/navigation.ts) — `mainNavItems` for primary destinations, `secondaryNavItems` for utility pages.
10. **Phase 2** — replace `constants/` with typed clients in `services/`, wire TanStack Query, delete the mocks.

## Git & Release Workflow

```mermaid
gitGraph
    commit id: "main"
    branch feature/intelligence-hub
    commit id: "feat: dropzone"
    commit id: "feat: chunking"
    commit id: "fix: status timing"
    checkout main
    merge feature/intelligence-hub tag: "PR review"
    commit id: "docs: README"
```

| Step | Convention |
|---|---|
| **Branch** | `feature/<slug>` or `fix/<slug>` off `main` |
| **Commit** | Conventional Commits — `feat:`, `fix:`, `chore:`, `docs:`, `refactor:` |
| **Scope** | One feature per PR |
| **Evidence** | UI changes require before/after screenshots in the PR body |
| **Gate** | `npm run lint` and `npm run build` must pass before review |
| **Merge** | Squash into `main` after approval |

---

## Tech Stack

<details>
<summary><b>Frontend</b></summary>

- **Framework** — Next.js 16.2 (App Router, webpack), React 19
- **Language** — TypeScript 5.7 (strict)
- **Styling** — Tailwind CSS v4 (@theme tokens), shadcn/ui primitives
- **State** — Zustand (client), TanStack Query (server), TanStack Table
- **Motion** — Motion (Framer), GSAP
- **Forms** — React Hook Form + Zod
- **Icons** — lucide-react, gilbarbara/logos (full-color brand marks)
- **UX** — cmdk (command palette), Sonner (toasts), next-themes (theming)
- **Drag-and-drop** — @dnd-kit
- **Calendar** — FullCalendar

</details>

<details>
<summary><b>Backend (Phase 2)</b></summary>

- **Language** — Go 1.24
- **Framework** — Fiber
- **Database** — PostgreSQL 17
- **Cache / Pub-Sub** — Redis 8
- **Realtime** — WebSockets
- **Auth** — JWT + OAuth

</details>

<details>
<summary><b>AI & Knowledge (Phase 5)</b></summary>

- **Language** — Python 3.12+
- **Framework** — FastAPI
- **Orchestration** — LangChain, LangGraph
- **Vector Store** — pgvector on Postgres
- **Object Storage** — AWS S3
- **Protocol** — MCP (Model Context Protocol) — stdio / Streamable HTTP / SSE

</details>

<details>
<summary><b>Infrastructure</b></summary>

- **Containers** — Docker + Compose (profiles per phase)
- **Package management** — npm workspaces (monorepo)
- **Node runtime** — ≥ 20.0.0
- **CI/CD** — GitHub Actions (planned)

</details>

---

## Repository Structure

```text
orion/
├── apps/
│   └── web/                       # Next.js 16 + React 19 client
│       ├── app/                   # App Router
│       │   ├── (auth)/            # Login / register — bare shell
│       │   └── (dashboard)/       # 11 routes — sidebar + header shell
│       ├── features/              # Feature-Sliced Design — 12 slices
│       │   ├── ai/                # Nova assistant
│       │   ├── analytics/
│       │   ├── auth/
│       │   ├── calendar/
│       │   ├── dashboard/
│       │   ├── emails/
│       │   ├── habits/
│       │   ├── intelligence/      # Document intelligence + RAG hub
│       │   ├── mcp/               # MCP connector catalog
│       │   ├── notifications/
│       │   ├── settings/
│       │   └── tasks/
│       ├── shared/                # UI primitives, layout, utils, nav
│       ├── providers/             # Theme, query, toaster
│       ├── store/                 # Global Zustand store
│       └── public/                # Brand assets
│
├── services/
│   └── api/                       # Go + Fiber API (Phase 2 stub)
│
├── packages/
│   ├── ui/                        # Shared design-system components
│   ├── configs/                   # Shared tsconfig / eslint bases
│   ├── constants/                 # Cross-app constants
│   └── types/                     # Cross-app TypeScript types
│
├── infrastructure/
│   └── docker-compose.yml         # Postgres + Redis (phase-2 profile)
│
├── docs/
│   ├── ARCHITECTURE.md            # Frontend dependency rules
│   ├── DESIGN_SYSTEM.md           # Tokens, primitives, patterns
│   ├── AI_CONNECTORS.md           # MCP connector contracts
│   ├── intelligence-hub-blueprint.md   # Full AI subsystem contract
│   ├── brand/                     # Logo, banner, brand marks
│   └── screenshots/               # UI captures used in docs
│
├── scripts/                       # Dev / build / seed scripts
├── package.json                   # Workspace root
└── README.md
```

---

## Prerequisites

Before installing, make sure you have:

| Tool | Version | Check |
|---|---|---|
| **Node.js** | ≥ 20.0.0 | `node --version` |
| **npm** | ≥ 10.0.0 | `npm --version` |
| **Git** | ≥ 2.40 | `git --version` |
| **Docker** *(optional, Phase 2+)* | ≥ 24 | `docker --version` |
| **Go** *(optional, Phase 2+)* | ≥ 1.24 | `go version` |
| **Python** *(optional, Phase 5+)* | ≥ 3.12 | `python --version` |

> **Windows users:** we recommend Git Bash or PowerShell 7+. The dev server binds to `localhost:3000` by default.

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/priyangshu24/Orion.git
cd Orion
```

### 2. Install dependencies

The monorepo uses **npm workspaces** — a single `npm install` at the root hydrates every workspace.

```bash
npm install
```

This installs dependencies for `apps/web`, `packages/*`, and `services/*` (JS workspaces).

### 3. Configure environment

Copy the example environment file and fill in any secrets:

```bash
cp .env.example .env.local        # macOS / Linux
copy .env.example .env.local      # Windows CMD
Copy-Item .env.example .env.local # PowerShell
```

See [Environment Variables](#environment-variables) for the full list.

### 4. (Optional) Start Phase 2 infrastructure

If you're working on the API/data layer, start Postgres + Redis via Docker:

```bash
docker compose --profile phase-2 -f infrastructure/docker-compose.yml up -d
```

---

## Running the App

### Development

From the repo root:

```bash
npm run dev
```

The Next.js dev server starts at **http://localhost:3000**.

You can also run it directly from the web workspace:

```bash
npm run dev --workspace=apps/web
```

### Production build

```bash
npm run build
npm run start --workspace=apps/web
```

### Lint

```bash
npm run lint
```

---

## Environment Variables

Create `.env.local` at the repo root. Common variables:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# API (Phase 2)
NEXT_PUBLIC_API_URL=http://localhost:8080
API_JWT_SECRET=change-me

# Database (Phase 2)
DATABASE_URL=postgresql://orion:orion_local@localhost:5432/orion
REDIS_URL=redis://localhost:6379

# AI (Phase 5)
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
AWS_S3_BUCKET=

# OAuth providers (Phase 3+)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

> Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Never put secrets behind that prefix.

---

## Infrastructure

`infrastructure/docker-compose.yml` provisions the Phase 2 data services under the `phase-2` profile:

```mermaid
flowchart LR
    Web[apps/web<br/>:3000]
    API[services/api<br/>:8080]
    PG[(Postgres 17<br/>:5432)]
    Redis[(Redis 8<br/>:6379)]

    Web -->|HTTPS| API
    API --> PG
    API --> Redis
```

Start / stop:

```bash
# Start
docker compose --profile phase-2 -f infrastructure/docker-compose.yml up -d

# Tail logs
docker compose -f infrastructure/docker-compose.yml logs -f

# Stop
docker compose --profile phase-2 -f infrastructure/docker-compose.yml down
```

Default credentials (dev only):

- **DB** — `orion` / `orion_local` on database `orion`
- **Postgres** — `localhost:5432`
- **Redis** — `localhost:6379`

---

## Testing

Test tooling will be added incrementally per phase:

- **Unit** — Vitest + Testing Library
- **E2E** — Playwright
- **Contract** — API contract tests via `services/api`
- **Accessibility** — axe-core in CI

---

## Design Principles

- **Premium, modern interface** — glass surfaces, subtle motion, no visual noise
- **Keyboard-first** — everything reachable via `⌘ K` command palette
- **Accessibility-first** — WCAG 2.2 AA target
- **Responsive by default** — mobile-first breakpoints
- **Feature-first architecture** — slices, not layers-first folders
- **Design token driven** — semantic tokens in `@theme`, never raw hex in components
- **Reusable primitives** — shadcn/ui + Radix, composed once
- **Consistent interaction patterns** — same gesture = same result, everywhere

---

## Roadmap

```mermaid
gantt
    title Orion Development Roadmap
    dateFormat  YYYY-MM
    axisFormat  %b %Y

    section Phase 1 · Foundation
    Project setup & design system         :done, p1a, 2026-06, 30d
    Frontend architecture & shell         :done, p1b, after p1a, 30d

    section Phase 2 · Backend
    Go API + auth                         :active, p2a, 2026-08, 45d
    User management                       :p2b, after p2a, 30d

    section Phase 3 · CRM Core
    Contacts / Companies / Deals          :p3, 2026-10, 60d

    section Phase 4 · Productivity
    Calendar / Tasks / Notifications      :p4, 2026-12, 60d

    section Phase 5 · Intelligence
    AI integration + RAG                  :p5, 2027-02, 90d

    section Phase 6 · Enterprise
    Analytics / Automation                :p6, 2027-05, 90d
```

| Phase | Focus | Status |
|---|---|---|
| **1** | Design system, frontend foundation, feature architecture | **Shipped** |
| **2** | Backend foundation, auth, user management | **In progress** |
| **3** | CRM core (contacts, companies, deals) | Planned |
| **4** | Calendar, tasks, notifications | Planned |
| **5** | AI integration, RAG, document intelligence | Planned |
| **6** | Analytics, automation, enterprise capabilities | Planned |

---

## Troubleshooting

<details>
<summary><b>Port 3000 already in use</b></summary>

Kill the existing process or run on another port:

```bash
# Find what's on 3000
npx kill-port 3000

# Or set a custom port
PORT=3005 npm run dev
```

</details>

<details>
<summary><b><code>npm install</code> fails on Windows</b></summary>

- Ensure Node ≥ 20 (`node --version`)
- Delete `node_modules/` and `package-lock.json`, then `npm install` again
- If you see EPERM errors, close VS Code / any file watcher and retry

</details>

<details>
<summary><b>Docker services won't start</b></summary>

- Ensure Docker Desktop is running
- Check port conflicts: `docker ps` — nothing else should hold `5432` or `6379`
- Reset volumes if data is corrupted: `docker compose -f infrastructure/docker-compose.yml down -v`

</details>

<details>
<summary><b>Tailwind styles missing after edit</b></summary>

Tailwind v4 uses `@theme` — restart the dev server after adding new tokens. Classes only appear on files under the configured content globs.

</details>

---

## Contributing

Contributions are welcome once the project reaches its first tagged release. Until then, please open an issue to discuss any proposed change before opening a PR.

**Conventions:**

- **Commits** — Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`)
- **Branches** — `feature/<slug>`, `fix/<slug>`
- **PRs** — one feature per PR, include screenshots for UI changes

---

## Status

**Active development.** Phase 1 — frontend foundation, design system, feature-sliced architecture — is complete. Phase 2 — Go API, auth, and the data layer — is underway. Orion is not yet ready for production use.

---

## License

This project is currently under active development and is **not yet available for production use** or redistribution. A license will be published with the first tagged release.

---

<div align="center">

<img src="docs/brand/orion-mark.png" alt="" width="56">

**Orion — Ask More From CRM.**

<sub>Built with care. Designed to scale.</sub>

</div>
