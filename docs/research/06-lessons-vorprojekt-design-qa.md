# Lessons aus Vorprojekt (ein früheres Design-QA-Werkzeug) — destilliert

Befund einer unabhängigen Analyse eines früheren, ähnlich gelagerten Projekts. Relevanz: direkte Korrektur für dieses Konzept.

## Mainstream-Stack 2026 für „LLM setzt Figma/DS treu um"
Kontext + billige Feedback-Schleife, NICHT Verifikations-Infrastruktur:
1. **Figma Dev Mode MCP live im Editor**: `get_design_context` (strukturierte Selektion), `get_variable_defs` (Tokens), `get_screenshot` (Soll-Bild). Kein Export, kein Pinning, keine Artefakte — der Agent fragt live.
2. **Code Connect** (oder simple Mapping-Datei): „dieser Figma-Node ist `<BaseButton>` im Repo" → Agent benutzt existierende Komponenten statt sie nachzubauen.
3. **Rules-/Skill-Datei** mit Projektkonventionen — Figma liefert dafür einen eigenen Prompt (`create_design_system_rules`).
4. **Screenshot-Loop** („Eyes"-Muster): implementieren → rendern → screenshotten → gegen Soll-Bild vergleichen → fixen.

Installationsaufwand: ein MCP-Server + zwei Textdateien. Ergebnis: „sehr nah dran, meistens richtig".

## Die zentrale Falle (dort passiert, hier zu vermeiden)
**Beweisinstrument gebaut statt Outcome-Werkzeug.** Kanon, Pins, Verträge, Gates, Provenienz-Validierung, Antwort-Bürokratie → Maschinerie eines QA-/Audit-Produkts (beantwortet „kann ich der Behauptung trauen?"). Für „der Agent soll es richtig bauen" braucht es nur zwei Dinge: **gute strukturierte Wahrheit als Input + ein präzises Fehlersignal als Feedback.** Das Bauen selbst war nie das Problem (Blindtest: drei Wissensbasen, dreimal fehlerfrei).

## Was vom Vorprojekt trotzdem wertvoll ist
Das **scharfe, deterministische Fehlersignal**: Property-Vergleich („font-size 15 statt 16, Zeile für Zeile") schlägt LLM-Augen und unscharfe Screenshot-Diffs („sieht ungefähr gleich aus"). Genau dieses Stück fehlt dem Mainstream-Stack.

## Ehrlichkeit bei „pixel-perfekt"
Automatisiert garantiert das 2026 niemand: Vision-Modelle übersehen kleine metrische Abweichungen, **Pixel-Diffs gegen Figma scheitern an unterschiedlichen Rastern**. Erreichbar ist „**property-perfekt plus menschliches Auge für den Rest**" — Stand der Technik, auch bei Figma selbst.

## Konsequenzen für dieses Framework
1. Verify-Gate primär als **Property-Diff** (Playwright computed styles vs. Token-/Spec-Tabelle), Screenshot-Loop nur als grobes Zweitsignal.
2. Kein Beweis-/Audit-Apparat: Provenance bleibt ein simples Metadaten-Feld, keine Validierungs-Bürokratie, keine Artefaktketten-Gates.
3. Figma-Input bevorzugt als **Live-Pull via Dev Mode MCP** statt Export-Artefakte; `create_design_system_rules` als Baustein der Kit-Kompilierung prüfen.
4. Leichtgewicht als Designprinzip: Wissensbasis + scharfes Fehlersignal. Jedes Feature muss der Implementier-Schleife dienen, nicht dem Nachweis.
