import { getCollection } from "astro:content";

// All roles, oldest first (by start date, then end date).
export async function getExperience() {
  return (await getCollection("experience")).sort(
    (a, b) =>
      a.data.start.localeCompare(b.data.start) || a.data.end.localeCompare(b.data.end),
  );
}

export async function getLookbook() {
  return (await getCollection("lookbook")).sort((a, b) => a.data.order - b.data.order);
}
