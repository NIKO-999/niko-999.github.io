/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  GENE KEYS — TODAY'S ACTIVATION  (transit-matches-your-profile reading)
 * ═══════════════════════════════════════════════════════════════════════════
 *  The Sun transits one of the 64 Gene Keys at a time, moving to a new key
 *  roughly every 5.6 days. When today's transiting key is also one already
 *  present somewhere in a visitor's own 13-sphere profile, that is a real
 *  astronomical coincidence between the sky and their specific chart, not a
 *  generic fact about the key.
 *
 *  This is deliberately NOT a restatement of the key's core meaning (that
 *  content lives in js/gene-keys-content.js and the 13 role files, and is
 *  shown elsewhere on the site). It answers a narrower question: what does
 *  it feel like, right now, that a key you were already born carrying just
 *  got the Sun's spotlight turned on it today. The register is immediacy,
 *  activation, and the charge of synchronicity in timing — never mechanism-
 *  explaining, since the surrounding UI already covers what a transit is.
 *
 *  Each entry is built from that key's real Shadow/Gift/Siddhi triad in
 *  js/gene-keys-content.js, 2-3 sentences, present tense, second person.
 *  Original writing throughout — not sourced from or paraphrasing
 *  genekeys.com's or Richard Rudd's published material.
 *
 *  API:
 *    DGKTransitDays.get(keyNum) -> string | null
 * ═══════════════════════════════════════════════════════════════════════════
 */

