# Audit-Log Konzept

> Status: Akzeptiert
> Letztes Update: 2026-05-04

## Motivation

Audit-Logging ist bei medizinischen Daten praktisch Pflicht, auch wenn es in der Aufgabenstellung nicht explizit als MUSS gefordert ist. Treiber:

- **DSGVO Art. 9** (besondere Kategorien personenbezogener Daten): Gesundheitsdaten unterliegen erhöhtem Schutz, Nachvollziehbarkeit von Zugriffen und Änderungen ist Teil der technischen und organisatorischen Maßnahmen
- **Klinische Nachvollziehbarkeit:** wer hat wann welche Änderung am Bogen vorgenommen, welcher Status wurde durch wen ausgelöst
- **Verfahrensverzeichnis nach Art. 30 DSGVO:** Verarbeitungstätigkeiten müssen dokumentiert sein, das Audit-Log liefert Evidenz

## Was wird in der Demo geloggt

| Action | Trigger | Erzeugt durch |
|---|---|---|
| `CREATE` | Patient-Submit, Anamnese geht in `PENDING_VERIFICATION` | AnamneseService |
| `EMAIL_VERIFIED` | Patient-Klick auf Verifikations-Link, Übergang nach `SUBMITTED` | StatusService |
| `STATUS_TRANSITION` | Mitarbeiter-Aktion (REVIEW, COMPLETE, REJECT, ARCHIVE) | StatusService |

`UPDATE` ist im Konzept beschrieben (Mitarbeiter ändert medizinische Felder in `IN_REVIEW`), aber in Cut-Stufe 2 nicht in der Demo implementiert, weil Mitarbeiter-Inhaltsbearbeitung selbst nicht im Demo-Scope ist.

## Was nicht in der Demo geloggt wird, aber im Konzept beschrieben

- **READ-Zugriffe** auf sensitive Felder (z.B. Anzeige des Bogens im Backoffice). DSGVO-relevant. Implementierungs-Aufwand für eine Demo zu hoch
- **Auth-Events** (Login, Logout, Failed Login). Gehört eher zum SSO-/Auth-Konzept des Backoffice. Würde via Login-Endpoint und Auth-Guard geloggt

## Datenmodell

Eigene Collection `anamnese_audit_entries`. Felder:

| Feld | Typ | Beschreibung |
|---|---|---|
| `_id` | ObjectId | technische ID |
| `timestamp` | Date | Zeitpunkt des Ereignisses |
| `entityType` | String | `"Anamnese"`. Erlaubt spätere Erweiterung auf andere Entitäten |
| `entityId` | ObjectId | Verweis auf die Anamnese |
| `action` | Enum | `CREATE`, `EMAIL_VERIFIED`, `STATUS_TRANSITION` (in Demo); `UPDATE` (im Konzept für Produktion) |
| `actor` | Sub-Doc | siehe unten |
| `payload` | Sub-Doc | action-spezifisch, siehe unten |
| `ipAddress` | String, optional | bei Public-Aktionen relevant |

`actor` Sub-Doc:

| Feld | Typ | Beschreibung |
|---|---|---|
| `type` | Enum | `PATIENT`, `STAFF`, `ADMIN`, `SYSTEM` |
| `userId` | ObjectId, optional | nur bei `STAFF` und `ADMIN` |
| `role` | String, optional | nur bei `STAFF` und `ADMIN` |

Action-spezifische `payload`-Strukturen:

| Action | Payload |
|---|---|
| `CREATE` | leer (Initial-Zustand ist die Anamnese selbst) |
| `EMAIL_VERIFIED` | `{ verifiedAt: Date }` |
| `STATUS_TRANSITION` | `{ fromStatus: AnamneseStatus, toStatus: AnamneseStatus, action: AnamneseAction }` |
| `UPDATE` | `{ changes: Array<{ field: String, before: Any, after: Any }> }` |

### Diff statt Snapshot

Bei `UPDATE` werden nur geänderte Felder mit `before` und `after` persistiert. Begründung:

