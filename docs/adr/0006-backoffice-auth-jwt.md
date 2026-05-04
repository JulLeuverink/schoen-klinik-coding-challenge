# ADR-0006: Backoffice-Auth mit JWT

- Status: Akzeptiert
- Datum: 2026-05-04

## Kontext

Das Backoffice braucht klassische Mitarbeiter-Authentifizierung. Für die Demo wird Email/Passwort verwendet, das Produktivkonzept (SSO über Entra ID) ist als eigenes Konzeptpapier (`docs/sso-konzept.md`) abgelegt.

## Optionen

1. **JWT mit längerer Access-Token-Lifetime, kein Refresh-Token** (gewählt für Cut-Stufe 2 der Demo)
2. **JWT mit kurzlebigem Access-Token und httpOnly Refresh-Token-Cookie**: produktivnäher, mehr Implementierungs-Aufwand (Refresh-Endpoint, Token-Rotation, Cookie-Setup)
3. **Server-Sessions** mit Cookie und Session-Store: zustandsbehaftet, weniger gängig im GraphQL-Kontext

## Entscheidung

In der Demo: JWT mit Access-Token und Lifetime von z.B. 8h, kein Refresh-Token. Implementierung über `@nestjs/passport` und `passport-jwt`. Passwords mit Argon2id gehasht. Logout über Client-Verwerfung des Tokens.

Der Refresh-Token-Pfad ist im SSO-Konzeptpapier als Produktiv-Pattern beschrieben und wäre in der Cut-Stufe 1 zusätzlich implementiert worden.

## Konsequenzen

- Zustandsloses Backend
- Geringerer Implementierungs-Aufwand (kein Refresh-Endpoint, kein Cookie-Handling)
- Längere Access-Token-Lifetime erhöht Risiko bei Token-Diebstahl, in einer Demo akzeptabel mit Hinweis im README
- Logout durch reine Client-Verwerfung (Token bleibt bis Expiry technisch gültig, in Produktion wäre Token-Blacklisting oder kürzere Lifetime mit Refresh-Rotation nötig)
- Für Produktion: Übergang zu OAuth 2.0 mit Entra ID, dann ist das Refresh-Token-Thema beim IdP gelöst
