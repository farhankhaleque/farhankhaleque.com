// Current roles, shown to the right of the PRESENT bar on the Experience page.
// `featured` sits on top, separated from the rest.

export type CurrentRole = {
  title: string;
  org: string;
  since?: string;
  text?: string;
  featured?: boolean;
};

export const CURRENT_ROLES: CurrentRole[] = [
  { title: "Peer Advising Leader", org: "NYU College of Arts and Science", featured: true },
  {
    title: "President",
    org: "NYU Muslim Student Association",
    since: "May 2026",
    text: "Lead the executive board and manage a $28,650 annual budget for approximately 5,000 members.",
  },
  {
    title: "Senator at Large",
    org: "NYU Student Government Assembly",
    since: "May 2026",
    text: "Serve in a 40 senator assembly, drafting legislation and funding proposals for student initiatives.",
  },
  {
    title: "Director of Marketing",
    org: "NYU Stern Luxury and Retail Association",
    since: "May 2026",
    text: "Run marketing for industry events of 60 to 90 attendees, including events with LVMH and Ralph Lauren.",
  },
];
