import { createContext } from "react";

import type { Theme } from "../lib/themes.ts";

export type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);
