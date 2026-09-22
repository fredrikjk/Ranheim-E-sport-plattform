# Streaming og Stream Manager

**Status:** Designklart, ikke implementert (live-status i MVP slice 7,
Stream Manager i fase 8).

## Prinsipp

Klubben eier merkevare og sponsor-assets sentralt. Spilleren starter
stream. Stream Manager henter konfigurasjon, tar backup av OBS, deretter
anvender klubbprofil.

```text
Cloud (hub)
  → stream configuration + sponsor assets
    → Stream Manager (desktop)
      → backup OBS
      → apply
      → report live til API
        → nettside viser LIVE
```

## Regler

- Aldri skriv OBS-endringer uten backup.
- Twitch-secrets forblir server-side. Desktop-appen får kortlivede tokens
  via innlogget API, ikke client secret.
- Automatisering (Discord, sponsor-overlay, scenevalg) slås på stegvis.
