'use strict';

/**
 * Destiny Matrix — Karmic Debt Content
 * ─────────────────────────────────────
 * Past-life / karmic debt / health reading for the "Karmic Debt" star —
 * the Inner Bottom point, the midpoint between the Karmic Tail (D) and
 * Soul Center (E) stars. Value = reduce(D+E), matching matrix-engine.js's
 * karmic-tail-triplet middle value [D, reduce(D+E), E].
 *
 * Two layers:
 *   nodes[NUM]     — one full reading per arcana (1-22).
 *   codes[NAME]    — 5 deeper bonus readings for the named karmic seeds
 *                    matched via DMEngine.matchKarmicTailCode([D, K, E]).
 *
 * Each entry: heading, expressions[] (8-15 past-life vignette
 * possibilities), unfinished, soulChose, showsUpToday, health,
 * positive, negative.
 *
 * API:
 *   DKarmicDebtContent.get(arcanaNum)  → entry or null
 *   DKarmicDebtContent.getCode(name)   → entry or null
 */

window.DKarmicDebtContent = (function () {

  const nodes = {

    1: {
      heading: 'The Magician — A Life That Began Everything and Finished Little',
      expressions: [
        `Starting ventures, movements, or families that others were left to actually build.`,
        `Having real talent and using it to impress rather than to serve.`,
        `Being the one who could always talk your way into a room, and out of a consequence.`,
        `Wielding influence over others without ever being held accountable for it.`,
        `Discovering a gift early and coasting on it instead of developing it.`,
        `Manipulating a situation to your advantage and calling it cleverness.`,
        `Being surrounded by admirers who never saw you finish anything.`,
        `Using charisma to avoid the slower, harder work that charisma can't replace.`,
        `Living as someone others depended on to make things happen, without ever depending on anyone yourself.`,
        `Beginning a spiritual or creative path and abandoning it the moment it required real discipline.`,
      ],
      unfinished: `Across these possible lives, the thread is the same: real capability that never converted into follow-through, and a habit of letting your effect on other people matter less to you than your own momentum. You left with the specific, unglamorous lesson of finishing — not starting again, not being admired for potential, but actually staying with something long enough to see what it costs you and what it becomes.`,
      soulChose: `This life is built to put real consequence back in front of you. You're likely placed in situations where the follow-through is the whole test — where talent alone gets you in the door but isn't enough to keep you there, where people notice specifically whether you stay. This isn't a punishment for having been gifted. It's a structure designed to let you actually feel what commitment produces that raw ability never could.`,
      showsUpToday: `You may notice a pattern of enormous early momentum on things — jobs, relationships, creative projects — that quietly stalls once the initial spark wears off, and a recurring, uncomfortable sense that people remember your beginnings more than your endings. You might find yourself unusually persuasive and unusually avoidant of the exact moments persuasion isn't enough. Money, recognition, or opportunity can arrive quickly for you and then just as quickly reveal whether you were ever going to actually hold it.`,
      health: `This tends to concentrate in the hands, wrists, and nervous system — the literal instruments of starting things. Watch for repetitive strain, restlessness that resists real rest, and a wired, can't-sit-still quality that burns through your own reserves faster than you replenish them. The body often signals "slow down and finish" through exactly the parts of you built to reach for the next thing.`,
      positive: `You bring real follow-through to what you begin now, and your capability finally gets to compound instead of scatter.`,
      negative: `A trail of brilliant, unfinished starts keeps repeating — talent spent on the exciting part, momentum abandoned right where it would have started to actually matter.`,
    },

    2: {
      heading: 'The High Priestess — A Life Spent Knowing and Never Saying',
      expressions: [
        `Holding real spiritual or intuitive knowledge and keeping it entirely to yourself.`,
        `Being trusted with people's secrets and using that trust to stay hidden rather than to help.`,
        `Living as an oracle, healer, or advisor who let others make decisions blind rather than risk being wrong out loud.`,
        `Withholding your true perception of someone to avoid the discomfort of honesty.`,
        `Choosing solitude so completely that your gift never actually reached anyone.`,
        `Being feared or mystified rather than known, and finding that safer than intimacy.`,
        `Watching people suffer from a lack of guidance you privately had and didn't offer.`,
        `Using secrecy as a form of quiet control over people who trusted you.`,
        `Retreating from a community or family right when your perception was most needed.`,
      ],
      unfinished: `What links these lives is withheld knowing — real perception kept private, either from fear of being wrong, fear of being too much, or a habit of mistaking mystery for safety. The debt isn't that you knew things; it's that you let the knowing stop with you. What was left unfinished is the risk of speaking clearly, trusting that being known is not the same as being endangered.`,
      soulChose: `This life tends to put you in front of people who are genuinely waiting on your perception — situations where staying quiet has a visible cost, where your silence is noticed rather than invisible. It's built to make withholding uncomfortable enough that you finally choose differently, not by force, but because the discomfort of staying hidden eventually outweighs the discomfort of speaking.`,
      showsUpToday: `You may notice you're often the person people confide in, yet rarely the one who's fully known in return — a familiar loneliness that looks like depth from the outside. You might catch yourself sitting on an accurate read of a situation, waiting for someone else to say it first, or feeling a kind of relief when a decision gets made without needing your input. Intuitive hits that you don't act on, insight you don't share until it's safely too late to matter — these are the debt still running.`,
      health: `This tends to settle in the throat and the reproductive/hormonal system — both classically tied to withheld expression and cyclical, unconscious rhythms. Watch for chronic throat tightness, voice that goes quiet under stress, sleep disturbed by unprocessed insight, and hormonal irregularity that tracks periods of significant unspoken truth.`,
      positive: `You speak your real perception when it matters, and the depth people always sensed in you finally becomes something they can actually receive.`,
      negative: `Real knowing stays private out of old habit, and the loneliness of being trusted but never truly known keeps repeating.`,
    },

    3: {
      heading: 'The Empress — A Life of Plenty That Never Reached Anyone',
      expressions: [
        `Living in genuine comfort or abundance while remaining emotionally closed off from those around you.`,
        `Being fertile with ideas, resources, or beauty and hoarding the benefit for yourself.`,
        `Having the means to nurture others and choosing not to.`,
        `Mistaking luxury for love, and never learning the difference.`,
        `Being cared for endlessly without ever developing the capacity to care for someone else.`,
        `Building a beautiful life that no one else was ever truly welcomed into.`,
        `Using generosity as a performance rather than a genuine offering.`,
        `Growing so identified with your own abundance that others' lack became invisible to you.`,
        `Choosing comfort over the harder, more generative work of actually creating something that outlasts you.`,
      ],
      unfinished: `The common thread is abundance without circulation — resources, warmth, or fertility that stayed contained rather than given. What was left unfinished is generosity that costs you something real, not the easy kind that flows from excess with no risk attached. The soul carried forward a debt around what it means to actually nurture, not just to possess.`,
      soulChose: `This life is often structured to put real scarcity or real need in your path — situations that ask you to give from something other than overflow, that test whether your generosity holds when it actually costs you. It's not designed to punish comfort; it's designed to teach you that nurture which requires nothing of you isn't yet the real thing.`,
      showsUpToday: `You might notice a pattern of accumulating — resources, relationships, creative output — without a corresponding instinct to actually share what you've built. There can be a subtle guardedness underneath apparent warmth, a generosity that quietly keeps score or waits for the safe moment. You may also swing the other way: giving until you're depleted, as an overcorrection that still avoids the real lesson, which is sustainable, genuine circulation rather than either hoarding or self-erasure.`,
      health: `This tends to show up in the reproductive system, digestion, and skin — the body's own systems of nourishment, absorption, and boundary. Watch for digestive sluggishness, fertility or cycle irregularities, and skin conditions that flare during periods of emotional withholding or overextension.`,
      positive: `You give from genuine overflow now, and the abundance you've built finally moves through you instead of just around you.`,
      negative: `Real resources — emotional, material, creative — stay contained rather than shared, and a familiar isolation grows quietly inside apparent plenty.`,
    },

    4: {
      heading: 'The Emperor — A Life of Power Held Without Its Weight',
      expressions: [
        `Holding authority or rank without earning the trust it required.`,
        `Ruling, managing, or leading through fear rather than legitimate respect.`,
        `Inheriting position, wealth, or status and mistaking it for your own achievement.`,
        `Being protected by structure so completely you never learned to build your own.`,
        `Using control to manage your own fear rather than to genuinely serve anyone.`,
        `Being obeyed without ever being truly trusted.`,
        `Building an empire, household, or system that depended entirely on your presence and collapsed without you.`,
        `Avoiding responsibility for decisions that affected people with far less power than you had.`,
        `Mistaking rigidity for strength, and never discovering what real strength required.`,
      ],
      unfinished: `What runs through these possible lives is authority without accountability — power exercised, inherited, or performed without the harder, quieter work of earning it through service. What was left unfinished is the difference between control and genuine responsibility: holding real weight for people rather than simply holding rank over them.`,
      soulChose: `This life tends to place real responsibility in your hands early or often — situations where you have to build stability rather than inherit it, where authority has to be earned in full view of people who can see exactly how you handle it. It isn't designed to strip your capability; it's designed to make sure the structure you build this time is actually yours.`,
      showsUpToday: `You may find yourself repeatedly placed in positions of responsibility that feel heavier than expected, or notice a discomfort with authority you haven't personally earned — either resisting it in others or feeling like an impostor holding it yourself. There can be a pattern of building systems, teams, or households that quietly depend too much on your control, alongside a fear of what happens if you loosen your grip even slightly.`,
      health: `This tends to concentrate in the skeletal system, joints, and lower back — the body's literal load-bearing structure. Watch for chronic tension in the neck and shoulders from carrying more than you've let anyone help with, joint stiffness tied to rigidity, and a body that holds weight even when you insist you're fine.`,
      positive: `The authority you hold now is genuinely earned, and the structures you build finally hold their own weight instead of depending entirely on you.`,
      negative: `Power held without real accountability keeps producing the same brittle result — obedience without trust, structures that need you to survive rather than structures built to last.`,
    },

    5: {
      heading: 'The Hierophant — A Life of Doctrine Without Devotion',
      expressions: [
        `Holding religious or institutional authority without genuine personal belief behind it.`,
        `Teaching rules you didn't actually live by.`,
        `Being ordained, credentialed, or respected within a system that mattered more to you than the truth it claimed to protect.`,
        `Enforcing tradition on others while privately doubting it yourself.`,
        `Using spiritual or institutional status to gain influence rather than to genuinely guide.`,
        `Belonging fully to a group identity and losing your own direct experience inside it.`,
        `Being the keeper of knowledge that you gatekept rather than transmitted.`,
        `Following the letter of a law while missing what it was actually for.`,
        `Trading your own conviction for the safety of belonging to something larger.`,
      ],
      unfinished: `The pattern across these lives is inherited authority without lived devotion — belief performed rather than actually held, structure maintained for its own sake rather than for what it was meant to protect. What was left unfinished is the harder work of finding out what you actually believe, underneath what you were given to recite.`,
      soulChose: `This life tends to place you in situations where inherited belief gets tested directly — where you have to decide whether a tradition, rule, or system you were handed is actually true for you, not just familiar. It's built to move you from borrowed conviction to something you've genuinely examined and chosen for yourself.`,
      showsUpToday: `You might notice a recurring tension between what you were taught to believe and what your own direct experience keeps quietly telling you — a friction that can surface as guilt, doubt, or an unexpected resistance to authority you'd normally defer to. There can be a pattern of belonging to structures — religious, professional, familial — that you maintain out of loyalty long after your genuine conviction in them has faded.`,
      health: `This tends to show up in the jaw, teeth, and upper spine — the body's architecture of speech and inherited posture. Watch for jaw clenching (especially around unspoken doubt), dental issues, and neck or upper-back tension tied to carrying a structure you're no longer sure you agree with.`,
      positive: `What you teach and transmit now comes from genuine, examined conviction, and your guidance actually lands because it's real.`,
      negative: `Doctrine gets upheld without personal belief behind it, and the gap between what you say and what you actually think keeps quietly widening.`,
    },

    6: {
      heading: 'The Lovers — A Life of Choices Made for the Wrong Reasons',
      expressions: [
        `Marrying or partnering for status, security, or convenience rather than genuine alignment.`,
        `Choosing a path to please family or society while quietly betraying your own values.`,
        `Loving someone deeply and never actually choosing them, or choosing them and never actually loving them.`,
        `Living a divided life — public commitment, private disconnection.`,
        `Avoiding the harder, truer choice in favor of the one that caused less immediate conflict.`,
        `Being loved by many and unable to fully commit to any one connection.`,
        `Sacrificing your own values repeatedly to maintain a relationship or alliance.`,
        `Choosing the safe option so many times that you lost touch with what you actually wanted.`,
      ],
      unfinished: `What connects these lives is choice avoided or made dishonestly — decisions about love, values, and direction driven by fear, convenience, or obligation rather than genuine alignment. What was left unfinished is the courage of a real choice: one that costs you something, made from your actual values rather than from what kept the peace.`,
      soulChose: `This life is often structured around real forks in the road — relationships, paths, or values that genuinely conflict and can't be quietly avoided. It's built to put you back at the crossroads, this time asking you to choose from your own center rather than from what's easiest or most approved of.`,
      showsUpToday: `You may notice a pattern of major decisions that get made by default — staying in something past its natural end, or leaving something before you've actually understood why — rather than through a clear, values-based choice. There can be a recurring sense of living a slightly divided life: doing the approved thing while quietly wanting something else, or committing outwardly while withholding something essential.`,
      health: `This tends to concentrate in the lungs, heart, and shoulders — the body's systems of breath and embrace. Watch for shallow breathing during moments of real decision, chest tightness tied to conflicted commitment, and shoulder tension from carrying a choice you haven't actually made yet.`,
      positive: `Your choices now genuinely reflect your own values, and the relationships and paths you commit to hold because you actually chose them.`,
      negative: `Decisions keep getting made by default or obligation, and the quiet cost of avoiding the real choice keeps accumulating.`,
    },

    7: {
      heading: 'The Chariot — A Life of Conquest Without Direction',
      expressions: [
        `Winning, achieving, or acquiring at a relentless pace without ever asking what it was actually for.`,
        `Leading others into battle, competition, or ambition that served your drive more than their wellbeing.`,
        `Being unstoppable in pursuit of goals that, once reached, meant nothing.`,
        `Running from stillness so completely that you never discovered who you were without momentum.`,
        `Sacrificing relationships, health, or peace for the sake of forward motion.`,
        `Achieving mastery in one domain while leaving your inner life completely unattended.`,
        `Being admired for your drive while privately having no idea what you were actually driving toward.`,
        `Using victory to avoid a grief or fear you never let yourself feel.`,
      ],
      unfinished: `The thread through these lives is momentum without meaning — real capacity for achievement used to outrun something rather than to arrive anywhere that actually mattered. What was left unfinished is the question underneath the drive: not can I win, but what am I actually trying to reach, and why.`,
      soulChose: `This life tends to force real stillness into your path — circumstances that stop the momentum whether or not you're ready, precisely so the question you've been outrunning finally gets asked. It's built to slow a chariot that's been moving too fast to ever notice where it was actually headed.`,
      showsUpToday: `You may notice a restlessness that reads as ambition but functions more like avoidance — a discomfort with rest, silence, or being unproductive that goes deeper than ordinary drive. There can be a pattern of reaching significant goals and feeling strangely hollow on arrival, or of using constant achievement to keep from sitting with grief, fear, or genuine uncertainty about direction.`,
      health: `This tends to show up in the adrenal system, legs, and lower back — the body's literal machinery of forward motion. Watch for adrenal fatigue from sustained overdrive, leg or hip tension from a body that doesn't know how to stop, and lower back strain from carrying momentum that's never actually set down.`,
      positive: `Your drive now serves a direction you actually chose, and stillness stops feeling like a threat to who you are.`,
      negative: `Momentum keeps substituting for meaning — achievement after achievement, with the underlying question of what it's actually for still left unasked.`,
    },

    8: {
      heading: 'Strength — A Life of Force Mistaken for Power',
      expressions: [
        `Dominating others physically, financially, or emotionally and calling it strength.`,
        `Suppressing your own instincts so completely that they eventually broke through in ways you couldn't control.`,
        `Being feared rather than respected, and mistaking the two.`,
        `Using cruelty or control to manage a fear you never let yourself name.`,
        `Being praised for endurance while privately running on suppressed rage or grief.`,
        `Overpowering a weaker situation or person when patience or gentleness was actually called for.`,
        `Building a reputation for toughness that left no room for anyone to see you struggle.`,
        `Confusing the ability to endure anything with the wisdom of knowing what shouldn't have to be endured.`,
      ],
      unfinished: `What links these lives is force mistaken for mastery — real capacity for endurance or control used to dominate or suppress rather than to genuinely integrate. What was left unfinished is the gentler kind of strength: the ability to hold your own instinct, and other people, without needing to grip.`,
      soulChose: `This life often places real vulnerability in your path — situations that can't be forced, controlled, or willed through, that specifically require the gentleness your prior pattern never developed. It's built to teach that the tightest grip isn't actually the strongest one.`,
      showsUpToday: `You may notice a pattern of handling pressure through control or suppression rather than genuine integration — an instinct to grip harder exactly when softening would actually work better. There can be an old, quiet fear of your own force, alongside a difficulty asking for help that reads as independence but is closer to a refusal to be seen as anything less than unbreakable.`,
      health: `This tends to concentrate in the jaw, gut, and lower back — the body's classic sites of suppressed instinct. Watch for jaw tension, digestive issues tied to swallowed anger, and a lower back that carries what never got expressed directly.`,
      positive: `Your strength now holds without needing to grip, and genuine gentleness finally reads as the power it actually is.`,
      negative: `Force keeps substituting for real integration, and what's suppressed rather than met keeps surfacing sideways, in the body or in the people closest to you.`,
    },

    9: {
      heading: 'The Hermit — A Life of Wisdom That Died With You',
      expressions: [
        `Gathering profound understanding through solitude and never returning to share it.`,
        `Living as a recluse, monk, or outsider whose insight helped no one but yourself.`,
        `Withdrawing from a community that genuinely needed what you knew.`,
        `Choosing isolation as a permanent identity rather than a temporary passage.`,
        `Being so certain others couldn't understand you that you never actually tested it.`,
        `Mistaking distance for wisdom, and never discovering the difference.`,
        `Letting fear of being misunderstood keep your most important insight permanently unspoken.`,
        `Dying with a lantern that never lit anyone else's path.`,
      ],
      unfinished: `The pattern here is wisdom hoarded — real insight, gathered through genuine solitary depth, that never made it back out into relationship. What was left unfinished is the return trip: bringing what you found in the dark back to the people who could have used it.`,
      soulChose: `This life tends to keep placing you in front of people who need exactly what you've quietly figured out — situations where staying silent has a visible cost this time, where withdrawal is noticed rather than simply accepted. It's built to interrupt the old pattern of gathering wisdom and keeping it to yourself.`,
      showsUpToday: `You may notice a strong pull toward solitude that sometimes tips into permanent withdrawal rather than a temporary, generative retreat. There can be a recurring sense of being misunderstood that you've never actually tested by trying to be understood, and a quiet reluctance to offer your hard-won insight until it's been so thoroughly refined that the moment to actually use it has passed.`,
      health: `This tends to show up in the eyes, nervous system, and immune function — the body's instruments of perception and boundary. Watch for eye strain, a nervous system that struggles to downshift from hypervigilance, and immune dips during periods of prolonged isolation.`,
      positive: `What you've gathered in solitude now genuinely reaches people, and your wisdom stops dying quietly with you.`,
      negative: `Real insight stays gathered but unshared, and the same old, hard-won knowing keeps waiting for a moment to offer it that never quite arrives.`,
    },

    10: {
      heading: 'The Wheel of Fortune — A Life of Luck Never Understood',
      expressions: [
        `Rising to fortune through circumstance rather than effort, and never learning what sustained it.`,
        `Falling from a high position and blaming fate rather than examining your own part in it.`,
        `Riding good timing so consistently that you never developed real resilience.`,
        `Gambling — literally or figuratively — with resources that weren't only yours to risk.`,
        `Being at the mercy of circumstances you refused to take any responsibility for shaping.`,
        `Repeating the same cycle of rise and collapse without ever tracing the pattern.`,
        `Attributing your success entirely to yourself and your failure entirely to bad luck.`,
        `Refusing to plan for a downturn because the upswing felt like it would simply last forever.`,
      ],
      unfinished: `What connects these lives is an unexamined relationship with cycles — fortune received or lost without ever tracing the actual pattern underneath it, whether through blind luck or blind blame. What was left unfinished is the conscious participation in your own timing: understanding what you actually do at each turn of the wheel, rather than treating the whole thing as something happening to you.`,
      soulChose: `This life tends to bring cycles that repeat clearly enough to finally be studied — rises and falls close enough together that the pattern becomes visible if you're willing to look. It's built to convert a passive relationship with fortune into an active one.`,
      showsUpToday: `You may notice recognizable cycles in your own life — financial, relational, professional — that seem to repeat with an uncanny rhythm, and a habit of either taking full credit for the highs or none of the responsibility for the lows. There can be a discomfort with the ordinary, unglamorous work of consistency, alongside a pull toward dramatic reversals that feel more familiar than steady progress.`,
      health: `This tends to concentrate in the nervous system and hormonal rhythms — the body's own cyclical systems. Watch for energy that swings between overdrive and collapse rather than settling into a sustainable rhythm, and hormonal patterns that mirror the highs and lows of external circumstance more than they should.`,
      positive: `You participate consciously in your own cycles now, and the wheel's turning stops feeling like something merely happening to you.`,
      negative: `The same rise-and-fall pattern keeps repeating, credited to luck or blamed on fate, with the actual mechanism underneath it still unexamined.`,
    },

    11: {
      heading: 'Justice — A Life of Verdicts Without Self-Examination',
      expressions: [
        `Holding a position of judgment — legal, social, or familial — and applying it unevenly.`,
        `Demanding fairness from others while exempting yourself from the same standard.`,
        `Punishing someone for a wrong you were also guilty of, just less visibly.`,
        `Being the one who decided what was fair without ever being genuinely examined yourself.`,
        `Using a reputation for honesty to avoid ever being questioned.`,
        `Condemning others for weaknesses you never turned the same clear gaze toward in yourself.`,
        `Accepting an unfair advantage and telling yourself it was deserved.`,
        `Enforcing rules rigidly while quietly bending them for people you favored.`,
      ],
      unfinished: `The thread here is judgment turned only outward — real discernment used to assess others while your own conduct stayed unexamined by the same standard. What was left unfinished is turning that same honest clarity on yourself, closing the gap between the fairness you demanded and the fairness you actually practiced.`,
      soulChose: `This life tends to put you in situations that mirror your own hidden inconsistencies back at you — encountering unfairness that feels strangely personal, or being held to standards you once quietly exempted yourself from. It's built to complete the audit you avoided the first time.`,
      showsUpToday: `You may notice a strong, almost physical sensitivity to unfairness in the world, paired with a blind spot about where you yourself might be operating by a different rule. There can be a pattern of relationships or situations that keep delivering exactly the kind of imbalance you're most sensitive to, functioning as a mirror rather than simply bad luck.`,
      health: `This tends to show up in the kidneys, adrenal glands, and lower back — the body's systems tied to balance and filtering. Watch for adrenal strain from chronic vigilance about fairness, kidney or lower-back tension, and a body that holds a kind of low-grade bracing against being caught out.`,
      positive: `You hold yourself to the same honest standard you hold others to now, and the imbalance you used to keep encountering has far less to mirror back.`,
      negative: `A double standard quietly persists — real fairness demanded of others, and a private exemption still granted to yourself.`,
    },

    12: {
      heading: 'The Hanged Man — A Life of Sacrifice Never Actually Chosen',
      expressions: [
        `Martyring yourself for a cause, family, or belief while resenting it privately the whole time.`,
        `Being suspended in an unresolved situation for so long it became your entire identity.`,
        `Sacrificing your own path for someone else's without them ever having asked you to.`,
        `Waiting for permission or the right moment so long that the moment quietly closed.`,
        `Performing surrender while secretly clinging to control.`,
        `Choosing a role of endurance because it earned attention you couldn't get any other way.`,
        `Staying in an unfinished, suspended chapter of life because leaving felt like defeat.`,
        `Framing your own indecision as spiritual patience rather than naming it as fear.`,
      ],
      unfinished: `What links these lives is sacrifice that was never genuinely chosen — suspension, waiting, or self-denial performed for its own sake or for attention rather than as a real, willing surrender. What was left unfinished is the difference between martyrdom and genuine release: giving something up because it's actually complete, not because it earns you a story.`,
      soulChose: `This life tends to include real periods of forced pause — circumstances that stop your forward motion whether you like it or not, specifically to teach the difference between suspension you resent and surrender you actually choose. It's built to complete a lesson in genuine, willing release.`,
      showsUpToday: `You may notice a pattern of staying in unresolved situations — jobs, relationships, projects — well past the point where the lesson has clearly been learned, waiting for a sign or a rescue that keeps not arriving. There can be a quiet resentment underneath apparent patience, and a tendency to frame ordinary waiting as noble sacrifice rather than simply naming what you actually want and moving toward it.`,
      health: `This tends to concentrate in the legs, feet, and circulatory system — the body's instruments of movement and flow. Watch for poor circulation, leg or foot issues tied to prolonged stagnancy, and a body that seems to physically resist forward motion even when you consciously want to move.`,
      positive: `Surrender now comes from genuine choice rather than resentment, and you know the difference between a real pause and a suspended life.`,
      negative: `Suspension keeps getting performed as sacrifice, while the resentment underneath it quietly accumulates and the actual release never arrives.`,
    },

    13: {
      heading: 'Transformation — A Life That Refused to End',
      expressions: [
        `Clinging to a role, identity, or way of life long after it had stopped serving anyone, including you.`,
        `Resisting a necessary ending so hard that it eventually came anyway, more violently than it needed to.`,
        `Destroying something that could have been transformed instead, out of fear or impatience.`,
        `Watching everyone around you change while you stayed rigidly the same.`,
        `Using your capacity for radical change to escape rather than to actually grow.`,
        `Fearing death, endings, or loss so completely that you avoided ever risking real change.`,
        `Forcing an ending onto someone or something before it was actually ready.`,
        `Repeating the same collapse-and-rebuild cycle without ever changing what fed it.`,
      ],
      unfinished: `The pattern across these lives is a broken relationship with endings — either refusing them so completely that change was forced on you violently, or forcing them prematurely out of fear or impatience. What was left unfinished is trusting the natural timing of transformation: letting something end exactly when it's actually complete, neither before nor after.`,
      soulChose: `This life tends to bring real, undeniable endings your way — situations that cannot be avoided, rushed, or clung to, that ask you to develop an honest relationship with completion. It's built to replace either extreme — clinging or forcing — with genuine discernment about timing.`,
      showsUpToday: `You may notice a pattern of holding on to relationships, jobs, or identities well past their natural expiration, or the opposite — abandoning things abruptly the moment they become uncomfortable, before they've actually run their course. There can be a deep, sometimes disproportionate fear around change, loss, or literal mortality that traces back further than any one event in this life would explain.`,
      health: `This tends to show up in the reproductive and elimination systems — the body's own processes of releasing what's no longer needed. Watch for digestive stagnancy, reproductive irregularities, and a body that seems to physically hold onto what it should be able to release.`,
      positive: `You can let something end exactly when it's actually complete now, without clinging to it or forcing it prematurely.`,
      negative: `Endings keep arriving too violently or too late, because the natural timing of transformation is still being resisted or rushed.`,
    },

    14: {
      heading: 'Temperance — A Life of Extremes That Never Found the Middle',
      expressions: [
        `Living entirely for indulgence in one life and entirely for austerity in another, never integrating either.`,
        `Swinging between excess and restriction so completely that moderation felt foreign.`,
        `Being the mediator for everyone else's conflict while your own inner life stayed unreconciled.`,
        `Choosing one extreme identity — the ascetic, the hedonist, the perfectionist — and never developing its opposite.`,
        `Avoiding real synthesis by picking a side and staying there permanently.`,
        `Burning out from excess, or starving from restriction, and calling either one balance.`,
        `Preaching moderation to others while privately unable to practice it yourself.`,
        `Treating every genuine feeling as something to be managed down to neutral rather than actually felt.`,
      ],
      unfinished: `What connects these lives is imbalance mistaken for identity — genuine extremes of discipline or indulgence lived out fully in one direction, without ever developing their integration. What was left unfinished is the harder, more patient work of actually blending opposites rather than simply alternating between or picking one.`,
      soulChose: `This life tends to place both extremes in your direct experience — periods of real excess and real restriction close enough together that the exhausting oscillation becomes impossible to ignore. It's built to move you from picking a side to genuinely synthesizing both.`,
      showsUpToday: `You may notice yourself swinging between periods of strict discipline and periods of full indulgence, each one framed as the correction for the other, without either ever settling into something sustainable. There can be a strong instinct to mediate or balance other people's conflicts while your own internal opposites — control and freedom, restraint and desire — remain quietly unreconciled.`,
      health: `This tends to concentrate in the endocrine and digestive systems — the body's own regulators of balance. Watch for blood sugar swings, hormonal fluctuation tied to oscillating habits, and digestive symptoms that flare during periods of extreme restriction or excess.`,
      positive: `Genuine integration replaces the old oscillation now, and a real, sustainable middle finally becomes available to you.`,
      negative: `Life keeps swinging between extremes, each one justified by the excess of the last, with the actual synthesis still out of reach.`,
    },

    15: {
      heading: 'The Devil — A Life Bound to What It Never Examined',
      expressions: [
        `Living in bondage to power, money, or pleasure, and mistaking the bondage for freedom.`,
        `Using control over others to manage your own unexamined fear.`,
        `Being enslaved to a compulsion — substance, control, status — that you never once looked directly at.`,
        `Holding real material power and using it to dominate rather than to build.`,
        `Being someone else's chain, controlling a person or situation through fear or dependency.`,
        `Choosing comfort and stimulation over freedom, again and again, and calling it a good life.`,
        `Projecting your own disowned desires onto others and then condemning them for it.`,
        `Telling yourself the compulsion was a choice, long after it had stopped being one.`,
      ],
      unfinished: `The thread through these lives is unexamined bondage — real compulsion or control, held onto or imposed on others, that was never actually looked at directly. What was left unfinished is turning toward the craving or the grip itself: naming what it's actually protecting you from, rather than staying chained to it, unconscious of the chain.`,
      soulChose: `This life tends to bring the compulsion or dynamic back around clearly enough to finally examine it — patterns of control, craving, or dependency that repeat with enough consistency to become undeniable. It's built to turn an unconscious chain into a conscious, examinable one.`,
      showsUpToday: `You may notice compulsive patterns — around control, substances, money, or a relationship dynamic — that you recognize intellectually but haven't yet looked at with real honesty. There can be a pattern of either being bound to someone else's control or quietly exercising control over someone who depends on you, in ways that mirror old material more than present choice.`,
      health: `This tends to show up in the reproductive and endocrine systems, and in patterns of addiction or compulsive behavior generally. Watch for hormonal imbalance, compulsive cycles around food, substances, or stimulation, and a body that carries shame in the pelvis and lower abdomen.`,
      positive: `The chains loosen because you can finally see them, and what was compulsive becomes something you actually choose or release.`,
      negative: `An unexamined bondage keeps running quietly in the background, controlling or being controlled without the honest look that would actually loosen it.`,
    },

    16: {
      heading: 'The Tower — A Life Built on a Foundation You Knew Was False',
      expressions: [
        `Maintaining an image, status, or structure you privately knew wasn't sound.`,
        `Ignoring clear warning signs because the collapse would have cost you too much to admit.`,
        `Building wealth, reputation, or relationships on a foundation of deception, including self-deception.`,
        `Watching something you built collapse and refusing to examine what had actually been unstable.`,
        `Choosing the comfort of denial over the disruption of an honest reckoning.`,
        `Surviving a collapse and rebuilding the exact same flawed structure rather than learning from it.`,
        `Being the only one who couldn't see what everyone around you already suspected was about to fall.`,
        `Punishing the messenger who tried to warn you rather than examining what they were warning you about.`,
      ],
      unfinished: `What connects these lives is a foundation that was known to be false and maintained anyway — structures, images, or beliefs propped up long after the cracks were visible, because facing them honestly cost too much. What was left unfinished is the willingness to let a false structure fall on your own terms, rather than waiting for it to be forced.`,
      soulChose: `This life tends to bring sudden, clarifying disruptions — moments that reveal what was actually unstable, whether or not you were ready. It's built to replace denial with honest reckoning, this time before the cost becomes unbearable.`,
      showsUpToday: `You may notice a pattern of sudden reversals — in health, finances, or relationships — that in hindsight had visible warning signs you'd been quietly avoiding. There can be a discomfort with instability that makes you cling to structures you already suspect are unsound, and a tendency toward denial that only breaks under real pressure rather than honest self-examination.`,
      health: `This tends to concentrate in the nervous system and adrenal function — the body's alarm systems. Watch for a startle response that's easily triggered, adrenal exhaustion from chronic low-grade bracing for collapse, and sudden physical symptoms that mirror the pattern of sudden external upheaval.`,
      positive: `You examine unstable structures honestly now, before the pressure forces the collapse, and what you rebuild actually holds.`,
      negative: `False foundations keep getting maintained through denial, and the reckoning keeps arriving suddenly instead of by honest choice.`,
    },

    17: {
      heading: 'The Star — A Life of Light Deliberately Dimmed',
      expressions: [
        `Having a genuine gift for hope, healing, or inspiration and keeping it hidden out of fear of exposure.`,
        `Being told your radiance was too much, and believing it.`,
        `Watching others struggle without offering the light you privately carried.`,
        `Trading visibility for safety, over and over, until dimming became automatic.`,
        `Achieving quiet brilliance that no one around you ever actually witnessed.`,
        `Being envied for a gift you never let yourself fully use.`,
        `Choosing invisibility as protection from a world that once punished your shine.`,
        `Reaching a point of real healing yourself and never turning to help the next person find it.`,
      ],
      unfinished: `The pattern across these lives is brilliance withheld — genuine light, hope, or healing capacity kept deliberately low, usually as protection against an old wound around being seen. What was left unfinished is the risk of shining without apology: letting the light actually reach people, even though some part of you still expects it to be dangerous.`,
      soulChose: `This life tends to keep offering you visibility — opportunities to be seen, to share your gift, to actually shine — testing whether the old instinct to dim will finally loosen. It's built to complete the debt of hidden light by asking you to offer it anyway.`,
      showsUpToday: `You may notice a persistent instinct to shrink right at the moment recognition becomes available, or a pattern of genuine talent that stays underdeveloped so it can never be fully judged. There can be a quiet grief about gifts you know you have and haven't yet let the world see, alongside real relief whenever visibility is declined rather than claimed.`,
      health: `This tends to show up in the eyes, skin, and nervous system — the body's own instruments of being seen and radiating outward. Watch for eye sensitivity, skin conditions that flare under real or perceived exposure, and a nervous system on alert specifically around visibility.`,
      positive: `Your light gets offered now instead of dimmed, and the world finally has something real to respond to.`,
      negative: `A gift stays deliberately low, and the old fear of being too visible keeps quietly winning out over the risk of actually shining.`,
    },

    18: {
      heading: 'The Moon — A Life Lost in Illusion It Never Questioned',
      expressions: [
        `Living inside a fantasy or self-deception so completely that it shaped every major decision.`,
        `Being deceived, or deceiving others, without ever tracing the pattern back to its source.`,
        `Trusting fear-based projection as though it were accurate perception.`,
        `Losing yourself in addiction, escapism, or a story about your life that wasn't actually true.`,
        `Being haunted by unprocessed grief or trauma that quietly ran every subsequent choice.`,
        `Mistaking anxiety for intuition, and following it into repeated harm.`,
        `Staying in a fog rather than asking the one direct question that would have cleared it.`,
        `Believing a story about yourself that everyone around you could see wasn't true.`,
      ],
      unfinished: `What links these lives is unexamined illusion — fear, fantasy, or unprocessed emotional material treated as reliable truth, shaping real decisions without ever being questioned. What was left unfinished is the discipline of checking the inner story against actual evidence, learning to tell real intuition from old, unresolved fear.`,
      soulChose: `This life tends to bring situations murky enough to require real discernment — ambiguous circumstances that can't be resolved by simply trusting the first feeling that arrives. It's built to develop the exact skill that was missing: separating accurate perception from projection.`,
      showsUpToday: `You may notice a pattern of anxious narratives that feel completely convincing in the moment and don't hold up under honest examination afterward. There can be a history of decisions made from fear disguised as intuition, and a recurring, unsettled sense that something beneath the surface hasn't been fully faced — because it hasn't.`,
      health: `This tends to concentrate in the lymphatic system, hormones, and sleep — the body's own cyclical, fluid, unconscious processes. Watch for disrupted sleep with vivid or anxious dreaming, lymphatic sluggishness, and hormonal patterns that swing with emotional undercurrent rather than physical cause.`,
      positive: `You can tell real intuition from old fear now, and the fog clears because you're finally willing to check the story against the evidence.`,
      negative: `Anxious projection keeps getting trusted as fact, and the same unexamined illusion keeps shaping decisions it has no business shaping.`,
    },

    19: {
      heading: 'The Sun — A Life of Performed Joy Over Real Feeling',
      expressions: [
        `Being the bright, reliable one for everyone else while your own inner life went unattended.`,
        `Performing happiness so consistently that you lost track of what you actually felt.`,
        `Being loved for your light and never finding out if you'd be loved without it.`,
        `Living a public life of apparent success while privately feeling hollow.`,
        `Using radiance to distract from grief, fear, or complexity you never let anyone see.`,
        `Believing your value was located entirely in how much brighter you made a room.`,
        `Never letting anyone see you on a genuinely bad day, so no one ever learned you'd survive one.`,
        `Confusing being needed for your warmth with being loved for who you actually were.`,
      ],
      unfinished: `The pattern here is vitality used as performance — genuine warmth and light deployed to manage how others saw you, at the cost of ever being fully known, difficulties included. What was left unfinished is letting your light include the whole of you, not just the easy, bright part.`,
      soulChose: `This life tends to bring people and situations that ask for the full range of you, not just the bright surface — relationships or circumstances where performing constant positivity genuinely stops working. It's built to let real vitality replace performed brightness.`,
      showsUpToday: `You may notice an instinct to manage your own difficulty so it doesn't disturb the people around you, staying "up" even when something in you genuinely isn't. There can be an exhausting gap between the version of you that shows up in public and the one that exists in private, and a quiet fear that people only want the bright version.`,
      health: `This tends to show up in the heart and circulatory system — the body's own center of warmth and vitality. Watch for cardiac stress under the effort of sustained performance, circulation issues tied to suppressed emotion, and a body that runs hot and depleted rather than genuinely warm and steady.`,
      positive: `Your light comes from genuine fullness now, and being fully known — difficulty included — stops feeling like a risk to your value.`,
      negative: `Brightness stays performed rather than lived, and the exhausting gap between the public and private self keeps quietly widening.`,
    },

    20: {
      heading: 'Judgement — A Life That Heard the Call and Didn\'t Rise',
      expressions: [
        `Recognizing clearly that a chapter of your life had ended and staying in it anyway.`,
        `Hearing an inner summons toward a fuller version of yourself and finding endless reasons to wait.`,
        `Living a smaller life than you were capable of, out of fear of what answering the call would cost.`,
        `Judging others harshly for changes you were too afraid to make yourself.`,
        `Postponing your own awakening until it was, in practical terms, too late.`,
        `Knowing exactly what needed to happen and building an elaborate case for delay instead.`,
        `Waiting for a sign that had, in truth, already arrived several times over.`,
        `Watching someone else answer the same call you'd been given first, and quietly resenting them for it.`,
      ],
      unfinished: `What connects these lives is a summons heard and not answered — real clarity about what needed to change, met with prolonged, sophisticated postponement rather than actual movement. What was left unfinished is the single decisive act of rising: not gathering more certainty, but actually standing up inside what you already knew.`,
      soulChose: `This life tends to deliver the summons again, often more insistently — moments of undeniable clarity about what needs to end or begin, arriving with less and less patience for delay. It's built to complete the one thing that was missing last time: the actual rising, not just the hearing.`,
      showsUpToday: `You may notice a pattern of knowing exactly what needs to happen in a situation and still finding reasons to wait — more research, more certainty, a better moment that never quite arrives. There can be a harsh judgment of other people's slowness to change that mirrors, uncomfortably, your own history of hearing the call and not rising.`,
      health: `This tends to concentrate in the lungs and throat — the body's instruments of the trumpet call and the voice that answers it. Watch for respiratory tightness during moments of avoided decision, throat tension tied to an unspoken "yes" you haven't said yet, and a body that seems to hold its breath waiting for you to actually move.`,
      positive: `You answer the call this time instead of endlessly preparing to, and the rising finally happens.`,
      negative: `The summons keeps arriving and getting quietly postponed, dressed up as diligence rather than named as delay.`,
    },

    21: {
      heading: 'The World — A Life That Never Let Itself Be Finished',
      expressions: [
        `Achieving real mastery and refusing to acknowledge it as complete.`,
        `Moving the finish line every time you got close to it.`,
        `Being unable to receive credit, celebration, or rest for something genuinely accomplished.`,
        `Sabotaging the final stage of a project, relationship, or goal right before its completion.`,
        `Living an entire life in "almost there" without ever letting "there" actually count.`,
        `Achieving worldly success and immediately discounting it as not enough.`,
        `Refusing to celebrate a genuine ending because celebrating it would mean admitting it was real.`,
        `Traveling the whole world and never once feeling like you'd actually arrived anywhere.`,
      ],
      unfinished: `The thread across these lives is completion refused — real accomplishment reached and then immediately relativized, delayed, or dismissed, so that arrival never actually got to happen. What was left unfinished is the simple, underrated act of letting something be done: received, celebrated, and closed.`,
      soulChose: `This life tends to bring you close enough to real completion, repeatedly, that the pattern of moving the finish line becomes impossible to ignore. It's built to let you finally practice the thing that was always missing — stopping at "done" instead of immediately reaching for "more."`,
      showsUpToday: `You may notice a pattern of nearly finishing things — projects, goals, even relationships reaching a natural resolution — and then quietly extending or complicating them right before the finish. There can be genuine difficulty receiving acknowledgment for something real you've accomplished, and a nagging sense that arrival is somehow dangerous or presumptuous.`,
      health: `This tends to show up throughout the whole system rather than one organ — a body that struggles to register "rest" even when objectively at rest. Watch for chronic low-grade tension that persists after achievement, sleep that doesn't fully restore, and a nervous system that stays braced for the next thing even mid-celebration.`,
      positive: `You can let something be genuinely finished now, and completion finally gets to land instead of immediately receding.`,
      negative: `The finish line keeps quietly moving, and real accomplishment never quite gets to count as arrival.`,
    },

    22: {
      heading: 'The Fool — A Life of Beginnings That Never Became Anything',
      expressions: [
        `Leaping into new paths, places, or identities so often that none of them had time to become real.`,
        `Using constant reinvention to avoid ever being known in one place, by one set of people.`,
        `Trusting blindly, without discernment, and being repeatedly harmed by it.`,
        `Starting over so many times that "starting over" became its own comfortable identity.`,
        `Avoiding the discomfort of staying, disguised as spontaneity or freedom.`,
        `Being everywhere and nowhere, known by many and truly known by no one.`,
        `Mistaking the absence of commitment for the presence of freedom.`,
        `Leaving every time something finally asked for real depth instead of easy charm.`,
      ],
      unfinished: `What connects these lives is beginning without staying — real openness and courage used to keep starting, never to actually commit through the harder, less exciting middle. What was left unfinished is trust extended through the whole arc: beginning, continuing, and completing, not just the electric first step.`,
      soulChose: `This life tends to hand you real chances to stay — relationships, paths, or commitments that keep presenting themselves specifically at the point where the old pattern would normally leap elsewhere. It's built to teach that trust includes the boring middle, not just the leap.`,
      showsUpToday: `You may notice a strong pull toward the next fresh start exactly when something requires you to stay and do the less exciting work of continuing. There can be a long list of promising beginnings — relationships, projects, places lived — with fewer things actually carried through to completion, and a discomfort with the specific vulnerability of being known over time rather than met freshly, again and again.`,
      health: `This tends to concentrate in the feet, ankles, and nervous system — the body's own instruments of leaping and landing. Watch for ankle or foot instability, a nervous system that reads ordinary stillness as a kind of threat, and restlessness that resists sustained rest even when genuinely needed.`,
      positive: `You commit through the whole arc now — beginning, continuing, and actually finishing — and your freshness becomes a choice rather than an escape.`,
      negative: `Beginnings keep multiplying while very little gets carried all the way through, and being known over time still feels riskier than starting again somewhere new.`,
    },

  };

  // ── NAMED KARMIC SEEDS ─────────────────────────────────────────────────────
  // Deeper bonus layer for the 5 named triplets already defined in
  // matrix-engine.js's KARMIC_TAIL_CODES, matched via
  // DMEngine.matchKarmicTailCode([D, thisValue, E]).

  const codes = {

    'The Wizard / Secret Knowledge': {
      heading: 'The Wizard — A Gift Kept Secret Instead of Shared',
      expressions: [
        `Holding rare, unusual, or forbidden knowledge and guarding it as personal power rather than offering it.`,
        `Being a healer or seer who worked in secret, afraid of exposure.`,
        `Using hidden ability to elevate yourself quietly rather than to genuinely help.`,
        `Being persecuted once for what you knew, and deciding permanent concealment was the only safety.`,
        `Possessing real magic — in the broad sense of unusual capability — and never letting anyone confirm it was real.`,
        `Passing knowledge only to a chosen few, keeping the rest of the world deliberately locked out.`,
        `Mistrusting institutions so deeply that you withheld your gift from anyone connected to them.`,
        `Dying with your most unusual, most useful knowledge never fully transmitted.`,
      ],
      unfinished: `This is one of the rarer, more specific karmic seeds — real, unusual capability that got protected through secrecy rather than offered through trust. What was left unfinished is believing that your particular knowledge is safe to share, that concealment was a survival strategy for a different era and doesn't have to be the permanent shape of this gift.`,
      soulChose: `This life tends to place real, direct pressure on the habit of secrecy — situations where hiding your unusual capability has a visible, felt cost, where people are genuinely asking for exactly what you'd normally protect. It's built to convert an old survival strategy into a chosen offering.`,
      showsUpToday: `You may notice unusual sensitivity, insight, or capability that you instinctively downplay or hide, even in contexts where sharing it would clearly help. There can be a specific wariness around exposure — of being too visible with an ability that feels, for reasons you can't always name, dangerous to reveal fully.`,
      health: `This tends to concentrate in the throat and the nervous system — the body's instruments of speaking the unusual thing out loud. Watch for a throat that tightens specifically around sharing what you actually know, and a nervous system that reads visibility itself as risk.`,
      positive: `Your unusual gift gets offered rather than protected now, and the old fear of exposure finally loosens its grip.`,
      negative: `Real capability stays concealed out of an old, once-necessary caution, and the specific gift this life gave you keeps waiting for permission to be seen.`,
    },

    'Wasted Talent': {
      heading: 'Wasted Talent — A Gift That Was Never Fully Used',
      expressions: [
        `Having exceptional ability in art, thought, or leadership and letting circumstance or fear keep it minor.`,
        `Being praised for potential your whole life and never converting it into a body of real work.`,
        `Choosing safety over the harder, more exposed path your actual talent required.`,
        `Watching people with less natural ability surpass you because they were willing to do the work you avoided.`,
        `Letting comfort, distraction, or self-doubt quietly consume a genuinely rare capacity.`,
        `Being the most gifted person in a room who never actually finished anything the room could see.`,
        `Regretting, at the end of that life, exactly how much was left on the table.`,
      ],
      unfinished: `This seed carries a specific grief: real, above-average capability that stayed unrealized — not through lack of recognition, but through a pattern of avoiding the exposure, discipline, or risk that developing it fully would have required. What was left unfinished is the willingness to actually be seen attempting your full capacity, including the real risk of falling short in public.`,
      soulChose: `This life tends to place your talent under real pressure to actually be used — opportunities, deadlines, or audiences that make continued avoidance visibly costly. It's built to close the specific gap between what you're capable of and what you've actually let yourself do.`,
      showsUpToday: `You may notice a persistent, quiet awareness of capability you haven't fully used — a talent you know is real, sitting mostly undeveloped, protected from the risk that developing it fully would require. There can be a pattern of near-misses: almost finishing, almost putting the work out, almost committing to the harder path your ability actually calls for.`,
      health: `This tends to show up in the hands, throat, or whatever part of the body is literally involved in expressing the specific talent — writer's hands, a singer's throat, a builder's back. Watch for tension or repetitive strain concentrated exactly where the unused gift would be expressed.`,
      positive: `Your actual capacity gets developed and offered now, and what was almost-realized finally becomes real.`,
      negative: `Genuine talent keeps staying minor, protected from the exposure that fully using it would require.`,
    },

    'The Prisoner': {
      heading: 'The Prisoner — A Life Confined by Circumstance or by Belief',
      expressions: [
        `Being literally imprisoned, enslaved, or confined against your will.`,
        `Living under a belief system so rigid it functioned as its own kind of prison.`,
        `Staying in a role, marriage, or location you experienced as inescapable.`,
        `Being blamed or punished for something you didn't do, and carrying the injustice silently.`,
        `Confining someone else — physically, financially, or emotionally — the way you once were confined.`,
        `Mistaking a self-built cage for permanent reality, and never testing whether the door was actually locked.`,
      ],
      unfinished: `This seed carries a theme of confinement — real or believed limitation so total it shaped every choice, whether imposed by others or eventually maintained by the psyche itself long after any external cage was gone. What was left unfinished is testing the actual boundary: discovering how much of the confinement is still real, and how much has become habit.`,
      soulChose: `This life tends to bring real choice-points that quietly test whether you still believe you're confined — chances to move, speak, or choose differently that go unnoticed if the old prisoner identity is still running. It's built to reveal how much freedom is actually already available.`,
      showsUpToday: `You may notice a persistent sense of limitation in some specific area of life — financial, relational, geographic — that doesn't fully match your actual current circumstances. There can be a slowness to test boundaries you assume are fixed, and an old, disproportionate relief whenever a restriction is confirmed rather than challenged.`,
      health: `This tends to concentrate in the joints and skeletal structure — the body's own architecture of movement and restriction. Watch for joint stiffness, a body that holds itself as though bound even at rest, and tension that eases noticeably whenever real freedom of choice is exercised.`,
      positive: `You test the actual boundary now instead of assuming it, and real freedom shows up where the old confinement used to be automatic.`,
      negative: `An old sense of confinement keeps outliving the circumstances that originally caused it, still shaping choices that are, in fact, already free.`,
    },

    'World of Passions / Temptation': {
      heading: 'World of Passions — A Life Ruled by Appetite',
      expressions: [
        `Living entirely for pleasure, status, or sensation without any deeper structure underneath it.`,
        `Being consumed by desire — for a person, a substance, a lifestyle — to the exclusion of everything else.`,
        `Using seduction or charm to get what you wanted without regard for who it cost.`,
        `Chasing intensity so consistently that ordinary life felt unbearable by comparison.`,
        `Being led entirely by appetite in decisions that needed discernment.`,
        `Losing something genuinely important — health, family, integrity — to an unexamined craving.`,
      ],
      unfinished: `This seed carries a life organized around appetite — real desire and sensory aliveness given free rein without the discernment to know when to say no. What was left unfinished is the harder integration: keeping the genuine aliveness of desire while developing the judgment that knows its actual cost.`,
      soulChose: `This life tends to bring real temptation directly into your path, repeatedly — not to torment you, but to give you the exact practice ground needed to develop discernment where there was once only appetite. It's built to teach choice, not deprivation.`,
      showsUpToday: `You may notice an unusually strong pull toward intensity, pleasure, or stimulation, alongside a real difficulty pausing before acting on it. There can be a pattern of decisions that felt irresistible in the moment and costly in hindsight, and a discomfort with the plainness of ordinary, unstimulated life.`,
      health: `This tends to show up in the reproductive system, liver, and metabolism — the body's own processors of appetite and excess. Watch for liver strain, metabolic swings tied to cycles of indulgence and restriction, and reproductive-hormonal patterns sensitive to periods of excess.`,
      positive: `Genuine aliveness and desire stay intact now, paired with real discernment about their actual cost.`,
      negative: `Appetite keeps running ahead of judgment, and what felt irresistible in the moment keeps costing more than it seemed to in advance.`,
    },

    'Betrayal of Family / Pride': {
      heading: 'Betrayal of Family — A Loyalty Broken by Pride',
      expressions: [
        `Turning your back on family, clan, or origin out of shame or ambition.`,
        `Betraying someone who trusted you completely, to protect your own status or pride.`,
        `Choosing personal advancement over a loyalty that was owed.`,
        `Being ashamed of where you came from and quietly erasing it.`,
        `Sacrificing a sibling, parent, or elder's wellbeing to preserve your own image.`,
        `Being unable to admit fault to family out of pride, even when it cost the relationship everything.`,
        `Achieving personal success built, in part, on someone else's unacknowledged sacrifice.`,
      ],
      unfinished: `This seed carries a specific wound: real loyalty broken, usually by pride or ambition, toward the people who had a legitimate claim on your care. What was left unfinished is humility toward origin — the willingness to honor where you came from and the people who mattered there, without needing it to cost you your own advancement.`,
      soulChose: `This life tends to bring family, lineage, or loyalty-based relationships back into sharp focus — situations that test whether pride or genuine care governs how you treat the people with a legitimate claim on you. It's built to repair the specific rupture between personal ambition and family loyalty.`,
      showsUpToday: `You may notice a complicated relationship with family or origin — pride that surfaces exactly where humility is called for, or a pattern of distancing from people who have a legitimate claim on your loyalty. There can be a difficulty admitting fault within family dynamics specifically, even when you can do so easily elsewhere.`,
      health: `This tends to concentrate in the heart and chest — the body's own center of loyalty and belonging. Watch for chest tightness during family conflict specifically, cardiac stress tied to pride-driven estrangement, and a body that carries family tension differently than any other kind.`,
      positive: `Loyalty and personal advancement stop being at odds now, and pride no longer costs you the people who actually matter.`,
      negative: `Pride keeps quietly winning out over loyalty in family contexts specifically, and the same old rupture keeps finding new occasions to repeat.`,
    },

  };

  function get(arcanaNum) {
    return nodes[arcanaNum] || null;
  }

  function getCode(codeName) {
    return codes[codeName] || null;
  }

  return { get, getCode };

})();
