# ADR-0006: Backoffice-Auth als SessionStorage-Stub

- Status: Akzeptiert
- Datum: 2026-05-04

## Kontext

Das Backoffice ist nur für Mitarbeitende bestimmt. Für eine produktive Lösung wäre SSO über Entra ID vorgesehen (siehe `docs/sso-konzept.md`). Im Rahmen der Challenge wird kein vollständiger Auth-Stack implementiert, da der Fokus auf dem fachlichen Kern liegt.

## Entscheidung

Im Frontend schützt ein `canActivate`/`canActivateChild`-Guard die Backoffice-Routen. Der Login-Status wird über einen SessionStorage-Eintrag simuliert. Das Backend hat keinen Auth-Guard — alle GraphQL-Endpunkte sind technisch öffentlich erreichbar.

Die Backoffice-Demo zeigt damit den vollständigen fachlichen Flow (Statusübergänge, Audit-Log), ohne den Implementierungsaufwand einer echten Authentifizierung.

## Konsequenzen

- Kein produktiver Einsatz ohne echte Backoffice-Authentifizierung (Entra ID / OAuth 2.0)
- Das Produktivkonzept ist in `docs/sso-konzept.md` beschrieben
