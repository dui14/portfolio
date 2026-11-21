import { ImageOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Skeleton } from "../ui/Skeleton.tsx";
import { useLanguage } from "../../context/useLanguage.ts";
import { blogMeta } from "../../data/blogMeta.ts";
import { siteConfig } from "../../config/site.ts";

type PostCoverProps = {
  src?: string;
  alt: string;
  tags?: string[];
  lang?: string;
  size?: "card" | "hero";
  eager?: boolean;
  className?: string;
};

const MAX_COVER_TAGS = 3;

type LoadState = "loading" | "loaded" | "failed";

export function PostCover({
  src,
  alt,
  tags = [],
  lang,
  size = "card",
  eager = false,
  className = "",
}: PostCoverProps) {
  const { t } = useLanguage();
  const imageRef = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<LoadState>("loading");
  const { width, height } = blogMeta.cover;

  useEffect(() => {
    const image = imageRef.current;

    if (image?.complete && image.naturalWidth > 0) setState("loaded");
  }, [src]);

  const showFallback = !src || state === "failed";

  return (
    <div
      className={`relative w-full overflow-hidden bg-[var(--surface-2)] ${className}`}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {showFallback && tags.length > 0 ? (
        <TypographicCover
          tags={tags}
          lang={lang}
          size={size}
          label={src ? t.blog.coverMissing : undefined}
        />
      ) : showFallback ? (
        <div
          role={src ? "img" : undefined}
          aria-label={src ? t.blog.coverMissing : undefined}
          className="flex size-full items-center justify-center text-[var(--muted)]"
        >
          <ImageOff className="size-8" strokeWidth={1.75} aria-hidden="true" />
        </div>
      ) : (
        <>
          {state === "loading" && (
            <Skeleton className="absolute inset-0 rounded-none" />
          )}
          <img
            ref={imageRef}
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            onLoad={() => setState("loaded")}
            onError={() => setState("failed")}
            className={`size-full object-cover transition-opacity duration-[var(--dur-base)] ${
              state === "loaded" ? "opacity-100" : "opacity-0"
            }`}
          />
        </>
      )}
    </div>
  );
}

type TypographicCoverProps = {
  tags: string[];
  lang?: string;
  size: "card" | "hero";
  label?: string;
};

function TypographicCover({ tags, lang, size, label }: TypographicCoverProps) {
  const isHero = size === "hero";

  return (
    <div
      lang={lang}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`absolute inset-0 flex flex-col justify-center bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-[length:var(--space-5)_var(--space-5)] ${
        isHero
          ? "p-[var(--space-8)] md:p-[var(--space-12)]"
          : "p-[var(--space-5)]"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--accent-soft)] via-transparent to-transparent"
      />
      <p
        className={`relative flex min-w-0 flex-col font-display font-bold uppercase leading-[0.95] tracking-[-0.03em] ${
          isHero ? "text-display" : "text-h1"
        }`}
      >
        {tags.slice(0, MAX_COVER_TAGS).map((tag, index) => (
          <span
            key={tag}
            className={`block truncate ${
              index === 0 ? "text-[var(--accent-text)]" : "text-[var(--text)]"
            }`}
          >
            {tag}
          </span>
        ))}
      </p>
      <p
        className={`absolute font-mono text-[var(--muted)] ${
          isHero
            ? "bottom-[var(--space-6)] right-[var(--space-8)] text-sm"
            : "bottom-[var(--space-3)] right-[var(--space-4)] text-xs"
        }`}
      >
        {siteConfig.name}
      </p>
    </div>
  );
}
