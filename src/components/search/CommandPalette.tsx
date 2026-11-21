import { motion } from "motion/react";
import { Search } from "lucide-react";
import { useEffect, useId, useState } from "react";

import type { Command } from "../../features/search/commands.ts";
import { useCommandPalette } from "../../features/search/useCommandPalette.ts";
import { useLanguage } from "../../context/useLanguage.ts";
import { spring } from "../../lib/motion.ts";

export function CommandPalette() {
  const palette = useCommandPalette();

  if (!palette.isOpen) return null;

  return <PalettePanel palette={palette} />;
}

type PalettePanelProps = {
  palette: ReturnType<typeof useCommandPalette>;
};

function PalettePanel({ palette }: PalettePanelProps) {
  const { t } = useLanguage();
  const { query, results, close, setQuery, runCommand } = palette;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prevQuery, setPrevQuery] = useState(query);
  const listId = useId();
  const optionId = (id: string) => `${listId}-${id}`;

  if (prevQuery !== query) {
    setPrevQuery(query);
    setSelectedIndex(0);
  }

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (results.length ? (i + 1) % results.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) =>
          results.length ? (i - 1 + results.length) % results.length : 0
        );
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        runCommand(results[selectedIndex]);
      }
    }

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [results, selectedIndex, runCommand, close]);

  useEffect(() => {
    const selected = results[selectedIndex];
    if (!selected) return;
    document
      .getElementById(`${listId}-${selected.id}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [results, selectedIndex, listId]);

  const groupedResults = {
    navigate: results.filter((c) => c.group === "navigate"),
    actions: results.filter((c) => c.group === "actions"),
  };

  function renderCommand(cmd: Command) {
    const globalIdx = results.indexOf(cmd);

    return (
      <div
        key={cmd.id}
        id={optionId(cmd.id)}
        role="option"
        aria-selected={globalIdx === selectedIndex}
        onClick={() => runCommand(cmd)}
        className={`w-full cursor-pointer text-left px-[var(--space-3)] py-[var(--space-2)] rounded-[var(--radius-md)] transition-colors duration-[var(--dur-fast)] ${
          globalIdx === selectedIndex
            ? "bg-[var(--accent)] text-[var(--on-accent)]"
            : "text-[var(--text)] hover:bg-[var(--surface)]"
        }`}
      >
        {cmd.label}
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-[var(--space-4)]"
      role="dialog"
      aria-modal="true"
      aria-label={t.palette.label}
    >
      <div
        className="absolute inset-0 bg-[var(--text)] opacity-40"
        onClick={close}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={spring}
        className="relative w-full max-w-xl rounded-[var(--radius-lg)] bg-[var(--bg)] border border-[var(--border)] shadow-[var(--shadow-lg)] overflow-hidden"
      >
        <div className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] border-b border-[var(--border)]">
          <Search className="w-5 h-5 text-[var(--muted)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.palette.placeholder}
            aria-label={t.palette.placeholder}
            autoFocus
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={
              results[selectedIndex] ? optionId(results[selectedIndex].id) : undefined
            }
            className="flex-1 rounded-[var(--radius-sm)] bg-transparent text-[var(--text)] placeholder:text-[var(--muted)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus-ring)]"
          />
          <kbd className="px-2 py-1 text-xs text-[var(--muted)] bg-[var(--surface)] rounded border border-[var(--border)]">
            {t.palette.escape}
          </kbd>
        </div>

        <div
          id={listId}
          role="listbox"
          aria-label={t.palette.label}
          className="max-h-[400px] overflow-y-auto p-[var(--space-2)]"
        >
          {groupedResults.navigate.length > 0 && (
            <div className="mb-[var(--space-2)]">
              <div className="px-[var(--space-3)] py-[var(--space-2)] text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">
                {t.palette.navigate}
              </div>
              {groupedResults.navigate.map(renderCommand)}
            </div>
          )}

          {groupedResults.actions.length > 0 && (
            <div>
              <div className="px-[var(--space-3)] py-[var(--space-2)] text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">
                {t.palette.actions}
              </div>
              {groupedResults.actions.map(renderCommand)}
            </div>
          )}

          {results.length === 0 && (
            <div className="px-[var(--space-3)] py-[var(--space-8)] text-center text-[var(--muted)]">
              {t.palette.empty}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
