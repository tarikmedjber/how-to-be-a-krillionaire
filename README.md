# Who Wants to Be a Krillionaire

Host app for a team quiz. Everyone answers the same question; anyone whose answer
matches another player's loses a life. Last one standing wins. In the final round the
host plays too, and players only lose a life for matching the host.

## Running it

```bash
npm install
npm run dev        # http://localhost:8000
npm test           # unit + component tests
npm run lint
npm run build      # type-check + production build into dist/
```

### Host screen and participant screen

On the host screen, click **📺 Open participant screen**. A second window opens (route `#stage`); drag it to
the extended display and press **Fullscreen**. It shows:
- the current question, once you've clicked **Show on participant screen** (until then it's a private preview)
- each player's answer as soon as you enter it, with clashes flagged live
- after each round, what everyone said and who lost a life
- everyone's lives, and the winner at the end

It never shows the answer list, or the host's answer during the final round. Live clash flags are off in that
round, because they would give the host's answer away. Everything it shows goes through `toStageView()` in
`src/features/stage/stageView.ts`, which picks only the safe fields, and tests check that nothing else gets through. Both windows share the browser's storage, so they stay in sync without a server.

`legacy/index.html` is the original single-file version. It still works on its own if you open it in a browser.

## Architecture

The app follows an MVVM-style split. The dependencies point inwards: the UI depends on
state, and state depends on the domain. The domain has no React in it at all.

```
src/
  domain/        Model: pure TypeScript game rules, no React, no browser APIs
    text.ts          normalise / levenshtein
    answers.ts       parse "Canonical|alias*", match, suggest, identity (Holland = Netherlands)
    round.ts         evaluateRound(): who clashes, who loses a life, host mode
    fillTarget.ts    which box a click in the answer reference fills
    questionBank.ts  ids, grouping, random picks, custom questions
    derive.ts        builds variations ("elements beginning with D or E") from base lists
  data/          Question content only (one file per category) + the assembled bank
  state/         Application state
    gameState.ts     GameState / GameStore types + selectors
    gameReducer.ts   pure reducer with undo; question bank injected (createGameReducer)
    storage.ts       GameStorage port + localStorage and in-memory adapters
    GameProvider.tsx wires reducer + storage + cross-window sync into React context
    gameContext.ts   useGame / useGameDispatch / useQuestionBank hooks
  features/      View models (use*ViewModel / use*Browser hooks) + views, by feature
    round/  reference/  questions/  players/  setup/  scoreboard/  host/
  components/    Small shared presentational components (Hearts, Badges, Toast, ConfirmButton)
  app/           App shell + hash routing (#board = player-facing scoreboard)
```

### How the principles are applied

- **Single responsibility:** matching, round scoring, persistence and rendering each live in their own module. Components only render, view-model hooks prepare data and actions, and the reducer only changes state.
- **Dependency inversion:** the reducer receives the question bank (`createGameReducer(questions)`), and the provider receives a `GameStorage` interface. Tests swap in fixtures and in-memory storage without mocking anything.
- **Open/closed:**
  - To add a question, append it to a data file.
  - To add a variation, add one line in `derive.ts`.
  - To use a new storage backend, implement `GameStorage`.
  - None of these need changes to the existing logic.
- **DRY:** `evaluateCurrentRound` is the single mapping from game state to round rules. The reducer (applying a round) and the UI (live verdicts) both use it, so they can't disagree.
- **Immutable state + undo:** `GameStore = { game, past }`. Only meaningful actions (applying a round, changing lives, adding a player) are undoable.
- **Context split:** state and dispatch are separate contexts, so components that only dispatch don't re-render on every state change.

### Adding questions

Edit the file for the category in `src/data/questions/`. Answers use `"Canonical|alias|alias"`:
- A trailing `*` marks an answer as debatable.
- `open: true` means the list isn't exhaustive, so unlisted answers become the host's call instead of being wrong.

`src/data/questions.test.ts` checks every question has at least 4 answers and that no two answers normalise to the same key.
