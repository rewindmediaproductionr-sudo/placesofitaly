import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vision e Mission",
  description: "La visione e la missione di Places of Italy.",
};

export default function VisionEMissionPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-16 pt-32">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-50">
        Vision e Mission
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Perché esiste Places of Italy
      </h1>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold tracking-tight">Vision</h2>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Diventare il punto di riferimento per chi vuole scoprire l&apos;Italia
          regione per regione, unendo in un unico racconto il territorio, chi
          lo vive e chi ogni giorno lo promuove sui social. Un&apos;Italia
          raccontata dal basso, autentica, lontana dalle solite cartoline.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold tracking-tight">Mission</h2>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Dare visibilità a chi racconta il proprio territorio sui social,
          connettere queste voci con chi cerca ispirazione per viaggiare in
          Italia, e promuovere un turismo più consapevole e rispettoso dei
          luoghi e delle persone che li abitano.
        </p>
      </section>
    </div>
  );
}
