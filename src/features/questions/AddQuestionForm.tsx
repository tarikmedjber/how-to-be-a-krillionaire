import { useState, type FormEvent } from "react";
import { useToast } from "../../components/toastContext.ts";
import { customQuestionDef } from "../../domain/questionBank.ts";
import { useGameDispatch } from "../../state/gameContext.ts";

export function AddQuestionForm() {
  const dispatch = useGameDispatch();
  const toast = useToast();
  const [prompt, setPrompt] = useState("");
  const [answers, setAnswers] = useState("");
  const [open, setOpen] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast("Enter a question.");
      return;
    }
    dispatch({ type: "addCustomQuestion", question: customQuestionDef(prompt, answers, open) });
    setPrompt("");
    setAnswers("");
    setOpen(false);
    toast("Question added under Custom.");
  };

  return (
    <details style={{ marginTop: 10 }}>
      <summary>➕ Add your own question</summary>
      <form onSubmit={submit}>
        <input
          placeholder="Question, e.g. Name a Beatles song"
          style={{ marginTop: 6 }}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <textarea
          rows={4}
          style={{ marginTop: 6 }}
          placeholder="Answers, comma separated. Use | for alternative spellings (UK|Britain), * for debatable."
          value={answers}
          onChange={(e) => setAnswers(e.target.value)}
        />
        <label className="row" style={{ marginTop: 6 }}>
          <input type="checkbox" style={{ width: "auto" }} checked={open} onChange={(e) => setOpen(e.target.checked)} />
          List isn't complete (unlisted answers allowed)
        </label>
        <button type="submit" className="primary" style={{ marginTop: 6 }}>
          Add question
        </button>
      </form>
    </details>
  );
}
