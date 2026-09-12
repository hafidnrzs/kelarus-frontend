# POS SaaS Frontend

Monorepo for the POS SaaS frontend, managed with pnpm workspaces.

## Structure

```
.
├── apps/
│   ├── core/          React + TypeScript + Vite app (the POS application)
│   └── marketing/     Astro app (marketing/landing site)
└── packages/          Shared packages (empty for now)
```

## Prerequisites

- Node.js >= 22.12.0
- pnpm >= 10

## Getting Started

Install all dependencies from the repo root:

```sh
pnpm install
```

## Development

Run a single app by filtering to its workspace name:

```sh
pnpm --filter core dev
pnpm --filter marketing dev
```

Or `cd` into the app directory and run the script directly:

```sh
cd apps/core && pnpm dev
cd apps/marketing && pnpm dev
```

## Build

```sh
pnpm --filter core build
pnpm --filter marketing build
```

Run a script across every app:

```sh
pnpm -r build
```

## Notes

- This is a single pnpm workspace: one lockfile (`pnpm-lock.yaml`) and one `pnpm-workspace.yaml` at the root govern both apps. Don't add per-app lockfiles or workspace files.
- Workspace member paths and dependency-build allowlist live in the root `pnpm-workspace.yaml`.
