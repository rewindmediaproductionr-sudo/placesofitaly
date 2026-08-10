"use client";

import { useActionState } from "react";
import { requestPasswordReset } from "@/app/actions/auth";
import { inputClass, labelClass, errorClass } from "@/components/form-styles";

export default function RequestPasswordResetForm() {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    undefined
  );

  if (state?.message === "success") {
    return (
      <div className="rounded-2xl border border-black/10 bg-zinc-50 p-8 text-center dark:border-white/10 dark:bg-zinc-950">
        <h2 className="font-display text-xl font-semibold tracking-tight">
          Controlla la tua email
        </h2>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          Se esiste un account con questo indirizzo, ti abbiamo inviato un
          link per reimpostare la password.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputClass}
        />
        {state?.errors?.email && (
          <p className={errorClass}>{state.errors.email[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-brand-600 px-5 py-3 text-base font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
      >
        {pending ? "Invio in corso..." : "Invia link di recupero"}
      </button>
    </form>
  );
}
