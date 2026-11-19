import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { QuickViewModal } from "@/components/products/QuickViewModal";
import { ToastViewport } from "@/components/ui/Toast";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <SearchOverlay />
      <QuickViewModal />
      <ToastViewport />
    </div>
  );
}
