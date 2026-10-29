import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App.tsx";
import { ToastProvider } from "./components/ToastProvider.tsx";
import { GameProvider } from "./state/GameProvider.tsx";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastProvider>
      <GameProvider>
        <App />
      </GameProvider>
    </ToastProvider>
  </StrictMode>,
);
