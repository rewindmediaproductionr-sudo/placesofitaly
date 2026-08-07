import Image from "next/image";
import Link from "next/link";
import RegionCard from "@/components/RegionCard";
import { regions } from "@/lib/regions";

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-black/10 text-white dark:border-white/10">
        <Image
          src="/hero/home-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span className="absolute inset-0 bg-black/45" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center sm:py-32">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-50">
            20 regioni, un solo racconto
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-6xl">
            Places of Italy
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/85">
            Il portale che racconta l&apos;Italia una regione alla volta: montagne,
            coste, borghi e città, con uno sguardo dedicato a chi ogni giorno
            promuove il proprio territorio sui social.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#regioni"
              className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-500"
            >
              Esplora
            </a>
            <Link
              href="/registrati"
              className="inline-flex items-center justify-center rounded-full border border-white px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-zinc-900"
            >
              Registrati
            </Link>
          </div>
        </div>
      </section>

      <section id="regioni" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Tutte le regioni d&apos;Italia
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Scegli una regione per scoprire cosa vedere e i suoi canali social.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((region) => (
            <RegionCard key={region.slug} region={region} />
          ))}
        </div>
      </section>

      <section className="border-t border-black/10 bg-zinc-50 dark:border-white/10 dark:bg-zinc-950">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Gestisci i canali social della tua regione?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
            Places of Italy nasce anche per dare voce a chi promuove ogni giorno
            il proprio territorio online. Se fai parte di un progetto turistico
            regionale e vuoi essere presente sul portale, scrivici.
          </p>
        </div>
      </section>
    </>
  );
}
