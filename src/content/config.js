import { defineCollection, z } from 'astro:content'

const postCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    dateFormatted: z.string(),
    image: z.string().optional(),
  }),
})

export const collections = {
  post: postCollection,
}
