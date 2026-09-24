# Design system

Three parts, kept apart on purpose. **Method** holds for any product and
does not change. **Taste** is this template's point of view, and a product
with a different one changes it in one place. **Values** are the numbers.
Mixing them is how design systems rot: a taste rule gets enforced like a
method rule, and the first branded project has to fight it.

The sheet at `/design` renders everything below in both themes. Judge a
change there before it reaches a screen.

## Method

These hold whatever the product looks like.

- Tokens are CSS variables in `src/app/globals.css`. Never a hex value in a component. A test fails the build on one.
- Hierarchy comes from weight and colour, not size. One family, a small fixed scale.
- Dark mode is the same token names with a second set of values, applied as a class on `<html>`. No component does dark specific work.
- Four pixel base. The steps are 4, 8, 12, 16, 24, 32, 48 and 64. Nothing in between.
- Focus is always visible on keyboard focus. A 2 px ring in `--focus` with a 2 px offset, on every interactive element.
- Every list has an empty state. Every screen handles empty, loading, error, full and overflowing before it is done. See `docs/design/states.md`.
- Status is never carried by colour alone. A label, an icon or a strike through goes with it.
- Contrast passes WCAG AA. `tests/rules/contrast.test.ts` computes every pair this file relies on, in both schemes, and fails the build under the line. The contrast table below is its output, refreshed by hand.
- Motion answers an action. Nothing animates on entry. Everything respects `prefers-reduced-motion`.
- Sentence case everywhere. No letterspaced caps, no display face, no italics.
- Names wrap. A name that needs two lines gets two lines. Never truncate a person's name with an ellipsis.
- Touch targets are at least 44 px. Mobile first.

## Taste

The template's point of view, settled against generated boards on
2026-09-05. Change it here and in `globals.css` together.

Near white and near black. A soft grey page with white sheets and cards, no
borders and no shadows, so surfaces are told apart by tone alone. A white card
on grey reads as a thing you could pick up, which is what a card is for, and it
gives a product a floor to stand on. A control steps away from whatever holds
it: up to white on the grey ground, down to grey inside a white card. Dark mode
keeps its own ladder, where each surface is a step lighter than the last, and
it needed no change because it already ran ground first. Pill buttons with a
near black primary. One pale blue
tint reserved for featured content. Geist for everything. Warmth, when the
product needs it, comes from photography or illustration, never from an
accent hue. A product that wants an accent anyway follows the recipe at
the end of this file, and the contrast test decides whether it holds.

Rules that follow from it.

- An input is always one step of tone away from what it sits on. On a sheet it is `--field`. On the page it is `--sheet`. It never has a border.
- A modal that asks a question owns the work it starts. The confirm pill spins in place, the modal stays open while the server is working, and it closes only after the work resolves. A failure keeps it open and puts the reason inside it. `ConfirmModal` is the only way to do this, and eslint stops anything outside `primitives/` from importing the dialog or the sheet. The one other overlay is `Drawer`, the phone sidebar, which asks nothing and so closes on a tap outside.
- No component measures its own. Every size, space, radius and type step is a token in `globals.css`, so the system can be restyled in one file. `text-[13px]` and `max-w-[480px]` are the way that rule gets broken quietly, and `tests/rules/no-raw-values.test.ts` fails the build on them.
- Text links are `--text` at medium weight. No underline at rest, no blue.
- `--tint` is for cards that show featured content. It never colours a button, a status or text. Text on a tint card is always `--text`, because `--text-2` on the tint clears AA by a hair (4.55:1 in light) and any change to the tint or an accent pushes it under.
- `--error` never fills anything. A red ring on the field and one line of helper text is the whole treatment. The danger pill is a secondary pill with red text.
- One shadow, `shadow-lifted`, and only for something that floats over the page: a dialog, a menu, a toast. Nothing that sits on the page has one.
- The sidebar sits behind a hairline in `--divider`, the one place a line separates two regions, because the sidebar and the page share the ground tone. A menu that floats takes the same hairline as a ring.
- Photographs and illustrations are the only saturated things on any screen.

## Values

### Colour

