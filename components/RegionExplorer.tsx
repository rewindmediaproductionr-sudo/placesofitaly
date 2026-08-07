"use client";

import { useMemo, useState } from "react";
import RegionCard from "@/components/RegionCard";
import { regionAreaLabels, type Region, type RegionArea } from "@/lib/regions";

const areaFilters: Array<{ value: RegionArea | "tutte"; label: string }> = [
  { value: "tutte", label: "Tutte" },
  { value: "nord", label: regionAreaLabels.nord },
  { value: "centro", label: regionAreaLabels.centro },
  { value: "sud", label: regionAreaLabels.sud },
];

const DIACRITICS = new RegExp("[\\u0300-\\u036f]", "g");

function normalize(value: string) {
  return value.toLowerCase().normalize("NFD").replace(DIACRITICS, "");
}

function matchesQuery(region: Region, query: string) {
  if (!query) return true;
  const haystack = normalize(
    [region.name, region.capital, region.tagline].join(" ")
  );
  return haystack.includes(query);
}

export default function RegionExplorer({ regions }: { regions: Region[] }) {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState<RegionArea | "tutte">("tutte");

  const filtered = useMemo(() => {
    const normalizedQuery = normalize(query.trim());
    return regions.filter((region) => {
      const matchesArea = area === "tutte" || region.area === area;
      return matchesArea && matchesQuery(region, normalizedQuery);
    });
  }, [regions, query, area]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative w-full sm:max-w-xs">
          <span className="sr-only">Cerca una regione</span>
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cerca una regione..."
            className="w-full rounded-md border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/15 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {areaFilters.map((filter) => {
            const active = area === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setArea(filter.value)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-zinc-300 text-zinc-600 hover:border-brand-500 hover:text-brand-600 dark:border-white/15 dark:text-zinc-400 dark:hover:border-brand-500 dark:hover:text-brand-500"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((region) => (
            <RegionCard key={region.slug} region={region} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Nessun risultato per questa ricerca. Prova con un altro nome o filtro.
        </p>
      )}
    </div>
  );
}
