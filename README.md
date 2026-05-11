# Anamnesebogen

Coding Challenge für Schön Klinik. Zweiteilige Applikation: öffentlich aufrufbarer Anamnesebogen für Patienten und Backoffice für Mitarbeitende.

## Stack

- Backend: NestJS, TypeScript, MongoDB (Mongoose), GraphQL Code-First (`@nestjs/graphql`)
- Frontend: Angular (Standalone Components, Signals), Apollo Angular, Bootstrap 5
- Auth: Email-Verifikation für Patienten (Token-Link), SessionStorage-Stub für die Backoffice-Demo
- Repository: Einzelrepository, Backend und Frontend als eigenständige npm-Projekte
- Container: Docker Compose, VS Code Devcontainer

Tech-Entscheidungen sind als ADRs unter `docs/adr/` dokumentiert.

## Getting Started

### Anwendung local bauen und starten

Voraussetzung: Docker Desktop (oder Docker nativ).

```bash
docker compose up --build
```

- App: [http://localhost:8080](http://localhost:8080)
- GraphQL Playground: [http://localhost:8080/graphql](http://localhost:8080/graphql)

Der Frontend-Port kann über die Umgebungsvariable `FRONTEND_PORT` konfiguriert werden (Standard: `8080`).

### Mit Devcontainer (empfohlen)

Voraussetzung: Docker Desktop (oder docker nativ z.B. Linux) + VS Code mit dem Remote Development Expansionpack

1. Repository klonen
2. In VS Code öffnen -> "Reopen in Container"
3. Das erstellen des Dev Containers kann beim ersten mal etwas dauern.
4. Backend starten: `npm run start:backend`
5. Frontend starten: `npm run start:frontend:devcontainer`
6. App öffnen: [http://localhost:4200](http://localhost:4200)
7. GraphQL Playground: [http://localhost:3000/graphql](http://localhost:3000/graphql)

### Nativ

Voraussetzung: Node.js 22, lokale MongoDB-Instanz auf Port 27017

1. Repository klonen
2. `npm run install:all`
3. Backend starten: `npm run start:backend`
4. Frontend starten: `npm run start:frontend`
5. App öffnen: [http://localhost:4200](http://localhost:4200)
6. GraphQL Playground: [http://localhost:3000](http://localhost:3000)

## Demo-Flow

**Patient:**

1. Anamnesebogen unter `/anamnese` ausfüllen und abschicken
2. Demo-Notification zeigt den Verifikationslink (in Produktion per E-Mail)
3. Link klicken → E-Mail verifiziert, Status wechselt zu `SUBMITTED`

**Backoffice:**

1. Login unter `/backoffice`
2. Anamneseliste mit Status-Filter
3. Detail-Ansicht: Felder einsehen, Status-Übergänge ausführen, Audit-Log einsehen

## Architektur und Konzeptpapiere

| Dokument                    | Inhalt                                                 |
| --------------------------- | ------------------------------------------------------ |
| `docs/architektur.md`       | Domänenmodell, Komponenten, Aggregat-Grenzen           |
| `docs/statusmodell.md`      | Statusmodell mit State Machine, Übergangstabelle       |
| `docs/auth-public-bogen.md` | Auth-Konzept öffentlicher Anamnesebogen                |
| `docs/audit-log-konzept.md` | Audit-Log-Konzept inkl. DSGVO Art. 9                   |
| `docs/sso-konzept.md`       | Backoffice-Auth Produktivkonzept (Entra ID, OAuth 2.0) |
| `docs/adr/`                 | Architecture Decision Records                          |

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
└── apps/
    ├── backend/
    └── frontend/
```

## Einsatz von KI-Werkzeugen

KI wurde während der bearbeitung der gesamten Challenge eingesetzt. Im speziellen wurde Claude Code mit Claude 4.6 Sonnet verwendet.

### Architektur und Konzeption:

- Technologie-Auswahl, Statusmodell-Design und Auth-Konzept wurden von mir in Sparring-Sessions mit hilfe von Claude erarbeitet.
- Insbesondere das erstellen von Konzeptdokumenten wurde größtenteils von Claude übernommen. (Das LLM schreibt einfach schneller als ich)
- Alle Dokumente wurden von mir gesichtet und bei Bedarf angepasst.
- Alle Entscheidungen wie z.B. Transitions-Tabelle statt State Pattern, Mail-Verifikation statt Token-Link wurden von mir getroffen.
- Die Idee der Audit-Logs stammt von Claude. Daran habe ich während der Konzeption nicht gedacht. In einem realen Szenario wäre das wahrscheinlich erst in einem späteren Sprintreview aufgefallen.

### Code:

- Es wurde kein Vibecoding betrieben. Der Code wurde hauptsächlich von mir geschrieben, oder von CLI erzeugt:
  - Claude hat teils Boilerplate generiert.
  - Insbesondere das Styling der Komponenten wurde von Claude übernommen. Mein Fokus lag eher auf der Funktionalität der Anwendung.
- Im Backend habe ich zum Einstieg in die Entwicklung viel Unterstützung von Claude gebraucht. Das ist der fehlenden Erfahrung in NestJS, MongoDB/mongoose und GraphQL geschuldet.
- Claude hat bei der Fehlerdiagnose wie z.B. wiederkehrende TypeScript/GraphQL-Typfehler und der Mongoose-Schema-Konfiguration geholfen.
- Architektonische Entscheidungen, wie z.B. `availableActions` einer Anamnese vom Backend mitgeben zu lassen, statt das Mapping der State-Machine im Frontend nachzubauen, habe ich getroffen.

### Arbeitsweise:

- Claude hat mich beim tracking der zu implementierenden Features unterstützt. Implementierungsplan.
- Die Struktur und der Aufbau des Projekts, vor allem die Aufteilung der Componenten im Frontend, stammt vollständig von mir.
- Auch die Aufteilung der Aufgaben in Arbeitspakete stammt vollständig von mir. (Claude hätte KI-typisch zuerst das gesamte Backend gebaut. Ich habe mich für Arbeitspakete auf Basis der Features entschieden.)

### Verhältnis und Einschätzung:

Ich schätze den KI-Anteil am finalen Code auf 20-30%, vor allem in Templates und Konfigurationsdateien. Buisiness-Logik, Architektur-Entscheidungen, Struktureller Aufbau von Modulen/Componenten/Services und Debugging-Diagnosen kamen überwiegend von mir.

Komplett auf KI in dieser Challenge zu verzichten hätte wahrscheinlich folgende Auswirkungen gehabt:

- **Technisch:** Ich hätte das meiste auch alleine geschaft, aber **deutlich** langsamer. NestJS + GraphQL + Mongoose + Apollo Angular in einer Woche zu lernen und zu implementieren, wäre sehr sportlich gewesen.
- **Debugging:** Die wiederkehrenden TypeScript/GraphQL-Typfehler hätten mich wahrscheinlich mehrere Stunden gekostet.
- **Konzeption:** Die Konzeptpapiere wären in dem Umfang und Detailgrad nicht entstanden.
