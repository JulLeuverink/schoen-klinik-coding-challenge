# ADR-0004: GraphQL Code-First mit @nestjs/graphql

- Status: Akzeptiert
- Datum: 2026-05-04

## Kontext

Das GraphQL-Schema kann in TypeScript-Code (Code-First) oder in einer SDL-Datei (Schema-First) definiert werden. Beide Ansätze bringen unterschiedliche Vor- und Nachteile bezüglich Single Source of Truth, Drift-Risiko und Werkzeug-Unterstützung.

## Optionen

1. **Code-First** (gewählt) mit `@nestjs/graphql`: TypeScript-Klassen mit `@ObjectType`, `@Field`, `@Resolver`. SDL wird zur Build-Zeit generiert
2. **Schema-First**: SDL-Datei als Quelle, Codegen erzeugt Resolver-Typen
3. **Hybrid**: Schema in SDL, Resolver in Code-First

## Entscheidung

Code-First mit `@nestjs/graphql`.

## Konsequenzen

- Single Source of Truth in TypeScript, kein Drift zwischen Schema und Resolvern
- Volle TypeScript-Stärke (Generics, Utility Types) auch im Schema
- Auto-generiertes SDL als Artefakt für Frontend-Codegen
- Kein dediziertes Schema-Review möglich (SDL nicht handgepflegt)
