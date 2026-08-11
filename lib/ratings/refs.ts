import { regions } from "@/lib/regions";
import type { EntityKind } from "@/lib/ratings/types";

// I ref sono la chiave stabile che lega lib/regions.ts alle righe del database.
// Formato: "tipo:percorso" — vedi supabase/migrations/001_rating_schema.sql.
// Uno slug da solo non basterebbe: "roma" è sia provincia sia comune.
export function entityRef(kind: EntityKind, path: string) {
  return `${kind}:${path}`;
}

export function regionRef(slug: string) {
  return entityRef("regione", slug);
}

export function provinciaRef(slug: string) {
  return entityRef("provincia", slug);
}

// I comuni sono ambigui per solo nome ("San Pietro" esiste in più province),
// ma unici per legge all'interno della stessa provincia: da qui il ref
// composto invece del semplice slug usato per regione e provincia.
export function comuneRef(provinciaSlug: string, comuneSlug: string) {
  return entityRef("comune", `${provinciaSlug}/${comuneSlug}`);
}

export function partnerPageRef(userId: string) {
  return entityRef("pagina", `partner/${userId}`);
}

export const REGION_REFS = regions.map((region) => regionRef(region.slug));
