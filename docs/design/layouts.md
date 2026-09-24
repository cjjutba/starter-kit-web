# Layouts

The breakpoints and the two shells, as numbers.

## Breakpoints

Tailwind defaults. `lg` at 1024 px is where the app shell goes from a top bar to a sidebar, and where auth forms can sit beside a photograph.

## The auth shell

`src/components/auth/auth-shell.tsx`. A 480 px sheet centred on the page with the product name above it. On a phone the sheet fills the width with 20 px gutters. A product with a photograph puts it behind the sheet on a phone and beside it at `lg`.

## The app shell

`src/components/app/shell.tsx`. A 272 px sidebar behind a hairline, beside up to 1200 px of content. The organisation sits at the top and opens into the switcher. Settings opens into its sections from `src/content/settings-sections.ts`. The account sits at the bottom above a hairline and opens into appearance, the account page, privacy and sign out. Below `lg` the sidebar becomes a top bar and slides in from the left as a sheet.

## Content widths

Forms are 480 px wide. Reading columns are 640 px. Lists and tables take the full 1200 px.

## Product layouts

Anything this product adds, with a sketch or a screenshot.
