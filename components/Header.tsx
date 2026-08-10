"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { regions } from "@/lib/regions";
import { logout } from "@/app/actions/auth";
import { getInitials } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";

const MENU_LINKS = [
  { href: "/#regioni", label: "Tutte le regioni" },
  { href: "/chi-siamo", label: "Chi siamo" },
  { href: "/vision-e-mission", label: "Vision e Mission" },
  { href: "/credit-e-partner", label: "Credit e Partner" },
];

interface HeaderUser {
  fullName: string;
  email: string;
}

export default function Header() {
  const pathname = usePathname();
  const hasHero = pathname === "/" || regions.some((region) => `/${region.slug}` === pathname);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<HeaderUser | null>(null);

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
    const supabase = createClient();
    let active = true;

    async function loadUser() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        if (active) setUser(null);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", authUser.id)
        .single();

      if (active) {
        setUser({
          fullName: profile?.full_name ?? authUser.email ?? "",
          email: authUser.email ?? "",
        });
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => loadUser());

    return () => {
      active = false;
      subscription.unsubscribe();
    };
    // Ricontrolla anche a ogni cambio pagina, per riflettere subito il
    // redirect lato server dopo login/logout (le cookie non emettono un
    // evento onAuthStateChange lato client).
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const transparent = hasHero && !scrolled && !menuOpen;

  return (
    <>
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
              className={transparent ? "hidden" : "block h-10 w-auto dark:hidden"}
            />
            <Image
              src="/brand/poit-dark.svg"
              alt="Places of Italy"
              width={580}
              height={251}
              priority
              className={transparent ? "block h-10 w-auto" : "hidden h-10 w-auto dark:block"}
            />
          </Link>

          <div className="flex items-center gap-2">
            {user && (
              <Link
                href="/profilo"
                aria-label="Il mio profilo"
                title={user.fullName}
                className={`flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white ring-2 transition-colors ${
                  transparent ? "ring-white/70" : "ring-white dark:ring-black"
                }`}
              >
                {getInitials(user.fullName)}
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              aria-label="Apri il menu"
              className={`-mr-2 flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
                transparent
                  ? "text-white/90 hover:bg-white/10 [text-shadow:0_1px_4px_rgba(0,0,0,0.7)]"
                  : "text-zinc-600 hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/10"
              }`}
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                className="h-10 w-10"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div
          id="site-menu"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white text-zinc-900 dark:bg-black dark:text-zinc-50"
        >
          <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-end px-6">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Chiudi il menu"
              className="-mr-2 flex h-14 w-14 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/10"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                className="h-10 w-10"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-10 px-6 pb-16 text-center">
            <Image
              src="/brand/poit-light.svg"
              alt="Places of Italy"
              width={580}
              height={251}
              className="h-12 w-auto dark:hidden"
            />
            <Image
              src="/brand/poit-dark.svg"
              alt="Places of Italy"
              width={580}
              height={251}
              className="hidden h-12 w-auto dark:block"
            />

            <nav className="w-full max-w-xs border-t border-black/10 dark:border-white/10">
              {MENU_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block border-b border-black/10 py-5 text-lg font-medium tracking-tight transition-colors hover:text-brand-600 dark:border-white/10 dark:hover:text-brand-50"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {user ? (
              <div className="flex w-full max-w-xs flex-col gap-3">
                <div className="flex items-center justify-center gap-3 pb-2">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
                    {getInitials(user.fullName)}
                  </span>
                  <span className="text-left text-sm">
                    <span className="block font-medium">{user.fullName}</span>
                    <span className="block text-zinc-500 dark:text-zinc-400">
                      {user.email}
                    </span>
                  </span>
                </div>
                <Link
                  href="/profilo"
                  className="w-full rounded-md bg-zinc-900 py-4 text-center text-base font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Il mio profilo
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    className="w-full rounded-md border border-zinc-900 py-4 text-center text-base font-medium transition-colors hover:bg-zinc-900 hover:text-white dark:border-zinc-50 dark:hover:bg-zinc-50 dark:hover:text-zinc-900"
                  >
                    Esci
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex w-full max-w-xs flex-col gap-3">
                <Link
                  href="/accedi"
                  className="w-full rounded-md bg-zinc-900 py-4 text-center text-base font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Accedi
                </Link>
                <Link
                  href="/registrati"
                  className="w-full rounded-md border border-zinc-900 py-4 text-center text-base font-medium transition-colors hover:bg-zinc-900 hover:text-white dark:border-zinc-50 dark:hover:bg-zinc-50 dark:hover:text-zinc-900"
                >
                  Registrati
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
