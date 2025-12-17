"use client";

import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import styles from "./styles/theme-toggle.module.scss";

const THEME_KEY = "vague-playground-theme";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme ? savedTheme === "dark" : prefersDark;

    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle("dark", newIsDark);
    localStorage.setItem(THEME_KEY, newIsDark ? "dark" : "light");
  };

  return (
    <button
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      type="button"
    >
      {isDark ? <Sun className={styles.icon} /> : <Moon className={styles.icon} />}
    </button>
  );
}