| Token | Use | Light | Dark |
| --- | --- | --- | --- |
| `--page` | Page background, the ground | `#F5F5F7` | `#0A0A0A` |
| `--sheet` | Sheets, cards, inputs on the page | `#FFFFFF` | `#161618` |
| `--field` | Inputs and guide cards on a sheet | `#F2F2F4` | `#1F1F22` |
| `--text` | Primary text, icons, links | `#0A0A0A` | `#F5F5F7` |
| `--text-2` | Secondary text | `#656569` | `#9A9AA1` |
| `--text-3` | Placeholder only, never content | `#A0A0A6` | `#6B6B70` |
| `--divider` | Rare. Table rows in dense views | `#E5E5EA` | `#26262A` |
| `--action` | Primary pill background | `#0A0A0A` | `#F5F5F7` |
| `--on-action` | Text on the primary pill | `#FFFFFF` | `#0A0A0A` |
| `--action-pressed` | Primary pill pressed | `#262626` | `#D9D9DE` |
| `--pill-2` | Secondary pill background | `#EBEBEE` | `#26262A` |
| `--tint` | Featured content cards only | `#D9E5F5` | `#1B2A40` |
| `--error` | Field ring, helper text, the danger pill | `#C4281C` | `#F97066` |
| `--focus` | Focus ring | `#0A0A0A` | `#F5F5F7` |

Light `--text-2` is `#656569` rather than the more common `#6B6B70`: invisible to the eye, and it lifts secondary text on the secondary pill from 4.45 to 4.9 against the AA line of 4.5. Light `--error` is `#C4281C` rather than `#D92D20`, which was 4.4 on the page and 4.1 on the secondary pill.

The shadcn variables in `globals.css` point at these, so a generated
component takes the system without edits. A product that needs a status
palette adds its tokens in the same file and documents them here, with a
cue beyond colour for each.

### Layout

The numbers below are tokens, so a component names an intent rather than a
measurement. Anything not here uses Tailwind's own scale.

| Token | Value | Utility | Use |
| --- | --- | --- | --- |
| `--spacing-control` | 52 px | `h-control` | The pill on a phone |
| `--spacing-input` | 48 px | `h-input` | Inputs, and the pill on a desk |
| `--spacing-gutter` | 20 px | `px-gutter` | Page gutters |
| `--spacing-sidebar` | 272 px | `w-sidebar` | The app sidebar |
| `--container-auth` | 480 px | `max-w-auth` | The auth sheet and single column forms |
| `--container-prose` | 640 px | `max-w-prose` | Reading width for the notice and the home page |
| `--container-content` | 1200 px | `max-w-content` | App content beside the sidebar |

### Shape

| Element | Token | Radius |
| --- | --- | --- |
| Button | `--radius-pill` | Full |
| Sheet | `--radius-sheet` | 24 px |
| Card | `--radius-card` | 20 px |
| Guide card | `--radius-guide` | 16 px |
| Input | `--radius-input` | 14 px |
| Small tag | `--radius-tag` | 8 px |

One scale, and "Making it yours" below has two other presets for it.
Circles, such as avatars and icon buttons, are `rounded-full` and not on
the scale.

### Type

Geist Sans and Geist Mono through `next/font`, self hosted. One family,
three weights: 400 for body, 500 for anything that needs to lead, 700 for a
wordmark and nothing else.

| Size | Line height | Utility | Use |
| --- | --- | --- | --- |
| 28 px | 1.2 | `text-title` | Page title, medium weight |
| 20 px | 1.25 | `text-heading` | Card title, medium weight |
| 17 px | 1.4 | `text-body` | Body, inputs, buttons |
| 15 px | 1.4 | `text-small` | Secondary text, helper copy |
| 13 px | 1.3 | `text-label` | Field labels, tags, helper text |

The utilities are named so they cannot collide with a colour. Numbers in
columns use `tabular`. Geist Mono, through `font-mono`, is for references,
identifiers and code.

### Spacing and layout

Phone controls are 52 px pills and 48 px inputs, with 20 px gutters. The
auth sheet is 480 px wide. The app runs at up to 1200 px of content beside a
272 px sidebar. `docs/design/layouts.md` has the breakpoints.

### Motion

Almost none. State changes ease over 150 ms. Nothing animates on entry
inside the app. Every transition is removed under `prefers-reduced-motion`,
in `globals.css`, for everything.

### Contrast, as set

The test is the source and this table is the record. `pnpm test` prints
every pair it checks with its ratio, so refresh the table from that output
when a value changes. Recomputed on 2026-09-08, when the ground and the
sheet swapped.

