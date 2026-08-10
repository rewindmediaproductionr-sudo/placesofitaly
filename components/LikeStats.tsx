import type { LikeSummary } from "@/lib/ratings/types";
import { formatLikeCount, formatIndice } from "@/lib/ratings/format";

export function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21.2l7.7-7.7 1.1-1.1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}

// Componente server e puramente presentazionale: finisce nell'HTML statico,
// quindi i numeri sono visibili ai crawler senza eseguire JavaScript.
//
// I due valori restano volutamente distinti ed etichettati: finché le regioni
// non hanno contenuti figli coincidono, e senza etichette sembrerebbero un
// errore di calcolo.
export default function LikeStats({
  summary,
  className = "",
}: {
  summary: LikeSummary | null;
  className?: string;
}) {
  if (!summary) {
    return (
      <p className={`text-sm text-white/70 ${className}`}>Nessun like</p>
    );
  }

  return (
    <dl className={`flex items-center gap-6 ${className}`}>
      <div title="Somma di tutti i like ricevuti da questo territorio e dai suoi contenuti.">
        <dt className="text-xs uppercase tracking-wide text-white/60">
          Like totali
        </dt>
        <dd className="mt-0.5 flex items-center gap-1.5 text-lg font-semibold">
          <HeartIcon filled />
          {formatLikeCount(summary.subtreeLikes)}
        </dd>
      </div>

      <div title="Like medi per contenuto: permette di confrontare territori di dimensioni diverse.">
        <dt className="text-xs uppercase tracking-wide text-white/60">
          Media per contenuto
        </dt>
        <dd className="mt-0.5 text-lg font-semibold">
          {formatIndice(summary.indice)}
        </dd>
      </div>
    </dl>
  );
}
