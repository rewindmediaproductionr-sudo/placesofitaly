import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chi siamo",
  description: "Places of Italy è il portale che racconta l'Italia una regione alla volta.",
};

export default function ChiSiamoPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-16 pt-32">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-50">
        Chi siamo
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        L&apos;Italia raccontata regione per regione
      </h1>
      <div className="mt-6 space-y-4 text-zinc-600 dark:text-zinc-400">
        <p>
          Places of Italy nasce per dare all&apos;Italia una mappa unica: 20
          regioni, ognuna con la propria identità, raccontate attraverso
          montagne, coste, borghi e città. Non una guida turistica come le
          altre, ma un punto di riferimento per chi vuole scoprire il
          territorio partendo da chi lo vive ogni giorno.
        </p>
        <p>
          Dietro il progetto c&apos;è un piccolo team che seleziona luoghi,
          storie e canali social legati a ciascuna regione, con l&apos;obiettivo
          di costruire un racconto autentico e senza filtri dell&apos;Italia,
          lontano dalle cartoline scontate.
        </p>
        <p>
          Se gestisci un canale social dedicato al tuo territorio e vuoi far
          parte del circuito Places of Italy, trovi tutte le informazioni
          nella sezione dedicata ai partner.
        </p>
      </div>
    </div>
  );
}
