# SSO-Konzept Backoffice

> Status: Akzeptiert
> Letztes Update: 2026-05-11

## Motivation

Die Demo-Implementierung nutzt einen SessionStorage-Stub im Frontend ohne Backend-Auth (siehe [ADR-0006](adr/0006-backoffice-auth-stub.md)). In Produktion würde das durch eine Anbindung an den Identity-Provider der Klinik ersetzt. Dieses Papier beschreibt den Produktiv-Pfad.

Treiber für SSO in Produktion:

- Single Sign-On für Mitarbeitende, die bereits in einem zentralen IdP geführt sind
- Zentrale Account-Lifecycle-Verwaltung (On-/Offboarding über IdP)
- MFA und Conditional Access werden vom IdP gestellt, nicht in der Anwendung dupliziert
- Audit-Log auf IdP-Seite für Login-Events, kein lokales Password-Storage in der Anwendung

## Demo vs. Produktion

| Aspekt | Demo | Produktion |
|---|---|---|
| Auth-Mechanismus | SessionStorage-Stub im Frontend, kein Backend-Auth | OAuth 2.0 Authorization Code Flow mit PKCE über IdP |
| User-Verwaltung | keine (beliebige Rolle wählbar im Login-Formular) | User aus IdP, kein lokales Password-Storage |
| Access-Token | keiner | JWT vom IdP, lokal validiert über JWKS |
| Rollen | nicht durchgesetzt | aus IdP-Claims (App-Roles oder Groups) |
| Logout | SessionStorage-Eintrag löschen | Front-Channel-Logout-Redirect zum IdP |
| MFA | nicht in Demo | im IdP konfiguriert |

Die Konzept-Implementierung würde technisch über `@nestjs/passport` mit OIDC-Strategy (z.B. `passport-azure-ad`) und auf Frontend-Seite über `oidc-client-ts` oder `angular-auth-oidc-client` laufen.

## OAuth 2.0 Authorization Code Flow mit PKCE

```mermaid
sequenceDiagram
    participant U as User
    participant SPA as Frontend (Backoffice)
    participant IdP as Entra ID
    participant API as Backend (NestJS)

    U->>SPA: Klick „Login"
    SPA->>SPA: code_verifier und code_challenge erzeugen
    SPA->>IdP: Redirect /authorize mit code_challenge, state, nonce
    IdP->>U: Login-Maske, ggf. MFA, ggf. Consent
    U->>IdP: Credentials
    IdP->>SPA: Redirect mit authorization_code, state
    SPA->>SPA: state validieren
    SPA->>IdP: POST /token { code, code_verifier }
    IdP-->>SPA: { id_token, access_token, refresh_token }
    SPA->>SPA: Tokens speichern (Access in Memory, Refresh als httpOnly Cookie)
    SPA->>API: Request mit Authorization: Bearer access_token
    API->>API: Token-Signatur via JWKS validieren, Claims prüfen
    API-->>SPA: Response
```

### Schlüsseleigenschaften

- **PKCE**: Pflicht für SPAs. Schützt gegen Authorization-Code-Interception, weil der Code ohne `code_verifier` nicht einlösbar ist
- **State-Parameter**: schützt gegen CSRF beim Redirect zurück
- **Nonce im ID Token**: schützt gegen Token-Replay
- **Public Client**: SPAs haben kein Client-Secret, daher PKCE statt Secret

## IdP-Wahl

Primär als Beispiel verwendet: **Entra ID** (vormals Azure AD). Begründung: Schön Klinik vermutlich Microsoft-lastig (Office 365, Azure).

Das Konzept ist nicht IdP-spezifisch, sondern lehnt sich an OIDC. Mit identischen Pattern umsetzbar:

- Keycloak (Self-hosted Open Source)
- Auth0 oder Okta (SaaS)

Patient-Login (z.B. via Azure AD B2C) ist explizit nicht Teil dieses Konzepts. Patient-Auth ist im `docs/auth-public-bogen.md` als Email-Verifikation gelöst.

## Implementierungsschritte für Produktion

Um vom SessionStorage-Stub auf echtes SSO umzustellen:

