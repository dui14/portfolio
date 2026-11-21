import { useEffect, useState } from "react";
import { motion } from "motion/react";

import type { ProjectTerminal as ProjectTerminalData } from "../../domain/project.ts";
import { useLanguage } from "../../context/useLanguage.ts";
import { useReducedMotion } from "../../hooks/useReducedMotion.ts";

type ProjectTerminalProps = {
  terminal: ProjectTerminalData;
};

const STEP_MS = 1200;
const CURSOR_BLINK_S = 1;
const RULE_CHARS = 160;
const RULE_LINE = "=".repeat(RULE_CHARS);
const DIM_TEXT = "text-[color-mix(in_srgb,var(--cc-text)_60%,transparent)]";
const DOT_CLASS =
  "h-2.5 w-2.5 rounded-[var(--radius-full)] bg-[color-mix(in_srgb,var(--cc-text)_28%,transparent)]";

export function ProjectTerminal({ terminal }: ProjectTerminalProps) {
  const { language } = useLanguage();
  const reducedMotion = useReducedMotion();
  const [selected, setSelected] = useState(0);
  const [cycle, setCycle] = useState(0);
  const count = terminal.menu.length;

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => {
      setSelected((current) => (current + 1) % count);
    }, STEP_MS);
    return () => window.clearInterval(timer);
  }, [reducedMotion, count, cycle]);

  const restart = () => {
    if (reducedMotion) return;
    setSelected(0);
    setCycle((current) => current + 1);
  };

  const active = reducedMotion ? 0 : selected;

  return (
    <>
      <p className="sr-only">{terminal.description[language]}</p>
      <div
        aria-hidden="true"
        onPointerEnter={restart}
        className="code-card-panel overflow-hidden bg-none! font-mono text-xs leading-relaxed text-[var(--cc-text)] md:text-sm"
      >
        <div className="flex items-center gap-[var(--space-2)] border-b border-[color-mix(in_srgb,var(--cc-text)_14%,transparent)] px-[var(--space-4)] py-[var(--space-3)]">
          <span className={DOT_CLASS} />
          <span className={DOT_CLASS} />
          <span className={DOT_CLASS} />
          <span className={`ml-[var(--space-3)] truncate ${DIM_TEXT}`}>{terminal.title}</span>
        </div>

        <div className="flex flex-col gap-[var(--space-4)] px-[var(--space-4)] py-[var(--space-5)] md:px-[var(--space-6)]">
          <div className="break-words">
            <p className={`overflow-hidden whitespace-nowrap select-none ${DIM_TEXT}`}>{RULE_LINE}</p>
            <p className="font-bold">{terminal.banner}</p>
            <p>{terminal.tagline}</p>
            <p className={`overflow-hidden whitespace-nowrap select-none ${DIM_TEXT}`}>{RULE_LINE}</p>
          </div>

          <div>
            <p>{terminal.status}</p>
            <p className={DIM_TEXT}>{terminal.hint}</p>
            <p className="break-words">
              <span className="text-[var(--cc-string)]">?</span>{" "}
              <span className="font-bold">{terminal.prompt}</span>{" "}
              <span className="text-[var(--cc-key)]">{terminal.filter}</span>
            </p>
          </div>

          <ul className="flex flex-col">
            {terminal.menu.map((item, index) => {
              const isActive = index === active;
              return (
                <li key={item} className="flex items-center gap-[var(--space-2)]">
                  <span
                    className={`inline-block w-[1ch] text-[var(--cc-fn)] ${isActive ? "" : "invisible"}`}
                  >
                    ❯
                  </span>
                  <span className={isActive ? "text-[var(--cc-fn)]" : ""}>{item}</span>
                  {isActive && (
                    <motion.span
                      className="inline-block h-[1.1em] w-[0.6ch] bg-[var(--cc-fn)]"
                      initial={{ opacity: 1 }}
                      animate={reducedMotion ? { opacity: 1 } : { opacity: [1, 1, 0, 0] }}
                      transition={
                        reducedMotion
                          ? undefined
                          : {
                              duration: CURSOR_BLINK_S,
                              repeat: Infinity,
                              times: [0, 0.5, 0.5, 1],
                              ease: "linear",
                            }
                      }
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
