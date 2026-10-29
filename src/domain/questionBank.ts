import { CATEGORIES, type Category, type Question, type QuestionDef } from "./types.ts";

export const CUSTOM_ID_PREFIX = "custom-";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Built-in questions get ids from their prompt, so ids survive reordering the data files. */
export function withIds(defs: readonly QuestionDef[]): Question[] {
  const seen = new Set<string>();
  return defs.map((def) => {
    let id = slugify(def.prompt);
    for (let n = 2; seen.has(id); n++) id = `${slugify(def.prompt)}-${n}`;
    seen.add(id);
    return { ...def, id };
  });
}

export function withCustomQuestions(builtIns: readonly Question[], custom: readonly QuestionDef[]): Question[] {
  return [...builtIns, ...custom.map((def, i) => ({ ...def, id: `${CUSTOM_ID_PREFIX}${i}` }))];
}

export function findQuestion(questions: readonly Question[], id: string): Question | undefined {
  return questions.find((q) => q.id === id);
}

export interface CategoryGroup {
  category: Category;
  questions: Question[];
}

export function groupByCategory(questions: readonly Question[], search = ""): CategoryGroup[] {
  const needle = search.trim().toLowerCase();
  const groups = new Map<Category, Question[]>();
  for (const q of questions) {
    if (needle && !`${q.prompt} ${q.category}`.toLowerCase().includes(needle)) continue;
    groups.set(q.category, [...(groups.get(q.category) ?? []), q]);
  }
  return CATEGORIES.filter((c) => groups.has(c)).map((category) => ({ category, questions: groups.get(category)! }));
}

export function pickRandomQuestion(
  questions: readonly Question[],
  usedIds: readonly string[],
  currentId: string | null,
  random: () => number = Math.random,
): Question | null {
  const pool = questions.filter((q) => !usedIds.includes(q.id) && q.id !== currentId);
  return pool.length ? pool[Math.floor(random() * pool.length)]! : null;
}

/** Turn the "add your own question" form into a question definition. */
export function customQuestionDef(prompt: string, answersText: string, open: boolean): QuestionDef {
  const answers = answersText
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return { category: "Custom", prompt: prompt.trim(), answers, open: open || answers.length === 0 };
}
