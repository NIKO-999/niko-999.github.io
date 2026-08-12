#!/usr/bin/env python3
"""
Check interpretation content against the mechanical rules in
docs/GOLDEN-STANDARD*.md.

Reads either a JSON draft or a real content file:

    check.py --profile gene-keys draft.json
    check.py --profile gene-keys js/gk-vocation.js
    check.py --profile destiny-matrix draft.json
    check.py --profile generic  ../human-design-reading/content/cards/part1.json
    check.py --show 39 js/gk-*.js        # same key across spheres, to compare

Only the mechanical rules live here — sentence counts, banned vocabulary,
required phrases, duplicate openers. The rules that actually decide whether a
card is any good (distinct facets, the emotional arc, sentence rhythm, the
read-aloud test) need a human or a careful read; a clean run here means
nothing has obviously broken, not that the writing is finished.

Exit code is 1 if there are errors, 0 otherwise. Warnings never fail the run —
they mark places to look, and some of them are legitimately fine.
"""

import argparse
import glob
import json
import os
import re
import sys
from collections import defaultdict

# ── profiles ────────────────────────────────────────────────────────────────
# sentences: (min, max) per field. None = don't check.
# no_questions: '?' is a defect in this field.
# requires: substrings that must appear exactly once.
# ends_open_question: last sentence must be a question opening What/When/Where/If.

GENE_KEYS = {
    "name": "gene-keys",
    "spec": "docs/GOLDEN-STANDARD-PSYCH.md",
    "fields": {
        "wiring": {"sentences": (2, 4), "no_questions": True},
        "root": {"sentences": (2, 4), "no_questions": True},
        "defaultMode": {"sentences": (2, 4), "no_questions": True},
        "blindSpot": {"sentences": (2, 4), "no_questions": True},
        "underusedStrength": {"sentences": (2, 4), "no_questions": True},
    },
    "banned": {
        # the spiritual-arc vocabulary the psych reframe retired
        r"\bsiddhis?\b": "spiritual-arc vocabulary ('siddhi')",
        r"\btranscend": "spiritual-arc vocabulary ('transcend')",
        r"\benlighten": "spiritual-arc vocabulary ('enlighten')",
        r"\bsacred\b": "spiritual-arc vocabulary ('sacred')",
        r"\bawakening\b": "spiritual-arc vocabulary ('awakening')",
        r"\bthe gift of\b": "spiritual-arc vocabulary ('the gift of')",
        r"\bmastery\b": "'mastery' as an achieved state — retired for Gene Keys",
    },
    "expect_keys": [str(n) for n in range(1, 65)],
    "overlap_pairs": [("root", "defaultMode")],
}

DESTINY_MATRIX = {
    "name": "destiny-matrix",
    "spec": "docs/GOLDEN-STANDARD.md",
    "fields": {
        "title": {"sentences": None},
        "tagline": {"sentences": None, "words": (3, 6)},
        "mastery": {"sentences": (4, 6), "no_questions": True, "no_hedging": True},
        "shadow": {"sentences": (4, 6), "no_questions": True},
        "invitation": {
            "sentences": (4, 5),
            "requires": ["You are allowed to"],
            "ends_open_question": True,
        },
    },
    "banned": {},
    "expect_keys": None,
    "overlap_pairs": [("mastery", "shadow")],
}

GENERIC = {
    "name": "generic",
    "spec": "docs/GOLDEN-STANDARD-PART-2.md",
    "fields": {},           # any field, voice checks only
    "banned": {},
    "expect_keys": None,
    "overlap_pairs": [],
}

PROFILES = {p["name"]: p for p in (GENE_KEYS, DESTINY_MATRIX, GENERIC)}

# ── rules that apply to every field of every profile ────────────────────────

