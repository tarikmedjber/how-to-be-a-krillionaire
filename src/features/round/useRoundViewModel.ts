import { useMemo, useState } from "react";
import { useToast } from "../../components/toastContext.ts";
import { matcherFor, pickRandomAnswer } from "../../domain/answers.ts";
import { nextEmptyAfter, resolveFillTarget } from "../../domain/fillTarget.ts";
import { findQuestion } from "../../domain/questionBank.ts";
import { HOST_ID, type Override } from "../../domain/round.ts";
import { evaluateCurrentRound } from "../../state/evaluateCurrentRound.ts";
import { useGame, useGameDispatch, useQuestionBank } from "../../state/gameContext.ts";
import { answererIds } from "../../state/gameState.ts";

export type ReferenceStatus = "clash" | "given";

/**
 * View model for the current round: everything the round table and the
 * answer reference need, so those components only render.
 */
export function useRoundViewModel() {
  const game = useGame();
  const dispatch = useGameDispatch();
  const questions = useQuestionBank();
  const toast = useToast();

  const question = game.currentQuestionId ? (findQuestion(questions, game.currentQuestionId) ?? null) : null;
  const matcher = question ? matcherFor(question) : null;
  const evaluation = useMemo(() => (question ? evaluateCurrentRound(game, question) : null), [game, question]);
  const ids = answererIds(game);

  // The box the host last focused, remembered per question so it resets for each new round.
  const [focus, setFocus] = useState<{ questionId: string | null; answererId: string | null }>({
    questionId: null,
    answererId: null,
  });
  const preferredId = focus.questionId === game.currentQuestionId ? focus.answererId : null;
  const targetId = resolveFillTarget(ids, game.answers, preferredId);
  const focusAnswerer = (answererId: string | null) => setFocus({ questionId: game.currentQuestionId, answererId });

  const nameOf = (id: string) =>
    id === HOST_ID ? "you (host)" : (game.players.find((p) => String(p.id) === id)?.name ?? "");

  const referenceStatus = useMemo(() => {
    const status = new Map<string, ReferenceStatus>();
    if (!evaluation) return status;
    for (const r of evaluation.contestants) if (r.match) status.set(r.match.entry.canonical, "given");
    if (evaluation.host?.match) status.set(evaluation.host.match.entry.canonical, "given");
    for (const r of evaluation.contestants) if (r.match && r.clash) status.set(r.match.entry.canonical, "clash");
    return status;
  }, [evaluation]);

  return {
    question,
    matcher,
    evaluation,
    hostPlaying: game.hostPlaying,
    questionShown: game.questionShown,
    startingLives: game.startingLives,
    answers: game.answers,
    targetId,
    targetName: targetId ? nameOf(targetId) : null,
    referenceStatus,

    focusAnswerer,
    setAnswer: (answererId: string, text: string) => dispatch({ type: "setAnswer", answererId, text }),
    setOverride: (playerId: string, override: Override | null) => dispatch({ type: "setOverride", playerId, override }),
    setHostPlaying: (value: boolean) => dispatch({ type: "setHostPlaying", value }),
    setQuestionShown: (value: boolean) => dispatch({ type: "setQuestionShown", value }),
    clearAnswers: () => dispatch({ type: "clearAnswers" }),
    applyRound: () => dispatch({ type: "applyRound" }),

    randomHostAnswer: () => {
      const answer = matcher && pickRandomAnswer(matcher.entries);
      if (answer) dispatch({ type: "setAnswer", answererId: HOST_ID, text: answer });
    },

    /** Fill the current target from the answer reference, then move on to the next empty box. */
    fillFromReference: (canonical: string) => {
      if (!targetId) {
        toast("Everyone has an answer. Click a player's box to change theirs.");
        return;
      }
      dispatch({ type: "setAnswer", answererId: targetId, text: canonical });
      focusAnswerer(nextEmptyAfter(ids, { ...game.answers, [targetId]: canonical }, targetId));
    },
  };
}

export type RoundViewModel = ReturnType<typeof useRoundViewModel>;
