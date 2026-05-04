# Auth-Konzept öffentlicher Anamnesebogen

> Status: Akzeptiert
> Letztes Update: 2026-05-04

## Problem und Anforderungen

Aus der Aufgabenstellung:

> Anamnesebogen, der öffentlich für einen Patienten aufrufbar ist und Daten erfasst.
>
> Konzepte für Authentifizierung/Autorisierung und Security für Backoffice Applikation und öffentlichem Anamnesebogen.

Daraus folgt:

- Bogen wird ohne Login aufgerufen
- Eingabe muss trotzdem an eine identifizierbare Person gebunden sein
- Spam und Bot-Submits müssen verhindert werden
- Sensible Daten (DSGVO Art. 9) erfordern Sorgfalt bei Speicherung und Sichtbarkeit

## Designentscheidung

Identitätsbindung erfolgt über **Email-Verifikation während der Submission** (Double-Opt-In). Der Patient gibt seine Email an, das System sendet einen Bestätigungslink, erst nach Klick gilt der Bogen als eingereicht.

Kein vorab-vergebener Token-Link von der Klinik. Kein Patient-Login. Siehe ADR-0007 für die Optionen-Abwägung.

## Patient-Flow

```mermaid
sequenceDiagram
    participant P as Patient
    participant FE as Frontend (Public)
    participant BE as Backend (NestJS)
    participant DB as MongoDB

    P->>FE: öffnet /anamnese
    FE->>P: zeigt Formular
    P->>FE: füllt Stammdaten + medizinische Felder + Email aus, submit
    FE->>BE: createAnamneseSubmission(data)
    BE->>BE: Captcha und Rate-Limit prüfen
    BE->>BE: Server-Side Validation
    BE->>BE: Verifikations-Token generieren (32 Byte)
    BE->>DB: Anamnese persistieren mit Status PENDING_VERIFICATION
    BE-->>FE: success
    FE->>P: Notification mit Demo-Link (Produktion: nichts anzeigen)
    P->>FE: Klick auf Verifikations-Link /anamnese/bestaetigung/:token
    FE->>BE: verifyAnamneseEmail(token)
    BE->>DB: Token suchen, Expiry prüfen
    BE->>DB: Status auf SUBMITTED, Token invalidieren, emailVerifiedAt setzen
    BE-->>FE: success
    FE->>P: Bestätigungsseite
```

## Verifikations-Token

Eigenschaften:

| Eigenschaft | Wert |
|---|---|
| Erzeugung | kryptografisch zufällig, 32 Byte hex (`crypto.randomBytes(32).toString('hex')`) |
| Speicherung | DB-gebunden auf der Anamnese-Entität, nicht als JWT |
| Expiry | 48 Stunden |
| Konsumierbarkeit | einmalig, beim Klick invalidiert |
| Datenmodell | Felder `emailVerificationToken`, `emailVerificationTokenExpiresAt`, `emailVerifiedAt` auf `Anamnese` |

## Defense-in-Depth: Geburtsdatum-Bestätigung

Beim Klick auf den Bestätigungslink kann zusätzlich das Geburtsdatum abgefragt werden, das beim Submit eingegeben wurde. Erst bei Übereinstimmung wird der Status auf `SUBMITTED` gesetzt.

Vorteile:

- Schützt vor Token-Leaks (z.B. weitergeleitete Mail, kompromittiertes Postfach)
- Niedrige Hürde für den legitimen Patienten (Geburtsdatum ist ihm bekannt)
- Patient bestätigt zugleich implizit, dass er Inhaber der eingegebenen Stammdaten ist

In der Demo: Nice-to-have. Wird umgesetzt, falls die Zeit es zulässt. Andernfalls nur konzeptuell beschrieben.

## Mail-Versand: Demo vs. Produktion

### Demo-Pfad

In der Demo wird kein Mail-Versand implementiert. SMTP-Provider, Mail-Catcher (MailHog/Mailpit) und ähnliche Infrastruktur sind out of scope.

Stattdessen wird der Verifikations-Link an zwei Stellen sichtbar gemacht:

1. **Frontend nach Submit:** Erfolgsseite zeigt eine Notification mit Hinweis „In Produktion erhalten Sie eine Email mit Bestätigungslink. In dieser Demo-Umgebung wird der Link direkt angezeigt:" plus klickbarer Link und „Link kopieren"-Button
2. **Backoffice in der Anamnese-Detail-Ansicht:** solange der Bogen im Status `PENDING_VERIFICATION` ist, wird der Verifikations-Link auch im Backoffice angezeigt. Mitarbeitende können den Link bei Bedarf telefonisch oder per Chat an den Patienten weitergeben

In der Demo gibt es keine Resend-Funktion auf Patienten-Seite. Falls der Patient seinen Verifikations-Link verlegt, kontaktiert er die Klinik. Der Workaround läuft über das Backoffice (siehe Punkt 2).

