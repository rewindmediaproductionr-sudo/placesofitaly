"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { regions } from "@/lib/regions";

const MENU_LINKS = [
  { href: "/chi-siamo", label: "Chi siamo" },
  { href: "/vision-e-mission", label: "Vision e Mission" },
  { href: "/credit-e-partner", label: "Credit e Partner" },
];

export default function Header() {
  const pathname = usePathname();
  const hasHero = pathname === "/" || regions.some((region) => `/${region.slug}` === pathname);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasHero) return;
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasHero]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const transparent = hasHero && !scrolled && !menuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 flex h-16 items-center transition-colors ${
        transparent
          ? "border-b border-transparent bg-transparent"
          : "border-b border-black/10 bg-white dark:border-white/10 dark:bg-black"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/brand/poit-light.svg"
            alt="Places of Italy"
            width={580}
            height={251}
            priority
            className={transparent ? "hidden" : "block h-8 w-auto dark:hidden"}
          />
          <Image
            src="/brand/poit-dark.svg"
            alt="Places of Italy"
            width={580}
            height={251}
            priority
            className={transparent ? "block h-8 w-auto" : "hidden h-8 w-auto dark:block"}
          />
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

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              aria-label="Apri il menu"
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                transparent
                  ? "hover:bg-white/10"
                  : "hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                className="h-5 w-5"
              >
                {menuOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>

            {menuOpen && (
              <div
                id="site-menu"
                className="absolute right-0 top-12 w-56 rounded-xl border border-black/10 bg-white p-2 text-zinc-900 shadow-lg dark:border-white/10 dark:bg-black dark:text-zinc-50"
              >
                {MENU_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-2 border-t border-black/10 pt-2 dark:border-white/10">
                  <Link
                    href="/registrati"
                    className="block rounded-lg bg-brand-600 px-3 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                  >
                    Registrati
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
