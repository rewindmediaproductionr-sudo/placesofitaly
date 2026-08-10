"use client";

import { useActionState } from "react";
import { setPartnerPageActive } from "@/app/actions/ratings";
import { formatLikeLabel } from "@/lib/ratings/format";

export default function PartnerPageToggle({
  active,
  likes,
}: {
  active: boolean;
  likes: number;
}) {
  const [state, formAction, pending] = useActionState(
    setPartnerPageActive,
    undefined
  );

  // Dopo il salvataggio l'azione non ricarica la pagina: rifletto subito la
  // scelta appena fatta, altrimenti l'interruttore resterebbe indietro.
  const isActive = state?.message === "success" ? !active : active;

  return (
    <form action={formAction}>
      <input type="hidden" name="active" value={isActive ? "0" : "1"} />
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {isActive
          ? `La tua pagina è pubblicata sul portale e ha ricevuto ${formatLikeLabel(likes).toLowerCase()}.`
          : "La tua pagina non è pubblicata: non compare sul portale e non può ricevere like."}
      </p>
      <button
        type="submit"
        disabled={pending}
        className="mt-4 w-full rounded-md border border-zinc-900 py-3 text-base font-medium transition-colors hover:bg-zinc-900 hover:text-white disabled:opacity-60 dark:border-zinc-50 dark:hover:bg-zinc-50 dark:hover:text-zinc-900"
      >
        {pending
          ? "Aggiornamento in corso..."
          : isActive
            ? "Nascondi la mia pagina"
            : "Pubblica la mia pagina"}
      </button>
      {state?.message && state.message !== "success" && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {state.message}
        </p>
      )}
    </form>
  );
}
