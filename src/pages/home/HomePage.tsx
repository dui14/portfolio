import { siteConfig } from "../../config/site.ts";
import { usePageMeta } from "../../features/blog/usePageMeta.ts";
import { About } from "../../sections/about/index.ts";
import { Blog } from "../../sections/blog/index.ts";
import { Contact } from "../../sections/contact/index.ts";
import { Experience } from "../../sections/experience/index.ts";
import { Hero } from "../../sections/hero/index.ts";
import { Projects } from "../../sections/projects/index.ts";

export function HomePage() {
  usePageMeta({
    title: siteConfig.home.title,
    description: siteConfig.home.description,
    path: "/",
    image: siteConfig.home.image,
    imageAlt: siteConfig.home.imageAlt,
    imageWidth: siteConfig.home.imageWidth,
    imageHeight: siteConfig.home.imageHeight,
  });

  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Blog />
      <Contact />
    </>
  );
}
