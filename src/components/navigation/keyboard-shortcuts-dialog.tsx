"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useShortcutsStore } from "@/store/shortcuts-store";

const SHORTCUTS = [
  { keys: ["Ctrl", "K"], mac: ["⌘", "K"], description: "Open command palette" },
  { keys: ["Ctrl", "/"], mac: ["⌘", "/"], description: "Show keyboard shortcuts" },
  { keys: ["Ctrl", "Shift", "F"], mac: ["⌘", "Shift", "F"], description: "Open global search" },
  { keys: ["Esc"], mac: ["Esc"], description: "Close dialogs and menus" },
] as const;

function KeyBadge({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px]">
      {children}
    </kbd>
  );
}

export function KeyboardShortcutsDialog() {
  const { open, setOpen } = useShortcutsStore();
  const isMac = typeof navigator !== "undefined" && /Mac/.test(navigator.platform);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
          <p className="text-sm text-muted-foreground">Navigate the admin dashboard faster.</p>
        </DialogHeader>
        <ul className="space-y-3">
          {SHORTCUTS.map((shortcut) => {
            const keys = isMac ? shortcut.mac : shortcut.keys;
            return (
              <li key={shortcut.description} className="flex items-center justify-between gap-4 text-sm">
                <span>{shortcut.description}</span>
                <span className="flex items-center gap-1">
                  {keys.map((key, index) => (
                    <KeyBadge key={`${shortcut.description}-${key}-${index}`}>{key}</KeyBadge>
                  ))}
                </span>
              </li>
            );
          })}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
