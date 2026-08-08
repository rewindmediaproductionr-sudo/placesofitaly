import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrazione confermata",
  description: "Il tuo account Places of Italy è attivo.",
};

export default function RegistratiGraziePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-16 pt-32">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-50">
        Registrati
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Account confermato
      </h1>
      <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
        Grazie per esserti registrato a Places of Italy. Il tuo indirizzo
        email è stato verificato e l&apos;account è ora attivo.
      </p>
    </div>
  );
}
