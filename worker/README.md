# The worker

The server for the friends half of `schedule/`. Everything else in this
repository runs in your browser and sends nothing anywhere. This does
not, which is the whole reason it is a separate folder with its own
README rather than a file somewhere in the app.

It is about two hundred lines and it is deliberately stupid: no
accounts, no email, no passwords, no sessions. It cannot tell you who
anybody is because it has never been told. It does not know who is
friends with whom either — **your friend list lives on your phone**, and
the server only ever sees "somebody asked for the record under code
X". Read `index.js`; the reasoning is written where each decision is.

## Deploying it

You need a Cloudflare account; the free tier is far more than this will
ever use. `wrangler.toml` already carries a namespace id, so a deploy
onto THAT account needs no edit — anyone deploying their own copy
replaces it with their own.

From a machine:

```sh
cd worker
npx wrangler login                      # opens a browser, once
npx wrangler kv namespace create SCHED  # prints an id, if you need one
npx wrangler deploy
```

**From a phone, with no command line**, which is the route this was
actually set up by:

1. Dashboard → **Storage & databases → KV** → create a namespace. The
   name is only a label; the **id** is the last segment of the
   namespace's own URL, and that is the string `wrangler.toml` wants.
   The id is not on the Settings tab — read it out of the address bar.
2. Put it in `wrangler.toml` (GitHub's web editor is enough — it is one
   line).
3. Dashboard → **Compute → Workers** → create from a Git repository,
   with the **Path** set to `/worker` (the field is under Advanced
   settings, and it is the root directory). No build command.

`package-lock.json` in this folder is why that build works. A
Git-connected build runs `npm ci` in the root directory before it does
anything else, and `npm ci` refuses to run without a lockfile — it does
not fall back to `npm install`. There are no dependencies to lock, so
the file is four lines and installs nothing; it exists purely so the
install step has something to succeed at.

Pasting `index.js` straight into the dashboard editor works too, and
then no id is needed at all — but `wrangler.toml` is not read on that
path, so the KV binding has to be added by hand under the worker's
**Settings → Bindings**, with the variable named `SCHED`.

Either way it ends with a URL ending in `.workers.dev`. **That URL is
the thing to hand back** — the app is inert until it has one, and holds
no other configuration.

## What it costs

The free tier is 100,000 requests and 1,000 KV writes a day. A whole
record is written at a time rather than a tick at a time, so a heavy day
of ticking is a handful of writes rather than one per glass of water.
Reads are 100,000/day and a friend's record is one of them.

## Two strings, and only one of them is shareable

- **code** — short, public, read-only. This is what you text a friend.
  Anyone holding it can read your record.
- **key** — 32 hex characters, secret, write-only. It never leaves your
  phone except in an `Authorization` header, and the server keeps only
  its SHA-256.

Splitting them is the security model. One string doing both jobs would
mean that sharing your code shares the ability to post as you.

## What is actually up there

Your name, your two theme colours, an avatar, thirty rolling days of
ticks, and your log entries with their photographs. That is everything
the feed needs, which is what was asked for, and it is a long way past
the five bits a day the leaderboard alone would have taken. The app says
so on the screen where you turn it on.

Thirty days is the retention, and it is the shape of the data rather
than a policy note: the board is a rolling thirty days, so there is no
fortieth day to keep. Photographs carry their own expiry and age out on
their own.

`DELETE /v1/rec/<code>` is final and takes the write key with it. It is
the one thing in this app with no bin, on purpose — a bin protects a
record you cannot rebuild, and this is somebody asking to be off a
server.

## Changing it

`npm test worker` runs the real worker in Node against a Map standing in
for KV — no account, no network, a second and a half. Run it before
`wrangler deploy`, because a Worker fails at request time on somebody's
phone and there is nothing on screen that will tell you.

If you widen the origin rule in `index.js`, understand that you are
choosing who may read the photographs. It answers the app's own origin,
plus a loopback on any port for working on it, and never `*`.
