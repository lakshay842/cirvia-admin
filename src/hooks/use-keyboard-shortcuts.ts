"use client";

import { useEffect } from "react";
import { useCommandPaletteStore } from "@/store/command-palette-store";
import { useSearchStore } from "@/store/search-store";
import { useShortcutsStore } from "@/store/shortcuts-store";

export function useKeyboardShortcuts() {
  const toggleCommand = useCommandPaletteStore((s) => s.toggle);
  const setSearchOpen = useSearchStore((s) => s.setOpen);
  const setShortcutsOpen = useShortcutsStore((s) => s.setOpen);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      const target = e.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggleCommand();
        return;
      }

      if (mod && e.key === "/" && !isTyping) {
        e.preventDefault();
        setShortcutsOpen(true);
        return;
      }

      if (mod && e.shiftKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggleCommand, setSearchOpen, setShortcutsOpen]);
}
