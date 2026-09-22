# Trening

**Status:** Designklart, ikke implementert (MVP slice 6, apper i fase 6).

Trening er en hovedmodul, men den bygges *etter* identitet, RBAC og lag.

## Målbilde

```text
Coach lager program
  → tildeler til spiller / lag / gruppe
    → spiller gjennomfører økt
      → resultat til Training API
        → statistikk + trenerdashbord
```

Egne apper (Aim, Reaction, Game Sense, Demo) er klienter mot samme API.
De får ikke egne brukertabeller.

## Begreper

| Begrep | Betydning |
|---|---|
| Program | Samling øvelser, f.eks. «Aim — Flicking» |
| Exercise | En øvelse med måletype |
| Session | En gjennomføring |
| Assignment | Tildeling til person eller lag |
| Result | Målt verdi fra hub eller treningsapp |
| Goal | Avtalt mål, ikke AI-fasit |

## Sikkerhet

- `training.read` / `training.write` / `training.manage`
- Spiller skriver bare egne resultater
- Trener med team-scope ser bare egne lag
- AI-forslag (fase 9) merkes som forslag, aldri som vedtak
