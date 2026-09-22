# Sikkerhet og personvern

Ranheim E-sport har barn og unge som primære medlemmer. Plattformen
behandles som et produksjonssystem med personopplysninger, ikke som en
demo.

## Trusselmodell (kort)

| Trussel | Mottiltak |
|---|---|
| Horisontal privilegieheving (spiller ser annen spillers privatdata) | Server-side permission + resource policy |
| Vertikal privilegieheving (spiller blir admin i klienten) | Roller bare i database, aldri fra request body |
| OTP-gjetting | Hash, TTL, forsøksgrense, IP-rate limit |
| Session-tyveri | HttpOnly Secure cookie, hash i DB, revoke |
| CSRF | SameSite=Lax + origin-sjekk på muterende kall |
| Hemmeligheter i frontend | Twitch/SMS/R2 kun server-side |
| Massiv innsamling av barneopplysninger | Dataminimering, `published`, samtykke |
| Logg-lekkasje | Ingen OTP, tokens eller telefon i logger |

## Autentisering

- Ingen passordkolonne.
- OTP hashes (scrypt/argon2id) før lagring.
- Maks antall forsøk per challenge, deretter ny challenge.
- Rate limit per identifikator og per IP.
- Dev-provider er kompilert bort eller nektet når `NODE_ENV=production`.
- Cookie: `HttpOnly`, `Secure` i produksjon, `SameSite=Lax`, kort idle
  med sliding renewal som audit-logges ved behov.

## Autorisasjon

```text
request
  → last session
  → resolve permissions (roles + grants − denies)
  → authorize(permission)
  → authorizeResource(entity)
  → service
```

UI kan skjule handlinger for brukervennlighet. Det er aldri
sikkerhetsgrensen.

Tester skal dekke:

- player kan ikke `roles.manage`
- player kan ikke lese upublisert fremmed profil
- coach uten team-scope kan ikke endre annet lags trening
- board kan ikke anta tekniske admin-permissions med mindre de er gitt
- admin-handlinger skrives til audit

## Inputvalidering

Zod-kontrakter i `packages/api`. Ugyldig input → 400 med stabil
`error.code`, aldri Prisma-feil til klienten.

## Hemmeligheter

| Variabel | Hvor |
|---|---|
| `DATABASE_URL` | Host secrets |
| `AUTH_SECRET` | Host secrets (≥ 32 byte) |
| `TWITCH_CLIENT_ID` / `TWITCH_CLIENT_SECRET` | Host secrets |
| `OTP_PROVIDER_*` | Host secrets |
| `CLOUDFLARE_*` | Host secrets |

`.env.example` dokumenterer navn, aldri verdier. Hemmeligheter committes
ikke.

## GDPR

- Hjemmel og formål skal kunne forklares per datafelt.
- Innsyn: eksport av brukerens egne rader.
- Sletting: dokumentert rutine som anonymiserer audit, sletter profil,
  revoquerer sesjoner.
- Offentlig nettside viser bare `published` + samtykkede felt.
- `dateOfBirth` og telefon er aldri del av offentlig API.
- Foresattesamtykke modelleres som `Consent` (`guardian_media` osv.).
- Lagringstid for OTP-challenge er minutter, ikke måneder.
- Velg EU-region for Postgres.

Vi samler ikke inn data «fordi det kan bli nyttig».

## Audit

Administrative handlinger *skal* kunne forklares i ettertid:

- rolleendring
- tildeling av trening
- publisering av mindreårig profil
- sletting av bruker

Audit inneholder aktør, handling, mål, tid, requestId og en begrenset
diff. Ikke dumps av request body.

## Feil til bruker vs. logg

Bruker: «Kunne ikke logge inn. Prøv igjen.»  
Server: `{ requestId, userId?, error.name, timestamp }`

Ingen stack traces i HTTP-respons.

## Sjekkliste før en slice er ferdig

- [ ] Permission-sjekk i service eller route, ikke bare i UI
- [ ] Deny-test finnes
- [ ] Ingen ny secret i repo
- [ ] Offentlige queries filtrerer `published` og `deletedAt`
- [ ] Audit på administrative mutasjoner
- [ ] Rate limit vurdert på nye åpne endepunkter
