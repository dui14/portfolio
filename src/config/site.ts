const url = import.meta.env.VITE_SITE_URL ?? "https://duii.dev";

export const siteConfig = {
  url,
  name: "duii.dev",
  contactEndpoint: import.meta.env.VITE_CONTACT_ENDPOINT || "/api/contact",
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL ?? "",
  githubUser: "dui14",
  contributionsFirstYear: 2025,
  home: {
    title: "Khang Luong — Software Engineer | duii.dev",
    description:
      "Portfolio of Khang Luong, software engineer in Ho Chi Minh City building secure, scalable applications for Web2 and Web3.",
    image: "/images/profile/hero-sketch.webp",
    imageAlt: "Sketch portrait of Khang Luong",
    imageWidth: 900,
    imageHeight: 900,
  },
} as const;
