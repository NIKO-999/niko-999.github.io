/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  GENE KEYS — SHADOW SUB-STATES (Repressive / Reactive / Dilemma / Victim)
 * ═══════════════════════════════════════════════════════════════════════════
 *  Every Shadow splits into two directions of expression — turned inward
 *  (Repressive) or turned outward (Reactive) — plus the core Dilemma the
 *  shadow poses and the identification pattern it produces (Victim State).
 *  Sourced from the published Gene Keys Completion Sheet and cross-checked
 *  against js/gene-keys.js's shadow/gift/siddhi words (same 64 keys, same
 *  source lineage) — every key here already agrees with that table.
 *
 *  API:
 *    DGKShadowStates.get(keyNum) -> { repressive, reactive, dilemma, victim } | null
 * ═══════════════════════════════════════════════════════════════════════════
 */

window.DGKShadowStates = (function () {
  'use strict';

  const S = {
    1:  { repressive: 'Depressive',      reactive: 'Frenetic',        dilemma: 'Numbness',      victim: 'Numbness' },
    2:  { repressive: 'Lost',            reactive: 'Regimented',      dilemma: 'Agenda',         victim: 'External Circumstances' },
    3:  { repressive: 'Anal',            reactive: 'Disordered',      dilemma: 'Clinging',       victim: 'Chaotic Mind' },
    4:  { repressive: 'Apathetic',       reactive: 'Nit-Picking',     dilemma: 'Reasons',        victim: 'Need for Answers' },
    5:  { repressive: 'Pessimistic',     reactive: 'Pushy',           dilemma: 'Surrender',      victim: 'Impatience' },
    6:  { repressive: 'Over-Attentive',  reactive: 'Tactless',        dilemma: 'Protection',     victim: 'Emotions' },
    7:  { repressive: 'Hidden',          reactive: 'Dictatorial',     dilemma: 'Boundaries',     victim: 'Jealousy' },
    8:  { repressive: 'Wooden',          reactive: 'Artificial',      dilemma: 'Imitation',      victim: 'The Mundane' },
    9:  { repressive: 'Reluctant',       reactive: 'Diverted',        dilemma: 'Perspective',    victim: 'Details' },
    10: { repressive: 'Self-Denying',    reactive: 'Narcissistic',    dilemma: 'Tightness',      victim: 'Self-Obsession' },
    11: { repressive: 'Fantasising',     reactive: 'Deluded',         dilemma: 'Belief',         victim: 'Beliefs' },
    12: { repressive: 'Elitist',         reactive: 'Malicious',       dilemma: 'Aloneness',      victim: 'Need for Perfection' },
    13: { repressive: 'Permissive',      reactive: 'Narrow-Minded',   dilemma: 'Pessimism',      victim: 'Pessimistic Mind' },
    14: { repressive: 'Impotent',        reactive: 'Enslaved',        dilemma: 'Self-Belief',    victim: 'Impotent Mindset' },
    15: { repressive: 'Empty',           reactive: 'Extremist',       dilemma: 'Comfort',        victim: 'Narrow-Mindedness' },
    16: { repressive: 'Gullible',        reactive: 'Self-Deluded',    dilemma: 'Laziness',       victim: 'Techniques' },
    17: { repressive: 'Self-Critical',   reactive: 'Opinionated',     dilemma: 'Politics',       victim: 'Opinions' },
    18: { repressive: 'Inferiority',     reactive: 'Superiority',     dilemma: 'Flaws',          victim: 'Judgements' },
    19: { repressive: 'Needy',           reactive: 'Isolated',        dilemma: 'Nonconformity',  victim: 'Over-Sensitivity' },
    20: { repressive: 'Absent',          reactive: 'Hectic',          dilemma: 'Consideration',  victim: 'Insecurity' },
    21: { repressive: 'Submissive',      reactive: 'Controlling',     dilemma: 'Discipline',     victim: 'Need to be in Control' },
    22: { repressive: 'Proper',          reactive: 'Inappropriate',   dilemma: 'Accountability', victim: "Other's Ungracious Behaviour" },
    23: { repressive: 'Dumb',            reactive: 'Fragmented',      dilemma: 'Timing',         victim: 'Complexity' },
    24: { repressive: 'Frozen',          reactive: 'Anxious',         dilemma: 'Gravity',        victim: 'Addictive Tendencies' },
    25: { repressive: 'Ignorant',        reactive: 'Cold',            dilemma: 'Anxiety',        victim: 'Constrictive Breathing' },
    26: { repressive: 'Manipulative',    reactive: 'Boastful',        dilemma: 'Lack',           victim: 'Egotism or Lack of Grit' },
    27: { repressive: 'Self-Sacrificing',reactive: 'Self-Centered',   dilemma: 'Consideration',  victim: 'Self-Sacrifice' },
    28: { repressive: 'Hollow',          reactive: 'Gambling',        dilemma: 'Avoidance',      victim: 'Fear of Letting Go' },
    29: { repressive: 'Over-Committing', reactive: 'Unreliable',      dilemma: 'Postponement',   victim: 'Commitments, or Lack of' },
    30: { repressive: 'Over-Serious',    reactive: 'Flippant',        dilemma: 'Temptation',     victim: 'Desires' },
    31: { repressive: 'Deferring',       reactive: 'Scornful',        dilemma: 'Choice',         victim: 'Need to be Heard' },
    32: { repressive: 'Rigid Thinking',  reactive: 'Disjointed',      dilemma: 'Panic',          victim: 'Your Idea of Success' },
    33: { repressive: 'Reserved',        reactive: 'Censorious',      dilemma: 'Attention',      victim: 'Memories' },
    34: { repressive: 'Self-Effacing',   reactive: 'Bullish',         dilemma: 'Trying',         victim: 'Your Physicality' },
    35: { repressive: 'Bored',           reactive: 'Manic',           dilemma: 'Self Indulgence',victim: 'The Need for Change' },
    36: { repressive: 'Nervousness',     reactive: 'Crisis Prone',    dilemma: 'Overwhelm',      victim: 'Vulnerability' },
    37: { repressive: 'Over-Sentimental',reactive: 'Cruel',           dilemma: 'Submission',     victim: 'Your Gender Identity' },
    38: { repressive: 'Defeatist',       reactive: 'Aggressive',      dilemma: 'Habit',          victim: 'Your Belief in Struggle' },
    39: { repressive: 'Trapped',         reactive: 'Provocative',     dilemma: 'Blockages',      victim: 'Your Moods' },
    40: { repressive: 'Acquiescent',     reactive: 'Contemptuous',    dilemma: 'Excess',         victim: 'Fatigue' },
    41: { repressive: 'Dreamy',          reactive: 'Hyperactive',     dilemma: 'Planning',       victim: 'Your Dreams' },
    42: { repressive: 'Grasping',        reactive: 'Flaky',           dilemma: 'Disappointment', victim: 'Your Expectations' },
    43: { repressive: 'Worried',         reactive: 'Noisy',           dilemma: 'Knowing',        victim: 'Needing to be Right' },
    44: { repressive: 'Distrustful',     reactive: 'Misjudging',      dilemma: 'Hierarchy',      victim: 'Isolation' },
    45: { repressive: 'Timid',           reactive: 'Pompous',         dilemma: 'Insecurity',     victim: 'Scarcity Mindset' },
    46: { repressive: 'Frigid',          reactive: 'Frivolous',       dilemma: 'Fortune',        victim: 'Over-Seriousness' },
    47: { repressive: 'Hopeless',        reactive: 'Dogmatic',        dilemma: 'Ownership',      victim: 'Unresolved Past' },
    48: { repressive: 'Bland',           reactive: 'Unscrupulous',    dilemma: 'Not-Knowing',    victim: 'Inadequacy' },
    49: { repressive: 'Inert',           reactive: 'Rejecting',       dilemma: 'Needs',          victim: 'Emotional Reactions' },
    50: { repressive: 'Overloaded',      reactive: 'Irresponsible',   dilemma: 'Resignation',    victim: 'Chaotic Surroundings' },
    51: { repressive: 'Cowardly',        reactive: 'Hostile',         dilemma: 'Harshness',      victim: 'Anxiety' },
    52: { repressive: 'Stuck',           reactive: 'Restless',        dilemma: 'Shallow',        victim: 'Stress' },
    53: { repressive: 'Solemn',          reactive: 'Fickle',          dilemma: 'Restlessness',   victim: 'Inability to Complete' },
    54: { repressive: 'Un-Ambitious',    reactive: 'Greedy',          dilemma: 'Egotism',        victim: 'Drive, or lack of Drive' },
    55: { repressive: 'Complaining',     reactive: 'Blaming',         dilemma: 'External Validation', victim: 'Drama' },
    56: { repressive: 'Sullen',          reactive: 'Overstimulated',  dilemma: 'Pleasure/Pain',  victim: 'Distractions' },
    57: { repressive: 'Hesitant',        reactive: 'Impetuous',       dilemma: 'Trust',          victim: 'Indecision' },
    58: { repressive: 'None',            reactive: 'Interfering',     dilemma: 'Rhythm',         victim: 'Ingratitude' },
    59: { repressive: 'Excluded',        reactive: 'Intrusive',       dilemma: 'Emotional Processing', victim: 'Relationships' },
    60: { repressive: 'Unstructured',    reactive: 'Rigid',           dilemma: 'Balance',        victim: 'Structures' },
    61: { repressive: 'Disenchanted',    reactive: 'Fanatical',       dilemma: 'Knowledge',      victim: 'Obsessive Mind' },
    62: { repressive: 'Obsessive',       reactive: 'Pedantic',        dilemma: 'Facts',          victim: 'Language' },
    63: { repressive: 'Self-Doubt',      reactive: 'Suspicion',       dilemma: 'Logic',          victim: 'Doubts' },
    64: { repressive: 'Imitating',       reactive: 'Confused',        dilemma: 'Consistency',    victim: 'Confusion' },
  };

  return {
    get(n) { return S[n] || null; },
  };
})();
