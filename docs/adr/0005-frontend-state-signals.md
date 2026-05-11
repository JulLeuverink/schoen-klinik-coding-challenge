# ADR-0005: Frontend State Management mit Signals und Services

- Status: Akzeptiert
- Datum: 2026-05-04

## Kontext

Die Frontend-Apps (öffentlicher Bogen und Backoffice) brauchen lokales State Management. Komplexität: Listen, Filter, Edit-Forms, Auth-State, GraphQL-Cache.

## Optionen

1. **Signals in Services** (gewählt): moderner Angular-Standard ab v16, geringe Boilerplate
2. **NgRx**: voll-funktionales Redux-Pattern mit Store, Effects, Selectors. Hohe Boilerplate, etabliert für komplexe Anwendungen

## Entscheidung

Signals in Services.

## Konsequenzen

- Geringer Boilerplate, schnelle Implementierung
- Reaktivität direkt in Templates ohne `async`-Pipe
- Kein Time-Travel-Debugging wie bei NgRx
- Bei stark wachsender App müsste später ggf. zu NgRx migriert werden, was im Demo-Scope nicht kritisch ist
