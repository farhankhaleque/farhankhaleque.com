import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

// One Markdown file per job in src/content/experience/
const experience = defineCollection({
  loader: glob({ base: "./src/content/experience", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    dates: z.string(), // shown as written, e.g. "Jun to Jul 2026"
    location: z.string(),
    start: z.string(), // "YYYY-MM", used for ordering and the timeline
    end: z.string(), // "YYYY-MM"
    stat: z.string(), // the big headline number on the Experience page
    statLabel: z.string(),
    summary: z.string(),
    color: z.string().default("#a52a2a"),
  }),
});

// One Markdown file per project in src/content/lookbook/
const lookbook = defineCollection({
  loader: glob({ base: "./src/content/lookbook", pattern: "**/*.{md,mdx}" }),
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

export const collections = { experience, lookbook };
