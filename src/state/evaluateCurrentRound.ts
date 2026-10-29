import { evaluateRound, type RoundEvaluation } from "../domain/round.ts";
import type { Question } from "../domain/types.ts";
import { alivePlayers, toContestants, type GameState } from "./gameState.ts";

/** Single place that maps game state onto the round rules, shared by the reducer and the UI. */
export function evaluateCurrentRound(game: GameState, question: Question): RoundEvaluation {
  return evaluateRound({
    question,
    contestants: toContestants(alivePlayers(game)),
    answers: game.answers,
    overrides: game.overrides,
    rules: { ...game.rules, hostPlaying: game.hostPlaying },
  });
}
