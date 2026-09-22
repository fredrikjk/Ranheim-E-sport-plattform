# Ranheim E-sport Platform — arkitekturoversikt

Dette dokumentet er den autoritative beskrivelsen av plattformens fundament.
Det er skrevet før større implementasjoner, slik at senere arbeid kan skje
modulært uten å låse oss til kortsiktige snarveier.

**Status:** Fase 1 — Foundation  
**Sist oppdatert:** 2026-09-22  
**Målgruppe:** utviklere, teknisk ansvarlig, styre/produkt ved behov

---

## 1. Nåværende tilstand

Repositoryet `fredrikjk/Ranheim-E-sport-plattform` var ved oppstart et
tomt Git-repo med kun en kort README:

- ingen applikasjoner
- ingen database
- ingen autentisering
- ingen designsystem
- ingen eksisterende kode som må bevares utover intensjonen i README

Dagens offentlige nettside ligger hos Idretten Online
(`esport.ril.no`). Den dekker grunnleggende klubbinformasjon, men er ikke
en e-sportplattform. Denne kodebasen skal erstatte den over tid, uten å
arve begrensningene i det eksisterende CMS-et.

Klubbfakta som styrer produkt og personvern:

- Ranheim E-sport er en særidrett i Ranheim Idrettslag
- etablert høsten 2024
- ca. 70 medlemmer, barn og unge fra Trondheim
- visjon: *Flest mulig, lengst mulig*
- klubbfarger i allianseidrettslagets lov: blå bunn, hvit kant, initialer R.I.L.
- Offisiell e-sportlogo bruker `#1F3378` / `#FFFFFF`
- adresse: Krafthallen, Ranheimsfjæra 44, 7055 RANHEIM
- org.nr. 975 605 140, `post@ril.no`

Dette er en ungdomsklubb. Personvern, samtykke og dataminimering er
førsteklasses krav, ikke et senere tillegg.

---

## 2. Prinsipper

1. **Sikkerhet først.** All tilgang sjekkes server-side. Frontend skjuler
   knapper; den autoriserer aldri.
2. **RBAC med roller + permissions.** Ingen `isAdmin`-boolean som eneste
   kontroll. Admin er en rolle som gir et sett permissions.
3. **Én identitet.** Samme bruker på nettside, hub, trening og senere
   Stream Manager.
4. **Modulært, ikke monolittisk rot.** Ett deploybart web-fundament nå.
   Flere apper senere når grensene er reelle.
5. **Ikke overengineer MVP.** Design for vekst, implementer det som
   trengs for neste slice.
6. **EU-data.** Personopplysninger skal kunne ligge i EU/EØS.
7. **Ingen secrets i frontend eller git.**
8. **Dokumenterte avgjørelser.** Når vi velger bort et alternativ, skriver
   vi hvorfor. Se [decisions.md](./decisions.md).

---

## 3. Endelig mappestruktur

Strukturen tilpasses valgt stack (pnpm + Turborepo + Next.js). Pakker som
ikke har kode ennå er *reservert* og skal ikke opprettes tomme.

```text
apps/
  web/                      # Offentlig nettside + innlogget klubbhub
  stream-manager/           # RESERVERT — desktop-app (fase 8)

packages/
  ui/                       # Design tokens og felles UI
  auth/                     # Autentisering + autorisasjon (RBAC)
  database/                 # Prisma-schema, client, migrations
  api/                      # API-kontrakter og feilmodell
  config/                   # Felles env-validering
  types/                    # Felles TypeScript-typer
  twitch/                   # RESERVERT — fase 7
  statistics/               # RESERVERT — fase 4
  training/                 # RESERVERT — fase 5

docs/
  architecture/
  database/
  security/
  api/
  deployment/
  training/
  streaming/
  twitch/

tooling kommer i rot (tsconfig, turbo, eslint, CI)
```

### Hvorfor én webapp nå, ikke fire

Forslaget i produktvisjonen har `web`, `admin`, `player` og
`stream-manager` som egne apper. Det er riktig *langsiktig* for Stream
Manager (desktop). Det er feil for MVP.

| Alternativ | Fordel | Kostnad | Valg |
|---|---|---|---|
| Fire Next.js-apper | Isolasjon, uavhengig deploy | Fire auth-cookie-domener, fire bundler, for tidlig for 70 medlemmer | Nei |
| To apper: `web` + `hub` | Offentlig site kan caches hardere | Delt innlogging blir vanskeligere | Senere, hvis cache/sikkerhet krever det |
| Én Next.js-app med route groups | Én sesjon, ett designsystem, ett deploy | Appen vokser — krever disiplin i mapper | **Ja, nå** |
| Stream Manager som web | Raskere start | OBS-kontroll krever desktop | Nei, egen app i fase 8 |

