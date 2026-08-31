# Craft—applies to every kit, regardless of design system

Sources (distilled, not copied verbatim; observe the source licenses):

- [frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) (Anthropic, Apache-2.0)
- [impeccable](https://github.com/pbakaus/impeccable) (Apache-2.0)
- [emil-design-eng](https://github.com/emilkowalski/skills) (MIT)
- [userinterface-wiki](https://github.com/raphaelsalaja/userinterface-wiki) (MIT)

The corporate design determines HOW the UI looks; this file defines WHAT good UI craft entails. The
generator copies it without modification.

## States & usability

- Every interactive component has hover, focus, disabled, loading, error, and
  empty states; visible keyboard focus is mandatory.
- Interactive targets must have a hit area of at least 32px; enlarge undersized targets with a pseudo-element.
- A response under 400ms feels “instant.” If it takes longer, show a skeleton or
  optimistic UI instead of nothing.
- A prototype without empty, loading, and error states looks more complete than it is.

## Motion

- Keep UI animations under 300ms. High-frequency actions (typing, keyboard navigation,
  list hovers) receive **no** animation.
- Use `ease-out` for everything that appears; never use `ease-in` for UI because it feels sluggish.
- Animate only `transform` and `opacity`. Never start at `scale(0)`—`scale(0.95)` +
  opacity is enough.
- Use at most **one** deliberately designed motion moment per page; do not scatter the same
  entrance animation everywhere.
- Respect `prefers-reduced-motion`: remove movement while retaining opacity/color transitions.

## Typography mechanics

- Keep body-text lines between 65 and 75 characters.
- For data columns and numerical comparisons, use `font-variant-numeric: tabular-nums`.
- Use `text-wrap: balance` for headings and `text-wrap: pretty` for paragraphs.
- Leave more space **above** a heading than below it—space creates grouping.

## Surface & depth

- Use only the token spacing scale, never arbitrary pixel values.
- Shadows: use offset + blur instead of an even halo; keep one light direction across the page;
  never use pure black.
- Group with whitespace, typography, and dividers, not by putting borders around everything.

## Reject list (anti-slop)

These patterns are tired defaults. Use them only when the corporate design or request explicitly
calls for them:

| Avoid | Use instead |
|---|---|
| Grids of equal-sized icon+title+text cards as the page structure | Derive structure from the content: lists, sections, unequal emphasis |
| Hero metric template (large number + label + accent color) | Show numbers in context where they support a point |
| Kicker/eyebrow line above every heading | A heading that stands on its own |
| 01/02/03 numbering without a real sequence | Number items only when order conveys information |
| Gradient text | Emphasis through weight and size |
| Emoji/Unicode glyphs as icons | The kit's icon source |
| Nested cards | One card level, with surfaces and typography inside |

## UX rules of thumb

- **Hick**: minimize the number of choices per step.
- **Miller**: chunk into groups of 5–9.
- **Jakob**: use familiar patterns—users spend most of their time on other sites.
- **Tesler**: the system, not the user, absorbs unavoidable complexity.
- **Peak-End**: deliberately design completion moments (confirmation, success).

## Browser details

The least expensive signal that a UI was deliberately built rather than assembled: a focus ring in
the corporate-design color, coordinated `::selection`, a set `underline-offset`, a considered scrollbar,
and a matching form caret color.
