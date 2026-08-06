"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { regions } from "@/lib/regions";

export default function Header() {
  const pathname = usePathname();
  const hasHero = pathname === "/" || regions.some((region) => `/${region.slug}` === pathname);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!hasHero) return;
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasHero]);

  const transparent = hasHero && !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 flex h-16 items-center transition-colors ${
        transparent
          ? "border-b border-transparent bg-transparent"
          : "border-b border-black/10 bg-white dark:border-white/10 dark:bg-black"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className={`flex items-center gap-2 font-display text-lg font-semibold tracking-tight transition-colors ${
            transparent ? "text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.7)]" : ""
          }`}
        >
          <span
            aria-hidden
            className="inline-block h-3 w-3 rounded-full"
            style={{ background: "linear-gradient(135deg, #09453e, #d98324)" }}
          />
          Places of Italy
        </Link>
        <nav
          className={`flex items-center gap-6 text-sm font-medium transition-colors ${
            transparent
              ? "text-white/90 [text-shadow:0_1px_4px_rgba(0,0,0,0.7)]"
              : "text-zinc-600 dark:text-zinc-300"
          }`}
        >
          <Link
            href="/#regioni"
            className={`transition-colors ${
              transparent ? "hover:text-white" : "hover:text-brand-600 dark:hover:text-white"
            }`}
          >
            Tutte le regioni
          </Link>
        </nav>
      </div>
    </header>
  );
}
