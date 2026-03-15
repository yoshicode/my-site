import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const books = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/books' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    rating: z.number().min(1).max(5),
    readDate: z.coerce.date(),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

const sports = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sports' }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    eventDate: z.coerce.date().optional(),
    rating: z.number().min(1).max(5).optional(),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

const gourmet = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gourmet' }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    area: z.string().optional(),
    rating: z.number().min(1).max(5).optional(),
    visitDate: z.coerce.date().optional(),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { books, sports, gourmet };
