# Audit-Log Konzept

> Status: Akzeptiert
> Letztes Update: 2026-05-11

## Motivation

Audit-Logging ist bei personenbezogenen Daten praktisch Pflicht, auch wenn es in der Aufgabenstellung nicht explizit als MUSS gefordert ist. Treiber:

- **DSGVO Art. 9** (besondere Kategorien personenbezogener Daten): Gesundheitsdaten unterliegen erhöhtem Schutz, Nachvollziehbarkeit von Zugriffen und Änderungen ist Teil der technischen und organisatorischen Maßnahmen
- **Klinische Nachvollziehbarkeit:** wer hat wann welche Änderung am Bogen vorgenommen, welcher Status wurde durch wen ausgelöst
- **Verfahrensverzeichnis nach Art. 30 DSGVO:** Verarbeitungstätigkeiten müssen dokumentiert sein, das Audit-Log liefert Evidenz

## Was wird in der Demo geloggt

| Action              | Trigger                                                         | Erzeugt durch   |
| ------------------- | --------------------------------------------------------------- | --------------- |
| `CREATE`            | Patient-Submit, Anamnese geht in `PENDING_VERIFICATION`         | AnamneseService |
| `EMAIL_VERIFIED`    | Patient-Klick auf Verifikations-Link, Übergang nach `SUBMITTED` | AnamneseService |
| `STATUS_TRANSITION` | Mitarbeiter-Aktion (REVIEW, COMPLETE, REJECT, ARCHIVE)          | AnamneseService |

`UPDATE` ist im Konzept beschrieben (Mitarbeiter ändert medizinische Felder in `IN_REVIEW`), aber nicht in der Demo implementiert, weil Mitarbeiter-Inhaltsbearbeitung selbst nicht im Demo-Scope ist.

## Was nicht in der Demo geloggt wird, aber im Konzept beschrieben

- **READ-Zugriffe** auf sensitive Felder (z.B. Anzeige des Bogens im Backoffice). evtl. DSGVO-relevant. 
- **Auth-Events** (Login, Logout, Failed Login). Gehört eher zum SSO-/Auth-Konzept des Backoffice. Würde via Login-Endpoint und Auth-Guard geloggt

## Datenmodell

Eigene Collection `anamnese_audit_entries`. Felder:

| Feld         | Typ      | Beschreibung                                                   |
| ------------ | -------- | -------------------------------------------------------------- |
| `_id`        | ObjectId | technische ID                                                  |
| `timestamp`  | Date     | Zeitpunkt des Ereignisses                                      |
| `entityType` | String   | `"Anamnese"`. Erlaubt spätere Erweiterung auf andere Entitäten |
| `entityId`   | ObjectId | Verweis auf die Anamnese                                       |
| `action`     | Enum     | `CREATE`, `EMAIL_VERIFIED`, `STATUS_TRANSITION`                |
| `actor`      | Sub-Doc  | siehe unten                                                    |

`actor` Sub-Doc:

| Feld     | Typ              | Beschreibung               |
| -------- | ---------------- | -------------------------- |
| `type`   | String           | `"patient"` oder `"staff"` |
| `userId` | String, optional | nur bei `"staff"`          |
| `role`   | String, optional | nicht befüllt in der Demo  |

Nicht implementiert: `payload` (action-spezifische Details wie `fromStatus`/`toStatus`), `ipAddress`.

### Diff statt Snapshot

Konzeptuell würde ein `UPDATE`-Eintrag nur geänderte Felder mit `before` und `after` persistieren. In der Demo nicht relevant, da Mitarbeiter-Inhaltsbearbeitung nicht implementiert ist.

### Append-only

Keine `UPDATE`- oder `DELETE`-Operationen auf Audit-Einträge. Der `AuditService` exponiert nur `record*`-Methoden. Ein zusätzlicher Mongoose-Hook auf Schema-Ebene als Defense-in-Depth ist konzeptuell beschrieben, aber nicht implementiert.

### Indizes

