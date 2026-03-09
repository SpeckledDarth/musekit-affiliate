"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  function cycle() {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  }

  return (
    <button
      onClick={cycle}
      className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
      title={`Theme: ${theme}`}
    >
      {theme === "light" && <Sun className="w-5 h-5" />}
      {theme === "dark" && <Moon className="w-5 h-5" />}
      {theme === "system" && <Monitor className="w-5 h-5" />}
    </button>
  );
}
