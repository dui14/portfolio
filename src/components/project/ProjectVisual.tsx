import type { Project } from "../../domain/project.ts";
import { FallbackImage } from "../ui/FallbackImage.tsx";
import { useLanguage } from "../../context/useLanguage.ts";
import { useReducedMotion } from "../../hooks/useReducedMotion.ts";
import { ProjectTerminal } from "./ProjectTerminal.tsx";

type ProjectVisualProps = {
  project: Project;
  variant?: "card" | "hero";
  frameClassName?: string;
};

const PAPER_GROUND = "bg-[var(--on-accent-fallback)]";
const ZOOM_CLASS =
  "transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.02]";

export function ProjectVisual({
  project,
  variant = "card",
  frameClassName = "",
}: ProjectVisualProps) {
  const { language } = useLanguage();
  const reducedMotion = useReducedMotion();
  const { demoVideo, visual } = project;
  const zoomClass = reducedMotion || variant === "hero" ? "" : ZOOM_CLASS;
  const isContained = visual.kind === "image" && visual.image.fit === "contain";
  const showVideo = demoVideo !== undefined && variant === "hero";

  return (
    <div
      className={`min-w-0 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] ${
        isContained && !showVideo ? PAPER_GROUND : "bg-[var(--surface-2)]"
      } ${frameClassName}`}
    >
      {showVideo ? (
        <video
          src={demoVideo.src}
          poster={demoVideo.poster}
          width={demoVideo.width}
          height={demoVideo.height}
          aria-label={`${project.title}: ${demoVideo.label[language]}`}
          controls
          muted
          playsInline
          preload="metadata"
          className="block h-auto w-full"
        />
      ) : demoVideo ? (
        <FallbackImage
          src={demoVideo.poster}
          alt={`${project.title}: ${demoVideo.label[language]}`}
          fallbackLabel={project.title}
          width={demoVideo.width}
          height={demoVideo.height}
          loading="lazy"
          className={`block h-auto w-full ${zoomClass}`}
          fallbackClassName="aspect-[2/1]"
        />
      ) : visual.kind === "image" ? (
        <FallbackImage
          src={visual.image.src}
          srcSet={visual.image.srcSet}
          sizes={visual.image.sizes}
          alt={visual.image.alt[language]}
          fallbackLabel={project.title}
          width={visual.image.width}
          height={visual.image.height}
          loading={variant === "hero" ? "eager" : "lazy"}
          className={
            isContained
              ? `block aspect-[3/2] h-auto w-full object-contain ${zoomClass}`
              : `block h-auto w-full ${zoomClass}`
          }
          fallbackClassName="aspect-[2/1]"
        />
      ) : (
        <div className={zoomClass}>
          <ProjectTerminal terminal={visual.terminal} />
        </div>
      )}
    </div>
  );
}
