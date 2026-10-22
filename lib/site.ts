/** Set NEXT_PUBLIC_SITE_URL to your production domain before building. */
export const site = {
  name: "RIGAT",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    "https://bmn-precision-cinematic.braveshore128.chatgpt.site",
  title: "Rideaux métalliques à Marseille — RIGAT, fabricant depuis 1956",
  description:
    "Fabricant de rideaux métalliques à Marseille depuis 1956. Grilles roulantes, portes de garage et fermetures industrielles sur mesure pour les particuliers et les professionnels.",
  phone: "04 91 98 32 80",
  phoneHref: "tel:+33491983280",
  email: "contact@fabricant-rideaux-metalliques.com",
} as const;
