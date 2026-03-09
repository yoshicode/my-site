import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

const books = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/books' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    rating: z.number().min(1).max(5),
    readDate: z.coerce.date(),
    cover: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

const supplements = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/supplements' }),
  schema: z.object({
    title: z.string(),
    brand: z.string(),
    category: z.string(),
    rating: z.number().min(1).max(5),
    tags: z.array(z.string()).default([]),
  }),
});

const gadgets = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gadgets' }),
  schema: z.object({
    title: z.string(),
    brand: z.string(),
    category: z.string(),
    rating: z.number().min(1).max(5),
    purchaseDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

const entertainment = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/entertainment' }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    creator: z.string().optional(),
    rating: z.number().min(1).max(5),
    tags: z.array(z.string()).default([]),
  }),
});

const lifestyle = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lifestyle' }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog, books, supplements, gadgets, entertainment, lifestyle };
