interface Props {
  lives: number;
  max: number;
}

export function Hearts({ lives, max }: Props) {
  const total = Math.max(lives, max);
  return (
    <span className="hearts" aria-label={`${lives} ${lives === 1 ? "life" : "lives"}`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={i < lives ? undefined : "e"}>
          ♥
        </span>
      ))}
    </span>
  );
}
