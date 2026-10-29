import { useRef } from "react";
import { Badges } from "../../components/Badges.tsx";
import { Hearts } from "../../components/Hearts.tsx";
import { HOST_ID, type Override } from "../../domain/round.ts";
import { useGame } from "../../state/gameContext.ts";
import { AnswerInput } from "./AnswerInput.tsx";
import type { RoundViewModel } from "./useRoundViewModel.ts";

export function RoundPanel({ vm }: { vm: RoundViewModel }) {
  const { players } = useGame();
  const inputs = useRef(new Map<string, HTMLInputElement>());
  const { question, matcher, evaluation } = vm;

  if (!question || !matcher || !evaluation) return <EmptyRound />;

  const order = [...evaluation.contestants.map((c) => c.id), ...(evaluation.host ? [HOST_ID] : [])];
  const focusNext = (id: string) => inputs.current.get(order[order.indexOf(id) + 1] ?? "")?.focus();
  const registerInput = (id: string) => (el: HTMLInputElement | null) => {
    if (el) inputs.current.set(id, el);
    else inputs.current.delete(id);
  };
  const answerInput = (id: string, placeholder: string) => (
    <AnswerInput
      value={vm.answers[id] ?? ""}
      matcher={matcher}
      placeholder={placeholder}
      isTarget={vm.targetId === id}
      inputRef={registerInput(id)}
      onChange={(text) => vm.setAnswer(id, text)}
      onFocus={() => vm.focusAnswerer(id)}
      onDone={() => focusNext(id)}
    />
  );
  const losing = evaluation.losers.length;

  return (
    <div className="panel">
      <div className="meta">
        {question.category} · {question.answers.length} listed answers{question.open && " (not exhaustive)"}
      </div>
      <div className="prompt">{question.prompt}</div>
      <StageStatus shown={vm.questionShown} onChange={vm.setQuestionShown} />

      <table>
        <thead>
          <tr>
            <th style={{ width: "22%" }}>Player</th>
            <th style={{ width: "28%" }}>Their answer</th>
            <th>Check</th>
            <th style={{ width: 120 }}>Verdict</th>
          </tr>
        </thead>
        <tbody>
          {evaluation.contestants.map((r) => {
            const lives = players.find((p) => String(p.id) === r.id)?.lives ?? 0;
            return (
              <tr key={r.id}>
                <td>
                  <b>{r.name}</b>
                  <br />
                  <Hearts lives={lives} max={vm.startingLives} />
                </td>
                <td>{answerInput(r.id, "type answer…")}</td>
                <td>
                  <Badges badges={r.badges} />
                </td>
                <td>
                  <select
                    aria-label={`Verdict for ${r.name}`}
                    value={r.override ?? "auto"}
                    onChange={(e) => vm.setOverride(r.id, e.target.value === "auto" ? null : (e.target.value as Override))}
                  >
                    <option value="auto">Auto</option>
                    <option value="safe">Force safe</option>
                    <option value="lose">Force lose</option>
                  </select>
                  <div className={r.losesLife ? "verdict-lose" : "verdict-safe"}>{r.losesLife ? "− 1 life" : "Safe"}</div>
                </td>
              </tr>
            );
          })}

          {evaluation.host && (
            <tr className="hostrow">
              <td>
                <b>🎩 You (host)</b>
                <br />
                <span className="meta">can't lose lives</span>
              </td>
              <td>{answerInput(HOST_ID, "your answer…")}</td>
              <td>
                <Badges badges={evaluation.host.badges} />
                {evaluation.host.catches.length > 0 && (
                  <span className="badge b-bad">Catches: {evaluation.host.catches.join(", ")}</span>
                )}
              </td>
              <td>
                <button type="button" className="small" onClick={vm.randomHostAnswer}>
                  🎲 Random
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <label className="row" style={{ marginTop: 10 }}>
        <input
          type="checkbox"
          style={{ width: "auto" }}
          checked={vm.hostPlaying}
          onChange={(e) => vm.setHostPlaying(e.target.checked)}
        />
        Play against me: players only lose a life if they match my answer (matching each other is fine)
      </label>

      <div className="row" style={{ marginTop: 14 }}>
        <button type="button" className="primary" onClick={vm.applyRound}>
          ✅ Apply round ({losing} lose{losing === 1 ? "s" : ""} a life)
        </button>
        <button type="button" onClick={vm.clearAnswers}>
          Clear answers
        </button>
        <span className="meta">
          Clashes are matched on the canonical answer, so “Holland” clashes with “Netherlands”. ≈ means a close spelling
          match. Check it.
        </span>
      </div>
    </div>
  );
}

function StageStatus({ shown, onChange }: { shown: boolean; onChange: (shown: boolean) => void }) {
  return shown ? (
    <div className="stage-status live">
      <span>📺 Live on the participant screen</span>
      <button type="button" className="small" onClick={() => onChange(false)}>
        Hide
      </button>
    </div>
  ) : (
    <div className="stage-status hidden">
      <span>🙈 Preview only: participants can't see this question yet</span>
      <button type="button" className="primary" onClick={() => onChange(true)}>
        📺 Show on participant screen
      </button>
    </div>
  );
}

function EmptyRound() {
  const { usedQuestionIds } = useGame();
  return (
    <div className="panel">
      <div className="prompt">
        {usedQuestionIds.length
          ? `Round ${usedQuestionIds.length} done. Pick the next question →`
          : "Pick a question on the left →"}
      </div>
      <p className="meta">
        Or hit 🎲 Random. Enter each player's answer and the app flags clashes, invalid answers and spelling matches.
        Then apply the round.
      </p>
    </div>
  );
}
