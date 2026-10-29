import { AddQuestionForm } from "./AddQuestionForm.tsx";
import { useQuestionBrowser } from "./useQuestionBrowser.ts";

export function QuestionBrowser() {
  const vm = useQuestionBrowser();

  return (
    <div className="panel">
      <h2>Questions</h2>
      <div className="row">
        <input placeholder="Search questions…" value={vm.search} onChange={(e) => vm.setSearch(e.target.value)} />
        <button type="button" title="Random unused question" onClick={vm.pickRandom}>
          🎲 Random
        </button>
      </div>

      <div className="qlist">
        {vm.groups.map((g) => (
          <div key={g.category}>
            <button
              type="button"
              className="qcat"
              aria-expanded={g.open}
              onClick={() => vm.toggleCategory(g.category)}
            >
              {g.open ? "▾" : "▸"} {g.category}
              <span className="n">
                {g.remaining}/{g.questions.length}
              </span>
            </button>
            {g.open &&
              g.questions.map((q) => {
                const used = vm.isUsed(q.id);
                const active = q.id === vm.currentId;
                return (
                  <button
                    type="button"
                    key={q.id}
                    disabled={used}
                    title={used ? "Already used this game" : undefined}
                    className={`qitem${active ? " active" : ""}${used ? " used" : ""}`}
                    onClick={() => vm.select(q.id)}
                  >
                    <span>{q.prompt}</span>
                    <span className="n">
                      {q.answers.length}
                      {q.open && "+"}
                    </span>
                  </button>
                );
              })}
          </div>
        ))}
      </div>

      <AddQuestionForm />
    </div>
  );
}
