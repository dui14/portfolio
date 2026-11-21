import { siteConfig } from "../config/site.ts";
import type { SocialLink } from "../domain/social.ts";

const emailLinks: SocialLink[] = siteConfig.contactEmail
  ? [
      {
        id: "email",
        label: "Email",
        href: `mailto:${siteConfig.contactEmail}`,
        icon: "Mail",
      },
    ]
  : [];

export const socials: SocialLink[] = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/dui14",
    icon: "Github",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/thaikhang14/",
    icon: "Linkedin",
  },
  {
    id: "x",
    label: "X",
    href: "https://x.com/duionchain",
    icon: "Twitter",
  },
  {
    id: "telegram",
    label: "Telegram",
    href: "https://t.me/Dui1410",
    icon: "Telegram",
  },
  ...emailLinks,
];
