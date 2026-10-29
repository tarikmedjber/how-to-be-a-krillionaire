import { HostScreen } from "../features/host/HostScreen.tsx";
import { SetupScreen } from "../features/setup/SetupScreen.tsx";
import { StageScreen } from "../features/stage/StageScreen.tsx";
import { useGame } from "../state/gameContext.ts";
import { useHashRoute } from "./useHashRoute.ts";

/** "#stage" (or the old "#board") opens the participant screen. */
const STAGE_ROUTES = ["#stage", "#board"];

export function App() {
  const route = useHashRoute();
  const { phase } = useGame();

  if (STAGE_ROUTES.includes(route)) return <StageScreen />;
  return phase === "setup" ? <SetupScreen /> : <HostScreen />;
}
