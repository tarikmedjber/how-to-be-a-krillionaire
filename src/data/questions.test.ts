import { createMatcher } from "../domain/answers.ts";
import { BASE_QUESTIONS, BUILT_IN_QUESTIONS } from "./index.ts";

describe("question bank", () => {
  it("has every hand-written question plus its derived variations", () => {
    expect(BASE_QUESTIONS).toHaveLength(170);
    expect(BUILT_IN_QUESTIONS).toHaveLength(275);
  });

  it("has unique prompts and ids", () => {
    expect(new Set(BUILT_IN_QUESTIONS.map((q) => q.prompt)).size).toBe(BUILT_IN_QUESTIONS.length);
    expect(new Set(BUILT_IN_QUESTIONS.map((q) => q.id)).size).toBe(BUILT_IN_QUESTIONS.length);
  });

  it.each(BUILT_IN_QUESTIONS.map((q) => [q.prompt, q] as const))("%s: answers are usable", (_, q) => {
    const { entries } = createMatcher(q.answers);
    expect(entries.length).toBeGreaterThanOrEqual(4);
    // No two different answers may normalise to the same key, or they'd silently merge.
    const owner = new Map<string, string>();
    for (const e of entries) {
      expect(e.canonical).not.toBe("");
      for (const key of e.keys) {
        expect(owner.get(key) ?? e.canonical).toBe(e.canonical);
        owner.set(key, e.canonical);
      }
    }
  });

  it("derives exact lists", () => {
    const answers = (prompt: string) =>
      createMatcher(BUILT_IN_QUESTIONS.find((q) => q.prompt === prompt)!.answers).entries.map((e) => e.canonical);
    expect(answers("Name a chemical element beginning with D or E")).toEqual([
      "Europium",
      "Dysprosium",
      "Erbium",
      "Einsteinium",
      "Dubnium",
      "Darmstadtium",
    ]);
    expect(answers("Name an HTML tag that's a single letter")).toEqual(["a", "b", "i", "p", "q", "s", "u"]);
    expect(answers("Name a country containing a double letter (e.g. Greece)")).not.toContain("East Timor");
  });
});
