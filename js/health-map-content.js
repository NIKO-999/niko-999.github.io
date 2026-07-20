'use strict';

/**
 * Destiny Matrix — Health Map (verified subset)
 * ───────────────────────────────────────────────
 * Source: research/DestinyMatrixData.pdf (52-page worked personal
 * report), its "Health" sections — organized by the same 7 chakras as
 * research/07-Health-Interpretations/Chakra-Correspondence-and-Meanings.md,
 * each with real body-system associations and a health-problem / reason /
 * solution narrative.
 *
 * Verification: extracted the unique (non-duplicated — several blocks
 * repeat verbatim across zones, a report-generator artifact, not signal)
 * numbers tied to each zone and cross-checked them against every already-
 * computed value for the report's own subject (birthdate 08.05.2002).
 * 5 of the 7 zones checked out cleanly against positions already built in
 * this app:
 *   Crown (Sahasrara)      -> A, Crown/B, F        all matched
 *   Third Eye (Ajna)       -> D/Money, Heart Zone(V) both matched
 *   Heart (Anahata)        -> Throat/I1              matched
 *   Solar Plexus (Manipura)-> E/I, G2                both matched
 *   Root (Muladhara)       -> F1/C, H/Muladhara      both matched
 * 2 zones (Throat/Vishuddha, Sacral/Swadhisthana) plus a "General/Immune"
 * zone had at least one number that matched NO already-computed value for
 * the verification subject at all — the same signature as the still-
 * unconfirmed K/O/P/S letters blocking 4 of the formula-based Chakra Map
 * chakras. Deliberately NOT built here, same honest treatment.
 *
 * Content below is paraphrased into Golden Standard voice from the
 * source's health-problem/reason/solution narrative — the body-system
 * facts and thematic pattern are the source's, not invented.
 *
 * API: DHealthMapContent.zones -> ordered array of zone objects.
 */

window.DHealthMapContent = (function () {

  const zones = [
    {
      key: 'crown',
      label: 'Crown — Sahasrara',
      bodySystems: 'The brain, hair, and upper skull.',
      why: `This zone tends to activate around your sense of connection to something larger than yourself — a mission, a spiritual purpose, a reason your life is organized around. When it's active and unaddressed, the strain often shows up here first: tension headaches, hair or scalp issues, a foggy or overloaded feeling in the head.`,
      shadow: `The pattern underneath is usually rigid self-reliance — believing only in your own effort, disillusioned with anything you can't personally control, and quietly demanding the same narrow certainty from everyone around you. Anxiety and impatience tend to spike exactly when life refuses to be that predictable.`,
      path: `The shift here is less about the mission itself and more about how tightly you're gripping the need for certainty around it. Regular rhythm — sleep, food, movement, rest — tends to matter more for this zone than it looks like it should. You are allowed to not have your global purpose fully mapped out yet. What would it feel like to hold your bigger questions a little more loosely this week?`,
    },
    {
      key: 'thirdeye',
      label: 'Third Eye — Ajna',
      bodySystems: 'The occipital and temporal lobes, eyes, ears, nose, and optic nerve.',
      why: `This zone tends to activate around vision — both literal and the kind that means "seeing where your life is actually going." When it's under strain, it often shows up as eye or ear trouble, or a harder-to-name sense of being disconnected from your own path.`,
      shadow: `The pattern underneath is usually a private world that's drifted too far from the one you're actually living in — big ideas about life that never quite touch your actual job, home, or relationships, alongside a habit of protesting the systems you're inside rather than actually engaging with them.`,
      path: `The shift is bringing the inner vision back into contact with an actual, concrete next step, rather than letting it stay a private, ungrounded dream. Small, honest self-discipline — showing up, following through — tends to matter more here than another big realization. You are allowed to want something ordinary and still call it a purpose. What's one concrete step that would connect your bigger vision to this actual week?`,
    },
    {
      key: 'heart',
      label: 'Heart — Anahata',
      bodySystems: 'The heart, circulatory and respiratory systems, lungs, bronchi, thoracic spine, and chest.',
      why: `This zone tends to activate around depletion — giving until there's nothing left, then quietly waiting for rescue instead of asking directly. Under strain, it often shows up as a tight, restricted chest, low energy, or a heaviness that resists any obvious cause.`,
      shadow: `The pattern underneath is usually an old sense of not having enough love inside to draw from, alongside real guilt about the past, which together can flatten into a kind of resigned indifference — going through the motions while genuinely believing nothing will get better.`,
      path: `The shift is speaking the real thing out loud to someone safe, rather than continuing to carry it alone while waiting for outside help to arrive. Naming what you're actually ashamed of tends to loosen its grip faster than managing around it ever does. You are allowed to ask directly for what you've been quietly hoping someone would just notice. What's one true thing you could finally say to someone this week?`,
    },
    {
      key: 'solarplexus',
      label: 'Solar Plexus — Manipura',
      bodySystems: 'The gastrointestinal tract, pancreas, spleen, liver, gallbladder, small intestine, and central spine.',
      why: `This zone tends to activate around control and possession — attachment to people, status, or outcomes that becomes a way of proving your own worth. Under strain, digestive issues and mid-back tension are common, alongside irritability that flares whenever something you're gripping starts slipping away.`,
      shadow: `The pattern underneath is usually pride dressed as competence — controlling situations and people to protect an image, while quietly refusing any real connection with those who can't reciprocate your status.`,
      path: `The shift is loosening your grip on the specific thing you're most afraid to lose, and finding out the fear was carrying more weight than the actual loss would. New, unfamiliar experience — not more control — tends to be what actually rebuilds a sense of security here. You are allowed to let go of something before you're forced to. What would you stop gripping so tightly if you trusted you'd be fine without it?`,
    },
    {
      key: 'root',
      label: 'Root — Muladhara',
      bodySystems: 'The urogenital system, lower limbs, large intestine, tailbone, sacrum, and legs.',
      why: `This zone tends to activate around old material fear — a deep unease about survival, money, or belonging that traces back further than the present situation. Under strain, it often shows up in the legs, lower back, or a pervasive, low-grade sense of hopelessness about circumstances that haven't actually changed.`,
      shadow: `The pattern underneath is usually a fixation on the past — either grieving a better version of life that's gone, or endlessly replaying an old betrayal — that keeps present effort tethered to old evidence instead of current reality.`,
      path: `The shift is a genuinely concrete, physical one: change something real in your actual space — clear old belongings, rearrange a room, retire something that belongs to the old story — while also giving yourself permission to try something new even if it doesn't pay off immediately. You are allowed to let the past finish being the past. What physical, tangible thing could you change this week to mark that the old chapter is actually over?`,
    },
  ];

  function get(key) {
    return zones.find((z) => z.key === key) || null;
  }

  return { zones, get };

})();
