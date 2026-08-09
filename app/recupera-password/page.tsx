import type { Metadata } from "next";
import RequestPasswordResetForm from "@/components/RequestPasswordResetForm";

export const metadata: Metadata = {
  title: "Recupera password",
  description: "Reimposta la password del tuo account Places of Italy.",
};

export default function RecuperaPasswordPage() {
  return (
    <div className="mx-auto max-w-lg px-6 pb-16 pt-32">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-50">
        Recupera password
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Password dimenticata?
      </h1>
      <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
        Inserisci l&apos;email del tuo account: ti mandiamo un link per
        sceglierne una nuova.
      </p>

      <div className="mt-10">
        <RequestPasswordResetForm />
      </div>
    </div>
  );
}
