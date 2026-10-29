import { useState, type KeyboardEvent, type Ref } from "react";
import type { AnswerMatcher } from "../../domain/answers.ts";

interface Props {
  value: string;
  matcher: AnswerMatcher;
  placeholder: string;
  isTarget: boolean;
  inputRef?: Ref<HTMLInputElement>;
  onChange: (text: string) => void;
  onFocus: () => void;
  /** Enter pressed: move on to the next player's box. */
  onDone: () => void;
}

/** Text box with type-ahead suggestions from the question's answer list. */
export function AnswerInput({ value, matcher, placeholder, isTarget, inputRef, onChange, onFocus, onDone }: Props) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const suggestions = open ? matcher.suggest(value) : [];
  const active = Math.min(highlight, suggestions.length - 1);

  const pick = (canonical: string) => {
    onChange(canonical);
    setOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      const step = e.key === "ArrowDown" ? 1 : -1;
      setHighlight((active + step + suggestions.length) % suggestions.length);
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const chosen = suggestions[active];
      if (chosen) pick(chosen.entry.canonical);
      onDone();
    }
  };

  return (
    <div className="anscell">
      <input
        ref={inputRef}
        className={isTarget ? "target" : undefined}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        aria-label={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setHighlight(0);
        }}
        onFocus={onFocus}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
      />
      {suggestions.length > 0 && (
        <div className="sug" role="listbox">
          {suggestions.map((s, i) => (
            <div
              key={s.entry.canonical}
              role="option"
              aria-selected={i === active}
              className={i === active ? "on" : undefined}
              // mousedown + preventDefault keeps focus in the input
              onMouseDown={(e) => {
                e.preventDefault();
                pick(s.entry.canonical);
              }}
            >
              {s.entry.canonical}
              {s.via !== s.entry.canonical && <span className="meta">({s.via})</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
