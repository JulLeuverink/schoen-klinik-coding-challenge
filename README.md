# Anamnesebogen

Coding Challenge für Schön Klinik. Zweiteilige Applikation: öffentlich aufrufbarer Anamnesebogen für Patienten und Backoffice für Mitarbeitende.

> Status: in Konzeption (Stand 2026-05-04). Implementierung folgt.

## Stack

- Backend: NestJS, TypeScript, MongoDB (Mongoose), GraphQL Code-First (`@nestjs/graphql`)
- Frontend: Angular (Standalone Components, Signals), Apollo Angular
- Auth: JWT mit Refresh (Backoffice), Single-Use Token (öffentlicher Bogen)
- Monorepo: pnpm workspaces
- Container: Docker Compose, VS Code Devcontainer
- Diagramme: Mermaid (direkt in den Markdown-Dateien)

Tech-Entscheidungen sind als ADRs unter `docs/adr/` dokumentiert.

## Verzeichnisstruktur

```
.
├── docs/
│   ├── architektur.md            Domänenmodell, Komponenten, Aggregat-Grenzen
│   ├── auth-public-bogen.md      Auth-Konzept öffentlicher Anamnesebogen
│   ├── audit-log-konzept.md      Audit-Log Konzept inkl. DSGVO Art. 9
│   ├── sso-konzept.md            Backoffice-Auth Produktivkonzept (Entra ID, OAuth 2.0)
│   ├── statusmodell.md           Statusmodell des Anamnesebogens
│   ├── adr/                      Architecture Decision Records
│   └── diagramme/                Mermaid-Diagramme
└── apps/                         (folgt mit Implementierungsstart)
    ├── backend/
    └── frontend/
```

## Getting Started

_Folgt mit Implementierungsstart._

## Verwendung von KI-Werkzeugen

_Wird vor Abgabe aus dem internen Working-Log destilliert._

## Lieferung

- Abgabe: 11.05.2026 bis 17:00 (GitHub-Link)
- Code-Review: 13.05.2026
