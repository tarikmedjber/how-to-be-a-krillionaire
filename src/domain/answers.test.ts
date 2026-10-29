import { createMatcher, parseAnswer, pickRandomAnswer } from "./answers.ts";
import { normalize } from "./text.ts";

describe("normalize", () => {
  it("ignores case, accents, punctuation and a leading 'the'", () => {
    expect(normalize("Côte d'Ivoire")).toBe("cotedivoire");
    expect(normalize("The Netherlands")).toBe("netherlands");
    expect(normalize("St. Lucia")).toBe(normalize("Saint Lucia"));
  });

  it("keeps C, C++ and C# distinct", () => {
    expect(new Set([normalize("C"), normalize("C++"), normalize("C#")]).size).toBe(3);
  });
});

describe("parseAnswer", () => {
  it("splits aliases and flags debatable answers", () => {
    expect(parseAnswer("Turkey*|Turkiye")).toMatchObject({
      canonical: "Turkey",
      aliases: ["Turkey", "Turkiye"],
      debatable: true,
    });
  });
});

describe("createMatcher", () => {
  const countries = createMatcher(["Netherlands|Holland", "Niger", "Nigeria", "France"]);

  it("matches aliases to the same answer", () => {
    expect(countries.identity("holland")).toBe(countries.identity("The Netherlands"));
  });

  it("prefers an exact match over a close one", () => {
    expect(countries.match("niger")).toMatchObject({ entry: { canonical: "Niger" }, fuzzy: false });
  });

  it("accepts small typos as fuzzy matches", () => {
    expect(countries.match("Fraance")).toMatchObject({ entry: { canonical: "France" }, fuzzy: true });
  });

  it("rejects answers that aren't close to anything", () => {
    expect(countries.match("Narnia")).toBeNull();
  });

  describe("suggest", () => {
    const states = createMatcher(["Massachusetts", "Mississippi", "Virginia", "West Virginia", "Texas"]);
    const names = (text: string) => states.suggest(text).map((s) => s.entry.canonical);

    it("tolerates misspellings", () => {
      expect(names("masachu")).toEqual(["Massachusetts"]);
      expect(names("Mississipi")).toEqual(["Mississippi"]);
    });

    it("ranks prefixes before substrings", () => {
      expect(names("virg")).toEqual(["Virginia", "West Virginia"]);
    });

    it("stays quiet once the answer is typed exactly", () => {
      expect(names("Texas")).toEqual([]);
    });
  });
});

describe("pickRandomAnswer", () => {
  it("never picks a debatable answer", () => {
    const { entries } = createMatcher(["Pluto*", "Mars"]);
    expect(pickRandomAnswer(entries, () => 0)).toBe("Mars");
  });
});
