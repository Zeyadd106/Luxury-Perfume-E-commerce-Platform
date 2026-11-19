import type { Metadata } from "next";
import { ShopPage } from "@/components/shop/ShopClient";
import { brandConfig } from "@/config/brand.config";

export const metadata: Metadata = {
  title: "Shop All Fragrances",
  description: `Browse the complete ${brandConfig.name} collection — eau de parfum, extrait and eau de toilette compositions.`,
};

export default function Shop() {
  return <ShopPage />;
}
