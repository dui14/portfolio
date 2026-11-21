declare module "virtual:blog-posts" {
  import type { BlogPostMeta } from "../domain/blog.ts";

  export const postMetas: BlogPostMeta[];
  export const postHtmlLoaders: Record<
    string,
    () => Promise<{ default: string }>
  >;
}
