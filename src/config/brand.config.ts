export interface BrandTheme {
  /** Deep primary — backgrounds, headings */
  ink: string;
  /** Light secondary — light section backgrounds */
  ivory: string;
  /** Champagne gold accent */
  accent: string;
  /** Muted text on dark */
  muted: string;
  /** Border color */
  line: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: "instagram" | "facebook" | "pinterest" | "youtube" | "twitter";
}

export interface Announcement {
  id: string;
  message: string;
  href?: string;
}

export interface HeroContent {
  eyebrow: string;
  title: string;
  titleEmphasis: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  image: string;
  imageAlt: string;
}

export interface BrandConfig {
  name: string;
  tagline: string;
  description: string;
  currency: string;
  locale: string;
  founded: number;
  theme: BrandTheme;
  logoText: string;
  faviconInitial: string;
  navigation: NavLink[];
  footerNavigation: {
    shop: NavLink[];
    help: NavLink[];
    house: NavLink[];
  };
  socialLinks: SocialLink[];
  contact: {
    email: string;
    phone: string;
    address: string[];
    hours: string;
  };
  announcementBar: {
    enabled: boolean;
    intervalMs: number;
    items: Announcement[];
  };
  hero: HeroContent;
  freeShippingThreshold: number;
}

export const brandConfig: BrandConfig = {
  name: "ZEIN",
  tagline: "The Art of Lasting Impressions",
  description:
    "A modern haute parfumerie house crafting timeless eaux de parfum with rare ingredients and uncompromising craftsmanship.",
  currency: "USD",
  locale: "en-US",
  founded: 1998,
  theme: {
    ink: "#0c0c0c",
    ivory: "#f4efe4",
    accent: "#facc15",
    muted: "#a89f8d",
    line: "#ddd3c0",
  },
  logoText: "ZEIN",
  faviconInitial: "Z",
  navigation: [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Collections", href: "/collections" },
    { label: "Our Story", href: "/our-story" },
    { label: "Contact", href: "/contact" },
  ],
  footerNavigation: {
    shop: [
      { label: "All Products", href: "/shop" },
      { label: "Best Sellers", href: "/shop?filter=bestsellers" },
      { label: "New Arrivals", href: "/shop?filter=new" },
      { label: "Gift Sets", href: "/collections" },
    ],
    help: [
      { label: "Shipping & Returns", href: "/contact" },
      { label: "FAQ", href: "/contact" },
      { label: "Track Order", href: "/account/orders" },
      { label: "Contact Us", href: "/contact" },
    ],
    house: [
      { label: "Our Story", href: "/our-story" },
      { label: "Collections", href: "/collections" },
      { label: "Journal", href: "/our-story" },
      { label: "Careers", href: "/contact" },
    ],
  },
  socialLinks: [
    { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
    { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
    { label: "Pinterest", href: "https://pinterest.com", icon: "pinterest" },
    { label: "YouTube", href: "https://youtube.com", icon: "youtube" },
  ],
  contact: {
    email: "concierge@zein.com",
    phone: "+1 (212) 555-0187",
    address: ["12 Rue de la Paix", "75002 Paris, France"],
    hours: "Mon – Sat · 10:00 – 19:00 CET",
  },
  announcementBar: {
    enabled: true,
    intervalMs: 5000,
    items: [
      { id: "a1", message: "Complimentary shipping on orders over $250" },
      { id: "a2", message: "Discover the Private Collection — now available" },
      { id: "a3", message: "15% off your first order with code FIRST15", href: "/shop" },
    ],
  },
  hero: {
    eyebrow: "Maison de Haute Parfumerie",
    title: "Scent as",
    titleEmphasis: "High Art",
    subtitle:
      "Rare essences, patient craftsmanship, and compositions that linger long after the moment has passed.",
    primaryCta: { label: "Discover the Collection", href: "/shop" },
    secondaryCta: { label: "Our Story", href: "/our-story" },
    image: "/images/hero-main.svg",
    imageAlt: "Zein signature flacon on a moody editorial backdrop",
  },
  freeShippingThreshold: 250,
};
