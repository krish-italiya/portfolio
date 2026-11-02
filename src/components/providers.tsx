"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";

export type ThemeChoice = "dark" | "light" | "system";

type ThemeContextValue = {
  theme: ThemeChoice;
  resolvedTheme: "dark" | "light";
  setTheme: (theme: ThemeChoice) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readTheme(): ThemeChoice {
  const saved = window.localStorage.getItem("krish-os-theme");
  return saved === "dark" || saved === "light" || saved === "system" ? saved : "system";
}
function subscribeTheme(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("krish-os-theme-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("krish-os-theme-change", callback);
  };
}
function readSystemTheme(): "dark" | "light" {
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}
function subscribeSystemTheme(callback: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: light)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => "system");
  const systemTheme = useSyncExternalStore(subscribeSystemTheme, readSystemTheme, () => "dark");
  const resolvedTheme = theme === "system" ? systemTheme : theme;

  const setTheme = useCallback((next: ThemeChoice) => {
    window.localStorage.setItem("krish-os-theme", next);
    window.dispatchEvent(new Event("krish-os-theme-change"));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const value = useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme, setTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside ThemeProvider");
  return value;
}

export function ThemeControl() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const options: { value: ThemeChoice; label: string; symbol: string }[] = [
    { value: "system", label: "System", symbol: "◐" },
    { value: "dark", label: "Dark", symbol: "☾" },
    { value: "light", label: "Light", symbol: "☼" }
  ];

  return (
    <div className="theme-control">
      <button className="icon-button theme-trigger" aria-label="Choose color theme" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <span aria-hidden="true">{options.find((option) => option.value === theme)?.symbol}</span>
        <span className="theme-trigger-label">{theme}</span>
      </button>
      {open && (
        <div className="theme-menu" role="menu">
          {options.map((option) => (
            <button key={option.value} role="menuitemradio" aria-checked={theme === option.value} onClick={() => { setTheme(option.value); setOpen(false); }}>
              <span>{option.symbol}</span>{option.label}{theme === option.value && <span className="theme-check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
