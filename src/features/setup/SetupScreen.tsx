import { useState, type FormEvent } from "react";
import { useToast } from "../../components/toastContext.ts";
import { useGame, useGameDispatch } from "../../state/gameContext.ts";

const PRESET_LIVES = [3, 5];

export function SetupScreen() {
  const game = useGame();
  const dispatch = useGameDispatch();
  const toast = useToast();
  const [names, setNames] = useState(game.players.map((p) => p.name).join("\n"));
  const [lives, setLives] = useState(game.startingLives);

  const start = (e: FormEvent) => {
    e.preventDefault();
    const list = names.split("\n").map((n) => n.trim()).filter(Boolean);
    if (list.length < 2) {
      toast("Add at least two players.");
      return;
    }
    dispatch({ type: "startGame", names: list, lives });
  };

  return (
    <form className="setup panel" onSubmit={start}>
      <h1>🎯 Who Wants to Be a Krillionaire</h1>
      <p className="meta">Everyone answers. If anyone else gives the same answer, you both lose a life. Last one standing wins.</p>

      <label htmlFor="names">Players (one per line)</label>
      <textarea
        id="names"
        rows={10}
        placeholder={"Alice\nBob\nCharlie"}
        value={names}
        onChange={(e) => setNames(e.target.value)}
      />

      <label htmlFor="lives">Lives each</label>
      <div className="row">
        {PRESET_LIVES.map((n) => (
          <button type="button" key={n} className={lives === n ? "primary" : undefined} onClick={() => setLives(n)}>
            {n}
          </button>
        ))}
        <input
          id="lives"
          type="number"
          min={1}
          max={20}
          style={{ width: 80 }}
          value={lives}
          onChange={(e) => setLives(Math.max(1, Number(e.target.value) || 1))}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <button type="submit" className="primary">
          Start game →
        </button>
      </div>
    </form>
  );
}
