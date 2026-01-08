import { useEffect } from "react";

export const useStyle = () => {
  useEffect(() => {
    document.documentElement.style.background = "transparent";
    document.body.style.background = "transparent";
    document.body.style.margin = "0";
    document.body.style.overflow = "hidden";

    const rootEl: HTMLDivElement | null = document.querySelector("#root");
    if (rootEl) {
      rootEl.style.background = "rgba(0, 0, 0, 0)";
      rootEl.style.overflow = "hidden";
    }

    return () => {
      const rootEl: HTMLDivElement | null = document.querySelector("#root");
      if (rootEl) {
        rootEl.style.removeProperty("background");
        rootEl.style.removeProperty("overflow");
      }
      document.documentElement.style.removeProperty("background");
      document.body.style.removeProperty("background");
      document.body.style.removeProperty("margin");
      document.body.style.removeProperty("overflow");
    };
  }, []);
};
