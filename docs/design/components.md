# Components

What exists, when to use which, and what to reach for when nothing fits.

## Primitives, in `src/components/primitives/`

| Component | Use | Not for |
| --- | --- | --- |
| `Pill` | Every button. Primary, secondary, text, danger. Loading is a spinner inside it. | Links that read as text. Use `Link` with `font-medium`. |
| `InputField`, `TextareaField`, `SelectField` | Every form control. They own label, helper and error. `SelectField` takes a name and a default in a server action form, or a value and an `onChange`. | Search boxes and row controls inside a toolbar, which use `controlClass` with an `aria-label`. |
| `Modal`, `ConfirmModal` | The only way to open a dialog. `DESIGN.md` says what `ConfirmModal` owns. Every destructive action in the app uses it. | Anything that is not a question. |
| `Outcome`, in `forms/` | The line under a form after it returns: an error in red, a message quietly. | |
| `Sheet` | The large panel on auth pages, 24 px corners. | Content inside the app. |
| `Card` | The everyday panel, 20 px corners, `tone` picks sheet, field or tint. | A list row. |
| `GuideCard` | A note from a colleague during onboarding. | Anything on sign in. |
| `Row` | A row in a list of records, with an optional secondary line and trailing content. | Tables with more than three columns. Use `ui/table`. |
| `Drawer` | The phone sidebar, sliding in from the left. It asks nothing, so it closes on a tap outside, Escape or any link. | Anything that asks a question. Use `ConfirmModal`. |

`ThemeToggle` and `ThemeMenuRow`, in `src/components/theme-toggle.tsx` rather than `primitives/`, are the three way theme switch, on its own or as the appearance row inside the account menu.

A control drawn under 44 px, such as a small pill, takes the `hit` utility from `globals.css`: its look stays and its tap area becomes 44 px.

## shadcn, in `src/components/ui/`

Menus, dialogs, popovers, tabs, tables, switches, tooltips, avatars and
skeletons. Already token mapped. Add more with `pnpm dlx shadcn add name`
and check the result on `/design` before using it.

## When nothing fits

Write it in `primitives/`, give it the tokens, add it to the design sheet
and to this table. Do not style a one off inline.

## Product components

List the components this product adds, with the screen that owns each.
