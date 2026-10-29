import { useState } from "react";
import { findQuestion, groupByCategory, pickRandomQuestion } from "../../domain/questionBank.ts";
import type { Category } from "../../domain/types.ts";
import { useGame, useGameDispatch, useQuestionBank } from "../../state/gameContext.ts";

/** View model for the question list: search, collapsible categories, picking. */
export function useQuestionBrowser() {
  const game = useGame();
  const dispatch = useGameDispatch();
  const questions = useQuestionBank();
  const [search, setSearch] = useState("");
  const [openCategories, setOpenCategories] = useState<ReadonlySet<Category>>(new Set());

  const used = new Set(game.usedQuestionIds);
  const groups = groupByCategory(questions, search).map((g) => ({
    ...g,
    open: search.trim() !== "" || openCategories.has(g.category),
    remaining: g.questions.filter((q) => !used.has(q.id)).length,
  }));

  const openCategory = (category: Category) => setOpenCategories((prev) => new Set(prev).add(category));

  const select = (questionId: string) => {
    const question = findQuestion(questions, questionId);
    if (!question || used.has(questionId)) return;
    openCategory(question.category);
    dispatch({ type: "selectQuestion", questionId });
  };

  return {
    search,
    setSearch,
    groups,
    currentId: game.currentQuestionId,
    isUsed: (id: string) => used.has(id),
    select,
    toggleCategory: (category: Category) =>
      setOpenCategories((prev) => {
        const next = new Set(prev);
        if (!next.delete(category)) next.add(category);
        return next;
      }),
    pickRandom: () => {
      const q = pickRandomQuestion(questions, game.usedQuestionIds, game.currentQuestionId);
      if (q) select(q.id);
    },
  };
}
