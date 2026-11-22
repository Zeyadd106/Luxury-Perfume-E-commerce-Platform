"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { brandConfig } from "@/config/brand.config";
import { cn } from "@/lib/utils";

export function AnnouncementBar() {
  const { announcementBar } = brandConfig;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!announcementBar.enabled || announcementBar.items.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % announcementBar.items.length);
    }, announcementBar.intervalMs);
    return () => clearInterval(id);
  }, [announcementBar.enabled, announcementBar.items.length, announcementBar.intervalMs]);

  if (!announcementBar.enabled || announcementBar.items.length === 0) return null;
  const item = announcementBar.items[index];

  return (
    <div className="bg-accent text-ink" role="region" aria-label="Announcements">
      <div className="relative flex h-9 items-center justify-center overflow-hidden px-4">
        {announcementBar.items.map((a, i) => (
          <div
            key={a.id}
            aria-hidden={i !== index}
            className={cn(
              "absolute inset-x-4 flex items-center justify-center gap-2 text-[0.6875rem] font-light tracking-[0.14em] uppercase transition-all duration-700",
              i === index ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            )}
          >
            {item.href ? (
              <Link href={item.href} className="hover:opacity-70 transition-opacity">
                {a.message}
              </Link>
            ) : (
              <span>{a.message}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
