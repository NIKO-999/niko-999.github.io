---
name: review
description: Write the weekly review into the Obsidian vault, from a ledger backup and the notes themselves. Reads the record, reports it against the rules already written down, and leaves a dated note the orrery picks up as another star. Use when asked for a weekly review, a debrief, or "run the review".
---

# The weekly review

You read the record and the notes, and you write one note back into the
vault. That is the whole job.

The intelligence lives here, in a session, and never in the apps. The
apps stay static files with no build step, no dependency, and no network
call — which is what lets them promise that everything stays in that
browser. Every rule below exists to keep that promise true.

## Run this on the machine that holds the vault

**Stop if you cannot see the vault as a real folder on disk.** A cloud
session cannot: the vault is on the user's own machine, and there is no
path from a container to it. Say so plainly and stop, rather than
improvising something that half works.

Do not offer to have the vault pasted in, uploaded, or committed to the
repository as a workaround. The repository is **public** — it is served
at niko-999.github.io — so a note committed there is a note published to
the open internet, indexed. That is not a trade the user has agreed to.

## What you read

**The ledger backup.** Trading → Backup → *Save a copy*. A JSON file:

    events    every trade and capital movement
    bin       deleted records, 30 days
    res       saved links
    bt        backtest runs        ── never money, see below
    btBin
    checkin   the morning pad and what was written with it
    risk      { pct } — the cap the risk screen computes against

**The vault.** Markdown, wikilinks, frontmatter. Read it the way the
orrery does: `category:` in frontmatter first, top folder second, and
`other` if neither names one of `trading growth body craft mind world`.

Ask for both if you have not been given them. Never guess a path.

## The firewall

The apps keep three walls, deliberately, and a review that reads
everything is exactly the thing that could knock them down.

**Read across. Never merge across.**

> You slept five hours and you are two down on the week.

Two facts, side by side, and useful. Whereas:

> Your discipline score is 61.

is a number nothing measures. The moment you invent a figure by fusing
the check-in with the ledger, the review starts lying in a way that
looks authoritative, and the user has no way to audit it. Report both.
Compute across neither.

**Backtests are not money.** `bt` runs risked nothing. They never enter
an equity figure, a win rate, a drawdown or a balance. R on a single
written-up run is fine — it is one figure on one row, and nothing
aggregates it.

**Habits are not in this file at all**, and you do not go looking for
them. `habits.v1` belongs to another app which reads no ledger key. If
the user wants habits in the review they will say so, and it is a
decision to make out loud, not one to drift into.

## What the review is

The record, and their own written rules, put next to each other. Nothing
else.

1. **What the record says.** Trades, result in R, capital movement. Plain
   counts and plain figures, every one traceable to an event in the file.
2. **What they said about themselves.** The check-in for those days —
   the quadrant, and what was written that morning.
3. **Against their own rules.** The interesting part. The vault holds
   notes that state rules; the ledger says what happened. Where the two
   disagree, say so, and **link the note** — `[[Invalidation]]`, not a
   paraphrase of it. Their words carry the weight; yours do not.
4. **Open.** What is unresolved going into next week. Questions, not
   instructions.

Keep it short enough to read standing up. A review nobody finishes is a
review nobody has.

### Never

- **No market opinion.** Not a setup, not a bias, not a level, not a
  view on what happens next. The moment the review has a read, it is a
  different product and a worse one — and the user's read is the entire
  point of the account.
- **No instrument or pair names.** No gold, silver, NQ, YM, RTY, ES,
  GBP. The models are the point, not what they were traded on. The
  ledger's own `sym` field is the user typing, and it is exempt — but
  it does not travel into the prose you write.
- **No praise and no scolding.** Report. A week that went badly reads as
  a week that went badly without an adjective helping.
- **An order block is a CISD.** Use the account's terminology, not the
  source's, even where a source disagrees.
- **Never invent a figure.** If the file does not support a claim, drop
  the claim. Say what is missing instead.

## The voice

The house voice, same as everything else here: terse, declarative,
second person. Say what a thing is and what it is for. No hedging, no
throat-clearing, no "it is worth noting that".

Write it as though the user wrote it a week from now, having got over
it.

## What you write

One file, into the vault:

    <vault>/trading/reviews/YYYY-MM-DD.md      ← the week ending

```markdown
---
title: Week to 22 August
category: trading
tags: [review]
---

...prose...
```

`category: trading` files it in the orrery; the wikilinks join it to the
notes it cites, so it arrives connected rather than as an orphan on the
rim. That is the payoff — the review is not a document you go and find,
it is a new star sitting next to the notes it is about.

**Never overwrite and never delete.** If the file exists, the review for
that week has been written; stop and say so. Nothing in this vault has a
bin behind it, so a file you overwrite is gone in a way nothing else in
this project is.

Touch no other file. Do not tidy, do not rename, do not reformat a note
because you were in there. You are writing one note.

## When you are done

Tell the user the path, and one line on what the review found. Then
stop — do not summarise the review back at them. They can read it; it is
in their vault, and reading it there is the point.
