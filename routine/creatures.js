'use strict';

/**
 * RITUAL — creature artwork.
 *
 * Four characters, one per domain, drawn as inline SVG in the same
 * technique as the landscape: hand-authored paths, no image assets, sharp
 * at any size. Each is built separately — different build, materials and
 * face — so they read as four characters rather than one body reskinned.
 *
 * Tier 1 is fully kitted. What escalates above it is the fire.
 */

window.RITUAL_CREATURES = (function () {

  const SHADOW = '<ellipse class="shadow" cx="50" cy="134" rx="26" ry="4.5"/>';
  const WARRIOR = `
  <!-- cape -->
  <path class="l1 ln" d="M26 66 Q10 96 16 126 Q32 118 36 92 Z"/>
  <path class="l1 ln" d="M74 66 Q90 96 84 126 Q68 118 64 92 Z"/>

  <!-- legs: greaves with knee plates -->
  <rect class="s2 ln" x="30" y="104" width="17" height="26" rx="5"/>
  <rect class="s2 ln" x="53" y="104" width="17" height="26" rx="5"/>
  <path class="s4 ln2" d="M31 112 L46 112 M54 112 L69 112"/>
  <path class="s5 ln" d="M30 110 L38 105 L46 110 Z"/>
  <path class="s5 ln" d="M53 110 L61 105 L69 110 Z"/>
  <rect class="s1 ln" x="28" y="124" width="21" height="8" rx="3"/>
  <rect class="s1 ln" x="51" y="124" width="21" height="8" rx="3"/>

  <!-- tassets -->
  <path class="s3 ln" d="M28 92 L45 92 L44 106 L29 106 Z"/>
  <path class="s3 ln" d="M55 92 L72 92 L71 106 L56 106 Z"/>

  <!-- breastplate: widest torso of the four -->
  <path class="s4 ln" d="M26 66 Q26 61 32 61 L68 61 Q74 61 74 66 L77 94 Q77 99 71 99 L29 99 Q23 99 23 94 Z"/>
  <path class="s5" d="M26 66 Q26 61 32 61 L40 61 L36 99 L29 99 Q23 99 23 94 Z"/>
  <path class="s2 ln2" d="M50 62 L50 99"/>
  <path class="s2 ln2" d="M30 70 Q50 75 70 70 M29 80 Q50 86 71 80"/>
  <path class="s5 ln2" d="M35 66 L35 88 M65 66 L65 88"/>
  <g class="s1" opacity=".6">
    <circle cx="38" cy="101" r="1.1"/><circle cx="44" cy="101" r="1.1"/><circle cx="50" cy="101" r="1.1"/>
    <circle cx="56" cy="101" r="1.1"/><circle cx="62" cy="101" r="1.1"/>
    <circle cx="41" cy="104" r="1.1"/><circle cx="47" cy="104" r="1.1"/>
    <circle cx="53" cy="104" r="1.1"/><circle cx="59" cy="104" r="1.1"/>
  </g>
  <path class="gd ln2" d="M50 68 L54 76 L50 84 L46 76 Z"/>
  <circle class="s6" cx="33" cy="72" r="1.8"/><circle class="s6" cx="67" cy="72" r="1.8"/>
  <circle class="s6" cx="33" cy="88" r="1.8"/><circle class="s6" cx="67" cy="88" r="1.8"/>
  <!-- belt -->
  <rect class="l2 ln" x="24" y="88" width="52" height="8" rx="2"/>
  <rect class="gd ln" x="44" y="86" width="12" height="12" rx="2"/>
  <!-- gorget -->
  <path class="s5 ln" d="M36 61 Q50 55 64 61 Q50 66 36 61 Z"/>

  <!-- spiked pauldrons -->
  <path class="s5 ln" d="M23 66 Q8 70 8 86 Q22 90 31 79 Z"/>
  <path class="s5 ln" d="M77 66 Q92 70 92 86 Q78 90 69 79 Z"/>
  
  <circle class="s6 ln2" cx="18" cy="78" r="2.4"/>
  <circle class="s6 ln2" cx="82" cy="78" r="2.4"/>

  <!-- greatsword, clearly held clear of the body -->
  <g class="weapon">
  <path class="s6 ln" d="M96 -14 L108 46 L84 46 Z"/>
  <path class="s4" d="M96 -8 L100 44 L96 44 Z"/>
  <rect class="gd ln" x="80" y="46" width="32" height="7" rx="2"/>
  <rect class="l2 ln" x="93" y="53" width="6" height="20" rx="2"/>
  <circle class="gd ln" cx="96" cy="75" r="4.5"/></g>

  <!-- gauntlets -->
  <circle class="s3 ln" cx="17" cy="92" r="9.5"/>
  <circle class="s3 ln" cx="83" cy="92" r="9.5"/>
  <path class="s5 ln2" d="M12 88 L22 88 M78 88 L88 88"/>

  <!-- horned helm -->
  <path class="s4 ln" d="M50 6 Q21 6 19 38 Q18 56 26 68 L74 68 Q82 56 81 38 Q79 6 50 6 Z"/>
  <path class="s5" d="M50 6 Q21 6 19 38 Q18.5 49 21 57 Q24 28 50 11 Z"/>
  <!-- ram horns: curl down and out, hugging the helm -->
  <path class="s6 ln" d="M22 30 Q2 26 0 44 Q4 58 16 56 Q8 50 10 40 Q13 32 24 36 Z"/>
  <path class="s6 ln" d="M78 30 Q98 26 100 44 Q96 58 84 56 Q92 50 90 40 Q87 32 76 36 Z"/>
  <!-- brow + crest ridge -->
  <path class="s6 ln" d="M50 2 Q44 8 43 18 Q50 12 57 18 Q56 8 50 2 Z"/>
  <path class="s2 ln2" d="M27 34 Q50 27 73 34"/>
  <!-- visor slit face -->
  <path class="void" d="M28 38 Q28 30 50 30 Q72 30 72 38 Q72 56 50 62 Q28 56 28 38 Z"/>
  <path class="eye" d="M35 40 L46 44 L43 50 L34 46 Z"/>
  <path class="eye" d="M65 40 L54 44 L57 50 L66 46 Z"/>
  <path class="s5 ln2" d="M42 56 L58 56"/>
`;
  const SCHOLAR = `
  <!-- robe: flares out, no separate legs -->
  <path class="s2 ln" d="M36 62 L64 62 Q72 62 74 74 L82 124 Q66 132 50 132 Q34 132 18 124 L26 74 Q28 62 36 62 Z"/>
  <path class="s3" d="M36 62 L46 62 L38 128 Q28 126 18 124 L26 74 Q28 62 36 62 Z"/>
  <!-- hem trim -->
  <path class="l2 ln" d="M19 120 Q50 130 81 120 L82 126 Q50 136 18 126 Z"/>
  <path class="em" d="M23 122 Q50 130 77 122 L77 125 Q50 132 23 125 Z"/>
  <!-- robe folds -->
  <path class="s1 ln2" d="M42 78 L38 122 M58 78 L62 122 M50 76 L50 124"/>
  <g class="em" opacity=".85">
    <path d="M33 112 L35 116 L33 120 L31 116 Z"/>
    <path d="M50 114 L52 118 L50 122 L48 118 Z"/>
    <path d="M67 112 L69 116 L67 120 L65 116 Z"/>
  </g>
  <path class="l3 ln2" d="M15 82 Q24 86 31 82 M69 82 Q76 86 85 82"/>
  <path class="l3 ln2" d="M60 96 L58 108"/>
  <circle class="gd ln2" cx="58" cy="111" r="3"/>

  <!-- sash + knot -->
  <path class="l3 ln" d="M25 84 Q50 92 75 84 L76 92 Q50 100 24 92 Z"/>
  <circle class="gd ln" cx="66" cy="90" r="4.5"/>
  <path class="l3 ln" d="M66 94 L62 112 L70 112 Z"/>

  <!-- collar / scarf -->
  <path class="l2 ln" d="M34 62 Q50 56 66 62 Q60 70 50 70 Q40 70 34 62 Z"/>

  <!-- wide sleeves -->
  <path class="s2 ln" d="M28 64 Q14 70 13 88 Q24 94 32 84 Z"/>
  <path class="s2 ln" d="M72 64 Q86 70 87 88 Q76 94 68 84 Z"/>

  <!-- book at the hip -->
  <rect class="l2 ln" x="16" y="92" width="16" height="20" rx="2"/>
  <rect class="em" x="18" y="95" width="12" height="3"/>
  <path class="s6 ln2" d="M24 92 L24 112"/>

  <!-- caged lantern on a staff -->
  <g class="weapon">
  <rect class="l3 ln" x="84" y="42" width="6" height="66" rx="3"/>
  <path class="s5 ln2" d="M87 42 Q87 30 93 27"/>
  <path class="gd ln" d="M80 4 L106 4 L104 11 L82 11 Z"/>
  <path class="s5 ln" d="M83 11 L103 11 L101 34 L85 34 Z"/>
  <ellipse class="em" cx="93" cy="23" rx="11" ry="13" opacity=".3"/>
  <ellipse class="eh" cx="93" cy="23" rx="6.5" ry="8.5"/>
  <path class="s6 ln2" d="M88 11 L88 34 M98 11 L98 34"/>
  <path class="gd ln" d="M83 34 L103 34 L101 40 L85 40 Z"/></g>

  <!-- hands -->
  <circle class="l2 ln" cx="18" cy="90" r="8.5"/>
  <circle class="l2 ln" cx="82" cy="90" r="8.5"/>

  <!-- tall brimmed pointed hat -->
  <path class="s2 ln" d="M50 20 Q30 22 29 42 Q28 58 34 68 L66 68 Q72 58 71 42 Q70 22 50 20 Z"/>
  <path class="s2 ln" d="M55 -24 Q38 6 28 30 Q50 40 73 28 Q64 4 55 -24 Z"/>
  <path class="s3" d="M55 -24 Q38 6 28 30 Q34 33 40 34 Z"/>
  <path class="l2 ln" d="M20 30 Q50 44 80 28 Q50 38 20 30 Z"/>
  <rect class="gd ln" x="44" y="27" width="11" height="7" rx="1.5"/>
  <circle class="eh" cx="55" cy="-24" r="3.6"/>

  <!-- face, deeper hood shadow -->
  <path class="void" d="M32 40 Q32 33 50 33 Q68 33 68 40 Q68 57 50 63 Q32 57 32 40 Z"/>
  <path class="eye" d="M38 43 L47 46.5 L44.5 52 L37 48.5 Z"/>
  <path class="eye" d="M62 43 L53 46.5 L55.5 52 L63 48.5 Z"/>
`;
  const KEEPER = `
  <!-- short cape -->
  <path class="l1 ln" d="M28 66 Q16 88 20 108 Q34 102 37 86 Z"/>
  <path class="l1 ln" d="M72 66 Q84 88 80 108 Q66 102 63 86 Z"/>

  <!-- legs + cuffed boots -->
  <rect class="l2 ln" x="31" y="104" width="16" height="20" rx="4"/>
  <rect class="l2 ln" x="53" y="104" width="16" height="20" rx="4"/>
  <rect class="l3 ln" x="28" y="120" width="22" height="12" rx="4"/>
  <rect class="l3 ln" x="50" y="120" width="22" height="12" rx="4"/>
  <path class="s1 ln2" d="M29 128 L49 128 M51 128 L71 128"/>

  <!-- tunic + vest -->
  <path class="s2 ln" d="M30 64 Q30 60 35 60 L65 60 Q70 60 70 64 L73 100 Q73 106 67 106 L33 106 Q27 106 27 100 Z"/>
  <path class="l2 ln" d="M32 62 L44 62 L40 104 L33 104 Q27 104 27 100 Z"/>
  <path class="l2 ln" d="M68 62 L56 62 L60 104 L67 104 Q73 104 73 100 Z"/>
  <!-- crossed straps -->
  <path class="l3 ln" d="M36 62 L66 96 L61 100 L31 66 Z"/>
  <circle class="gd ln2" cx="48" cy="80" r="3.2"/>

  <!-- belt + pouches -->
  <rect class="l3 ln" x="25" y="92" width="50" height="9" rx="2"/>
  <rect class="gd ln" x="45" y="90" width="11" height="13" rx="2"/>
  <circle class="gd ln2" cx="35" cy="96" r="3.2"/>
  <circle class="gd ln2" cx="64" cy="96" r="3.2"/>
  <path class="l1 ln2" d="M30 96 L70 96"/>
  <path class="l2 ln" d="M60 100 Q72 100 73 110 Q72 120 60 120 Q54 110 60 100 Z"/>
  <circle class="em" cx="66" cy="110" r="3.4"/>
  <path class="l2 ln" d="M28 100 Q38 100 39 108 Q38 117 28 117 Q23 108 28 100 Z"/>

  <!-- shoulder wraps -->
  <path class="l3 ln" d="M27 64 Q15 69 15 84 Q27 88 34 78 Z"/>
  <path class="l3 ln" d="M73 64 Q85 69 85 84 Q73 88 66 78 Z"/>

  <!-- balance scale, held clear -->
  <g class="weapon">
  <rect class="l3 ln" x="84" y="44" width="6" height="64" rx="3"/>
  <path class="s5 ln" d="M68 38 L106 38"/>
  <path class="s5 ln2" d="M72 38 L72 48 M102 38 L102 48"/>
  <path class="gd ln" d="M64 48 Q72 57 80 48 Z"/>
  <path class="gd ln" d="M94 48 Q102 57 110 48 Z"/>
  <circle class="eh" cx="87" cy="34" r="4.5"/>
  <circle class="em" cx="87" cy="34" r="8" opacity=".3"/></g>

  <!-- gloves -->
  <circle class="l2 ln" cx="17" cy="90" r="9"/>
  <circle class="l2 ln" cx="83" cy="90" r="9"/>

  <!-- head: low crown, very wide flat brim -->
  <path class="s2 ln" d="M50 16 Q31 18 30 42 Q29 58 35 68 L65 68 Q71 58 70 42 Q69 18 50 16 Z"/>
  <path class="l2 ln" d="M50 4 Q33 6 32 30 L68 30 Q67 6 50 4 Z"/>
  <path class="l3 ln" d="M-2 32 Q50 15 102 32 Q50 48 -2 32 Z"/>
  <path class="em" d="M33 29 Q50 24 67 29 Q50 34 33 29 Z"/>
  <circle class="gd ln2" cx="66" cy="29" r="3"/>
  <path class="em ln" d="M64 28 Q76 16 84 2 Q78 18 70 28 Z"/>

  <!-- face + bandana -->
  <path class="void" d="M33 36 Q33 30 50 30 Q67 30 67 36 Q67 54 50 60 Q33 54 33 36 Z"/>
  <path class="eye" d="M38 39 L47 42.5 L44.5 48 L37 44.5 Z"/>
  <path class="eye" d="M62 39 L53 42.5 L55.5 48 L63 44.5 Z"/>
  <path class="em ln" d="M35 50 Q50 46 65 50 Q64 60 50 64 Q36 60 35 50 Z"/>
  <path class="l1 ln2" d="M42 53 Q50 51 58 53"/>
`;
  const WANDERER = `
  <!-- long trailing cloak -->
  <path class="c1 ln" d="M26 64 Q6 96 12 130 Q32 122 36 90 Z"/>
  <path class="c1 ln" d="M74 64 Q94 96 88 130 Q68 122 64 90 Z"/>

  <!-- wrapped legs -->
  <rect class="s2 ln" x="32" y="104" width="15" height="22" rx="4"/>
  <rect class="s2 ln" x="53" y="104" width="15" height="22" rx="4"/>
  <path class="c3 ln2" d="M32 110 L46 110 M32 116 L46 116 M54 110 L68 110 M54 116 L68 116"/>
  <rect class="c2 ln" x="29" y="122" width="20" height="10" rx="4"/>
  <rect class="c2 ln" x="51" y="122" width="20" height="10" rx="4"/>

  <!-- layered poncho over robe -->
  <path class="s2 ln" d="M32 64 L68 64 Q73 64 73 70 L75 104 Q75 110 69 110 L31 110 Q25 110 25 104 L27 70 Q27 64 32 64 Z"/>
  <path class="s2 ln" d="M28 66 Q50 60 72 66 Q74 84 50 90 Q26 84 28 66 Z"/>
  <path class="s3" d="M28 66 Q40 62 50 62 L50 90 Q26 84 28 66 Z"/>
  <path class="s1 ln2" d="M50 62 L50 90"/>
  <!-- poncho fringe -->
  <path class="c3 ln2" d="M30 88 L29 96 M38 90 L37 98 M46 91 L45 99 M54 91 L55 99 M62 90 L63 98 M70 88 L71 96"/>

  <!-- rope belt -->
  <path class="c3 ln" d="M26 96 Q50 104 74 96 L75 102 Q50 110 25 102 Z"/>
  <path class="c3 ln" d="M46 104 L43 122 L52 122 L49 104 Z"/>

  <!-- satchel -->
  <path class="c2 ln" d="M14 86 Q30 84 32 96 Q30 110 14 108 Q10 96 14 86 Z"/>
  <path class="c3 ln" d="M14 90 Q23 88 30 90 L30 95 Q22 93 14 95 Z"/>
  <circle class="em" cx="22" cy="101" r="3"/>
  <g class="c3">
    <circle cx="40" cy="97" r="1.9"/><circle cx="46" cy="99" r="1.9"/>
    <circle cx="53" cy="99" r="1.9"/><circle cx="59" cy="97" r="1.9"/>
  </g>
  <path class="c3 ln2" d="M36 74 L44 74 L44 82 L36 82 Z"/>
  <path class="c3 ln2" d="M58 78 L66 78 L66 85 L58 85 Z"/>

  <!-- shoulders: soft cloth, no plate -->
  <path class="c2 ln" d="M27 64 Q16 70 17 86 Q29 89 35 79 Z"/>
  <path class="c2 ln" d="M73 64 Q84 70 83 86 Q71 89 65 79 Z"/>

  <!-- tall walking staff with wrapped grip -->
  <g class="weapon">
  <rect class="c3 ln" x="84" y="14" width="6" height="96" rx="3"/>
  <path class="c3 ln2" d="M84 52 L90 52 M84 58 L90 58 M84 64 L90 64"/>
  <circle class="eh" cx="87" cy="10" r="7"/>
  <circle class="em" cx="87" cy="10" r="11" opacity=".3"/>
  <path class="c2 ln" d="M87 18 Q97 24 95 34 Q87 30 85 24 Z"/></g>

  <!-- hands -->
  <circle class="c2 ln" cx="18" cy="90" r="8.5"/>
  <circle class="c2 ln" cx="82" cy="90" r="8.5"/>

  <!-- deep hood with long trailing wrap -->
  <path class="c3 ln" d="M50 8 Q24 12 22 42 Q21 60 29 70 L71 70 Q79 60 78 42
    Q77 24 66 14 Q80 -14 102 -18 Q80 -2 70 18 Q61 9 50 8 Z"/>
  <path class="s4" d="M50 8 Q24 12 22 42 Q21.5 52 25 61 Q28 30 50 13 Z" opacity=".5"/>
  <path class="l1 ln2" d="M26 34 Q50 26 74 34"/>
  <!-- scarf across the chest -->
  <path class="c3 ln" d="M34 66 Q50 58 66 66 Q58 74 50 74 Q42 74 34 66 Z"/>

  <!-- face, deepest shadow of the four -->
  <path class="void" d="M30 40 Q30 32 50 32 Q70 32 70 40 Q70 58 50 65 Q30 58 30 40 Z"/>
  <path class="eye" d="M37 43 L47 46.5 L44.5 52 L36 48.5 Z"/>
  <path class="eye" d="M63 43 L53 46.5 L55.5 52 L64 48.5 Z"/>
`;
  const ART = { body: WARRIOR, mind: SCHOLAR, money: KEEPER, meaning: WANDERER };
  function effects(stage) {
    const sparks = (pts) => pts.map(([x, y, r]) =>
      `<circle class="spark" cx="${x}" cy="${y}" r="${r}"/>`).join('');
  
    /* flames licking up off the shoulders and along the cloak */
    const shoulderFlames =
      '<path class="flame" d="M21 64 Q14 52 21 38 Q28 52 21 64 Z"/>' +
      '<path class="flame" d="M79 64 Q86 52 79 38 Q72 52 79 64 Z"/>';
    const cloakFlames =
      '<path class="flame" d="M17 116 Q11 104 17 92 Q23 104 17 116 Z"/>' +
      '<path class="flame" d="M83 116 Q89 104 83 92 Q77 104 83 116 Z"/>';
  
    /* a crown of fire, tallest in the middle */
    const crown =
      '<path class="flame" d="M50 -44 Q43 -30 50 -16 Q57 -30 50 -44 Z"/>' +
      '<path class="flame" d="M34 -34 Q29 -23 34 -12 Q39 -23 34 -34 Z"/>' +
      '<path class="flame" d="M66 -34 Q61 -23 66 -12 Q71 -23 66 -34 Z"/>' +
      '<path class="flame" d="M21 -20 Q17 -12 21 -4 Q25 -12 21 -20 Z"/>' +
      '<path class="flame" d="M79 -20 Q75 -12 79 -4 Q83 -12 79 -20 Z"/>';
  
    const cracks =
      '<path class="crack" d="M28 136 L36 131 L42 135"/>' +
      '<path class="crack" d="M58 135 L66 131 L74 136"/>' +
      '<path class="crack" d="M44 139 L50 134 L56 139"/>';
  
    if (stage === 1) return { behind: '', front: '' };
  
    if (stage === 2) return {
      behind: '<g class="aura-a"><ellipse cx="50" cy="74" rx="42" ry="52"/></g>',
      front: sparks([[12, 46, 2.2], [90, 60, 2], [20, 22, 1.7]]),
    };
  
    if (stage === 3) return {
      behind: '<g class="aura-a"><ellipse cx="50" cy="74" rx="50" ry="60"/></g>' +
              '<g class="pool"><ellipse cx="50" cy="133" rx="34" ry="6"/></g>' +
              '<circle class="ring" cx="50" cy="74" r="56"/>',
      front: shoulderFlames +
             sparks([[8, 44, 2.6], [94, 58, 2.2], [16, 20, 2], [88, 14, 1.8],
                     [6, 88, 1.9], [97, 94, 1.7]]),
    };
  
    /* wings of fire, unlocked only at the top tier */
    const wings =
      '<g class="wing">' +
      '<path d="M30 62 Q-2 44 -16 -4 Q8 20 24 28 Q2 4 -2 -30 Q22 8 36 32 Z"/>' +
      '<path d="M70 62 Q102 44 116 -4 Q92 20 76 28 Q98 4 102 -30 Q78 8 64 32 Z"/>' +
      '</g>';
  
    if (stage === 5) return {
      behind: wings +
              '<g class="aura-b"><ellipse cx="50" cy="66" rx="70" ry="84"/></g>' +
              '<g class="pool"><ellipse cx="50" cy="140" rx="46" ry="9"/></g>' +
              '<circle class="ring" cx="50" cy="74" r="62"/>' +
              '<circle class="ring r-b" cx="50" cy="74" r="78"/>' +
              '<circle class="ring r-b" cx="50" cy="74" r="90"/>',
      front: shoulderFlames + cloakFlames + crown + cracks +
             sparks([[0, 36, 3.2], [104, 50, 2.8], [6, 8, 2.5], [98, 2, 2.3],
                     [-4, 84, 2.4], [108, 90, 2.2], [12, 112, 2], [92, 120, 1.9],
                     [50, -60, 2.6], [30, -50, 2], [70, -50, 2]]),
    };
  
    /* level 25 — everything on */
    return {
      behind: '<g class="aura-b"><ellipse cx="50" cy="70" rx="62" ry="74"/></g>' +
              '<g class="pool"><ellipse cx="50" cy="133" rx="44" ry="10"/></g>' +
              '<circle class="ring" cx="50" cy="74" r="58"/>' +
              '<circle class="ring r-b" cx="50" cy="74" r="72"/>',
      front: shoulderFlames + cloakFlames + crown + cracks +
             sparks([[4, 40, 3], [100, 54, 2.6], [10, 14, 2.3], [94, 8, 2.1],
                     [2, 86, 2.2], [102, 92, 2], [16, 108, 1.9], [88, 116, 1.8],
                     [50, -54, 2.4]]),
    };
  }

  /**
   * Full markup for one creature at one tier. All tiers share the same
   * art; only the effect layers and the stage class differ.
   */
  function svg(domain, tier) {
    const fx = effects(tier);
    return '<svg class="crt st' + tier + '" viewBox="-22 -70 144 232" aria-hidden="true">' +
      fx.behind + SHADOW + '<g class="idle">' + (ART[domain] || '') + '</g>' + fx.front +
    '</svg>';
  }

  return { svg, ART };
})();