# The spec bans hedging the PERSON, not every modal verb. "a team can build
# from it" is ability and perfectly fine; "you can be quite driven" is the
# hedge it means. So the hard list only matches hedges attached to the reader
# or to a trait, and the loose modals are warnings for a human to judge.
HEDGES_HARD = [
    (r"\byou (may|might)\b", "hedged address ('you may/might')"),
    (r"\btends? to\b", "'tends to'"),
    (r"\b(can|may|might) (be|feel|find|seem|become)\b", "hedged trait ('can be', 'may feel')"),
]

HEDGES_SOFT = [
    (r"\bsometimes\b", "sometimes"),
    (r"\busually\b", "usually"),
    (r"\bperhaps\b", "perhaps"),
    (r"\bin some cases\b", "in some cases"),
]

# Third person about OTHER people in the reading is correct and required —
# "the people who trusted you" is exactly right. What the spec bans is
# describing the READER as a category instead of speaking to them.
THIRD_PERSON = [
    (r"\bthe user\b", "'the user'"),
    (r"\b(people|those|anyone|someone|a person|readers?)\s+"
     r"(who\s+(has|have|share|carry|carries)|with)\s+"
     r"(this|that|these|the same)\b", "the reader described as a category"),
    (r"\bpeople like you\b", "'people like you'"),
    (r"\b(this|that) (type|kind) of person\b", "'this type of person'"),
]

PREDICTION = [
    (r"\byou will (meet|find|receive|get|marry|earn)\b", "predictive claim"),
    (r"\bin (January|February|March|April|May|June|July|August|September"
     r"|October|November|December)\b", "a named month — reads as prediction"),
]

LIST_MARKERS = [
    (r"(?m)^\s*[-*•]\s+", "bullet marker"),
    (r"(?m)^\s*\d+[.)]\s+", "numbered list"),
    (r"(?m)^\s*#{1,6}\s+", "heading"),
]

# Fields that carry interpretation prose. Everything else in a block —
# blockId, center, gate, circuit, planet, reusedFrom — is metadata, and
# checking it as prose produces only noise.
PROSE_FIELDS = {"body", "label", "conscious", "unconscious",
                "title", "tagline", "heading", "why", "shadow", "path",
                "positive", "negative", "synthesis", "meaning", "invitation",
                "mastery", "wiring", "root", "defaultMode", "blindSpot",
                "underusedStrength"}

# Titles and taglines are labels, not address — they are exempt from the
# second-person and hedging rules that govern the prose fields.
TITLE_FIELDS = {"label", "title", "tagline", "heading"}

STOPWORDS = set("""a an the and or but so of to in on at by for with from as is are was were be been
being it its this that these those you your yours what when where if not no than then there here
have has had do does did which who whom while into onto over under about""".split())


class Report:
    def __init__(self):
        self.errors = []
        self.warnings = []
        self.notes = []

    def error(self, loc, msg):
        self.errors.append((loc, msg))

    def warn(self, loc, msg):
        self.warnings.append((loc, msg))

    def note(self, msg):
        self.notes.append(msg)


# ── loading ─────────────────────────────────────────────────────────────────

def load_gk_js(path):
    """Extract the JSON object out of a DGKRoles.register('x', {...}) file."""
    src = open(path, encoding="utf-8").read()
    m = re.search(r"DGKRoles\.register\(\s*'([A-Za-z]+)'\s*,\s*", src)
    if not m:
        raise ValueError("no DGKRoles.register() call found")
    start = src.index("{", m.end() - 1)
    end = src.rindex("}")
    return m.group(1), json.loads(src[start:end + 1])


