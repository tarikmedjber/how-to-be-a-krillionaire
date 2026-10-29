import { render, screen } from "@testing-library/react";
import type { Question } from "../../domain/types.ts";
import { GameProvider } from "../../state/GameProvider.tsx";
import { createGameReducer, type GameAction } from "../../state/gameReducer.ts";
import { initialStore, type GameStore } from "../../state/gameState.ts";
import { createMemoryGameStorage } from "../../state/storage.ts";
import { StageScreen } from "./StageScreen.tsx";
import { toStageView } from "./stageView.ts";

const questions: Question[] = [
  {
    id: "months",
    category: "Culture",
    prompt: "Name a month of the year",
    answers: ["January", "February", "March", "September"],
  },
  { id: "planets", category: "Science & Space", prompt: "Name a planet", answers: ["Mars", "Venus", "Earth", "Saturn"] },
];
const reducer = createGameReducer(questions);
const run = (...actions: GameAction[]) => actions.reduce<GameStore>(reducer, initialStore);

const midRound = run(
  { type: "startGame", names: ["Alice", "Bob", "Cara"], lives: 3 },
  { type: "selectQuestion", questionId: "months" },
  { type: "setQuestionShown", value: true },
  { type: "setAnswer", answererId: "1", text: "September" },
  { type: "setAnswer", answererId: "2", text: "September" },
  { type: "setAnswer", answererId: "3", text: "March" },
);

const renderStage = (store: GameStore) =>
  render(
    <GameProvider storage={createMemoryGameStorage(store)} questions={questions}>
      <StageScreen />
    </GameProvider>,
  );

describe("participant screen", () => {
  it("shows the question and players' answers live, but never the answer list", () => {
    renderStage(midRound);
    expect(screen.getByText("Name a month of the year")).toBeInTheDocument();
    expect(screen.getByText(/Round 1/)).toBeInTheDocument();
    expect(screen.getAllByText("September")).toHaveLength(2);
    expect(screen.getAllByText("clash!")).toHaveLength(2);
    expect(screen.getByText("March")).toBeInTheDocument();
    for (const unused of ["January", "February"]) {
      expect(screen.queryByText(new RegExp(unused))).not.toBeInTheDocument();
    }
  });

  it("marks players still waiting to have their answer entered", () => {
    renderStage(reducer(midRound, { type: "setAnswer", answererId: "3", text: "" }));
    expect(screen.getByText("…waiting")).toBeInTheDocument();
  });

  it("never gives away the host's answer in the final round", () => {
    const finalRound = run(
      { type: "startGame", names: ["Alice", "Bob"], lives: 3 },
      { type: "selectQuestion", questionId: "months" },
      { type: "setQuestionShown", value: true },
      { type: "setAnswer", answererId: "host", text: "February" },
      { type: "setAnswer", answererId: "1", text: "February" },
    );
    expect(finalRound.game.hostPlaying).toBe(true);
    renderStage(finalRound);
    // Alice's own answer shows, but nothing marks it as matching the host.
    expect(screen.getAllByText("February")).toHaveLength(1);
    expect(screen.queryByText("clash!")).not.toBeInTheDocument();
  });

  it("keeps a picked question hidden until the host shows it", () => {
    const preview = reducer(midRound, { type: "setQuestionShown", value: false });
    renderStage(preview);
    expect(screen.queryByText("Name a month of the year")).not.toBeInTheDocument();
    expect(screen.getByText(/Waiting for the first question/)).toBeInTheDocument();
  });

  it("keeps showing the last results while the host previews the next question", () => {
    const applied = reducer(midRound, { type: "applyRound" });
    renderStage(reducer(applied, { type: "selectQuestion", questionId: "planets" }));
    expect(screen.getByText("Round 1 results")).toBeInTheDocument();
    expect(screen.queryByText("Name a planet")).not.toBeInTheDocument();
  });

  it("the view model never carries the answer list", () => {
    const serialised = JSON.stringify(toStageView(midRound.game, questions));
    expect(serialised).not.toMatch(/January|February/);
  });

  it("reveals everyone's answers once the round is applied", () => {
    renderStage(reducer(midRound, { type: "applyRound" }));
    expect(screen.getByText("Round 1 results")).toBeInTheDocument();
    expect(screen.getAllByText("September")).toHaveLength(2);
    expect(screen.getAllByText("− 1 ♥")).toHaveLength(2);
    expect(screen.getByText("safe")).toBeInTheDocument();
  });

  it("announces the winner", () => {
    const won = reducer(reducer(midRound, { type: "adjustLives", playerId: 1, delta: -3 }), {
      type: "adjustLives",
      playerId: 2,
      delta: -3,
    });
    renderStage(won);
    expect(screen.getByText("🏆 Cara wins!")).toBeInTheDocument();
  });

  it("says the game is over instead of promising another question", () => {
    // Alice and Bob clash on the last life each, leaving Cara as the winner.
    const lastRound = run(
      { type: "startGame", names: ["Alice", "Bob", "Cara"], lives: 1 },
      { type: "selectQuestion", questionId: "months" },
      { type: "setHostPlaying", value: false },
      { type: "setAnswer", answererId: "1", text: "September" },
      { type: "setAnswer", answererId: "2", text: "September" },
      { type: "setAnswer", answererId: "3", text: "March" },
      { type: "applyRound" },
    );
    renderStage(lastRound);
    expect(screen.getByText("🏆 Cara wins!")).toBeInTheDocument();
    expect(screen.getByText("Game over. Thanks for playing!")).toBeInTheDocument();
    expect(screen.queryByText(/Next question coming up/)).not.toBeInTheDocument();
  });
});
