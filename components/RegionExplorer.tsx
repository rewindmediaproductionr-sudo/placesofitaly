"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import RegionCard from "@/components/RegionCard";
import { regionAreaLabels, type Region, type RegionArea } from "@/lib/regions";
import { regionRef } from "@/lib/ratings/refs";
import type { LikeSummary } from "@/lib/ratings/types";

const ALL_AREAS: RegionArea[] = ["nord", "centro", "sud"];

const areaShortLabels: Record<RegionArea, string> = {
  nord: "Nord",
  centro: "Centro",
  sud: "Sud",
};

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

export default function RegionExplorer({
  regions,
  likes = {},
}: {
  regions: Region[];
  likes?: Record<string, LikeSummary>;
}) {
  const [query, setQuery] = useState("");
  const [selectedAreas, setSelectedAreas] = useState<Set<RegionArea>>(
    () => new Set(ALL_AREAS)
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function toggleArea(area: RegionArea) {
    setSelectedAreas((prev) => {
      const next = new Set(prev);
      if (next.has(area)) {
        next.delete(area);
      } else {
        next.add(area);
      }
      return next;
    });
  }

  const dropdownLabel =
    selectedAreas.size === 0 || selectedAreas.size === ALL_AREAS.length
      ? "Tutte le zone"
      : ALL_AREAS.filter((area) => selectedAreas.has(area))
          .map((area) => areaShortLabels[area])
          .join(", ");

  const filtered = useMemo(() => {
    const normalizedQuery = normalize(query.trim());
    const noAreaFilter = selectedAreas.size === 0 || selectedAreas.size === ALL_AREAS.length;
    return regions.filter((region) => {
      const matchesArea = noAreaFilter || selectedAreas.has(region.area);
      return matchesArea && matchesQuery(region, normalizedQuery);
    });
  }, [regions, query, selectedAreas]);

  return (
    <div>
      <form
        onSubmit={(event) => event.preventDefault()}
        ref={containerRef}
        className="relative mx-auto flex w-full max-w-2xl items-center rounded-full border border-zinc-200 bg-zinc-50 py-2 pl-6 pr-2 shadow-sm dark:border-white/10 dark:bg-zinc-900"
      >
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cerca una regione..."
          className="min-w-0 flex-1 bg-transparent py-2 text-base text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-white dark:placeholder:text-zinc-500"
        />

        <button
          type="button"
          onClick={() => setDropdownOpen((open) => !open)}
          aria-expanded={dropdownOpen}
          className="flex shrink-0 items-center gap-1.5 border-l border-zinc-200 pl-4 pr-3 text-sm font-semibold text-zinc-800 dark:border-white/10 dark:text-zinc-100"
        >
          {dropdownLabel}
          <svg
            className={`h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
          </svg>
        </button>

        <button
          type="submit"
          aria-label="Cerca"
          className="ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition-colors hover:bg-brand-700"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="m21 21-4.3-4.3" />
          </svg>
        </button>

        {dropdownOpen ? (
          <div className="absolute right-0 top-full z-10 mt-2 w-56 rounded-2xl border border-zinc-200 bg-white p-2 shadow-lg dark:border-white/10 dark:bg-zinc-900">
            {ALL_AREAS.map((area) => {
              const checked = selectedAreas.has(area);
              return (
                <button
                  key={area}
                  type="button"
                  onClick={() => toggleArea(area)}
                  aria-pressed={checked}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-base font-medium text-zinc-800 transition-colors hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-white/5"
                >
                  {regionAreaLabels[area]}
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-colors ${
                      checked
                        ? "border-brand-600 bg-brand-600"
                        : "border-zinc-300 dark:border-white/20"
                    }`}
                    aria-hidden
                  >
                    {checked ? (
                      <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                      </svg>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}
      </form>

      {filtered.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((region) => (
            <RegionCard
              key={region.slug}
              region={region}
              likes={likes[regionRef(region.slug)]}
            />
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