- `entityId, timestamp` (für Query „alle Einträge zur Anamnese X, chronologisch")
- `action, timestamp` (für Filterung im Audit-UI)

## Implementierung

### Pattern in der Demo: direkter Service-Aufruf

`AuditService` bietet drei Record-Methoden:

```ts
class AuditService {
  recordCreate(entityId: Types.ObjectId): Promise<void>
  recordEMailVerified(entityId: Types.ObjectId): Promise<void>
  recordStatusTransition(entityId: Types.ObjectId, userId: string): Promise<void>
}
```

Alle drei werden aus dem `AnamneseService` aufgerufen.

### Pattern-Alternativen für Produktion

In Produktion sind zwei Erweiterungen sinnvoll, in der Demo aber nicht umgesetzt:

- **Custom Decorator + NestJS Interceptor:** `@Auditable(action)` Decorator auf Service-Methoden, ein Interceptor erzeugt den Audit-Eintrag automatisch nach erfolgreichem Methoden-Return. Vorteil: cross-cutting, kann nicht vergessen werden. Nachteil: implizit, schwerer im Code zu verfolgen
- **Event-Bus:** Service emittiert Domain-Events (`AnamneseCreated`, `AnamneseStatusChanged`, etc.), Audit-Modul subscribt. Vorteil: saubere Entkopplung, andere Konsumenten möglich (z.B. Reporting). Nachteil: async-Verhalten, Risiko des Audit-Verlusts bei Crash

## Sichtbarkeit im Backoffice

| Aspekt               | Demo                                                                   | Produktion                        |
| -------------------- | ---------------------------------------------------------------------- | --------------------------------- |
| UI-Form              | Tab in der Backoffice-Detail-Ansicht                                   | identisch, mit Filter nach Action |
| Sichtbarkeit         | für alle Backoffice-Mitarbeitenden sichtbar (kein ADMIN-Guard in Demo) | UI-Tab nur für `ADMIN`            |
| Inhalt               | chronologische Liste der Audit-Einträge zur einzelnen Anamnese         | identisch                         |
| Bulk-Audit-Dashboard | Out-of-Scope                                                           | Konzept-Erweiterung               |

GraphQL-Query (in Demo implementiert):

```graphql
query GetAuditEntries($anamneseId: String!) {
  getAuditEntries(anamneseId: $anamneseId) {
    id
    timestamp
    action
    actor { type, userId, role }
  }
}
```

## Aufbewahrung

| Kontext                            | Festlegung                                                                                                           |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Demo                               | kein Lösch-Mechanismus, Audit-Einträge bleiben unbegrenzt                                                            |
| Produktion                         | mindestens 10 Jahre (ärztliche Aufbewahrungspflicht, MBO-Ä §10)                                                      |
| DSGVO Art. 17 (Recht auf Löschung) | wird durch Aufbewahrungspflicht eingeschränkt, dokumentiert in der Datenschutzerklärung der Klinik                   |
| Cleanup-Strategie in Produktion    | Cron-Job, der Audit-Einträge älter als 10 Jahre löscht oder auf Cold Storage verschiebt. In Demo nicht implementiert |

## DSGVO Art. 9 Bezug

Anamnesebogen-Daten sind Gesundheitsdaten und damit besondere Kategorien personenbezogener Daten gemäß Art. 9 Abs. 1 DSGVO. Verarbeitung ist über Art. 9 Abs. 2 lit. h (Heilbehandlung) gerechtfertigt, setzt aber erhöhte technische und organisatorische Maßnahmen voraus.

Das Audit-Log ist eines dieser TOMs:

- Nachvollziehbarkeit jeder schreibenden Operation
- Zugriffsbeschränkung über `ADMIN`-Rolle (konzeptuell, in Demo nicht implementiert)
- Append-only verhindert Manipulation
- Speicherung in eigener Collection erlaubt separates Backup und feinere Zugriffskontrolle

## Was im Repo demonstriert wird

- `AuditService` mit drei `record*`-Methoden (`recordCreate`, `recordEMailVerified`, `recordStatusTransition`)
- Audit-Einträge bei `CREATE`, `EMAIL_VERIFIED`, `STATUS_TRANSITION`
- Append-only durch Service-Design (keine update/delete-Methoden)
- Backoffice-UI-Tab mit chronologischer Audit-Liste pro Anamnese
- GraphQL-Query `getAuditEntries`

## Was im Konzept beschrieben aber nicht implementiert ist

- `payload`-Feld mit action-spezifischen Details (z.B. `fromStatus`/`toStatus` bei `STATUS_TRANSITION`)
- `ipAddress`-Logging bei Public-Aktionen
- `UPDATE`-Action und Diff-Persistenz für Mitarbeiter-Inhaltsbearbeitung
- ADMIN-Guard auf Audit-Queries
- Mongoose-Hook als zusätzliche Append-only-Absicherung auf Schema-Ebene
- READ-Logging für sensitive Felder
- Auth-Event-Logging (Login, Logout, Failed Login)
- Decorator/Interceptor-Pattern für cross-cutting Audit
- Event-Bus-Pattern für entkoppeltes Auditing
- Audit-Export (CSV, JSON)
- Bulk-Audit-Dashboard
- 10-Jahre-Aufbewahrungs-Cleanup-Job
- ACID-Transactions zwischen Hauptoperation und Audit-Eintrag (erfordert MongoDB Replica Set)

## Verweise

- Statusmodell: [docs/statusmodell.md](statusmodell.md) (jede Status-Transition erzeugt einen Audit-Eintrag)
- Public-Auth: [docs/auth-public-bogen.md](auth-public-bogen.md) (`EMAIL_VERIFIED` erzeugt einen Audit-Eintrag)
- Architektur: [docs/architektur.md](architektur.md) (`AnamneseAuditEntry` als Entität)
