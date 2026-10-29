import type { AnswerEntry, Question } from "./types.ts";
import { levenshtein, normalize } from "./text.ts";

export interface Match {
  entry: AnswerEntry;
  /** Matched by close spelling rather than exactly. */
  fuzzy: boolean;
}

export interface Suggestion {
  entry: AnswerEntry;
  /** The alias that matched, shown when it differs from the canonical name. */
  via: string;
  score: number;
}

export interface AnswerMatcher {
  readonly entries: readonly AnswerEntry[];
  match(text: string): Match | null;
  /** Key two answers share when they mean the same thing ("Holland" = "Netherlands"). */
  identity(text: string): string;
  suggest(text: string, limit?: number): Suggestion[];
}

export function parseAnswer(raw: string): AnswerEntry {
  const names = raw
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
  const aliases = names.map((n) => n.replace(/\*$/, ""));
  return {
    canonical: aliases[0] ?? "",
    aliases,
    keys: aliases.map(normalize),
    debatable: names.some((n) => n.endsWith("*")),
  };
}

// How many typos a confirmed match / a suggestion may contain, by input length.
const matchTolerance = (len: number) => (len <= 4 ? 0 : len <= 7 ? 1 : 2);
const suggestTolerance = (len: number) => (len < 3 ? 0 : Math.max(1, Math.floor(len / 3)));

export function createMatcher(rawAnswers: readonly string[]): AnswerMatcher {
  const entries = rawAnswers.map(parseAnswer);
  const exact = new Map<string, AnswerEntry>();
  for (const entry of entries) {
    for (const key of entry.keys) if (!exact.has(key)) exact.set(key, entry);
  }

  function match(text: string): Match | null {
    const t = normalize(text);
    if (!t) return null;
    const hit = exact.get(t);
    if (hit) return { entry: hit, fuzzy: false };

    let best: AnswerEntry | null = null;
    let bestDistance = Infinity;
    for (const entry of entries) {
      for (const key of entry.keys) {
        const d = levenshtein(t, key);
        if (d < bestDistance) {
          bestDistance = d;
          best = entry;
        }
      }
    }
    return best && bestDistance <= matchTolerance(t.length) ? { entry: best, fuzzy: true } : null;
  }

  function identity(text: string): string {
    const m = match(text);
    return m ? `answer:${m.entry.canonical}` : `text:${normalize(text)}`;
  }

  // Ranking: prefix (0) > contains (1) > misspelt prefix or whole word (2 + typos).
  function suggest(text: string, limit = 6): Suggestion[] {
    const t = normalize(text);
    if (!t) return [];
    const tolerance = suggestTolerance(t.length);
    const scored: Suggestion[] = [];
    for (const entry of entries) {
      let best = Infinity;
      let via = entry.canonical;
      entry.keys.forEach((key, i) => {
        let score = Infinity;
        if (key.startsWith(t)) score = 0;
        else if (key.includes(t)) score = 1;
        else {
          const d = Math.min(levenshtein(t, key.slice(0, t.length)), levenshtein(t, key));
          if (d <= tolerance) score = 2 + d;
        }
        if (score < best) {
          best = score;
          via = entry.aliases[i] ?? entry.canonical;
        }
      });
      if (best < Infinity) scored.push({ entry, via, score: best });
    }
    scored.sort((a, b) => a.score - b.score || a.entry.canonical.length - b.entry.canonical.length);
    const top = scored.slice(0, limit);
    const alreadyExact = top.length === 1 && normalize(top[0]!.entry.canonical) === t;
    return alreadyExact ? [] : top;
  }

  return { entries, match, identity, suggest };
}

const matchers = new WeakMap<Question, AnswerMatcher>();

/** Matchers are built once per question and reused across renders. */
export function matcherFor(question: Question): AnswerMatcher {
  let matcher = matchers.get(question);
  if (!matcher) {
    matcher = createMatcher(question.answers);
    matchers.set(question, matcher);
  }
  return matcher;
}

export function pickRandomAnswer(
  entries: readonly AnswerEntry[],
  random: () => number = Math.random,
): string | null {
  const pool = entries.filter((e) => !e.debatable);
  return pool.length ? pool[Math.floor(random() * pool.length)]!.canonical : null;
}
