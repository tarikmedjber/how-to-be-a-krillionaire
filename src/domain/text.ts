/**
 * Reduce an answer to a comparable key: case, accents, punctuation, a leading
 * "the" and "St."/"Saint" differences are ignored. `+` and `#` survive so that
 * C, C++ and C# stay distinct.
 */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/^\s*the\s+/, "")
    .replace(/\bst\.?\s/g, "saint ")
    .replace(/[^a-z0-9+#]/g, "");
}

/** Letters only, for length / letter-pattern rules ("4 letters or fewer"). */
export function lettersOnly(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z]/g, "");
}

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length || !b.length) return a.length || b.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j]! + 1, cur[j - 1]! + 1, prev[j - 1]! + cost);
    }
    prev = cur;
  }
  return prev[b.length]!;
}
