import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Accedi",
  description: "Accedi al tuo account Places of Italy.",
};

export default async function AccediPage({
  searchParams,
}: {
  searchParams: Promise<{ aggiornata?: string }>;
}) {
  const { aggiornata } = await searchParams;

  return (
    <div className="mx-auto max-w-lg px-6 pb-16 pt-32">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-50">
        Accedi
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Bentornato su Places of Italy
      </h1>
      <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
        Non hai ancora un account?{" "}
        <Link
          href="/registrati"
          className="font-medium text-brand-600 hover:underline dark:text-brand-50"
        >
          Registrati
        </Link>
        .
      </p>

      {aggiornata === "1" && (
        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
          Password aggiornata. Accedi con la nuova password.
        </p>
      )}

      <div className="mt-10">
        <LoginForm />
      </div>
    </div>
  );
}
