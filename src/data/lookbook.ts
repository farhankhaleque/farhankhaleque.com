// Panels for the scrolling column on the home page.
// To add a photo: put the file in public/lookbook/ and add
//   { type: "image", src: "/lookbook/your-photo.jpg", alt: "What it shows" }
// anywhere in this list.

export type Panel =
  | { type: "image"; src: string; alt: string }
  | { type: "text"; big: string; small: string; place: string; color: string };

export const PANELS: Panel[] = [
  { type: "text", big: "900K", small: "units from 72 styles I designed", place: "Pull&Bear · Dhaka", color: "#a52a2a" },
  { type: "text", big: "$100M+", small: "men's designer shoe business, 97 vendors", place: "Bloomingdale's · New York", color: "#040404" },
  { type: "text", big: "300+", small: "styles live on a Shopify store I built from scratch", place: "Lily&Taylor · New York", color: "#7d6450" },
  { type: "text", big: "50", small: "production patterns for Karl Lagerfeld, Givenchy Baby, and Zara", place: "Lusaka Group · Dhaka", color: "#5a4e42" },
  { type: "text", big: "$22K", small: "across 4 drops of my own streetwear label", place: "Aurangzeb", color: "#2b4a7a" },
  { type: "text", big: "170K+", small: "YouTube subscribers and a Silver Play Button", place: "YouTube", color: "#3b3b3b" },
];
