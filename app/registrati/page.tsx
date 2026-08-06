import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrati",
  description: "Entra a far parte del circuito Places of Italy.",
};

export default function RegistratiPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-16 pt-32">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-50">
        Registrati
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        La registrazione arriva a breve
      </h1>
      <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
        Stiamo preparando il modo per entrare a far parte del circuito
        Places of Italy direttamente dal sito. Torna a trovarci a breve.
      </p>
    </div>
  );
}
