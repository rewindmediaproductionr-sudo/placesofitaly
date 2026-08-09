import * as z from "zod";
import { regions } from "@/lib/regions";
import { passwordMeetsRequirements } from "@/lib/validation/password";

const regionSlugs = regions.map((region) => region.slug) as [string, ...string[]];

const baseFields = {
  fullName: z
    .string()
    .trim()
    .min(2, { error: "Inserisci nome e cognome." }),
  email: z.email({ error: "Inserisci un indirizzo email valido." }).trim(),
  password: z.string().refine(passwordMeetsRequirements, {
    error:
      "La password deve avere almeno 10 caratteri e includere maiuscola, minuscola, numero e carattere speciale.",
  }),
  confirmPassword: z.string(),
};

export const TravelerSchema = z.object({
  type: z.literal("viaggiatore"),
  ...baseFields,
});

export const PartnerSchema = z.object({
  type: z.literal("partner"),
  ...baseFields,
  regionSlug: z.enum(regionSlugs, {
    error: "Seleziona la regione di riferimento.",
  }),
  socialLink: z
    .url({ error: "Inserisci un link valido (es. https://instagram.com/...)." }),
});

export const RegistrationSchema = z
  .discriminatedUnion("type", [TravelerSchema, PartnerSchema])
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

export type RegistrationFormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;
