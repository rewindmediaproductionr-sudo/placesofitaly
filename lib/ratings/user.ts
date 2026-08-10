import { createClient } from "@/lib/supabase/server";

export interface MyLike {
  name: string;
  urlPath: string | null;
  kind: string;
  createdAt: string;
}

export interface MyPartnerPage {
  isActive: boolean;
  likes: number;
}

// Letture personali: usano il client con i cookie, quindi vanno chiamate solo
// da pagine già dinamiche (come /profilo). Mai dal render di pagine statiche.
export async function getMyLikes(): Promise<MyLike[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("entity_likes")
      .select("created_at, entities ( name, url_path, kind )")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data ?? []).flatMap((row) => {
      const entity = row.entities as unknown as {
        name: string;
        url_path: string | null;
        kind: string;
      } | null;
      if (!entity) return [];
      return [
        {
          name: entity.name,
          urlPath: entity.url_path,
          kind: entity.kind,
          createdAt: row.created_at as string,
        },
      ];
    });
  } catch (error) {
    console.error("[getMyLikes] lettura dei like fallita:", error);
    return [];
  }
}

export async function getMyPartnerPage(
  userId: string
): Promise<MyPartnerPage | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("entities")
      .select("is_active, entity_stats ( subtree_likes )")
      .eq("owner_id", userId)
      .eq("kind", "pagina")
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    const stats = data.entity_stats as unknown as {
      subtree_likes: number | string | null;
    } | null;

    return {
      isActive: Boolean(data.is_active),
      likes: Number(stats?.subtree_likes ?? 0),
    };
  } catch (error) {
    console.error("[getMyPartnerPage] lettura della pagina fallita:", error);
    return null;
  }
}
