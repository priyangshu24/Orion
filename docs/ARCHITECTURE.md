# Frontend architecture

OrionOS uses a monorepo and feature-sliced frontend structure.

## Dependency direction

`app → features → shared → packages`

- `app` owns routes and route composition.
- `features` own domain UI, mock data, schemas, hooks, stores, and future API adapters.
- `shared` owns reusable primitives, layouts, utilities, and application-wide constants.
- `packages` hold cross-application contracts and configuration.

Features must not import another feature's internals. Public exports belong in each feature's `index.ts`.

## Phase 2 integration

Replace feature mock constants with adapters in each feature's `api/` and `services/` directories. TanStack Query owns server state; Zustand remains limited to client UI state.
