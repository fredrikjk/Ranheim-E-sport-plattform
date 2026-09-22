# MVP-plan

MVP er den minste plattformen som erstatter dagens Idretten Online-side
*og* gir klubben én innlogging med roller. Alt annet bygges oppå dette.

## Definisjon av ferdig MVP

En trener, en spiller, et styremedlem og en admin skal kunne logge inn
med telefon + OTP og bare se det de har permission til. Offentligheten
skal kunne åpne en profesjonell nettside med klubbens identitet, lag,
spillere (kun publiserte, aldri unødvendige barneopplysninger),
sponsorer og live-status når Twitch er konfigurert.

Minstekrav fra produktvisjonen, brutt ned til slices:

| Slice | Innhold | Avhengigheter | Status |
|---|---|---|---|
| 0 | Foundation: repo, docs, tokens, schema, RBAC, offentlig skall | — | Pågår |
| 1 | Offentlig nettside med reelt innhold og CMS-klare modeller | 0 | Neste |
| 2 | Telefon-OTP, sesjoner, rate limit, audit på innlogging | 0 | |
| 3 | Hub: profil, roller, permissions, grunnleggende dashbord | 2 | |
| 4 | Spillere, trenere, lag, medlemskap, scoped coach | 3 | |
| 5 | Grunnleggende statistikk (kamp + fleksible verdier) | 4 | |
| 6 | Grunnleggende trening (program, økt, oppgave, resultat) | 4 | |
| 7 | Twitch live-status på nettside (Helix, server-side) | 1, 2 | |

Slices 5–7 kan parallelliseres etter slice 4. De er alle del av MVP,
men ikke av foundation.

## Slice 0 — Foundation (denne leveransen)

Mål: ingen stor funksjon, men et fundament det går an å bygge på.

- [x] Analysere repo (tomt utover README)
- [x] Dokumentere arkitektur, database, sikkerhet, API, deploy
- [ ] Monorepo med pnpm og Turborepo
- [ ] `packages/ui` med tokens
- [ ] `packages/auth` med permission-katalog og `authorize`
- [ ] `packages/database` med Prisma-skjema for kjerne
- [ ] `apps/web` med profesjonelt offentlig skall
- [ ] Tester som nekter tilgang uten permission
- [ ] Lint, typecheck, test i rot
- [ ] `.env.example`

**Ferdig når:** `pnpm lint`, `pnpm typecheck` og `pnpm test` passerer, og
offentlig forside kan kjøres uten database.

## Slice 1 — Offentlig nettside

Sider: hjem, om oss, lag, spillere, trenere, kamper, resultater,
turneringer, nyheter, streaming, media, sponsorer, kontakt.

Regler:

- SEO på offentlig side, `noindex` på hub og innlogging
- Ingen personopplysninger om mindreårige utover det styret har sagt ja til
- Tomtilstander skal se ferdige ut
- Innhold hentes via service-lag, med statisk fallback inntil CMS/admin finnes

## Slice 2 — Autentisering

- OTP-challenge med hash, TTL, max forsøk, IP-rate limit
- Dev-provider i development
- Produksjonsprovider bak interface
- Sesjon i database + httpOnly cookie
- Logout og revoke
- Audit: `auth.login`, `auth.logout`, `auth.otp_requested` uten å logge kode

## Slice 3 — Club hub

- `/hub` dashbord per rolle
- Egen profil
- Server-side permission-sjekk på alle ruter og API-er
- Tester: player kan ikke kalle `roles.manage`

## Slice 4 — Klubbregister

- CRUD for lag, spillere, trenere bak permissions
- `UserRole.scopeType = TEAM` for trenere
- Publiseringsflagg mot offentlig side

## Slice 5 — Statistikk (grunnleggende)

- Registrer kamp og spillerdeltakelse
- Lagre verdier via `StatisticDefinition`
- Enkel tabell + én tidsserie i hub
- Ingen spill-API-integrasjon ennå

## Slice 6 — Trening (grunnleggende)

- Program → økt → øvelse
- Tildeling til spiller eller lag
- Spiller ser egne oppgaver og registrerer resultat
- Ingen treningsapper ennå, men resultat-API designes slik at de kan skrive

## Slice 7 — Twitch live-status

- Server-side Helix `Get Streams`
- Cache kort TTL
- Offentlig LIVE-banner
- Secrets bare i env
- EventSub kommer *etter* MVP

## Eksplisitt utenfor MVP

Stream Manager, OBS, AI, Discord, push, turneringsmotor, flere klubber,
passkeys, treningsapper (Aim/Reaction/Game Sense/Demo).

## Arbeidsregel per slice

1. Les eksisterende kode og docs
2. List berørte pakker
3. Eventuell schema-migrasjon
4. API-kontrakt
5. Sikkerhetsvurdering
6. Implementer
7. Tester (inkl. deny-tester)
8. Lint / typecheck / test
9. Oppdater docs
