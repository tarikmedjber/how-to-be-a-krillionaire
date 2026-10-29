import { useState, type FormEvent } from "react";
import { Hearts } from "../../components/Hearts.tsx";
import { useGame, useGameDispatch } from "../../state/gameContext.ts";
import { alivePlayers, type GameRules } from "../../state/gameState.ts";
import { HistoryLog } from "./HistoryLog.tsx";

const RULE_LABELS: Record<keyof GameRules, string> = {
  blankLoses: "No answer loses a life",
  invalidLoses: "Wrong answer (not in list) loses a life",
};

export function LivesPanel() {
  const game = useGame();
  const dispatch = useGameDispatch();
  const [newName, setNewName] = useState("");

  const addPlayer = (e: FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    dispatch({ type: "addPlayer", name: newName });
    setNewName("");
  };

  return (
    <div className="panel">
      <h2>
        Lives · {alivePlayers(game).length} of {game.players.length} left
      </h2>
      {game.players.map((p) => (
        <div key={p.id} className={`player${p.lives <= 0 ? " out" : ""}`}>
          <span className="name">{p.name}</span>
          <Hearts lives={p.lives} max={game.startingLives} />
          <button
            type="button"
            className="small"
            aria-label={`Remove a life from ${p.name}`}
            onClick={() => dispatch({ type: "adjustLives", playerId: p.id, delta: -1 })}
          >
            −
          </button>
          <button
            type="button"
            className="small"
            aria-label={`Give ${p.name} a life`}
            onClick={() => dispatch({ type: "adjustLives", playerId: p.id, delta: 1 })}
          >
            +
          </button>
        </div>
      ))}

      <form className="row" style={{ marginTop: 10 }} onSubmit={addPlayer}>
        <input placeholder="Add player…" value={newName} onChange={(e) => setNewName(e.target.value)} />
        <button type="submit">Add</button>
      </form>

      {(Object.keys(RULE_LABELS) as (keyof GameRules)[]).map((rule, i) => (
        <label key={rule} className="row" style={i === 0 ? { marginTop: 12 } : undefined}>
          <input
            type="checkbox"
            style={{ width: "auto" }}
            checked={game.rules[rule]}
            onChange={(e) => dispatch({ type: "setRule", rule, value: e.target.checked })}
          />
          {RULE_LABELS[rule]}
        </label>
      ))}

      <h2 style={{ marginTop: 16 }}>History</h2>
      <HistoryLog entries={game.log} />
    </div>
  );
}
