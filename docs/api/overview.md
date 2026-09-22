# API

Frontend, Stream Manager og fremtidige treningsapper snakker med
plattformen over HTTP. De snakker aldri med databasen.

## Lagdeling

```text
HTTP (apps/web/app/api)
  → authenticate session
  → authorize permission + resource
  → service
  → Prisma / eksterne klienter
```

## Konvensjoner

- Ressursnavn i flertall: `/api/players`
- JSON, UTF-8
- Stabil `error.code` + brukervennlig `error.message`
- `requestId` i respons-header og logg
- Ingen stack trace, Prisma-kode eller SQL til klient

Eksempel feil:

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Du har ikke tilgang til denne handlingen."
  }
}
```

## Tenkte endepunkter (ikke alle implementeres i foundation)

| Metode | Sti | Permission | Fase |
|---|---|---|---|
| POST | `/api/auth/otp/request` | offentlig, rate limited | 2 |
| POST | `/api/auth/otp/verify` | offentlig, rate limited | 2 |
| POST | `/api/auth/logout` | innlogget | 2 |
| GET | `/api/me` | innlogget | 2 |
| GET | `/api/players` | `players.read` | 4 |
| POST | `/api/training/sessions` | `training.write` | 6 |
| GET | `/api/statistics/player/:id` | `statistics.read` + resource | 5 |
| POST | `/api/twitch/connect` | `streaming.manage` | 7 |
| GET | `/api/streams/live` | offentlig cachet | 7 |

## Kontrakter

Zod-skjema bor i `packages/api`. Webapp og senere klienter importerer
typer derfra. Breaking changes krever ny versjon eller additivt felt.

## Autorisasjon i API

Hvert muterende og hvert private GET-endepunkt kaller `authorize`.
Offentlige GET-endepunkter returnerer bare publiserte, minimert data.

En spiller som kaller `GET /api/players/:id` på en annen upublisert
spiller skal få `404` eller `403` — aldri 200 med tomme felt som lekker
eksistens unødvendig. For interne hub-lister kan 403 være riktig. Valget
dokumenteres per endepunkt.

## Rate limiting

Åpne auth-endepunkter har strengere tak enn innloggede. Begrensning
skjer server-side (minne i ett-instans dev, delt store i prod).

## Versjonering

MVP bruker `/api/...` uten versjonsprefiks. Når eksterne treningsapper
finnes i produksjon, fryses v1 og `/api/v2` åpnes additivt.
