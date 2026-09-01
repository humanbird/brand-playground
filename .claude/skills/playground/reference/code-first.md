# Special case: code-first (the DS is maintained as a package)

Validated in field tests against two mature component libraries (one Vue, one React). The
workflow becomes shorter and several contract points change roles.

- **Ingest** = pin the package exactly + mechanically extract metadata (component-meta,
  docgen, `.d.ts` + alias resolution for exports). If the package ships its own machine-readable
  metadata (props plus story code), that is the best ingest source there is — story code replaces
  guessing at compositions. There is a single high-confidence source, so no provenance
  reconciliation is needed.
- **Components/icons are omitted**: import directly from the package — `src/components/` and
  `src/icons/` do not exist. Rewrite the AGENTS.md and SKILL wording ("Import through
  src/components/") for the package path.
- **Verify export resolution against the type definitions, not against the package's metadata
  file.** A DS may claim an incorrect import path for a component, and a subpath says nothing
  about freshness (an *outdated* variant may sit under `/experimental` while the current one is
  on the main path). `components-meta.json` therefore records two fields: the verified `import`
  and the source's claim. Distinguish same-named components on multiple paths by `id` + `status`.
- **Keep Tailwind or remove it?** Base this on what the DS provides for layout. A DS with its own
  grid and utilities makes Tailwind a competing second system — remove it (see the kit-vue
  `TEMPLATE.md` for the exact steps). A DS that ships only components keeps Tailwind, but
  explicitly as a *layout* tool: breakpoints aligned to the DS tiers, and a rule that colors and
  typography never come from Tailwind. Explain the decision in AGENTS.md and the skill.
- **`tokens.css` becomes a map rather than the source of truth**: naming patterns, roles, and
  fixed mappings — NO copied values (theme-dependent values such as `light-dark()` would be wrong
  in one mode). "Never regenerate" no longer applies; the package versions the source of truth.
  If the package supplies its tokens as CSS, add the `@import` here. Always keep the **alias
  bridge** to the generic names the scaffold relies on: `--ds-color-ink: var(--fgColor-default)`
  and so on. This keeps the generator-owned scaffold files working without copying a single value,
  and they follow theme changes automatically.
- **Theme switching is part of the setup contract.** If color variables depend on attribute
  selectors (`[data-color-mode]`, `.dark`, `:root[data-theme]`), add those attributes to `<html>`
  in `index.html`, not only to a provider wrapper; otherwise `<body>` remains unthemed. Many DS
  set fallback values in their component CSS (`var(--bgColor-default,#fff)`): if the theme import
  is missing, the prototype looks *almost* correct and only custom `var()` rules fail — the error
  does not appear where it originates. The kit must include the validation command for this
  (`getComputedStyle(document.documentElement).getPropertyValue('--<a-theme-token>')`) in
  `pitfalls.md`.
- **`components-meta.json`** may change shape: a `$` header (source, regeneration instructions,
  missing/alias notes) + `components[]`; it is regenerable (keep the script under `scripts/`),
  grep-friendly, and never loaded in full. `status` is still mandatory per entry.
- **Sign-off**: there is no external original — the reference screen demonstrates anatomy and
  composition from the package's official examples.
- **Ask about the layout model, not breakpoints**: some DS are container-based rather than
  viewport-based — the skill describes the DS model, not the template model.