Route groups i `apps/web`:

```text
app/
  (public)/          # SEO, cachebart, åpent
  (auth)/            # innlogging, ingen index
  (hub)/             # innlogget, noindex, RBAC
```

Når `admin` eller `player` faktisk trenger eget deploy, flyttes
route group ut. Datamodell, auth og API forblir i `packages/`.

---

## 4. Teknologistack

| Lag | Valg | Hvorfor | Bevisst ikke |
|---|---|---|---|
| Runtime | Node.js 22 LTS | Next.js, Prisma, observabilitet | Cloudflare Workers som hovedruntime |
| Språk | TypeScript strict | Felles kontrakter på tvers av apper | `any` som snarvei |
| Monorepo | pnpm workspaces + Turborepo | Modent, raskt, TypeScript-først | Nx (tyngre), Yarn |
| Web | Next.js App Router | SSR/SSG for SEO, server actions/route handlers som API-grense | Vite SPA for offentlig side |
| UI | React + SCSS + CSS variables | Etter krav, tokens i stedet for tilfeldige farger | Tailwind, Bootstrap, shadcn som design |
| API | Next.js Route Handlers + service-lag | Tydelig grense uten egen API-server i MVP | tRPC inntil kontrakten er stabil |
| Validering | Zod | Runtime + TypeScript fra samme kilde | Uvalidert `req.body` |
| Database | PostgreSQL | Relasjoner, constraints, GDPR-sletting, vekst | SQLite, Mongo, D1 |
| ORM | Prisma 6 | Migrasjoner, TS-client, forutsigbar modell | Drizzle (lett, men mindre migreringsmodenhet for teamet), raw SQL som default |
| Auth | Egen `packages/auth` | OTP, ungdomsklubb, scoped RBAC, GDPR | `isAdmin`, passord-tabell, Clerk-lock-in |
| Auth-leverandør (SMS) | Provider-interface | Dev-OTP nå, Twilio/Vipps senere | Secrets i frontend |
| Filer | Cloudflare R2 senere | Objektlagring, ikke BLOB i Postgres | Filer i git eller database |
| Edge | Cloudflare DNS + WAF + CDN | Riktig verktøy for edge, ikke for all compute | «Cloudflare skal gjøre alt» |
| Hosting (app) | Node-host (Vercel eller Fly.io) | Next.js full funksjon | OpenNext/Workers som førstevalg |
| Test | Vitest + Playwright (senere) | Enhet nå, E2E når hub finnes | Snapshot-only UI-tester |
| Observability | Structured logs først | requestId, userId, error — uten PII i klartekst | Stack traces til sluttbruker |

Detaljerte valg: [decisions.md](./decisions.md).

---

## 5. Applikasjonsgrenser

```text
Nettleser / Stream Manager
        │
        ▼
   apps/web  (HTTP, cookies, CSRF, rate limit)
        │
        ▼
   service-lag  (packages/*  +  apps/web/server)
        │
        ▼
   Prisma / eksterne API-er (Twitch, SMS, R2)
```

Regler:

- UI henter aldri Prisma-client direkte.
- Route handlers gjør: parse → authn → authz → service → map til DTO.
- Service-laget eier forretningsregler og audit.
- Eksterne nøkler (Twitch, SMS, R2) lever bare server-side.

---

## 6. Identitet, roller og tilgang

Autentisering og autorisasjon er **to ulike moduler** i `packages/auth`.

### Autentisering (hvem er du?)

MVP-primærvei:

1. Bruker oppgir telefonnummer
2. Server oppretter `OtpChallenge` med hashed kode, kort TTL, forsøksgrense
3. Kode sendes via SMS-provider (dev-provider logger aldri koden i prod)
4. Ved treff opprettes `Session` i database
5. HttpOnly, Secure, SameSite=Lax cookie peker på sesjonen
6. Sesjoner kan revoqueres (tap av telefon, styrevedtak, GDPR)

Senere kanaler bruker samme `User` og samme sesjonsmodell:

- e-post-OTP
- passkeys
- Google / Microsoft OAuth

Passord lagres ikke. Det finnes ingen passordkolonne.

### Autorisasjon (hva får du lov til?)

