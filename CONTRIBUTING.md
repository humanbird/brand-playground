# Contributing

The scope of this repository covers the generator skill in `.claude/skills/playground/` (with its `reference/` files) and the templates in `templates/`.
Changes should remain within this scope and preserve the existing kit conventions.

## Testing template changes

1. Create a clean-room copy of the affected template (`rsync -a --exclude node_modules --exclude export --exclude .git`).
2. Ensure that the copy does not contain `node_modules`.
3. Run `pnpm install --frozen-lockfile` in the copy.
4. Then run `pnpm typecheck`.
5. Test the single-file export with `pnpm export`.
6. Open the exported result in a browser and test the relevant flows.
7. Check the export for external references and potential data leaks.

## Testing a skill change

A skill is only as good as its first blind use. Prose review does not count as verification; run the change:

1. **Generate a kit** with the changed skill against a small, public source (a live site with a versioned CSS bundle or a pinned npm design-system package keeps the run short). Use a fresh session with no other context.
2. **Interrupt and resume once.** Stop the run after the tokens phase, start a new session, and invoke `/playground` on the same target. The resumed session must derive the phase from the filesystem (`reference/checkpoints.md` table) and must not redo completed phases.
3. **Blind-test the kit.** Spawn a fresh agent that sees only the kit (`AGENTS.md`, the skill, `components-meta.json`, source code—no ingest context, no questions) and ask it to build a multi-step prototype. It records every point of friction: anything it had to guess is a gap in the kit or in the skill that generated it.
4. **Close the loop.** Feed each friction point back as a skill change (or a template change), then repeat step 3 once. A change that does not reduce friction on the second blind test should not land.
5. Report what was generated, what the blind agent had to guess, and what changed as a result in the pull request description.

## Generator-owned files

Each template's `TEMPLATE.md` ends with a list of generator-owned files. Those files are copied into every kit verbatim and re-copied by `/playground --refresh`, so they must stay identical across kits:

- They use only `kit-*` classes from `@layer kit` (`src/kit.css`) and the generic `--ds-*` aliases from `design/tokens.css`—never DS-specific token names, Tailwind scale utilities, or kit-specific values.
- A change to one of them is a change for every existing kit. Test it with `/playground --refresh` against a generated kit, not only with a fresh run.
- Adding a scaffold file means adding it to the list in both `TEMPLATE.md` files; adding a placeholder means adding it to both placeholder tables. `grep -rn '{{'` on a generated kit must return nothing.
- The two templates are ports of each other: whenever one changes, check the other.

Please keep pull requests small and focused on one clearly scoped change.

Skills in this repository follow the Anthropic Agent Skills guidelines (checked as of 2026-08-31). These guidelines evolve — re-check them at platform.claude.com before larger skill changes. The generator skill body stays under 200 lines with one level of `reference/` files; generated DS skills stay under 500 lines.
