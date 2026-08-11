import { HeartIcon } from "@/components/LikeStats";
import { formatLikeCount } from "@/lib/ratings/format";
import type { LikeSummary } from "@/lib/ratings/types";

// Sola lettura, mai un bottone: RegionCard è interamente un <Link>, e annidare
// un elemento interattivo dentro un anchor produce HTML non valido e rompe la
// navigazione da tastiera. Il like si mette dalla pagina della regione.
export default function LikeBadge({ summary }: { summary?: LikeSummary }) {
  if (!summary || summary.subtreeLikes === 0) return null;

  return (
    <span className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
      <span className="[&>svg]:h-3.5 [&>svg]:w-3.5">
        <HeartIcon filled />
      </span>
      {formatLikeCount(summary.subtreeLikes)}
    </span>
  );
}
