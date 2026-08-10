"use client";

import { useState } from "react";
import { PASSWORD_REQUIREMENTS } from "@/lib/validation/password";
import { inputClass as baseInputClass, labelClass, errorClass } from "@/components/form-styles";

const inputClass = `${baseInputClass} pr-12`;

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

interface PasswordFieldProps {
  id: string;
  name: string;
  label: string;
  autoComplete: string;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  showChecklist?: boolean;
}

export default function PasswordField({
  id,
  name,
  label,
  autoComplete,
  error,
  value,
  onChange,
  showChecklist = false,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          {...(value !== undefined
            ? { value, onChange: (event: React.ChangeEvent<HTMLInputElement>) => onChange?.(event.target.value) }
            : {})}
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? "Nascondi password" : "Mostra password"}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white"
        >
          <EyeIcon open={visible} />
        </button>
      </div>
      {error && <p className={errorClass}>{error}</p>}
      {showChecklist && (
        <ul className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
          {PASSWORD_REQUIREMENTS.map((requirement) => {
            const met = requirement.test(value ?? "");
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
      )}
    </div>
  );
}
