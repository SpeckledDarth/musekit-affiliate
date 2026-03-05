// These are intentionally static third-party integration configs.
// They represent external affiliate network platforms and are not stored in the database.
export const networksConfig = [
  {
    name: "ShareASale",
    status: "connected" as const,
    affiliates: 120,
    url: "https://shareasale.com",
  },
  {
    name: "Impact",
    status: "not_connected" as const,
    affiliates: 0,
    url: "https://impact.com",
  },
  {
    name: "CJ Affiliate",
    status: "not_connected" as const,
    affiliates: 0,
    url: "https://cj.com",
  },
  {
    name: "Partnerize",
    status: "connected" as const,
    affiliates: 45,
    url: "https://partnerize.com",
  },
];
