export const SITE = {
  name: "Art Visions",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://art-visions.tn",
  // Real contact details must be set in .env — never invented here.
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@art-visions.tn",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "21655804227",
  phoneDisplay: "+216 55 804 227",
  mapUrl: "https://maps.app.goo.gl/2uGNqAdctZRgFVf87",
} as const;
