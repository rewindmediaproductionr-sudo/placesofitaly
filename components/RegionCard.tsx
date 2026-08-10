import Image from "next/image";
import Link from "next/link";
import type { Region } from "@/lib/regions";
import RegionScene from "@/components/RegionScene";
import LikeBadge from "@/components/LikeBadge";
import type { LikeSummary } from "@/lib/ratings/types";

export default function RegionCard({
  region,
  likes,
}: {
  region: Region;
  likes?: LikeSummary;
}) {
  return (
    <Link
      href={`/${region.slug}`}
      className="group relative flex aspect-square flex-col justify-end overflow-hidden rounded-2xl p-5 text-white shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg"
    >
      {region.photo ? (
        <Image
          src={region.photo}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <RegionScene
          kind={region.visual.kind}
          colors={region.gradient}
          landmark={region.visual.landmark}
          water={region.visual.water}
          className="absolute inset-0 h-full w-full"
        />
      )}
      <span
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"
        aria-hidden
      />
      <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" aria-hidden />
      <LikeBadge summary={likes} />
      <span className="relative text-2xl font-semibold tracking-tight">{region.name}</span>
      <span className="relative mt-1 text-sm text-white/80 line-clamp-2">{region.tagline}</span>
    </Link>
  );
}
