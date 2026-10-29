/**
 * Who a click in the answer reference fills in: the box the host last focused,
 * otherwise the first answerer without an answer yet.
 */
export function resolveFillTarget(
  answererIds: readonly string[],
  answers: Readonly<Record<string, string>>,
  preferredId: string | null,
): string | null {
  if (preferredId && answererIds.includes(preferredId)) return preferredId;
  return answererIds.find((id) => !answers[id]?.trim()) ?? null;
}

/** The next answerer (wrapping round) who still has no answer. */
export function nextEmptyAfter(
  answererIds: readonly string[],
  answers: Readonly<Record<string, string>>,
  fromId: string,
): string | null {
  const i = answererIds.indexOf(fromId);
  const rotated = [...answererIds.slice(i + 1), ...answererIds.slice(0, Math.max(i, 0))];
  return rotated.find((id) => !answers[id]?.trim()) ?? null;
}
