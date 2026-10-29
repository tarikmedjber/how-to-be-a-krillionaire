import { useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  document.addEventListener("fullscreenchange", onChange);
  return () => document.removeEventListener("fullscreenchange", onChange);
};

export function useFullscreen() {
  const isFullscreen = useSyncExternalStore(subscribe, () => document.fullscreenElement !== null);
  const toggle = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.().catch(() => {});
  };
  return { isFullscreen, toggle };
}
