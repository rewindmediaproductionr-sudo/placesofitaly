import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-32 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
        404
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        Questa pagina non esiste
      </h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        Forse stavi cercando una regione italiana che non abbiamo ancora
        catalogato.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
      >
        Torna alla home
      </Link>
    </div>
  );
}
