import { ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import { RadioGroup } from "../../components/ui/RadioGroup.tsx";
import { siteConfig } from "../../config/site.ts";
import { useLanguage } from "../../context/useLanguage.ts";
import { useGithubContributions } from "../../features/about/useGithubContributions.ts";
import type { ContributionDay, ContributionRange } from "../../data/githubContributions.ts";
import { useReducedMotion } from "../../hooks/useReducedMotion.ts";
import { useNearViewport } from "../../hooks/useNearViewport.ts";
import { useScrollReveal } from "../../hooks/useScrollReveal.ts";
import { DATE_LOCALES } from "../../lib/dates.ts";
import { durations, easeOut } from "../../lib/motion.ts";
import { BentoCard } from "./BentoCard.tsx";

const LEVEL_COLORS = [
  "var(--surface-2)",
  "color-mix(in srgb, var(--accent) 25%, var(--surface-2))",
  "color-mix(in srgb, var(--accent) 45%, var(--surface-2))",
  "color-mix(in srgb, var(--accent) 70%, var(--surface-2))",
  "var(--accent)",
];

const WEEKDAY_ROWS = [1, 3, 5];
const MONTH_SPAN = 3;
const CELL_STAGGER = 0.012;
const LEGEND_LEVELS = [0, 1, 2, 3, 4];
const LAST_YEAR_ID = "last-year";
const PRELOAD_MARGIN = "400px 0px";
const PLACEHOLDER_WEEKS = 53;
const PLACEHOLDER_START = Date.UTC(2024, 0, 7);
const DAY_MS = 86400000;
const PLACEHOLDER_RANGE: ContributionRange = {
  id: LAST_YEAR_ID,
  total: 0,
  weeks: Array.from({ length: PLACEHOLDER_WEEKS }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => ({
      date: new Date(PLACEHOLDER_START + (week * 7 + day) * DAY_MS).toISOString().slice(0, 10),
      count: 0,
      level: 0,
    })),
  ),
};
type Cell = { day: ContributionDay; week: number; row: number; flat: number };

type TooltipState = { flat: number; text: string; left: number; top: number };

function weekdayOf(date: string) {
  return new Date(`${date}T00:00:00Z`).getUTCDay();
}

