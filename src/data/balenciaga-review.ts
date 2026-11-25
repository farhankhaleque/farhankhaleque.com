// Case study: a hands on review of balenciaga.com/en-us on November 25, 2026.
// Every "live" line was seen on the site that day; every "why" comes from a named source.
// No Balenciaga logo or product photos are used anywhere on the page.

export type Area = "Product page" | "Bag & delivery" | "Browsing" | "Search" | "Sitewide";

export type Fix = {
  n: number;
  area: Area;
  kind: "QA defect" | "Test idea";
  title: string;
  live: string;
  change: string;
  why: string;
};

export const FIXES: Fix[] = [
  {
    n: 1, area: "Bag & delivery", kind: "QA defect", title: "The delivery date actually renders",
    live: 'The cart shows the raw template string "Estimated delivery date:__dateInterval:1-4__".',
    change: "Each shipping option prints real dates, counted in business days.",
    why: "Baymard: 17% of shoppers who left for reasons other than browsing blamed site errors or crashes.",
  },
  {
    n: 2, area: "Bag & delivery", kind: "QA defect", title: "One next day cutoff",
    live: "The cart says 12:30PM ET. The product page and FAQ say 12pm ET.",
    change: "The cart, product page and FAQ all read one setting: 12pm ET.",
    why: "That's two different promises for a service people pay extra for.",
  },
  {
    n: 3, area: "Bag & delivery", kind: "QA defect", title: "One store pickup window",
    live: "Pickup is 3 to 6 business days in the cart and 2 to 4 on the product page and FAQ.",
    change: "2 to 4 business days everywhere, from the same shared setting.",
    why: "A monthly test order would show which one is true.",
  },
  {
    n: 4, area: "Bag & delivery", kind: "QA defect", title: "No stray error text",
    live: '"An error has occurred, please try again" and the label key "quickView.popin.title.label" sit in the cart and checkout page text.',
    change: "Error messages only appear when something fails, and no label keys end up in the page.",
    why: "Even if they're hidden, screen readers and search crawlers still pick them up.",
  },
  {
    n: 5, area: "Search", kind: "QA defect", title: "The search page title includes the search",
    live: 'Search results pages are titled "| Balenciaga US" with the query missing.',
    change: "The title reads “Search results for ‘hoodie’ | Balenciaga US”.",
    why: "The browser tab and history entry are blank otherwise.",
  },
  {
    n: 6, area: "Sitewide", kind: "QA defect", title: "Real meta descriptions",
    live: 'The men\'s sneaker category meta description is just "Balenciaga".',
    change: "Every category and product page gets its own description.",
    why: "That's the line Google shows under the link in search results.",
  },
  {
    n: 7, area: "Sitewide", kind: "QA defect", title: "Clean category URLs",
    live: "Category URLs contain an encoded non breaking space (%C2%A0).",
    change: "Plain paths like /men/sneakers.",
    why: "It's a catalog data entry slip that ends up in every shared link.",
  },
  {
    n: 8, area: "Browsing", kind: "QA defect", title: "One “Black” in the hardware filter",
    live: 'The bag "Hardware" filter lists two separate values that are both labelled "Black" (6 and 18 items).',
    change: "One value per finish.",
    why: "It's an attribute mapping error, which is exactly the item mapping work in the intern role.",
  },
  {
    n: 9, area: "Browsing", kind: "QA defect", title: "One size scale per category",
    live: "The men's ready to wear size filter mixes 38 values: 28 to 56, XXS to XXL, 1 to 5, U, 4XS and 6XL.",
    change: "Shoes filter by EU size and clothing by US size, using the US size already printed next to each size on the product page.",
    why: "Nobody can shop a filter with 38 overlapping sizes.",
  },
  {
    n: 10, area: "Product page", kind: "Test idea", title: "Size & fit filled in",
    live: "The $2,790 Bomber Jacket's SIZE & FIT section is empty, and the size guide only converts sizes.",
    change: "A fit summary, the model's height and size worn, and garment measurements.",
    why: "Baymard: 82% of apparel sites give insufficient sizing information, and sizing doubt makes people abandon products.",
  },
  {
    n: 11, area: "Product page", kind: "Test idea", title: "Size buttons instead of a dropdown",
    live: "Size is picked from a dropdown.",
    change: "Every size is visible as a button, with the US size next to the EU one.",
    why: "Baymard: 57% of sites use a dropdown here, and it recommends buttons.",
  },
  {
    n: 12, area: "Sitewide", kind: "QA defect", title: "The header never overlaps the logo",
    live: 'At 1024px wide, "MEN" in the menu runs into the centered logo.',
    change: "The header is a three column grid, so the logo always has its own space.",
    why: "It's a layout bug, and I only checked that one width.",
  },
  {
    n: 13, area: "Sitewide", kind: "QA defect", title: "Headings, button labels and product data",
    live: "The homepage <h1> is empty, 8 of 251 buttons on the sneaker listing have no accessible name, and the Product data leaves material blank.",
    change: "Every page has a heading, every button has a name, and the Product data includes the material.",
    why: "These are accessibility and structured data gaps that a weekly QA can catch.",
  },
  {
    n: 14, area: "Product page", kind: "Test idea", title: "Delivery and returns right under Add to Bag",
    live: "Free shipping and free 30 day returns live inside tabs, and the top banner promotes a gift selection instead.",
    change: "The terms sit directly under the button, and the top banner states them.",
    why: "Baymard: 60% of shoppers look for return terms on the product page, and 44% of sites don't show them there. Prada and Loewe both do.",
  },
  {
    n: 15, area: "Product page", kind: "Test idea", title: "Klarna installments shown",
    live: "Klarna is named in a payment sentence, but no installment amount appears.",
    change: "“or 4 interest free payments of $272.50 with Klarna” under the price.",
    why: "Stripe saw up to 14% more revenue when pay later was shown, with the biggest gains on $500 to $1,500 orders. Saint Laurent publishes Klarna pay in 4 from $35 to $4,000.",
  },
  {
    n: 16, area: "Browsing", kind: "Test idea", title: "A price filter and a Suggested sort",
    live: "Men's ready to wear has 374 products, 13 per page, three sort options and no price filter.",
    change: "A price range filter, and Suggested as the default sort.",
    why: "Baymard: 51% of sites lack its core filters. Louis Vuitton has a price filter and Prada defaults to Suggested.",
  },
  {
    n: 17, area: "Browsing", kind: "Test idea", title: "One tile per style",
    live: '"Runner Sneaker" shows up three times in the first twelve tiles, once per color.',
    change: "One tile per style, with color swatches.",
    why: "Baymard: 42% of sites fail to merge variations.",
  },
  {
    n: 18, area: "Search", kind: "Test idea", title: "Zero results that still help",
    live: 'A nonsense search, and a search for "returns", both end on an apology and a row of bags.',
    change: "Related categories, a link to the returns policy for words like “returns”, and a way to reach client service.",
    why: "Baymard: about half of sites offer no real recovery from a zero results search.",
  },
  {
    n: 19, area: "Search", kind: "Test idea", title: "Suggestions that match the word",
    live: 'Typing "hood" suggests a knit hood and a hooded scarf before any hoodie.',
    change: "Matches on the product name rank first, so “hood” finds the four hoodies.",
    why: "This may be on purpose, so I'd ask about it before changing it.",
  },
  {
    n: 20, area: "Product page", kind: "Test idea", title: "Similar items and recently viewed",
    live: "Only a curated Style it With row. On the $1,090 Triple S.2, two of the three picks cost more than the shoe.",
    change: "Style it With, plus Similar Items from the same category at a close price, plus Recently Viewed.",
    why: "A recommendation script already loads on the homepage. The numbers here come from a vendor, so this is a hypothesis to test.",
  },
  {
    n: 21, area: "Product page", kind: "Test idea", title: "Client service on the product page",
    live: "The chat link sits in the footer.",
    change: "Chat, call and email right under the delivery terms.",
    why: "Prada puts phone, email, WhatsApp and live chat on its product pages.",
  },
  {
    n: 22, area: "Product page", kind: "Test idea", title: "Material and craft up front",
    live: "Product data leaves material blank.",
    change: "Composition, where it's made, and hardware in their own section.",
    why: "BCG 2026: 70% of luxury shoppers have walked away over a price they felt wasn't justified, and craftsmanship ranks as a top reason to buy.",
  },
  {
    n: 23, area: "Sitewide", kind: "Test idea", title: "Lazy loaded images",
    live: "None of the 78 homepage images use native lazy loading.",
    change: "Anything below the first screen loads as you scroll.",
    why: "Deloitte for Google: a 0.1 second faster mobile site moved luxury shoppers from product page to basket 40.1% more often.",
  },
  {
    n: 24, area: "Bag & delivery", kind: "QA defect", title: "No delivery promised on Thanksgiving",
    live: 'On November 25, the Bomber Jacket and Triple S.2 pages both said "Estimated delivery date: 11/26/2026 - 11/29/2026", which is Thanksgiving through a Sunday.',
    change: "Delivery estimates skip weekends and holidays, so next business day reads Friday, November 27.",
    why: "Client service is closed on Thanksgiving. Shipment tracking would confirm whether the date was ever realistic.",
  },
];

export const SOURCES = [
  { name: "Baymard Institute: cart abandonment", url: "https://baymard.com/lists/cart-abandonment-rate" },
  { name: "Baymard Institute: apparel sizing", url: "https://baymard.com/blog/apparel-5-best-practices" },
  { name: "Baymard Institute: product page UX", url: "https://baymard.com/blog/current-state-ecommerce-product-page-ux" },
  { name: "Baymard Institute: product lists and filtering", url: "https://baymard.com/blog/current-state-product-list-and-filtering" },
  { name: "Baymard Institute: no results pages", url: "https://baymard.com/blog/no-results-page" },
  { name: "Stripe: testing buy now, pay later", url: "https://stripe.com/en-bg/blog/testing-the-impact-of-buy-now-pay-later" },
  { name: "Contentsquare: retail conversion benchmarks", url: "https://contentsquare.com/guides/retail-digital-experience/conversions/" },
  { name: "BCG: luxury in 2026", url: "https://www.bcg.com/publications/2026/luxury-healthier-foundations-and-genai" },
  { name: "web.dev: Milliseconds make millions", url: "https://web.dev/case-studies/milliseconds-make-millions" },
  { name: "Saint Laurent US client service", url: "https://www.ysl.com/en-us/client-service" },
];
