# Contributing

The scope of this repository covers the generator skill in `.claude/skills/basis/` and the templates in `templates/`.
Changes should remain within this scope and preserve the existing kit conventions.

## Testing template changes

1. Create a clean-room copy of the affected template.
2. Ensure that the copy does not contain `node_modules`.
3. Run `pnpm install --frozen-lockfile` in the copy.
4. Then run `pnpm typecheck`.
5. Test the single-file export with `pnpm export`.
6. Open the exported result in a browser and test the relevant flows.
7. Check the export for external references and potential data leaks.

Please keep pull requests small and focused on one clearly scoped change.

Skills in this repository follow the Anthropic Agent Skills guidelines (checked as of 2026-08-31). These guidelines evolve — re-check them at platform.claude.com before larger skill changes.
