<div align="center">

# 🌌 Orion

**Ask More From CRM.**

An AI-powered CRM & productivity workspace that doesn't just store customer data — it understands it.

[![Status](https://img.shields.io/badge/status-active_development-6366f1?style=flat-square)](#status)
[![Node](https://img.shields.io/badge/node-%E2%89%A520-3c873a?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-000?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react)](https://react.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/license-proprietary-a855f7?style=flat-square)](#license)

</div>

---

## Table of Contents

- [Vision](#vision)
- [Core Capabilities](#core-capabilities)
- [Architecture](#architecture)
- [How It Works — End-to-End Flow](#how-it-works--end-to-end-flow)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Environment Variables](#environment-variables)
- [Development Workflow](#development-workflow)
- [Infrastructure (Phase 2)](#infrastructure-phase-2)
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

## Architecture

Orion is a **modular monorepo** designed to evolve from a modular monolith into independently scalable services without architectural rewrites. Each layer is bounded, feature-first, and independently deployable.

```mermaid
flowchart TB
    subgraph Client["🖥️ Client — apps/web (Next.js 16 + React 19)"]
        direction LR
        UI[UI Layer<br/>Feature Slices]
        State[State Layer<br/>Zustand + TanStack Query]
        Router[App Router<br/>Server Components]
    end

    subgraph API["⚙️ API Layer — services/api (Go + Fiber)"]
        direction LR
        Auth[Auth<br/>JWT / OAuth]
        REST[REST Handlers]
        WS[WebSockets<br/>Live Updates]
    end

    subgraph AI["🧠 AI Layer — services/ai (Python + FastAPI)"]
        direction LR
        LLM[LLM Orchestration<br/>LangChain / LangGraph]
        RAG[RAG Pipeline<br/>pgvector]
        MCP[MCP Servers<br/>Tool Runner]
    end

    subgraph Data["💾 Data Layer"]
        direction LR
        PG[(PostgreSQL 17<br/>+ pgvector)]
        Redis[(Redis 8<br/>Cache / Queues)]
        S3[(S3<br/>Documents)]
    end

    Client -->|HTTPS / WS| API
    Client -.->|Streamed AI events| AI
    API --> Data
    API <-->|task queue| AI
    AI --> Data
    AI -.->|embeddings| PG

    classDef client fill:#0ea5e9,stroke:#0284c7,color:#fff
    classDef api fill:#8b5cf6,stroke:#7c3aed,color:#fff
    classDef ai fill:#ec4899,stroke:#db2777,color:#fff
    classDef data fill:#10b981,stroke:#059669,color:#fff
    class Client client
    class API api
    class AI ai
    class Data data
```

### Layers

| Layer | Responsibility | Tech |
|---|---|---|
| **Client** | UI, routing, local state, optimistic mutations | Next.js 16, React 19, TypeScript, Tailwind v4 |
| **API** | Business logic, authz, REST + WebSockets | Go 1.24, Fiber |
| **AI** | LLM orchestration, RAG, document intelligence | Python, FastAPI, LangChain, LangGraph |
| **Data** | Relational + vector store, cache, object storage | PostgreSQL 17 (+ pgvector), Redis 8, S3 |

---

## How It Works — End-to-End Flow

A typical AI-assisted request (e.g. *"Summarize this quarter's deals with Acme Corp"*):

```mermaid
sequenceDiagram
    autonumber
    actor U as 👤 User
    participant W as 🖥️ Web (Next.js)
    participant A as ⚙️ API (Go)
    participant N as 🧠 AI (Python)
    participant V as 🗂️ pgvector
    participant D as 💾 Postgres
    participant M as 🔌 MCP Servers

    U->>W: Prompts Nova
    W->>A: POST /api/ai/query (JWT)
    A->>A: Validate + rate-limit
    A->>N: Forward query + user scope
    N->>V: Embed & retrieve context
    V-->>N: Top-k documents
    N->>D: Fetch structured CRM data
    D-->>N: Deal / contact records
    N->>M: (optional) invoke MCP tools
    M-->>N: Tool results
    N-->>A: Stream tokens + citations
    A-->>W: SSE stream
    W-->>U: Renders live response
```

### Data Flow Summary

1. **Interaction** — user triggers an action (search, prompt, workflow) in the Next.js client
2. **Auth & routing** — Go API validates JWT, applies rate limits, routes to the correct service
3. **Retrieval** — for AI queries, the Python service pulls relevant embeddings from pgvector and structured rows from Postgres
4. **Reasoning** — LangGraph orchestrates the LLM call, optionally invoking MCP tools (Slack, GitHub, Linear, Notion…)
5. **Streaming** — tokens stream back over SSE, rendered progressively in the UI
6. **Persistence** — mutations write to Postgres; async tasks queue via Redis

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
│       │   ├── (auth)/            # Login / register routes
│       │   └── (dashboard)/       # Authenticated shell
│       ├── features/              # Feature-Sliced Design
│       │   ├── ai/                # Nova assistant + connectors
│       │   ├── analytics/
│       │   ├── auth/
│       │   ├── calendar/
│       │   ├── dashboard/
│       │   ├── emails/
│       │   ├── habits/
│       │   ├── mcp/               # MCP server catalog
│       │   ├── notifications/
│       │   ├── settings/
│       │   └── tasks/
│       ├── shared/                # UI primitives, hooks, utils, types
│       ├── providers/             # Theme, query, toaster
│       └── store/                 # Global Zustand stores
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
├── docs/                          # Architecture & design specs
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

## Development Workflow

| Command | What it does |
|---|---|
| `npm run dev` | Start Next.js dev server (port 3000) |
| `npm run build` | Production build of the web app |
| `npm run lint` | ESLint across the web app |
| `npm run dev --workspace=apps/web` | Run only the web workspace |
| `docker compose --profile phase-2 -f infrastructure/docker-compose.yml up -d` | Start Postgres + Redis |
| `docker compose --profile phase-2 -f infrastructure/docker-compose.yml down` | Stop infrastructure |

### Feature-Sliced Design

Each feature under [apps/web/features/](apps/web/features/) owns its own:

```
features/tasks/
├── components/     # React components
├── hooks/          # Feature-scoped hooks
├── constants/      # Static data
├── services/       # API clients
├── schemas/        # Zod schemas
├── types/          # TypeScript types
└── index.ts        # Public API of the slice
```

Cross-feature imports go through each slice's public `index.ts` — never reach into another slice's internals.

---

## Infrastructure (Phase 2)

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
| **1** | Design system, frontend foundation, feature architecture | ✅ Shipped |
| **2** | Backend foundation, auth, user management | 🚧 In progress |
| **3** | CRM core (contacts, companies, deals) | ⏳ Planned |
| **4** | Calendar, tasks, notifications | ⏳ Planned |
| **5** | AI integration, RAG, document intelligence | ⏳ Planned |
| **6** | Analytics, automation, enterprise capabilities | ⏳ Planned |

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

🚧 **Active Development.** Phase 1 (frontend foundation, design system, feature-sliced architecture) is complete. Phase 2 (Go API, auth, data layer) is next. The project is not yet ready for production.

---

## License

This project is currently under active development and is **not yet available for production use** or redistribution. A license will be published with the first tagged release.

---

<div align="center">

**Orion — Ask More From CRM.**

Built with care. Designed to scale.

</div>
