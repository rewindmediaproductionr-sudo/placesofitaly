import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRegionBySlug } from "@/lib/regions";
import LikeStats from "@/components/LikeStats";
import LikeButton from "@/components/LikeButton";
import { getEntity, getEntityById, getLike } from "@/lib/ratings/queries";
import { provinciaRef, comuneRef, regionRef } from "@/lib/ratings/refs";

export const revalidate = 900;

async function loadComune(regionSlug: string, provinciaSlug: string, comuneSlug: string) {
  const region = getRegionBySlug(regionSlug);
  if (!region) return null;

  const provincia = await getEntity(provinciaRef(provinciaSlug));
  if (!provincia || provincia.kind !== "provincia") return null;

  const provinciaParent = provincia.parentId ? await getEntityById(provincia.parentId) : null;
  if (!provinciaParent || provinciaParent.ref !== regionRef(regionSlug)) return null;

  const comune = await getEntity(comuneRef(provinciaSlug, comuneSlug));
  if (!comune || comune.kind !== "comune" || comune.parentId !== provincia.id) return null;

  return { region, provincia, comune };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string; provincia: string; comune: string }>;
}): Promise<Metadata> {
  const { region: regionSlug, provincia: provinciaSlug, comune: comuneSlug } = await params;
  const loaded = await loadComune(regionSlug, provinciaSlug, comuneSlug);
  if (!loaded) return {};

  return {
    title: `${loaded.comune.name} — ${loaded.provincia.name}`,
    description: `${loaded.comune.name}, comune della provincia di ${loaded.provincia.name}, ${loaded.region.name}.`,
  };
}

export default async function ComunePage({
  params,
}: {
  params: Promise<{ region: string; provincia: string; comune: string }>;
}) {
  const { region: regionSlug, provincia: provinciaSlug, comune: comuneSlug } = await params;
  const loaded = await loadComune(regionSlug, provinciaSlug, comuneSlug);
  if (!loaded) {
    notFound();
  }
  const { region, provincia, comune } = loaded;

  const likes = await getLike(comune.ref);

  return (
    <article>
      <div className="relative flex min-h-[280px] flex-col justify-end overflow-hidden bg-zinc-900 px-6 py-16 text-white">
        <div className="relative mx-auto w-full max-w-4xl">
          <Link
            href={`/${region.slug}/${provincia.slug}`}
            className="text-sm text-white/70 hover:text-white"
          >
            ← Provincia di {provincia.name}
          </Link>
          <p className="mt-4 text-sm font-medium uppercase tracking-widest text-white/70">
            Comune · {region.name}
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            {comune.name}
          </h1>
          <LikeStats summary={likes} className="mt-6" />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-16">
        <section className="rounded-2xl border border-black/10 p-6 dark:border-white/10">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Ti piace {comune.name}?
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Il tuo like fa salire il punteggio di {comune.name} e si somma a
            quello della provincia di {provincia.name} e di {region.name}.
          </p>
          <div className="mt-5">
            <LikeButton entityRef={comune.ref} initialSummary={likes} />
          </div>
        </section>
      </div>
    </article>
  );
}
