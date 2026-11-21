import { motion } from "motion/react";
import type { TargetAndTransition } from "motion/react";
import { Fragment } from "react";
import type { ReactNode } from "react";

import { useLanguage } from "../../context/useLanguage.ts";
import { developer } from "../../data/skills.ts";
import { useCursorTilt } from "../../hooks/useCursorTilt.ts";
import { useReducedMotion } from "../../hooks/useReducedMotion.ts";
import { durations, easeInOut } from "../../lib/motion.ts";
import { BentoCard } from "./BentoCard.tsx";

const COLOR = {
  text: "text-[var(--cc-text)]",
  keyword: "text-[var(--cc-keyword)]",
  key: "text-[var(--cc-key)]",
  string: "text-[var(--cc-string)]",
  bool: "text-[var(--cc-bool)]",
  fn: "text-[var(--cc-fn)]",
} as const;

const LINE = {
  top: "block pl-[4ch] -indent-[2ch]",
  nested: "block pl-[6ch] -indent-[2ch]",
  close: "block pl-[2ch] -indent-[2ch]",
} as const;

type Depth = "top" | "nested";

const FLAG_PULSE: TargetAndTransition = {
  scale: [1, 1.22, 1],
  transition: { duration: durations.reveal, delay: durations.slow, ease: easeInOut },
};

function Quoted({ value }: { value: string }) {
  return <span className={COLOR.string}>{`'${value}'`}</span>;
}

function Property({
  name,
  depth = "top",
  children,
}: {
  name: string;
  depth?: Depth;
  children: ReactNode;
}) {
  return (
    <span className={LINE[depth]}>
      <span className={COLOR.key}>{name}</span>
      <span className={COLOR.text}>: </span>
      {children}
      <span className={COLOR.text}>,</span>
    </span>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <>
      <span className={COLOR.text}>[</span>
      {items.map((item, index) => (
        <Fragment key={item}>
          <span className="whitespace-nowrap">
            <Quoted value={item} />
            {index < items.length - 1 && <span className={COLOR.text}>,</span>}
          </span>
          {index < items.length - 1 && " "}
        </Fragment>
      ))}
      <span className={COLOR.text}>]</span>
    </>
  );
}

function Flag({ value, highlight, animate }: { value: boolean; highlight?: boolean; animate?: boolean }) {
  if (!highlight) return <span className={COLOR.bool}>{String(value)}</span>;

  return (
    <motion.span
      className={`inline-block indent-0 rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--cc-bool)_22%,transparent)] px-[0.5ch] -mx-[0.5ch] ${COLOR.bool}`}
      whileInView={animate ? FLAG_PULSE : undefined}
      viewport={{ once: true, amount: 1 }}
    >
      {String(value)}
    </motion.span>
  );
}

export function DeveloperCard() {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion();
  const motionState = reducedMotion ? "off" : "on";
  const { tiltStyle, glareStyle, handlers } = useCursorTilt(!reducedMotion);
  const { skills } = developer;

  return (
    <BentoCard className="lg:col-span-7">
      <div className="h-full" {...handlers}>
        <motion.div
          data-motion={motionState}
          style={tiltStyle}
          className="code-card-tilt h-full"
        >
          <div data-motion={motionState} className="code-card-frame h-full">
            <div className="code-card-panel h-full p-[var(--space-6)] md:p-[var(--space-8)] lg:p-[var(--space-10)] flex items-center">
              {glareStyle && (
                <motion.span
                  aria-hidden="true"
                  style={glareStyle}
                  className="code-card-glare"
                />
              )}
              <pre
                role="group"
                aria-label={t.about.developerProfile}
                className="relative m-0 w-full min-w-0 overflow-x-auto whitespace-pre-wrap font-mono text-sm sm:text-base lg:text-xl leading-[1.7] lg:leading-[2.1] text-[var(--cc-text)]"
              >
                <code className="block">
                  <span className="block">
                    <span className={COLOR.keyword}>const</span>{" "}
                    <span className={COLOR.fn}>developer</span>{" "}
                    <span className={COLOR.text}>= {"{"}</span>
                  </span>
                  <Property name="name">
                    <Quoted value={developer.name} />
                  </Property>
                  <Property name="role">
                    <Quoted value={developer.role} />
                  </Property>
                  <span className={LINE.top}>
                    <span className={COLOR.key}>skills</span>
                    <span className={COLOR.text}>: {"{"}</span>
                  </span>
                  <Property name="programming" depth="nested">
                    <List items={skills.programming} />
                  </Property>
                  <Property name="frameworks" depth="nested">
                    <List items={skills.frameworks} />
                  </Property>
                  <Property name="tools" depth="nested">
                    <List items={skills.tools} />
                  </Property>
                  <span className={`${LINE.top} ${COLOR.text}`}>{"},"}</span>
                  <Property name="hardWorker">
                    <Flag value={developer.hardWorker} />
                  </Property>
                  <Property name="quickLearner">
                    <Flag value={developer.quickLearner} />
                  </Property>
                  <Property name="isHandsome">
                    <Flag
                      value={developer.isHandsome}
                      highlight
                      animate={!reducedMotion}
                    />
                  </Property>
                  <span className={`${LINE.close} ${COLOR.text}`}>{"};"}</span>
                </code>
              </pre>
            </div>
          </div>
        </motion.div>
      </div>
    </BentoCard>
  );
}
