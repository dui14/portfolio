import { useEffect, useState } from "react";

import { themes, type Theme } from "../lib/themes.ts";
import { ThemeContext } from "./themeContext.ts";

const STORAGE_KEY = "duii-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return themes[0];

  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored) {
    const found = themes.find((t) => t.id === stored);
    if (found) return found;
  }

  return themes[0];
}

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--bg",
      theme.background
    );

    document.documentElement.style.setProperty(
      "--text",
      theme.text
    );

    document.documentElement.style.setProperty(
      "--accent",
      theme.accent
    );

    document.documentElement.style.setProperty(
      "--on-accent-fallback",
      theme.onAccent
    );

    localStorage.setItem(STORAGE_KEY, theme.id);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
