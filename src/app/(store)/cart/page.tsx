import type { Metadata } from "next";
import { CartPage } from "@/components/cart/CartPage";

export const metadata: Metadata = {
  title: "Shopping Bag",
};

export default function Cart() {
  return <CartPage />;
}