| Pair | Ratio |
| --- | --- |
| `--text` on `--page`, light | 18.2:1 |
| `--text` on `--sheet`, light | 19.8:1 |
| `--text-2` on `--page`, light | 5.3:1 |
| `--text-2` on `--sheet`, light | 5.8:1 |
| `--text-2` on `--field`, light | 5.2:1 |
| `--text-2` on `--pill-2`, light | 4.9:1 |
| `--text-2` on `--divider`, light | 4.6:1, the header of an open group |
| `--text-2` on `--sheet`, dark | 6.5:1 |
| `--error` on `--sheet`, light | 5.7:1 |
| `--error` on `--page`, light | 5.3:1 |
| `--error` on `--pill-2`, light | 4.8:1, the danger pill |
| `--error` on `--sheet`, dark | 6.5:1 |
| `--text` on `--tint`, light | 15.5:1 |
| `--text-2` on `--tint`, light | 4.6:1, close to the AA line, which is why tint cards use `--text` only |
| `--text-3` on `--field`, light | 2.3:1, placeholder only, the label carries the meaning |

## Components

`src/components/primitives/` is the design system as code. `Pill` is the
button. `InputField`, `TextareaField` and `SelectField` own their label,
control, helper and error together, so no screen can ship an input without
a label. `Sheet`, `Card`, `GuideCard` and `Row` are the surfaces, and
`Drawer` is the phone sidebar.
`src/components/ui/` is the shadcn set for everything else, menus, dialogs,
tables and tabs, already token mapped. `docs/design/components.md` says when
to use which.

## Making it yours

The template is one point of view, and two products made from it should
not look like the same product. Four knobs turn without touching the
method, and each is a values change in one or two files. Setup asks about
them on the first day, `/plan` can revisit them, and `pnpm test` decides
whether the result still holds. The `reference` skill reads a site the
person admires and says which of the four it argues for moving. Judge
every change on `/design`, in both schemes, before it reaches a screen.

**Accent.** The template is monochrome on purpose. When a product has a
reason for a hue, change these in both schemes: `--action` to the hue,
`--on-action` to whatever reads on it, `--action-pressed` a step darker,
`--focus` to the hue so the ring and the pill agree, and `--tint` to a
pale wash of the same hue for featured cards. The selection colour reads
`--tint` and follows. Nothing else moves: text, surfaces, dividers and the
error red stay grey and red, and a status still never rides on colour
alone. Two limits. `--on-action` on the hue has to clear 4.5 to 1, which
rules out pale and mid hues for a white label and means a light scheme
accent is a dark hue. And shadcn already uses the name `--accent` for the
field tone, so the product's hue keeps the names above. The contrast test
names any pair that fell under the line with its ratio. `theme` in
`src/config.ts` does not change, because it tracks the page.

**Ground.** Light mode is a grey page with white sheets. The other way is
a white page with grey sheets: set the light values of `--page`, `--sheet`
and `--field` to `#FFFFFF`, `#F5F5F7` and `#FFFFFF`, then `theme.light` in
config and both manifest colours to match, which the theme test holds you
to. Then grep for `bg-field` on anything that sits directly on the page,
because that tone has become the ground. Dark mode is a ladder and needs
nothing. Try both on `/design` before choosing.

**Shape.** The six radii are one scale. Three presets:

| Preset | `--radius-pill` | sheet | card | guide | input | tag |
| --- | --- | --- | --- | --- | --- | --- |
| Pill, the default | 9999 px | 24 | 20 | 16 | 14 | 8 |
| Soft | 14 px | 20 | 16 | 12 | 12 | 6 |
| Sharp | 8 px | 12 | 10 | 8 | 8 | 4 |

Set all six in `globals.css`, and the shadcn `--radius-*` aliases beside
them to the nearest values. Circles stay circles.

**Typeface.** Geist, self hosted through `next/font`. Another family comes
the same way: `next/font/google` downloads it at build time and the app
serves it, so nothing is fetched at runtime. Import it in
`src/app/layout.tsx`, point `--font-sans` at its variable in
`globals.css`, keep the five sizes and the three weights, and keep Geist
Mono for references. A display face is still out. One family, and weight
and colour do the hierarchy.

Whatever moved, write the hex values into the tables above, the reasoning
into `docs/design/direction.md`, and a screenshot of `/design` into
`docs/design/screenshots/`.
