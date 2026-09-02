# Changelog

All notable changes to brand-playground. Kits record the template commit they were generated from in `design/kit.json`; `/playground --refresh` reads it.

## Unreleased

## 0.1.0 — 2026-09-01

First public release.

- `/playground` generator skill: compiles a live website, code library, Figma file, spec, screenshots, or a mix into a standalone prototyping kit
- Resumable runs: every phase is committed with a fixed message and checkpointed in `design/ingest/PROGRESS.md`; a rerun on an existing directory derives the phase from the filesystem
- `/playground --refresh <kit>`: re-copies generator-owned scaffold files from a newer template, never touches tokens, components, skill, or prototypes
- Code-first path: pins the design system package, extracts metadata mechanically, verifies import paths against type definitions
- Stack derived from the input (React default, Vue template for Vue libraries); asks only on genuine ambiguity
- Kit templates `kit-react` (Vite + React + TypeScript + Tailwind v4) and `kit-vue` (direct port), plus `kit-common` (agent instructions, skill, pitfalls, craft, README templates)
- Kit contract: frozen `tokens.css`, DTCG `tokens.json` with provenance (source, confidence, usage, stable id), `components-meta.json` with `extends` and `status` per entry, `design/kit.json` provenance stamp
- One distilled design-system skill per kit (under 500 lines) with `craft.md` and a growing `pitfalls.md`
- `AGENTS.md` as the single instruction source for any agent, `CLAUDE.md` importing it, `llms.txt` entry-point index, human-facing kit `README.md` with the "What now" card
- Auto-routing prototype loop: a directory is a route; overview with titles, Ideas group, reference marker, and an Auto/Desktop/Mobile viewport toggle with a 375 px device frame
- `pnpm preflight` (Node ≥ 22.22, pnpm, dependencies, free port), run automatically by `pnpm dev`
- Offline single-file export: `pnpm export` for all prototypes, `pnpm export --only <slug>` for one
- Reference screen and human sign-off as the closing phase; blind-test prototype recommended before sign-off
- Documentation: concept, research notes, contributing guide, issue templates for bugs and kit reports
- Validated against live-site (dm.de), code-first React (Primer) and Vue, Figma (Material 3, plus sparse and rich internal files) and spec inputs
