import type { Metadata } from "next";
import Link from "next/link";
import { regions } from "@/lib/regions";

export const metadata: Metadata = {
  title: "Credit e Partner",
  description: "Crediti fotografici e partner del circuito Places of Italy.",
};

export default function CreditEPartnerPage() {
  const photoCredits = regions.filter((region) => region.photoCredit);

  return (
    <div className="mx-auto max-w-3xl px-6 pb-16 pt-32">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-50">
        Credit e Partner
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Crediti e circuito partner
      </h1>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold tracking-tight">Crediti fotografici</h2>
        <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Le immagini utilizzate per raccontare le regioni provengono da
          Wikimedia Commons e dai rispettivi autori, secondo le licenze
          indicate.
        </p>
        <ul className="mt-5 divide-y divide-black/10 dark:divide-white/10">
          {photoCredits.map((region) => (
            <li key={region.slug} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3">
              <span className="font-medium">{region.name}</span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">{region.photoCredit}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold tracking-tight">Partner</h2>
        <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Il circuito partner di Places of Italy è in costruzione: qui
          troverai presto i canali social e i creator che raccontano il loro
          territorio insieme a noi.
        </p>
        <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Gestisci un canale social dedicato al tuo territorio?{" "}
          <Link href="/registrati" className="font-medium text-brand-600 hover:underline dark:text-brand-50">
            Registrati
          </Link>{" "}
          per entrare a far parte del circuito.
        </p>
      </section>
    </div>
  );
}
