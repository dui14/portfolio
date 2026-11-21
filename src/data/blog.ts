import { postHtmlLoaders, postMetas } from "virtual:blog-posts";

import { groupPosts } from "../domain/blog.ts";
import type { BlogPostGroup, BlogPostMeta } from "../domain/blog.ts";

export const posts: BlogPostMeta[] = postMetas;

export const postGroups: BlogPostGroup[] = groupPosts(postMetas);

export const postBodyLoaders: Record<
  string,
  () => Promise<{ default: string }>
> = postHtmlLoaders;
