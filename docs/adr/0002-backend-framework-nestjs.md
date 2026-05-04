# ADR-0002: Backend-Framework NestJS

- Status: Akzeptiert
- Datum: 2026-05-04

## Kontext

Das Backend wird in Node.js mit TypeScript und GraphQL umgesetzt. Es braucht klare Modulstruktur, saubere Dependency Injection, und Auth-Integration für zwei sehr unterschiedliche Strategien (Backoffice-JWT und Public-Single-Use-Token).

## Optionen

1. **NestJS** (gewählt): modulares Framework mit DI, Guards, Pipes, Decoratoren. Eigene GraphQL-Integration über `@nestjs/graphql`
2. **Express + Apollo Server + TypeGraphQL**: leichtgewichtiger, mehr Eigenbau-Code, mehr Setup-Aufwand

## Entscheidung

NestJS.

## Konsequenzen

- Stärkere Konventionen reduzieren Boilerplate-Risiko und Eigenfehler
- Auth via `@nestjs/passport` und Custom Guards erlaubt saubere Trennung der zwei Auth-Strategien
- Initiale Lernkurve für `@nestjs/graphql` Code-First-Modul
