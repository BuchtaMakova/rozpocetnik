import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

/**
 * Reads CSS custom properties from :root whenever the theme changes.
 * Returns a stable object of resolved color strings.
 */
export function useThemeColors() {
  const { theme } = useTheme();

  const [colors, setColors] = useState(() => readColors());

  useEffect(() => {
    // Small timeout lets the browser apply the new data-theme attribute first
    const id = setTimeout(() => setColors(readColors()), 0);
    return () => clearTimeout(id);
  }, [theme]);

  return colors;
}

function readColors() {
  const s = getComputedStyle(document.documentElement);
  const get = (v: string) => s.getPropertyValue(v).trim();

  return {
    donut: [1, 2, 3, 4, 5, 6, 7].map((n) => get(`--color-donut-${n}`)),
    barPlanned: get("--color-bar-planned"),
    barActual:  get("--color-bar-actual"),
    danger:     get("--color-danger"),
  };
}
