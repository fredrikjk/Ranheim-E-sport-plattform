# Ranheim E-sport Platform

Digital plattform for Ranheim E-sport — offentlig nettside, klubbhub, trening,
statistikk og senere streaming. Bygget som et produksjonssystem, ikke som en
klubbmal.

## Nåværende fase

**Fase 1 / Slice 0 — Foundation.** Arkitektur er dokumentert. Monorepoet har
design tokens, RBAC, Prisma-skjema og et profesjonelt offentlig sideskall.

Neste: [docs/architecture/mvp.md](docs/architecture/mvp.md)

## Dokumentasjon

Start her: [docs/README.md](docs/README.md)

- [Arkitektur](docs/architecture/overview.md)
- [Database](docs/database/overview.md)
- [Sikkerhet](docs/security/overview.md)
- [API](docs/api/overview.md)
- [Deployment](docs/deployment/overview.md)

## Stack

- pnpm + Turborepo
- Next.js + React + TypeScript
- SCSS + CSS variables (`packages/ui`)
- PostgreSQL + Prisma
- Egen auth-pakke med roller **og** permissions

## Utvikling

```bash
cp .env.example .env
pnpm install
pnpm dev
```

Kvalitet:

```bash
pnpm lint
pnpm typecheck
pnpm test
```

Database (når Postgres kjører):

```bash
pnpm --filter @ranheim/database migrate:dev
```

Offentlig side kjører uten database.

## Mapper

```text
apps/web              Offentlig nettside + hub-ruter
packages/auth         OTP-klare kontrakter, RBAC, authorize()
packages/database     Prisma-skjema og client
packages/ui           Design tokens
packages/api          HTTP-feilmodell og Zod-kontrakter
docs/                 Arkitektur og slice-plan
```
