import * as z from "zod";
import { passwordMeetsRequirements } from "@/lib/validation/password";

export const LoginSchema = z.object({
  email: z.email({ error: "Inserisci un indirizzo email valido." }).trim(),
  password: z.string().min(1, { error: "Inserisci la password." }),
});

export const RequestPasswordResetSchema = z.object({
  email: z.email({ error: "Inserisci un indirizzo email valido." }).trim(),
});

export const UpdatePasswordSchema = z
  .object({
    password: z.string().refine(passwordMeetsRequirements, {
      error:
        "La password deve avere almeno 10 caratteri e includere maiuscola, minuscola, numero e carattere speciale.",
    }),
    confirmPassword: z.string(),
  })
  .check((ctx) => {
    if (ctx.value.password !== ctx.value.confirmPassword) {
      ctx.issues.push({
        code: "custom",
        message: "Le password non coincidono.",
        path: ["confirmPassword"],
        input: ctx.value.confirmPassword,
      });
    }
  });

export type AuthFormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;
