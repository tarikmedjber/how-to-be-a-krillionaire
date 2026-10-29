import { useState } from "react";
import { normalize } from "../../domain/text.ts";
import type { RoundViewModel } from "../round/useRoundViewModel.ts";

const STATUS_CLASS = { clash: "taken", given: "picked" } as const;

export function AnswerReference({ vm }: { vm: RoundViewModel }) {
  const [filter, setFilter] = useState("");
  // Reset the lookup box whenever the question changes.
  const [filterFor, setFilterFor] = useState(vm.question?.id);
  if (filterFor !== vm.question?.id) {
    setFilterFor(vm.question?.id);
    setFilter("");
  }

  if (!vm.matcher) return null;
  const needle = normalize(filter);
  const entries = vm.matcher.entries.filter((e) => !needle || e.keys.some((k) => k.includes(needle)));

  return (
    <div className="panel" style={{ marginTop: 16 }}>
      <h2>
        Answer reference{" "}
        <span style={{ textTransform: "none", fontWeight: 400 }}>
          — <span style={{ color: "var(--bad)" }}>red</span> = clash, <span style={{ color: "var(--ok)" }}>green</span>{" "}
          = given/safe, <span style={{ color: "var(--warn)" }}>amber</span> = debatable
        </span>
      </h2>
      <input placeholder="Look up an answer…" value={filter} onChange={(e) => setFilter(e.target.value)} />
      <div className="meta" style={{ marginTop: 6 }}>
        {vm.targetName ? (
          <>
            👆 Click an answer to fill it in for <b>{vm.targetName}</b>
          </>
        ) : (
          "Everyone has an answer. Click a player's box first to change theirs."
        )}
      </div>

      <div className="answers">
        {entries.length === 0 && <span className="meta">No match in list.</span>}
        {entries.map((e) => {
          const status = vm.referenceStatus.get(e.canonical);
          const className = status ? STATUS_CLASS[status] : e.debatable ? "deb" : undefined;
          return (
            <div
              key={e.canonical}
              className={className}
              title={e.aliases.join(" / ")}
              onClick={() => vm.fillFromReference(e.canonical)}
            >
              {e.canonical}
              {e.aliases.length > 1 && <span className="meta"> ({e.aliases.slice(1).join(", ")})</span>}
              {e.debatable && " *"}
            </div>
          );
        })}
      </div>
    </div>
  );
}
