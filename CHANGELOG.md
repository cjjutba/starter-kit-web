# Changelog

The template's own history. A product made from it keeps its decisions in
`docs/product/decisions.md`, which starts empty. This file is about the
template.

## 2026-09-24, context that costs less and says what is true

**A session knew what v1 was but not where the build stood.** Nothing
recorded the feature in progress, what came next or what was still open,
so every new session pieced it together from git history and guessed at
the rest. `docs/progress.md` holds that now, every session reads it first,
and `setup`, `intake`, `plan` and `feature` keep it current. `/feature`
writes a spec per feature into `docs/specs/` before it builds, instead of
a plan in chat that was gone by the next session. Rule tests hold both.

**Word caps are gone, and repeats fail the build instead.** A cap cut
complete docs short and never caught a fact written twice, which is what
actually costs tokens and drifts. `tests/rules/no-repeats.test.ts` fails
on a sentence, or a close paraphrase, that appears in two docs or skills.
Each repeated explanation now has one owner and the rest link to it.
`AGENTS.md` opens with a table from task to the docs that task needs, so
a session reads what it needs rather than everything.

**An audit of the code found real holes, now closed.** Better Auth
trusted every `*.vercel.app` site as an origin, over http as well, so a
reset link could carry its token to anyone's Vercel deployment. The
redirect after sign in accepted `/\evil.com`. Mail html interpolated
names and messages typed by strangers. `MAIL_PROVIDER=resend` sent real
mail from previews. A handled deletion request could be handled again and
was never purged after its year. A personal organisation could be left
without an owner. The seed would create an owner with the password
printed in `.env.example`. Each is fixed, most with a test.

**The rules claimed more than they checked.** The dash rule missed a
spaced hyphen between two words, the guards test missed actions declared as constants, the
arbitrary value test missed a dozen axes and inline styles, and eslint let
`date-fns/format` and the shadcn sheet through. Each now fails on what it
says it fails on. The shell and primitives now meet the 44 px touch rule,
wrap names instead of truncating them, keep errors inside the shell, and
carry their copy in `src/content/`. The docs were checked claim by claim
against the code, and the new `skills` test ends the "six skills" kind of
drift.

## 2026-09-10, the reference skill

**A site someone admires had nowhere to go.** The direction doc asked for
one line per reference and the image skill filed boards, but a URL had no
path into the four knobs except a person squinting at it. The `reference`
skill runs `scripts/reference.ts`, which opens the page headless at three
widths in both schemes, reads the computed styles, and files screenshots
and `data.json` under `docs/design/explorations/references/`. Fonts and
the type styles in use with line height and letter spacing, headings by
level, colours by area covered, borders and the hairlines drawn as rings,
real shadows, radii, the spacing values that recur and how many sit on
the 4 px grid, section rhythm, container widths, the breakpoints the
stylesheets switch on, the header, the footer, cards, inputs, controls
with their heights, motion timings, and the custom properties on the root.
The skill writes the site's design system in full, colours, type, layout,
depth, shape, components, responsive behaviour, with no word cap, then
maps it onto accent, ground, shape and typeface and says which to move.
Structure only, never copy or imagery.
`tests/rules/references.test.ts` fails the build on a reference without
its source, date, reason, disclaimer, data, index row or any section of
that structure. The first run, vercel.com, is in the folder as the worked
example.

**The kit is named after its repository.** `starter-kit` became
`starter-kit-web` in the config, the package, the README, the docs and the
skills, because the repository had been for a while.

## 2026-09-09, the skills ask first

The first product made from the fourth version was handed a brief that
said "run `/setup`, then `/plan`". The agent did, and by the end of the
session the product was on production with eight decisions and three
defaults the person had never been asked about. Nothing was wrong with the
output. The person had wanted to be asked.

**A brief is input, never a command.** Rule 9 in `AGENTS.md`. Nothing
wires, writes or deploys because a document says to. A brief that arrives
runs the new `intake` skill, the sixth, which copies the brief into
`docs/product/intake.md`, the one product doc with no cap, writes what
the brief settles, implies and conflicts with the kit on, and asks in
rounds until the person says nothing is open. A rule in a paragraph can
be satisfied by three questions and a summary. A skill with a checklist
cannot. Then the person types `/setup`.