def load_entries(path):
    """-> (label, {entry_key: {field: text}})

    Handles: gk-*.js role files, plain JSON drafts, and the human-design card
    decks (which nest blocks under one or more array keys).
    """
    if path.endswith(".js"):
        return load_gk_js(path)

    data = json.load(open(path, encoding="utf-8"))
    label = os.path.basename(path)

    # human-design shape: {"_note": ..., "blocks": [ {blockId, label, body} ]}
    arrays = {k: v for k, v in data.items()
              if isinstance(v, list) and v and isinstance(v[0], dict)}
    if arrays:
        entries = {}
        for group, blocks in arrays.items():
            for i, b in enumerate(blocks):
                key = b.get("blockId") or b.get("slotId") or f"{group}[{i}]"
                fields = {k: v for k, v in b.items()
                          if isinstance(v, str) and k in PROSE_FIELDS}
                # domains: {career: "...", money: "..."} — five lenses on one
                # mechanic, and the likeliest place for reworded duplicates.
                for dk, dv in (b.get("domains") or {}).items():
                    if isinstance(dv, str):
                        fields[f"domains.{dk}"] = dv
                    elif isinstance(dv, dict):
                        for sk, sv in dv.items():
                            if isinstance(sv, str):
                                fields[f"domains.{dk}.{sk}"] = sv
                entries[key] = fields
        return label, entries

    # plain draft: {"39": {field: text}}
    entries = {k: v for k, v in data.items()
               if isinstance(v, dict) and not k.startswith("_")}
    return label, entries


# ── text helpers ────────────────────────────────────────────────────────────

def sentences(text):
    parts = re.split(r"(?<=[.!?])[\"'”’]?\s+", text.strip())
    return [p for p in parts if p.strip()]


def opener(text, n=5):
    words = re.findall(r"[A-Za-z']+", text.lower())
    return " ".join(words[:n])


def content_words(text):
    return {w for w in re.findall(r"[a-z']+", text.lower())
            if w not in STOPWORDS and len(w) > 3}


def jaccard(a, b):
    if not a or not b:
        return 0.0
    return len(a & b) / len(a | b)


# ── checks ──────────────────────────────────────────────────────────────────

def check_entry(rep, label, key, entry, profile):
    spec_fields = profile["fields"]

    if spec_fields:
        for f in spec_fields:
            if f not in entry or not str(entry[f]).strip():
                rep.error(f"{label}:{key}", f"missing field '{f}'")
        for f in entry:
            if f not in spec_fields:
                rep.warn(f"{label}:{key}", f"unexpected field '{f}'")

    # Second person is a property of the card, not of every field. Root and
    # Origin fields legitimately run without it — "What got rewarded early was
    # X, so X became the default" is the spec's own example. What is never
    # acceptable is a whole entry that describes the reader instead of
    # speaking to them.
    joined = " ".join(v for f, v in entry.items()
                      if isinstance(v, str) and f not in TITLE_FIELDS)
    if joined.strip() and not re.search(r"\byou(r|rs|rself)?\b", joined, re.I):
        msg = ("entry never addresses the reader as 'you' — described, "
               "not spoken to")
        # The two written specs demand direct address outright. Generic mode
        # covers files with no spec of their own, some of which are
        # deliberately aphoristic fragments (the Human Design gate lines), so
        # there it is a flag to look at rather than a failure.
        if profile["name"] == "generic":
            rep.warn(f"{label}:{key}", msg)
        else:
            rep.error(f"{label}:{key}", msg)

    for field, text in entry.items():
        if not isinstance(text, str) or not text.strip():
            continue
        loc = f"{label}:{key}.{field}"
        rule = spec_fields.get(field, {})
        sents = sentences(text)

        rng = rule.get("sentences")
        if rng:
            lo, hi = rng
            if not (lo <= len(sents) <= hi):
                rep.error(loc, f"{len(sents)} sentences, spec says {lo}-{hi}")

        wrng = rule.get("words")
        if wrng:
            n = len(text.split())
            if not (wrng[0] <= n <= wrng[1]):
                rep.error(loc, f"{n} words, spec says {wrng[0]}-{wrng[1]}")

        # A title or tagline is a label. The voice rules below govern prose.
        if field in TITLE_FIELDS:
            continue

        for phrase in rule.get("requires", []):
            n = text.count(phrase)
            if n == 0:
                rep.error(loc, f"missing required phrase '{phrase}'")
            elif n > 1:
                rep.error(loc, f"'{phrase}' appears {n}x — spec says exactly once")

        if rule.get("ends_open_question"):
            last = sents[-1] if sents else ""
            if not last.rstrip().endswith("?"):
                rep.error(loc, "must end on an open question")
            elif not re.match(r"^[\"'“]?(What|When|Where|If)\b", last.strip()):
                rep.error(loc, "closing question must open with What/When/Where/If")

        if rule.get("no_questions") and "?" in text:
            rep.error(loc, "contains a question — not permitted in this field")

        # Hedging is banned outright in Gene Keys and in Destiny Matrix mastery.
        hedge_banned = profile["name"] == "gene-keys" or rule.get("no_hedging")
        for pat, word in HEDGES_HARD:
            if re.search(pat, text, re.I):
                if hedge_banned:
                    rep.error(loc, f"hedging: {word}")
                else:
                    rep.warn(loc, f"hedging: {word} — check it is the system "
                                  f"being hedged, not the person")
        for pat, word in HEDGES_SOFT:
            if re.search(pat, text, re.I):
                rep.warn(loc, f"'{word}' — qualifier the spec discourages; fine "
                              f"if it qualifies an action, not the reader")

        for pat, word in THIRD_PERSON:
            if re.search(pat, text, re.I):
                rep.error(loc, f"third-person address: '{word}'")

        for pat, why in PREDICTION:
            m = re.search(pat, text, re.I)
            if m:
                rep.error(loc, f"{why}: '{m.group(0)}'")

        for pat, what in LIST_MARKERS:
            if re.search(pat, text):
                rep.error(loc, f"{what} — interpretations are flowing prose")

        for pat, why in profile["banned"].items():
            m = re.search(pat, text, re.I)
            if m:
                rep.error(loc, f"{why}: '{m.group(0)}'")


