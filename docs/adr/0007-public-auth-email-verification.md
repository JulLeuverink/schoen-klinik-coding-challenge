# ADR-0007: Public-Auth mit Email-Verifikation

- Status: Akzeptiert
- Datum: 2026-05-04

## Kontext

Der Anamnesebogen ist laut Aufgabenstellung „öffentlich für einen Patienten aufrufbar". Das schließt einen Login aus, ebenso einen vorab vergebenen Token-Link, der erst nach Backoffice-Aktion an einen bekannten Patienten geht. Die Eingabe muss aber an eine identifizierbare Person gebunden werden, sonst sind die erfassten Daten beliebig und Spam-anfällig.

## Optionen

1. **Vorab-Token-Link von der Klinik**: Mitarbeitende erstellen den Bogen im Backoffice und vergeben einen Single-Use-Token an einen bekannten Patienten. Verworfen, weil der Bogen damit nicht „öffentlich aufrufbar" wäre
2. **Email-Verifikation während der Submission** (gewählt): Patient gibt Email an, bekommt Bestätigungslink, erst nach Klick gilt der Bogen als eingereicht (Double-Opt-In)
3. **SMS-OTP während der Submission**: analog zu Email, aber via SMS-Provider. In der Demo nicht umsetzbar (Provider-Setup, Kosten), als Erweiterung im Konzeptpapier diskutiert
4. **Captcha allein, ohne weitere Identitätsverifikation**: niedrigste Hürde, aber keine Bindung der Eingabe an eine erreichbare Identität. Spam-Risiko hoch

## Entscheidung

Email-Verifikation während der Submission über Bestätigungslink mit Token in der URL.

In der Demo wird der Mail-Versand simuliert, indem der Verifikations-Link nach Submit im Frontend (Notification) und im Backoffice (Anamnese-Detail-Ansicht) angezeigt wird. Echter SMTP-Versand und SMS-Variante sind im Konzeptpapier `docs/auth-public-bogen.md` als Produktiv- beziehungsweise Erweiterungs-Pfad beschrieben.

## Konsequenzen

- Der Bogen ist tatsächlich öffentlich aufrufbar, im Wortsinn der Aufgabe
- Verifikations-Token-Lebenszyklus (Generierung, Expiry, Konsum) ist eigenes Designelement, gut für State-Machine-Tests
- Statusmodell beginnt bei `PENDING_VERIFICATION` statt bei `DRAFT/SENT`. Die Status `DRAFT` und `SENT` entfallen
- Stammdaten kommen vom Patienten, nicht vom Backoffice. Keine Vorbefüllung durch Mitarbeitende
- Identitätsbindung bleibt schwach (Email-Inhaberschaft, nicht Patient-Identität). Plausibilitätsprüfung der Stammdaten gegen Patientenkartei findet im Backoffice-Status `IN_REVIEW` statt
- Endpoint-Schutz (Honeypot, Rate Limit, Server-Side Validation) wird Pflicht und ist im Konzeptpapier ausgearbeitet