**Backend:**
- NestJS `@nestjs/passport` mit OIDC-Strategy (z.B. `passport-azure-ad`) einrichten
- `JwtAuthGuard` auf alle Backoffice-GraphQL-Resolver anwenden
- Access-Token-Validierung gegen IdP-JWKS implementieren (`iss`, `aud`, `exp` prüfen)
- Rollen aus `roles`-Claim extrahieren und auf interne Rollen (`STAFF`, `ADMIN`) mappen
- ADMIN-Guard auf Audit-Queries einrichten

**Frontend:**
- `oidc-client-ts` oder `angular-auth-oidc-client` integrieren
- Authorization Code Flow mit PKCE implementieren
- Token-Storage: Access Token in Memory, Refresh Token als httpOnly Cookie
- SessionStorage-Stub durch echten Auth-Service ersetzen
- Front-Channel Logout zum IdP implementieren

**Infrastruktur:**
- App-Registration in Entra ID anlegen mit App-Roles `Anamnese.Staff` und `Anamnese.Admin`
- Redirect-URIs und CORS konfigurieren
- HTTPS erzwingen

## Rollen-Mapping

Primär empfohlen: **App-Roles** in Entra ID.

- Anwendung wird im Entra ID als App-Registration angelegt mit definierten App-Roles, z.B. `Anamnese.Staff`, `Anamnese.Admin`
- Mitarbeitende werden den App-Roles zugewiesen (manuell oder via Gruppen-Zuordnung)
- Access Token enthält `roles`-Claim als Array
- Backend extrahiert `roles` und mappt auf interne Rollen `STAFF`, `ADMIN`

Alternative: **Group-Claims**. Access Token enthält `groups`-Claim mit Group-Object-IDs. Backend hält ein Mapping Group-ID-zu-Rolle. Weniger sauber als App-Roles, aber pragmatisch wenn Klinik bereits Group-Strukturen pflegt.

## Logout

**Front-Channel Logout** als Standard für SPAs:

- Frontend leitet Browser zu IdP-`/logout`-Endpoint mit `post_logout_redirect_uri`
- IdP invalidiert seine Session und leitet zurück
- Frontend löscht lokale Tokens (Memory plus Refresh-Cookie)

**Back-Channel Logout** (Server-zu-Server-Notification) ist hauptsächlich für Multi-Tenant- oder Multi-App-SSO-Szenarien sinnvoll und in der Klinik-Demo nicht relevant.

## Sicherheits-Aspekte

- PKCE Pflicht für SPA
- State und Nonce immer prüfen
- HTTPS in Produktion Pflicht
- Token-Storage: Access in Memory (nicht localStorage wegen XSS-Risiko), Refresh als httpOnly Cookie mit Secure und SameSite=Lax
- JWKS-Caching mit periodischer Revalidierung (Microsoft empfiehlt z.B. 24h Cache)
- Logout muss alle drei Token invalidieren (lokal löschen plus Refresh widerrufen)
- MFA und Conditional Access werden auf IdP-Seite konfiguriert, nicht in der Anwendung

## Multi-Tenancy

Schön Klinik betreibt mehrere Häuser. Falls jedes Haus ein eigenes Entra-ID-Tenant hat: Multi-Tenant-App-Registration in Entra ID. Tenant-ID wird im `/authorize`-URL mitgegeben. Backend muss `iss` gegen erlaubte Tenant-Issuers prüfen.

In Demo Out-of-Scope.

## Was im Demo implementiert wird (Verweis auf ADR-0006)

- Login-Formular mit Rollenauswahl (kein echtes Passwort)
- SessionStorage-Eintrag als Login-State
- `canActivate`/`canActivateChild`-Guard schützt Backoffice-Routen im Frontend
- Kein Backend-Auth, alle GraphQL-Endpunkte technisch öffentlich erreichbar

## Was im Konzept beschrieben aber nicht implementiert ist

- OAuth 2.0 Authorization Code Flow mit PKCE
- Entra-ID-Integration via `@nestjs/passport` mit OIDC-Strategy
- JWKS-Validierung im Backend
- Rollen-Mapping aus Token-Claims
- Front-Channel Logout
- MFA und Conditional Access (auf IdP-Seite)
- Multi-Tenant-Support
- Refresh-Token-Rotation gegen IdP

## Verweise

- [ADR-0006: Backoffice-Auth als SessionStorage-Stub](adr/0006-backoffice-auth-stub.md)
- Architektur: [docs/architektur.md](architektur.md) (Komponenten und Schnittstellen)
