"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type ThemeChoice = "dark" | "light" | "system";

type ThemeContextValue = {
  theme: ThemeChoice;
  resolvedTheme: "dark" | "light";
  setTheme: (theme: ThemeChoice) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeChoice>("system");
  const [systemTheme, setSystemTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("krish-os-theme") as ThemeChoice | null;
    if (saved === "dark" || saved === "light" || saved === "system") setThemeState(saved);
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const sync = () => setSystemTheme(media.matches ? "light" : "dark");
    sync();
    media.addEventListener("change", sync);
    setMounted(true);
    return () => media.removeEventListener("change", sync);
  }, []);

  const setTheme = useCallback((next: ThemeChoice) => {
    setThemeState(next);
    window.localStorage.setItem("krish-os-theme", next);
  }, []);

  const resolvedTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
  }, [mounted, resolvedTheme]);

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
      <button className="icon-button theme-trigger" aria-label="Choose color theme" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
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
