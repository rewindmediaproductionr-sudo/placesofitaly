"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import * as z from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  RegistrationSchema,
  type RegistrationFormState,
} from "@/lib/validation/registration";
import {
  LoginSchema,
  RequestPasswordResetSchema,
  UpdatePasswordSchema,
  type AuthFormState,
} from "@/lib/validation/auth";

async function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

export async function signup(
  _state: RegistrationFormState,
  formData: FormData
): Promise<RegistrationFormState> {
  const type = formData.get("type");

  const validatedFields = RegistrationSchema.safeParse(
    type === "partner"
      ? {
          type: "partner",
          fullName: formData.get("fullName"),
          email: formData.get("email"),
          password: formData.get("password"),
          confirmPassword: formData.get("confirmPassword"),
          regionSlug: formData.get("regionSlug"),
          socialLink: formData.get("socialLink"),
        }
      : {
          type: "viaggiatore",
          fullName: formData.get("fullName"),
          email: formData.get("email"),
          password: formData.get("password"),
          confirmPassword: formData.get("confirmPassword"),
        }
  );

  if (!validatedFields.success) {
    return { errors: z.flattenError(validatedFields.error).fieldErrors };
  }

  const data = validatedFields.data;
  const supabase = await createClient();
  const siteUrl = await getSiteUrl();

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/confirm`,
      data:
        data.type === "partner"
          ? {
              user_type: "partner",
              full_name: data.fullName,
              region_slug: data.regionSlug,
              social_link: data.socialLink,
            }
          : {
              user_type: "viaggiatore",
              full_name: data.fullName,
            },
    },
  });

  if (error) {
    if (error.code === "user_already_exists") {
      return {
        message: "Esiste già un account con questa email. Prova ad accedere.",
      };
    }
    console.error("[signup] supabase.auth.signUp failed:", error);
    return { message: "Non siamo riusciti a completare la registrazione. Riprova." };
  }

  return { message: "success" };
}

export async function login(
  _state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return { errors: z.flattenError(validatedFields.error).fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(validatedFields.data);

  if (error) {
    if (error.code === "email_not_confirmed") {
      return {
        message: "Conferma prima la tua email: controlla la casella di posta.",
      };
    }
    return { message: "Email o password non corrette." };
  }

  redirect("/");
}

export async function requestPasswordReset(
  _state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const validatedFields = RequestPasswordResetSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return { errors: z.flattenError(validatedFields.error).fieldErrors };
  }

  const supabase = await createClient();
  const siteUrl = await getSiteUrl();

  const { error } = await supabase.auth.resetPasswordForEmail(
    validatedFields.data.email,
    { redirectTo: `${siteUrl}/auth/confirm?type=recovery&next=/recupera-password/nuova` }
  );

  if (error) {
    console.error("[requestPasswordReset] supabase call failed:", error);
  }

  // Messaggio identico in caso di successo o errore, per non rivelare se
  // l'email è registrata.
  return { message: "success" };
}

export async function updatePassword(
  _state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const validatedFields = UpdatePasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return { errors: z.flattenError(validatedFields.error).fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      message: "Il link non è più valido. Richiedi un nuovo link di recupero.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: validatedFields.data.password,
  });

  if (error) {
    console.error("[updatePassword] supabase.auth.updateUser failed:", error);
    return { message: "Non siamo riusciti ad aggiornare la password. Riprova." };
  }

  redirect("/accedi?aggiornata=1");
}
