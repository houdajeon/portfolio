"use client";

import { useSyncExternalStore } from "react";
import { buttonStyles } from "@/components/ui/button-styles";
import { Moon, Sun } from "@/components/ui/icons";

// The theme lives on <html class="dark">, set by the head script before React loads.
// useSyncExternalStore reads it without a hydration mismatch: the server assumes dark.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}
const getSnapshot = () => document.documentElement.classList.contains("dark");
const getServerSnapshot = () => true;

export function ThemeToggle({ toDark, toLight }: { toDark: string; toLight: string }) {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next = !isDark;
    const root = document.documentElement;
    root.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // Storage blocked (private mode): the theme still applies for this visit.
    }
  }

  const label = isDark ? toLight : toDark;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={buttonStyles.icon}
    >
      <Sun className="hidden size-4 dark:block" />
      <Moon className="size-4 dark:hidden" />
    </button>
  );
}
