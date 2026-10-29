/** Display order of categories in the question browser. */
export const CATEGORIES = [
  "Dev: Languages",
  "Dev: Web",
  "Dev: Tools & Infra",
  "Dev: CS",
  "Countries",
  "Capitals & Cities",
  "US States",
  "Elements",
  "Science & Space",
  "Maths",
  "Sport",
  "Film & TV",
  "Music",
  "Games",
  "Culture",
  "Food & Drink",
  "Everyday",
  "Custom",
] as const;

export type Category = (typeof CATEGORIES)[number];

/** Base lists that derived questions (e.g. "elements beginning with D") filter from. */
export type ListKey =
  | "states"
  | "elements"
  | "langs"
  | "pl"
  | "countries"
  | "capitals"
  | "pybuiltins"
  | "http"
  | "html"
  | "linux"
  | "aws"
  | "gof";

/**
 * A question as authored in the data files.
 *
 * Each answer is written as `"Canonical|alias|alias"`. A trailing `*` on any
 * name marks the answer as debatable (the host decides whether it counts).
 */
export interface QuestionDef {
  category: Category;
  prompt: string;
  answers: readonly string[];
  /** The list isn't exhaustive, so unlisted answers aren't automatically wrong. */
  open?: boolean;
  listKey?: ListKey;
}

export interface Question extends QuestionDef {
  id: string;
}

export interface AnswerEntry {
  canonical: string;
  aliases: string[];
  /** Normalised forms of every alias, used for matching. */
  keys: string[];
  debatable: boolean;
}
