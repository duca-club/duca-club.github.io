import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { hasAuthor } from './data/authors';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    author: z.string().refine(hasAuthor, {
      message: 'Author must match an ID in src/data/authors.json.',
    }),
    description: z.string(),
    publishDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    featuredImage: z.string().optional(),
    slug: z.string(),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    eventDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    location: z.string(),
    locationUrl: z.string().optional(),
    registrationUrl: z.string().optional(),
    featuredImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    dateOnly: z.boolean().default(false),
    slug: z.string(),
  }),
});

export const collections = { blog, events };