**Every skill stops for a yes.** Setup restates what it will wire and ends
the turn before touching Neon or Vercel. Plan lists its questions per doc
and ends the turn before writing. Feature shows the slice and ends the
turn before branching. Each says "end the turn" rather than "ask", because
the session runs under an instruction to keep going and an instruction to
ask loses to it. A gap in the brief is a question now, not a decision
logged as "defaulted, easy to change". No skill starts the next one.

## 2026-09-09, fourth version

A full read of the template found it green and well built, with a set of
gaps that would have bitten on the first real product rather than the
tenth. This version closes them. Every commit stayed green on lint,
typecheck, the unit suite and a production build.

**The migration path could not be followed as written.** The data doc said
production migrates and there was no migrations folder, while setup pushed
the schema straight onto main. The first generate in a product would have
written every table into migration 0000 and failed against production on
the first create table. `drizzle/` carries a committed baseline now, and
the rule is one line: dev and preview branches push, main migrates, and a
schema change lands as a migration before the code that needs it.

**Previews lost sign in the moment setup pinned the origin.** The base URL
is a host list now, the production host plus the Vercel wildcard plus
localhost, so a preview signs in on its own address and its mail links
point at itself. Production alone sets `BETTER_AUTH_URL`.

**Nobody had to prove an address was theirs.** Sign up sends a link and
creates no session until it is opened. The link signs the person in and
lands where they were going. An unverified sign in is refused with a fresh
link on its way, which needs `sendOnSignIn` because the runtime gates the
resend on it. An existing address gets the same success and its owner gets
a note. The seed marks its owner verified, because that account is the way
in until mail is real.

**Every product was a public SaaS.** `features.openSignUp` false means sign
up needs a pending invitation, checked before the row is written, with the
first account on an empty database always allowed. `multipleOrganisations`
replaces the switcher flag and means whether people can create more than
their personal one. The switcher shows whenever a person is in two, since
an invitation can do that whatever the flag says.

**The session's organisation id was a hint treated as a fact.** Better Auth
clears it only on the session of the person who acted, so a removed member
kept reading the organisation's rows and every other member of a deleted
organisation would loop between the app and sign in. `requireOrganisation`
joins the id on membership every request and heals a miss to the first
membership or a fresh personal organisation. The five minute cookie cache
went with it: a session revoked by a password change kept working until
the cache ran out, and the sign in page trusted the same cache, so a
revoked session looped between the two. Every session read is one indexed
query now, which the membership check needed anyway.

**Three things the walkthrough caught that no test had.** React resets an
uncontrolled field to its default when a form action completes, and the
default still held the old value, so a saved timezone or role snapped back
on screen while the database had the change. The fields are keyed on the
value the server holds now. The name field had the same trouble one step
later, because the session cookie that carries the name is refreshed in
the same response, so the action returns what it saved. And the sign up
route hides a 403 from user creation behind the same success it gives a
duplicate address, so an uninvited stranger on an invite only product saw
"check your email" and no mail ever came. The gate moved into the create
hook, where it refuses with a 400 and a sentence.

**People can manage their account and their organisation.** An account page
with name, password, email change through both addresses, and deletion
behind the password, refused for the only owner of an organisation others
belong to. The organisation page changes roles, removes people, cancels
invitations, lets anyone leave, lets an owner delete after typing the
name, and creates a new organisation when the flag allows. Better Auth
already protects the last owner, so no helper duplicates it. Every
destructive action goes through `ConfirmModal`, which had been a primitive
with no product use.

**Eight more rules became tests.** Contrast for every token pair in both
schemes, which is what makes an accent safe. Config and manifest colours
held to the page token. Every env read listed in the example. Pages, the
route directory and the pages doc held to each other. Every tenant table
reachable through the scoped layer. Every app action checking the session
and every public action behind the honeypot and rate limit. Every doc
under its own cap. A hyphen standing in for a dash. CI greps commit
messages for a dash too.

**Deletion requests are a row, not only a mail.** Recorded before any mail
is sent, listed and closed from `pnpm privacy:requests`. The contact
address is published only when set. The cron purges abuse counters along
with mail, which the notice had claimed for a version while the rows lived
forever. The notice names Neon, Vercel, Resend and Sentry.

