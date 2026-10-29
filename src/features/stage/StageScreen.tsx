import { useEffect, useMemo } from "react";
import { Hearts } from "../../components/Hearts.tsx";
import { useGame, useQuestionBank } from "../../state/gameContext.ts";
import type { RoundLogEntry } from "../../state/gameState.ts";
import { toStageView, type LiveAnswer, type StageView } from "./stageView.ts";
import { useFullscreen } from "./useFullscreen.ts";

/** Participant-facing screen: the question, live answers and scores, never the answer list. */
export function StageScreen() {
  const game = useGame();
  const questions = useQuestionBank();
  const view = useMemo(() => toStageView(game, questions), [game, questions]);
  const { isFullscreen, toggle } = useFullscreen();

  useEffect(() => {
    document.title = "Who Wants to Be a Krillionaire";
  }, []);

  return (
    <div className="stage">
      <div className="stage-top">
        <span className="stage-title">🎯 Who Wants to Be a Krillionaire</span>
        {view.mode !== "lobby" && <span className="stage-pill">{view.stillIn} still in</span>}
        {!isFullscreen && (
          <button type="button" className="stage-fs" onClick={toggle}>
            ⛶ Fullscreen
          </button>
        )}
      </div>

      {view.champion && <div className="stage-winner">🏆 {view.champion} wins!</div>}
      <StageMain view={view} />

      {view.players.length > 0 && (
        <div className="stage-players">
          {view.players.map((p) => (
            <div key={p.id} className={`stage-card${p.lives <= 0 ? " out" : ""}`}>
              <div className="name">{p.name}</div>
              {p.lives > 0 ? <Hearts lives={p.lives} max={view.startingLives} /> : <div className="out-label">OUT</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StageMain({ view }: { view: StageView }) {
  switch (view.mode) {
    case "lobby":
      return <Message big="Get ready!" small="The game is about to start." />;
    case "waiting":
      return <Message big="Waiting for the first question…" small="Grab a pen and paper." />;
    case "question":
      return (
        <div className="stage-question">
          <div className="stage-round">
            Round {view.roundNumber} · {view.question!.category}
          </div>
          <div className="stage-prompt">{view.question!.prompt}</div>
          <div className="stage-hint">
            {view.finalRound
              ? "Final round: don't say what the host says!"
              : "Write down an answer nobody else will think of."}
          </div>
          <LiveAnswers answers={view.liveAnswers} />
        </div>
      );
    case "reveal":
      return <Reveal round={view.lastRound!} roundNumber={view.roundNumber} gameOver={view.gameOver} />;
  }
}

function LiveAnswers({ answers }: { answers: readonly LiveAnswer[] }) {
  if (!answers.some((a) => a.answer)) return null;
  return (
    <div className="stage-results">
      {answers.map((a) => (
        <div key={a.name} className={`stage-result${a.clash ? " lost" : ""}${a.answer ? "" : " pending"}`}>
          <span className="who">{a.name}</span>
          <span className="what">{a.answer || "…waiting"}</span>
          <span className="verdict">{a.clash ? "clash!" : a.answer ? "✓" : ""}</span>
        </div>
      ))}
    </div>
  );
}

function Message({ big, small }: { big: string; small: string }) {
  return (
    <div className="stage-question">
      <div className="stage-prompt">{big}</div>
      <div className="stage-hint">{small}</div>
    </div>
  );
}

function Reveal({ round, roundNumber, gameOver }: { round: RoundLogEntry; roundNumber: number; gameOver: boolean }) {
  // Older saves only recorded the losers.
  const results = round.results ?? round.losers.map((l) => ({ ...l, lostLife: true }));
  return (
    <div className="stage-question">
      <div className="stage-round">{gameOver ? "Final round" : `Round ${roundNumber}`} results</div>
      <div className="stage-prompt small">{round.prompt}</div>
      <div className="stage-results">
        {results.map((r) => (
          <div key={r.name} className={`stage-result${r.lostLife ? " lost" : ""}`}>
            <span className="who">{r.name}</span>
            <span className="what">{r.answer || "—"}</span>
            <span className="verdict">{r.lostLife ? "− 1 ♥" : "safe"}</span>
          </div>
        ))}
      </div>
      {round.hostAnswer && <div className="stage-hint">The host said “{round.hostAnswer}”</div>}
      <div className="stage-hint">{gameOver ? "Game over. Thanks for playing!" : "Next question coming up…"}</div>
    </div>
  );
}
