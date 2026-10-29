import { findQuestion } from "../../domain/questionBank.ts";
import type { Category, Question } from "../../domain/types.ts";
import { evaluateCurrentRound } from "../../state/evaluateCurrentRound.ts";
import { alivePlayers, winner, type GameState, type Player, type RoundLogEntry } from "../../state/gameState.ts";

export interface LiveAnswer {
  name: string;
  /** Empty until the host enters it. */
  answer: string;
  clash: boolean;
}

export type StageMode = "lobby" | "waiting" | "question" | "reveal";

/**
 * Everything the participant screen may show. It is built from the game state
 * by picking fields, never by spreading, so the answer list and the host's own
 * answer can't reach the shared screen.
 */
export interface StageView {
  mode: StageMode;
  roundNumber: number;
  question: { prompt: string; category: Category } | null;
  finalRound: boolean;
  /** Players' answers as the host enters them. */
  liveAnswers: LiveAnswer[];
  lastRound: RoundLogEntry | null;
  players: Player[];
  startingLives: number;
  stillIn: number;
  champion: string | null;
  /** One or nobody left standing: no more questions are coming. */
  gameOver: boolean;
}

export function toStageView(game: GameState, questions: readonly Question[]): StageView {
  // Until the host shows it, a picked question is a private preview.
  const current =
    game.currentQuestionId && game.questionShown ? findQuestion(questions, game.currentQuestionId) : undefined;
  const lastRound = game.log[0] ?? null;

  let mode: StageMode;
  if (game.phase === "setup") mode = "lobby";
  else if (current) mode = "question";
  else if (lastRound) mode = "reveal";
  else mode = "waiting";

  return {
    mode,
    roundNumber: game.usedQuestionIds.length + (current ? 1 : 0),
    question: current ? { prompt: current.prompt, category: current.category } : null,
    finalRound: Boolean(current) && game.hostPlaying,
    liveAnswers: current
      ? evaluateCurrentRound(game, current).contestants.map(({ name, answer, clash }) => ({
          name,
          answer,
          // Against the host, a clash would give away the host's answer.
          clash: clash && !game.hostPlaying,
        }))
      : [],
    lastRound: mode === "reveal" ? lastRound : null,
    players: game.players.map(({ id, name, lives }) => ({ id, name, lives })),
    startingLives: game.startingLives,
    stillIn: alivePlayers(game).length,
    champion: game.phase === "play" ? (winner(game)?.name ?? null) : null,
    gameOver: game.phase === "play" && game.players.length > 1 && alivePlayers(game).length <= 1,
  };
}
