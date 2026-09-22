# Deployment

## Målmiljø

| Komponent | Valg | Region |
|---|---|---|
| DNS / TLS / WAF / CDN | Cloudflare | anycast |
| Next.js-app | Vercel eller Fly.io | EU hvis mulig |
| PostgreSQL | Administrert Postgres (f.eks. Neon) | EU |
| Objektlagring | Cloudflare R2 (når media trengs) | EU-jurisdiksjon der det tilbys |
| Secrets | Hostens secret store | aldri git |

## Hvorfor ikke «alt på Cloudflare»

Workers og D1 er sterke på kant-logikk og lette datamodeller. Denne
plattformen har relasjonell RBAC, sesjoner, migrasjoner og et fullt
Next.js-app-router-løp. Det kjører mer forutsigbart på Node.

Workers er aktuelle senere for:

- Twitch EventSub-mottak
- cache purge når live-status endres
- enkle redirects

## Miljøer

| Navn | Bruk |
|---|---|
| `development` | Lokal, Dev-OTP, seed-data |
| `preview` | PR-deploy, egen database eller branch-db |
| `production` | Skarp, EU, WAF, ingen Dev-OTP |

## Kommandoer

```bash
pnpm install
pnpm --filter @ranheim/database prisma migrate deploy
pnpm --filter @ranheim/web build
```

Rot-scripts:

- `pnpm dev` — web
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

## Cloudflare-oppsett (når domene peker hit)

1. DNS til apphost
2. Full (strict) TLS
3. WAF managed rules + rate limit på `/api/auth/*`
4. Cache HTML for offentlig site med kort TTL / cache-tag
5. Bypass cache for `(hub)` og `/api/*`
6. R2-bucket når første opplasting kommer

## Observability (forberedt, ikke fullt utbygd)

Hver request skal kunne bære `requestId`. Logger er JSON:

```json
{
  "level": "error",
  "requestId": "…",
  "userId": "…",
  "event": "training.session.save_failed",
  "timestamp": "2026-09-22T00:00:00.000Z"
}
```

Senere: error tracking, uptime, query-metrics. Vi venter med å kjøpe
verktøy til første produksjonsdeploy.

## CI

GitHub Actions kjører lint, typecheck og test på pull requests.
E2E legges til når innlogging finnes (slice 2+).
