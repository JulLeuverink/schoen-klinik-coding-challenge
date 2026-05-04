# ADR-0001: Monorepo mit pnpm workspaces

- Status: Akzeptiert
- Datum: 2026-05-04

## Kontext

Die Anwendung besteht aus zwei Frontend-Bereichen (öffentlicher Anamnesebogen und Backoffice) und einem gemeinsamen Backend mit GraphQL-Schnittstelle. Geteilte TypeScript-Typen (z.B. GraphQL-Codegen-Output) sollen zwischen Apps konsistent verwendet werden. Eine Lieferung in einem einzigen Repository ist eine Festlegung der Coding Challenge.

## Optionen

1. **pnpm workspaces** (gewählt): leichtgewichtige Workspace-Verwaltung, schnelles Setup, Standard-Scripts pro Paket
2. **Zwei separate Repositories**: kein Type-Sharing über Workspace-Pakete, mehr Synchronisationsaufwand

## Entscheidung

pnpm workspaces.

## Konsequenzen

- Geteilte Typen liegen in `packages/shared` und werden per Workspace-Referenz importiert
- Ein einzelnes `pnpm install` an der Root installiert alle Pakete
- Build- und Test-Scripts in den jeweiligen Paket-`package.json`, an der Root nur Convenience-Scripts
