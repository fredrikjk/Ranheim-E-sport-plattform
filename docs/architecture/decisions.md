# Arkitekturavgjørelser

Hver avgjørelse beskriver kontekst, alternativer, valg og konsekvenser.
Nye avgjørelser appendes. Vi endrer ikke historie i eldre poster.

---

## ADR-001 — pnpm + Turborepo som monorepo

**Status:** Akseptert  
**Dato:** 2026-09-22

**Kontekst:** Plattformen skal kunne romme web, hub, senere Stream Manager
og delte pakker uten å splitte repo.

**Alternativer:**

1. Ett Next.js-repo uten workspaces
2. pnpm + Turborepo
3. Nx
4. Flere git-repoer

**Valg:** 2.

**Hvorfor:** Lav nok kompleksitet for ett team, tydelige pakkegrenser,
god TypeScript-støtte. Nx gir mer generator-tyngde enn vi trenger. Flere
repoer splitter auth, typer og designsystem for tidlig.

---

## ADR-002 — Én Next.js-app med route groups

**Status:** Akseptert  
**Dato:** 2026-09-22

**Kontekst:** Visjonen viser `web`, `admin`, `player` og `stream-manager`.

**Alternativer:**

1. Fire apper fra dag én
2. `web` + `hub` som to Next.js-apper
3. Én Next.js-app, Stream Manager senere som desktop

**Valg:** 3.

**Hvorfor:** Én innlogging, ett cookie-domene, ett designsystem. Klubben
har ca. 70 medlemmer. Split av `admin`/`player` er en deploy-beslutning,
ikke en datamodell-beslutning. Stream Manager må være desktop pga. OBS.

**Konsekvens:** Mapper i `apps/web/app` må holdes rene. Hvis bundlen eller
sikkerhetssonen krever det, ekstraheres `(hub)` senere uten å skrive om
Prisma eller RBAC.

---

## ADR-003 — PostgreSQL + Prisma 6

**Status:** Akseptert  
**Dato:** 2026-09-22

**Kontekst:** Relasjoner mellom brukere, lag, roller, trening og kampdata
er kjernen i produktet. Vi trenger migrasjoner, constraints og EU-hosting.

**Alternativer:**

1. PostgreSQL + Prisma
2. PostgreSQL + Drizzle
3. SQLite i starten
4. MongoDB / dokumentlager
5. Cloudflare D1

**Valg:** 1, med Prisma 6.x (ikke 7/8-RC).

**Hvorfor:** Prisma gir forutsigbare migrasjoner og en typed client som
hele monorepoet kan importere. Drizzle er tynnere og mer SQL-nært, men
teamet får mer verdi av et modent migreringsløp enn av minimale queries
nå. SQLite og D1 skyver en smertefull flytting foran oss. Dokumentlager
passer dårlig for RBAC og relasjoner.

JSON-kolonner er tillatt for audit-metadata og fremtidige spillspesifikke
tillegg som ikke filtreres på. De er ikke dumpingsplass for relasjoner.

---

## ADR-004 — Egen auth-pakke, ikke Clerk/Auth0 som kilde til identitet

**Status:** Akseptert  
**Dato:** 2026-09-22

**Kontekst:** Primær innlogging er telefon + OTP. Senere e-post, passkeys
og OAuth. Brukerne er i stor grad mindreårige. RBAC er scoped til lag.

**Alternativer:**

1. Clerk / Auth0 / Supabase Auth som identitetskilde
2. Auth.js (NextAuth) med custom credentials
3. Better Auth
4. Egen `packages/auth` med provider-interface

**Valg:** 4.

**Hvorfor:** Vi eier bruker, samtykke, foresatte, scoped roller og sletting.
IdP-lock-in gjør GDPR-eksport/sletting og lag-scope vanskeligere. Auth.js
og Better Auth kan vurderes som *bibliotek* senere hvis de reduserer risiko
uten å eie datamodellen. SMS-leverandør er en port (dev → Twilio/Vipps),
ikke en identitetsplattform.

**Konsekvens:** Vi må selv gjøre sesjonsrotasjon, rate limit, hashing av
OTP og audit. Det er bevisst.

---

## ADR-005 — Cloudflare i kanten, Node-host for appen

**Status:** Akseptert  
**Dato:** 2026-09-22

**Kontekst:** Ønske om Cloudflare for DNS, CDN, WAF, R2 og eventuelt
Workers. Next.js + Prisma er ikke et naturlig Workers-første produkt.

**Alternativer:**

1. Alt på Cloudflare Workers / OpenNext
2. Vercel/Fly for app, Cloudflare for DNS/WAF/CDN/R2
3. Kun Vercel uten Cloudflare

**Valg:** 2.

**Hvorfor:** Riktig verktøy til riktig problem. Workers er aktuelt senere
for EventSub-ingest, cache-purge og edge-redirects. De er ikke
applikasjonsserveren i fase 1.

Databasen skal kunne ligge i EU (for eksempel Neon `eu-central`).

---

## ADR-006 — SCSS + design tokens, ikke Tailwind

**Status:** Akseptert  
**Dato:** 2026-09-22

**Kontekst:** Produktkravet ber om SCSS/Sass og et komponentbasert
designsystem.

**Alternativer:**

1. Tailwind + shadcn
2. SCSS modules + CSS variables
3. CSS-in-JS

**Valg:** 2.

**Hvorfor:** Tokens og merkevarekontroll er viktigere enn utility-speed.
Tailwind + shadcn gir fort generisk SaaS-uttrykk, som kravet eksplisitt
forbyr. CSS-in-JS gir runtime-kost og svakere token-disiplin.

---

## ADR-007 — tRPC utsettes

**Status:** Akseptert  
**Dato:** 2026-09-22

**Kontekst:** Frontend skal ikke snakke med databasen. Vi trenger typed
API, men også HTTP som Stream Manager og treningsapper kan kalle.

**Alternativer:**

1. tRPC internt, eget HTTP-API senere
2. REST/JSON med Zod-kontrakter i `packages/api` fra start
3. GraphQL

**Valg:** 2.

**Hvorfor:** Treningsapper, Stream Manager og eventuelle eksterne integrasjoner
skal bruke vanlige HTTP-endepunkter. Ett kontraktlag unngår å bygge
systemet to ganger. GraphQL er for mye for MVP.

---

## ADR-008 — Soft delete + eget samtykke, ikke «slett raden stille»

**Status:** Akseptert  
**Dato:** 2026-09-22

**Kontekst:** Medlemmer er barn og unge. GDPR krever sletting, innsyn og
begrenset lagring. Samtidig trenger styret sporbarhet.

**Valg:** `User.deletedAt` for deaktivering, egne sletterutiner for
personopplysninger, `Consent` som egen tabell, audit uten sensitive felt.

Vi sletter ikke audit-rader som styret er pålagt å oppbevare; vi
anonymiserer aktør når personen slettes.

---

## ADR-009 — Statistikk er EAV for verdier, relasjonelt for kamper

**Status:** Akseptert (design, implementeres i fase 4)  
**Dato:** 2026-09-22

**Kontekst:** Kravet forbyr å hardkode CS2-felter som eneste modell.

**Valg:** `Game` → `Match` → `MatchPlayer` er relasjonelt.
Måleverdier ligger i `StatisticDefinition` + `StatisticValue` (navn,
enhet, aggregat), ikke 40 kolonner på `Player`.

Vi lager ikke disse tabellene før fase 4, men API og UI skal ikke anta
at «K/D» er et felt i `User`.
