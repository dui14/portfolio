import { lazy, Suspense } from "react";

import { PageSkeleton } from "../components/blog/PageSkeleton.tsx";
import { PetLoader } from "../components/pet/PetLoader.tsx";
import { CommandPalette } from "../components/search/CommandPalette.tsx";
import { useRoute } from "../features/navigation/useRoute.ts";
import { useRouteScroll } from "../features/navigation/useRouteScroll.ts";
import { useSmoothScroll } from "../hooks/useSmoothScroll.ts";
import { HomePage } from "../pages/home/HomePage.tsx";
import { Footer } from "../sections/footer/index.ts";
import { FloatingHeader } from "../sections/header/index.ts";

const BlogListPage = lazy(() =>
  import("../pages/blog/BlogListPage.tsx").then((module) => ({
    default: module.BlogListPage,
  }))
);

const BlogPostPage = lazy(() =>
  import("../pages/blog/BlogPostPage.tsx").then((module) => ({
    default: module.BlogPostPage,
  }))
);

const ProjectDetailPage = lazy(() =>
  import("../pages/projects/ProjectDetailPage.tsx").then((module) => ({
    default: module.ProjectDetailPage,
  }))
);

const NotFoundPage = lazy(() =>
  import("../pages/blog/NotFoundPage.tsx").then((module) => ({
    default: module.NotFoundPage,
  }))
);

export function App() {
  const route = useRoute();

  useSmoothScroll();
  useRouteScroll();

  return (
    <>
      <CommandPalette />
      <FloatingHeader />
      <main id="main-content" tabIndex={-1} className="outline-none">
        {route.name === "home" ? (
          <HomePage />
        ) : (
          <Suspense fallback={<PageSkeleton />}>
            {route.name === "blog" && <BlogListPage />}
            {route.name === "post" && <BlogPostPage slug={route.slug} />}
            {route.name === "project" && <ProjectDetailPage id={route.id} />}
            {route.name === "notFound" && <NotFoundPage />}
          </Suspense>
        )}
      </main>
      <Footer />
      <PetLoader />
    </>
  );
}
