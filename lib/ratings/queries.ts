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
