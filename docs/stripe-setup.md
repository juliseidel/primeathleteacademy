# Stripe-Setup für Prime Athlete Academy

Anleitung für Jonas + Patrick, um den Stripe-Account für den Verkauf des
Off-Season-Plans (99 €) anzulegen.

**Geschätzter Zeitaufwand:** 30–45 Minuten initiale Einrichtung + 1–2 Tage
Verifizierung durch Stripe.

---

## 1. Account erstellen

1. [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register) öffnen
2. E-Mail-Adresse wählen, die langfristig bleibt (am besten eine offizielle
   PAA-Adresse — z. B. `payments@primeathleteacademy.com`, nicht eine
   private Adresse)
3. Land: **Deutschland**
4. Bei "Was möchtest du tun?" → "Online-Zahlungen akzeptieren"

## 2. Geschäftsdaten eintragen

Im Dashboard → **Einstellungen → Geschäftsdetails**:

- **Rechtsform:**
  - Falls schon eine PAA UG/GmbH existiert → diese eintragen (Handelsregister-Nr., Anschrift)
  - Falls noch keine Firma → "Einzelunternehmer" mit Gewerbeschein
    (entweder Jonas oder Patrick als Kontoinhaber)
- **Steuerliche Informationen:**
  - **USt-IdNr.** (DE…) — wenn vorhanden eintragen
  - **Steuernummer** vom Finanzamt
- **Geschäftsadresse:** offizielle Anschrift
- **Telefonnummer:** Geschäftsnummer (kann Mobil sein)
- **Website:** `https://primeathleteacademy.com`
- **Branche:** "Bildung & Lernen" oder "Sport & Fitness"
- **Produktbeschreibung:** "Digitale Trainings- und Ernährungspläne für
  Fußballer (PDF-Download)"

## 3. Bankverbindung verknüpfen

Im Dashboard → **Einstellungen → Auszahlungen**:

- IBAN + BIC der **PAA-Geschäftskonto** eintragen (NICHT privates Konto,
  sonst gibt es später steuerliche Probleme)
- Auszahlungsrhythmus: "Automatisch täglich" (Standard) oder wöchentlich

## 4. Stripe Tax aktivieren ⚠️ WICHTIG

Im Dashboard → **Mehr → Tax → "Stripe Tax aktivieren"**:

- Stripe berechnet dann automatisch die deutsche Mehrwertsteuer (19 %)
- USt wird auf Rechnungen ausgewiesen
- Stripe übernimmt die korrekte Steuerberechnung — ohne das wird es
  später ein Steuer-Albtraum

**Sehr wichtig:** Ohne Stripe Tax muss man USt manuell handhaben.
Mit Stripe Tax = automatisch konform.

## 5. Identität verifizieren

Stripe fordert während des Onboardings:

- Ausweis-Upload (Personalausweis oder Reisepass)
- Selfie-Verifizierung (Browser-Cam oder Smartphone)
- Eventuell: Bestätigung der Bankverbindung (Mini-Überweisung zur
  Verifizierung)

**Dauer:** Verifizierung läuft 1–2 Werktage. Während der Wartezeit kann
man im **Testmodus** trotzdem schon alles bauen und testen.

## 6. Webhook konfigurieren

Wenn ich (Claude) die Integration gebaut habe und der Endpoint live ist
auf `primeathleteacademy.com/api/webhooks/stripe`:

1. Dashboard → **Entwickler → Webhooks → "Endpoint hinzufügen"**
2. URL: `https://primeathleteacademy.com/api/webhooks/stripe`
3. Events auswählen (mindestens):
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `checkout.session.async_payment_failed`
4. **Signing Secret** kopieren (beginnt mit `whsec_…`) — das ist der
   wichtigste Wert für die sichere Verifikation

## 7. API-Keys an mich übergeben

Im Dashboard → **Entwickler → API-Schlüssel**:

Es gibt zwei Modi (siehe Schalter oben rechts: "Testmodus"):

### Testmodus (für die Entwicklung)
- **Publishable key:** `pk_test_…`
- **Secret key:** `sk_test_…`

→ Diese sind sofort verfügbar, auch ohne Verifizierung. **Bitte zuerst die
Testmodus-Keys schicken**, damit ich entwickeln kann.

### Live-Modus (für die echte Bezahlung)
- **Publishable key:** `pk_live_…`
- **Secret key:** `sk_live_…`
- **Webhook Signing Secret:** `whsec_…`

→ Sobald die Verifizierung durch ist, diese Keys nachreichen.

## 8. Übergabe an Julian

Bitte **NICHT** per WhatsApp oder ungesicherter E-Mail schicken. Stattdessen:

- **1Password / Bitwarden Shared Vault** (am sichersten)
- Oder: Signal-Chat
- Oder: Verschlüsseltes PDF mit Passwort, das separat geteilt wird

**Format:**
```
STRIPE TEST (Entwicklung)
- Publishable: pk_test_...
- Secret:      sk_test_...

STRIPE LIVE (Produktion — nach Verifizierung)
- Publishable: pk_live_...
- Secret:      sk_live_...
- Webhook:     whsec_...
```

## 9. Produkte und Preise

Diese lege ich automatisch via API an — ihr müsst im Dashboard nichts
manuell konfigurieren. Aber zur Info: Es wird ein Produkt geben:

- **Name:** Prime Athlete Academy — Off-Season Plan 2026 (Elite)
- **Preis:** 99 € (einmalig, inkl. USt)
- **Typ:** Digitales Produkt / Service

## 10. Refund-Policy (rechtlich wichtig)

Bei digitalen Produkten in der EU greift das **Widerrufsrecht** —
außer der Käufer hat **vor Vertragsschluss ausdrücklich auf das
Widerrufsrecht verzichtet** und das wurde bestätigt.

Praktisch: Im Checkout muss eine Checkbox sein:
> "Ich stimme zu, dass die Lieferung vor Ablauf der Widerrufsfrist
> beginnt und mein Widerrufsrecht mit Beginn des Downloads erlischt."

→ Das baue ich in den Stripe-Checkout-Flow ein. Ihr braucht das nur in
**AGB + Datenschutz** auf der Webseite, was wir noch ergänzen.

## 11. Was kostet Stripe?

- **Pro Verkauf:** 1,5 % + 0,25 € (für Karten aus EU)
- **Klarna / Sofort:** 1,4 % + 0,25 €
- **Apple Pay / Google Pay:** wie Karte
- **Auszahlung aufs Bankkonto:** kostenlos
- **Refund:** Stripe behält die ursprüngliche Transaktionsgebühr (nicht zurück)

Bei 99 € Verkaufspreis → ~1,73 € Gebühr → ihr bekommt ~97,27 € auf
das Konto (vor Steuern).

---

## TL;DR — was ich von euch brauche

1. **Stripe-Account anlegen** (10 Min)
2. **Test-Keys schicken** (`pk_test_…`, `sk_test_…`) → SOFORT
3. **Verifizierung abschließen** (1–2 Tage warten)
4. **Live-Keys + Webhook-Secret schicken** → wenn fertig

Sobald 2. passiert ist, baue ich den kompletten Flow fertig. Sobald 4.
da ist, schalten wir den Live-Verkauf in ~10 Minuten frei.
