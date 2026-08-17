# js/v2 — second generation of written content

Nothing in here is required. Every file is an **overlay**, not a replacement.

## How it works

`DestinyMatrix-v1.html` loads the original `js/<name>.js` first, then executes
`js/v2/<name>.js` on top of it. The overlay closes over the global the original
defined and answers from its own table first, deferring to the original for
anything it doesn't cover:

```js
'use strict';
(function () {
  const prev = window.DPastLifeContent;      // captured BEFORE we reassign
  const entries = {
    1: { title: '…', tagline: '…', fields: [ /* … */ ] },
    // …only the records rewritten so far
  };
  window.DPastLifeContent = {
    get(n) { return entries[n] || (prev && prev.get(n)) || null; },
  };
})();
```

Granularity is therefore **per record, not per file**. One reading can be
rewritten and shipped while every other reading in the app is untouched. There
is no point at which the app is half broken, and no file has to be finished
before any of it goes live.

A missing overlay simply 404s and is ignored — that's a module this generation
hasn't reached yet.

## Rules for a file in here

- Same filename as the original in `js/`.
- Capture the previous global **before** reassigning, and defer to it on a miss.
- Preserve the original's exact `get()` signature. Some take two arguments
  (`DMicroContent.get(num, key)`, `DPurposeContent.get(posKey, num)`); some
  expose more than one global from a single file (`hidden-numbers-content.js`
  defines six). Wrap every global the original file defines, or leave the ones
  you aren't overlaying completely alone.
- Records use the self-labelling shape, which is what this generation is for:

```js
{
  title:   '17 in Money — The Star',
  tagline: 'A Design of Paid Visibility',
  fields: [
    { label: 'Your Real Value', text: '…' },
    { label: 'When You Wait',   text: '…' },
    { label: 'Set The Price',   text: '…' },
  ],
}
```

  Two to four `fields` are supported. `hasFields()` in the page sniffs for this
  shape and `renderFields()` renders the labels the record carries, instead of
  the fixed MASTERY / THE SHADOW / INVITATION headings older records get. Both
  shapes work side by side, which is exactly what lets a generation be mixed
  while it is being written.

## When a module is finished

Add its name to `CONTENT_SET_COMPLETE` in `DestinyMatrix-v1.html`. The original
then stops loading for that module and the overlay stands alone. Only do this
when the overlay genuinely covers every record — being wrong here produces
missing readings rather than stale ones. `micro-content.js` is 783KB, so for the
large files this is worth doing promptly.

## Switching generations

`CONTENT_SET` near the top of the lazy-content loader decides which generation
everyone gets:

- `''`   — the originals in `js/`. Nothing here is requested at all.
- `'v2'` — this folder, layered over `js/`.

Set it to `'v2'` once the first real file lands here. Setting it back to `''`
is the entire rollback procedure.

For a single visit, without touching code: `?content=v2` or `?content=v1` on the
URL. Nothing about it renders on screen — readers never see a switch.

## Why the originals are never edited

`js/` is the base layer and the backup at the same time. Because no original
file is moved or modified, reverting cannot fail and needs no restoration step.

The last commit before any of this landed — the state of the writing as it stood
when the second generation began — is **`30116aa`** ("Remove extraction scratch
output from the repo"). Recorded here rather than as a git tag because tag
pushes are refused by the environment this was built in.

## The voice

Plain English. No metaphors, no images to decode, everyday words only, nothing
that routes the reader's worth through anyone else's reaction, and an ending
that gives them something they could actually do this week. The shape is
*what you're good at → where it goes wrong → what to do about it*, with the
three subheadings written fresh for every single reading — no two alike
anywhere in the app, and no two readings opening the same way.
