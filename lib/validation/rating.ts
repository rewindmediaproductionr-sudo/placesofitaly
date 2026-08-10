import * as z from "zod";
import type { LikeSummary } from "@/lib/ratings/types";

export const ToggleLikeSchema = z.object({
  ref: z
    .string()
    .trim()
    .min(1, { error: "Contenuto non valido." })
    .max(200, { error: "Contenuto non valido." }),
  /** Stato desiderato: "1" per mettere like, "0" per toglierlo. */
  liked: z.enum(["0", "1"], { error: "Azione non valida." }),
});

export type RatingFormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
      liked?: boolean;
      summary?: LikeSummary;
    }
  | undefined;
