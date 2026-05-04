# ADR-0006: Backoffice-Auth mit JWT und Refresh

- Status: Akzeptiert
- Datum: 2026-05-04

## Kontext

Das Backoffice braucht klassische Mitarbeiter-Authentifizierung. Für die Demo wird Username/Passwort verwendet, das Produktivkonzept (SSO über Entra ID) ist als eigenes Konzeptpapier (`docs/sso-konzept.md`) abgelegt.

## Optionen

1. **JWT mit kurzlebigem Access-Token und httpOnly Refresh-Token-Cookie** (gewählt)
2. **Server-Sessions** mit Cookie und Session-Store (Redis): zustandsbehaftet, weniger gängig im GraphQL-Kontext
3. **OAuth 2.0 mit Entra ID direkt**: produktiv passend, im Demo-Scope Overkill

## Entscheidung

JWT mit Access- und Refresh-Token. Implementierung über `@nestjs/passport` und `passport-jwt`. Passwords mit Argon2id gehasht.

## Konsequenzen

- Zustandsloses Backend
- Refresh-Endpoint und Token-Rotation müssen umgesetzt werden
- httpOnly-Cookie für Refresh-Token reduziert XSS-Risiko
- Logout erfordert Token-Blacklisting oder reine Client-Verwerfung (für Demo: Client-Verwerfung dokumentieren)
