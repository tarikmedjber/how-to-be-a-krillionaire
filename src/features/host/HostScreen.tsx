import { ConfirmButton } from "../../components/ConfirmButton.tsx";
import { useCanUndo, useGame, useGameDispatch } from "../../state/gameContext.ts";
import { winner } from "../../state/gameState.ts";
import { LivesPanel } from "../players/LivesPanel.tsx";
import { QuestionBrowser } from "../questions/QuestionBrowser.tsx";
import { AnswerReference } from "../reference/AnswerReference.tsx";
import { RoundPanel } from "../round/RoundPanel.tsx";
import { useRoundViewModel } from "../round/useRoundViewModel.ts";

export function HostScreen() {
  const game = useGame();
  const dispatch = useGameDispatch();
  const canUndo = useCanUndo();
  // One round view model shared by the table and the reference, so a click in
  // the reference fills the box the table shows as the target.
  const round = useRoundViewModel();
  const champion = winner(game);

  return (
    <>
      <header>
        <h1>🎯 Who Wants to Be a Krillionaire — Host</h1>
        <button
          type="button"
          title="Drag it to the shared screen and press Fullscreen. It never shows answers."
          onClick={() => window.open("#stage", "krillionaire-stage", "popup,width=1280,height=760")}
        >
          📺 Open participant screen
        </button>
        <button type="button" disabled={!canUndo} onClick={() => dispatch({ type: "undo" })}>
          ↶ Undo
        </button>
        <ConfirmButton className="danger" onConfirm={() => dispatch({ type: "returnToSetup" })}>
          New game
        </ConfirmButton>
      </header>

      <div className="grid">
        <QuestionBrowser />
        <div>
          {champion && <div className="winner">🏆 {champion.name} wins!</div>}
          <RoundPanel vm={round} />
          <AnswerReference vm={round} />
        </div>
        <LivesPanel />
      </div>
    </>
  );
}
