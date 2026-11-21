export type DocumentMeta = {
  title: string;
  description: string;
  url: string;
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  type: "website" | "article";
  twitterCard: "summary" | "summary_large_image";
  robots?: "noindex";
};

function removeHead(selector: string) {
  document.head.querySelector(selector)?.remove();
}

function upsert(selector: string, create: () => HTMLElement): HTMLElement {
  const existing = document.head.querySelector<HTMLElement>(selector);

  if (existing) return existing;

  const element = create();
  document.head.appendChild(element);
  return element;
}

function setMeta(attribute: "name" | "property", key: string, content: string) {
  const element = upsert(`meta[${attribute}="${key}"]`, () => {
    const meta = document.createElement("meta");
    meta.setAttribute(attribute, key);
    return meta;
  });

  element.setAttribute("content", content);
}

function setCanonical(href: string) {
  const element = upsert('link[rel="canonical"]', () => {
    const link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    return link;
  });

  element.setAttribute("href", href);
}

export function applyDocumentMeta(meta: DocumentMeta) {
  document.title = meta.title;
  setMeta("name", "description", meta.description);

  if (meta.robots === "noindex") {
    setMeta("name", "robots", "noindex");
    removeHead('link[rel="canonical"]');
    removeHead('meta[property="og:url"]');
  } else {
    removeHead('meta[name="robots"]');
    setCanonical(meta.url);
    setMeta("property", "og:url", meta.url);
  }

  setMeta("property", "og:type", meta.type);
  setMeta("property", "og:title", meta.title);
  setMeta("property", "og:description", meta.description);
  setMeta("property", "og:image", meta.image);
  setMeta("property", "og:image:width", String(meta.imageWidth));
  setMeta("property", "og:image:height", String(meta.imageHeight));
  setMeta("property", "og:image:alt", meta.imageAlt);
  setMeta("name", "twitter:card", meta.twitterCard);
  setMeta("name", "twitter:image", meta.image);
}
