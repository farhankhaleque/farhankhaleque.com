// Site-wide settings. Edit these to change names, links, and the menu.

export const SITE_TITLE = "Farhan Khaleque";
export const SITE_DESCRIPTION =
  "Farhan Khaleque: fashion merchandising, product development, and code. NYU Computer Science.";
export const SITE_URL = "https://www.farhankhaleque.com";
export const SITE_AUTHOR = "Farhan Khaleque";
export const SITE_EMAIL = "farhankhaleque@nyu.edu";
export const SITE_LOCATION = "New York";

export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/in/farhankhaleque",
  email: `mailto:${SITE_EMAIL}`,
};

// Prefix site paths with the deploy base ("/" normally, "/farhankhaleque.com"
// while the site is served from the temporary GitHub Pages address).
export const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
export const url = (path: string) =>
  /^(https?:|mailto:)/.test(path) ? path : `${BASE}${path}`;

export const URLS = [
  { href: url("/"), text: "Home" },
  { href: url("/work"), text: "Work" },
  { href: url("/collection"), text: "Collection" },
  { href: url("/about"), text: "About" },
  { href: url("/contact"), text: "Contact" },
];
