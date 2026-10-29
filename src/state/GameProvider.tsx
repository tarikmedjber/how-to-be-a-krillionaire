import { useEffect, useMemo, useReducer, type ReactNode } from "react";
import { BUILT_IN_QUESTIONS } from "../data/index.ts";
import { withCustomQuestions } from "../domain/questionBank.ts";
import type { Question } from "../domain/types.ts";
import { GameDispatchContext, GameStoreContext, QuestionBankContext } from "./gameContext.ts";
import { createGameReducer } from "./gameReducer.ts";
import { initialStore } from "./gameState.ts";
import { createLocalStorageGameStorage, type GameStorage } from "./storage.ts";

const defaultStorage = createLocalStorageGameStorage();

interface Props {
  children: ReactNode;
  storage?: GameStorage;
  questions?: readonly Question[];
}

export function GameProvider({ children, storage = defaultStorage, questions = BUILT_IN_QUESTIONS }: Props) {
  const reducer = useMemo(() => createGameReducer(questions), [questions]);
  const [store, dispatch] = useReducer(reducer, undefined, () => storage.load() ?? initialStore);

  useEffect(() => storage.save(store), [storage, store]);
  useEffect(() => storage.subscribe((next) => dispatch({ type: "replace", store: next })), [storage]);

  const bank = useMemo(
    () => withCustomQuestions(questions, store.game.customQuestions),
    [questions, store.game.customQuestions],
  );

  return (
    <GameDispatchContext.Provider value={dispatch}>
      <QuestionBankContext.Provider value={bank}>
        <GameStoreContext.Provider value={store}>{children}</GameStoreContext.Provider>
      </QuestionBankContext.Provider>
    </GameDispatchContext.Provider>
  );
}
