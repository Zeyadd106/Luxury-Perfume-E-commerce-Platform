import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Admin — Edit Product" };

export default async function EditProductPage({ params }: PageProps<"/admin/products/[id]">) {
  const { id } = await params;
  // The form resolves the live browser catalog client-side, so products created
  // via the admin (not present in the seed data) are editable here too.
  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-light">Edit Fragrance</h1>
      <ProductForm productId={id} />
    </div>
  );
}
