import { HOST_ID, type Contestant, type Override } from "../domain/round.ts";
import type { QuestionDef } from "../domain/types.ts";

export interface Player {
  id: number;
  name: string;
  lives: number;
}

export interface GameRules {
  blankLoses: boolean;
  invalidLoses: boolean;
}

export interface RoundResult {
  name: string;
  answer: string;
  lostLife: boolean;
}

export interface RoundLogEntry {
  prompt: string;
  losers: { name: string; answer: string }[];
  /** Everyone's answer, for the reveal on the participant screen. Missing in older saves. */
  results?: RoundResult[];
  hostAnswer: string | null;
}

export interface GameState {
  phase: "setup" | "play";
  players: Player[];
  startingLives: number;
  rules: GameRules;
  hostPlaying: boolean;
  customQuestions: QuestionDef[];
  usedQuestionIds: string[];
  currentQuestionId: string | null;
  /** The host has approved the current question for the participant screen. */
  questionShown: boolean;
  /** Keyed by player id (as a string) or HOST_ID. */
  answers: Record<string, string>;
  overrides: Record<string, Override>;
  log: RoundLogEntry[];
}

/** The game plus its undo history, kept apart so the game itself stays plain data. */
export interface GameStore {
  game: GameState;
  past: GameState[];
}

export const initialGameState: GameState = {
  phase: "setup",
  players: [],
  startingLives: 5,
  rules: { blankLoses: true, invalidLoses: true },
  hostPlaying: false,
  customQuestions: [],
  usedQuestionIds: [],
  currentQuestionId: null,
  questionShown: false,
  answers: {},
  overrides: {},
  log: [],
};

export const initialStore: GameStore = { game: initialGameState, past: [] };

export const alivePlayers = (game: GameState): Player[] => game.players.filter((p) => p.lives > 0);

export const toContestants = (players: readonly Player[]): Contestant[] =>
  players.map((p) => ({ id: String(p.id), name: p.name }));

/** Everyone who gives an answer this round, in on-screen order. */
export const answererIds = (game: GameState): string[] => [
  ...alivePlayers(game).map((p) => String(p.id)),
  ...(game.hostPlaying ? [HOST_ID] : []),
];

export const winner = (game: GameState): Player | null => {
  const alive = alivePlayers(game);
  return game.players.length > 1 && alive.length === 1 ? alive[0]! : null;
};
