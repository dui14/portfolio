import { Mail } from "lucide-react";
import type { ComponentType } from "react";

import {
  GithubIcon,
  LinkedinIcon,
  TelegramIcon,
  XIcon,
  type IconProps,
} from "../components/icons/SocialIcons.tsx";

export const socialIcons: Record<string, ComponentType<IconProps>> = {
  Github: GithubIcon,
  Linkedin: LinkedinIcon,
  Twitter: XIcon,
  Telegram: TelegramIcon,
  Mail: Mail,
};
