// Lookbook photos. Each entry is one tile on the Lookbook page.
// To add a photo: put the file in public/lookbook/ and set `src`, e.g.
//   { source: "Aurangzeb", src: "/lookbook/aurangzeb-drop-1.jpg", alt: "Drop 1 hoodie" }
// Entries without `src` show as gray placeholders.

export type Photo = {
  source: string; // which experience the photo comes from (used for the filters)
  src?: string;
  alt?: string;
  ratio?: string; // CSS aspect ratio for the placeholder, e.g. "3/4"
};

const placeholders = (source: string, count: number): Photo[] => {
  const ratios = ["3/4", "4/5", "1/1", "4/3", "2/3", "3/4"];
  return Array.from({ length: count }, (_, i) => ({ source, ratio: ratios[(i + source.length) % ratios.length] }));
};

export const SOURCES = [
  "Aurangzeb",
  "NYU FBA Runway",
  "MAD Fashion",
  "Pull&Bear",
  "Street Denim",
  "Lusaka Group",
  "Lily&Taylor",
  "Bloomingdale's",
  "Gymshark",
  "BGMEA",
];

export const PHOTOS: Photo[] = [
  ...placeholders("Aurangzeb", 6),
  ...placeholders("NYU FBA Runway", 4),
  ...placeholders("MAD Fashion", 4),
  ...placeholders("Pull&Bear", 4),
  ...placeholders("Street Denim", 3),
  ...placeholders("Lusaka Group", 2),
  ...placeholders("Lily&Taylor", 3),
  ...placeholders("Bloomingdale's", 2),
  ...placeholders("Gymshark", 1),
  ...placeholders("BGMEA", 1),
];
