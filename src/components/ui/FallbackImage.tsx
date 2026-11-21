import { useState } from "react";

type FallbackImageProps = {
  src: string;
  alt: string;
  fallbackLabel: string;
  className?: string;
  fallbackClassName?: string;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  decoding?: "async" | "sync" | "auto";
};

export function FallbackImage({
  src,
  alt,
  fallbackLabel,
  className = "",
  fallbackClassName = "",
  srcSet,
  sizes,
  width,
  height,
  loading = "lazy",
  decoding,
}: FallbackImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (failedSrc === src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex h-full w-full items-center justify-center text-center text-[var(--muted)] ${fallbackClassName}`}
      >
        <span>{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding={decoding}
      className={className}
      onError={() => setFailedSrc(src)}
    />
  );
}
