"use client";

import { useActionState, useState } from "react";
import { updatePassword } from "@/app/actions/auth";
import PasswordField from "@/components/PasswordField";
import { errorClass } from "@/components/form-styles";

export default function UpdatePasswordForm() {
  const [state, formAction, pending] = useActionState(updatePassword, undefined);
  const [password, setPassword] = useState("");

  return (
    <form action={formAction} className="space-y-6">
      <PasswordField
        id="password"
        name="password"
        label="Nuova password"
        autoComplete="new-password"
        value={password}
        onChange={setPassword}
        error={state?.errors?.password?.[0]}
        showChecklist
      />

      <PasswordField
        id="confirmPassword"
        name="confirmPassword"
        label="Conferma nuova password"
        autoComplete="new-password"
        error={state?.errors?.confirmPassword?.[0]}
      />

      {state?.message && <p className={errorClass}>{state.message}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-brand-600 px-5 py-3 text-base font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
      >
        {pending ? "Aggiornamento in corso..." : "Salva nuova password"}
      </button>
    </form>
  );
}
