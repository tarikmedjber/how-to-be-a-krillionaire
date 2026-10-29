import { findQuestion, withCustomQuestions } from "../domain/questionBank.ts";
import { HOST_ID, type Override } from "../domain/round.ts";
import type { Question, QuestionDef } from "../domain/types.ts";
import { evaluateCurrentRound } from "./evaluateCurrentRound.ts";
import { alivePlayers, type GameRules, type GameState, type GameStore } from "./gameState.ts";

export type GameAction =
  | { type: "startGame"; names: string[]; lives: number }
  | { type: "returnToSetup" }
  | { type: "selectQuestion"; questionId: string }
  | { type: "setAnswer"; answererId: string; text: string }
  | { type: "setOverride"; playerId: string; override: Override | null }
  | { type: "clearAnswers" }
  | { type: "applyRound" }
  | { type: "adjustLives"; playerId: number; delta: number }
  | { type: "addPlayer"; name: string }
  | { type: "setRule"; rule: keyof GameRules; value: boolean }
  | { type: "setHostPlaying"; value: boolean }
  | { type: "setQuestionShown"; value: boolean }
  | { type: "addCustomQuestion"; question: QuestionDef }
  | { type: "undo" }
  | { type: "replace"; store: GameStore };

const UNDOABLE = new Set<GameAction["type"]>(["applyRound", "adjustLives", "addPlayer"]);
const UNDO_LIMIT = 30;

const freshRound = { answers: {}, overrides: {} } satisfies Partial<GameState>;

/** The question bank is injected so the reducer stays pure and testable with any data. */
export function createGameReducer(builtIns: readonly Question[]) {
  const questionsFor = (game: GameState) => withCustomQuestions(builtIns, game.customQuestions);

  function reduceGame(game: GameState, action: GameAction): GameState {
    switch (action.type) {
      case "startGame": {
        const names = action.names.map((n) => n.trim()).filter(Boolean);
        if (names.length < 2) return game;
        const lives = Math.max(1, Math.floor(action.lives) || 1);
        return {
          ...game,
          ...freshRound,
          phase: "play",
          startingLives: lives,
          players: names.map((name, i) => ({ id: i + 1, name, lives })),
          usedQuestionIds: [],
          currentQuestionId: null,
          log: [],
        };
      }

      case "returnToSetup":
        return { ...game, phase: "setup", players: game.players.map((p) => ({ ...p, lives: game.startingLives })) };

      case "selectQuestion":
        if (game.usedQuestionIds.includes(action.questionId)) return game;
        return {
          ...game,
          ...freshRound,
          currentQuestionId: action.questionId,
          // A picked question is only a preview until the host shows it.
          questionShown: false,
          // The final two play against the host by default.
          hostPlaying: alivePlayers(game).length <= 2,
        };

      case "setAnswer":
        return { ...game, answers: { ...game.answers, [action.answererId]: action.text } };

      case "setOverride": {
        const overrides = { ...game.overrides };
        if (action.override) overrides[action.playerId] = action.override;
        else delete overrides[action.playerId];
        return { ...game, overrides };
      }

      case "clearAnswers":
        return { ...game, ...freshRound };

      case "applyRound": {
        const question = game.currentQuestionId ? findQuestion(questionsFor(game), game.currentQuestionId) : undefined;
        if (!question) return game;
        const { contestants, losers } = evaluateCurrentRound(game, question);
        const loserIds = new Set(losers.map((l) => l.id));
        const hostAnswer = game.hostPlaying ? game.answers[HOST_ID]?.trim() || null : null;
        return {
          ...game,
          ...freshRound,
          players: game.players.map((p) =>
            loserIds.has(String(p.id)) ? { ...p, lives: Math.max(0, p.lives - 1) } : p,
          ),
          log: [
            {
              prompt: question.prompt,
              losers: losers.map(({ name, answer }) => ({ name, answer })),
              results: contestants.map(({ name, answer, losesLife }) => ({ name, answer, lostLife: losesLife })),
              hostAnswer,
            },
            ...game.log,
          ],
          usedQuestionIds: [...game.usedQuestionIds, question.id],
          currentQuestionId: null,
          questionShown: false,
        };
      }

      case "adjustLives":
        return {
          ...game,
          players: game.players.map((p) =>
            p.id === action.playerId ? { ...p, lives: Math.max(0, p.lives + action.delta) } : p,
          ),
        };

      case "addPlayer": {
        const name = action.name.trim();
        if (!name) return game;
        const id = Math.max(0, ...game.players.map((p) => p.id)) + 1;
        return { ...game, players: [...game.players, { id, name, lives: game.startingLives }] };
      }

      case "setRule":
        return { ...game, rules: { ...game.rules, [action.rule]: action.value } };

      case "setQuestionShown":
        return game.currentQuestionId ? { ...game, questionShown: action.value } : game;

      case "setHostPlaying":
        return { ...game, hostPlaying: action.value };

      case "addCustomQuestion":
        return { ...game, customQuestions: [...game.customQuestions, action.question] };

      case "undo":
      case "replace":
        return game; // handled at the store level
    }
  }

  return function gameReducer(store: GameStore, action: GameAction): GameStore {
    if (action.type === "replace") return action.store;
    if (action.type === "undo") {
      const previous = store.past.at(-1);
      return previous ? { game: previous, past: store.past.slice(0, -1) } : store;
    }

    const game = reduceGame(store.game, action);
    if (game === store.game) return store;
    if (action.type === "startGame") return { game, past: [] };
    if (UNDOABLE.has(action.type)) return { game, past: [...store.past, store.game].slice(-UNDO_LIMIT) };
    return { ...store, game };
  };
}