- Speichersparend
- Klare Nachvollziehbarkeit der einzelnen Änderung („was hat dieser Mitarbeiter konkret geändert")
- Zustand zu einem Zeitpunkt T kann durch Replay aller bis dahin geltenden Audit-Einträge plus Initial-Zustand rekonstruiert werden

### Append-only

Keine `UPDATE`- oder `DELETE`-Operationen auf Audit-Einträge. Der `AuditService` exponiert nur `record*`-Methoden. Auf Schema-Ebene zusätzlich Mongoose-Hook, der Schreib-Operationen außerhalb des Service blockiert (Defense-in-Depth).

### Indizes

- `entityId, timestamp` (für Query „alle Einträge zur Anamnese X, chronologisch")
- `action, timestamp` (für Filterung im Audit-UI)

## Implementierung

### Pattern in der Demo: direkter Service-Aufruf

`AuditService` bietet drei Record-Methoden in der Demo:

```ts
class AuditService {
  recordCreate(anamneseId: string, actor: Actor, ipAddress?: string): Promise<void>
  recordEmailVerified(anamneseId: string, actor: Actor): Promise<void>
  recordStatusTransition(
    anamneseId: string,
    fromStatus: AnamneseStatus,
    toStatus: AnamneseStatus,
    action: AnamneseAction,
    actor: Actor,
  ): Promise<void>

  // Konzept für Produktion, wenn Mitarbeiter-Inhaltsbearbeitung implementiert ist:
  // recordUpdate(anamneseId: string, changes: FieldChange[], actor: Actor): Promise<void>
}
```

Aufrufer: `AnamneseService` (für CREATE), `StatusService` (für STATUS_TRANSITION und EMAIL_VERIFIED).

Audit-Aufruf passiert synchron direkt nach der Hauptoperation in derselben Service-Methode. Beide Operationen sind nicht atomar, weil Standalone-MongoDB ohne Replica-Set keine Multi-Document-Transactions unterstützt. Im Worst Case kann ein Audit-Eintrag fehlen wenn der Service zwischen Hauptoperation und Audit-Aufruf abstürzt. TODO-Kommentar im Code, in Produktion über Replica Set und Transaction lösbar.

### Pattern-Alternativen für Produktion

In Produktion sind zwei Erweiterungen sinnvoll, in der Demo aber nicht umgesetzt:

- **Custom Decorator + NestJS Interceptor:** `@Auditable(action)` Decorator auf Service-Methoden, ein Interceptor erzeugt den Audit-Eintrag automatisch nach erfolgreichem Methoden-Return. Vorteil: cross-cutting, kann nicht vergessen werden. Nachteil: implizit, schwerer im Code zu verfolgen
- **Event-Bus:** Service emittiert Domain-Events (`AnamneseCreated`, `AnamneseStatusChanged`, etc.), Audit-Modul subscribt. Vorteil: saubere Entkopplung, andere Konsumenten möglich (z.B. Reporting). Nachteil: async-Verhalten, Risiko des Audit-Verlusts bei Crash

## Sichtbarkeit im Backoffice

| Aspekt | Demo | Produktion |
|---|---|---|
| UI-Form | kein UI in der Demo. Nur GraphQL-Query erreichbar | Detail-Tab pro Anamnese in der Backoffice-Detail-Ansicht |
| Sichtbarkeit | GraphQL-Query mit ADMIN-Guard | UI-Tab nur für `ADMIN` |
| Inhalt | chronologische Liste der Audit-Einträge zur einzelnen Anamnese | identisch, mit Filter nach Action |
| Bulk-Audit-Dashboard | Out-of-Scope | Konzept-Erweiterung |

GraphQL-Query (ADMIN-guarded, in Demo implementiert):

```graphql
query AuditEntriesForAnamnese($anamneseId: ID!) {
  auditEntriesForAnamnese(anamneseId: $anamneseId) {
    id
    timestamp
    action
    actor { type, userId, role }
    payload
    ipAddress
  }
}
```

Reviewer können im GraphQL-Playground den Audit-Verlauf einer Anamnese abfragen. Ein UI-Tab ist Konzept-Bestandteil und Nice-to-have für die Demo.

## Aufbewahrung

| Kontext | Festlegung |
|---|---|
| Demo | kein Lösch-Mechanismus, Audit-Einträge bleiben unbegrenzt |
| Produktion | mindestens 10 Jahre (ärztliche Aufbewahrungspflicht, MBO-Ä §10) |
| DSGVO Art. 17 (Recht auf Löschung) | wird durch Aufbewahrungspflicht eingeschränkt, dokumentiert in der Datenschutzerklärung der Klinik |
| Cleanup-Strategie in Produktion | Cron-Job, der Audit-Einträge älter als 10 Jahre löscht oder auf Cold Storage verschiebt. In Demo nicht implementiert |

## DSGVO Art. 9 Bezug

Anamnesebogen-Daten sind Gesundheitsdaten und damit besondere Kategorien personenbezogener Daten gemäß Art. 9 Abs. 1 DSGVO. Verarbeitung ist über Art. 9 Abs. 2 lit. h (Heilbehandlung) gerechtfertigt, setzt aber erhöhte technische und organisatorische Maßnahmen voraus.

Das Audit-Log ist eines dieser TOMs:

- Nachvollziehbarkeit jeder schreibenden Operation
- Zugriffsbeschränkung über `ADMIN`-Rolle (Vier-Augen-Prinzip-Vorbereitung)
- Append-only verhindert Manipulation
- Speicherung in eigener Collection erlaubt separates Backup und feinere Zugriffskontrolle

## Was im Repo demonstriert wird

- `AuditService` mit drei `record*`-Methoden (`recordCreate`, `recordEmailVerified`, `recordStatusTransition`)
- Audit-Einträge bei `CREATE`, `EMAIL_VERIFIED`, `STATUS_TRANSITION`
- Append-only durch Service-Design (keine update/delete-Methoden) plus Mongoose-Hook
- GraphQL-Query mit ADMIN-Guard (kein Backoffice-UI-Tab in der Demo)
- Indizes auf `entityId, timestamp` und `action, timestamp`

## Was im Konzept beschrieben aber nicht implementiert ist

- `UPDATE`-Action und Diff-Persistenz für Mitarbeiter-Inhaltsbearbeitung (Bearbeitung selbst ist in Cut-Stufe 2 nicht in Demo)
- Backoffice-UI-Tab pro Anamnese (Demo nur GraphQL-Query)
- READ-Logging für sensitive Felder
- Auth-Event-Logging (Login, Logout, Failed Login)
- Decorator/Interceptor-Pattern für cross-cutting Audit
- Event-Bus-Pattern für entkoppeltes Auditing
- Audit-Export (CSV, JSON)
- Volltext-Suche im Audit-Log
- Bulk-Audit-Dashboard
- 10-Jahre-Aufbewahrungs-Cleanup-Job
- ACID-Transactions zwischen Hauptoperation und Audit-Eintrag (erfordert MongoDB Replica Set)

## Verweise

- Statusmodell: `docs/statusmodell.md` (jede Status-Transition erzeugt einen Audit-Eintrag)
- Public-Auth: `docs/auth-public-bogen.md` (`EMAIL_VERIFIED` erzeugt einen Audit-Eintrag)
- Architektur: `docs/architektur.md` (`AnamneseAuditEntry` als Entität)
