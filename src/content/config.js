import { defineCollection, z } from "astro:content";
import articles from "../collections/articles.json";

const postCollection = defineCollection({
  type: "content",
  schema: z.object({
    id: z.string(),
    name: z.string(),
    date: z.string(),
    description: z.string(),
    url: z.string(),
    image: z.string(),
    keywords: z.string()
  }),
});

export const collections = {
  post: postCollection
};

export const articlesData = articles;