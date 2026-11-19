import type { Collection } from "@/types";

export const collections: Collection[] = [
  {
    id: "col-signature",
    slug: "signature",
    name: "Signature Collection",
    tagline: "The pillars of the house",
    description:
      "Four compositions that define the Atelier — each one a chapter in our olfactory story, built to be worn for years.",
    image: "/images/collection-signature.svg",
    productSlugs: ["noir-absolu", "fleur-de-lune", "ambre-dore", "encens-sacre", "vanille-gourmande", "fougere-sauvage"],
    isFeatured: true,
    order: 1,
  },
  {
    id: "col-private",
    slug: "private",
    name: "Private Collection",
    tagline: "Compositions without compromise",
    description:
      "Our most concentrated extraits, blended in batches of fifty flacons. Private Collection pieces are created for collectors and connoisseurs.",
    image: "/images/collection-private.svg",
    productSlugs: ["oud-royal", "rose-imperiale", "santal-blanc", "jasmin-de-minuit"],
    isFeatured: true,
    order: 2,
  },
  {
    id: "col-oud",
    slug: "oud",
    name: "Oud Collection",
    tagline: "The wood that dreams",
    description:
      "A single-minded exploration of agarwood — from smoky Assam to honeyed Cambodian notes, rendered at extrait concentration.",
    image: "/images/collection-oud.svg",
    productSlugs: ["oud-royal", "noir-absolu", "encens-sacre"],
    isFeatured: false,
    order: 3,
  },
  {
    id: "col-limited",
    slug: "limited",
    name: "Limited Edition",
    tagline: "Numbered, not repeated",
    description:
      "Small-batch creations released seasonally and never reproduced. When a Limited Edition is gone, it is gone.",
    image: "/images/collection-limited.svg",
    productSlugs: ["ambre-royal-ltd"],
    isFeatured: true,
    order: 4,
  },
  {
    id: "col-summer",
    slug: "summer",
    name: "Summer Collection",
    tagline: "Light on skin, bright in spirit",
    description:
      "Solar, saline and green compositions designed for long days — fresh without fragility, vibrant without excess.",
    image: "/images/collection-summer.svg",
    productSlugs: ["citrus-eternel", "bergamote-verte"],
    isFeatured: false,
    order: 5,
  },
  {
    id: "col-new",
    slug: "new",
    name: "New Arrivals",
    tagline: "Just composed",
    description:
      "The newest expressions from our Grasse atelier — recently launched and awaiting their first loyal wearers.",
    image: "/images/collection-new.svg",
    productSlugs: ["santal-blanc", "bergamote-verte", "rose-imperiale"],
    isFeatured: false,
    order: 6,
  },
];
