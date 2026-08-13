import type { Metadata } from "next";
import Image from "next/image";
import { regions } from "@/lib/regions";

export const metadata: Metadata = {
  title: "Area partner",
  description: "Kit e risorse per chi fa parte del circuito Places of Italy.",
  robots: { index: false, follow: false },
};

const HASHTAGS = [
  "#PlacesOfItaly",
  "#ScopriLItalia",
  "#ItaliaDaVivere",
  "#VisitItaly",
];

const CAPTION_TEMPLATES = [
  "📍 {luogo}, {regione} — uno di quei posti che vanno visti almeno una volta. Scopri di più su Places of Italy. #PlacesOfItaly #{regioneHashtag}",
  "L'Italia raccontata da chi la vive ogni giorno 🇮🇹 Oggi vi portiamo in {regione}. #PlacesOfItaly #{regioneHashtag}",
  "Non solo cartolina: {luogo} è {aggettivo}. Seguici per scoprire tutte le regioni d'Italia. #PlacesOfItaly",
  "🎉 {evento} a {luogo}, {regione}: un'occasione per vivere la regione da vicino. Date, orari e info su Places of Italy. #PlacesOfItaly #{regioneHashtag}",
];

const GUIDELINES = [
  "Contenuti originali o di cui possiedi i diritti di utilizzo e ripubblicazione.",
  "Nessuna informazione turistica inventata: verifica orari, prezzi e accessibilità prima di pubblicare.",
  "Tono di voce autentico e diretto, senza superlativi vuoti (\"il posto più bello del mondo\").",
  "Ogni contenuto condiviso deve riportare la fonte/il canale social originale.",
  "Rispetta le persone e i luoghi ritratti: no overtourism in aree fragili senza indicazioni di tutela.",
];

function uniquePalette() {
  const seen = new Set<string>();
  const palette: [string, string][] = [];
  for (const region of regions) {
    const key = region.gradient.join("-");
    if (!seen.has(key)) {
      seen.add(key);
      palette.push(region.gradient);
    }
  }
  return palette;
}

export default function ToolsPage() {
  const palette = uniquePalette();

  return (
    <div className="mx-auto max-w-4xl px-6 pb-16 pt-32">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-50">
        Area partner · pagina non indicizzata
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Kit per il circuito Places of Italy
      </h1>
      <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
        Questa pagina è pensata per chi gestisce canali social legati al
        turismo regionale ed entra a far parte del circuito Places of Italy.
        Qui trovi il kit di base e il modo per condividere i tuoi contenuti
        con noi.
      </p>

      <section className="mt-14">
        <h2 className="font-display text-xl font-semibold tracking-tight">Strumenti</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Applicazioni collegate al circuito Places of Italy.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <a
            href="https://polymarket-italia.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-2xl border border-black/10 p-6 transition-colors hover:border-brand-500 dark:border-white/10 dark:hover:border-brand-500"
          >
            <span className="font-display text-lg font-semibold tracking-tight">
              Generatore post regionali
            </span>
            <span className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Crea in pochi click post generici su eventi, luoghi e curiosità
              della tua regione, pronti per essere pubblicati.
            </span>
            <span className="mt-4 inline-flex items-center text-sm font-medium text-brand-600 group-hover:text-brand-500 dark:text-brand-50">
              Genera post regionali ↗
            </span>
          </a>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-xl font-semibold tracking-tight">Kit social media</h2>

        <div className="mt-5">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Logo</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-4 rounded-xl border border-black/10 bg-white p-5">
              <Image
                src="/brand/poit-light.svg"
                alt="Logo Places of Italy (versione scura, per sfondi chiari)"
                width={580}
                height={251}
                className="h-10 w-auto"
              />
              <a
                href="/brand/poit-light.svg"
                download
                className="ml-auto inline-flex items-center rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:border-brand-500 hover:text-brand-600"
              >
                Scarica SVG
              </a>
            </div>
            <div className="flex items-center gap-4 rounded-xl border border-white/15 bg-zinc-900 p-5">
              <Image
                src="/brand/poit-dark.svg"
                alt="Logo Places of Italy (versione chiara, per sfondi scuri)"
                width={580}
                height={251}
                className="h-10 w-auto"
              />
              <a
                href="/brand/poit-dark.svg"
                download
                className="ml-auto inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-brand-500 hover:text-brand-500"
              >
                Scarica SVG
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Palette colori</p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {palette.map(([from, to]) => (
              <div key={from} className="overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
                <div className="h-16" style={{ backgroundImage: `linear-gradient(150deg, ${from}, ${to})` }} />
                <div className="flex justify-between px-3 py-2 text-xs font-mono text-zinc-500">
                  <span>{from}</span>
                  <span>{to}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Hashtag consigliati</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {HASHTAGS.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-mono text-brand-600 dark:bg-zinc-900 dark:text-brand-50"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Caption pronte</p>
          <ul className="mt-3 space-y-2">
            {CAPTION_TEMPLATES.map((template) => (
              <li
                key={template}
                className="rounded-2xl bg-zinc-100 px-4 py-3 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
              >
                {template}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-xl font-semibold tracking-tight">Canali social per regione</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Stato di attivazione dei canali ufficiali collegati a ogni regione
          sul portale.
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">Regione</th>
                <th className="px-4 py-3 font-medium">Stato canali</th>
              </tr>
            </thead>
            <tbody>
              {regions.map((region) => {
                const count = Object.keys(region.social ?? {}).length;
                return (
                  <tr key={region.slug} className="border-t border-black/5 dark:border-white/10">
                    <td className="px-4 py-3">{region.name}</td>
                    <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                      {count > 0 ? `${count} canale/i attivo/i` : "Da attivare"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-xl font-semibold tracking-tight">Linee guida per collaboratori</h2>
        <ul className="mt-4 space-y-2">
          {GUIDELINES.map((rule) => (
            <li key={rule} className="flex gap-3 text-sm text-zinc-700 dark:text-zinc-300">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
              {rule}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 rounded-2xl border border-black/10 bg-zinc-50 p-8 dark:border-white/10 dark:bg-zinc-950">
        <h2 className="font-display text-xl font-semibold tracking-tight">Condividi i tuoi contenuti</h2>
        <p className="mt-3 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
          Gestisci il canale social di una regione o hai contenuti da proporre
          per il portale? Scrivici indicando la regione, i link ai tuoi canali
          e alcuni esempi di contenuto: valuteremo insieme come aggiungerti al
          circuito.
        </p>
        <a
          href="mailto:collabora@placesofitaly.it?subject=Ingresso%20nel%20circuito%20Places%20of%20Italy"
          className="mt-5 inline-flex items-center rounded-full bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-500"
        >
          Scrivici via email
        </a>
      </section>
    </div>
  );
}
