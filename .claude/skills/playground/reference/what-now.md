# The "What now" card

Print this card verbatim (placeholders filled) as the last thing a `/playground` run says.
The kit's `README.md` (from `templates/kit-common/README.md.template`) carries the same card
for humans who open the repository later — keep the two identical.

```
Your <DS_NAME> playground is ready: <kit path>

Start it
  cd <kit path> && pnpm dev            → http://localhost:<PORT>

Then say what you want to see, for example
  "A checkout with address, payment and confirmation — three screens, linked."
  "Give me four directions for a settings page for power users." (ideate)
  "A data table of open orders with filters and an empty state."

Look first
  The reference screen is at /#/p/reference-<name> — it is what the design system
  looks like in this kit. Compare it with the original before building on it.

Share
  pnpm export → export/index.html is one file that runs offline; send it as is.
  pnpm export --only <slug> → just one prototype, same single file.

Kit facts
  Components: <count> · Tokens: <count> (<n> estimated, see design/tokens.json)
  Instructions for any agent: AGENTS.md · Skill: .claude/skills/<ds>/SKILL.md
  Refresh the scaffold later with: /playground --refresh <kit path>
```

Two numbers in the card are honesty markers: the estimated-token count tells the user where
follow-up questions are normal, and the component count tells them what the kit can and cannot
build without inventing.
