import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

// One Markdown file per job in src/content/work/
const work = defineCollection({
  loader: glob({ base: "./src/content/work", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    dates: z.string(), // shown as written, e.g. "Jun to Jul 2026"
    location: z.string(),
    order: z.number(), // 1 shows first
    summary: z.string(),
    color: z.string().default("#a52a2a"),
  }),
});

// One Markdown file per project in src/content/collection/
const collection = defineCollection({
  loader: glob({ base: "./src/content/collection", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    kicker: z.string(),
    description: z.string(),
    order: z.number(),
    tags: z.array(z.string()).default([]),
    // Optional photo in public/lookbook/, e.g. "/lookbook/aurangzeb-1.jpg"
    image: z.string().optional(),
    color: z.string().default("#040404"),
  }),
});

export const collections = { work, collection };
