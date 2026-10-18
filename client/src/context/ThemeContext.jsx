import { createContext, useContext, useEffect, useState } from "react";

const THEMES = ["dark", "light"];
const STORAGE_KEY = "skillnode-theme";

const ThemeContext = createContext({
  theme: "dark",
  cycleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "dark-purple") return "dark";
      if (stored === "light-white" || stored === "light-blue") return "light";
      return THEMES.includes(stored) ? stored : "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch { /* noop */ }
  }, [theme]);

  function setTheme(t) {
    if (THEMES.includes(t)) setThemeState(t);
  }

  function cycleTheme() {
    const next = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
    setThemeState(next);
  }

  return (
    <ThemeContext.Provider value={{ theme, cycleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
