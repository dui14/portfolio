import type { CSSProperties } from "react";

import { useLanguage } from "../../context/useLanguage.ts";
import { useThemeContext } from "../../context/useThemeContext.ts";
import type { PetManifest } from "../../domain/pet.ts";
import { PET_SPARKLES, PET_ZZZ_DELAYS_MS } from "../../features/pet/petConfig.ts";
import { usePet } from "../../features/pet/usePet.ts";

import "../../styles/pet.css";

type PetProps = {
  manifest: PetManifest;
  onFail: () => void;
};

const LAYER = "pointer-events-none fixed left-0 top-0 z-40";

export function Pet({ manifest, onFail }: PetProps) {
  const { t } = useLanguage();
  const { theme } = useThemeContext();
  const { rootRef, bodyRef, hitRef, setFrameRef, view, bark } = usePet(manifest, onFail);

  const wanted = manifest.themeSkins[theme.id] ?? manifest.defaultSkin;
  const skin = manifest.skins[wanted] ?? manifest.skins[manifest.defaultSkin];
  const base = manifest.skins[manifest.defaultSkin];
  const frameNames = Object.keys(base);
  const { width, height } = manifest.size;

  const bubbleText =
    view.state === "bark" ? t.pet.bark : view.state === "catch" ? t.pet.catch : null;

  return (
    <>
      {view.target && view.state === "chase" && (
        <div
          aria-hidden="true"
          className={LAYER}
          style={{ transform: `translate3d(${view.target.x}px, ${view.target.y}px, 0)` }}
        >
          <span className="pet-marker-ring absolute left-0 top-0 size-6 rounded-full border-2 border-[var(--accent)]" />
          <span className="absolute left-0 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)]" />
        </div>
      )}
      <div
        ref={rootRef}
        aria-hidden="true"
        className={LAYER}
        style={{ width, height, visibility: "hidden", willChange: "transform" }}
      >
        {bubbleText && (
          <span
            key={view.state}
            className="pet-bubble absolute bottom-full left-1/2 mb-[var(--space-1)] w-max whitespace-nowrap rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-[var(--space-2)] py-[var(--space-1)] font-mono text-xs text-[var(--text)] shadow-[var(--shadow-md)]"
          >
            {bubbleText}
          </span>
        )}
        {view.state === "sleep" &&
          PET_ZZZ_DELAYS_MS.map((delay) => (
            <span
              key={delay}
              className="pet-zzz absolute left-1/2 top-0 font-mono text-xs font-medium text-[var(--muted)]"
              style={{ animationDelay: `${delay}ms` }}
            >
              {t.pet.zzz}
            </span>
          ))}
        {view.state === "catch" &&
          PET_SPARKLES.map((sparkle) => (
            <span
              key={`${sparkle.dx}${sparkle.dy}`}
              className="pet-sparkle absolute left-1/2 top-1/2 size-2 bg-[var(--accent)]"
              style={{ "--pet-dx": sparkle.dx, "--pet-dy": sparkle.dy } as CSSProperties}
            />
          ))}
        <div
          ref={bodyRef}
          className="pointer-events-none relative size-full origin-bottom"
        >
          {frameNames.map((name) => (
            <img
              key={name}
              ref={setFrameRef(name)}
              src={skin[name] ?? base[name]}
              alt=""
              width={width}
              height={height}
              draggable={false}
              decoding="sync"
              className="pet-sprite absolute inset-0 size-full"
              style={{ visibility: "hidden" }}
            />
          ))}
        </div>
        <div
          ref={hitRef}
          className="pointer-events-none absolute inset-[20%] cursor-pointer"
          onClick={bark}
        />
      </div>
    </>
  );
}
