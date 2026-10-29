import { initialGameState, type GameStore } from "./gameState.ts";

/** Persistence port: the provider depends on this, not on localStorage directly. */
export interface GameStorage {
  load(): GameStore | null;
  save(store: GameStore): void;
  /** Called when another window (e.g. the scoreboard) changes the saved game. */
  subscribe(listener: (store: GameStore) => void): () => void;
}

const STORAGE_KEY = "krillionaire.v2";

function parse(raw: string | null): GameStore | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<GameStore>;
    if (!data.game || !Array.isArray(data.game.players)) return null;
    // Fill in any fields added since the game was saved.
    return { game: { ...initialGameState, ...data.game }, past: Array.isArray(data.past) ? data.past : [] };
  } catch {
    return null;
  }
}

export function createLocalStorageGameStorage(key = STORAGE_KEY): GameStorage {
  return {
    load() {
      try {
        return parse(window.localStorage.getItem(key));
      } catch {
        return null; // storage blocked (private window etc.): start fresh
      }
    },
    save(store) {
      try {
        window.localStorage.setItem(key, JSON.stringify(store));
      } catch {
        // Not fatal: the game still works for this window, it just won't survive a refresh.
      }
    },
    subscribe(listener) {
      const onStorage = (e: StorageEvent) => {
        if (e.key !== key) return;
        const store = parse(e.newValue);
        if (store) listener(store);
      };
      window.addEventListener("storage", onStorage);
      return () => window.removeEventListener("storage", onStorage);
    },
  };
}

export function createMemoryGameStorage(initial: GameStore | null = null): GameStorage {
  let saved = initial;
  return {
    load: () => saved,
    save: (store) => {
      saved = store;
    },
    subscribe: () => () => {},
  };
}
