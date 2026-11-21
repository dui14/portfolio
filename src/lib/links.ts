const EXTERNAL_PATTERN = /^https?:\/\//;

export function externalLinkProps(href: string) {
  return EXTERNAL_PATTERN.test(href)
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
}
