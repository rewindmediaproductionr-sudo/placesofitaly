import Link from "next/link";
import type { Region } from "@/lib/regions";
import RegionScene from "@/components/RegionScene";

export default function RegionCard({ region }: { region: Region }) {
  return (
    <Link
      href={`/${region.slug}`}
      className="group relative flex h-56 flex-col justify-end overflow-hidden rounded-2xl p-5 text-white shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg"
    >
      <RegionScene
        kind={region.visual.kind}
        colors={region.gradient}
        landmark={region.visual.landmark}
        water={region.visual.water}
        className="absolute inset-0 h-full w-full"
      />
      <span
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
        aria-hidden
      />
      <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" aria-hidden />
      <span className="relative text-xs font-medium uppercase tracking-wider text-white/70">
        {region.capital}
      </span>
      <span className="relative text-2xl font-semibold tracking-tight">{region.name}</span>
      <span className="relative mt-1 text-sm text-white/80 line-clamp-2">{region.tagline}</span>
    </Link>
  );
}