def check_set(rep, label, entries, profile):
    """Rules that are properties of the whole set, not of one entry."""
    # Duplicate openers — the spec asks for this to be checked across the set.
    by_field = defaultdict(lambda: defaultdict(list))
    for key, entry in entries.items():
        for field, text in entry.items():
            if isinstance(text, str) and text.strip():
                by_field[field][opener(text)].append(key)

    for field, openers in by_field.items():
        for op, keys in sorted(openers.items()):
            if len(keys) > 1 and op:
                shown = ", ".join(keys[:6]) + ("…" if len(keys) > 6 else "")
                rep.error(f"{label}.{field}",
                          f"{len(keys)} entries open '{op}…' ({shown})")

    # Near-duplication between fields that must answer different questions.
    for a, b in profile["overlap_pairs"]:
        for key, entry in entries.items():
            ta, tb = entry.get(a), entry.get(b)
            if isinstance(ta, str) and isinstance(tb, str):
                score = jaccard(content_words(ta), content_words(tb))
                if score >= 0.42:
                    rep.warn(f"{label}:{key} ({int(score * 100)}%)",
                             f"'{a}' and '{b}' share heavy vocabulary — check "
                             f"they answer different questions")

    # Coverage.
    expect = profile["expect_keys"]
    if expect:
        missing = [k for k in expect if k not in entries]
        extra = [k for k in entries if k not in expect]
        if missing:
            rep.error(label, f"{len(missing)} missing entries: "
                             f"{', '.join(missing[:12])}"
                             f"{'…' if len(missing) > 12 else ''}")
        if extra:
            rep.warn(label, f"unexpected keys: {', '.join(sorted(extra)[:12])}")

    # Length spread — no rule, just the number you need to eyeball a deck whose
    # blocks are supposed to sit in one band.
    lens = [len(t) for e in entries.values() for t in e.values()
            if isinstance(t, str)]
    if lens:
        lens.sort()
        rep.note(f"{label}: {len(entries)} entries, body length "
                 f"min {lens[0]} / median {lens[len(lens) // 2]} / max {lens[-1]} chars")


# ── --show ──────────────────────────────────────────────────────────────────