```text
User ──< UserRole >── Role ──< RolePermission >── Permission
  │
  └──< UserPermission   (unntak: GRANT eller DENY)
```

Roller i MVP:

| Rolle | Typisk bruker | Merknad |
|---|---|---|
| `player` | utøver | Standard for medlemmer |
| `coach` | trener | Kan scopes til ett eller flere lag |
| `board` | styre | Klubbadministrasjon, ikke teknisk superuser |
| `admin` | teknisk admin | Full permission-mengde, audit på alt |

Permissions er stabile slugs, aldri hardkodede UUID-er i applikasjonskode.

Scoped roller: en trener kan være `coach` på `TEAM:<id>` uten å være
trener for hele klubben. Det gir minst privilegium uten egne
brukerkontoer per lag.

Ressurstilgang er to-lag:

1. Har brukeren permission `players.read`?
2. Har brukeren lov til *denne* spilleren / *dette* laget?

Lag 2 lever i policy-funksjoner (`canAccessTeam`, `canAccessPlayer`),
ikke i UI.

---

## 7. Databasearkitektur

PostgreSQL + Prisma. Skjemaet er relasjonelt, med foreign keys og
indekser. JSON brukes bare der verdien er virkelig schemaløs
(audit-metadata uten PII, fremtidige spillspesifikke tilleggsfelt som
ikke spørres på).

Kjerne i foundation:

- identitet: `User`, `Session`, `OtpChallenge`
- RBAC: `Role`, `Permission`, `RolePermission`, `UserRole`, `UserPermission`
- klubb: `Game`, `Team`, `TeamMembership`, `PlayerProfile`, `CoachProfile`
- personvern: `Consent`
- sporbarhet: `AuditLog`
- offentlig: `Sponsor`

Fremtidige domener (dokumentert, ikke opprettet som tomme pakker):

- statistikk: `Match`, `MatchPlayer`, `StatisticDefinition`, `StatisticValue`
- trening: program, økt, øvelse, oppgave, resultat
- streaming: Twitch-konto, live-state, EventSub-cursor
- arrangement: event, turnering, kampoppsett
- varsler: outbox + kanaler

Full modell: [../database/overview.md](../database/overview.md).

---

## 8. Deployment-arkitektur

```text
                    ┌─ Cloudflare ─────────────────┐
 Bruker ─ DNS/TLS ─►│ WAF  CDN  (senere R2)        │
                    └────────────┬─────────────────┘
                                 │
                    ┌────────────▼─────────────────┐
                    │ Next.js på Node-host         │
                    │ (Vercel eller Fly.io, EU)    │
                    └────────────┬─────────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                  ▼
     PostgreSQL (EU)      Secrets store        Twitch / SMS
     f.eks. Neon EU       env på host          server-side
```

Cloudflare brukes til det Cloudflare er best på. Applikasjonsserveren
kjører der Next.js og Prisma er førstklassiske. Workers kan senere
håndtere Twitch EventSub-ingest eller cache-purge — ikke hele produktet.

Detaljer: [../deployment/overview.md](../deployment/overview.md).

---

## 9. Designsystem

Visuell retning: seriøs norsk idrettsklubb med e-sport som gren. Ikke
generisk SaaS, ikke neon-gaming.

- mørk marinebase
- klubbblå `#1F3378` som merkevare og sidebakgrunn
- logo-hvit `#FFFFFF` som tekst og kontrast
- ingen gull- eller neonaksenter utenfor logoen
- kondenserte overskrifter, lesbar brødtekst
- LIVE som presist signal, ikke pynt

Tokens bor i `packages/ui` som CSS variables. Komponenter bruker tokens,
ikke hardkodede hex-verdier.

---

## 10. Hva denne fasen *ikke* bygger

Bevisst utsatt, med arkitektur klar:

- SMS-leverandør i produksjon
- passkeys / OAuth
- treningssystem og treningsapper
- statistikkmotor
- Twitch EventSub
- Stream Manager / OBS
- AI-funksjoner
- Discord / push / SMS-varsler
- flerklubb / multi-tenant
- egen admin-app og egen player-app

---

## 11. Neste steg

Konkret gjennomføring står i [mvp.md](./mvp.md).

Foundation (denne fasen) skal gi:

1. dokumentert arkitektur
2. monorepo som bygger
3. design tokens + offentlig sideskall
4. Prisma-skjema for identitet og RBAC
5. permission-katalog og server-side `authorize`
6. tester som beviser at manglende permission nektes
7. `.env.example` uten secrets
