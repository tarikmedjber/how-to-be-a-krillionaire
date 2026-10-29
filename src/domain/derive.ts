import { parseAnswer } from "./answers.ts";
import { lettersOnly } from "./text.ts";
import type { Category, ListKey, QuestionDef } from "./types.ts";

type Filter = (canonical: string, index: number) => boolean;

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const hasDoubleLetter = (c: string) => /([a-z])\1/.test(c.toLowerCase());
const hasAll = (c: string, letters: string) => [...letters].every((l) => lettersOnly(c).includes(l));

/**
 * Builds variations ("elements beginning with D or E", "4xx status codes")
 * by filtering the complete base lists, so their answer lists are exact.
 */
export function deriveQuestions(base: readonly QuestionDef[]): QuestionDef[] {
  const derived: QuestionDef[] = [];
  const prompts = new Set(base.map((q) => q.prompt));

  const list = (key: ListKey) => {
    const source = base.find((q) => q.listKey === key);
    if (!source) throw new Error(`No base list with listKey "${key}"`);
    return source;
  };

  /** Only adds the question if at least `min` non-debatable answers pass the filter. */
  const add = (key: ListKey, category: Category, prompt: string, filter: Filter, min = 4) => {
    const source = list(key);
    const answers = source.answers.filter((raw, i) => filter(parseAnswer(raw).canonical, i));
    const solid = answers.filter((raw) => !parseAnswer(raw).debatable).length;
    if (solid < min || prompts.has(prompt)) return;
    prompts.add(prompt);
    derived.push({ category, prompt, answers, ...(source.open ? { open: true } : {}) });
  };

  const byLetter = (key: ListKey, category: Category, noun: string, min: number) => {
    for (const letter of ALPHABET) {
      add(key, category, `Name ${noun} beginning with ${letter}`, (c) => c[0]?.toUpperCase() === letter, min);
    }
  };

  // Elements: the list is in atomic-number order, so index + 1 = atomic number.
  byLetter("elements", "Elements", "a chemical element", 6);
  add("elements", "Elements", "Name a chemical element beginning with D or E", (c) => /^[DE]/.test(c));
  add("elements", "Elements", "Name a chemical element beginning with X, Y or Z", (c) => /^[XYZ]/.test(c));
  add("elements", "Elements", "Name a chemical element beginning with F or G", (c) => /^[FG]/.test(c));
  add("elements", "Elements", "Name a chemical element beginning with H, I or K", (c) => /^[HIK]/.test(c));
  add("elements", "Elements", "Name a chemical element ending in -IUM", (c) => /ium$/i.test(c));
  add("elements", "Elements", "Name a chemical element NOT ending in -ium", (c) => !/ium$/i.test(c));
  add("elements", "Elements", "Name a chemical element ending in -ON", (c) => /on$/i.test(c));
  add("elements", "Elements", "Name a chemical element ending in -INE", (c) => /ine$/i.test(c));
  add("elements", "Elements", "Name a chemical element with 4 letters or fewer", (c) => lettersOnly(c).length <= 4);
  add("elements", "Elements", "Name a chemical element with 12+ letters", (c) => lettersOnly(c).length >= 12);
  add("elements", "Elements", "Name one of the first 10 elements", (_, i) => i < 10);
  add("elements", "Elements", "Name one of the first 20 elements", (_, i) => i < 20);
  add("elements", "Elements", "Name an element with atomic number 21 to 40", (_, i) => i >= 20 && i < 40);
  add("elements", "Elements", "Name an element with atomic number over 92 (synthetic)", (_, i) => i >= 92);
  add("elements", "Elements", "Name a chemical element containing the letters A, E and I", (c) => hasAll(c, "aei"));

  // Countries
  byLetter("countries", "Countries", "a country", 8);
  add("countries", "Countries", "Name a country ending in -IA", (c) => /ia$/i.test(c));
  add("countries", "Countries", "Name a country ending in -STAN", (c) => /stan$/i.test(c));
  add("countries", "Countries", "Name a country containing the word 'land'", (c) => /land/i.test(c));
  add("countries", "Countries", "Name a country with a name of 4 letters", (c) => lettersOnly(c).length === 4);
  add("countries", "Countries", "Name a country with a name of 5 letters", (c) => lettersOnly(c).length === 5);
  add("countries", "Countries", "Name a country with a name of 12+ letters", (c) => lettersOnly(c).length >= 12);
  add("countries", "Countries", "Name a country whose name is two or more words", (c) => /\s/.test(c));
  add("countries", "Countries", "Name a country that starts and ends with the same letter", (c) => {
    const l = lettersOnly(c);
    return l[0] === l[l.length - 1];
  });
  add("countries", "Countries", "Name a country that starts AND ends with A", (c) => /^a.*a$/.test(lettersOnly(c)));
  add("countries", "Countries", "Name a country containing a double letter (e.g. Greece)", hasDoubleLetter);
  add("countries", "Countries", "Name a country containing the letter Z", (c) => lettersOnly(c).includes("z"));
  add("countries", "Countries", "Name a country containing the letter K", (c) => lettersOnly(c).includes("k"));
  add("countries", "Countries", "Name a country containing the letter J, Q or X", (c) => /[jqx]/.test(lettersOnly(c)));
  add("countries", "Countries", "Name a country containing the letter W", (c) => lettersOnly(c).includes("w"));
  add("countries", "Countries", "Name a country containing the letter V", (c) => lettersOnly(c).includes("v"));
  add("countries", "Countries", "Name a country with all five vowels in its name", (c) => hasAll(c, "aeiou"));
  add("countries", "Countries", "Name a country with no letter A in its name", (c) => !lettersOnly(c).includes("a"));
  add("countries", "Countries", "Name a country containing 'Guinea'", (c) => /guinea/i.test(c));
  add("countries", "Countries", "Name a country with 'and' in its name", (c) => / and /i.test(c));
  add("countries", "Countries", "Name a country starting with North, South, East or Central", (c) =>
    /^(north|south|east|central)\b/i.test(c),
  );
  add("countries", "Countries", "Name a country starting with a vowel", (c) => /^[AEIOU]/.test(c));

  // Capitals
  byLetter("capitals", "Capitals & Cities", "a national capital", 7);
  add("capitals", "Capitals & Cities", "Name a capital city with 4 letters or fewer", (c) => lettersOnly(c).length <= 4);
  add("capitals", "Capitals & Cities", "Name a capital city whose name is two or more words", (c) => /\s/.test(c));
  add("capitals", "Capitals & Cities", "Name a capital city ending in A", (c) => /a$/.test(lettersOnly(c)));
  add("capitals", "Capitals & Cities", "Name a capital city containing the letter K", (c) => lettersOnly(c).includes("k"));
  add("capitals", "Capitals & Cities", "Name a capital city beginning with a vowel", (c) => /^[AEIOU]/.test(c));

  // US States
  add("states", "US States", "Name a US state ending in A", (c) => /a$/i.test(c));
  add("states", "US States", "Name a US state NOT ending in a vowel", (c) => !/[aeiou]$/i.test(c));
  add("states", "US States", "Name a US state that's two words", (c) => /\s/.test(c));
  add("states", "US States", "Name a US state containing a double letter", hasDoubleLetter);
  add("states", "US States", "Name a US state beginning with a vowel", (c) => /^[AEIOU]/.test(c));
  add("states", "US States", "Name a US state with 6 letters or fewer", (c) => lettersOnly(c).length <= 6);
  add("states", "US States", "Name a US state with 10+ letters", (c) => lettersOnly(c).length >= 10);
  add("states", "US States", "Name a US state containing the letter K", (c) => lettersOnly(c).includes("k"));
  add("states", "US States", "Name a US state beginning with A, C or I", (c) => /^[ACI]/.test(c));
  add("states", "US States", "Name a US state beginning with N", (c) => /^N/.test(c));
  add("states", "US States", "Name a US state beginning with M", (c) => /^M/.test(c));
  add("states", "US States", "Name a US state beginning with O, T, U or V", (c) => /^[OTUV]/.test(c));

  // Premier League
  add("pl", "Sport", "Name a Premier League club (ever) with 'United' in its name", (c) => /united/i.test(c));
  add("pl", "Sport", "Name a Premier League club (ever) with 'City' in its name", (c) => /city/i.test(c));
  add("pl", "Sport", "Name a Premier League club (ever) beginning with B", (c) => /^(AFC )?B/.test(c));
  add("pl", "Sport", "Name a Premier League club (ever) beginning with S", (c) => /^S/.test(c));
  add("pl", "Sport", "Name a Premier League club (ever) beginning with A to E", (c) => /^(AFC )?[A-E]/.test(c));

  // Dev
  const pythonTypes = new Set(
    "bool bytearray bytes complex dict float frozenset int list memoryview object range set slice str tuple type".split(" "),
  );
  add("langs", "Dev: Languages", "Name a programming language beginning with C", (c) => /^C/.test(c));
  add("langs", "Dev: Languages", "Name a programming language beginning with P, R or S", (c) => /^[PRS]/.test(c));
  add("http", "Dev: Web", "Name a 2xx (success) HTTP status code", (c) => c.startsWith("2"));
  add("http", "Dev: Web", "Name a 3xx (redirect) HTTP status code", (c) => c.startsWith("3"));
  add("http", "Dev: Web", "Name a 4xx (client error) HTTP status code", (c) => c.startsWith("4"));
  add("http", "Dev: Web", "Name a 5xx (server error) HTTP status code", (c) => c.startsWith("5"));
  add("html", "Dev: Web", "Name an HTML tag that's a single letter", (c) => /^[a-z]$/.test(c));
  add("html", "Dev: Web", "Name an HTML tag that's exactly two characters", (c) => c.length === 2);
  add("html", "Dev: Web", "Name an HTML tag with 7+ letters", (c) => c.length >= 7);
  add("linux", "Dev: Tools & Infra", "Name a Unix command that's exactly two letters", (c) => c.length === 2);
  add("pybuiltins", "Dev: Languages", "Name a Python built-in function beginning with S", (c) => c.startsWith("s"));
  add("pybuiltins", "Dev: Languages", "Name a Python built-in function beginning with I", (c) => c.startsWith("i"));
  add("pybuiltins", "Dev: Languages", "Name a Python built-in that's also a type (int, str…)", (c) => pythonTypes.has(c));
  add("aws", "Dev: Tools & Infra", "Name an AWS service that's an acronym (all caps, like S3)", (c) =>
    /^[A-Z0-9]{2,}$/.test(c.replace(/\s/g, "")),
  );
  add("aws", "Dev: Tools & Infra", "Name an AWS service beginning with C", (c) => /^C/.test(c));

  return derived;
}
