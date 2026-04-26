import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export type ThemeId = "pink" | "ocean" | "forest" | "purple" | "sunset";

export interface ThemeMeta {
  id: ThemeId;
  label: string;
  emoji: string;
  swatch: string; // tailwind-free hex for the preview dot
}

export const THEMES: ThemeMeta[] = [
  { id: "pink",   label: "Růžová",  emoji: "🌸", swatch: "#e11d48" },
  { id: "ocean",  label: "Oceán",   emoji: "🌊", swatch: "#1d4ed8" },
  { id: "forest", label: "Les",     emoji: "🌿", swatch: "#15803d" },
  { id: "purple", label: "Fialová", emoji: "🌙", swatch: "#7c3aed" },
  { id: "sunset", label: "Západ",   emoji: "🍊", swatch: "#c2410c" },
];

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "pink",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    return (localStorage.getItem("bp-theme") as ThemeId) ?? "pink";
  });

  const setTheme = (id: ThemeId) => {
    setThemeState(id);
    localStorage.setItem("bp-theme", id);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
