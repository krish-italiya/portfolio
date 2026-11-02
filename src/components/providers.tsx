"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore
} from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";
type ThemeContextValue = {
  theme: Theme;
  toggleTheme: (origin: { x: number; y: number }) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getThemeSnapshot(): Theme {
  return window.localStorage.getItem("krish-portfolio-theme") === "light" ? "light" : "dark";
}

function getServerThemeSnapshot(): Theme {
  return "dark";
}

function subscribeTheme(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("krish-theme-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("krish-theme-change", callback);
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);

  const toggleTheme = useCallback((origin: { x: number; y: number }) => {
    const next: Theme = getThemeSnapshot() === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.style.setProperty("--theme-origin-x", origin.x + "px");
    root.style.setProperty("--theme-origin-y", origin.y + "px");
    root.dataset.theme = next;
    root.style.colorScheme = next;
    root.classList.remove("theme-ripple");
    void root.offsetWidth;
    root.classList.add("theme-ripple");
    window.localStorage.setItem("krish-portfolio-theme", next);
    window.dispatchEvent(new Event("krish-theme-change"));
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside ThemeProvider");
  return value;
}

export function ThemeControl() {
  const { theme, toggleTheme } = useTheme();

  const onToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    toggleTheme({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    });
  };

  return (
    <button
      type="button"
      className="theme-control"
      onClick={onToggle}
      aria-label={"Switch to " + (theme === "dark" ? "light" : "dark") + " theme"}
      aria-pressed={theme === "light"}
      title={"Switch to " + (theme === "dark" ? "light" : "dark") + " theme"}
    >
      <span className="theme-icon" key={theme}>
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </span>
      <span className="theme-control-label">{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}
