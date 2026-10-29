import { createContext, useContext, type Context, type Dispatch } from "react";
import type { Question } from "../domain/types.ts";
import type { GameAction } from "./gameReducer.ts";
import type { GameStore } from "./gameState.ts";

// State and dispatch live in separate contexts so components that only
// dispatch don't re-render on every state change.
export const GameStoreContext = createContext<GameStore | null>(null);
export const GameDispatchContext = createContext<Dispatch<GameAction> | null>(null);
export const QuestionBankContext = createContext<readonly Question[] | null>(null);

function useRequired<T>(context: Context<T | null>, name: string): T {
  const value = useContext(context);
  if (value === null) throw new Error(`${name} must be used inside <GameProvider>`);
  return value;
}

export const useGameStore = () => useRequired(GameStoreContext, "useGameStore");
export const useGame = () => useGameStore().game;
export const useCanUndo = () => useGameStore().past.length > 0;
export const useGameDispatch = () => useRequired(GameDispatchContext, "useGameDispatch");
/** Built-in plus custom questions. */
export const useQuestionBank = () => useRequired(QuestionBankContext, "useQuestionBank");
