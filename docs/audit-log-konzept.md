# Audit-Log Konzept

> Status: Entwurf

## Inhalt

Wird in der Konzept-Phase befüllt. Geplante Sektionen:

- Motivation (DSGVO Art. 9, klinikinterne Compliance)
- Was wird geloggt (alle schreibenden Operationen, optional lesende Zugriffe auf sensitive Felder)
- Granularität (User, Aktion, Zeitstempel, Diff vs. Snapshot)
- Datenmodell (eigene Collection `AnamneseAuditEntry`)
- Sichtbarkeit im Backoffice (UI ja/nein, welche Rolle)
- Aufbewahrungsdauer und Löschstrategie
- Was im Repo implementiert, was nur konzeptuell beschrieben