def check_across_sets(rep, sets):
    """The position rule: the same key, written for a different position, must
    be written fresh — never reused or lightly reworded. This is the rule both
    specs stress hardest and the one that decays quietest, because each file
    looks fine on its own. Only visible when the files are read together."""
    by_key = defaultdict(list)          # key -> [(label, field, text)]
    for label, entries in sets:
        for key, entry in entries.items():
            for field, text in entry.items():
                if isinstance(text, str) and text.strip() and field not in TITLE_FIELDS:
                    by_key[key].append((label, field, text))

    for key, items in sorted(by_key.items()):
        for i in range(len(items)):
            la, fa, ta = items[i]
            for j in range(i + 1, len(items)):
                lb, fb, tb = items[j]
                if la == lb:
                    continue
                score = jaccard(content_words(ta), content_words(tb))
                where = f"key {key}: {la}.{fa} ↔ {lb}.{fb} ({int(score * 100)}%)"
                if score >= 0.55:
                    rep.error(where,
                              "same key reworded across positions rather than "
                              "written fresh for each lens")
                elif score >= 0.40:
                    rep.warn(where,
                             "high shared vocabulary — check these were "
                             "written independently")


def show_key(paths, key):
    """Print one key across several files — for the position-freshness check."""
    for path in paths:
        try:
            label, entries = load_entries(path)
        except Exception as exc:
            print(f"  ! {path}: {exc}", file=sys.stderr)
            continue
        entry = entries.get(str(key))
        if not entry:
            continue
        print(f"\n── {label} ─ key {key} " + "─" * 30)
        for field, text in entry.items():
            if isinstance(text, str):
                print(f"\n  [{field}]\n  {text}")
    print()


# ── main ────────────────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("targets", nargs="+", help="JSON drafts or content files")
    ap.add_argument("--profile", default="generic", choices=sorted(PROFILES),
                    help="which field shape and vocabulary rules to apply")
    ap.add_argument("--show", metavar="KEY",
                    help="print this key across all targets instead of checking")
    args = ap.parse_args()

    paths = []
    for t in args.targets:
        paths.extend(sorted(glob.glob(t)) if any(c in t for c in "*?[") else [t])

    if args.show:
        show_key(paths, args.show)
        return 0

    profile = PROFILES[args.profile]
    rep = Report()

    sets = []
    for path in paths:
        try:
            label, entries = load_entries(path)
        except Exception as exc:
            rep.error(path, f"could not read: {exc}")
            continue
        if not entries:
            rep.warn(path, "no entries found")
            continue
        for key, entry in entries.items():
            check_entry(rep, label, key, entry, profile)
        check_set(rep, label, entries, profile)
        sets.append((label, entries))

    if len(sets) > 1:
        check_across_sets(rep, sets)

    print(f"\nprofile: {profile['name']}   spec: {profile['spec']}")
    for n in rep.notes:
        print(f"  {n}")

    def dump(title, items):
        # A systematic defect produces the same message 60 times. Grouping
        # keeps that readable and makes the pattern the headline, which is
        # usually the actual finding.
        if not items:
            return
        print(f"\n{title} ({len(items)})")
        grouped = defaultdict(list)
        for loc, msg in items:
            grouped[msg].append(loc)
        for msg, locs in sorted(grouped.items(), key=lambda kv: -len(kv[1])):
            shown = ", ".join(locs[:5]) + (f" +{len(locs) - 5} more" if len(locs) > 5 else "")
            count = f" [{len(locs)}x]" if len(locs) > 1 else ""
            print(f"  {msg}{count}\n      {shown}")

    dump("ERRORS", rep.errors)
    dump("WARNINGS — judgement calls, not failures", rep.warnings)

    if not rep.errors and not rep.warnings:
        print("\nclean — mechanical rules pass. The read-aloud test is still yours.")
    else:
        print(f"\n{len(rep.errors)} errors, {len(rep.warnings)} warnings")

    return 1 if rep.errors else 0


if __name__ == "__main__":
    sys.exit(main())