**Errors reach Sentry, off until a DSN exists.** Errors only, no traces, no
replays, no personal data.

**The example is complete.** Edit with a version check, which needed
millisecond precision on the timestamps because Postgres keeps
microseconds and a JS Date does not. Delete in a modal. A skeleton while
loading. The author column set to null when a person leaves, so their
notes stay with the organisation.

**The skills know all of this.** Setup asks where the users are, the
product's shape, and whether the design system stays as it is or any of
four knobs turn, migrates main, and points at the new launch list. Feature designs the screen before building it,
reviews design beside code, and retires the example in F1. Verify covers
every flow above. `DESIGN.md` has the accent recipe.

**Next writes into AGENTS.md.** When `next dev` sees a coding agent it
appends a managed block to the bottom of AGENTS.md and rewrites it on every
run, em dashes included, so the dash rule failed the first time the dev
server ran under Claude Code. The block is committed as Next writes it,
the rule skips the region between its markers, and rule 7 says so.

**The app shell took Kalinga's shape.** The organisation sits at the top of
a 272 px sidebar behind a hairline, with its initial, and opens into a menu
of every organisation the person belongs to, their role in each, a tick on
the current one, and the way to create another. Settings opens into its
sections, named once in `src/content/settings-sections.ts`, so the old
organisation page is two pages now, Organisation and People. The account
sits at the bottom above a hairline and opens upward into Appearance, the
account page, Privacy and Sign out. Below the laptop breakpoint the sidebar
is a top bar and slides in from the left. The hairline and the one shadow a
floating menu takes are written into DESIGN.md as the exceptions they are.

**Four knobs, so two products do not look like one.** DESIGN.md's accent
recipe became "Making it yours": the accent, the light ground, the shape
and the typeface, each a values change in one or two files, each held by
a test. Shape needed a token, `--radius-pill`, where the pill and the
theme switch had `rounded-full` written in, so a soft or sharp product is
six numbers rather than a search. Setup asks about the four on the first
day and takes "keep it" as an answer.

**Housekeeping.** pnpm 12 with a regenerated lockfile and the three build
scripts allowlisted. Every ranged dependency pinned. The licence no longer
names another product. Robots, a sitemap and an Open Graph image from the
route directory.

## 2026-09-08, third version

**Light mode turned back over, and this time it stays.** The page is a soft
grey again and sheets and cards are white. The second version had it the other
way and told Kalinga to decide for itself. Kalinga decided: a white card on
grey reads as a thing you could pick up, which is what a card is for, and a
grey ground gives a product a floor to stand on. `--page` is `#F5F5F7`,
`--sheet` is `#FFFFFF`, `--field` is `#F2F2F4`.

**Light mode stopped being two alternating tones.** It is a ladder now, the
same shape dark mode always had: a ground, a panel raised off it, and a control
inside that panel. What changed is that the control steps away from whatever
holds it rather than simply taking the other tone. On the grey ground it steps
up to white, inside a white card it steps down to grey. `surfaceFill` in
`primitives/field.tsx` already said this in relationships rather than colours,
so no component needed touching, which is the whole point of naming the
relationship.

**One thing the swap does not do by itself.** Anything drawn on the assumption
that the ground is the lightest surface has to move, because the tone it used
to step to may now be the ground. In Kalinga that was two places, a sidebar
group header and a pair of hover states, both of which had picked the shade
that became the page. Grep for `bg-field` on anything that sits directly on the
page before shipping the swap in a product.

**Contrast recomputed, all pairs still AA.** The table in `DESIGN.md` now lists
secondary text on all three light surfaces rather than one, and adds
`--text-2` on `--divider` at 4.6 to 1, which is what a raised group header
needs.

## 2026-09-07, second version

Everything here came from running `/setup` end to end on a real product,
Settled, and hitting each of these in order.

**Light mode turned white side up.** The page was a soft grey with white
sheets. It is now a white page with grey sheets. Light mode has always been
two tones that alternate, so `--field` moved with the other two: a field on a
sheet was grey on white and is now white on grey. Leave `--field` where it was
and every input on a sheet sits three points of tone away from it and
disappears. `--page` is `#FFFFFF`, `--sheet` is `#F5F5F7`, `--field` is
`#FFFFFF`. Dark mode is untouched, because it runs a ladder rather than two
tones and has nothing to swap. Kalinga should decide for itself rather than
follow.

