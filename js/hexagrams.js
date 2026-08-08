/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  THE 64 HEXAGRAMS — King Wen sequence
 * ═══════════════════════════════════════════════════════════════════════════
 *  Gene Key N is hexagram N of the I Ching in the King Wen sequence, so a key
 *  resolving into its six lines is real structure rather than ornament.
 *
 *  Each entry is six characters read BOTTOM LINE FIRST (the traditional
 *  reading order): '1' = yang, an unbroken line; '0' = yin, a broken line.
 *
 *  Self-check for the table's integrity: King Wen pairs every odd hexagram
 *  with the even one following it, and the pair is always either the vertical
 *  reversal of its partner or — where a figure reverses to itself — its
 *  complement. HEX_VALID below asserts exactly that across all 32 pairs, so a
 *  transcription slip in this table cannot pass silently.
 *
 *  API:
 *    DHexagrams.get(n)   -> '111111' (bottom line first) | null
 *    DHexagrams.lines(n) -> [1,1,1,1,1,1] bottom-first, or null
 *    DHexagrams.VALID    -> true when the King Wen pair structure holds
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function (root) {
  'use strict';

  const HEX = {
    1:  '111111', 2:  '000000', 3:  '100010', 4:  '010001',
    5:  '111010', 6:  '010111', 7:  '010000', 8:  '000010',
    9:  '111011', 10: '110111', 11: '111000', 12: '000111',
    13: '101111', 14: '111101', 15: '001000', 16: '000100',
    17: '100110', 18: '011001', 19: '110000', 20: '000011',
    21: '100101', 22: '101001', 23: '000001', 24: '100000',
    25: '100111', 26: '111001', 27: '100001', 28: '011110',
    29: '010010', 30: '101101', 31: '001110', 32: '011100',
    33: '001111', 34: '111100', 35: '000101', 36: '101000',
    37: '101011', 38: '110101', 39: '001010', 40: '010100',
    41: '110001', 42: '100011', 43: '111110', 44: '011111',
    45: '000110', 46: '011000', 47: '010110', 48: '011010',
    49: '101110', 50: '011101', 51: '100100', 52: '001001',
    53: '001011', 54: '110100', 55: '101100', 56: '001101',
    57: '011011', 58: '110110', 59: '010011', 60: '110010',
    61: '110011', 62: '001100', 63: '101010', 64: '010101',
  };

  // Structural validation — see header comment.
  const rev = s => s.split('').reverse().join('');
  const comp = s => s.split('').map(c => (c === '1' ? '0' : '1')).join('');
  let valid = true;
  for (let n = 1; n <= 63; n += 2) {
    const a = HEX[n], b = HEX[n + 1];
    if (!a || !b || a.length !== 6 || b.length !== 6) { valid = false; break; }
    const ok = (rev(a) === a) ? (comp(a) === b) : (rev(a) === b);
    if (!ok) { valid = false; break; }
  }

  const api = {
    get: n => HEX[n] || null,
    lines: n => (HEX[n] ? HEX[n].split('').map(Number) : null),
    VALID: valid,
    HEX,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.DHexagrams = api;
})(typeof window !== 'undefined' ? window : globalThis);
