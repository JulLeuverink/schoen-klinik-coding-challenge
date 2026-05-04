# Statusmodell des Anamnesebogens

> Status: Entwurf

## Inhalt

Wird in der Konzept-Phase befüllt. Geplante Sektionen:

- Status-Liste (DRAFT, SENT, SUBMITTED, IN_REVIEW, COMPLETED, REJECTED, EXPIRED, ARCHIVED)
- State-Chart-Diagramm (Mermaid `stateDiagram-v2`)
- Erlaubte Übergänge (Tabelle)
- Berechtigungs-Mapping: welche Rolle darf welchen Übergang auslösen
- Automatische Übergänge (z.B. SUBMITTED bei Patient-Submit)
- Validierung (zentraler `StatusService` statt freier `setStatus`)

## Diagramm

`diagramme/statusmodell.mmd`