Two things read the old tones directly. The design sheet outlined the swatches
that would otherwise be white on a white page, and it outlined `--page` and
`--sheet` only, so the now white `--field` rendered as an invisible rectangle
above its own label. The theme toggle's active segment was white against its
`--pill-2` track and became one step off it, so it now takes `--page`, which
is the tone the track is furthest from in both schemes.

**A hardcoded grey hid inside a data URI for a whole version.** The select
chevron was an svg background with `stroke=%23656569` written into it. The
raw colour test looks for `#` and a data URI writes it as `%23`, so the rule
never saw it, and the chevron stayed light mode's secondary grey on a near
black field in dark mode. An svg background cannot read `currentColor`, so the
fix is a real `ChevronDown` element with `text-text-2` over a relative wrapper.
The test now matches `%23` as well as `#`.

**A new product's production database had no tables.** Setup wrote the `dev`
branch string into `.env.local`, pushed the schema and seeded, then pointed
production at the `main` branch, which nothing had ever touched. The first
production deploy met an empty database. Step 5 now pushes and seeds against
`main` too.

**Setup no longer promises a domain it cannot know.** `vercel link` connects
the GitHub repository by itself, and the production alias is not knowable
until a deployment exists, because Vercel suffixes the name when the plain one
is taken. `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` are now set after the
first deploy, and the step says sign in stays broken until they are.
`NEXT_PUBLIC_CONTACT_EMAIL` publishes an address on the privacy page, so the
step says to ask before setting one.

Setup also rewrites `README.md` now, which shipped describing the template, so
a product that kept it told readers to create a repository from starter-kit.
Its placeholder replacement skips `.claude/skills/`, because the setup skill
names `{{PRODUCT}}` and friends as text and a blind replace corrupts it.

**Two projects can run at once.** `.claude/launch.json` dropped its hardcoded
`--port 3000` and took `autoPort`, and setup renames the entry to the slug so
two open projects do not collide by name.

**The axe run says what is actually wrong.** Run it without
`BETTER_AUTH_SECRET` and Better Auth throws while rendering, the auth pages
fall back to the error boundary, and axe reports four colour contrast failures
on elements that are not the problem. `playwright.config.ts` now stops first
with a sentence naming the cause. It loads `.env.local` before it looks,
because the config runs in plain Node rather than through Next, and a check
that cannot see the file it is asking about fails every correctly set up
project.

**A modal now owns the work it starts.** `Modal` and `ConfirmModal` are new
primitives. The confirm pill spins in place, the modal stays open while the
server is working, and it closes only after the promise resolves. A failure
keeps it open and puts the reason inside it, beside the button that caused it,
rather than dropping the person back onto a screen that looks unchanged.
Escape and the overlay are ignored while the work is in flight, so a half
finished action cannot be dismissed into silence, and the close button is
taken away rather than left sitting there looking live while it cannot close
anything.

This is a primitive and not a paragraph because eslint stops anything outside
`src/components/primitives` from importing the dialog, and three Playwright
tests hold the behaviour down in both schemes. There is no second way to open
a modal, so there is no wrong way.

**The tokens are the source of truth for numbers, not just colours.** Layout
had no tokens, so components measured themselves: `text-[13px]` in five files,
`max-w-[480px]` in five more, `h-[52px]` inside the pill that DESIGN.md
describes as 52 px. Sizes and widths are tokens now, `h-control`, `h-input`,
`px-gutter`, `w-sidebar`, `max-w-auth`, `max-w-prose` and `max-w-content`, and
the type scale that already existed is used instead of pixel values.

`tests/rules/no-raw-values.test.ts` fails the build on Tailwind's arbitrary
value syntax for any design axis, outside the shadcn set, which the CLI
regenerates. Variant selectors such as `data-[state=open]` are not design
values and are left alone. One exception is allowlisted with its reason: a
honeypot has to leave the viewport, and no spacing token should exist for
that. A second test fails if the allowlisted file ever disappears, so an
exception cannot outlive what it excused.

Two type sizes moved by a hair on the way. A guide card body and a row title
carried `leading-[1.35]` and `leading-[1.4]` next to their pixel size, and the
type tokens carry their own line height, so both now take the scale's value.

