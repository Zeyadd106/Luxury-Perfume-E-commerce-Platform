import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Admin — New Product" };

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-light">New Fragrance</h1>
      <ProductForm productId="new" />
    </div>
  );
}
