import { createPublicClient } from "@/lib/supabase/public";
import type { LikeSummary } from "@/lib/ratings/types";

interface RankingRow {
  ref: string;
  direct_likes: number | string | null;
  subtree_likes: number | string | null;
  subtree_entities: number | string | null;
  indice_gradimento: number | string | null;
}

const SELECT = "ref, direct_likes, subtree_likes, subtree_entities, indice_gradimento";

function toSummary(row: RankingRow): LikeSummary {
  return {
    ref: row.ref,
    directLikes: Number(row.direct_likes ?? 0),
    subtreeLikes: Number(row.subtree_likes ?? 0),
    subtreeEntities: Number(row.subtree_entities ?? 1),
    indice: Number(row.indice_gradimento ?? 0),
  };
}

// Avvisa in sviluppo se lib/regions.ts e il database sono disallineati: è
// l'unico punto in cui i due mondi possono divergere silenziosamente.
function warnMissing(requested: string[], found: Set<string>) {
  if (process.env.NODE_ENV === "production") return;
  for (const ref of requested) {
    if (!found.has(ref)) {
      console.warn(
        `[ratings] entità mancante nel database: ${ref} — aggiungila a supabase/migrations/002_seed_entities.sql`
      );
    }
  }
}

// Tutte le letture sono fail-soft: durante "next build" partono decine di query
// e un errore (env var mancanti in CI, Supabase irraggiungibile) NON deve far
// fallire la build. In quel caso la UI mostra semplicemente "Nessun like".
export async function getLikesByRefs(
  refs: string[]
): Promise<Record<string, LikeSummary>> {
  if (refs.length === 0) return {};

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("entity_rankings")
      .select(SELECT)
      .in("ref", refs);

    if (error) throw error;

    const result: Record<string, LikeSummary> = {};
    for (const row of (data ?? []) as RankingRow[]) {
      result[row.ref] = toSummary(row);
    }
    warnMissing(refs, new Set(Object.keys(result)));
    return result;
  } catch (error) {
    console.error("[getLikesByRefs] lettura dei like fallita:", error);
    return {};
  }
}

export async function getLike(ref: string): Promise<LikeSummary | null> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("entity_rankings")
      .select(SELECT)
      .eq("ref", ref)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      warnMissing([ref], new Set());
      return null;
    }
    return toSummary(data as RankingRow);
  } catch (error) {
    console.error("[getLike] lettura dei like fallita:", error);
    return null;
  }
}

export interface EntityRow {
  id: number;
  ref: string;
  kind: string;
  slug: string;
  name: string;
  urlPath: string | null;
  parentId: number | null;
}

interface EntityDbRow {
  id: number;
  ref: string;
  kind: string;
  slug: string;
  name: string;
  url_path: string | null;
  parent_id: number | null;
}

const ENTITY_SELECT = "id, ref, kind, slug, name, url_path, parent_id";

function toEntity(row: EntityDbRow): EntityRow {
  return {
    id: row.id,
    ref: row.ref,
    kind: row.kind,
    slug: row.slug,
    name: row.name,
    urlPath: row.url_path,
    parentId: row.parent_id,
  };
}

// Legge una singola entità (provincia o comune, tipicamente) dal suo ref.
// Come le altre letture qui dentro, è fail-soft: un errore diventa "non
// trovata" invece di far fallire la pagina che la richiede.
export async function getEntity(ref: string): Promise<EntityRow | null> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("entities")
      .select(ENTITY_SELECT)
      .eq("ref", ref)
      .eq("is_active", true)
      .maybeSingle();

    if (error) throw error;
    return data ? toEntity(data as EntityDbRow) : null;
  } catch (error) {
    console.error("[getEntity] lettura dell'entità fallita:", error);
    return null;
  }
}

export async function getEntityById(id: number): Promise<EntityRow | null> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("entities")
      .select(ENTITY_SELECT)
      .eq("id", id)
      .eq("is_active", true)
      .maybeSingle();

    if (error) throw error;
    return data ? toEntity(data as EntityDbRow) : null;
  } catch (error) {
    console.error("[getEntityById] lettura dell'entità fallita:", error);
    return null;
  }
}

// Figli diretti di un'entità per un dato livello, es. i comuni di una
// provincia. Non risale la gerarchia: parent_id punta sempre al livello
// immediatamente superiore per provincia e comune.
export async function getChildren(parentId: number, kind: string): Promise<EntityRow[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("entities")
      .select(ENTITY_SELECT)
      .eq("parent_id", parentId)
      .eq("kind", kind)
      .eq("is_active", true)
      .order("name");

    if (error) throw error;
    return ((data ?? []) as EntityDbRow[]).map(toEntity);
  } catch (error) {
    console.error("[getChildren] lettura dei figli fallita:", error);
    return [];
  }
}
