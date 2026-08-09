"use client";

import { useActionState, useState } from "react";
import { signup } from "@/app/actions/auth";
import { regions, regionAreaLabels } from "@/lib/regions";
import { PASSWORD_REQUIREMENTS } from "@/lib/validation/password";

type UserType = "viaggiatore" | "partner";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 pr-12 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-brand-500 focus:outline-none dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500";

const labelClass = "text-sm font-medium text-zinc-700 dark:text-zinc-300";
const errorClass = "mt-1.5 text-sm text-red-600 dark:text-red-400";

function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      {open ? (
        <>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="M3 3l18 18" />
          <path d="M10.6 5.2A9.9 9.9 0 0 1 12 5c6.5 0 10 7 10 7a15.5 15.5 0 0 1-4.2 4.9M6.3 6.3C3.6 8.1 2 12 2 12s3.5 7 10 7c1.5 0 2.9-.4 4.1-1" />
          <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
        </>
      )}
    </svg>
  );
}

function PasswordToggle({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? "Nascondi password" : "Mostra password"}
      className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white"
    >
      <EyeIcon open={visible} />
    </button>
  );
}

export default function RegistrationForm() {
  const [userType, setUserType] = useState<UserType>("viaggiatore");
  const [state, formAction, pending] = useActionState(signup, undefined);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (state?.message === "success") {
    return (
      <div className="rounded-2xl border border-black/10 bg-zinc-50 p-8 text-center dark:border-white/10 dark:bg-zinc-950">
        <h2 className="font-display text-xl font-semibold tracking-tight">
          Controlla la tua email
        </h2>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          Ti abbiamo inviato un link di conferma. Aprilo per attivare il tuo
          account su Places of Italy.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="type" value={userType} />

      <div
        role="radiogroup"
        aria-label="Tipo di account"
        className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 p-1 dark:border-white/10 dark:bg-zinc-900"
      >
        {(["viaggiatore", "partner"] as const).map((type) => (
          <button
            key={type}
            type="button"
            role="radio"
            aria-checked={userType === type}
            onClick={() => setUserType(type)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              userType === type
                ? "bg-brand-600 text-white"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            {type === "viaggiatore" ? "Viaggiatore" : "Partner"}
          </button>
        ))}
      </div>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {userType === "viaggiatore"
          ? "Crea un account per seguire le regioni che ti interessano."
          : "Registrati come partner se gestisci un canale social legato al turismo regionale."}
      </p>

      <div>
        <label htmlFor="fullName" className={labelClass}>
          Nome e cognome
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          required
          className={inputClass}
        />
        {state?.errors?.fullName && (
          <p className={errorClass}>{state.errors.fullName[0]}</p>
        )}
      </div>

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

      <div>
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClass}
          />
          <PasswordToggle
            visible={showPassword}
            onToggle={() => setShowPassword((value) => !value)}
          />
        </div>
        {state?.errors?.password && (
          <p className={errorClass}>{state.errors.password[0]}</p>
        )}
        <ul className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
          {PASSWORD_REQUIREMENTS.map((requirement) => {
            const met = requirement.test(password);
            return (
              <li
                key={requirement.id}
                className={`flex items-center gap-1.5 text-xs ${
                  met
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                <span aria-hidden>{met ? "✓" : "○"}</span>
                {requirement.label}
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <label htmlFor="confirmPassword" className={labelClass}>
          Conferma password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            className={inputClass}
          />
          <PasswordToggle
            visible={showConfirmPassword}
            onToggle={() => setShowConfirmPassword((value) => !value)}
          />
        </div>
        {state?.errors?.confirmPassword && (
          <p className={errorClass}>{state.errors.confirmPassword[0]}</p>
        )}
      </div>

      {userType === "partner" && (
        <>
          <div>
            <label htmlFor="regionSlug" className={labelClass}>
              Regione di riferimento
            </label>
            <select
              id="regionSlug"
              name="regionSlug"
              required
              defaultValue=""
              className={inputClass}
            >
              <option value="" disabled>
                Seleziona una regione
              </option>
              {(["nord", "centro", "sud"] as const).map((area) => (
                <optgroup key={area} label={regionAreaLabels[area]}>
                  {regions
                    .filter((region) => region.area === area)
                    .map((region) => (
                      <option key={region.slug} value={region.slug}>
                        {region.name}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
            {state?.errors?.regionSlug && (
              <p className={errorClass}>{state.errors.regionSlug[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="socialLink" className={labelClass}>
              Link al tuo canale social
            </label>
            <input
              id="socialLink"
              name="socialLink"
              type="url"
              placeholder="https://instagram.com/..."
              required
              className={inputClass}
            />
            {state?.errors?.socialLink && (
              <p className={errorClass}>{state.errors.socialLink[0]}</p>
            )}
          </div>
        </>
      )}

      {state?.message && state.message !== "success" && (
        <p className={errorClass}>{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-brand-600 px-5 py-3 text-base font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
      >
        {pending ? "Registrazione in corso..." : "Crea account"}
      </button>
    </form>
  );
}
