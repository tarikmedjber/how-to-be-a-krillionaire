import type { Question } from "../domain/types.ts";
import { createGameReducer, type GameAction } from "./gameReducer.ts";
import { initialStore, type GameStore } from "./gameState.ts";

const questions: Question[] = [
  { id: "months", category: "Culture", prompt: "Name a month", answers: ["January", "May", "July"] },
  { id: "planets", category: "Science & Space", prompt: "Name a planet", answers: ["Mars", "Venus"] },
];
const reducer = createGameReducer(questions);
const run = (...actions: GameAction[]) => actions.reduce<GameStore>(reducer, initialStore);
const lives = (store: GameStore) => store.game.players.map((p) => p.lives);

const started: GameAction = { type: "startGame", names: ["Alice", "Bob", "Cara"], lives: 3 };
const round: GameAction[] = [
  { type: "selectQuestion", questionId: "months" },
  { type: "setAnswer", answererId: "1", text: "July" },
  { type: "setAnswer", answererId: "2", text: "July" },
  { type: "setAnswer", answererId: "3", text: "May" },
];

describe("gameReducer", () => {
  it("needs at least two players to start", () => {
    expect(run({ type: "startGame", names: ["Solo", " "], lives: 3 }).game.phase).toBe("setup");
    expect(run(started).game.phase).toBe("play");
  });

  it("applies a round, then waits for the next question", () => {
    const store = run(started, ...round, { type: "applyRound" });
    expect(lives(store)).toEqual([2, 2, 3]);
    expect(store.game.currentQuestionId).toBeNull();
    expect(store.game.answers).toEqual({});
    expect(store.game.log[0]).toMatchObject({ prompt: "Name a month", losers: [{ name: "Alice" }, { name: "Bob" }] });
  });

  it("won't reuse a question in the same game", () => {
    const store = run(started, ...round, { type: "applyRound" }, { type: "selectQuestion", questionId: "months" });
    expect(store.game.currentQuestionId).toBeNull();
  });

  it("undo restores the round exactly as it was", () => {
    const before = run(started, ...round);
    const undone = reducer(reducer(before, { type: "applyRound" }), { type: "undo" });
    expect(undone.game).toEqual(before.game);
  });

  it("treats a picked question as a preview until the host shows it", () => {
    const picked = run(started, { type: "selectQuestion", questionId: "months" });
    expect(picked.game.questionShown).toBe(false);
    const shown = reducer(picked, { type: "setQuestionShown", value: true });
    expect(shown.game.questionShown).toBe(true);
    // Picking a different question hides it again.
    expect(reducer(shown, { type: "selectQuestion", questionId: "planets" }).game.questionShown).toBe(false);
  });

  it("turns on host mode automatically for the final two", () => {
    const finalTwo = run(started, { type: "adjustLives", playerId: 3, delta: -3 });
    expect(reducer(finalTwo, { type: "selectQuestion", questionId: "planets" }).game.hostPlaying).toBe(true);
    expect(run(started, { type: "selectQuestion", questionId: "planets" }).game.hostPlaying).toBe(false);
  });

  it("starting a new game clears the undo history", () => {
    const store = run(started, ...round, { type: "applyRound" }, { type: "returnToSetup" }, started);
    expect(store.past).toEqual([]);
    expect(store.game.usedQuestionIds).toEqual([]);
  });
});
