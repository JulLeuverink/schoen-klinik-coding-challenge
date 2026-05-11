# ADR-0001: Einzelrepository mit zwei eigenständigen Apps

- Status: Akzeptiert
- Datum: 2026-05-05

## Kontext

Die Coding Challenge erfordert eine Lieferung in einem einzigen Repository. Die Anwendung besteht aus einem NestJS-Backend und einem Angular-Frontend. Type-Sharing zwischen beiden erfolgt über GraphQL Codegen (Frontend generiert Typen aus dem GraphQL-Schema), nicht über gemeinsame Pakete.

## Optionen

1. **Einzelrepository ohne Workspace-Linking** (gewählt): Backend und Frontend sind eigenständige npm-Projekte unter `apps/backend/` und `apps/frontend/`. Root-`package.json` enthält nur Convenience-Scripts. Kein Workspace-Tooling nötig.
2. **npm workspaces**: sinnvoll bei einem gemeinsamen `packages/shared`-Paket. Entfällt, weil GraphQL Codegen das Type-Sharing übernimmt und kein geteilter Code zwischen Backend und Frontend anfällt.
3. **Zwei separate Repositories**: widerspricht der Anforderung aus der Coding Challenge.

## Entscheidung

Einzelrepository ohne Workspace-Linking.

## Konsequenzen

- `npm install` wird separat in `apps/backend/` und `apps/frontend/` ausgeführt (oder über Root-Scripts delegiert)
- Root-`package.json` enthält Convenience-Scripts wie `install:all`, `start:backend`, `start:frontend`
- Kein Workspace-Tooling zu konfigurieren
