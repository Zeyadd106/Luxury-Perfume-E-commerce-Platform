import type { Review } from "@/types";
import { products } from "./products";

const firstNames = ["Camille", "Julien", "Sofia", "Antoine", "Mei", "Lars", "Isabella", "Noah", "Aiko", "Gabriel", "Chloé", "Mateo", "Ingrid", "Omar", "Elena", "Felix"];
const lastInitials = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const comments: Record<string, { title: string; comment: string }[]> = {
  "p-noir": [
    { title: "Deep and magnetic", comment: "This is the kind of fragrance people stop you to ask about. The oud is smoked but never medicinal — it dries down to something incredibly warm." },
    { title: "Evening perfection", comment: "Two sprays and it lasts until morning. Compliments within an hour every single time." },
    { title: "Worth every cent", comment: "I've tried many niche ouds; this has the best balance of freshness and depth. The vanilla base is subtle genius." },
    { title: "A signature", comment: "My third bottle. I wear it year-round and it never feels out of place." },
  ],
  "p-lune": [
    { title: "Pure silk", comment: "Soft, luminous, impossible to tire of. The rose is never syrupy — it's dewy and cool." },
    { title: "Compliment magnet", comment: "Wore this to a wedding and had three people ask what it was before dessert." },
    { title: "My everyday luxury", comment: "The musk base keeps it clean enough for daytime but it's still unmistakably special." },
  ],
  "p-oud": [
    { title: "Museum quality", comment: "You can feel the patience in this composition. The saffron opening is exquisite." },
    { title: "Investment piece", comment: "Expensive, but a little goes an extremely long way. This is a collector's fragrance." },
    { title: "Subtle power", comment: "Not loud at all — it draws people in rather than announcing itself. Perfect." },
  ],
  "p-zeste": [
    { title: "Summer in a bottle", comment: "Crushed bergamot without the cheap cologne edge. The sea fennel in the heart is a lovely surprise." },
    { title: "Clean and uplifting", comment: "I reach for this on hot days. Refreshing without being soapy." },
  ],
  "p-douceur": [
    { title: "Edible but elegant", comment: "Gourmand done right — never cloying, always creamy. The caramel note is beautifully controlled." },
    { title: "Cozy luxury", comment: "Like a cashmere blanket you can smell. My autumn and winter signature." },
  ],
  "p-fleur": [
    { title: "The perfect fougère", comment: "Finally a fougère that doesn't smell like 1992. The clary sage and oakmoss blend is masterful." },
    { title: "Office safe", comment: "Enough character to be interesting, clean enough for work. A rare balance." },
  ],
  "p-ambre": [
    { title: "Liquid amber", comment: "Warm, golden, endlessly smooth. The benzoin dry-down is what dreams are made of." },
    { title: "My most reached-for", comment: "Third bottle. It's the fragrance I get asked about most." },
  ],
  "p-rose": [
    { title: "Grasse at its best", comment: "You can smell the dawn harvest. This rose is dewy, real, and absolutely stunning." },
    { title: "Opulent but wearable", comment: "Patchouli base keeps it grounded. Wore it to dinner and felt like royalty." },
  ],
  "p-santal": [
    { title: "Creamy sandalwood", comment: "The Mysore note is unmistakable — milky, soft, meditative. My new winter signature." },
    { title: "Worth the wait", comment: "It took me a moment to get it, but once the sandalwood blooms it's perfection." },
  ],
  "p-bergamote": [
    { title: "Green and crisp", comment: "Basil and fig leaf give it a real green edge. Extremely fresh for a niche house." },
    { title: "Daytime hero", comment: "Easy to wear, never overpowering. Great for the office or weekends." },
  ],
  "p-jasmin": [
    { title: "After-dark magic", comment: "The tuberose and jasmine are narcotic but never headache-inducing. Wore it on a first date — he noticed." },
    { title: "Radiant", comment: "The vanilla orchid base gives it a glow that suits evening perfectly." },
  ],
  "p-encens": [
    { title: "Church but make it fashion", comment: "Frankincense without the church basement vibe — brightened by bergamot and grounded by cedar." },
    { title: "Meditative", comment: "Very calming and spiritual. My go-to for slow mornings." },
  ],
  "p-ambre-ltd": [
    { title: "A numbered treasure", comment: "The coffret alone is a work of art. The fragrance is luminous — saffron and immortelle in perfect balance." },
  ],
};

const fallback = [
  { title: "Beautifully composed", comment: "Elegant, well-blended, and lasting far longer than expected. A new favorite." },
  { title: "Impressive", comment: "You can tell real perfumery went into this. It evolves beautifully over hours." },
  { title: "Highly recommended", comment: "Bought as a gift, ended up ordering a second bottle for myself." },
];

export const reviews: Review[] = products.flatMap((p) => {
  const pool = [...(comments[p.id] ?? fallback)];
  const count = Math.min(p.reviewsCount, pool.length + 2);
  return Array.from({ length: count }, (_, i) => {
    const source = pool[i % pool.length];
    const name = `${firstNames[(i * 7 + p.id.length) % firstNames.length]} ${lastInitials[(i * 3) % lastInitials.length]}.`;
    return {
      id: `r-${p.id}-${i}`,
      productId: p.id,
      author: name,
      rating: Math.min(5, Math.max(4, Math.round(p.rating + ((i % 3) - 1) * 0.4))),
      title: source.title,
      comment: source.comment,
      date: `2025-${String((i % 11) + 1).padStart(2, "0")}-1${i % 9}`,
      verified: i % 4 !== 3,
    };
  });
});

export function getReviewsForProduct(productId: string): Review[] {
  return reviews.filter((r) => r.productId === productId);
}
