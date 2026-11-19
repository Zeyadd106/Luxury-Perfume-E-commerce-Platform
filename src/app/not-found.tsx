import Link from "next/link";
import { brandConfig } from "@/config/brand.config";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-ivory px-5 text-center">
      <p className="eyebrow text-accent">404</p>
      <h1 className="mt-4 font-serif text-5xl font-light">This scent has faded</h1>
      <p className="mt-4 max-w-sm text-sm font-light text-muted">
        The page you&rsquo;re looking for doesn&rsquo;t exist or has been retired from the collection.
      </p>
      <Link
        href="/"
        className="eyebrow mt-10 border border-ink px-10 py-4 transition-colors hover:bg-ink hover:text-ivory"
      >
        Return Home — {brandConfig.name}
      </Link>
    </div>
  );
}
