import Link from "next/link";
import { regions } from "@/lib/regions";

export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-zinc-50 dark:border-white/10 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-display text-lg font-semibold tracking-tight">Places of Italy</p>
            <p className="mt-2 max-w-xs text-sm text-zinc-600 dark:text-zinc-400">
              Il portale che racconta le 20 regioni d&apos;Italia attraverso i loro luoghi
              e le loro storie.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">Regioni</p>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              {regions.slice(0, 8).map((region) => (
                <li key={region.slug}>
                  <Link href={`/${region.slug}`} className="hover:text-brand-600 dark:hover:text-white">
                    {region.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/#regioni"
              className="mt-3 inline-block text-sm text-zinc-500 underline underline-offset-2 hover:text-brand-600 dark:hover:text-white"
            >
              Vedi tutte le 20 regioni
            </Link>
          </div>
          <div className="sm:text-right">
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              &copy; {new Date().getFullYear()} Places of Italy
            </p>
            <Link
              href="/tools"
              className="mt-2 inline-block text-xs text-zinc-400 hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-400"
            >
              Area partner
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
