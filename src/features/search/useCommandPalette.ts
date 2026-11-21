import { useSyncExternalStore } from "react";

import type { Command } from "./commands.ts";
import { buildCommands } from "./commands.ts";
import { useLanguage } from "../../context/useLanguage.ts";

type PaletteState = {
  isOpen: boolean;
  query: string;
};

let state: PaletteState = { isOpen: false, query: "" };

const listeners = new Set<() => void>();

function setState(next: Partial<PaletteState>) {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

if (typeof document !== "undefined") {
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      setState({ isOpen: !state.isOpen, query: "" });
    }
  });
}

export function useCommandPalette() {
  const { language, t } = useLanguage();
  const commands = buildCommands(t, language);
  const { isOpen, query } = useSyncExternalStore(subscribe, getSnapshot);

  const results = query.trim()
    ? commands.filter((cmd) =>
        cmd.label.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  function open() {
    setState({ isOpen: true });
  }

  function close() {
    setState({ isOpen: false, query: "" });
  }

  function setQuery(value: string) {
    setState({ query: value });
  }

  function runCommand(command: Command) {
    command.run();
    close();
  }

  return { isOpen, query, results, open, close, setQuery, runCommand };
}
