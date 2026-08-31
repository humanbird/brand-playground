# Beitragen

Der Scope dieses Repos umfasst die Generator-Skill unter `.claude/skills/basis/` und die Templates unter `templates/`.
Änderungen sollten innerhalb dieses Scopes bleiben und bestehende Kit-Konventionen bewahren.

## Template-Änderungen testen

1. Eine Clean-Room-Kopie des betroffenen Templates anlegen.
2. Sicherstellen, dass die Kopie kein `node_modules` enthält.
3. In der Kopie `pnpm install --frozen-lockfile` ausführen.
4. Danach `pnpm typecheck` ausführen.
5. Mit `pnpm export` den Einzeldatei-Export testen.
6. Das Export-Ergebnis im Browser öffnen und die relevanten Abläufe prüfen.
7. Den Export auf externe Referenzen und mögliche Datenlecks kontrollieren.

Bitte Pull Requests klein und auf eine klar abgegrenzte Änderung fokussiert halten.
