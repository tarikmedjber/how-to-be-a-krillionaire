import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../../app/App.tsx";
import { ToastProvider } from "../../components/ToastProvider.tsx";
import type { Question } from "../../domain/types.ts";
import { GameProvider } from "../../state/GameProvider.tsx";
import { initialGameState } from "../../state/gameState.ts";
import { createMemoryGameStorage } from "../../state/storage.ts";

const questions: Question[] = [
  {
    id: "months",
    category: "Culture",
    prompt: "Name a month of the year",
    answers: ["January", "March", "May", "July", "Massachusetts*"],
  },
];

function renderGame(players = ["Alice", "Bob", "Cara"]) {
  const storage = createMemoryGameStorage({
    game: { ...initialGameState, phase: "play", players: players.map((name, i) => ({ id: i + 1, name, lives: 5 })) },
    past: [],
  });
  render(
    <ToastProvider>
      <GameProvider storage={storage} questions={questions}>
        <App />
      </GameProvider>
    </ToastProvider>,
  );
  return storage;
}

const reference = () => screen.getByText(/Answer reference/).closest(".panel") as HTMLElement;

describe("HostScreen", () => {
  it("plays a round end to end: pick, fill from the reference, apply, undo", async () => {
    const user = userEvent.setup();
    const storage = renderGame();

    await user.click(screen.getByRole("button", { name: /Culture/ }));
    await user.click(screen.getByRole("button", { name: /Name a month of the year/ }));

    // Each click fills the next player in turn.
    await user.click(within(reference()).getByText("July"));
    await user.click(within(reference()).getByText("July"));
    await user.click(within(reference()).getByText("May"));

    expect(screen.getAllByText("Clash: Alice")).toHaveLength(1);
    expect(screen.getByRole("button", { name: /2 lose a life/ })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Apply round/ }));
    expect(storage.load()?.game.players.map((p) => p.lives)).toEqual([4, 4, 5]);
    expect(screen.getByText(/Round 1 done/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Name a month of the year/ })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: /Undo/ }));
    expect(storage.load()?.game.players.map((p) => p.lives)).toEqual([5, 5, 5]);
    expect(screen.getByDisplayValue("May")).toBeInTheDocument();
  });

  it("suggests answers as you type and Enter picks the top one", async () => {
    const user = userEvent.setup();
    renderGame();
    await user.click(screen.getByRole("button", { name: /Culture/ }));
    await user.click(screen.getByRole("button", { name: /Name a month of the year/ }));

    const [first] = screen.getAllByLabelText("type answer…");
    await user.type(first!, "jnuary");
    expect(screen.getByRole("option", { name: "January" })).toBeInTheDocument();
    await user.keyboard("{Enter}");
    expect(first).toHaveValue("January");
  });

  it("plays the final two against the host", async () => {
    const user = userEvent.setup();
    renderGame(["Alice", "Bob"]);
    await user.click(screen.getByRole("button", { name: /Culture/ }));
    await user.click(screen.getByRole("button", { name: /Name a month of the year/ }));

    const [alice, bob, host] = screen.getAllByRole("textbox").filter((el) => el.closest("table"));
    await user.type(alice!, "July");
    await user.type(bob!, "July");
    await user.type(host!, "March");
    expect(screen.getByRole("button", { name: /0 lose a life/ })).toBeInTheDocument();
  });
});
