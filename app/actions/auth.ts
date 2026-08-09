"use server";

import { headers } from "next/headers";
import * as z from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  RegistrationSchema,
  type RegistrationFormState,
} from "@/lib/validation/registration";

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
    return { message: "Non siamo riusciti a completare la registrazione. Riprova." };
  }

  return { message: "success" };
}
