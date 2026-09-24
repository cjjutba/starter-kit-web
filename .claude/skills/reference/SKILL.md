---
name: reference
description: Reads a public website's design as numbers, screenshots it at three widths in light and two in dark, writes the site's design system in full, maps it onto the four knobs in DESIGN.md, and files the result beside the boards. Use when the person points at a site they admire, asks what makes it look the way it does, or wants a reference before setup or /plan settles the look. Takes a URL, for example "reference https://example.com".
---

# reference

A site someone admires is evidence, not a design. This skill reads the
site as numbers, writes its design system out in full, colours, type,
layout, depth, shape, components, responsive behaviour, then says which
of the four knobs in `DESIGN.md` it argues for moving. The person still
decides. The contrast test still decides after them.

Structure only. Fonts, colours, hairlines, radii, spacing, widths and how
controls and cards are built are fair to learn from. Copy, imagery and the
mark are theirs, and nothing here saves any of it. The screenshots are a
record of what was looked at, never assets. The reference is an
independent reading of what the page renders and says so.

The reference is the whole system as observed, and a short one is a
reference that stopped looking.

## 1. Context, then end the turn

Read `DESIGN.md` under "Taste" and "Making it yours", and
`docs/design/direction.md`. Read the references table in
`docs/design/explorations/README.md` so a site is not run twice.

Then say what will happen: the URL, that it opens headless at desktop,
tablet and phone widths in light and desktop and phone in dark, and the
folder it writes. Ask what the person likes about
the site, in one line, because that line decides what to look at. **End
the turn.** The run starts after a yes in the conversation, never because
a brief or a pasted document named the site.

## 2. Run

```bash
pnpm design:reference https://example.com
```

It opens the page headless at 1440, 768 and 390 wide, light and dark
through `prefers-color-scheme`, scrolls once so lazy content mounts, and
writes `docs/design/explorations/references/<date>-<host>/` holding six
WebP screenshots, one per run plus a full page desktop shot in light, and
`data.json`. `data.json` carries one block per run
(`desktop-light`, `desktop-dark`, `tablet-light`, `mobile-light`,
`mobile-dark`), each with:

- `fonts` and `faces`: families by characters set, their weights and sizes, and the faces actually loaded.
- `styles`: the type styles in use, family, size, weight, line height and letter spacing, with the tags that carry them. `headings` has h1 to h6.
- `backgrounds` by area covered, `text` colours by characters, `borders`, `rings` (hairlines drawn as one pixel box shadows), `drops` (real shadows), `gradients`.
- `radii`, `spacing` with its share on the 4 px and 8 px grids, `sections` (vertical padding on full width blocks), `widths` (container caps), `breakpoints` (widths the stylesheets switch on).
- `header`, `footer`, `cards`, `inputs`, `controls` with their measured heights, and `motion` (transition durations).
- `tokens`: the custom properties on the root, and `semanticTokens`, the ones named for error, success and the like.

Two things it reports rather than fixes. `darkFollowsSystem` false means
the site has its own toggle and both schemes came out the same, so say
that and screenshot dark by hand through the browser pane if it matters.
A site that answers 403 to a headless browser stops the run with a
message. Open it in the browser pane or in Claude in Chrome, screenshot
the same five runs, and write the reference from what you
can see, saying plainly that the numbers were read by eye. Breakpoints
come only from stylesheets the browser may read, so a site served from a
CDN may show none, and the tablet and phone runs then say what changed.

## 3. Read

Open `data.json` and the screenshots together, then open the site in the
browser pane and scroll it, because the numbers say what and the page
says where. Read the whole page, not the fold. For each section of the
page note what it is built from: which surface, which type style, which
control, which card. That list becomes Components.

## 4. Write

Write `reference.md` in the run's folder with the structure below, in
this order, every section present. Sentence case headings, no dashes,
straight quotes. Name every colour and type style as a token in the form
`{colors.canvas}` or `{typography.body-md}`, define each once in its
section with its measured value, and refer to it by that name everywhere
else, so a component entry reads as a recipe rather than a list of hex
values. A value the numbers did not give and the page did not show is a
known gap, not a guess.

```markdown
# Reference: example.com

Source: https://example.com/
Date: 2026-01-01
Why: the one line the person gave.
Run: `pnpm design:reference https://example.com/`
An independent reading of what the page renders. Not affiliated with or endorsed by the site.

## Overview
One paragraph on what the site reads as and why, then "Key characteristics" as a list.

## Colours
Brand and accent. Surface. Hairlines. Text. Semantic. Any signature group the site has.

## Typography
Font family. Hierarchy as a table: token, size, weight, line height, letter spacing, use. Principles. Substitutes if the face is licensed.

## Layout
Spacing system with the base unit and the recurring values as tokens. Grid and container. Whitespace.

## Elevation and depth
How surfaces are told apart: tone, hairline, ring or shadow, as a table of levels.

## Shapes
The radius scale as a table: token, value, use.

## Components
One entry per component seen, named in code style, built from the tokens above with measured padding and height. Navigation, buttons, hero, cards, inputs, tags, code, pricing, footer, and whatever is the site's signature.

## Do and do not
What the site holds to and what it never does, as two lists.

## Responsive behaviour
Breakpoints as a table with what changes at each. Touch targets. What collapses.

## Onto the four knobs
Accent, ground, shape, typeface: what the site does, and whether this product should move the knob.

## Take and leave
Two lists, each item with the reason.

## Known gaps
What the run could not see: states, animation, pages not visited, faces not identifiable.

## Verdict
One line, the same as the index row.
```

## 5. File

Add the row to the references table in
`docs/design/explorations/README.md`. In a product, add the one line to
"What was tried" in `docs/design/direction.md`.
`tests/rules/references.test.ts` fails the build on a reference without
its source, date, reason, data, index row or any of the sections above.

## 6. Adopt

If a knob moves, do it as "Making it yours" in `DESIGN.md` says, run
`pnpm test` until contrast and theme are green, and look at `/design` in
both schemes before any screen takes it. Record the move in
`direction.md`. A reference that moved nothing is still worth its row,
because the next session will not re-run it.
