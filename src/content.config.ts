import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

// One Markdown file per job in src/content/experience/
const experience = defineCollection({
  loader: glob({ base: "./src/content/experience", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    dates: z.string(), // shown as written, e.g. "Jun to Jul 2026"
    location: z.string().optional(),
    start: z.string(), // "YYYY-MM", used for ordering and the timeline
    end: z.string(), // "YYYY-MM", or "present" if ongoing
    // Optional: pin this role to a row at the top of the timeline (1 = top)
    timelineRow: z.number().optional(),
    // Optional: put this role first or last in the list of role slides
    listPosition: z.enum(["first", "last"]).optional(),
    // Optional: separate stretches of time in the same role (shown as gaps on the timeline)
    periods: z.array(z.object({ start: z.string(), end: z.string() })).optional(),
    // "experience" = jobs, "leadership" = clubs and student roles
    group: z.enum(["experience", "leadership"]).default("experience"),
    stat: z.string(), // the big headline number on the Experience page
    statLabel: z.string(),
    summary: z.string(),
    color: z.string().default("#3a3a3a"),
  }),
});

export const collections = { experience };
