import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRegionBySlug } from "@/lib/regions";
import LikeStats from "@/components/LikeStats";
import LikeButton from "@/components/LikeButton";
import { getEntity, getEntityById, getChildren, getLike } from "@/lib/ratings/queries";
import { provinciaRef, regionRef } from "@/lib/ratings/refs";

// Nessuna generateStaticParams qui: a differenza delle regioni (statiche in
// lib/regions.ts), provincia e comune vivono solo nel database e possono
// crescere nel tempo. La pagina resta comunque cacheable: si rigenera al
// massimo ogni 15 minuti (ISR on-demand), non a ogni richiesta.
export const revalidate = 900;

async function loadProvincia(regionSlug: string, provinciaSlug: string) {
  const region = getRegionBySlug(regionSlug);
  if (!region) return null;

  const provincia = await getEntity(provinciaRef(provinciaSlug));
  if (!provincia || provincia.kind !== "provincia") return null;

  // Non basta che la provincia esista: deve appartenere alla regione
  // dell'URL, altrimenti /lombardia/chieti risulterebbe valida.
  const parent = provincia.parentId ? await getEntityById(provincia.parentId) : null;
  if (!parent || parent.ref !== regionRef(regionSlug)) return null;

  return { region, provincia };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string; provincia: string }>;
}): Promise<Metadata> {
  const { region: regionSlug, provincia: provinciaSlug } = await params;
  const loaded = await loadProvincia(regionSlug, provinciaSlug);
  if (!loaded) return {};

  return {
    title: `${loaded.provincia.name} — ${loaded.region.name}`,
    description: `Comuni e influencer della provincia di ${loaded.provincia.name} in ${loaded.region.name}.`,
  };
}

export default async function ProvinciaPage({
  params,
}: {
  params: Promise<{ region: string; provincia: string }>;
}) {
  const { region: regionSlug, provincia: provinciaSlug } = await params;
  const loaded = await loadProvincia(regionSlug, provinciaSlug);
  if (!loaded) {
    notFound();
  }
  const { region, provincia } = loaded;

  const [comuni, likes] = await Promise.all([
    getChildren(provincia.id, "comune"),
    getLike(provincia.ref),
  ]);

  return (
    <article>
      <div className="relative flex min-h-[280px] flex-col justify-end overflow-hidden bg-zinc-900 px-6 py-16 text-white">
        <div className="relative mx-auto w-full max-w-4xl">
          <Link href={`/${region.slug}`} className="text-sm text-white/70 hover:text-white">
            ← {region.name}
          </Link>
          <p className="mt-4 text-sm font-medium uppercase tracking-widest text-white/70">
            Provincia
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            {provincia.name}
          </h1>
          <LikeStats summary={likes} className="mt-6" />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-16">
        <section className="rounded-2xl border border-black/10 p-6 dark:border-white/10">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Ti piace la provincia di {provincia.name}?
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Il tuo like fa salire il punteggio della provincia e di tutti i suoi
            comuni.
          </p>
          <div className="mt-5">
            <LikeButton entityRef={provincia.ref} initialSummary={likes} />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Comuni ({comuni.length})
          </h2>
          {comuni.length > 0 ? (
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {comuni.map((comune) => (
                <li key={comune.ref}>
                  <Link
                    href={`/${region.slug}/${provincia.slug}/${comune.slug}`}
                    className="block rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:text-brand-600 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:text-brand-400"
                  >
                    {comune.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-500">
              I comuni di questa provincia non sono ancora stati caricati.
            </p>
          )}
        </section>
      </div>
    </article>
  );
}
