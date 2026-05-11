# ADR-0003: MongoDB-Library Mongoose

- Status: Akzeptiert
- Datum: 2026-05-04

## Kontext

MongoDB ist als Datenbank vorgegeben. Es braucht eine Schicht für Schema-Definition, Validierung, Indizes und TypeScript-Type-Safety.

## Optionen

1. **Mongoose** (gewählt): de-facto-Standard für MongoDB in Node.js, mit `@nestjs/mongoose` gute NestJS-Integration
2. **Prisma**: modernerer ORM mit starker Typisierung, MongoDB-Support seit 2022. Höhere Lernkurve, weniger MongoDB-spezifische Features

## Entscheidung

Mongoose. Prisma wäre für den Umfang der Anwendung (wenige Collections, keine Migrationen) überdimensioniert. Mongoose mit `@nestjs/mongoose` ist ausreichend und gut in NestJS integriert.

## Konsequenzen

- Schemas, Validatoren, Hooks und Indizes über NestJS-Decoratoren
- Geringer Lernpfad da Standard
- Manuelle Sorgfalt bei Indizes nötig (kein Prisma-Migration-Tooling)
