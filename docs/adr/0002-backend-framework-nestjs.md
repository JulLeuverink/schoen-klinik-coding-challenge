# ADR-0002: Backend-Framework NestJS

- Status: Akzeptiert
- Datum: 2026-05-04

## Kontext

Das Backend wird in Node.js mit TypeScript und GraphQL umgesetzt. Es braucht klare Modulstruktur und saubere Dependency Injection. Da NestJS-Erfahrung kaum vorhanden ist, steht zur Wahl: ein opinionated Framework mit fertigen Abstraktionsschichten nutzen oder die nötigen Konzepte (DI, Guards, Pipes, Decoratoren) in Express selbst zusammenstellen.

## Optionen

1. **NestJS** (gewählt): modulares Framework mit DI, Guards, Pipes, Decoratoren. Eigene GraphQL-Integration über `@nestjs/graphql`
2. **Express + Apollo Server + TypeGraphQL**: leichtgewichtiger, mehr Eigenbau-Code, mehr Setup-Aufwand

## Entscheidung

NestJS. Die fertigen Abstraktionen (DI, Guards, Pipes) sind aus Angular bekannt und ersparen den manuellen Aufbau dieser Strukturen in Express.

## Konsequenzen

- Stärkere Konventionen reduzieren Boilerplate-Risiko und Eigenfehler
- Initiale Lernkurve für `@nestjs/graphql` Code-First-Modul
