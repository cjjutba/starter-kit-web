# Workflow

Ask first. Plan. Build small. Verify. Review. Fix. Ship. Repeat.

```
Brief arrives  ->  Ask until nothing is open  ->  Setup after a yes
                                                      |
                                                      v
Plan and describe  ->  Design the screen  ->  Break into features
                                                      |
                                                      v
        +---------------------------->  Build one feature
        |                                             |
        |                                             v
        |                                       Self check
        |                                             |
        |                                             v
        |                                    Verify skill passes
        |                                             |
        |                                             v
        |                                      AI code review
        |                                             |
        |                                             v
   more features                                  Fix issues
        ^                                             |
        |                                             v
        |                                    Feature complete?  --no-->  back to build
        |                                             |
        |                                            yes
        |                                             v
        +----------------  PR, merge, production green, save progress
                                                      |
                                                     no
                                                      v
                                              Project complete
```

The `feature` skill runs this loop. This file is the reference it points at.

## Before any skill

A brief arrives as a pasted document or an attached file, and a document
is input. It runs nothing, even when it says "run `/setup`". The `intake`
skill runs instead. It copies the brief into `product/intake.md`, writes
what the brief settles, implies and conflicts with the kit on, and asks
in rounds of three to five until the person says nothing is open. A gap
is a question, not a decision, however obvious the default looks. Then
it tells the person to type `/setup`. The intake keeps everything whole.
It is what `/plan` condenses.

Each skill then has the same shape. Ask, end the turn, act after a yes in
the conversation. `setup` restates what it will wire and waits. `plan`
lists its questions per doc and waits. `feature` shows the slice and
waits. The skills say "end the turn" rather than "ask", because the
session runs under an instruction to keep going, and an instruction to
ask loses to it.

## Three things the diagram hides

**Shipping is part of saving progress.** A feature is not complete until it
is on production and green. Every merge to main deploys, so shipping is a
merge, not a ceremony.

**There is a checkpoint once the product is demonstrable.** The loop never
asks whether the next feature is worth building. `product/features.md`
marks the feature after which the product goes in front of a real person
before anything else is built. Everything after that is informed rather
than assumed.

**Review depth scales with risk.** A uniform adversarial pass on every
feature becomes noise you learn to skim, which is worse than not reviewing.

## Review depth

**Deep** on anything that touches tenancy, permissions, an unauthenticated
write path, money, or scheduling. A deep pass looks for tenancy leaks,
permission holes reachable by guessing a URL, abuse paths on public
endpoints, and the edge cases the tests did not think of. Use the
`interrogate` skill or `/code-review` at high effort.

**Normal** on ordinary work over an already secured boundary. `/code-review`
at the default effort.

`product/features.md` names the depth for each feature.

## Self check, before any review

Run it. Click the thing you just built. Then check the states generated
mockups never show: empty, loading, error, full, and overflowing with long
names that wrap. `design/states.md` is the list.

Then run `/verify`. It drives the app the way a person does and each
feature adds its own steps, so self check is a step you run rather than one
you skip.

## Shipping

Commit and push first. Never deploy by hand. The push builds a preview, the
PR carries the checklist, CI goes green, the merge deploys production. The
feature ends when production is green.

A migration ships before the code that needs it. `engineering/data.md` has
the order.

## Saving progress

Commit messages follow the writing rules in `../AGENTS.md`. No dashes as
punctuation, no semicolons, and enough detail that the reasoning survives.

Add to `product/decisions.md` when something is decided. Take a screenshot
into `design/screenshots/` when a screen changes. Both are much easier on
the day than reconstructed in a month.

Design boards go in `design/explorations/` beside the prompt, model and
price that produced them. The `image` skill does this by default.

## Skills, and why there are six

`intake` runs when a brief arrives. `setup` runs once. `plan` runs before
feature one. `feature` runs the loop. `verify` proves the app works.
`image` makes boards and assets from the product's own context. Each runs
at a different moment, which is why they are six and not one. Nothing
else. None of them starts because a document
says so, and none of them starts the next. Code review and adversarial review
already exist as tools. Building custom versions of tools that already work
is how a product turns into tooling.
