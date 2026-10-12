# Speditionsauftrag – Webformular

Ein interaktives Formular für den internen Speditionsauftrag (FO 15-01). Es läuft komplett im Browser: Eingaben werden weder übertragen noch gespeichert.

## Funktionen
- **DE / EN**: Umschalter oben rechts. Beschriftungen, Auswahllisten und Export sind jeweils einsprachig.
- **Refresh**: Leert alle Eingaben. Vorher kommt eine Rückfrage.
- **Export (PDF)**: Erstellt den Speditionsauftrag als PDF (A4 mit Logo und Fußzeile). Dateiname: `Speditionsauftrag_<Referenz>.pdf` bzw. `Transport_Order_<Referenz>.pdf`.
- **Prüfung**: Fehlende oder ungültige Angaben werden rot markiert. Der Export ist erst möglich, wenn alles stimmt.

## Kundenstamm
- Über den Button **Stammdaten** wird eine Excel-Datei (.xlsx) oder CSV geladen, z. B. `Kundennummer | Kundenname | Straße | PLZ | Ort | Länderkennzeichen | Land` (optional `Zusatz`). Die Spalten werden an der Überschrift erkannt, Titelzeilen darüber und mehrere Blätter sind kein Problem. Ohne Überschrift wird genau diese Reihenfolge A–G angenommen. Das alte Format .xls bitte vorher als .xlsx speichern.
- Ausgabe der Adresse: Ist kein Zusatz hinterlegt, steht die Straße direkt unter dem Firmennamen. Länderkennzeichen, PLZ und Ort stehen immer in der festen letzten Zeile.
- Danach reicht im Empfänger-Kasten die Kundennummer (#) + Enter: Die Adresse wird automatisch übernommen. Die Felder bleiben änderbar; Änderungen gelten nur für den aktuellen Auftrag, der Kundenstamm bleibt unverändert.
- Unbekannte Kundennummer: Popup „Soll der Kunde im Kundenstamm hinterlegt werden?“ – bei **Ja** werden die Adressdaten direkt im Popup erfasst.
- **Datenschutz:** Der Kundenstamm wird nur im Browser des jeweiligen PCs gespeichert und nie ins Internet übertragen. Er gehört deshalb **nicht** ins GitHub-Repository. Jede Kollegin / jeder Kollege lädt die Datei einmal selbst hoch.
- Lokal ergänzte Kunden lassen sich über **Kundenstamm herunterladen** als Excel teilen. Wird später ein neuer Kundenstamm hochgeladen, bleiben lokale Ergänzungen erhalten, sofern die Nummer nicht schon im neuen Kundenstamm steht.
- Hinweis: Browser-Daten werden gelöscht, wenn im Browser „Websitedaten löschen“ ausgeführt wird. Dann den Kundenstamm einfach neu hochladen.

## Artikelstamm
- Unter **Stammdaten → Artikelliste hochladen** wird eine Excel-Datei (.xlsx) oder CSV geladen: `A Artikelnummer | B Bezeichnung 1 DE | C Bezeichnung 2 DE | D Bezeichnung 1 EN | E Bezeichnung 2 EN`. Eine Überschriftenzeile ist erlaubt.
- In jeder Position: Artikelnummer (max. 6 Zeichen) eintippen + Enter oder Tab → Artikelbezeichnung 1 und 2 werden in der aktuellen Formularsprache übernommen. Beim Umschalten DE/EN wechseln die Bezeichnungen mit, solange sie nicht von Hand geändert wurden.
- Fehlt die Bezeichnung in einer Sprache, wird die andere Sprache übernommen (mit Hinweis).
- Unbekannte Artikelnummer: Popup „Soll der Artikel im Artikelstamm hinterlegt werden?“ – bei **Ja** werden Bezeichnung 1/2 in DE und EN direkt im Popup erfasst und ab dann automatisch gefunden. Lokal ergänzte Artikel lassen sich über **Artikelstamm herunterladen** als Excel teilen.
- Auch der Artikelstamm bleibt nur lokal im Browser gespeichert.

## Speicherung der Stammdaten
- Kunden- und Artikelstamm werden nach dem Hochladen dauerhaft im Browser gespeichert (IndexedDB) und stehen beim nächsten Öffnen der Seite sofort wieder zur Verfügung – auch nach einem Neustart des PCs.
- Die Speicherung gilt pro Browser und PC: In Chrome und Edge muss die Datei jeweils einmal hochgeladen werden.
- Gelöscht werden die Daten nur über „Stammdaten → … von diesem PC löschen“ oder wenn im Browser „Websitedaten / Cookies löschen“ ausgeführt wird. Im privaten Fenster (Inkognito) wird nichts dauerhaft gespeichert.

## Pflichtangaben
- Abholung durch
- Mindestens 1 Dokument (Lieferschein, Rechnung, ABD oder A.TR.), jeweils mit Menge und Nummer
- Referenz (Auftragsnummer, 6–12 Ziffern – vorbereitet für längere Nummern aus dem neuen ERP)
- Empfänger: Firma, Straße, Land/PLZ/Ort
- Mindestens 1 vollständige Position: Menge, Art, Gewicht sowie L × B × H (bei Kartons sind die Maße optional)

## Veröffentlichen mit GitHub Pages
1. Öffne das Repository auf github.com.
2. Gehe zu **Add file → Upload files** und ziehe den **Inhalt** dieses Ordners hinein: `index.html`, `app.js`, `style.css`, `assets.js`, `favicon.png`, `.nojekyll` sowie die Ordner `lib` und `build`. Bestätige mit **Commit changes**.
   Hinweis: `.nojekyll` ist eine versteckte Datei. Falls sie nicht sichtbar ist, kannst Du sie über **Add file → Create new file** mit genau diesem Namen und leerem Inhalt anlegen.
3. Gehe zu **Settings → Pages**.
4. Wähle unter *Build and deployment* bei **Source** die Option „Deploy from a branch“, dann den Branch **main** und den Ordner **/ (root)**. Klicke auf **Save**.
5. Nach 1–2 Minuten erscheint oben die Adresse, z. B. `https://<konto>.github.io/<repo>/`. Diesen Link kannst Du an Deine Kollegen weitergeben.

Bei späteren Änderungen lädst Du die geänderten Dateien einfach erneut hoch. Die Seite aktualisiert sich dann automatisch.

## Ordner `build` (nur für Änderungen an Beschriftungen, Logo oder Fußzeile)
`build/build_assets.py` erzeugt aus `labels.json`, `logo.png` und `footer.png` die Datei `assets.js`. Für die normale Nutzung ist dieser Ordner nicht nötig.
