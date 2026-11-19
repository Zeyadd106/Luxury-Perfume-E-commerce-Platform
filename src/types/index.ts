export type FragranceFamily =
  | "woody"
  | "floral"
  | "oriental"
  | "fresh"
  | "citrus"
  | "gourmand"
  | "aromatic";

export type Gender = "women" | "men" | "unisex";

export type ProductBadge = "new" | "bestseller" | "limited" | "sale" | null;

export interface ProductSize {
  ml: number;
  price: number;
  compareAtPrice?: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  collection: string; // collection slug
  fragranceFamily: FragranceFamily;
  gender: Gender;
  sizes: ProductSize[];
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  ingredients: string[];
  rating: number;
  reviewsCount: number;
  stock: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  createdAt: string;
  badge: ProductBadge;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  productSlugs: string[];
  isFeatured: boolean;
  order: number;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  sizeMl: number;
  price: number;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  slug: string;
  addedAt: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  country: string;
  postalCode: string;
}

export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  shippingMethod: string;
  paymentMethod: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface NewsletterSubscription {
  email: string;
  subscribedAt: string;
}