Der Code markiert die betreffenden Stellen mit `// TODO: replace with email send in production` und das README weist auf die bewusste Vereinfachung hin.

### Produktions-Pfad

In Produktion würde der Link ausschließlich per Email an die angegebene Adresse versendet. Anzeige im Frontend oder Backoffice darf nicht erfolgen, weil das die Email-Verifikation aushebeln würde: jemand mit fremder Email als Eingabe könnte sich sonst selbst den Link verschaffen.

Implementierungs-Skizze für Produktion:

- Transactional Mail-Service (z.B. SMTP über `nodemailer`)
- Mail-Template mit Klinik-Branding, Verifikations-Link, Hinweis zur Expiry
- Bounce-Handling und Versand-Audit
- Out of scope für die Demo

## Endpoint-Schutz

Unabhängig von der Identitäts-Bindung gilt für den Public-Submit-Endpoint:

| Schutz | Demo | Produktion |
|---|---|---|
| Captcha | nicht implementiert (Demo-Vereinfachung) | hCaptcha oder vergleichbar, in Produktion Pflicht |
| Rate Limiting | NestJS Throttler, z.B. 5 Submits / 10 Min pro IP | identisch, ggf. niedrigere Limits |
| Server-Side Validation | `class-validator` auf Input-DTO | identisch |
| Input-Sanitisierung | Standard NestJS Pipes plus eigene Sanitizer für Freitext-Felder | identisch |
| HTTPS | n/a für lokales Setup | Pflicht |

## GraphQL-Operations-Trennung

Public und Backoffice nutzen klar getrennte GraphQL-Operationen mit unterschiedlichen Auth-Strategies:

| Operation | Auth-Strategy | Sichtbar für |
|---|---|---|
| `createAnamneseSubmission` | keine User-Auth, Captcha + Rate Limit als Schutz | Public |
| `verifyAnamneseEmail(token)` | Token-Validierung gegen DB | Public |
| `listAnamnesen`, `getAnamnese`, `transitionAnamneseStatus` | JWT (Backoffice) | Mitarbeitende |

Vorteil der Trennung: keine versehentliche Kreuz-Auth, klares Mental-Model für Reviewer und spätere Pflege.

## Was Email-Verifikation leistet, was nicht

Was sie leistet:

- Bestätigt, dass die angegebene Email-Adresse erreichbar ist und vom Submitter kontrolliert wird
- Verhindert Spam mit gefälschten oder zufälligen Adressen
- Bindet den Bogen an eine Email-Identität

Was sie **nicht** leistet:

- Bestätigt nicht, dass die angegebenen Stammdaten (Name, Geburtsdatum) zur realen Person der Email gehören
- Bietet keinen Schutz vor Identitätsmissbrauch (jemand füllt mit fremden Stammdaten aus, aber eigener Email)

Konsequenz: Plausibilitätsprüfung im Backoffice bleibt nötig. Im Status `IN_REVIEW` matcht die Mitarbeiterin die Stammdaten gegen die Patientenkartei. Bei Unklarheiten Rückruf des Patienten unter der angegebenen Telefonnummer.

## Bezug zum Statusmodell

Public-Auth-bezogene Status:

- `PENDING_VERIFICATION`: Bogen wurde abgesendet, Email-Klick steht aus
- `SUBMITTED`: Email-Klick erfolgt, Bogen liegt zur Sichtung im Backoffice
- `EXPIRED`: 48h ohne Klick, automatischer Übergang

Vollständiges Statusmodell siehe `docs/statusmodell.md`.

## Was im Repo demonstriert wird

- Rate Limit über NestJS Throttler auf den Submit-Endpoint
- Server-Side Validation und Input-Sanitisierung
- Verifikations-Token-Generierung mit `crypto.randomBytes`
- Token-Expiry-Validierung
- Status-Übergang `PENDING_VERIFICATION → SUBMITTED` durch Token-Konsum
- Anzeige des Verifikations-Links in Frontend-Notification (mit „Link kopieren"-Button) und Backoffice
- Klare Trennung Public- vs Backoffice-GraphQL-Operationen mit unterschiedlichen Guards
- Defense-in-Depth Geburtsdatum-Bestätigung beim Klick (Nice-to-have, falls Zeit ausreicht)

## Was im Konzept beschrieben aber nicht implementiert ist

- Echter SMTP-Mail-Versand
- Mail-Template und Bounce-Handling
- Captcha (in Produktion Pflicht, in der Demo bewusst weggelassen)
- SMS-Verifikation als Alternative oder Ergänzung
- Resend-Funktion auf Patienten-Seite (Workaround in der Demo: Mitarbeiter gibt den Link aus dem Backoffice weiter)

## Verweis

ADR-0007: Public-Auth mit Email-Verifikation
