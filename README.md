# Diridari Spins — diridarispins.com

Ein mobile-first Affiliate-Website-Template für den österreichischen iGaming-Markt.
Statisches HTML/CSS/JS, ohne Build-Schritt, fertig für GitHub Pages.

## Inhalt

```
diridari-spins/
├── index.html                → Startseite (Hero, Top-Casinos-Tabelle, "Warum mia")
├── top-casinos.html          → Voller Vergleich mit Suche + Sortierung
├── bonus-guide.html          → Bonus-Erklärungen
├── games.html                → Spiel-Kategorien
├── about.html                → Über uns (Platzhalter)
├── responsible-gambling.html → Verantwortungsvoll spielen (Platzhalter + Hilfe-Bereiche)
├── privacy-policy.html       → Datenschutz (Platzhalter)
├── cookie-policy.html        → Cookie-Richtlinie (Platzhalter)
├── css/style.css             → Design-System + alle Styles
├── js/main.js                → Menü, Suche/Filter, Sortierung, Cookie-Banner
└── .nojekyll                 → sauberes Ausliefern über GitHub Pages
```

## Auf GitHub Pages veröffentlichen

1. Neues Repository anlegen und alle Dateien in den Root pushen (nicht in einen Unterordner).
2. **Settings → Pages → Build and deployment → Source: „Deploy from a branch"**, Branch `main`, Ordner `/ (root)`.
3. Nach ein paar Minuten ist die Seite unter `https://<user>.github.io/<repo>/` erreichbar.
4. Für die eigene Domain `diridarispins.com`: eine Datei namens `CNAME` mit dem Inhalt `diridarispins.com` in den Root legen und beim Domain-Anbieter die DNS-Records auf GitHub Pages zeigen lassen.

## Vor dem Live-Gang unbedingt ersetzen

- **Casino-Daten:** Alle Einträge in den Tabellen sind Beispiel-Platzhalter. Durch echte,
  lizenzierte Anbieter und geprüfte Affiliate-Links ersetzen (`href="#"` → echter Tracking-Link).
- **Rechtstexte:** Datenschutz-, Cookie- und Impressumsinhalte durch juristisch geprüfte Fassungen ersetzen.
- **Hilfe-Kontakte:** Auf der Seite „Verantwortungsvoll spielen" die geprüften, aktuellen
  Kontaktdaten der Spielsuchthilfe/Beratungsstellen einfügen.
- **Design-Tokens:** Farben und Schriften liegen als CSS-Variablen ganz oben in `css/style.css`.

## Rechtlicher Hinweis

Glücksspiel kann süchtig machen. Nur 18+. Prüfe die in deinem Bundesland geltende Rechtslage
für Online-Glücksspiel und Affiliate-Werbung, bevor die Seite live geht.