**The app shipped with no security headers.** `next.config.ts` held a
placeholder comment and nothing else, so every response went out without
`Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy` or `Permissions-Policy`. Nothing breaks when those are
missing and no screen shows them, which is why they were still missing. They
are set for every path now and two Playwright tests assert them.

A full content security policy is deliberately still absent. Next needs a
nonce on every inline script for a strict one, and a policy written without
that either breaks the app or is loose enough to be theatre. The frame
ancestors directive is set, because that part needs no nonce. A product that
wants the rest does the nonce work and records the decision.

## 2026-09-07, the primary button had no text

Shipped and live before it was caught, and caused by this version's own token
work. The type scale became `text-body` and friends when the layout tokens went
in, replacing `text-[17px]`. A size named as a word and a colour named as a
word are both "text-" plus a word, so the class merger could not tell them
apart, put them in one group, and dropped whichever came first.

The primary pill sets `text-on-action` in its variant and `text-body` in its
size. The size wins by order, so the white disappeared and the button rendered
black on black with an invisible label. The danger pill lost its red the same
way, which nobody noticed because black text on a grey pill looks deliberate.

`src/lib/utils.ts` now builds `cn` with the scale named, so the merger knows
those five are sizes. Add a size to `globals.css` and add it there in the same
change: `tests/unit/class-merge.test.ts` fails when the two lists drift apart,
and thirteen of its sixteen cases fail if the fix is removed.

The lesson worth keeping is not about this bug. Replacing an arbitrary value
with a token is normally safe, and here it silently changed how another tool
parsed the class name. A token rename deserves a look at everything that reads
class strings, not just everything that renders them.

## 2026-09-07, dependency pass

Five Dependabot pull requests were open and all five failed. They were built
against a main from before the light scheme change, which had a real contrast
failure on the home page and the design sheet, so the failures were the old
code and not the bumps. Rebasing each one onto current main turned them green,
which is worth remembering the next time a batch of them looks broken at once.

`actions/checkout` to v7, `actions/setup-node` to v7 and `pnpm/action-setup`
to v6. The workflow warned that Node 20 was deprecated and the older actions
were being forced onto Node 24, so this stops a warning becoming a break.

`@types/node` went to 24 rather than the 26 Dependabot offered, because
`.node-version` pins Node 24 and the types should describe the runtime the
project actually uses. It was on 20, which was two majors behind the pinned
runtime and nobody had noticed. Dependabot will keep offering 26, and the
answer stays no until `.node-version` moves.

TypeScript to 6.0.3, a major, and it needed no code changes at all. Lint,
typecheck, the unit tests, a build and twenty six Playwright tests all pass
untouched. 7.0.2 exists and was not taken, because Dependabot did not offer it
and a second major in the same pass is how a green suite stops meaning
anything.

## 2026-09-06, first version

Built from Kalinga's design system with Geist in place of Inter, plus the
data layer, auth, mail, guards, rule tests, docs and the five skills.

Proven on a fresh clone into an empty directory against an empty Neon
database. What passed: lint, typecheck, thirteen tests (three rule tests,
the scoped layer in PGlite, the time helpers, the rate limiter against
Neon), a build with no `DATABASE_URL`, sixteen axe checks over eight public
routes in light and dark, sign up, sign in, a wrong password, notes create
and delete, organisation rename and timezone validation, an invitation read
from the mail log and accepted, the switcher, the scope proven across two
organisations from the interface, three deletion requests then a refusal
then a honeypot, a password reset by link, CI green, and two Vercel builds
through the git integration.

Two tokens moved during the proof. Light `--text-2` from `#6B6B70` to
`#656569` and light `--error` from `#D92D20` to `#C4281C`, because axe
measured 4.45 and 4.06 against AA on the secondary pill. `DESIGN.md`
records the ratios. Kalinga has both old values and should take the new
ones.

Pinned: next 16.3.4, react 19.2.8, better-auth 1.7.2, drizzle-orm 0.45.2,
@neondatabase/serverless 1.1.0, tailwindcss 4.3.3, shadcn 4.21.0, geist
1.7.2, typescript 5.9, vitest 4.1.11, playwright 1.63.0. Node 22 or later.