export function Contributions() {
  const { t, language } = useLanguage();
  const reducedMotion = useReducedMotion();
  const { ref, isInView } = useScrollReveal<HTMLDivElement>({ amount: 0.2 });
  const locale = DATE_LOCALES[language];
  const { ref: sentinelRef, isNear } = useNearViewport<HTMLDivElement>(PRELOAD_MARGIN);
  const { status, data, retry } = useGithubContributions(isNear);
  const isReady = status === "ready";
  const ranges = useMemo(() => data?.ranges ?? [], [data]);
  const [rangeId, setRangeId] = useState<string | null>(null);
  const [activeFlat, setActiveFlat] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const cellRefs = useRef<Map<number, HTMLSpanElement>>(new Map());
  const range = ranges.find((item) => item.id === rangeId) ?? ranges[0] ?? PLACEHOLDER_RANGE;

  const numberFormat = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const dateFormat = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "UTC" }),
    [locale],
  );
  const monthFormat = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" }),
    [locale],
  );
  const weekdayFormat = useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" }),
    [locale],
  );

  const cells = useMemo<Cell[]>(() => {
    const list: Cell[] = [];
    range.weeks.forEach((week, weekIndex) => {
      week.forEach((day) => {
        list.push({ day, week: weekIndex, row: weekdayOf(day.date), flat: list.length });
      });
    });
    return list;
  }, [range]);

  const months = useMemo(() => {
    if (!isReady) return [];
    const labels: { week: number; text: string }[] = [];
    let previousMonth = -1;
    let lastWeek = -MONTH_SPAN;
    range.weeks.forEach((week, weekIndex) => {
      const first = week[0];
      if (!first) return;
      const month = Number(first.date.slice(5, 7));
      if (month !== previousMonth) {
        previousMonth = month;
        if (weekIndex - lastWeek >= MONTH_SPAN) {
          labels.push({
            week: weekIndex,
            text: monthFormat.format(new Date(`${first.date}T00:00:00Z`)),
          });
          lastWeek = weekIndex;
        }
      }
    });
    return labels;
  }, [range, isReady, monthFormat]);

  const weekdayLabels = useMemo(
    () =>
      WEEKDAY_ROWS.map((row) => ({
        row,
        text: weekdayFormat.format(new Date(Date.UTC(2024, 0, 7 + row))),
      })),
    [weekdayFormat],
  );

  useEffect(() => {
    const element = scrollRef.current;
    if (element) element.scrollLeft = element.scrollWidth;
  }, [range.id, language, isReady]);

  const currentFlat = activeFlat ?? cells.length - 1;
  const total = numberFormat.format(range.total);
  const loadedHeading = (
    range.id === LAST_YEAR_ID ? t.about.contributionsHeading : t.about.contributionsYearHeading
  )
    .replace("{count}", total)
    .replace("{year}", range.id);
  const heading = isReady
    ? loadedHeading
    : status === "error"
      ? t.about.contributionsError
      : t.about.contributionsLoading;

  function describeDay(day: ContributionDay) {
    const date = dateFormat.format(new Date(`${day.date}T00:00:00Z`));
    if (day.count === 0) return t.about.contributionNone.replace("{date}", date);
    const template = day.count === 1 ? t.about.contributionOne : t.about.contributionMany;
    return template
      .replace("{count}", numberFormat.format(day.count))
      .replace("{date}", date);
  }

  function showTooltip(cell: Cell) {
    const element = cellRefs.current.get(cell.flat);
    const frame = frameRef.current;
    if (!element || !frame) return;
    const box = element.getBoundingClientRect();
    const frameBox = frame.getBoundingClientRect();
    setTooltip({
      flat: cell.flat,
      text: describeDay(cell.day),
      left: box.left - frameBox.left + box.width / 2,
      top: box.top - frameBox.top,
    });
  }

  function hideTooltip() {
    setTooltip(null);
  }

  function focusFlat(flat: number) {
    const element = cellRefs.current.get(flat);
    if (!element) return;
    setActiveFlat(flat);
    element.focus();
  }

  function navigate(key: string, cell: Cell): number | null {
    const last = cells.length - 1;
    if (key === "Home") return 0;
    if (key === "End") return last;
    if (key === "ArrowUp") return Math.max(cell.flat - 1, 0);
    if (key === "ArrowDown") return Math.min(cell.flat + 1, last);
    if (key !== "ArrowLeft" && key !== "ArrowRight") return null;

    const direction = key === "ArrowLeft" ? -1 : 1;
    const weekCells = range.weeks[cell.week + direction];
    if (!weekCells || weekCells.length === 0) return cell.flat;
    let best: Cell | null = null;
    for (const candidate of cells) {
      if (candidate.week !== cell.week + direction) continue;
      if (!best || Math.abs(candidate.row - cell.row) < Math.abs(best.row - cell.row)) {
        best = candidate;
      }
    }
    return best ? best.flat : cell.flat;
  }

  function handleKey(event: KeyboardEvent<HTMLSpanElement>, cell: Cell) {
    if (event.key === "Escape") {
      hideTooltip();
      return;
    }
    const target = navigate(event.key, cell);
    if (target === null) return;
    event.preventDefault();
    focusFlat(target);
  }

  const rangeItems = ranges.map((item) => ({
    id: item.id,
    label: item.id === LAST_YEAR_ID ? t.about.lastYear : item.id,
  }));

  return (
    <BentoCard className="bg-[var(--surface)] border border-[var(--border)] p-[var(--space-6)] md:p-[var(--space-8)] flex flex-col gap-[var(--space-6)] md:col-span-2 lg:col-span-12">
      <div
        ref={sentinelRef}
        className="flex flex-col gap-[var(--space-4)] md:flex-row md:items-center md:justify-between"
      >
        <h3
          className="font-display font-bold text-h2 tracking-[-0.02em]"
          aria-live="polite"
        >
          {heading}
        </h3>
        {isReady ? (
          <RadioGroup
            items={rangeItems}
            value={range.id}
            onChange={(item) => {
              setRangeId(item.id);
              setActiveFlat(null);
              hideTooltip();
            }}
            label={t.about.contributionsRange}
            className="inline-flex max-w-full self-start overflow-x-auto rounded-[var(--radius-full)] border border-[var(--border)] bg-[var(--surface-2)] p-[var(--space-1)]"
            renderItem={(item, checked, props) => (
              <button
                key={item.id}
                {...props}
                className={`min-h-9 whitespace-nowrap rounded-[var(--radius-full)] px-[var(--space-4)] text-sm font-medium transition-all duration-[var(--dur-fast)] active:scale-95 ${
                  checked
                    ? "bg-[var(--accent)] text-[var(--on-accent)]"
                    : "text-[color-mix(in_srgb,var(--text)_78%,var(--bg))] hover:text-[var(--text)]"
                }`}
              >
                {item.label}
              </button>
            )}
          />
        ) : (
          <div className="inline-flex max-w-full self-start rounded-[var(--radius-full)] border border-[var(--border)] bg-[var(--surface-2)] p-[var(--space-1)]">
            {status === "error" ? (
              <button
                type="button"
                onClick={retry}
                className="min-h-9 whitespace-nowrap rounded-[var(--radius-full)] bg-[var(--accent)] px-[var(--space-4)] text-sm font-medium text-[var(--on-accent)] transition-all duration-[var(--dur-fast)] active:scale-95"
              >
                {t.about.contributionsRetry}
              </button>
            ) : (
              <span aria-hidden="true" className="block min-h-9 w-[calc(var(--space-24)*2)]" />
            )}
          </div>
        )}
      </div>

      <div ref={frameRef} className="relative flex">
        <div
          aria-hidden="true"
          className="grid shrink-0 gap-[var(--space-1)] pr-[var(--space-2)] text-xs text-[var(--muted)] leading-none"
          style={{ gridTemplateRows: "auto repeat(7, 1fr)" }}
        >
          <span className="pb-[var(--space-1)] invisible">&nbsp;</span>
          {weekdayLabels.map((label) => (
            <span
              key={label.row}
              className="flex items-center"
              style={{ gridRow: label.row + 2 }}
            >
              {label.text}
            </span>
          ))}
        </div>
        <div
          ref={scrollRef}
          className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div
            ref={ref}
            role={isReady ? "group" : undefined}
            aria-label={isReady ? t.about.contributionsGrid : undefined}
            aria-hidden={isReady ? undefined : true}
            className="grid gap-[var(--space-1)] min-w-max lg:min-w-0"
            style={{
              gridTemplateColumns: `repeat(${range.weeks.length}, minmax(var(--space-3), 1fr))`,
            }}
          >
            {months.map((month) => (
              <span
                key={`${range.id}-${month.week}`}
                aria-hidden="true"
                className="whitespace-nowrap text-xs text-[var(--muted)] leading-none pb-[var(--space-1)]"
                style={{ gridColumn: `${month.week + 1} / span ${MONTH_SPAN}`, gridRow: 1 }}
              >
                {month.text}
              </span>
            ))}

            {!isReady && (
              <span
                aria-hidden="true"
                className="text-xs leading-none pb-[var(--space-1)] invisible"
                style={{ gridColumn: 1, gridRow: 1 }}
              >
                &nbsp;
              </span>
            )}

            {cells.map((cell) => {
              if (!isReady) {
                return (
                  <span
                    key={`${cell.week}-${cell.row}`}
                    aria-hidden="true"
                    className={`block aspect-square rounded-[calc(var(--radius-sm)/3)] bg-[var(--surface-2)] ${
                      status === "loading" && !reducedMotion ? "animate-pulse" : ""
                    }`}
                    style={{ gridColumn: cell.week + 1, gridRow: cell.row + 2 }}
                  />
                );
              }

              const isActive = cell.flat === currentFlat;
              const isShown = tooltip?.flat === cell.flat;

              return (
                <motion.span
                  key={`${cell.week}-${cell.row}`}
                  ref={(element) => {
                    if (element) cellRefs.current.set(cell.flat, element);
                    else cellRefs.current.delete(cell.flat);
                  }}
                  role="img"
                  aria-label={describeDay(cell.day)}
                  tabIndex={isActive ? 0 : -1}
                  onMouseEnter={() => showTooltip(cell)}
                  onMouseLeave={hideTooltip}
                  onFocus={() => {
                    setActiveFlat(cell.flat);
                    showTooltip(cell);
                  }}
                  onBlur={hideTooltip}
                  onKeyDown={(event) => handleKey(event, cell)}
                  initial={reducedMotion ? false : { opacity: 0, scale: 0.4 }}
                  animate={
                    reducedMotion || isInView
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.4 }
                  }
                  transition={{
                    duration: durations.base,
                    ease: easeOut,
                    delay: reducedMotion ? 0 : cell.week * CELL_STAGGER,
                  }}
                  className="block aspect-square rounded-[calc(var(--radius-sm)/3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
                  style={{
                    gridColumn: cell.week + 1,
                    gridRow: cell.row + 2,
                    backgroundColor: LEVEL_COLORS[cell.day.level] ?? LEVEL_COLORS[0],
                    boxShadow: isShown ? "0 0 0 1px var(--text)" : undefined,
                  }}
                />
              );
            })}
          </div>
        </div>

        {tooltip && (
          <div
            role="tooltip"
            className="pointer-events-none absolute z-20 w-max max-w-[calc(var(--space-24)*2)] -translate-x-1/2 -translate-y-full rounded-[var(--radius-sm)] bg-[var(--text)] px-[var(--space-3)] py-[var(--space-2)] text-center text-xs font-medium text-[var(--bg)] shadow-[var(--shadow-md)]"
            style={{
              left: `clamp(var(--space-24), ${tooltip.left}px, calc(100% - var(--space-24)))`,
              top: `calc(${tooltip.top}px - var(--space-2))`,
            }}
          >
            {tooltip.text}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-[var(--space-4)]">
        <a
          href={`https://github.com/${siteConfig.githubUser}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-[var(--space-2)] text-sm font-medium text-[var(--accent-text)] transition-all duration-[var(--dur-fast)] hover:underline active:scale-95"
        >
          {t.about.viewOnGithub}
          <ExternalLink className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        </a>
        <div
          className="flex items-center gap-[var(--space-2)] text-xs text-[var(--muted)]"
          aria-hidden="true"
        >
          <span>{t.about.less}</span>
          {LEGEND_LEVELS.map((level) => (
            <span
              key={level}
              className="h-3 w-3 rounded-[calc(var(--radius-sm)/3)]"
              style={{ backgroundColor: LEVEL_COLORS[level] }}
            />
          ))}
          <span>{t.about.more}</span>
        </div>
      </div>
    </BentoCard>
  );
}
