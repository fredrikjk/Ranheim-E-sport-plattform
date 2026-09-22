# Database

**Motor:** PostgreSQL  
**ORM:** Prisma 6  
**Migrasjoner:** Prisma Migrate, aldri udokumenterte manuelle endringer  
**Pakke:** `packages/database`

## Prinsipper

- Normaliser relasjoner. Ikke gjem lagmedlemskap i JSON.
- Foreign keys på alle eierskap.
- Indekser på oppslag vi faktisk gjør (innlogging, membership, audit-tid).
- Soft delete på personer (`deletedAt`). Hard delete bare via dokumentert
  GDPR-rutine.
- Aldri personnummer. Telefon og e-post er valgfrie identifikatorer;
  minst ett innloggingsidentifikator kreves ved aktivering.
- Barn: `dateOfBirth` er tilgangsstyrt og aldri offentlig.

## Kjerneentiteter (foundation)

```text
User
  ├─ Session
  ├─ OtpChallenge
  ├─ UserRole ── Role ── RolePermission ── Permission
  ├─ UserPermission
  ├─ PlayerProfile
  ├─ CoachProfile
  ├─ TeamMembership ── Team ── Game
  ├─ Consent
  └─ AuditLog (som aktør)

Sponsor
```

### User

Sentral identitet for alle apper. Ikke egne kontoer per flate.

| Felt | Merknad |
|---|---|
| `name` | Juridisk/fullt navn, intern bruk |
| `displayName` | Vist navn i hub |
| `phone` | E.164, unik hvis satt |
| `email` | Unik hvis satt |
| `avatarObjectKey` | Nøkkel i objektlagring, ikke base64 |
| `status` | `PENDING` `ACTIVE` `SUSPENDED` `DELETED` |
| `dateOfBirth` | Intern, aldri på offentlig API |
| `deletedAt` | Skjules fra vanlige queries |

### RBAC

- `Role.slug`: `player` `coach` `board` `admin`
- `Permission.slug`: `domain.action`, f.eks. `players.write`
- `UserRole.scopeType`: `CLUB` eller `TEAM`
- `UserRole.scopeId`: lag-id når scoped
- `UserPermission.effect`: `GRANT` eller `DENY` for unntak

DENY vinner over rolle-GRANT.

### Session og OTP

- OTP lagres som hash, aldri i klartekst.
- `attempts` + `expiresAt` håndheves i service-lag *og* som data.
- Sesjonstoken i cookie er en tilfeldig verdi; databasen lagrer hash.
- `revokedAt` gjør logout og «logg ut alle enheter» mulig.

### Klubb

- `Game` gjør statistikk og lag spill-agnostiske.
- `Team.published` styrer offentlig synlighet.
- `TeamMembership.title` er spillrolle («IGL»), ikke RBAC-rolle.
- Profiler har eget `published`-flagg. Upublisert profil finnes ikke på
  nettsiden, selv om brukeren finnes i hub.

### Consent

Egne rader per samtykketype (`public_profile`, `streaming`,
`guardian_media`, …). Tilbaketrekking setter `withdrawnAt`, sletter ikke
historikk.

### AuditLog

| Felt | Innhold |
|---|---|
| `actorUserId` | Null ved systemjobb eller etter anonymisering |
| `action` | Stabil nøkkel, f.eks. `role.changed` |
| `targetType` / `targetId` | Pekere, ikke dumps av objektet |
| `metadata` | Diff av ikke-sensitive felt (`from: player, to: coach`) |
| `requestId` | Korrelasjon mot server-logg |

Forbudt i metadata: OTP, telefon i klartekst, tokens, helse, fødselsdato.

## Fremtidige domener

Disse tabellene opprettes når slicen starter, ikke før.

### Statistikk

```text
Game
Match                (gameId, playedAt, source, externalId?)
MatchPlayer          (matchId, userId, teamId?)
StatisticDefinition  (gameId?, key, label, unit, aggregation)
StatisticValue       (definitionId, matchPlayerId?, userId, teamId?, value, recordedAt)
```

`externalId` + `source` gjør det mulig å koble Faceit/HLTV/egne importer
senere uten å skrive om kjernen.

### Trening

```text
TrainingProgram
TrainingProgramItem  → Exercise
TrainingAssignment   (programId, userId? teamId?)
TrainingSession
TrainingResult       (sessionId, userId, exerciseId, payload)
TrainingGoal
```

`TrainingResult.payload` kan være JSON *i tillegg til* typed kolonner for
verdi og enhet, slik at egne treningsapper kan rapportere uten
skjemaendring for hvert spill.

### Streaming

```text
TwitchAccount (userId, twitchUserId, login, encrypted refresh)
StreamState   (twitchUserId, live, title, gameName, startedAt, updatedAt)
```

Refresh-tokens krypteres at-rest. De ligger aldri i frontend.

### Arrangement

```text
Event
Tournament
TournamentMatch → kan peke på statistikk-Match når kampen er spilt
```

## Indekser (foundation)

- `User.phone`, `User.email` unike
- `User.status`
- `Session.tokenHash` unik, `Session.expiresAt`
- `OtpChallenge(identifier, createdAt)`
- `UserRole(userId)`
- `TeamMembership(teamId, userId)` unik
- `AuditLog(createdAt)`, `AuditLog(targetType, targetId)`

## Migrasjonsregel

1. Endre `schema.prisma`
2. `pnpm --filter @ranheim/database prisma migrate dev --name <navn>`
3. Oppdater dette dokumentet
4. Aldri «hotfix i produksjon» uten migrate
