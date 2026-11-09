import { getCollection } from "astro:content";

const key = (ym: string) => (ym === "present" ? "9999-99" : ym);

// All roles, oldest first (by start date, then end date).
export async function getExperience() {
  return (await getCollection("experience")).sort(
    (a, b) =>
      a.data.start.localeCompare(b.data.start) || key(a.data.end).localeCompare(key(b.data.end)),
  );
}

// Order for the role slides: chronological, with listPosition "first"/"last" pinned.
export async function getExperienceList() {
  const all = await getExperience();
  return [
    ...all.filter((r) => r.data.listPosition === "first"),
    ...all.filter((r) => !r.data.listPosition),
    ...all.filter((r) => r.data.listPosition === "last"),
  ];
}
