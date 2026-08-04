import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-black/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <span
            aria-hidden
            className="inline-block h-3 w-3 rounded-full"
            style={{ background: "linear-gradient(135deg, #09453e, #d98324)" }}
          />
          Places of Italy
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          <Link href="/#regioni" className="transition-colors hover:text-brand-600 dark:hover:text-white">
            Tutte le regioni
          </Link>
        </nav>
      </div>
    </header>
  );
}
