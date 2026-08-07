import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRegionBySlug, regions } from "@/lib/regions";
import RegionScene from "@/components/RegionScene";

export function generateStaticParams() {
  return regions.map((region) => ({ region: region.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>;
}): Promise<Metadata> {
  const { region: slug } = await params;
  const region = getRegionBySlug(slug);

  if (!region) {
    return {};
  }

  return {
    title: region.name,
    description: region.description,
  };
}

const SOCIAL_LABELS: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  youtube: "YouTube",
};

export default async function RegionPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region: slug } = await params;
  const region = getRegionBySlug(slug);

  if (!region) {
    notFound();
  }

  const socialEntries = Object.entries(region.social ?? {});

  return (
    <article>
      <div className="relative flex min-h-[380px] flex-col justify-end overflow-hidden px-6 py-16 text-white">
        {region.photo ? (
          <Image
            src={region.photo}
            alt=""
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <RegionScene
            kind={region.visual.kind}
            colors={region.gradient}
            landmark={region.visual.landmark}
            water={region.visual.water}
            className="absolute inset-0 h-full w-full"
          />
        )}
        <span className="absolute inset-0 bg-black/45" aria-hidden />
        <div className="relative mx-auto w-full max-w-4xl">
          <Link href="/" className="text-sm text-white/70 hover:text-white">
            ← Tutte le regioni
          </Link>
          <p className="mt-4 text-sm font-medium uppercase tracking-widest text-white/70">
            Capoluogo: {region.capital}
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            {region.name}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/85">{region.tagline}</p>
          {region.photoCredit && (
            <p className="mt-6 text-xs text-white/60">Foto: {region.photoCredit}</p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-16">
        <section>
          <h2 className="font-display text-xl font-semibold tracking-tight">Panoramica</h2>
          <p className="mt-3 leading-relaxed text-zinc-700 dark:text-zinc-300">
            {region.description}
          </p>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold tracking-tight">Da non perdere</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {region.highlights.map((highlight) => (
              <li
                key={highlight}
                className="rounded-2xl bg-zinc-100 px-4 py-3 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
              >
                {highlight}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Canali social di {region.name}
          </h2>
          {socialEntries.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-3">
              {socialEntries.map(([platform, url]) => (
                <li key={platform}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full border border-black/10 px-4 py-2 text-sm font-medium transition-colors hover:border-brand-500 hover:text-brand-600 dark:border-white/15 dark:hover:border-brand-500 dark:hover:text-white"
                  >
                    {SOCIAL_LABELS[platform] ?? platform}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-500">
              Canale in fase di attivazione. Se gestisci i profili social
              ufficiali di {region.name}, condividili con noi nell&apos;area
              partner del portale.
            </p>
          )}
        </section>
      </div>
    </article>
  );
}
