# ADR-0007: Public-Auth mit Single-Use Token

- Status: Vorgeschlagen
- Datum: 2026-05-04

> Hinweis: Auth-Konzept für den öffentlichen Anamnesebogen ist noch nicht ausdiskutiert. Optionen und Entscheidung dienen aktuell als Diskussionsgrundlage. Status wird auf Akzeptiert gesetzt, sobald `docs/auth-public-bogen.md` ausgearbeitet ist.

## Kontext

Der öffentliche Anamnesebogen ist ohne Login erreichbar, muss aber an einen konkreten Patienten gebunden sein. Anonymer Zugriff scheidet aufgrund der Sensitivität medizinischer Daten aus.

## Optionen

1. **Single-Use Token im Link** (gewählt): Mitarbeiter generiert im Backoffice einen kryptografisch zufälligen Token. DB-gebunden, mit Expiry, nach Submit invalidiert
2. **Patient-Konto mit Login**: erhöht die Hürde stark, sprengt Demo-Scope
3. **Anonymer öffentlicher Endpoint**: keine Identitätsbindung, ungeeignet für medizinische Daten
4. **Token plus Defense-in-Depth (Geburtsdatum-Verifikation)**: Token plus zusätzliche Verifikation gegen vorbefüllte Stammdaten. Schützt vor Token-Leaks (z.B. weitergeleiteter Mail-Link)

## Entscheidung

_Wird nach Diskussion des Auth-Konzepts in `docs/auth-public-bogen.md` festgelegt._

## Konsequenzen

- Saubere Trennung von Public- und Backoffice-Auth-Strategien
- Token-Lebenszyklus (Generierung, Expiry, Invalidierung) als eigenes Designelement
- GraphQL-Operations für Public und Backoffice mit unterschiedlichen Auth-Strategies abgegrenzt
- Demo zeigt Standard-Pattern für Public-Auth ohne Login
