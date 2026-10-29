import type { Badge } from "../domain/round.ts";

export function Badges({ badges }: { badges: readonly Badge[] }) {
  return (
    <>
      {badges.map((b) => (
        <span key={b.label} className={`badge b-${b.tone}`}>
          {b.label}
        </span>
      ))}
    </>
  );
}
