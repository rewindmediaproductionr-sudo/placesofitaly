import Link from "next/link";
import type { Region } from "@/lib/regions";

export default function RegionCard({ region }: { region: Region }) {
  const [from, to] = region.gradient;

  return (
    <Link
      href={`/${region.slug}`}
      className="group relative flex h-56 flex-col justify-end overflow-hidden rounded-2xl p-5 text-white shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg"
      style={{ backgroundImage: `linear-gradient(150deg, ${from}, ${to})` }}
    >
      <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" aria-hidden />
      <span className="relative text-xs font-medium uppercase tracking-wider text-white/70">
        {region.capital}
      </span>
      <span className="relative text-2xl font-semibold tracking-tight">{region.name}</span>
      <span className="relative mt-1 text-sm text-white/80 line-clamp-2">{region.tagline}</span>
    </Link>
  );
}
