# Auth-Konzept öffentlicher Anamnesebogen

> Status: Entwurf

## Inhalt

Wird in der Konzept-Phase befüllt. Geplante Sektionen:

- Identifikation des Patienten ohne Login
- Single-Use-Token-Pattern (Generierung, Eigenschaften, Lebenszyklus, Expiry)
- Defense-in-Depth (z.B. Geburtsdatum-Verifikation gegen Stammdaten)
- Token-Invalidierung nach Submit
- Schutz vor Brute-Force und Token-Leaks
- GraphQL-Operationen: Trennung Public vs. Backoffice
- Was wird im Repo demonstriert, was nur konzeptuell beschrieben

## Verweis

ADR-0007: Public-Auth mit Single-Use Token
