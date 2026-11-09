// Panels for the scrolling column on the home page.
// To add a photo: put the file in public/lookbook/ and add
//   { type: "image", src: "/lookbook/your-photo.jpg", alt: "What it shows" }
// anywhere in this list.

export type Panel =
  | { type: "image"; src: string; alt: string }
  | { type: "text"; big: string; small: string; place: string; color: string };

export const PANELS: Panel[] = [
  { type: "text", big: "900K", small: "units from 72 styles I designed", place: "Pull&Bear · Dhaka", color: "#5a5a5a" },
  { type: "text", big: "$100M+", small: "men's designer shoe business, 97 vendors", place: "Bloomingdale's · New York", color: "#2e2e2e" },
  { type: "text", big: "300+", small: "styles live on a Shopify store I built from scratch", place: "Lily&Taylor · New York", color: "#353535" },
  { type: "text", big: "50", small: "production patterns for Karl Lagerfeld, Givenchy Baby, and Zara", place: "Lusaka Group · Dhaka", color: "#3a3a3a" },
  { type: "text", big: "$22K", small: "across 4 drops of my own streetwear label", place: "Aurangzeb", color: "#1e1e1e" },
  { type: "text", big: "170K+", small: "YouTube subscribers and a Silver Play Button", place: "YouTube", color: "#454545" },
];
