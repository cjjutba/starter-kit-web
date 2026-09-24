# docs

## Read in this order

| File | What it answers |
| --- | --- |
| [`progress.md`](progress.md) | Where the build stands, what is next and what is open. Read first |
| [`product/intake.md`](product/intake.md) | The brief as it was pasted, and every question and answer before a doc was written |
| [`product/brief.md`](product/brief.md) | What this is, who it is for, and what has to be true about it |
| [`product/users.md`](product/users.md) | The people who use it, by role, and what each must never see |
| [`product/scope.md`](product/scope.md) | What v1 is, what it is not, and the non-goals |
| [`product/glossary.md`](product/glossary.md) | One word per concept, and the word used in code |
| [`product/features.md`](product/features.md) | The features of v1, in order, with what done means for each |
| [`product/data-model.md`](product/data-model.md) | Entities, relationships and which tables are tenant tables |
| [`product/roles.md`](product/roles.md) | The roles and what each can do |
| [`product/privacy.md`](product/privacy.md) | What is collected, why, and for how long |
| [`product/metrics.md`](product/metrics.md) | The numbers the case study will need |
| [`product/roadmap.md`](product/roadmap.md) | After v1 |
| [`design/direction.md`](design/direction.md) | How the visual direction was decided and what it cost |
| [`design/pages.md`](design/pages.md) | Every page by surface, with routes and who can reach it |
| [`design/screens.md`](design/screens.md) | The screens in the order they get designed |
| [`design/components.md`](design/components.md) | The primitive inventory and when to use which |
| [`design/copy.md`](design/copy.md) | How the interface talks |
| [`design/states.md`](design/states.md) | The checklist every screen passes |
| [`design/layouts.md`](design/layouts.md) | Breakpoints and the two shells |
| [`design/accessibility.md`](design/accessibility.md) | The audit record |
| [`design/explorations/`](design/explorations/README.md) | Generated boards and vectors with the prompts that produced them |
| `design/screenshots/` | Screenshots of the running app, by date and page |
| [`engineering/`](engineering/conventions.md) | Conventions, data, auth, mail, testing, environments, deploy, tooling, launch |
| [`workflow.md`](workflow.md) | The build loop, and when to escalate review depth |
| [`product/decisions.md`](product/decisions.md) | Every decision made so far, and why |

The two files above this folder matter more than any of them.
[`AGENTS.md`](../AGENTS.md) is the operating manual and
[`DESIGN.md`](../DESIGN.md) is the design system.

## How the templates work

Every product and design doc opens with a line saying what it is for and
has one line under each heading saying what belongs there. `/plan` asks
first, then fills them in order from `product/intake.md`.

There is no word limit. A doc is as long as it needs to be complete, and
no longer. Every fact lives in one file, and other files link to it
rather than restating it. `tests/rules/no-repeats.test.ts` fails the
build when a sentence appears in two places, so a copy gets caught
instead of drifting.

## Keeping this honest

`product/decisions.md` is append only. When a decision changes, add a new
entry that supersedes the old one rather than editing history. A decision
log that gets rewritten is a decision log nobody trusts.

Everything else in this folder describes the product as intended. When the
build teaches you something different, change the document. A plan that
disagrees with the code is worse than no plan, because someone will follow it.
