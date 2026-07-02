# OrionOS

OrionOS is a premium AI productivity workspace foundation built with Next.js 15, React 19, TypeScript, Tailwind CSS v4, and a feature-first frontend architecture.

## Phase 1

- Responsive premium application shell
- Dashboard, tasks, calendar, emails, AI, settings, login, and registration pages
- Mock data only; no backend business logic
- Dark/light themes
- Global command palette
- Notification panel and user navigation
- Reusable UI primitives and semantic design tokens
- Go, PostgreSQL, Redis, and Docker boundaries reserved for Phase 2

## Repository structure

```text
orion-os/
├── apps/web/
├── services/api/
├── packages/
│   ├── ui/
│   ├── types/
│   ├── constants/
│   └── configs/
├── infrastructure/
├── docs/
└── scripts/
```

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Validate

```bash
npm run build
```

The frontend architecture and design-system acceptance criteria are documented in `docs/`.