window.DGKTransitDays = (function () {
  'use strict';

  const D = {
    1: "The fire you carry gets pulled to the surface today, whether you asked for it or not. Whatever fresh angle has been waiting under the surface has better odds of breaking through this week than it did last month — the sky is simply agreeing with something already wired into you.",
    2: "Something in your own compass gets louder for a few days — not a new direction, just the old one insisting on being heard. If you've been overriding a lean you already trusted, this is a bad week to keep doing that.",
    3: "The part of you that thrives on raw, unsorted beginnings is switched on right now, not manufactured by circumstance. A mess that's been sitting untouched may suddenly look like material instead of a problem — that shift is coming from inside your own chart meeting its moment.",
    4: "Your own capacity to actually understand rather than merely judge has extra current running through it this week. A conversation you've avoided because you already know how it usually goes might go differently now — the mechanism in you built for this is unusually warm.",
    5: "Whatever sense of timing already lives in you gets sharper for a few days, less like new insight and more like a dial turned up on something you were born with. Notice this week which things stop needing to be forced.",
    6: "The part of you built to find the sentence both sides can stand inside is more available today than usual — not summoned, just lit. If a tension has been sitting stale, this is an unusually good window for the read you already have.",
    7: "Something in you that already knows where a group is actually headed is closer to the surface this week. You don't need new authority for this — the guidance was always yours, and right now it's simply easier to reach.",
    8: "Your own signature — the one that shows up uninvited in everything you touch — gets a little harder to suppress today. If you've been quietly matching a template that isn't yours, this week makes that harder to keep doing comfortably.",
    9: "The small, exact, repeated thing you're built to give real weight to has extra pull this week. Nothing new is being asked of you — just more access, for a few days, to a persistence that was always already yours.",
    10: "Whatever ease already belongs to you gets turned up, not manufactured. The version of you that doesn't perform is closer to the surface right now than it usually is — worth noticing which rooms it shows up in this week.",
    11: "An image you've been carrying, maybe one you haven't said aloud, has more charge behind it today. This isn't a new vision arriving — it's a private one of yours getting easier to speak, for a few days only.",
    12: "Your own instinct for what's actually worth saying yes to is running a little hotter this week. If something ordinary has quietly been asking for your full attention, that pull is coming from your own chart lining up with the sky, not from outside pressure.",
    13: "The part of you that hears past the words is unusually online today. Don't be surprised if people say more to you than they meant to this week — that receptivity was already yours, just turned up for a few days.",
    14: "Whatever work actually feeds you rather than drains you has more juice behind it right now. This is a strange week to keep postponing the thing your energy already wants to spend itself on.",
    15: "The current that pulls people and moments toward you without any effort on your part is running stronger today. If life has felt grey lately, notice what gets vivid again this week — it was already in you, just quieter.",
    16: "Your own appetite for climbing inside a skill until it becomes part of you gets a boost right now, not a new one, an old one turned up. Something half-learned might be worth another look this week while the current is with you.",
    17: "The part of you that sees the shape of things before anyone has words for it is more active today than usual. Trust what you're noticing this week a little sooner than you normally would — the instinct behind it is already yours.",
    18: "Whatever in you insists on naming the crack everyone else stepped around gets sharper for a few days. This is a good window to say the corrective sentence you've been holding back — not because it's suddenly true, but because you can say it more cleanly right now.",
    19: "Your own sensitivity to what a room actually needs is running at higher bandwidth today. Notice this week what you pick up on before it's spoken — that receptivity has been yours all along, just amplified for a moment.",
    20: "The part of you built for full contact with right now gets easier to access this week. Nothing about your presence needs to change — it just has less static between it and the surface for a few days.",
    21: "Whatever you already take responsibility for gets a little more of your instinctive attention today. If something has quietly needed your hand on it, this week your grip on what's actually yours is more natural than usual.",
    22: "Your own capacity to meet hard feelings — yours or someone else's — with real grace is closer to the surface right now. This is a good week to let that steadiness do what it already knows how to do.",
    23: "The part of you that finds the load-bearing sentence and lets the rest go is running clean today. If you've been over-explaining something, this week it may finally be easier to just say the short true version.",
    24: "Whatever invention already lives in your pauses gets easier to receive this week. Don't rush to fill every gap right now — the part of your mind built to bring something new back from the silence is unusually available.",
    25: "Your own capacity to accept what won't change, without giving up on it, has more weight behind it today. If a guarded place in you has been quietly closed, this week it may open a little more easily than it has in a while.",
    26: "The part of you that gets truth to land sideways, through timing and warmth rather than force, is switched on right now. A hard thing you've needed to say might finally find its angle this week.",
    27: "Your instinct for noticing who hasn't been fed — literally or otherwise — is running a little stronger today. This is a good week to trust the small act of care you almost talked yourself out of.",
    28: "Whatever pulls you toward meeting life at full weight instead of half-measure has extra charge this week. If you've been holding back from something that matters, the part of you built to go all the way in is unusually close right now.",
    29: "Your own capacity for a whole, undivided yes is easier to reach today. If you've been keeping one foot outside a commitment, this week makes the difference between a half-yes and a full one more obvious than usual.",
    30: "Whatever burns in you right now has extra light behind it and, if you let it, extra lightness too. This is a good week to notice a wanting fully without needing to be run by it.",
    31: "The voice in you that says the thing a room has been half-feeling for weeks is closer to the surface today. If you've been holding back words that would land, this week they carry a little further than usual.",
    32: "Your own instinct for what's actually worth keeping — a person, a habit, a piece of work — is sharper right now. This is a good week to trust which things you already sense have lasting value, and let the rest go a little more easily.",
    33: "The part of you that remembers everything is louder than usual this week, and it is not asking you to relive anything — just to finally sit down with something you filed away half-read. What surfaces now surfaces on schedule, not by accident.",
    34: "Whatever strength you have been quietly sitting on gets called into use today, no permission required. You do not need to perform power right now — you just need to stop apologizing for how much of it moves through you when the moment actually asks.",
    35: "The itch to cross into somewhere new is not random this week — it is your own appetite catching the light at exactly the angle that makes it visible. If a door has been sitting ajar, this is a strange week to keep pretending you haven't noticed it.",
    36: "Whatever you have been holding at arm's length in your own feeling life presses closer today, and it is not a malfunction — it is the part of your chart that knows how to survive weather asking to be used. You have done this before.",
    37: "The warmth you already carry for the people at your table gets a nudge this week, not from them, but from timing itself. Something in you that keeps a family or a friendship stitched together is wide awake right now, whether or not anyone else notices why.",
    38: "Whatever you have been quietly fighting for gets fresh fuel today — not a new battle, just your own resolve catching a current that happens to be running through the sky exactly where you already stand. You will feel unusually hard to talk out of it.",
    39: "Something in you that likes to press on stuck places is switched on this week, and it is not looking for a fight — it is looking for the one knot that has been waiting for exactly this kind of attention. Trust what wants disturbing right now.",
    40: "Permission to stop lands differently today, because the part of your chart built for clean, unapologetic rest is the one catching the light. If you have been pushing past the point of honesty about your own tiredness, this is a strange week to keep doing that.",
    41: "A beginning that has been sitting as a hunch gets a small jolt of reality this week — not because anything external changed, but because the part of you built to sense openings before they arrive is unusually switched on right now. Notice what you catch a whiff of.",
    42: "Something in you that knows how to close a chapter cleanly is closer to the surface today. If an ending has been dragging past its natural date, this week makes the shape of that ending easier to see than it has been in a while.",
    43: "A knowing that usually arrives sideways, off in its own weather system, is running a little hotter this week. Whatever solitary certainty you have been sitting on may be exactly what wants translating into a sentence someone else can actually hear right now.",
    44: "Your read on people sharpens for a few days without you doing anything to earn it — old patterns and true character both come into unusually clear focus. What you notice about who belongs where this week is worth writing down before the clarity fades.",
    45: "Whatever you already know about sharing well — resources, credit, a seat at your table — gets an extra charge today. If something has been sitting in your keeping a little too long, this is a live week for finally letting it move.",
    46: "The part of you built to actually enjoy being in a body is turned up this week, not as an indulgence but as information. Openings tend to find people who are paying attention to their own aliveness, and right now that particular radar of yours is on.",
    47: "Old material you have been quietly turning over for years gets extra heat today — not to burn you, just to move the process along faster than usual. Whatever meaning has been slow in coming may arrive a little sooner this week than you expected.",
    48: "The depth you have spent years quietly filling gets called on this week, whether or not you feel ready. You already have what this moment is asking for — the transit is simply making that truer and harder to talk yourself out of than usual.",
    49: "Your instinct for knowing when something has actually ended is running close to the surface today. Before you act on that instinct this week, notice it is unusually loud right now — worth a beat of extra attention before it becomes a verdict.",
    50: "Whatever quiet fairness you already carry — the sense of what's owed, what's off, what needs correcting — is more available to you this week than usual. If a small imbalance has been nagging at you, this is a live moment to finally name it.",
    51: "The part of you that moves first, before the room has finished deciding, is wide awake today. If you have been waiting for permission to make an unreasonable ask, the charge behind that impulse is unusually real this week — not manufactured, just timed.",
    52: "The stillness you already know how to hold gets deepened rather than tested this week. Whatever you have been sitting on with real discipline is being quietly reinforced right now — not a sign to wait longer, just confirmation that the waiting has weight.",
    53: "Something in you that knows how to start well is especially alive today. A beginning you set in motion recently may take root faster than expected this week — this is a good few days to actually take that first step you've been circling.",
    54: "The upward pull you already carry — the part of you unashamed of wanting more — gets extra current this week. If you have been climbing quietly without acknowledging it, today is a strange day to keep pretending the ambition isn't yours.",
    55: "Your emotional weather moves through you a little faster and a little more visibly this week, and that is not a problem to manage — it is the part of your own chart built exactly for this kind of full, passing intensity showing itself in daylight.",
    56: "The part of you that knows how to actually taste an experience instead of just consuming it gets extra volume today. Whatever ordinary pleasure crosses your path this week is worth receiving fully rather than rushing past — the timing is unusually generous.",
    57: "Your quiet knowing is a little louder than usual this week — the read you get on a room or a plan half a second before anyone speaks arrives with more clarity than normal. Whatever your body flags right now deserves less second-guessing than usual.",
    58: "Whatever delight you already carry gets turned up for a few days — not new joy, just the volume raised on something that was already yours. If you have been withholding enjoyment until things improve, this week makes that withholding harder to justify.",
    59: "Your capacity for going undefended fast is especially live today. If there is a truth you have been editing around someone close to you, the charge behind speaking it plainly is unusually available this week — timing is doing some of the work for you.",
    60: "Your feel for what actually holds under pressure is sharper than usual this week. A constraint that has felt immovable may be worth one small, concrete test right now — not because the wall changed, but because your eye for its true size did.",
    61: "Whatever tends to arrive to you whole, out of the quiet, is more available this week than usual. If you have been starving for real solitude, this is an unusually good window to take it — something is more ready to come through than it normally is.",
    64: "The picture-making part of your mind is especially active today. A pattern you have half-glimpsed for a while may click into a shape you can finally describe this week — not because you forced it, but because the timing behind it lined up on its own.",
    62: "Your instinct for the exact right word is sharper than usual this week. If something has been sitting fogged and undefined, the part of you built to name things precisely is unusually available right now — worth using before the window narrows again.",
    63: "The questioning part of your mind is running hotter than usual today. Whatever claim or assumption has been quietly bothering you deserves the extra scrutiny it's getting this week — your doubt is doing real work right now, not just circling.",
  };

  return {
    get(n) { return D[n] || null; },
  };
})();
