import type { ComponentPropsWithoutRef, MouseEvent } from "react";

import { isInternalUrl, navigate } from "../../lib/router.ts";

type AppLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href: string;
  onNavigate?: () => void;
};

export function AppLink({
  href,
  onClick,
  onNavigate,
  target,
  download,
  children,
  ...rest
}: AppLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    const isModified =
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    const opensElsewhere = target !== undefined && target !== "_self";
    const isDownload = download !== undefined && download !== false;

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      isModified ||
      opensElsewhere ||
      isDownload ||
      !isInternalUrl(href)
    ) {
      return;
    }

    event.preventDefault();
    navigate(href);
    onNavigate?.();
  }

  return (
    <a
      href={href}
      target={target}
      download={download}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </a>
  );
}
