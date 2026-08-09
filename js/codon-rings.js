/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  THE 21 CODON RINGS — derived, not transcribed
 * ═══════════════════════════════════════════════════════════════════════════
 *  The 64 hexagrams and the 64 DNA codons are the same combinatorial object:
 *  six binary lines read as three base-pairs. Group the keys by the amino acid
 *  their codon encodes and the 64 fall into 21 families — the Codon Rings.
 *
 *  This file DERIVES that partition from js/hexagrams.js and the standard
 *  genetic code rather than hardcoding a copied table, so a transcription slip
 *  is impossible by construction. The only free parameter is which two-bit
 *  pattern maps to which base; solving for it against the published rings
 *  leaves exactly one partition, and it is confirmed three ways:
 *
 *    · it reproduces every published anchor — Ring of Fire {1,14}, Ring of
 *      Water {2,8}, Ring of Life and Death {3,20,23,24,27,42};
 *    · the 21 group sizes match standard codon degeneracy exactly
 *      (two 1s, nine 2s, two 3s, five 4s, three 6s = 64);
 *    · it places Gene Key 41 alone on Methionine — and Methionine is the
 *      biological START codon, which is precisely what Key 41 is called in
 *      the Gene Keys wheel (see js/gene-keys.js, "the start codon of the
 *      yearly cycle"). Nothing in the derivation was told to do that.
 *
 *  Ring NAMES are the one thing not derivable — they are Richard Rudd's, not
 *  the genetic code's. A key whose ring has no name still gets its amino acid
 *  and its ring-mates, so a missing name degrades the label and nothing else.
 *
 *  API:
 *    DCodonRings.ringOf(n)  -> { amino, codon, name, keys } | null
 *    DCodonRings.RINGS      -> array of 21 rings
 *    DCodonRings.codonOf(n) -> 'GCA' | null
 *    DCodonRings.shared(ns) -> rings covering 2+ of the given keys
 *    DCodonRings.VALID      -> true when the partition holds
 *    DCodonRings.WARNINGS   -> non-fatal checks that did not hold
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function (root) {
  'use strict';

  const HEXAPI = root.DHexagrams || (typeof require === 'function' ? require('./hexagrams.js') : null);
  const HEX = HEXAPI ? HEXAPI.HEX : null;

  // The standard genetic code. 64 codons -> 20 amino acids + Stop.
  const CODE = {
    TTT: 'Phe', TTC: 'Phe', TTA: 'Leu', TTG: 'Leu', CTT: 'Leu', CTC: 'Leu',
    CTA: 'Leu', CTG: 'Leu', ATT: 'Ile', ATC: 'Ile', ATA: 'Ile', ATG: 'Met',
    GTT: 'Val', GTC: 'Val', GTA: 'Val', GTG: 'Val', TCT: 'Ser', TCC: 'Ser',
    TCA: 'Ser', TCG: 'Ser', CCT: 'Pro', CCC: 'Pro', CCA: 'Pro', CCG: 'Pro',
    ACT: 'Thr', ACC: 'Thr', ACA: 'Thr', ACG: 'Thr', GCT: 'Ala', GCC: 'Ala',
    GCA: 'Ala', GCG: 'Ala', TAT: 'Tyr', TAC: 'Tyr', TAA: 'Stop', TAG: 'Stop',
    CAT: 'His', CAC: 'His', CAA: 'Gln', CAG: 'Gln', AAT: 'Asn', AAC: 'Asn',
    AAA: 'Lys', AAG: 'Lys', GAT: 'Asp', GAC: 'Asp', GAA: 'Glu', GAG: 'Glu',
    TGT: 'Cys', TGC: 'Cys', TGA: 'Stop', TGG: 'Trp', CGT: 'Arg', CGC: 'Arg',
    CGA: 'Arg', CGG: 'Arg', AGT: 'Ser', AGC: 'Ser', AGA: 'Arg', AGG: 'Arg',
    GGT: 'Gly', GGC: 'Gly', GGA: 'Gly', GGG: 'Gly',
  };

  // Lines are read bottom-first (as hexagrams.js stores them) in pairs. Within
  // a pair the LOWER line is the high bit: BASE[2*lower + upper]. This is the
  // one free parameter in the whole derivation, and it is pinned by the anchor
  // checks below — get it wrong and the partition is still a valid partition,
  // just not the published one, which is why the anchors do the real work.
  const BASE = ['T', 'G', 'C', 'A'];

  function codonFor(n) {
    const L = HEX && HEX[n];
    if (!L) return null;
    let out = '';
    for (let i = 0; i < 6; i += 2) out += BASE[2 * Number(L[i]) + Number(L[i + 1])];
    return out;
  }

  // Rudd's names for the amino-acid families. Membership above is derived; only
  // these labels are transcribed, and an absent one is a display fallback.
  const NAMES = {
    Lys: 'The Ring of Fire',            Phe: 'The Ring of Water',
    Leu: 'The Ring of Life and Death',  Arg: 'The Ring of Humanity',
    Ser: 'The Ring of Seeking',         Ala: 'The Ring of Matter',
    Val: 'The Ring of Union',           Thr: 'The Ring of Light',
    Gly: 'The Ring of Gaia',            Pro: 'The Ring of Trials',
    Stop: 'The Ring of Purification',   Ile: 'The Ring of Destiny',
    Gln: 'The Ring of Alchemy',         Cys: 'The Ring of Prosperity',
    Asp: 'The Ring of the Whirlwind',   Tyr: 'The Ring of Illuminati',
    Asn: 'The Ring of No Return',       Glu: 'The Ring of Divinity',
    His: 'The Ring of Secrets',         Trp: 'The Ring of Miracles',
    Met: 'The Ring of Origin',
  };

  const byAmino = Object.create(null);
  const CODON_OF = Object.create(null);
  for (let n = 1; n <= 64; n++) {
    const codon = codonFor(n);
    if (!codon) continue;
    CODON_OF[n] = codon;
    const amino = CODE[codon];
    (byAmino[amino] = byAmino[amino] || []).push(n);
  }

  const RINGS = Object.keys(byAmino).map(amino => ({
    amino,
    name: NAMES[amino] || ('The ' + amino + ' Ring'),
    keys: byAmino[amino].slice().sort((a, b) => a - b),
  }));
  RINGS.sort((a, b) => b.keys.length - a.keys.length || a.keys[0] - b.keys[0]);

  const RING_OF = Object.create(null);
  RINGS.forEach(r => r.keys.forEach(k => { RING_OF[k] = r; }));

  /* ── validation ─────────────────────────────────────────────────────────
     Hard: the rings must partition 1..64 exactly once, in 21 groups.
     Soft: degeneracy sizes and the published anchors. A soft failure is
     recorded and surfaced, but never blocks the page.                     */
  const WARNINGS = [];
  const all = RINGS.reduce((a, r) => a.concat(r.keys), []).sort((a, b) => a - b);
  let VALID = RINGS.length === 21 && all.length === 64 &&
              all.every((v, i) => v === i + 1);

  const sizes = RINGS.map(r => r.keys.length).sort((a, b) => a - b).join(',');
  if (sizes !== '1,1,2,2,2,2,2,2,2,2,2,3,3,4,4,4,4,4,6,6,6') WARNINGS.push('degeneracy:' + sizes);

  const ANCHORS = [
    ['The Ring of Fire', [1, 14]],
    ['The Ring of Water', [2, 8]],
    ['The Ring of Life and Death', [3, 20, 23, 24, 27, 42]],
  ];
  ANCHORS.forEach(([name, keys]) => {
    const r = RING_OF[keys[0]];
    const ok = r && r.name === name && r.keys.length === keys.length &&
               keys.every(k => r.keys.indexOf(k) !== -1);
    if (!ok) WARNINGS.push('anchor:' + name);
  });

  // Methionine is the biological start codon and Key 41 opens the wheel. If
  // this ever stops holding, the bit->base mapping has been changed.
  if (!(RING_OF[41] && RING_OF[41].amino === 'Met' && RING_OF[41].keys.length === 1)) {
    WARNINGS.push('start-codon:41');
  }

  const api = {
    RINGS,
    VALID,
    WARNINGS,
    ringOf: n => RING_OF[n] || null,
    codonOf: n => CODON_OF[n] || null,
    // rings that cover two or more of the given keys — the cross-links inside
    // one profile, which is the whole point of showing rings at all
    shared(keys) {
      const seen = new Map();
      (keys || []).forEach(k => {
        const r = RING_OF[k];
        if (!r) return;
        if (!seen.has(r)) seen.set(r, []);
        if (seen.get(r).indexOf(k) === -1) seen.get(r).push(k);
      });
      return [...seen.entries()]
        .filter(([, ks]) => ks.length > 1)
        .map(([r, ks]) => ({ ring: r, keys: ks.sort((a, b) => a - b) }));
    },
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.DCodonRings = api;
})(typeof window !== 'undefined' ? window : globalThis);
