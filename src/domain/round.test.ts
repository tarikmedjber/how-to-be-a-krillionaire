import { evaluateRound, HOST_ID, type RoundInput, type RoundRules } from "./round.ts";
import type { Question } from "./types.ts";

const months: Question = {
  id: "months",
  category: "Culture",
  prompt: "Name a month",
  answers: ["January", "March", "May", "July"],
};
const fruit: Question = { ...months, id: "fruit", prompt: "Name a fruit", answers: ["Apple"], open: true };

const players = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
  { id: "3", name: "Cara" },
];
const rules: RoundRules = { blankLoses: true, invalidLoses: true, hostPlaying: false };

const evaluate = (answers: Record<string, string>, overrides: Partial<RoundInput> = {}) =>
  evaluateRound({ question: months, contestants: players, answers, overrides: {}, rules, ...overrides });
const losers = (result: ReturnType<typeof evaluate>) => result.losers.map((l) => l.name);

describe("evaluateRound", () => {
  it("costs everyone who clashes a life", () => {
    expect(losers(evaluate({ 1: "July", 2: "july", 3: "May" }))).toEqual(["Alice", "Bob"]);
  });

  it("costs a blank answer a life only when that rule is on", () => {
    expect(losers(evaluate({ 1: "July", 2: "May" }))).toEqual(["Cara"]);
    expect(losers(evaluate({ 1: "July", 2: "May" }, { rules: { ...rules, blankLoses: false } }))).toEqual([]);
  });

  it("treats unlisted answers as wrong on closed lists but the host's call on open ones", () => {
    expect(losers(evaluate({ 1: "Octember", 2: "May", 3: "July" }))).toEqual(["Alice"]);
    const open = evaluate({ 1: "Kiwi", 2: "Apple", 3: "Pear" }, { question: fruit });
    expect(losers(open)).toEqual([]);
    expect(open.contestants[0]!.badges).toContainEqual({ tone: "warn", label: "Not in list — your call" });
  });

  it("lets the host override the verdict both ways", () => {
    const result = evaluate({ 1: "July", 2: "July", 3: "May" }, { overrides: { 1: "safe", 3: "lose" } });
    expect(losers(result)).toEqual(["Bob", "Cara"]);
  });

  describe("playing against the host", () => {
    const hostRules = { ...rules, hostPlaying: true };

    it("only costs a life for matching the host", () => {
      const result = evaluate({ 1: "July", 2: "July", 3: "May", [HOST_ID]: "May" }, { rules: hostRules });
      expect(losers(result)).toEqual(["Cara"]);
      expect(result.host?.catches).toEqual(["Cara"]);
      expect(result.contestants[0]!.badges).toContainEqual({ tone: "ok", label: "Same as Bob (fine)" });
    });

    it("prompts the host for an answer", () => {
      expect(evaluate({}, { rules: hostRules }).host?.badges).toEqual([{ tone: "warn", label: "Enter your answer" }]);
    });
  });
});
