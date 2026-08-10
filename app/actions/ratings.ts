"use server";

import * as z from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  ToggleLikeSchema,
  type RatingFormState,
} from "@/lib/validation/rating";
import type { LikeSummary } from "@/lib/ratings/types";

const SUMMARY_SELECT =
  "ref, direct_likes, subtree_likes, subtree_entities, indice_gradimento";

interface RankingRow {
  ref: string;
  direct_likes: number | string | null;
  subtree_likes: number | string | null;
  subtree_entities: number | string | null;
  indice_gradimento: number | string | null;
}

function toSummary(row: RankingRow): LikeSummary {
  return {
    ref: row.ref,
    directLikes: Number(row.direct_likes ?? 0),
    subtreeLikes: Number(row.subtree_likes ?? 0),
    subtreeEntities: Number(row.subtree_entities ?? 1),
    indice: Number(row.indice_gradimento ?? 0),
  };
}

export async function toggleLike(
  _state: RatingFormState,
  formData: FormData
): Promise<RatingFormState> {
  const validatedFields = ToggleLikeSchema.safeParse({
    ref: formData.get("ref"),
    liked: formData.get("liked"),
  });

  if (!validatedFields.success) {
    return { errors: z.flattenError(validatedFields.error).fieldErrors };
  }

  const { ref, liked } = validatedFields.data;
  const wantsLike = liked === "1";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Il controllo qui è la vera difesa: una server action è un endpoint POST
  // pubblico, e nascondere il pulsante in UI non basta.
  if (!user) {
    return { message: "Accedi per mettere like." };
  }

  const { data: entity, error: entityError } = await supabase
    .from("entities")
    .select("id")
    .eq("ref", ref)
    .maybeSingle();

  if (entityError) {
    console.error("[toggleLike] lettura dell'entità fallita:", entityError);
    return { message: "Non siamo riusciti a registrare il like. Riprova." };
  }
  if (!entity) {
    return { message: "Questo contenuto non è più disponibile." };
  }

  const entityId = (entity as { id: number }).id;

  if (wantsLike) {
    // La primary key composta rende innocuo il doppio click: il secondo
    // inserimento entra in conflitto e viene ignorato.
    const { error } = await supabase
      .from("entity_likes")
      .upsert(
        { entity_id: entityId, user_id: user.id },
        { onConflict: "entity_id,user_id", ignoreDuplicates: true }
      );
    if (error) {
      console.error("[toggleLike] inserimento del like fallito:", error);
      return { message: "Non siamo riusciti a registrare il like. Riprova." };
    }
  } else {
    const { error } = await supabase
      .from("entity_likes")
      .delete()
      .eq("entity_id", entityId)
      .eq("user_id", user.id);
    if (error) {
      console.error("[toggleLike] rimozione del like fallita:", error);
      return { message: "Non siamo riusciti a togliere il like. Riprova." };
    }
  }

  // Rilettura degli aggregati: i trigger hanno già propagato la cascata agli
  // antenati quando la scrittura è tornata.
  const { data: updated } = await supabase
    .from("entity_rankings")
    .select(SUMMARY_SELECT)
    .eq("ref", ref)
    .maybeSingle();

  // Volutamente nessun revalidatePath: rigenererebbe home e pagina regione a
  // ogni click, con effetto valanga sotto carico. Le copie statiche si
  // riallineano da sole entro la finestra di revalidate (15 minuti).
  return {
    message: "success",
    liked: wantsLike,
    summary: updated ? toSummary(updated as RankingRow) : undefined,
  };
}

export async function setPartnerPageActive(
  _state: RatingFormState,
  formData: FormData
): Promise<RatingFormState> {
  const active = formData.get("active") === "1";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { message: "Accedi per gestire la tua pagina." };
  }

  // La policy RLS limita già l'aggiornamento alla propria pagina: questo
  // filtro serve a non tentare scritture che verrebbero comunque respinte.
  const { error } = await supabase
    .from("entities")
    .update({ is_active: active })
    .eq("owner_id", user.id)
    .eq("kind", "pagina");

  if (error) {
    console.error("[setPartnerPageActive] aggiornamento fallito:", error);
    return { message: "Non siamo riusciti ad aggiornare la tua pagina. Riprova." };
  }

  return { message: "success" };
}
