import { matcherFor, type AnswerMatcher, type Match } from "./answers.ts";
import type { Question } from "./types.ts";

/** The host's answer lives alongside the players' answers under this id. */
export const HOST_ID = "host";
const HOST_NAME = "Host";

export type Override = "safe" | "lose";

export interface Badge {
  tone: "ok" | "warn" | "bad";
  label: string;
}

export interface RoundRules {
  blankLoses: boolean;
  invalidLoses: boolean;
  /** Final-round mode: only matching the host's answer costs a life. */
  hostPlaying: boolean;
}

export interface Contestant {
  id: string;
  name: string;
}

export interface ContestantResult extends Contestant {
  answer: string;
  match: Match | null;
  badges: Badge[];
  clash: boolean;
  override: Override | null;
  losesLife: boolean;
}

export interface HostResult {
  answer: string;
  match: Match | null;
  badges: Badge[];
  /** Names of players who gave the same answer as the host. */
  catches: string[];
}

export interface RoundEvaluation {
  contestants: ContestantResult[];
  host: HostResult | null;
  losers: ContestantResult[];
}

export interface RoundInput {
  question: Question;
  contestants: readonly Contestant[];
  answers: Readonly<Record<string, string>>;
  overrides: Readonly<Record<string, Override>>;
  rules: RoundRules;
}

function matchBadges(match: Match | null): Badge[] {
  if (!match) return [];
  const badges: Badge[] = [
    { tone: match.fuzzy ? "warn" : "ok", label: `${match.fuzzy ? "≈" : "✓"} ${match.entry.canonical}` },
  ];
  if (match.entry.debatable) badges.push({ tone: "warn", label: "debatable" });
  return badges;
}

function evaluateHost(matcher: AnswerMatcher, raw: string) {
  const answer = raw.trim();
  if (!answer) {
    return { answer, match: null, identity: null, badges: [{ tone: "warn", label: "Enter your answer" }] as Badge[] };
  }
  const match = matcher.match(answer);
  const badges = match ? matchBadges(match) : [{ tone: "warn", label: "Not in list" } as Badge];
  return { answer, match, identity: matcher.identity(answer), badges };
}

export function evaluateRound({ question, contestants, answers, overrides, rules }: RoundInput): RoundEvaluation {
  const matcher = matcherFor(question);
  const host = rules.hostPlaying ? evaluateHost(matcher, answers[HOST_ID] ?? "") : null;

  const drafts = contestants.map((c) => {
    const answer = (answers[c.id] ?? "").trim();
    const badges: Badge[] = [];
    if (!answer) {
      if (rules.blankLoses) badges.push({ tone: "bad", label: "No answer" });
      return { ...c, answer, match: null, identity: null, badges, invalid: false };
    }
    const match = matcher.match(answer);
    badges.push(...matchBadges(match));
    let invalid = false;
    if (!match) {
      if (question.open) badges.push({ tone: "warn", label: "Not in list — your call" });
      else {
        badges.push({ tone: "bad", label: "Not in list" });
        invalid = rules.invalidLoses;
      }
    }
    return { ...c, answer, match, identity: matcher.identity(answer), badges, invalid };
  });

  const namesByIdentity = new Map<string, string[]>();
  const record = (identity: string | null, name: string) => {
    if (identity) namesByIdentity.set(identity, [...(namesByIdentity.get(identity) ?? []), name]);
  };
  drafts.forEach((d) => record(d.identity, d.name));
  if (host) record(host.identity, HOST_NAME);

  const results: ContestantResult[] = drafts.map(({ identity, invalid, ...d }) => {
    const others = identity ? (namesByIdentity.get(identity) ?? []).filter((n) => n !== d.name) : [];
    let clash = false;
    if (rules.hostPlaying) {
      clash = others.includes(HOST_NAME);
      if (clash) d.badges.push({ tone: "bad", label: "Clash: Host" });
      const peers = others.filter((n) => n !== HOST_NAME);
      if (peers.length) d.badges.push({ tone: "ok", label: `Same as ${peers.join(", ")} (fine)` });
    } else if (others.length) {
      clash = true;
      d.badges.push({ tone: "bad", label: `Clash: ${others.join(", ")}` });
    }

    const autoLoses = (!d.answer && rules.blankLoses) || invalid || clash;
    const override = overrides[d.id] ?? null;
    const losesLife = override === "safe" ? false : override === "lose" ? true : autoLoses;
    return { ...d, clash, override, losesLife };
  });

  const hostResult: HostResult | null = host && {
    answer: host.answer,
    match: host.match,
    badges: host.badges,
    catches: host.identity ? drafts.filter((d) => d.identity === host.identity).map((d) => d.name) : [],
  };

  return { contestants: results, host: hostResult, losers: results.filter((r) => r.losesLife) };
}
