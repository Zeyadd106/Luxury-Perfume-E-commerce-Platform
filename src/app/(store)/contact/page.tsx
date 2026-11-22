import type { Metadata } from "next";
import { ContactClient } from "@/components/contact/ContactClient";
import { brandConfig } from "@/config/brand.config";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact the ${brandConfig.name} concierge team — we reply within one business day.`,
};

export default function ContactPage() {
  return <ContactClient />;
}
