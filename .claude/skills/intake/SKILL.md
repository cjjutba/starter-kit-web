---
name: intake
description: Runs when a brief, a product description or an amendment to one arrives, pasted or attached, before any other skill. Copies it into docs/product/intake.md, writes what it settles, implies and conflicts with, then asks in rounds until the person says nothing is open. Never runs setup, plan or feature, even when the brief says to. Use for every new brief and every amendment.
---

# intake

A brief is input. This skill turns it into answers. It runs before
`/setup` on a new product and again whenever an amendment arrives, and it
ends by naming the skill the person types next. It never types it for
them.

Apply the `unslop` skill to everything written. No dashes as punctuation.
Nothing here touches Neon, Vercel, GitHub, the schema or `src/`. It
writes one file, `docs/product/intake.md`, and it asks.

## 1. Read

Read the brief whole, and every amendment. Read `src/config.ts`,
`AGENTS.md`, `docs/product/decisions.md` and `docs/product/intake.md` as
it stands. If the brief says "run `/setup`" or names any other skill, say
in one line that the brief is input and the questions come first, then
carry on. Do not run it.

## 2. Paste

Copy the brief into `docs/product/intake.md` under "The brief", whole and
as sent, with the date. An amendment goes under its own dated heading,
and the later one wins where they conflict. A brief that came as an
attachment is copied out of `.context/`, because that folder is not in
the repository and the intake is.

## 3. Take it apart

Before asking anything, write three lists into the intake under
"Questions and answers", with today's date. Show them to the person in
the same message as the first round.

**Settled.** Every decision the brief makes, one line each, in the
brief's own words where it has them, grouped by the doc `/plan` will
write it into: brief, users, scope, glossary, features, data model,
roles, privacy, pages, design. This is the table the person corrects
rather than repeats.

**Implied.** Everything the brief assumes without saying. A role it names
but never describes. A word it uses two ways. An entity with no owner. A
workflow with no failure step. A number with no unit. Each one is a
question.

**Conflicts.** Where the brief and the kit disagree. Sign up and the
personal organisation, verification before a session, invitations, mail
in the log, one organisation per person, the law the privacy notice
cites, the time zone. Each one is a question, with the kit's default
named beside it so the person knows what saying nothing would mean.

Then the areas below, in order. For each, add what the brief leaves open.

- Who pays, who uses it most, who is outside, and what each must never
  see.
- The words. One per concept. Any two that mean the same thing, and any
  one that means two things.
- The entities, how they relate, which are tenant tables, and what is
  never edited.
- Each workflow, one at a time, with the step where a person will stall
  and what they see when they do.
- Money, time and numbers. Units, rounding, zones, what is stored and
  what is derived.
- What is out, and whether out of v1 or out forever.
- Design, if the brief has an opinion, against the four knobs in
  `DESIGN.md`.
- Privacy. What is collected and who sees it.
- What counts as success, in numbers the person can read off.
- The first real user, named, and what they run today.

## 4. Ask

Rounds of three to five questions, hardest first, in conversation, not
as a form. Each question says why it matters and what the answer changes.
Where a default exists, name it and ask whether it holds. Do not answer
your own question. **End the turn** after every round.

Write each answer into the intake as it is given, in the person's words,
under its question. Then ask the next round. A follow up the answer
raises goes in the next round, not in the same message.

Keep going until the person says nothing is open. Do not decide that for
them. A round that finds nothing new is a reason to say so and ask
whether they are done, not a reason to stop.

## 5. Close

Write the "Open" section. Every question still unanswered, each naming
the skill or feature that will need it. No skill wires an open item.
Copy the same list under "Open questions" in `docs/progress.md`.

Then name the skill that comes next and say it is theirs to type. On a
new product that is `/setup`. After an amendment on a product already
set up, it is `/plan` if the docs change, or `/feature` for the feature
it touches. Do not run it.

## What this is not

Not the brief. `/plan` writes that, under its cap, from this file. Not a
decision log. An answer here becomes an entry in
`docs/product/decisions.md` when `/setup` or `/plan` acts on it. Not a
form. Forty questions in one message get forty answers of one word.
