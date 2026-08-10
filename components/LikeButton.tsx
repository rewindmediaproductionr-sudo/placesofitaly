"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { toggleLike } from "@/app/actions/ratings";
import { createClient } from "@/lib/supabase/client";
import { HeartIcon } from "@/components/LikeStats";
import { formatLikeLabel } from "@/lib/ratings/format";
import type { LikeSummary } from "@/lib/ratings/types";

export default function LikeButton({
  entityRef,
  initialSummary,
}: {
  entityRef: string;
  initialSummary: LikeSummary | null;
}) {
  const [state, formAction, pending] = useActionState(toggleLike, undefined);
  // null = stato ancora sconosciuto. Volutamente non "false": mostrare
  // "non hai messo like" prima di sapere se è vero sarebbe una bugia, e allo
  // sbarco l'HTML statico è uguale per tutti.
  const [liked, setLiked] = useState<boolean | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  const count = state?.summary?.subtreeLikes ?? initialSummary?.subtreeLikes ?? 0;
  const effectiveLiked = state?.liked ?? liked;

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function loadMyLike() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (active) {
          setAuthenticated(false);
          setLiked(false);
        }
        return;
      }

      // La vista my_entity_likes evita di propagare gli id numerici al
      // browser; la RLS la restringe da sola ai like del chiamante.
      const { data } = await supabase
        .from("my_entity_likes")
        .select("ref")
        .eq("ref", entityRef)
        .maybeSingle();

      if (active) {
        setAuthenticated(true);
        setLiked(Boolean(data));
      }
    }

    loadMyLike();
    return () => {
      active = false;
    };
  }, [entityRef]);

  if (authenticated === false) {
    return (
      <div className="flex flex-wrap items-center gap-4">
        <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
          <HeartIcon />
          {formatLikeLabel(count)}
        </span>
        <Link
          href="/accedi"
          className="rounded-md bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          Accedi per mettere like
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-4">
      <input type="hidden" name="ref" value={entityRef} />
      <input type="hidden" name="liked" value={effectiveLiked ? "0" : "1"} />

      <button
        type="submit"
        disabled={pending || authenticated === null}
        aria-pressed={Boolean(effectiveLiked)}
        className={`flex items-center gap-2 rounded-md border px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-60 ${
          effectiveLiked
            ? "border-brand-600 bg-brand-600 text-white hover:bg-brand-700"
            : "border-zinc-300 text-zinc-800 hover:border-brand-500 hover:text-brand-600 dark:border-white/20 dark:text-zinc-100 dark:hover:text-brand-50"
        }`}
      >
        <HeartIcon filled={Boolean(effectiveLiked)} />
        {effectiveLiked ? "Ti piace" : "Mi piace"}
      </button>

      <span className="text-sm text-zinc-600 dark:text-zinc-400">
        {formatLikeLabel(count)}
      </span>

      {state?.message && state.message !== "success" && (
        <p className="w-full text-sm text-red-600 dark:text-red-400">
          {state.message}
        </p>
      )}
    </form>
  );
}
