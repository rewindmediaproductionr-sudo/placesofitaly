"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/app/actions/auth";
import PasswordField from "@/components/PasswordField";
import { inputClass, labelClass, errorClass } from "@/components/form-styles";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, undefined);

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

      <PasswordField
        id="password"
        name="password"
        label="Password"
        autoComplete="current-password"
        error={state?.errors?.password?.[0]}
      />

      <div className="text-right text-sm">
        <Link
          href="/recupera-password"
          className="font-medium text-brand-600 hover:underline dark:text-brand-50"
        >
          Password dimenticata?
        </Link>
      </div>

      {state?.message && (
        <p className={errorClass}>{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-brand-600 px-5 py-3 text-base font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
      >
        {pending ? "Accesso in corso..." : "Accedi"}
      </button>
    </form>
  );
}
