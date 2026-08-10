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

export function partnerPageRef(userId: string) {
  return entityRef("pagina", `partner/${userId}`);
}

export const REGION_REFS = regions.map((region) => regionRef(region.slug));
