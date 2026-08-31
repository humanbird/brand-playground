# brand-playground

**Turn any design system into your brand's playground.**

The design system compiler: feed it design system input in any form (Figma library, code library, live website, specifications, screenshots—or any combination), and it produces an AI-ready foundation for rapidly building prototypes that faithfully follow the corporate identity.

Status: **M1–M3 are complete** and have been tested across four real-world scenarios: a public corporate website, a code-first Vue component library, and both sparse and comprehensive Figma inputs—including blind tests and E2E runs. The concept is documented in `docs/concept.md`, with research in `docs/research/`.

## Setup

There is nothing to install beyond the repository itself—the generator is a project-local Claude Code skill (`.claude/skills/basis/`), with the templates stored alongside it.

**Prerequisites** (once per machine):
- [Claude Code](https://claude.com/claude-code) installed and signed in
- Node.js >= 22.22 (current LTS recommended) and pnpm (`corepack enable`)
- For Figma input only: the official Figma MCP server, connected to an account that can read the target file—the primary setup is `claude mcp add --transport http figma-remote-mcp https://mcp.figma.com/mcp`

**Setup:**

```bash
git clone https://github.com/humanbird/brand-playground.git
cd brand-playground
claude
```

That is all. `/basis` is available in this session because the skill lives in the repository.

## Usage

**1. Generate the foundation**—in the framework session, name the input in whatever form you have:

```
/basis Our design system: https://www.example.com — build the foundation for me. Target ~/dev/example-rapidprototype.
```

Input means anything you mention in the request or provide in the session—including combinations. Claude asks for anything that is missing:

| Format | How to provide it |
|---|---|
| Live website | Include the URL in the request: `/basis https://www.example.com …` |
| Figma | Paste the file link (Figma MCP must be connected and authorized to read the file) |
| Code library | Provide the repository path or npm package name |
| Specs/MD | Provide the file path or drag the file into the terminal |
| Screenshots | Put images in a directory and provide its path, or drag/paste them directly into the terminal |

The result is a standalone kit repository (frozen tokens, components, a DS skill, and a reference screen). The final step is your visual sign-off: compare the reference screen with the original, feed corrections back into the kit, and then freeze the foundation.

**2. Build prototypes**—from this point on, work only in the kit. You need the framework repository again only when you have new DS input:

```bash
cd ~/dev/example-rapidprototype
claude
```

One sentence is enough—“Build me a prototype for …” (proto) or “I want to explore ideas for …” (ideate). `pnpm dev` serves everything on a single port, and `pnpm export` creates a shareable single file.

The kit is self-contained (its own CLAUDE.md, its own skill, and pinned dependencies). It also works on another machine with only Claude Code and Node/pnpm installed; the framework repository does not need to be present.

## Structure

```
.claude/skills/basis/   the generator (/basis)
templates/kit-react/    kit template (default)
templates/kit-vue/      kit template for Vue design systems
templates/kit-common/   CLAUDE.md/SKILL.md templates + craft.md (DS-independent craft)
docs/                   concept + research
```

[MIT License](LICENSE)
