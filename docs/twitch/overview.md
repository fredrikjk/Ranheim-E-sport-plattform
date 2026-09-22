# Twitch

**Status:** Designklart. Live-status er MVP slice 7. EventSub etter MVP.

## Hva som skal skje

- Koble Twitch-konto til en `User` (OAuth, server-side)
- Hente live-status med Helix `Get Streams`
- Vise LIVE på offentlig side
- Senere: EventSub for stream.online / stream.offline

## Sikkerhet

| Hemmelighet | Plassering |
|---|---|
| Client ID | server env, kan eksponeres bare hvis Twitch krever det i OAuth-lenke |
| Client secret | bare server |
| Webhook secret | bare server |
| User access / refresh | kryptert i database |

Frontend kaller aldri Twitch direkte med klubbens secret.

## MVP-tilnærming

Kort cache (30–60 s) av live-status. Polling er nok for én klubb.
EventSub kommer når flere streamere og automatisering trenger push.
