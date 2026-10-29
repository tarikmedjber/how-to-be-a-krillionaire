import type { RoundLogEntry } from "../../state/gameState.ts";

export function HistoryLog({ entries }: { entries: readonly RoundLogEntry[] }) {
  if (!entries.length) return <div className="log">Nothing yet.</div>;
  return (
    <div className="log">
      {entries.map((entry, i) => (
        <div key={entries.length - i}>
          <b>{entry.prompt}</b> —{" "}
          {entry.losers.length
            ? `lost a life: ${entry.losers.map((l) => (l.answer ? `${l.name} (“${l.answer}”)` : l.name)).join(", ")}`
            : "nobody lost a life"}
          {entry.hostAnswer && ` · host said “${entry.hostAnswer}”`}
        </div>
      ))}
    </div>
  );
}
